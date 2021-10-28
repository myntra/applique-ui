const prettier = require('prettier')

function toString(any) {
  if (Array.isArray(any)) {
    return `(${any.join(', ')})`
  }
  if (typeof any === 'object') {
    return `(${Object.entries(any)
      .map(([name, value]) => `'${name}': ${toString(value)}`)
      .join(',')})`
  }

  return any
}

module.exports = ({ tokens }, write) => {
  const payload = Object.entries(tokens)
    .map(([name, value]) => '$-tokens-' + name + ':' + toString(value) + ';')
    .join('\n')
  write(prettier.format(payload, { parser: 'scss' }))
}
