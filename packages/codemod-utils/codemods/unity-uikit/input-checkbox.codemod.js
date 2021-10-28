import { createHelper } from '../../src'
/**
 * Replace 'unity-uikit/Input' when used with [type="number"] with '@myntra/uikit'.
 */
export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h } = createHelper(file, api)
  const checkbox1 = h.findImport('unity-uikit/Input')
  const checkbox2 = h.findImport('unity-uikit/Checkbox')
  const checkbox3 = h.findImport('unity-uikit/RawInput')

  function apply(oldImport) {
    if (oldImport.size()) {
      const name = h.getDefaultImportLocalName(h.first(oldImport))
      const checkboxInputs = h.findComponentWhereProp(name, 'type', 'checkbox')
      const allInputs = h.findComponentWhere(name)

      if (checkboxInputs.size()) {
        if (allInputs.size() === checkboxInputs.size()) oldImport.remove()

        h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Form')
        h.removeProp(name, 'type', checkboxInputs)
        h.renameProp(name, 'value', 'htmlValue', checkboxInputs)
        h.renameProp(name, 'checked', 'value', checkboxInputs)
        h.renameJSxTag(name, 'Form.Checkbox', checkboxInputs)

        return h.toSource(nolint)
      }
    }
  }

  function apply2(oldImport) {
    if (oldImport.size()) {
      const name = h.getDefaultImportLocalName(h.first(oldImport))
      oldImport.remove()
      h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Form')
      h.removeProp(name, 'type')
      h.renameProp(name, 'value', 'htmlValue')
      h.renameProp(name, 'checked', 'value')
      h.renameJSxTag(name, 'Form.Checkbox')

      return h.toSource(nolint)
    }
  }

  apply(checkbox1)
  apply2(checkbox2)
  apply(checkbox3)
}
