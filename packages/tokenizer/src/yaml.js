const yaml = require('js-yaml')
const Ajv = require('ajv')

const ajv = new Ajv()
const validate = ajv.compile(require('./schema.json'))

module.exports = function parse(contents) {
  const tokens = yaml.load(contents)

  if (!validate(tokens)) {
    console.error(validate.errors)
    throw new Error('Tokens schema validation error')
  }

  return tokens
}
