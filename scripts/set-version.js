const { targets, getPackageDir } = require('./utils')
const { version } = require('../package.json')
const { resolve } = require('path')
const { readFileSync, writeFile } = require('fs-extra')
const prettier = require('prettier')

const depVersion = /-(alpha|beta)\./.test(version)
  ? version
  : version.replace(/\.[^.]+$/, '') + '.*'

const config = JSON.parse(readFileSync(resolve(__dirname, '../.prettierrc')))
/**
 * @param {string} source
 */
function format(source) {
  return prettier.format(source, { ...config, parser: 'json' })
}

const _targets = new Set(targets)
/**
 * @param {string} target
 */
function isLocalPackage(target) {
  return _targets.has(target)
}

/**
 * @param {string} target
 */
async function updateVersion(target) {
  const packageFile = resolve(getPackageDir(target), 'package.json')
  // Bail version change if it's a patch and no files have changed.

  const pkg = require(packageFile)

  pkg.version = version

  const depFields = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ]

  depFields.forEach((field) => {
    if (field in pkg) {
      Object.keys(pkg[field]).forEach((name) => {
        if (isLocalPackage(name)) {
          pkg[field][name] = depVersion
        }
      })
    }
  })

  await writeFile(packageFile, format(JSON.stringify(pkg)))
}

Promise.all(targets.map(updateVersion))
