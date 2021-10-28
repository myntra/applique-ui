const fs = require('fs')
const path = require('path')
const docgen = require('@myntra/docgen')
const prettier = require('prettier')
const { componentsDir, components, pascalCase } = require('./utils')
const {
  getDeclaredTypes,
  getInferredTypes,
} = require('./bundle-types/extractor')

writeUIKitAsyncImports(components)
writeUIKitTypesForDocsEditor()

// Helpers.
function getComponentName(name) {
  return pascalCase(name)
}

function getComponentFileName(component) {
  return path.resolve(componentsDir, component, 'src', component + '.tsx')
}

function getPackageJSON(component) {
  return require(path.resolve(componentsDir, component, 'package.json'))
}

function writeUIKitTypesForDocsEditor() {
  fs.writeFileSync(
    path.resolve(__dirname, '../uikit.myntra.com/src/uikit.d.ts'),
    getInferredTypes() + getDeclaredTypes()
  )
}

function writeUIKitAsyncImports(components) {
  const META = []

  components.forEach((component, index) => {
    const file = getComponentFileName(component)
    try {
      const docs = docgen(file)

      META.push({
        name: getComponentName(component),
        since: docs.since,
        status: docs.status,
        path: '/components/' + components[index],
      })
    } catch (error) {
      console.error(`In ${component}: ${file}`)
      console.error(error)
    }
  })

  fs.writeFileSync(
    path.resolve(__dirname, '../packages/uikit/src/components.ts'),
    prettier.format(
      components
        .map((component, index) => {
          const pkg = getPackageJSON(component)

          return `export { default as  ${getComponentName(component)} ${
            pkg.exports ? ', ' + pkg.exports.join(', ') : ''
          } } from '@myntra/uikit-component-${component}'`
        })
        .join('\n'),
      {
        parser: 'babel',
        singleQuote: true,
        semi: false,
        trailingComma: 'es5',
      }
    )
  )

  fs.writeFileSync(
    path.resolve(__dirname, '../uikit.myntra.com/src/uikit.js'),
    prettier.format(
      `
      import { lazy } from 'react'
      function asyncComponent(factory) {
        const Component = lazy(factory)
        const cache = {}

        return new Proxy(Component, {
          get(target, name) {
            if (typeof name === 'string' && /^[A-Z]/.test(name)) {
              // const result = Component._result

              return (
                cache[name] ||
                (cache[name] = lazy(async () => {
                  const { default: Component } = await factory()

                  return { __esModule: true, default: Component[name] }
                }))
              )
            }

            return target[name]
          }
        })
      }
      ` +
        components
          .map(
            (component) =>
              `export const ${getComponentName(
                component
              )} = asyncComponent(() => import(/* webpackChunkName: 'components/${component}' */ '@myntra/uikit-component-${component}'))`
          )
          .join('\n') +
        '\n' +
        components
          .map((component) => [component, getPackageJSON(component).exports])
          .filter(([, namedExports]) => !!namedExports)
          .map(([component, namedExports]) =>
            namedExports
              .filter((name) => /^[A-Z]/.test(name))
              .map(
                (name) =>
                  `export const ${name} = asyncComponent(() => import('@myntra/uikit-component-${component}').then(m => ({ default: m.${name}, __esModule: true })))`
              )
              .join('\n')
          )
          .join('\n') +
        '\n' +
        `\nexport const META = ${JSON.stringify(META, null, 2)}`,
      {
        parser: 'babel',
        singleQuote: true,
        semi: false,
        trailingComma: 'es5',
        printWidth: 120,
      }
    )
  )
}
