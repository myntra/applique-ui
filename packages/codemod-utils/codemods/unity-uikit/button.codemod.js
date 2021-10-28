import { createHelper } from '../../src'

/**
 * Replace 'unity-uikit/Button' with '@myntra/uikit'.
 * Upgrade @myntra/uikit version
 * Transform props from unity-uikit to uikit supported.
 *
 * Renamed Props:
 *  - 'modifier' is now 'type'
 *
 * Unsupported Props:
 *  - 'block'
 *  - 'round'
 *  - 'large'
 *  - 'flat'
 *  - 'preview'
 */
export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h, j } = createHelper(file, api)
  let findFromUikit = false
  let oldImport = h.findImport('unity-uikit/Button')
  if (!oldImport.size()) {
    oldImport = h.findImport('@myntra/uikit')
    findFromUikit = true
  }
  if (oldImport.size()) {
    if (!findFromUikit) {
      const name = h.getDefaultImportLocalName(h.first(oldImport))

      oldImport.remove()
      h.renameProp(name, 'modifier', 'type')
      h.removeProps(name, ['block', 'round', 'large', 'flat', 'preview'])
    } else {
      const name = h.getNamedImportLocalName(h.first(oldImport), 'Button')
      console.log(h.findComponentWhere(name).find(j.JSXOpeningElement))
      h.findComponentWhere(name)
        .find(j.JSXOpeningElement)
        .replaceWith((element) => {
          if (
            !element.node.attributes.length ||
            !element.node.attributes.find(
              (attribute) => attribute.name.name === 'type'
            )
          ) {
            element.node.attributes.push(
              j.jsxAttribute(
                j.jsxIdentifier('type'),
                j.stringLiteral('primary')
              )
            )
          }
          return element.node
        })
      if (h.first(oldImport).value.specifiers.length === 1) {
        oldImport.remove()
      } else {
        h.removeNamedImportLocalName(oldImport, name)
      }
    }
    h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Button')
    return h.toSource(nolint)
  }
}
