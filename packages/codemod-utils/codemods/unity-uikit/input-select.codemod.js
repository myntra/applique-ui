import { createHelper } from '../../src'

/**
 * Replace 'unity-uikit/SelectBox' with '@myntra/uikit'.
 * Replace 'unity-uikit/Dropdown' with '@myntra/uikit'.
 *
 * Renamed Props:
 *  - 'filterOptions' is renamed to 'filterOptions' to better convey it's purpose.
 *  - 'multi' is renamed to 'multiple'
 *  - 'noResultsText' and 'emptyPlaceholder is renamed to 'noResultsPlaceholder' as it can be React node too.
 *  - 'onInputChange' is renamed to 'onSearch'.
 *
 * Unsupported Props:
 * - 'onBlur'
 * - 'onFocus'
 * - 'onOpen'
 * - 'onClose'
 * - 'maxOptions'
 * - 'align'
 */
export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h } = createHelper(file, api)
  const select1 = h.findImport('unity-uikit/SelectBox')
  const select2 = h.findImport('unity-uikit/SelectBox/Select')
  const select3 = h.findImport('unity-uikit/Dropdown')

  function apply(oldImport) {
    if (oldImport.size()) {
      const name = h.getDefaultImportLocalName(h.first(oldImport))
      oldImport.remove()

      h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Form')
      h.renameProps(name, {
        filterOption: 'filterOptions',
        multi: 'multiple',
        noResultsText: 'noResultsPlaceholder',
        onInputChange: 'onSearch',
        emptyPlaceholder: 'noResultsPlaceholder',
      })
      h.removeProps(name, [
        'onBlur',
        'onFocus',
        'onOpen',
        'onClose',
        'maxOptions',
        'align',
      ])
      h.renameJSxTag(name, 'Form.Select')

      return true
    }
  }

  if (apply(select1) || apply(select2) || apply(select3))
    return h.toSource(nolint)
}
