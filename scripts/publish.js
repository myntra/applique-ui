const { default: chalk } = require('chalk')
const { resolve } = require('path')
const { execSync } = require('child_process')
const { targets, getPackageDir } = require('./utils')
targets.forEach((target) => {
  try {
    const packageDir = getPackageDir(target)
    const { version } = require(resolve(packageDir, 'package.json'))
    const isAlpha = /alpha/.test(version)
    const isBeta = /beta/.test(version)
    const tag = isAlpha ? 'alpha' : isBeta ? 'beta' : 'latest'
    console.log(chalk.bold(`> Publishing ${chalk.green(target)}`))
    execSync(
      `npm publish --tag ${tag} --access public`,
      { cwd: packageDir, stdio: 'pipe' },
      true
    )
    console.log('  ' + chalk.green('Done.'))
  } catch (ex) {
    const output = ex.message

    if (output.includes('code E403')) {
      console.log(chalk.gray('  Already Published.'))
    } else {
      console.log(chalk.red('  Unknown Error: ') + output)
    }
  }
})
