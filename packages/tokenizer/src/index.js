const yaml = require('./yaml')
const fs = require('fs')
const path = require('path')

module.exports = function(filename) {
  if (!fs.existsSync(filename)) {
    console.log('No tokens.yml file found.')
    process.exit(0)
  }

  const dir = path.dirname(filename)
  const data = yaml(fs.readFileSync(filename))
  const tokens = prepare(data)

  const formats = {
    js: require('./formats/commonjs'),
    // 'esm.js': require('./formats/esm'),
    scss: require('./formats/scss'),
    // css: require('./formats/css'),
    // 'module.css': require('./formats/cssModule'),
    // jsx: require('./formats/jsx')
  }

  Object.entries(formats).forEach(([ext, handler]) => {
    handler({ data, tokens }, (content) =>
      fs.writeFileSync(path.resolve(dir, 'tokens.' + ext), content)
    )
  })
}

function prepare(tokens) {
  const normalizedTokens = {}

  if (tokens.colors) {
    const colors = {}

    for (const id in tokens.colors) {
      const { value } = tokens.colors[id]
      if (value) {
        const [darker, dark, base, light, lighter, lightest] = value
        const text =
          base.substr(0, base.length - 1).replace('hsl', 'hsla') + ', 0.87)'

        const shades = { darker, dark, base, text, light, lighter, lightest }
        normalizedTokens[`colors-${id}`] = base

        for (const key in shades) {
          colors[`${id}-${key}`] = shades[key]
        }
      } else {
        colors[id] = tokens.colors[id]
      }
    }
    normalizedTokens.colors = colors
  }

  if (tokens['text-color']) {
    const textColors = {}

    for (const id in tokens['text-color']) {
      const { value } = tokens['text-color'][id]
      let [base, trivial, disabled] = value

      if (!disabled) {
        textColors[id] = { default: base, disabled: trivial }
      } else {
        textColors[id] = { default: base, disabled, 'mid-emphasis': trivial }
      }
    }

    normalizedTokens['text-colors'] = textColors
  }

  const fontFaces = {
    default: null,
  }

  if (tokens['font-family']) {
    for (const id in tokens['font-family']) {
      const { value } = tokens['font-family'][id]

      fontFaces[id] = value.map((value) =>
        / /.test(value) ? `'${value}'` : value
      )
    }
    normalizedTokens['font-faces'] = fontFaces
  }

  if (tokens.shadow) {
    const shadows = {}

    for (const id in tokens.shadow) {
      shadows[id] = tokens.shadow[id].value
    }

    normalizedTokens.shadows = shadows
  }

  if (tokens['text-style']) {
    const styles = {}
    for (const id in tokens['text-style']) {
      const { value } = tokens['text-style'][id]
      const style = {}

      if ('font-family' in value) {
        if (!fontFaces[value['font-family']])
          throw new Error(`Unknown font-family '${value['font-family']}'`)

        style['font-family'] = fontFaces[value['font-family']]
      }

      if ('font-size' in value) {
        style['font-size'] = value['font-size'] + 'px'
      }

      if ('font-weight' in value) {
        style['font-weight'] = value['font-weight']
      }

      if ('text-transform' in value) {
        style['text-transform'] = value['text-transform']
      }

      styles[id] = style
    }

    normalizedTokens['text-styles'] = styles
  }

  if (tokens.size) {
    normalizedTokens.sizes = {}

    for (const key in tokens.size) {
      normalizedTokens.sizes[key] = tokens.size[key] + 'px'
    }
  }

  if (tokens.radius) {
    normalizedTokens.radius = {}

    for (const key in tokens.radius) {
      normalizedTokens.radius[key] = tokens.radius[key] + 'px'
    }
  }

  if (tokens.grid) {
    normalizedTokens['vertical-grid-size'] = tokens.grid.value + 'px'
  }

  return normalizedTokens
}
