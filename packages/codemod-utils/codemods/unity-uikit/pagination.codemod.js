import { createHelper } from '../../src'

/**
 * Replace 'unity-uikit/Pagination' with '@myntra/uikit'.
 *
 */
export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h } = createHelper(file, api)
  const oldImport = h.findImport('unity-uikit/Pagination')

  if (oldImport.size()) {
    const name = h.getDefaultImportLocalName(h.first(oldImport))

    oldImport.remove()
    h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Pagination', name)

    h.renameProps(name, {
      currentPage: 'page',
      sizePerPage: 'size',
      totalSize: 'total',
    })

    return h.toSource(nolint)
  }
}
