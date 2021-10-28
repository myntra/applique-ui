import { createHelper } from '../../src'

export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h } = createHelper(file, api)
  const oldImport1 = h.findImport('unity-uikit/Spinner')
  const oldImport2 = h.findImport('unity-uikit/Loaders/Spinner')
  const oldImport3 = h.findImport('unity-uikit/Loaders/Inline')

  function apply(oldImport) {
    if (oldImport.size()) {
      const name = h.getDefaultImportLocalName(h.first(oldImport))
      oldImport.remove()
      h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Loader')
      h.renameJSxTag(name, 'Loader')

      return h.toSource(nolint)
    }
  }
  if (apply(oldImport1) || apply(oldImport2) || apply(oldImport3))
    return h.toSource(nolint)
}
