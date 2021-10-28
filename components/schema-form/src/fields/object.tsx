import React, { Component, ComponentType } from 'react'
import { looseEquals } from '@myntra/uikit-utils'
import Grid from '@myntra/uikit-component-grid'

import { UI } from '../json-schema-renderer'

const FallbackWrapper = function Wrapper({ children }) {
  return React.Children.only(children)
}

export interface Props {
  type: 'object'

  name: string
  path: string
  component?: ComponentType<any>

  props: Record<string, any>
  layout: Record<string, any>

  getDerivedPropsFromValue?(value: any): Record<string, any>
  value?: any
  defaultValue?: any
  onChange(value: Record<string, any>): void
  // --
  error?: Record<string, string | string[]>
  onError(error: Record<string, string | string[]>): void

  properties: UI[]
}

/**
 * @since 0.3.0
 * @status REVIEWING
 */
export default class SchemaFormObject extends Component<Props> {
  static defaultProps = {
    path: '#',
    getDerivedPropsFromValue() {
      // do nothing
    },
  }

  handlers = {
    change: {},
    error: {},
  }

  shouldComponentUpdate(newProps) {
    const shouldUpdate = !(
      looseEquals(this.props.value, newProps.value) &&
      looseEquals(this.props.error, newProps.error)
    )

    return shouldUpdate
  }

  componentWillUnmount() {
    delete this.handlers
  }

  getValue(name) {
    if (this.props.value && name in this.props.value) {
      return this.props.value[name]
    }
  }

  getHandler(type, name) {
    if (!(name in this.handlers[type])) {
      this.handlers[type][name] = (value) =>
        this.props.onChange({ ...this.props.value, [name]: value })
    }

    return this.handlers[type][name]
  }

  getChangeHandler(name) {
    return this.getHandler('change', name)
  }

  getError(name) {
    if (this.props.error && name in this.props.error) {
      return this.props.error[name]
    }
  }

  getErrorHandler(name) {
    return this.getHandler('error', name)
  }

  render() {
    const Wrapper = this.props.component || FallbackWrapper
    const { _fields, props, layout } = this.props as any // Hidden _field prop
    const { properties: derivedProps = {} } =
      this.props.getDerivedPropsFromValue(this.props.value) || {}

    return (
      <Grid.Column
        {...layout}
        key={this.props.path}
        data-path={this.props.path}
      >
        <Wrapper {...props}>
          <Grid multiline gapless>
            {this.props.properties.map(({ type, name, ...ui }) => {
              const Input = _fields[type] as ComponentType<any>

              return (
                <Input
                  _fields={_fields}
                  {...ui}
                  {...props[name]}
                  {...derivedProps[name]}
                  path={`${this.props.path}/${name}`}
                  key={`${this.props.path}/${name}`}
                  name={name}
                  type={type}
                  value={this.getValue(name)}
                  error={this.getError(name)}
                  onChange={this.getChangeHandler(name)}
                  onError={this.getErrorHandler(name)}
                />
              )
            })}
          </Grid>
        </Wrapper>
      </Grid.Column>
    )
  }
}
