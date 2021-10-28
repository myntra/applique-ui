import { createHelper } from '../../src'

const Components = [
  'Accordion',
  'Avatar',
  'Badge',
  'Banner',
  'BreadCrumb',
  'Button',
  'ButtonGroup',
  'ClickAway',
  'Dropdown',
  'ErrorBoundary',
  'Fab',
  'Field',
  'Flex',
  'Form',
  'Grid',
  'Group',
  'Icon',
  'Image',
  'InputAzureFile',
  'InputCheckbox',
  'InputDate',
  'InputFile',
  'InputMasked',
  'InputMonth',
  'InputNumber',
  'InputRadio',
  'InputS3File',
  'InputSelect',
  'InputText',
  'InputTextArea',
  'JobTracker',
  'Layout',
  'List',
  'Loader',
  'Measure',
  'Modal',
  'NavBar',
  'Notification',
  'Page',
  'Pagination',
  'Portal',
  'Progress',
  'SchemaForm',
  'Section',
  'Stepper',
  'Table',
  'Tabs',
  'Text',
  'Tooltip',
  'TopBar',
  'VirtualGrid',
  'VirtualList',
]

/**
 * Replace string icon names with Icon component from @myntra/uikit-pro-icons package
 * Eg:
 * icon='bell' => icon={Bell}
 * icon='times-solid' => icon={TimesSolid}
 */

export function migrateFromUnityUikit(
  file,
  api,
  { themeName, nolint, packageName }
) {
  const { h, j } = createHelper(file, api)
  let newIconName = null
  let isChanged = false
  let oldImport = h.findImport(packageName)
  if (oldImport.size()) {
    try {
      Components.forEach((component) => {
        let name
        try {
          name = h.getNamedImportLocalName(h.first(oldImport), component)
        } catch (e) {}
        h.forAttributesOnComponentNotChild(
          name,
          undefined,
          (element, attribute, index) => {
            if (
              attribute.type === 'JSXAttribute' &&
              (attribute.name.name === 'icon' ||
                (component === 'Icon' && attribute.name.name === 'name')) &&
              attribute.value.value.split(' ').length <= 1
            ) {
              newIconName = capitalize(attribute.value.value)
              isChanged = true
              element.node.attributes.splice(
                index,
                1,
                j.jsxAttribute(
                  j.jsxIdentifier(component === 'Icon' ? 'name' : 'icon'),
                  j.jsxExpressionContainer(j.identifier(`${newIconName}`))
                )
              )
              h.addDefaultImport(
                `@myntra/uikit-pro-icons/svgs/${newIconName}`,
                newIconName
              )
            }
          }
        )
      })
    } catch (e) {}
    if (isChanged) {
      return h.toSource(nolint)
    }
  }
}

function capitalize(name) {
  return name.replace(/(^\w|(-)\w)/g, (m) => m.toUpperCase()).replace(/-/g, '')
}
