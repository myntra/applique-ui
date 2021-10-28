/* eslint-disable node/no-unpublished-require */

const fs = require('fs-extra')
const path = require('path')
const execa = require('execa')
const { targetsMap, fuzzyMatchTarget, getPackageDir } = require('./utils')

const args = require('minimist')(process.argv.slice(2))
const target = args._[0]

;(async () => {
  if (!target) {
    await buildAll(targetsMap)
  } else {
    await buildAll(fuzzyMatchTarget(target))
  }
})().catch(console.error)

function buildAllFromMap(names) {
  const promiseMap = {}
  const promiseDependencyMap = {}
  const packages = names.keys()
  for (const packageName of packages) {
    const packageData = names.get(packageName)
    promiseMap[packageName] = Promise.all([...(promiseDependencyMap[packageName] || [])]).then(() => build(packageName))
    for (const child of packageData.children.keys()) {
      promiseDependencyMap[child] = promiseDependencyMap[child] || []
      promiseDependencyMap[child].push(promiseMap[packageName])
    }
  }
  return Promise.all(Object.values(promiseMap))
}

async function buildAll(names) {
  if (!Array.isArray(names)) {
    await buildAllFromMap(names)
    return
  }
  for (const target of names) {
    await build(target)
  }
}

async function build(target) {
  const pkgDir = getPackageDir(target)
  const pkg = require(`${pkgDir}/package.json`)

  if (!(pkg.main && /^dist\//.test(pkg.main))) return // DOES NOT NEED BUILDING
  const force = process.env.FORCE || process.env.CI

  if (!force && (await fs.exists(path.resolve(pkgDir, 'dist')))) return // BAIL

  await fs.remove(`${pkgDir}/dist`)

  try {
    await execa(path.resolve(__dirname, '../node_modules/.bin/rollup'), ['-c', '--environment', `TARGET:${target}`], {
      stdio: 'inherit'
    })
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}
