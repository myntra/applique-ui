import { get } from '@myntra/uikit-utils'

function noop(value: any) {
  // do nothing
}

function yep() {
  return true
}

export default function compile(schema) {
  return new SchemaCompiler(schema).compile()
}

export type Schema = Record<string, any>
export type SchemaLike = undefined | Schema | boolean

export interface Creator {
  (value: any): Record<string, any> | void
}

export interface Validator {
  (value: any): boolean
}

export type CompiledSchema = Validator | Creator

export interface FieldPropertyGetter {
  (schema: Schema): Record<string, string | number>
}

function isValidator(fn: any, condition: boolean): fn is Validator[] {
  return condition
}
// >> Schema helper utilities.

const ANY_SCHEMA = {}
const NOT_ANY_SCHEMA = { not: {} }

export function normalizeSchema(schema: SchemaLike): Schema {
  if (schema === true) return ANY_SCHEMA
  else if (schema === false) return NOT_ANY_SCHEMA

  return schema || ANY_SCHEMA
}

function isSchema(schema: any) {
  return typeof schema === 'object' || typeof schema === 'boolean'
}

class SchemaCompiler {
  _schema: Schema
  _currentPath: string[]
  _isValidator: boolean

  constructor(schema: Schema) {
    this._schema = schema
    this._currentPath = []
    this._isValidator = false
  }

  get _currentPathRaw() {
    return (this._currentPath.length ? '#/' : '#') + this._currentPath.join('/')
  }

  get _currentGetter() {
    const keys = this._currentPath.slice()

    return (value) => get(value, keys)
  }

  compile(): Creator {
    const fn = this._compile(this._schema) as Creator

    return (value) => fn(value)
  }

  _compile(schema: SchemaLike): CompiledSchema {
    schema = normalizeSchema(schema)

    if (!schema) return noop

    const fns = []
    const keys = Object.keys(schema)

    for (const key of keys) {
      if (key in this) {
        this._currentPath.push(key)
        const fn = this[key](schema[key], schema)
        fns.push((value) => fn(value))
        this._currentPath.pop()
      }
    }

    return this._merge(fns)
  }

  _merge(fns: Array<CompiledSchema>) {
    if (isValidator(fns, this._isValidator)) return this._mergeValidator(fns)
    if (!fns.length) return noop

    return (value) => {
      const results = fns
        .map((fn) => fn(value))
        .filter((any) => any !== undefined)

      if (results.length) return Object.assign({}, ...results)
    }
  }

  _mergeValidator(fns: Validator[]): Validator {
    if (!fns.length) return yep

    return (value) => fns.every((fn) => !!fn(value))
  }

  _compileValidator(schema: SchemaLike): Validator {
    const prev = this._isValidator
    this._isValidator = true
    const fn = this._compile(schema) as Validator
    this._isValidator = prev

    return fn
  }

  _gen(creator?: Creator, validator?: Validator): CompiledSchema {
    return this._isValidator ? validator || yep : creator || noop
  }

  if(condition: SchemaLike, schema: Schema) {
    const if$ = this._compileValidator(condition)
    const then$ = this._compile(schema.then)
    const else$ = this._compile(schema.else)

    return (value) => (if$(value) ? then$(value) : else$(value))
  }

  const(const$: any): CompiledSchema {
    return this._gen(noop, (value) => value === const$)
  }

  title(title?: string): CompiledSchema {
    return this._gen(() => ({ title }))
  }

  description(description?: string): CompiledSchema {
    return this._gen(() => ({ description }))
  }

  default(defaultValue?: any): CompiledSchema {
    return this._gen(() => ({ defaultValue }))
  }

  pattern(pattern?: string): CompiledSchema {
    return this._gen(
      noop,
      (value) => typeof value !== 'string' || !!value.match(pattern)
    )
  }

  dependencies(dependencies: Schema): CompiledSchema {
    const dependencies$ = {}
    const names = Object.keys(dependencies)
    for (const name of names) {
      const dependency = dependencies[name]
      this._currentPath.push(name)

      if (Array.isArray(dependency)) {
        dependencies$[name] = (value) =>
          value[value] ? { required: dependency } : undefined
      } else if (isSchema(dependency)) {
        dependencies$[name] = this._compile(dependency)
      }
      this._currentPath.pop()
    }

    const isValidator = this._isValidator

    return (value) => {
      if (value !== null && typeof value === 'object') {
        const results = names
          .filter((name) => name in value)
          .map((name) => dependencies$[name](value))
          .filter((result) => typeof result === 'object')

        if (results.length && !isValidator) {
          return Object.assign({}, ...results)
        }

        return results.length && results.every(Boolean)
      }
    }
  }

  properties(properties: Schema): CompiledSchema {
    const fns = []

    for (const name in properties) {
      this._currentPath.push(name)
      const fn = this._compile(properties[name])
      fns.push(
        this._gen(
          // creator
          (value) => {
            if (value === null || typeof value !== 'object') return

            const result = fn(value[name]) as any

            if (result) {
              return { [name]: result }
            }
          },
          // validator
          (value) => value !== undefined && !!(fn(value[name]) as any)
        )
      )
      this._currentPath.pop()
    }

    const fn = this._merge(fns)

    return this._gen(
      (value) => {
        const properties = fn(value) as any

        if (properties) {
          return { properties }
        }
      },
      (value) => value !== undefined && !!(fn(value) as any)
    )
  }
}
