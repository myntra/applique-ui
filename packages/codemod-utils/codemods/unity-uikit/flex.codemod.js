import { createHelper } from '../../src'

export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h, j } = createHelper(file, api)
  const oldImport = h.findImport('unity-uikit/Flex')

  if (oldImport.size()) {
    const name = h.getDefaultImportLocalName(h.first(oldImport))
    h.forAttributesOnComponent(name, undefined, (element, attribute, index) => {
      if (
        attribute.type === 'JSXAttribute' &&
        attribute.name.name === 'container'
      ) {
        element.node.attributes.splice(
          index,
          1,
          j.jsxAttribute(j.jsxIdentifier('type'), j.stringLiteral('stack'))
        )
      }
      if (
        attribute.type === 'JSXAttribute' &&
        attribute.name.name === 'around'
      ) {
        element.node.attributes.splice(
          index,
          1,
          j.jsxAttribute(
            j.jsxIdentifier('distribution'),
            j.stringLiteral('spaceAround')
          )
        )
      }
      if (
        attribute.type === 'JSXAttribute' &&
        attribute.name.name === 'between'
      ) {
        element.node.attributes.splice(
          index,
          1,
          j.jsxAttribute(
            j.jsxIdentifier('distribution'),
            j.stringLiteral('spaceBetween')
          )
        )
      }
      if (
        attribute.type === 'JSXAttribute' &&
        ['end', 'center', 'start'].includes(attribute.name.name)
      ) {
        element.node.attributes.splice(
          index,
          1,
          j.jsxAttribute(
            j.jsxIdentifier('distribution'),
            j.stringLiteral(attribute.name.name)
          )
        )
      }

      if (
        attribute.type === 'JSXAttribute' &&
        ['top', 'middle', 'bottom'].includes(attribute.name.name)
      ) {
        element.node.attributes.splice(
          index,
          1,
          j.jsxAttribute(
            j.jsxIdentifier('alignment'),
            j.stringLiteral(attribute.name.name)
          )
        )
      }
    })

    oldImport.remove()
    h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Layout')
    h.renameJSxTag(name, 'Layout')

    return h.toSource(nolint)
  }
}
