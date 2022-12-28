const chalk = require('chalk')
const path = require('path')
const diff = require('diff')
const { highlight } = require('cli-highlight')
const { DEFAULT_EXTENSIONS } = require('@babel/core')

// Required to load code modes.
require('@babel/register')({
  babelrc: false,
  ignore: [
    function(filename) {
      return !/(codemod-utils\/src|\.codemod\.js)/.test(filename)
    },
  ],
  extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
  presets: [
    require('@babel/preset-typescript').default,
    require('@babel/preset-react').default,
  ],
  plugins: [
    require('@babel/plugin-proposal-class-properties').default,
    require('@babel/plugin-proposal-nullish-coalescing-operator').default,
    require('@babel/plugin-proposal-optional-chaining').default,
    require('@babel/plugin-transform-modules-commonjs').default,
    require('@babel/plugin-proposal-export-default-from').default,
  ],
})

module.exports = function transformWrapper(
  file,
  api,
  { transforms, only, onError, ...options }
) {
  let hasChange = false
  const original = file.source
  const messages = []
  for (const source of transforms) {
    const name = path.basename(source).replace('.codemod.js', '')
    const transform = require(source)
    for (const method in transform) {
      const codemod = name + '.' + method
      if (
        typeof transform[method] === 'function' &&
        (only.includes('*') || only.includes(name) || only.includes(codemod))
      ) {
        try {
          const result = transform[method](file, api, options)

          if (result) {
            hasChange = true
            if (typeof result !== 'string')
              throw new Error(
                'Transform `' + source + ':' + method + '` should return string'
              )

            if (options.dry || options.print)
              messages.push('\n> Apply :: ' + chalk.green(codemod))
            file.source = result
          }
        } catch (error) {
          hasChange = true
          console.log(
            chalk.red(
              'Error processing' + path.relative(process.cwd(), file.path)
            )
          )
          console.log(
            '   > ' +
              chalk.gray(codemod) +
              ' :: ' +
              chalk.gray(error.message.replace(/\r?\n/g, '      ')),
            options.print ? error : ''
          )
        }
      }
    }
  }

  if (hasChange) {
    messages.unshift('\n' + chalk.blue(file.path))
    if (options.dry || options.print) {
      console.log(messages.join('') + '\n')
      const filename = path.relative(process.cwd(), file.path)
      const { hunks } = diff.structuredPatch(
        filename,
        filename,
        original,
        file.source
      )
      const content =
        hunks
          .map(
            (hunk) =>
              `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@\n` +
              hunk.lines.join('\n')
          )
          .join('\n') + '\n\n'
      console.log(
        highlight(content, {
          language: 'patch',
        })
      )
    }
    return file.source
  }
}
