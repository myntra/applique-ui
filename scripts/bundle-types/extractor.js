const fs = require('fs')
const Path = require('path')
const Glob = require('glob')
const TS = require('typescript')
const Prettier = require('prettier')
const getComponentTypeInfo = require('./processor')
const { componentsDir, components, pascalCase } = require('../utils')
const debug = require('./debug')

function getComponentName(name) {
  return pascalCase(name)
}

function getComponentSourceDir(component) {
  return Path.resolve(componentsDir, component, 'src')
}

function getComponentFileName(component) {
  return Path.resolve(componentsDir, component, 'src/index.ts')
}

function flat(array, depth = 1) {
  if (depth < 1) return array

  if (typeof Array.prototype.flat === 'function') return array.flat(depth)

  return array.reduce((result, item) =>
    Array.isArray(item)
      ? result.concat(flat(item, depth - 1))
      : (result.push(item), result)
  )
}

/**
 * Some statically declared types to enhance embedded IDE.
 */
function getDeclaredTypes() {
  const context = {
    fileName: 'types.d.ts',
    resolveId() {},
    extractTypes() {},
    typeSpace: { set() {} },
    isRoot: true,
    isComponent: false,
  }
  return (
    `\n// -----------[[Form]]----------//\n` +
    fs.readFileSync(Path.resolve(__dirname, './types/form.d.ts')).toString() +
    `\n// -----------[[UIKitGlobal]]----------//\n` +
    getComponentTypeInfo(
      null,
      fs
        .readFileSync(Path.resolve(__dirname, '../../@types/api.d.ts'))
        .toString(),
      context
    ) +
    `\n// -----------[[IconNames]]----------//\n` +
    getComponentTypeInfo(
      null,
      fs
        .readFileSync(
          Path.resolve(__dirname, '../../components/icon/src/names.d.ts')
        )
        .toString(),
      context
    ) +
    `\n// -----------[[React]]----------//\n` +
    fs
      .readFileSync(Path.resolve(__dirname, './types/react-browser.d.ts'))
      .toString() +
    `\n// -----------[[JSX]]----------//\n` +
    fs
      .readFileSync(Path.resolve(__dirname, './types/jsx-browser.d.ts'))
      .toString() +
    '\n'
  )
}

function getInferredTypes() {
  debug('find all typescript files...')
  const files = flat(
    components.map((component) =>
      Glob.sync(`${getComponentSourceDir(component)}/**/*.{ts,tsx}`)
    )
  )

  const program = TS.createProgram(files, {
    jsx: TS.JsxEmit.React,
    module: TS.ModuleKind.CommonJS,
    target: TS.ScriptTarget.Latest,
    emitDeclarationOnly: true,
  })

  const cache = {}

  function extractTypes(file) {
    if (!files.includes(file)) return ''
    if (file in cache) return cache[file]

    debug('extract types from:', file)
    let types = ''
    const typeFile = file.replace(/\.tsx?$/, '.d.ts')

    if (typeFile in extractTypes) return extractTypes[typeFile]

    program.emit(
      program.getSourceFile(file),
      (f, content) => {
        extractTypes[f] = content
        if (f === typeFile) {
          types += content
        }
      },
      undefined,
      true
    )

    cache[file] = types

    return types
  }

  let counter = 0
  const globalTypes = {}

  const typeSpace = {
    set(fileName, getTypes) {
      let name = typeSpace.get(fileName)

      if (!name) {
        name = `${pascalCase(
          Path.basename(fileName.replace(/\.tsx?$/, ''))
        )}$$${++counter}`

        globalTypes[fileName] = {
          name: name,
          code: getTypes(name),
        }
      }

      return name
    },
    get(fileName) {
      if (fileName in globalTypes) {
        return globalTypes[fileName].name
      }
    },
  }

  const code =
    components
      .map((component) =>
        inferComponentTypes(component, { files, extractTypes, typeSpace })
      )
      .join('\n\n') +
    '\n' +
    Object.values(globalTypes)
      .map(({ code }) => code)
      .join('\n\n')

  // return code
  return Prettier.format(code, {
    parser: 'typescript',
    singleQuote: true,
    semi: false,
    trailingComma: 'es5',
    printWidth: 120,
  })
}

function inferComponentTypes(component, { files, extractTypes, typeSpace }) {
  const fileName = getComponentFileName(component)
  const name = getComponentName(component)

  const code = extractTypes(fileName)

  return getComponentTypeInfo(name, code, {
    fileName,
    extractTypes,
    typeSpace,
    resolveId(imported, importer) {
      if (!imported.startsWith('.')) return null // TODO: Handle external imports.
      const id = Path.resolve(Path.dirname(importer), imported)

      if (files.includes(id + '.ts')) return id + '.ts'
      if (files.includes(id + '.tsx')) return id + '.tsx'
      if (files.includes(id + '/index.ts')) return id + '/index.ts'
      if (files.includes(id + '/index.tsx')) return id + '/index.tsx'

      return null
    },
  })
}

module.exports = {
  getDeclaredTypes,
  getInferredTypes,
}
