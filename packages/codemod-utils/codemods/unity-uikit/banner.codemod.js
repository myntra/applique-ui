import { createHelper } from '../../src'

export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h, j } = createHelper(file, api)
  const oldImport = h.findImport('unity-uikit/Toast')

  if (oldImport.size()) {
    const name = h.getDefaultImportLocalName(h.first(oldImport))

    h.forAttributesOnComponent(name, undefined, (element, attribute, index) => {
      if (
        attribute.type === 'JSXAttribute' &&
        attribute.name.name === 'message'
      ) {
        // remove prop.
        element.node.attributes.splice(index, 1)

        // prepare child. should be a JSX expression container.
        const child =
          attribute.value.type === 'Literal'
            ? j.jsxExpressionContainer(attribute.value)
            : attribute.value

        // get element
        const node = element.parentPath.node
        node.children.push(child)

        // convert from self closing to normal tag.
        if (!node.closingElement)
          node.closingElement = j.jsxClosingElement(node.openingElement.name)

        node.openingElement.selfClosing = false
      }
    })

    oldImport.remove()
    h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Banner')
    h.renameJSxTag(name, 'Banner')

    return h.toSource(nolint)
  }
}
