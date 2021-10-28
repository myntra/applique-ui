import { createHelper } from '../../src'

/**
 * Replace 'unity-uikit/DatePicker' with '@myntra/uikit'.
 *
 * Renamed Props:
 *  - 'minDate' is now 'min'
 *  - 'maxDate' is now 'max'
 *  - 'disabledDates' is now 'disabledRanges'
 *
 * Unsupported Props:
 *  - 'onOpen'
 *  - 'onClose'
 */
export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h } = createHelper(file, api)
  const oldImport = h.findImport('unity-uikit/DatePicker')

  if (oldImport.size()) {
    const name = h.getDefaultImportLocalName(h.first(oldImport))
    oldImport.remove()

    h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Form')
    h.renameProps(name, {
      minDate: 'min',
      maxDate: 'max',
      disabledDates: 'disabledRanges',
    })
    h.removeProps(name, ['onOpen', 'onClose'])
    h.renameJSxTag(name, 'Form.Date')

    return h.toSource(nolint)
  }
}
