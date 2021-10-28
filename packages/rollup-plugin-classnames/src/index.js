const { createFilter } = require('rollup-pluginutils')

module.exports =
  /**
   * @returns {import('rollup').Plugin}
   */
  function ClassNames(
    options = {
      include: '*.module.scss',
    }
  ) {
    const shouldTransform = createFilter(options.include, options.exclude)

    return {
      name: 'classnames',
      transform(code, id) {
        if (!shouldTransform(id)) return

        const output = {
          code:
            `import { classnames as raw } from '@myntra/uikit-utils'\n` +
            `${code.replace('export default', 'const locals =')}\n` +
            `export default function classnames() {\n` +
            `  return raw.apply(null, arguments).use(locals)\n` +
            `}\n`,
          map: { mappings: '' },
        }

        return output
      },
    }
  }
