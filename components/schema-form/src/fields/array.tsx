import React, { Component, ComponentType } from 'react'

import { looseEquals } from '@myntra/uikit-utils'
import Grid from '@myntra/uikit-component-grid'
import Field from '@myntra/uikit-component-field'
import Button from '@myntra/uikit-component-button'

import classnames from './array.module.scss'
import { UI } from '../json-schema-renderer'

export interface Props {
  type: 'array'

  name: string
  path: string
  component?: ComponentType<any>
  factory(index: number): UI

  props: Record<string, any>
  layout: Record<string, any>

  getDerivedPropsFromValue?(value: any): Record<string, any>
  value?: any
  defaultValue?: any
  onChange(value: Record<string, any>): void
  // --
  error?: Record<string, string | string[]>
  onError(error: Record<string, string | string[]>): void
}

/**
 * Describe component in 150-200 words.
 *
 * @since 0.3.0
 * @status REVIEWING
 */
class SchemaFormArray extends Component<Props> {
  static defaultProps = {
    getDerivedPropsFromValue() {},
    component: Field,
  }

  handlers = {
    change: [],
    error: [],
  }

  get value() {
    return Array.isArray(this.props.value) ? this.props.value : [undefined]
  }

  shouldComponentUpdate(newProps) {
    const shouldUpdate = !(
      looseEquals(this.props.value, newProps.value) &&
      looseEquals(this.props.error, newProps.error)
    )

    return shouldUpdate
  }

  componentWillUnmount() {
    console.log('Deleting', this.props.path)
    delete this.handlers
  }

  getHandler(type, index) {
    if (this.handlers[type].length <= index) {
      this.handlers[type][index] = (value) => {
        const copiedValue = (this.props.value || []).slice()

        copiedValue.splice(index, 1, value)

        return copiedValue
      }
    }

    return this.handlers[type][index]
  }

  getChangeHandler(index) {
    return this.getHandler('change', index)
  }

  getErrorHandler(index) {
    return this.getHandler('error', index)
  }

  getError(index) {
    if (!Array.isArray(this.props.error)) return

    return this.props.error[index]
  }

  add = () => {
    const value = (this.props.value || []).slice()

    value.push(undefined)

    if (!this.props.value) value.push(undefined)

    this.props.onChange(value)
  }

  remove = (index) => {
    const value = (this.props.value || []).slice()

    value.splice(index, 1)

    this.props.onChange(value)
  }

  render() {
    const Wrapper: any = this.props.component || Field
    const { _fields, props, layout, value } = this.props as any // Hidden _fields prop.
    const { defaultValue = undefined, ...newProps } = {
      ...props,
      ...this.props.getDerivedPropsFromValue(value),
    }

    return (
      <Grid.Column
        size={4}
        sizeOnMobile={12}
        {...layout}
        className={classnames('container')}
        key={this.props.path}
        data-path={this.props.path}
      >
        <Wrapper {...newProps}>
          <Grid multiline gapless className={classnames('items')}>
            {this.value.map((value, index) => {
              const { type, ...ui } = this.props.factory(index)
              const Input = _fields[type] as ComponentType<any>

              return (
                <Grid.Column size={12} key={index}>
                  <Grid multiline allowAnyChild>
                    <Input
                      _fields={_fields}
                      {...ui}
                      path={`${this.props.path}/${index}`}
                      type={type}
                      value={value}
                      onChange={this.getChangeHandler(index)}
                      error={this.getError(index)}
                      onError={this.getErrorHandler(index)}
                    />
                  </Grid>
                  <div className={classnames('remove-item')}>
                    <Button onClick={() => this.remove(index)} type="secondary">
                      Remove
                    </Button>
                  </div>
                </Grid.Column>
              )
            })}
          </Grid>
        </Wrapper>

        <div className={classnames('add-item')}>
          <Button onClick={this.add} type="secondary">
            Add
          </Button>
        </div>
      </Grid.Column>
    )
  }
}

export default SchemaFormArray
