const prettier = require('prettier')
const { camelize } = require('../utils')

module.exports = ({ tokens, data }, write) =>
  write(
    prettier.format(
      'export default ' +
        JSON.stringify(camelize({ ...tokens, raw: data }), null, 2),
      {
        parser: 'babel',
        singleQuote: true,
        semi: false,
        tabWidth: 2,
      }
    )
  )
