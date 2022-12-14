import { createHelper } from '../../src'

export function migrateFromUikitApplique(file, api, { nolint }) {
  const { h, j, root } = createHelper(file, api)

  root
    .find(j.StringLiteral)
    .filter((decl) => decl.value.value.startsWith('@myntra/uikit'))
    .forEach((decl) => {
      decl.value.value = decl.value.value.replace('myntra', 'applique')
    })

  return h.toSource(nolint)
}
