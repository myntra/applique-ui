function ClassNamesLoader(source) {
  return source
}

ClassNamesLoader.pitch = function(remainingRequest) {
  if (this.cacheable) this.cacheable()

  return `
const { classnames } = require('@myntra/uikit-utils');
const locals = require(${JSON.stringify('-!' + remainingRequest)});

function css() { return classnames.apply(null, arguments).use(locals); }

module.exports = { default: css }
module.exports.__esModule = true
`.trimLeft()
}

module.exports = ClassNamesLoader
