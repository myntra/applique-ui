const convert = require('./symbol')

/**
 * @typedef {import('./symbol').SymbolConverterOptions} SymbolConverterOptions
 */

/**
 * @typedef {Object} SpriteOptions
 * @property {string} prefix
 * @property {Partial<SymbolConverterOptions>} symbol
 * @property {Record<string, string | number>} attributes
 */

/**
 * Sprite Container/Creator
 *
 * @property {Record<string, string>} symbols
 * @property {SpriteOptions} options
 */
module.exports = class Sprite {
  /**
   *
   * @param {Partial<SpriteOptions>} options
   */
  constructor(options) {
    this.options = {
      prefix: '',
      attributes: {
        width: 0,
        height: 0,
        position: 'absolute',
        ...options.attributes,
      },
      symbol: {},
      ...options,
    }
    this.symbols = {}
  }

  get names() {
    return Object.keys(this.symbols)
  }

  /**
   * Add svg to sprite
   * @param {string} name
   * @param {string} content
   */
  add(name, content) {
    if (name in this.symbols) throw new Error(`Duplicate symbol: '${name}'`)

    this.symbols[name] = convert(content, {
      ...this.options.symbol,
      id: `${this.options.prefix}${name}`,
    })

    return this
  }

  /**
   * Remove svg from sprite
   * @param {string} name
   */
  remove(name) {
    delete this.symbols[name]

    return this
  }

  compile() {
    const names = Object.keys(this.symbols)
    names.sort()
    const icons = names.map((name) => this.symbols[name])

    return `<svg ${Object.entries(this.options.attributes)
      .map(({ 0: name, 1: value }) => `${name}=${JSON.stringify(value)}`)
      .join(' ')}>${icons.join('')}</svg>`
  }

  toString() {
    return this.compile()
  }
}
