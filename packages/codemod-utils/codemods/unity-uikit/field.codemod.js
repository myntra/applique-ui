import { createHelper } from '../../src'

/**
 * Replace 'unity-uikit/Label' with '@myntra/uikit'.
 * Transform props from unity-uikit to uikit supported.
 */
export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h } = createHelper(file, api)

  const oldImport = h.findImport('unity-uikit/Label')

  if (oldImport.size()) {
    const name = h.getDefaultImportLocalName(h.first(oldImport))

    oldImport.remove()
    h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Field', name)
    h.renameJSxTag(name, 'Field')
    return h.toSource(nolint)
  }
}
