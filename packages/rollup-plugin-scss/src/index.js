const { createFilter } = require('rollup-pluginutils')
const sass = require('sass')
const postcss = require('postcss')
const modules = require('postcss-modules')
const cssnano = require('cssnano')
const path = require('path')

/**
 * @returns {import('rollup').Plugin}
 */
module.exports = function ScssPlugin(options = {}) {
  const isMatched = createFilter(options.include, options.exclude)
  const postcssOptions = options.postcss || {}
  const moduleOptions = options.modules || {}
  const modulesExported = {}
  const processor = postcss([
    modules({
      generateScopedName: '[name]_[local]__[hash:base64:5]',
      ...moduleOptions,
      getJSON(file, json, outPath) {
        modulesExported[file] = json
        if (typeof moduleOptions.getJSON === 'function') {
          return options.modules.getJSON(file, json, outPath)
        }
      },
    }),
    cssnano({ preset: 'default' }),
    ...(postcssOptions.plugins || []),
  ])

  delete postcssOptions.plugins
  delete options.include
  delete options.exclude
  delete options.postcss
  delete options.modules

  return {
    name: '@myntra/scss',
    resolveId(id, importer) {
      if (/\.s[ac]ss$/.test(importer)) {
        const ids = [
          id,
          `${id}.scss`,
          `${id}.sass`,
          path.join(id, `index.scss`),
          path.join(id, `index.sass`),
          path.join(id, `_index.scss`),
          path.join(id, `_index.sass`),
        ]

        for (const id of ids) {
          try {
            const ID = require.resolve(id, { paths: [importer] })

            console.log(ID)

            return ID
          } catch (e) {}
        }
      }
    },
    async transform(code, id) {
      if (!/\.scss$/i.test(id) || !isMatched(id)) return

      const { css } = await new Promise((resolve, reject) => {
        sass.render(
          {
            ...options,
            file: id,
            data: code,
            indentedSyntax: false,
            sourceMap: false,
            importer: [
              ...(options.importer || []),
              (id, importer, done) => {
                if (id.startsWith('.')) {
                  done({ file: id })

                  return
                }

                const fn = async () => {
                  try {
                    const result = await this.resolveId(id, importer)

                    done({ file: result })
                  } catch (error) {
                    done(error)
                  }
                }

                fn()
              },
            ],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
      })

      const result = await processor.process(css, {
        from: id,
        to: id,
        map: false,
      })
      const names = modulesExported[id]

      return {
        code: `
function styleInject(css) {
  if (!css || typeof document === 'undefined') return

  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.type = 'text/css'

  head.appendChild(style)

  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
}

styleInject(${JSON.stringify(result.css)})

import { classnames as raw } from '@myntra/uikit-utils'

const locals = ${JSON.stringify(names)}

export default function classnames() {
  return raw.apply(null, arguments).use(locals)
}
      `,
      }
    },
  }
}
