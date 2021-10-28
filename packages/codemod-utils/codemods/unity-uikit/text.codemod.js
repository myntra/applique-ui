import { createHelper } from '../../src'
import { JSXOpeningElement } from 'jscodeshift'

const mapTag = {
  heading1: 'Text.h1',
  heading2: 'Text.h2',
  heading3: 'Text.h3',
  heading4: 'Text.h4',
  title: 'Text.title',
  caption: 'Text.caption',
  paragraph: 'Text.p',
}
const components = []
export function migrateFromUnityUikit(file, api, { themeName, nolint }) {
  const { h, j } = createHelper(file, api)
  let oldImport = h.findImport('unity-uikit/Typography')
  if (!oldImport.size()) {
    oldImport = h.findImport('@myntra/uikit')
  }
  let name
  if (oldImport.size()) {
    try {
      name = h.getNamedImportLocalName(h.first(oldImport), 'Text')
      components.push(name)
      console.log(name)
      h.forAttributesOnComponent(
        name,
        undefined,
        (element, attribute, index) => {
          if (
            attribute.type === 'JSXAttribute' &&
            attribute.name.name === 'style'
          ) {
            // remove prop.
            element.node.attributes.splice(index, 1)
            element.node.name = j.jsxIdentifier(
              mapTag[attribute.value.value] || 'Text'
            )
            const node = element.parentPath.node
            node.closingElement = j.jsxClosingElement(node.openingElement.name)
          }
          if (
            attribute.type === 'JSXAttribute' &&
            (attribute.name.name === 'bolder' ||
              (attribute.name.name === 'weight' &&
                parseInt(attribute.value.expression.value) >= 6))
          ) {
            element.node.attributes.splice(
              index,
              1,
              j.jsxAttribute(
                j.jsxIdentifier('weight'),
                j.stringLiteral('bolder')
              )
            )
          }
        }
      )
    } catch (e) {
      console.log('no text component')
    }

    try {
      name = h.getNamedImportLocalName(h.first(oldImport), 'Heading')
      components.push(name)
      h.findComponentWhere(name, undefined)
        .find(JSXOpeningElement)
        .replaceWith((element) => {
          h.forAttributesOnComponent(
            name,
            undefined,
            (element, attribute, index) => {
              if (
                attribute.type === 'JSXAttribute' &&
                (attribute.name.name === 'bolder' ||
                  (attribute.name.name === 'weight' &&
                    parseInt(attribute.value.expression.value) >= 6))
              ) {
                element.node.attributes.splice(
                  index,
                  1,
                  j.jsxAttribute(
                    j.jsxIdentifier('weight'),
                    j.stringLiteral('bolder')
                  )
                )
              }
            }
          )
          element.node.name = j.jsxIdentifier('Text.h1')
          const node = element.parentPath.node
          node.closingElement = j.jsxClosingElement(node.openingElement.name)
          return element.node
        })
    } catch (e) {
      console.log('no heading component')
    }

    components.forEach((name) => {
      console.log(h.first(oldImport).value)
      if (h.first(oldImport).value.specifiers.length === 1) {
        oldImport.remove()
      } else {
        h.removeNamedImportLocalName(oldImport, name)
      }
    })

    h.addNamedImport(`@myntra/uikit-theme-${themeName}`, 'Text')
    return h.toSource(nolint)
  }
}
