#!/usr/bin/env node

const semverSatisfies = require('semver/functions/satisfies')
const chalk = require('chalk')
const { engines, version } = require('../package.json')

if (!semverSatisfies(process.version, engines.node)) {
  console.log(
    chalk.red(
      `You are using Node ${process.version}, but uikit-cli ` +
        `requires Node ${engines.node}.\nPlease upgrade your Node version.`
    )
  )
  process.exit(1)
}

const program = require('commander')

program
  .version(version, '-v, --version')
  .description('UIKit for All. Build fast. Break things.')

const { loadCommands } = require('../dist')

loadCommands(process.cwd(), program)

program.parse(process.argv)
