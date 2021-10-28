import { createHelper } from '../../src'
import { JSXOpeningElement } from 'jscodeshift'

export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h, j } = createHelper(file, api)
  const oldImport = h.findImport('@myntra/uikit')
  let name
  try {
    name = h.getNamedImportLocalName(h.first(oldImport), 'RadioGroup')
    if (name) {
      h.findComponentWhere(name, undefined)
        .find(JSXOpeningElement)
        .replaceWith((element) => {
          element.node.name = j.jsxIdentifier('InputRadio')
          return element.node
        })

      if (h.first(oldImport).value.specifiers.length === 1) {
        oldImport.remove()
      } else {
        h.removeNamedImportLocalName(oldImport, name)
      }
      h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'InputRadio')
      return h.toSource(nolint)
    }
  } catch (e) {
    console.log(e)
    console.log('no RadioGroup component')
  }
}
