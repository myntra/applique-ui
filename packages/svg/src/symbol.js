const parser = require('svg-parser')

/**
 * @typedef {Object} Attribute
 * @property {string} name
 * @property {string | number} [value]
 */

/**
 * @typedef {Object} SymbolConverterHints
 * @property {{(name: string): boolean}} removeTag
*  @property {{(attribute: Attribute, tag: string): Attribute | null}} replaceAttribute
 */

/**
 * @typedef {Object} SymbolConverterOptions
 * @property {string} currentColor
 * @property {boolean} removeEmptyTags
 * @property {string[]} removeTags
 * @property {string[]} removeAttributes
 * @property {boolean} removeSketchAttributes
 * @property {boolean} removeNamespacedAttributes
 */

/**
 * @param {import('svg-parser').Node} node
 * @param {SymbolConverterOptions} options
 */
function genAttributes(node, options) {
  const code = []

  for (const name in node.attributes) {
    const attribute = options.replaceAttribute(
      { name, value: node.attributes[name] },
      node.name
    )

    if (attribute) {
      code.push(
        attribute.value
          ? `${attribute.name}=${JSON.stringify(attribute.value)}`
          : `${attribute.name}=""`
      )
    }
  }

  return code.join(' ')
}
/**
 *
 * @param {import('svg-parser').Node} node
 * @param {SymbolConverterHints} options
 */
function genElement(node, options) {
  if (options.removeTag(node.name)) return ''

  const tag = node.name === 'svg' ? 'symbol' : node.name

  return `<${tag} ${genAttributes(node, options)}>${node.children.reduce(
    (content, node) => content + genElement(node, options),
    ''
  )}</${tag}>`
}

/**
 * @type {Partial<SymbolConverterOptions>}
 */
const OPTIONS = {
  currentColor: '#000',
  removeEmptyTags: true,
  removeTags: ['title', 'desc'],
  removeSketchAttributes: true,
  removeNamespacedAttributes: true,
  removeAttributes: [],
}

/**
 * Convert SVG to Symbol
 * @param {string} source
 * @param {Partial<SymbolConverterOptions> & { id: string}} options
 */
module.exports = function convert(source, options) {
  const config = { ...OPTIONS, ...options }
  const ast = parser.parse(source)
  /** @type {SymbolConverterHints} */
  const hints = {
    removeTag(name) {
      return config.removeTags.includes(name)
    },
    replaceAttribute(attribute, tag) {
      if (
        config.removeNamespacedAttributes &&
        attribute.name.startsWith('xmlns')
      ) {
        return null
      }
      if (
        config.removeSketchAttributes &&
        attribute.name.startsWith('sketch')
      ) {
        return null
      }
      if (config.removeAttributes.includes(attribute.name)) {
        return null
      }
      if (
        (attribute.name === 'fill' || attribute.name === 'stroke') &&
        attribute.value === config.currentColor
      ) {
        return { name: attribute.name, value: 'currentColor' }
      }

      return attribute
    },
  }

  const code = genElement(ast, hints)

  return code.replace(/^<symbol/, `<symbol id="${config.id}"`).replace(/"\s+/g, '"')
}
