import promised from '@znck/promised'
import Runner from 'jscodeshift/src/Runner'
import glob from 'globby'
import fs from 'fs'
import path from 'path'
import git from '../utils/git'
import chalk from 'chalk'
import { findTransformFiles } from '../utils/migrate/find-transforms'
import Service from '../service'

function createPlugin(api: Service) {
  api.registerCommand({
    name: 'migrate',
    options: {
      description: 'Run codemods for migrating to UIKit',
      usage: '<path>',
      options: {
        '--no-commit': 'do not commit changes',
        '-a, --apply': 'apply changes to code',
        '-o, --only <items>':
          'run only specified codemods (run `uikit codemods` to get list of options)',
        '-r, --recursive': 'run recursively',
        '-t, --theme-name <themeName>': 'UIKit theme used for app',
        '-l, --nolint': 'run without linting',
        '-p, --package-name <packageName>':
          'Package from which to migrate(Currently only used for icon package migration).',
      },
    },
    handler: async (
      { recursive, apply, only, commit, themeName, nolint, packageName },
      target: string
    ) => {
      const isFile = (await promised(fs).stat(target)).isFile()
      const dir = isFile ? path.dirname(target) : target
      const files = isFile
        ? [path.resolve(target)]
        : await glob([recursive ? '**/*.@(js|jsx)' : '*.@(js|jsx)'], {
            cwd: dir,
            gitignore: true,
            onlyFiles: true,
            unique: true,
            absolute: true,
            ignore: ['**/node_modules'],
          })
      const transforms = await findTransformFiles(only)
      const isDebug = process.env.UIKIT_CLI_MODE === 'debug'

      if (isDebug) {
        console.log('Files:\n  - ' + files.join('\n  - ') + '\n')
      }

      if (only && only.length) {
        console.log('Transforms: ' + chalk.yellow(only))
      }

      const repository = git(dir)

      if (apply && (await repository.isDirty())) {
        console.log(
          chalk.red('Commit all your changes.') +
            '\nCannot run ' +
            chalk.green('uikit migrate') +
            ' if git tree is dirty.'
        )
        process.exit(1)
      }

      const { error, ok } = await Runner.run(
        require.resolve('../utils/migrate/transform'),
        files.filter((it) => !/node_modules\//.test(it)),
        {
          only: Array.isArray(only)
            ? only.length
              ? only
              : ['*']
            : typeof only === 'string'
            ? only.split(',').map((part) => part.trim())
            : ['*'],
          transforms,
          extensions: 'js,jsx',
          dry: !apply,
          runInBand: !apply || isDebug,
          print: isDebug,
          verbose: isDebug ? 5 : 0,
          themeName,
          nolint,
          packageName,
        }
      )

      if (apply) {
        if (error === 0 && ok > 0) {
          if (commit) {
            await repository.commit(
              `chore: Automated code migration using 'uikit migrate'`,
              files
            )
          }
        }
      }
    },
  })
}

export default createPlugin
