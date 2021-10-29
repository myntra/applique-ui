const fs = require('fs')
const path = require('path')
const { TopologicalSort } = require('topological-sort')

const packagesDir = path.resolve(__dirname, '../packages')
const componentsDir = path.resolve(__dirname, '../components')
const themesDir = path.resolve(__dirname, '../themes')
const { version } = require('../package.json')

/**
 * Find directories names
 * @param {string} dir - target directory
 */
function findPackages(dir) {
  return fs
    .readdirSync(dir)
    .filter(
      (filename) =>
        fs.statSync(path.resolve(dir, filename)).isDirectory() &&
        filename !== '@myntra'
    )
}

const packages = findPackages(packagesDir)
const components = findPackages(componentsDir)
const themes = findPackages(themesDir)
const targets = sortedPackages([
  ...packages.map((pkg) => `@myntra/${pkg}`),
  ...components.map((component) => `@myntra/uikit-component-${component}`),
  ...themes.map((theme) => `@myntra/uikit-theme-${theme}`),
])
const targetsMap = sortedPackagesMap([
  ...packages.map((pkg) => `@myntra/${pkg}`),
  ...components.map((component) => `@myntra/uikit-component-${component}`),
  ...themes.map((theme) => `@myntra/uikit-theme-${theme}`),
])

function readPackage(name) {
  const pkgDir = getPackageDir(name)

  try {
    return require(`${pkgDir}/package.json`)
  } catch (error) {
    return {}
  }
}

/**
 * @param {string[]} targets
 * @returns {string[]}
 */
function sortedPackagesMap(targets) {
  const nodes = new Map(targets.map((name) => [name, name]))
  const op = new TopologicalSort(nodes)

  targets.forEach((target) => {
    const pkg = readPackage(target)

    Object.keys(pkg.dependencies || {})
      .filter((name) => name.startsWith('@myntra/'))
      .forEach((name) => op.addEdge(name, target))
  })

  return op.sort()
}

/**
 * @param {string[]} targets
 * @returns {string[]}
 */
function sortedPackages(targets) {
  const sorted = sortedPackagesMap(targets)

  return [...sorted.keys()]
}

/**
 * Convert to camelCase
 * @param {string} name
 */
function camelCase(name) {
  return name.replace(/[^a-zA-Z0-9]([a-z])/g, (_, char) => char.toUpperCase())
}

/**
 * Convert to kebab-case
 * @param {string} name
 */
function kebabCase(name) {
  return camelCase(name)
    .replace(/[A-Z]/g, (ch) => '-' + ch.toLowerCase())
    .replace(/^-|-$/g, '')
}

/**
 * Convert to PascalCase
 * @param {string} name
 */
function pascalCase(name) {
  name = camelCase(name)

  return name[0].toUpperCase() + name.substr(1)
}

/**
 * Find package names
 *
 * @param {string} query - fuzzy search query
 */
function fuzzyMatchTarget(query) {
  const matched = targets.filter((target) => target.match(query))

  if (matched.length) {
    return matched
  } else {
    throw new Error(`Target ${query} not found!`)
  }
}

/**
 * @param {string} name - full component name
 */
function isComponent(name) {
  return /@myntra\/uikit-component-/.test(getFullName(name))
}

/**
 * @param {string} name - full component name
 */
function isTheme(name) {
  return /@myntra\/uikit-theme-/.test(getFullName(name))
}

/**
 * @param {string} name
 */
function getFullName(name) {
  name = getShortName(name)
  if (packages.includes(name)) return `@myntra/${name}`
  if (components.includes(name)) return `@myntra/uikit-component-${name}`
  if (themes.includes(name)) return `@myntra/uikit-theme-${name}`

  throw new Error(`Unknown package '${name}'`)
}

/**
 * @param {string} name
 */
function getShortName(name) {
  return name.replace(/^@myntra\/(uikit-component-|uikit-theme-)?/, '')
}

/**
 * @param {string} name
 */
function getPackageDir(name) {
  const packageName = getFullName(name)
  const dir = getShortName(name)

  return path.resolve(
    isComponent(packageName)
      ? componentsDir
      : isTheme(packageName)
      ? themesDir
      : packagesDir,
    dir
  )
}

/**
 * @param {string} name
 */
function getPackageRepository(name) {
  const packageName = getFullName(name)
  const dir = getShortName(name)

  return `https://bitbucket.org/myntra/uikit/src/master/${
    isComponent(packageName)
      ? 'components'
      : isTheme(packageName)
      ? 'themes'
      : 'packages'
  }/${dir}`
}

function initSrc(name) {
  const shortName = getShortName(name)
  return [
    {
      name: `${shortName}.tsx`,
      initialContent: `
import React, { PureComponent } from 'react'
import classnames from './${shortName}.module.scss'

export interface Props extends BaseProps {
  /** @private */
  className?: string
}

/**
 * <Component description goes here>
 *
 * @since ${version}
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/${shortName}
 */
export default class ${pascalCase(
        shortName
      )} extends PureComponent<Props, State> {
  /**
   * Your code goes here
   */
}
      `,
    },
    {
      name: `${shortName}.spec.js`,
      initialContent: '',
    },
    {
      name: `${shortName}.module.scss`,
      initialContent: '',
    },
    {
      name: `index.ts`,
      initialContent: `
import ${pascalCase(shortName)} from './${shortName}'
export * from './${shortName}'
export default ${pascalCase(shortName)}
      `,
    },
  ]
}

module.exports = {
  componentsDir,
  packagesDir,
  themesDir,
  components,
  packages,
  themes,
  targets,
  targetsMap,
  fuzzyMatchTarget,
  isComponent,
  isTheme,
  getFullName,
  getShortName,
  getPackageDir,
  getPackageRepository,
  camelCase,
  kebabCase,
  pascalCase,
  initSrc,
}
