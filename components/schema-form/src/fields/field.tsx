import React, { PureComponent, ComponentType } from 'react'
import { looseEquals } from '@myntra/uikit-utils'
import Grid from '@myntra/uikit-component-grid'

export interface Props extends BaseProps {
  type: 'field'

  name: string
  component: ComponentType<any> | null

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
 * @since 0.3.0
 * @status REVIEWING
 */
export default class SchemaFormField extends PureComponent<Props> {
  static defaultProps = {
    getDerivedPropsFromValue() {},
  }

  constructor(options) {
    super(options)

    const { props, defaultValue } = options

    if (options.value === undefined) {
      if (defaultValue !== undefined) this.handleChange(defaultValue)
      if ('value' in props) this.handleChange(props.value)
      if ('default' in props) this.handleChange(props.default)
    }
  }

  get error() {
    return Array.isArray(this.props.error)
      ? this.props.error.join(' ')
      : this.props.error
  }

  componentDidUpdate(oldProps) {
    if (
      typeof this.props.value === 'undefined' &&
      typeof this.props.defaultValue !== 'undefined'
    ) {
      this.handleChange(this.props.defaultValue)
    }
  }

  resetError() {
    if (this.props.error) this.props.onError(null)
  }

  handleChange = (value) => {
    this.resetError()
    this.props.onChange(value)
  }

  handleBlur = () => {
    this.resetError()
  }

  render() {
    const {
      name,
      component: Input,
      props,
      layout,
      getDerivedPropsFromValue,
      value,
    } = this.props
    const { defaultValue = undefined, ...derivedProps } = {
      ...props,
      ...getDerivedPropsFromValue(value),
    }

    if (!Input) {
      return <Grid.Column {...layout} />
    }

    return (
      <Grid.Column
        size={4}
        sizeOnMobile={12}
        {...layout}
        key={this.props.path}
        data-path={this.props.path}
      >
        <Input
          {...derivedProps}
          name={name}
          value={value}
          onChange={this.handleChange}
          error={this.error}
          onBlur={this.handleBlur}
        />
      </Grid.Column>
    )
  }
}
