// @ts-check
const { pascalCase, getShortName } = require('../utils')
const TS = require('typescript')
const debug = require('./debug')

/**
 * @typedef ProcessorContext
 * @property {boolean} [isRoot]
 * @property {boolean} [isComponent]
 * @property {string} fileName
 * @property {{(imported: string, importer: string) => string | null}} resolveId
 * @property {{(fileName: string) => string}} extractTypes
 * @property {{ set(fileName: string, getTypes: (name: string) => string): string, get(fileName:string): string }} typeSpace
 */

/**
 * @param {string} name - Local component name to create export.
 * @param {string} code - Raw type definition source code.
 * @param {ProcessorContext} options
 * @returns {string}
 */
function getTypeInfo(name, code, context) {
  let { fileName } = context
  // Unwrap
  if (fileName.endsWith('/index.ts')) {
    return unWrapIndexModule(name, code, context)
  }

  const ast = parse(code)
  // Extract interface and type statements as it is.
  let comment = '/**\n *\n */'

  let components = {}
  if (context.isComponent) {
    const componentNode = findComponentNode(ast)
    if (componentNode) {
      components = findSubComponents(componentNode)

      if (componentNode.jsDoc) {
        comment = componentNode.jsDoc[0].getFullText()
      }
    }
  }

  // Process
  const { suffixTypes, prefixTypes } = resolveImports(ast, context, components)
  const types =
    stripUnnecessaryKeywords(
      prefixTypes + stripUnnecessaryStatements(ast) + suffixTypes
    ) + '\n'

  return name
    ? context.isComponent
      ? `
    // -----------[[${name}]]--------------- //
    ${comment}
    ${
      context.isRoot !== false ? 'declare' : ''
    } function ${name}(props: ${name}.Props): JSX.Element;
    ${context.isRoot !== false ? 'declare' : ''} namespace ${name} {
      ${types}
    }
  `
      : `
    declare namespace ${name} {
      ${types}
    }
  `
    : types
}

/**
 * @param {string} code
 */
function stripUnnecessaryKeywords(code) {
  return code
    .replace(/\/\/\/[^\n]*/g, '')
    .replace(/\bexport /g, '')
    .replace(/\bdeclare type /g, 'type ')
}

/**
 * @param {import('typescript').SourceFile} ast
 */
function stripUnnecessaryStatements(ast) {
  return ast.statements
    .filter(
      (statement) =>
        TS.isInterfaceDeclaration(statement) ||
        TS.isTypeAliasDeclaration(statement)
    )
    .map((statement) => statement.getFullText())
    .join('\n')
}

/**
 *
 * @param {import('typescript').SourceFile} ast
 * @param {ProcessorContext} context
 * @param {Record<string, string>} components
 */
function resolveImports(ast, context, components) {
  let suffixTypes = ''
  let prefixTypes = ''
  const { fileName } = context

  ast.statements.forEach((statement) => {
    if (TS.isImportDeclaration(statement)) {
      const importId = getImportId(statement.moduleSpecifier.getText())
      const importPath = context.resolveId(importId, fileName)
      let typesImportedAs = null
      // Relative Imports: could be a local component file (.tsx) or type file (.ts)
      if (importId.startsWith('.')) {
        if (statement.importClause) {
          if (context.isComponent && statement.importClause.name) {
            // Default import is more likely to be component.
            const importName = statement.importClause.name.getText().trim()
            if (importName in components) {
              const name = components[importName]
              const code = context.extractTypes(importPath)
              typesImportedAs = name
              suffixTypes += getTypeInfo(name, code, {
                ...context,
                isRoot: false,
                isComponent: true,
                fileName: importPath,
              })
            }
          }
        }
        const namedImports = {}
        if (
          statement.importClause &&
          statement.importClause.namedBindings &&
          importPath
        ) {
          const { namedBindings } = statement.importClause
          if (TS.isNamedImports(namedBindings)) {
            namedBindings.elements.forEach((element) => {
              namedImports[element.name.text] = element.propertyName
                ? element.propertyName.text
                : element.name.text
            })
          }
          if (!typesImportedAs) {
            typesImportedAs = context.typeSpace.set(importPath, (name) =>
              getTypeInfo(name, context.extractTypes(importPath), {
                ...context,
                isComponent: false,
                isRoot: false,
                fileName: importPath,
              })
            )
          }
        }
        Object.entries(namedImports).forEach(([key, value]) => {
          prefixTypes += `\ntype ${key} = ${typesImportedAs}.${value};\n`
        })
      }
      // Imports from other components
      else if (importId.startsWith('@myntra/uikit-component-')) {
        if (statement.importClause && statement.importClause.namedBindings) {
          const shortName = getShortName(importId)
          const componentName = pascalCase(shortName)
          if (TS.isNamedImports(statement.importClause.namedBindings)) {
            statement.importClause.namedBindings.elements.forEach((element) => {
              const name = element.propertyName
                ? element.propertyName.getText()
                : element.name.getText()
              const localName = element.name.getText()
              prefixTypes += `\ntype ${localName} = ${componentName}.${name}`
            })
          }
        }
      }
    }
  })
  return { suffixTypes, prefixTypes }
}

