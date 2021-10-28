import React, { Component, ComponentType } from 'react'
import Form, { Props as FormProps } from '@myntra/uikit-component-form'

import fields from './fields'
import { createRenderFactory, UI } from './json-schema-renderer'
import { Schema } from './json-schema-compiler'

const FORM_FIELD_RE = /^Form\.([A-Za-z0-9]+)$/

interface Props extends FormProps {
  schema: Record<string, any>
  value?: Record<string, any>
  onChange(value: Record<string, any>): void

  optionsProvider?(
    format: string
  ): Array<Record<string, any>> | null | Promise<Array<Record<string, any>>>
  componentProvider?(name: string): ComponentType
  // --
  error?: Record<string, string | string[]>
  onError?(error: Record<string, string | string[]>): void
}

/**
 * A component for building Web forms from JSON Schema.
 *
 * It is meant to automatically generate a form when data structure changes often or has large number of fields.
 *
 * @since 0.3.0
 * @status REVIEWING
 *
 */
export default class SchemaForm extends Component<Props, { ui: UI | null }> {
  optionsCache: Record<string, any[]>

  constructor(props) {
    super(props)

    this.state = {
      ui: this.createUI(props.schema),
    }
  }

  componentDidUpdate(oldProps) {
    if (oldProps.schema !== this.props.schema) {
      console.log('Refreshing schema UI')
      this.setState({
        ui: this.createUI(this.props.schema),
      })
    }
  }

  componentWillUnmount() {
    console.log('Deleting SchemaForm')
  }

  createUI(schema: Schema) {
    return createRenderFactory(schema, {
      resolveComponent: this.componentProvider,
      resolveOptions: this.optionsProvider,
    })
  }

  componentProvider = (name) => {
    const component =
      this.props.componentProvider && this.props.componentProvider(name)

    if (component) return component
    if (FORM_FIELD_RE.test(name)) return Form[name.split('.').pop()]
  }

  optionsProvider = (format) => {
    if (this.props.optionsProvider) {
      const result = this.props.optionsProvider(format)

      if (Array.isArray(result)) return result
      if (result === null) return
      if (result.then) {
        result.then((result) => {
          if (this.optionsCache[format] !== result) {
            this.optionsCache[format] = result
            console.log('Option loaded.')
            this.forceUpdate() // Options Loaded.
          }
        })

        return this.optionsCache[format] || []
      }
    }
  }

  handleError = (error) => this.props.onError && this.props.onError(error)
  handleChange = (value) => this.props.onChange && this.props.onChange(value)

  render() {
    const { ui } = this.state
    if (!ui) {
      return null
    }

    const Field = fields[ui.type] as ComponentType<any>
    const {
      className,
      children,
      value,
      error,
      onChange,
      onError: onValidation,
      optionsProvider,
      componentProvider,
      schema,
      ...props
    } = this.props

    return (
      <Form {...props} className={className} key="form">
        <Field
          _fields={fields}
          {...ui}
          key="#"
          path="#"
          fieldSize={12}
          value={this.props.value}
          error={this.props.error}
          onChange={this.handleChange}
          onError={this.handleError}
        />
        {this.props.children}
      </Form>
    )
  }
}
