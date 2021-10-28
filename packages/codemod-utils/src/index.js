import debug from 'debug'
import { CLIEngine } from 'eslint'

const engine = new CLIEngine(
  Object.assign(require('@myntra/eslint-config-standard'), {
    fix: true,
    useEslintrc: false,
  })
)

const d = debug('@myntra/codemod-utils')

export function createHelper(file, api) {
  const j = api.jscodeshift
  const root = j(file.source, {})
  const h = helpers(j, root, file)

  return { j, h, root }
}
/**
 * Make helpers.
 * @param {import('jscodeshift')} j
 * @param {import('jscodeshift').File} root
 * @param {string} file
 */
export default function helpers(j, root, file) {
  /**
   * Get first AST node from AST paths.
   *
   * @param {ASTNode[]} nodes
   * @returns {ASTNode}
   */
  function first(nodes) {
    if (!nodes || nodes.size() === 0) return

    d('first: ' + 0 + ' of ' + nodes.size())

    return nodes.paths()[0]
  }

  /**
   * Get first non-relative import statement.
   *
   * @returns {ASTNode}
   */
  function findLastNonRelativeImportStatement() {
    const result = root.find(
      j.Statement,
      (node) =>
        node.type === 'ImportDeclaration' && !node.source.value.startsWith('.')
    )

    if (result.size()) return result.paths()[result.size() - 1]
  }

  /**
   * Get first non `import` statement.
   *
   * @returns {ASTNode}
   */
  function findFirstNonImportStatement() {
    const result = root.find(
      j.Statement,
      (node) => node.type !== 'ImportDeclaration'
    )

    if (result.size()) return first(result)
  }

  /**
   * Get import statement for `source` path.
   *
   * @param {string} source
   * @returns {ASTNode}
   */
  function findImport(source, startsWith = null) {
    return root
      .find(j.ImportDeclaration)
      .filter(
        (decl) =>
          decl.value.source.value === source ||
          decl.value.source.value.startsWith(startsWith)
      )
  }

  /**
   * Insert ASTNode at the end of file.
   *
   * @param {ASTNode} node
   * @returns {void}
   */
  function insertAtEnd(node) {
    root
      .find(j.Program)
      .get()
      .value.body.push(node)
  }

  /**
   * Insert ASTNode after imports.
   *
   * @param {any} node
   * @returns {void}
   */
  function insertAfterImports(node) {
    const pos = findFirstNonImportStatement()

    if (pos) {
      j(pos).insertBefore(node)
    } else {
      insertAtEnd(node)
    }
  }

  /**
   * Insert ASTNode after package imports.
   *
   * @param {ASTNode} node
   */
  function insertAfterNonRelativeImports(node) {
    const pos = findLastNonRelativeImportStatement()

    if (pos) {
      j(pos).insertAfter(node)
    } else {
      insertAtEnd(node)
    }
  }

  /**
   * Generate import statement.
   *
   * @param {string} source
   * @param {string} name
   * @param {string} local
   * @param {boolean} [named=false]
   * @returns {void}
   */
  function addImport(source, name, local, named = false) {
    const existing = first(findImport(source))

    const globalCollisions = root
      .find(j.ImportDeclaration)
      .filter((n) => n.node.source.value !== source)
      .find(
        j.Identifier,
        (n) =>
          n.name === local &&
          n.type !== (named ? 'ImportSpecifier' : 'ImportDefaultSpecifier')
      )
      .paths()
      .filter(
        (n) =>
          j(n)
            .closestScope()
            .get().value.type === 'Program'
      )

    if (globalCollisions.length) {
      throw Error(local + ' is already defined in scope.')
    }

    if (!existing) {
      insertAfterNonRelativeImports(
        j.importDeclaration(
          [
            named
              ? j.importSpecifier(j.identifier(name), j.identifier(local))
              : j.importDefaultSpecifier(j.identifier(local)),
          ],
          j.literal(source)
        )
      )

      return // inserted. return early.
    }

    const specifier = named
      ? existing.value.specifiers.find(
          (s) => s.type === 'ImportSpecifier' && s.imported.name === local
        )
      : existing.value.specifiers.find(
          (s) => s.type === 'ImportDefaultSpecifier'
        )

    if (!specifier) {
      // import <default>, { name as local, ... } from source
      existing.value.specifiers.push(
        named
          ? j.importSpecifier(j.identifier(name), j.identifier(local || name))
          : j.importDefaultSpecifier(j.identifier(local || name))
      )
    } else if (specifier.local.name !== local) {
      insertAfterImports(
        j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier(name),
            j.identifier(specifier.local.name)
          ),
        ])
      )
    }
  }

  /**
   * Add named import.
   * e.g. import { name as local } from 'source'
   *
   * @param {string} source
   * @param {string} name
   * @param {string} [local]
   * @returns {void}
   */
  function addNamedImport(source, name, local) {
    addImport(source, name, local || name, true)
  }

  /**
   * Add default import.
   * e.g. import local from 'source'
   *
   * @param {string} source
   * @param {string} local
   * @return {void}
   */
  function addDefaultImport(source, local) {
    addImport(source, undefined, local, false)
  }

  /**
   * Find or create interop code ASTNode
   *
   * @param {string} localComponentName
   * @returns {ASTNode}
   */
  function getPropInteropNode(localComponentName) {
    const name = 'interopPropTransformer' + localComponentName + '$0'
    const result = root.find(
      j.VariableDeclaration,
      (node) => node.declarations[0].id.name === name
    )

    if (result.size()) return first(result).value

    addNamedImport('@myntra/uikit', 'interopPropTransformer')

    const interop = j.variableDeclaration('const', [
      j.variableDeclarator(
        j.identifier(name),
        j.callExpression(j.identifier('interopPropTransformer'), [
          j.objectExpression([]),
          j.objectExpression([]),
        ])
      ),
    ])

    insertAfterImports(interop)

    return interop
  }

  /**
   * Add interop prop name change.
   *
   * @param {ASTNode} node
   * @param {string} from
   * @param {string} to
   */
  function addPropInteropMapping(node, from, to) {
    const decl = node.declarations[0]
    const mapping = decl.init.arguments[0]

    const existing = mapping.properties.find((it) => it.key.name === from)

    if (!existing) {
      mapping.properties.push(
        j.objectProperty(j.identifier(from), j.literal(to))
      )
    }
  }

  /**
   * Add interop prop type cast.
   *
   * @param {ASTNode} node
   * @param {ASTNode} from
   * @param {function(any): any} fn Uses toString() to get source-code of method.
   */
  function addPropInteropCoercion(node, from, fn) {
    const decl = node.declarations[0]
    const coercions = decl.init.arguments[1]

    const existing = coercions.properties.find((it) => it.key.name === from)

    if (!existing) {
      const code = j('const foo = ' + fn.toString())
      const node =
        first(code.find(j.ArrowFunctionExpression)) ||
        first(code.find(j.FunctionExpression))

      if (node) {
        coercions.properties.push(
          j.objectProperty(j.identifier(from), node.value)
        )
      }
    }
  }

  /**
   * Find list of all components where condition is met.
   *
   * @param {string} localComponentName
   * @param {string} paths
   * @param {string} condition
   */
  function findComponentWhere(localComponentName, paths, condition) {
    const localPaths =
      paths ||
      root.find(j.JSXElement, {
        openingElement: {
          name: { type: 'JSXIdentifier', name: localComponentName },
        },
      })
    return localPaths.filter((element) =>
      condition ? condition(element) : true
    )
  }

  /**
   * Execute forEach on component attributes in JSx.
   *
   * @param {string} localComponentName
   * @param {string} propName
   * @param {string} propValue
   * @param {any} paths
   */
  function findComponentWhereProp(
    localComponentName,
    propName,
    propValue,
    paths
  ) {
    return findComponentWhere(localComponentName, paths, (element) => {
      return element.node.openingElement.attributes.some(
        (attribute) =>
          attribute.type === 'JSXAttribute' &&
          attribute.name.name === propName &&
          attribute.value.type === 'Literal' &&
          (Array.isArray(propValue) ? propValue : [propValue]).includes(
            attribute.value.value
          )
      )
    })
  }

  /**
   * Execute forEach on component attributes in JSx.
   *
   * @param {string} localComponentName
   * @param {object} paths
   * @param {function(ASTNode, number): void} fn
   */
  function forAttributesOnComponent(localComponentName, paths, fn) {
    return findComponentWhere(localComponentName, paths)
      .find(j.JSXOpeningElement)
      .replaceWith((element) => {
        element.node.attributes.forEach((attribute, index) => {
          fn(element, attribute, index)
        })
        return element.node
      })
  }

  /**
   * Execute forEach on component attributes in JSx for only parent component and not child.
   *
   * @param {string} localComponentName
   * @param {object} paths
   * @param {function(ASTNode, number): void} fn
   */
  function forAttributesOnComponentNotChild(localComponentName, paths, fn) {
    return findComponentWhere(localComponentName, paths)
      .find(j.JSXOpeningElement)
      .replaceWith((element) => {
        if (element.node.name.name === localComponentName) {
          element.node.attributes.forEach((attribute, index) => {
            fn(element, attribute, index)
          })
        }
        return element.node
      })
  }

  /**
   * Rename prop in component usage.
   *
   * @param {string} localComponentName Local identifier for component.
   * @param {string} oldPropName Prop name to remove.
   * @param {string} newPropName Prop name to add.
   * @param {Collection} paths JSCodeShift path collection
   */
  function renameProp(localComponentName, oldPropName, newPropName, paths) {
    d(`renameProp: <${localComponentName} -${oldPropName} +${newPropName} />`)
    forAttributesOnComponent(
      localComponentName,
      paths,
      (element, attribute, index) => {
        if (
          attribute.type === 'JSXAttribute' &&
          attribute.name.name === oldPropName
        ) {
          element.node.attributes.splice(
            index,
            1,
            j.jsxAttribute(j.jsxIdentifier(newPropName), attribute.value)
          )
        } else if (attribute.type === 'JSXSpreadAttribute') {
          const interop = getPropInteropNode(localComponentName)
          const name = interop.declarations[0].id.name

          if (
            !(
              attribute.argument.type === 'CallExpression' &&
              attribute.argument.callee.name === name
            )
          ) {
            attribute.argument = j.callExpression(j.identifier(name), [
              attribute.argument,
            ])
          }

          addPropInteropMapping(interop, oldPropName, newPropName)
        }
      }
    )
  }

  /**
   * Remove prop in component usage.
   *
   * @param {string} localComponentName
   * @param {string} prop
   */
  function removeProp(localComponentName, prop, paths) {
    d(`removeProp: <${localComponentName} -${prop} />`)
    forAttributesOnComponent(
      localComponentName,
      paths,
      (element, attribute, index) => {
        if (attribute.type === 'JSXAttribute' && attribute.name.name === prop) {
          element.node.attributes.splice(index, 1)
        }
      }
    )
  }

  /**
   * Rename tag in JSx
   *
   * @param {string} oldComponentName
   * @param {string} newComponentName
   * @param {any} paths
   */
  function renameJSxTag(oldComponentName, newComponentName, paths) {
    const elementPaths = findComponentWhere(oldComponentName, paths)

    elementPaths.find(j.JSXOpeningElement).replaceWith((element) => {
      if (element.node.name.name === oldComponentName) {
        element.node.name = j.jsxIdentifier(newComponentName)
      }

      return element.node
    })

    elementPaths.find(j.JSXClosingElement).replaceWith((element) => {
      if (element.node.name.name === oldComponentName) {
        element.node.name = j.jsxIdentifier(newComponentName)
      }

      return element.node
    })
  }

  /**
   * Type cast prop in component usage.
   *
   * @param {string} localComponentName
   * @param {string} prop
   * @param {function(any): any} fn
   */
  function coerceProp(localComponentName, prop, fn, paths) {
    forAttributesOnComponent(
      localComponentName,
      paths,
      (element, attribute, index) => {
        if (
          attribute.type === 'JSXSpreadAttribute' ||
          (attribute.type === 'JSXAttribute' && attribute.name.name === prop)
        ) {
          const interop = getPropInteropNode(localComponentName)
          const name = interop.declarations[0].id.name
          addPropInteropCoercion(interop, prop, fn)

          if (attribute.type === 'JSXAttribute') {
            attribute.value = j.jsxExpressionContainer(
              j.callExpression(
                j.memberExpression(
                  j.memberExpression(
                    j.identifier(name),
                    j.identifier('coercions')
                  ),
                  j.identifier(prop)
                ),
                [
                  attribute.value.type === 'JSXExpressionContainer'
                    ? attribute.value.expression
                    : attribute.value,
                ]
              )
            )
          } else if (
            !(
              attribute.argument.type === 'CallExpression' &&
              attribute.argument.callee.name === name
            )
          ) {
            attribute.argument = j.callExpression(j.identifier(name), [
              attribute.argument,
            ])
          }

          addPropInteropCoercion(interop, prop, fn)
        }

        return element.node
      }
    )
  }

  /**
   * Re
   *
   * @param {any} localComponentName
   * @param {any} propNames
   */
  function renameProps(localComponentName, propNames, paths) {
    Object.entries(propNames).forEach(([from, to]) =>
      renameProp(localComponentName, from, to, paths)
    )
  }

  function removeProps(localComponentName, props, paths) {
    props.forEach((prop) => removeProp(localComponentName, prop, paths))
  }

  function getDefaultImportLocalName(node) {
    const defaultSpecifier = node.value.specifiers.find(
      (specifier) => specifier.type === 'ImportDefaultSpecifier'
    )

    if (defaultSpecifier) return defaultSpecifier.local.name

    throw new Error('No default import found')
  }

  function hasImport(source) {
    return findImport(source).size() === 1
  }

  /**
   * Does named import exist in the file?
   *
   * @param {string} source Package name or import path
   * @param {string} name Exported identifier
   * @returns {boolean}
   */
  function hasNamedImport(source, name) {
    try {
      const node = first(findImport(source))

      if (node) return !!getNamedImportLocalName(node, name)
    } catch (e) {
      if (!/No named import found/.test(e.message)) {
        throw e
      }
    }

    return false
  }

  /**
   * Get local identifier for named export.
   *
   * @param {any} node  [ImportDeclaration] node
   * @param {string} name Exported identifier
   * @returns {string} Local identifier of the import
   */
  function getNamedImportLocalName(node, name) {
    const defaultSpecifier = node.value.specifiers.find(
      (specifier) =>
        specifier.type === 'ImportSpecifier' && specifier.imported.name === name
    )

    if (defaultSpecifier) return defaultSpecifier.local.name

    throw new Error('No named import found for ' + name)
  }

  /**
   * Remove named import
   *
   * @param {ASTNode[]} nodes
   * @param {string} name
   */
  function removeNamedImportLocalName(nodes, name) {
    nodes.forEach((namedImportNode) => {
      j(namedImportNode)
        // find ImportSpecifier here instead of Identifier
        .find(j.ImportSpecifier)
        .forEach((importSpecifier) => {
          if (importSpecifier.node.imported.name === name) {
            j(importSpecifier).remove()
          }
        })
    })
  }

  return {
    addDefaultImport,
    addNamedImport,
    coerceProp,
    findFirstNonImportStatement,
    findImport,
    findLastNonRelativeImportStatement,
    first,
    forAttributesOnComponent,
    forAttributesOnComponentNotChild,
    getDefaultImportLocalName,
    getNamedImportLocalName,
    hasImport,
    hasNamedImport,
    insertAfterImports,
    insertAfterNonRelativeImports,
    insertAtEnd,
    findComponentWhereProp,
    findComponentWhere,
    removeProp,
    removeProps,
    renameProp,
    renameProps,
    renameJSxTag,
    removeNamedImportLocalName,
    toSource: (nolint = false) => {
      if (nolint) {
        return root.toSource()
      }
      const { results } = engine.executeOnText(root.toSource())

      if (!results || !results.length || !results[0].output)
        throw Error('ESlint failed')

      return results[0].output
    },
  }
}

