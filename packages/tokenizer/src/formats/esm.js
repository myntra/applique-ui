const prettier = require('prettier')
const { camelize } = require('../utils')

module.exports = (content, write) => {
  content = camelize(content)

  const exported = `{ ${Object.keys(content).join(', ')} }`

  const source =
    Object.keys(content)
      .map((name) => `const ${name} = ${JSON.stringify(content[name])}`)
      .join('\n') +
    '\nexport ' +
    exported +
    '\nexport default ' +
    exported +
    `\nimport ThemeProvider from './tokens.jsx'` +
    `\nexport { ThemeProvider }`

  write(
    prettier.format(source, {
      parser: 'babel',
      singleQuote: true,
      semi: false,
      tabWidth: 2
    })
  )
}
