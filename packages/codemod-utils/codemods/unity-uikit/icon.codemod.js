import { createHelper } from '../../src'

/**
 * Replace 'unity-uikit/Icon/<Element>' with '@myntra/uikit'.
 * Transform props from unity-uikit to uikit supported.
 *
 * New property
 * - name
 *
 *
 */
export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h, j } = createHelper(file, api)
  let findFromUikit = false
  let name
  let oldImport = h.findImport(null, 'unity-uikit/Icon')
  if (!oldImport.size()) {
    oldImport = h.findImport('@myntra/uikit')
    findFromUikit = true
  }
  if (oldImport.size()) {
    if (!findFromUikit) {
      name = h.getDefaultImportLocalName(h.first(oldImport))
      console.log('name: ', name)
      oldImport.remove()
      h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Icon')
      h.findComponentWhere(name, undefined)
        .find(j.JSXOpeningElement)
        .replaceWith((element) => {
          element.node.attributes.push(
            j.jsxAttribute(
              j.jsxIdentifier('name'),
              j.stringLiteral(name.toLowerCase())
            )
          )
          return element.node
        })
      h.renameJSxTag(name, 'Icon')
    } else {
      name = h.getNamedImportLocalName(h.first(oldImport), 'Icon')
      if (name) {
        h.removeNamedImportLocalName(oldImport, 'Icon')
        h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Icon')
      }
    }

    return h.toSource(nolint)
  }
}
