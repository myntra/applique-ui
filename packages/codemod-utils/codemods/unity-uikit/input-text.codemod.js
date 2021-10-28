import { createHelper } from '../../src'
/**
 * Replace 'unity-uikit/Input' when used with [type="text|email|password|tel|url"] with '@myntra/uikit'.
 */
export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h } = createHelper(file, api)
  const oldImport = h.findImport('unity-uikit/Input')

  if (oldImport.size()) {
    const name = h.getDefaultImportLocalName(h.first(oldImport))
    const types = ['text', 'email', 'password', 'tel', 'url']
    const textInputs = h.findComponentWhereProp(name, 'type', types)
    const allInputs = h.findComponentWhere(name)
    const onlyTextInputs = textInputs.filter((path) => {
      return path.node.openingElement.attributes.some(
        (attribute) =>
          attribute.type === 'JSXAttribute' &&
          attribute.name.name === 'type' &&
          attribute.value.type === 'Literal' &&
          attribute.value.value === 'text'
      )
    })

    if (textInputs.size()) {
      if (allInputs.size() === textInputs.size()) oldImport.remove()

      h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Form')
      h.removeProp(name, 'type', onlyTextInputs)
      h.renameJSxTag(name, 'Form.Text', textInputs)

      return h.toSource(nolint)
    }
  }
}