/**
 *
 * @param {string} name
 * @param {string} code
 * @param {ProcessorContext} context
 */
function unWrapIndexModule(name, code, context) {
  debug(`Unwrapping ${context.fileName}`)
  const ast = parse(code)
  const main = ast.statements.find((statement) =>
    TS.isExportAssignment(statement)
  )

  const { prefixTypes, suffixTypes } = resolveImports(ast, context, {})

  code = prefixTypes + stripUnnecessaryStatements(ast) + suffixTypes

  if (name) {
    code = `declare namespace ${name} {\n${code}\n}\n`
  }

  if (TS.isExportAssignment(main)) {
    const { expression } = main

    if (TS.isIdentifier(expression)) {
      const name = expression.getText()
      const component = ast.statements.find(
        (statement) =>
          TS.isImportDeclaration(statement) &&
          statement.importClause &&
          statement.importClause.name.getText() === name
      )

      if (TS.isImportDeclaration(component)) {
        const fileName = context.resolveId(
          getImportId(component.moduleSpecifier.getText()),
          context.fileName
        )
        debug(`Inlining ${fileName}`)
        const source = context.extractTypes(fileName)
        if (source) {
          try {
            code += getTypeInfo(name, source, {
              ...context,
              fileName,
              isComponent: fileName.endsWith('.tsx'),
            })
          } catch (error) {
            console.log({ name, fileName, source })

            console.error(error)
          }
        }
      }
    }
  }

  code = stripUnnecessaryKeywords(code)

  return code
}

function findSubComponents(componentNode) {
  const subComponents = {}
  if (componentNode && TS.isClassDeclaration(componentNode)) {
    componentNode.members
      .filter(
        (member) =>
          TS.isPropertyDeclaration(member) &&
          member.modifiers &&
          member.modifiers.some(
            (modifier) => modifier.kind === TS.SyntaxKind.StaticKeyword
          )
      )
      .forEach((property) => {
        const name = property.name.getText().trim()
        if (/^[A-Z]/.test(name) && property.type)
          subComponents[
            property.type
              .getText()
              .replace(/typeof\s/, '')
              .trim()
          ] = name
      })
  }
  return subComponents
}

function findComponentNode(ast) {
  return ast.statements.find(
    (statement) =>
      (TS.isFunctionDeclaration(statement) ||
        TS.isClassDeclaration(statement)) &&
      (statement.modifiers.length === 2 &&
        statement.modifiers[0].kind === TS.SyntaxKind.ExportKeyword &&
        statement.modifiers[1].kind === TS.SyntaxKind.DefaultKeyword)
  )
}

function parse(code) {
  /** @type {import('typescript').CompilerHost} */
  const compilerHost = {
    fileExists: () => true,
    getCanonicalFileName: (filename) => filename,
    getCurrentDirectory: () => '',
    getDefaultLibFileName: () => 'lib.d.ts',
    getNewLine: () => '\n',
    getSourceFile: (filename) => {
      return TS.createSourceFile(filename, code, TS.ScriptTarget.Latest, true)
    },
    readFile: () => null,
    useCaseSensitiveFileNames: () => true,
    writeFile: () => null,
  }
  const program = TS.createProgram(
    ['types.d.ts'],
    { noResolve: true },
    compilerHost
  )
  const ast = program.getSourceFile('types.d.ts')
  return ast
}

/**
 * @param {string} quotedId
 */
function getImportId(quotedId) {
  return quotedId.replace(/^['"`]|["'`]$/g, '')
}

module.exports = getTypeInfo
