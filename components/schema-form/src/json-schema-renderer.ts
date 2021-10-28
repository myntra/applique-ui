import { ComponentType } from 'react'
import compile, { Schema, normalizeSchema } from './json-schema-compiler'

const schemaToUI = new WeakMap() // TODO: Maybe use JSON keys.

export interface UIField {
  type: 'field' | 'array' | 'object'
  name: string
  component: ComponentType | null
  props: Record<string, any>
  layout: Record<string, any>
  getDerivedPropsFromValue?(value: any): any
}

export interface UIArrayField extends UIField {
  type: 'array'
  factory(index: number): UI
}
export interface UIObjectField extends UIField {
  type: 'object'
  properties: UI[]
}

export type UI = UIField | UIArrayField | UIObjectField

export interface SchemaRendererOptions {
  resolveComponent(name: string): ComponentType
  resolveOptions(format: string, schema: any): Array<any> | void // TODO: Accept promise.
}

interface PropPostProcessor {
  (value: any, schema: Schema): Record<string, any>
}

interface GeneratorContext {
  compile: typeof compile
  resolveComponent(...name: string[]): ComponentType | null
  resolveOptions(format: string, schema: any): Array<any> | void // TODO: Accept promise.
  generate(schema: Schema, options?: Record<string, any>): UI
  resolveProps(
    schema: Schema,
    processors: Record<string, PropPostProcessor>
  ): {
    props: Record<string, any>
    layout: Record<string, any>
  }
}

export function createRenderFactory(
  schema: Schema,
  options: SchemaRendererOptions
) {
  const name = '$root'
  const context = {
    ...options,
    generate,
    compile,
    resolveComponent,
    resolveOptions,
    resolveProps,
  }

  function generate(schema: Schema, config?: Record<string, any>) {
    return generateAnyField(schema, config || {}, context)
  }

  function resolveComponent(...names) {
    for (const name of names) {
      if (name) {
        const component = options.resolveComponent(name)

        if (component) return component
      }
    }

    return null
  }

  function resolveOptions(format: string, schema: any) {
    if (options.resolveOptions) return options.resolveOptions(format, schema)
  }

  const ui = generate(schema, { name })

  return ui
}

const defaultProcessors: Record<string, PropPostProcessor> = {
  title: (label) => ({ label }),
  description: (description) => ({ description }),
  default: (defaultValue) => ({ defaultValue }),
}
function resolveProps(
  schema: Schema,
  processors: Record<string, PropPostProcessor> = {}
) {
  const layout = schema.layout || {}

  const props = Object.assign(
    {},
    ...Object.keys(schema).map((key) => {
      if (key in processors) return processors[key](schema[key], schema)
      if (key in defaultProcessors)
        return defaultProcessors[key](schema[key], schema)
    }),
    schema.props
  )

  return { props, layout }
}

// Any
const generators = {
  object: generateObjectField,
  array: generateArrayField,
  string: generateStringField,
  number: generateNumberField,
  integer: generateNumberField,
  boolean: generateBooleanField,
  enum: generateEnumField,
  const: generateConstField,
}

function generateAnyField(
  schema: Schema,
  options: Record<string, any>,
  context: GeneratorContext
) {
  schema = normalizeSchema(schema)

  if (schemaToUI.has(schema)) return schemaToUI.get(schema)

  const generator =
    'type' in schema
      ? generators[schema.type]
      : 'enum' in schema
      ? generators.enum
      : 'const' in schema
      ? generators.const
      : () => null
  const ui = generator(schema, options, context)

  schemaToUI.set(schema, ui)

  return ui
}

// Object
const objectProcessors: Record<string, PropPostProcessor> = {
  required: (names) => (Array.isArray(names) ? { required: names } : {}),
}

function generateObjectField(
  schema: Schema,
  { name }: Record<string, any>,
  { generate, resolveComponent, resolveProps, compile }: GeneratorContext
): UI {
  const fields = Object.entries(schema.properties)

  const { props, layout } = resolveProps(schema, objectProcessors)
  const getDerivedPropsFromValue = compile(schema)
  const children = fields.map(([name, subSchema]) =>
    generate(subSchema, { name })
  )

  if (
    Array.isArray(schema.required) &&
    schema.required.length > 0 &&
    typeof schema.required[0] === 'string'
  ) {
    children.forEach((child) => {
      if (schema.required.includes(child.name)) {
        child.props.required = true
      }
    })
  }

  const component = resolveComponent(schema.component)

  return {
    type: 'object',
    name,
    component,
    props,
    layout,
    properties: children,
    getDerivedPropsFromValue,
  }
}

