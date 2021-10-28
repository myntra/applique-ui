import { createHelper } from '../src'

export function addNamedImport(file, api) {
  const { h } = createHelper(file, api)

  h.addNamedImport('foo', 'Foo')

  return h.toSource()
}

export function addDefaultImport(file, api) {
  const { h } = createHelper(file, api)

  h.addDefaultImport('foo', 'Foo')

  return h.toSource()
}

export function renameProp(file, api) {
  const { h } = createHelper(file, api)

  h.renameProp('Foo', 'foo', 'bar')

  return h.toSource()
}

export function convertProp(file, api) {
  const { h } = createHelper(file, api)

  h.coerceProp('Foo', 'foo', (value) => Boolean(value))

  return h.toSource()
}

export function findComponentWhereProp(file, api) {
  const { h } = createHelper(file, api)

  const oldImport = h.findImport('unity-uikit/Input')
  const name = h.getDefaultImportLocalName(h.first(oldImport))
  const paths = h.findComponentWhereProp(name, 'type', 'number')

  h.removeProp(name, 'type', paths)

  return h.toSource()
}

export function renameTag(file, api) {
  const { h } = createHelper(file, api)

  h.renameJSxTag('Foo', 'Bar')

  return h.toSource()
}
