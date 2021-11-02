const { getOptions } = require('loader-utils')

module.exports = function PostMDXHelperLoader(content) {
  const options = getOptions(this) || {}
  const components = stringify({
    code: 'Code',
    pre: `'div'`,
    ...options.components,
  })

  return content.replace(
    'const { components, ...props } = this.props',
    `let { components, ...props } = this.props\n    components = Object.assign({}, ${components}, components)`
  )
}

function stringify(obj) {
  return `{${Object.keys(obj)
    .map((key) => `'${key}': ${obj[key]}`)
    .join(',')}}`
}