// Array
const arrayProcessors: Record<string, PropPostProcessor> = {
  maxItems: (max) => (Number.isSafeInteger(max) ? { max } : {}),
  mimItems: (max) => (Number.isSafeInteger(max) ? { max } : {}),
}
function generateArrayField(
  schema: Schema,
  { name }: Record<string, any>,
  {
    generate,
    resolveComponent,
    resolveOptions,
    resolveProps,
    compile,
  }: GeneratorContext
) {
  const { props, layout } = resolveProps(schema, arrayProcessors)
  const getDerivedProps = compile(schema)
  const isSelect =
    schema.items.type === 'string' &&
    typeof schema.items.format === 'string' &&
    !!schema.items.format.trim() &&
    !/^(email|url|file|tel|password|search|text)$/.test(
      schema.items.format.trim()
    )

  if (isSelect) props.multiple = true
  else props.type = schema.items && schema.items.format

  const getDerivedPropsFromValue = isSelect
    ? (value) => ({
        ...getDerivedProps(value),
        options: resolveOptions(schema.items.format, schema.items),
      })
    : getDerivedProps

  const items = generate(schema.items, { name })
  const component = isSelect
    ? resolveComponent(schema.items.component, props.component, 'Form.Select')
    : resolveComponent(schema.component, props.component)

  function factory(index: number) {
    return items
  }

  return {
    type: isSelect ? 'field' : 'array',
    name,
    component,
    props,
    layout,
    factory,
    getDerivedPropsFromValue,
  }
}

const formatComponents = {
  date: 'Form.Date',
  month: 'Form.Month',
}
// String
function generateStringField(
  schema,
  { name },
  { resolveComponent, resolveOptions, resolveProps }: GeneratorContext
): UI {
  const { props, layout } = resolveProps(schema, {})
  const getDerivedProps = compile(schema)
  const format = schema.format
  const isSelect =
    typeof format === 'string' &&
    !!format &&
    !/^(email|tel|url|file|text|search|password)$/.test(format)
  const component = resolveComponent(
    schema.component,
    props.component,
    formatComponents[format],
    isSelect ? 'Form.Select' : 'Form.Text'
  )

  if (!isSelect) {
    props.type = format
  }
  const getDerivedPropsFromValue = isSelect
    ? (value) => ({
        ...getDerivedProps(value),
        options: resolveOptions(format, schema),
      })
    : getDerivedProps

  return {
    type: 'field',
    name,
    component,
    props,
    layout,
    getDerivedPropsFromValue,
  }
}

// Number
const numberProcessors = {
  type: (type) => (type === 'integer' ? { step: 1 } : {}),
}

function generateNumberField(
  schema: Schema,
  { name },
  { resolveComponent }: GeneratorContext
): UI {
  const { props, layout } = resolveProps(schema, numberProcessors)
  const getDerivedPropsFromValue = compile(schema)

  const component = resolveComponent(schema.component, 'Form.Number')

  return {
    type: 'field',
    name,
    component,
    props,
    layout,
    getDerivedPropsFromValue,
  }
}

// Boolean
function generateBooleanField(
  schema: Schema,
  { name },
  { resolveComponent }: GeneratorContext
): UI {
  const { props, layout } = resolveProps(schema)
  const getDerivedPropsFromValue = compile(schema)

  const component = resolveComponent(schema.component, 'Form.CheckBox')

  return {
    type: 'field',
    name,
    component,
    props,
    layout,
    getDerivedPropsFromValue,
  }
}

// Enum
function generateEnumField(
  schema: Schema,
  { name },
  { resolveComponent }: GeneratorContext
): UI {
  const { props, layout } = resolveProps(schema)
  const getDerivedPropsFromValue = compile(schema)

  const component = resolveComponent(schema.component, 'Form.Select')

  if (!props.options) {
    props.options = schema.enum.map((value) => ({ label: value, value }))
  }

  return {
    type: 'field',
    name,
    component,
    props,
    layout,
    getDerivedPropsFromValue,
  }
}

// const
const constComponents = {
  string: 'Form.Text',
  number: 'Form.Number',
  boolean: 'Form.CheckBox',
}

function generateConstField(
  schema: Schema,
  { name },
  { resolveComponent }: GeneratorContext
): UI {
  const { props, layout } = resolveProps(schema)
  const getDerivedPropsFromValue = compile(schema)

  const component = resolveComponent(
    schema.component,
    constComponents[typeof schema.const]
  )

  props.readOnly = true
  props.value = schema.const

  return {
    type: 'field',
    name,
    component,
    props,
    layout,
    getDerivedPropsFromValue,
  }
}