/**
 *
 * @export
 * @param {string} dir
 * @param {string[]} filename
 * @param {any} [options={}]
 */
export function testCodeMod(dir, filename, options = {}) {
  const path = require('path')
  const glob = require('glob')
  const fs = require('fs')
  const file = path.resolve(dir, filename)
  const inputDir = path.resolve(dir, '__codemod__/input')
  const outputDir = path.resolve(dir, '__codemod__/output')
  const codemods = require(file)

  // eslint-disable-next-line jest/valid-describe
  describe(filename.replace('.codemod.js', ''), () => {
    function read(f) {
      return fs.readFileSync(f, 'utf8').toString()
    }
    for (const name in codemods) {
      // eslint-disable-next-line jest/valid-describe
      describe('codemod => ' + name, () => {
        const fixtures = glob.sync(name + '*.js', { cwd: inputDir })

        fixtures.forEach((fixture) => {
          it('fixture :: ' + fixture, () => {
            const isNegative = fixture.includes('.fail.')
            const inputPath = path.resolve(inputDir, fixture)
            const outputPath = path.resolve(outputDir, fixture)

            const transform = codemods[name]
            let jscodeshift = require('jscodeshift/src/core')
            if (transform.parser) {
              jscodeshift = jscodeshift.withParser(transform.parser)
            }

            try {
              const output = transform(
                {
                  path: inputPath,
                  source: read(inputPath),
                },
                { jscodeshift, stats: () => {} },
                options || {}
              )
              if (isNegative) {
                expect(output).toBeFalsy()
              } else {
                expect(output).toBeTruthy()
                expect(output.trim()).toEqual(read(outputPath).trim())
              }
            } catch (e) {
              if (!isNegative) throw e
            }
          })
        })
      })
    }
  })
}
