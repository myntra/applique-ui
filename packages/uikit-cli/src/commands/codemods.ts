import { wrapCommand } from '../utils'
import chalk from 'chalk'
import jsdoc from 'jsdoc-api'
import { findTransforms } from '../utils/migrate/find-transforms'
import Service from '../service'

async function docs(files) {
  return (await jsdoc.explain({ files }))
    .filter(
      (it) => it.kind === 'function' && it.scope === 'global' && it.description
    )
    .reduce((acc, fn) => {
      acc[fn.name] = fn.description

      return acc
    }, Object.create(null))
}

function createPlugin(api: Service) {
  api.registerCommand({
    name: 'codemods',
    options: {
      description: 'List all available codemods for migrating to UIKit',
    },
    handler: async () => {
      const transforms = await findTransforms()
      if (Object.keys(transforms).length === 0) {
        console.log(chalk.red('No codemods found'))

        return
      }

      console.log(chalk.green('List of available transforms:\n'))

      for (const name in transforms) {
        console.log(chalk.yellow(name))

        const meta = await docs(transforms[name].__filename)
        for (const transform in transforms[name]) {
          if (transform.startsWith('__')) continue

          console.log(
            '  - ' +
              transform +
              ' (key: ' +
              chalk.green(name + '.' + transform) +
              ')'
          )

          if (transform in meta) {
            console.log(
              '\n      ' +
                chalk.gray(meta[transform].replace(/\r?\n/g, '\n      ')) +
                '\n'
            )
          }
        }
      }
    },
  })
}

export default createPlugin
