import React, { PureComponent } from 'react'
import { toArray } from '@myntra/uikit-utils'
import classnames from './input-select-value.module.scss'

export interface InputSelectValueProps<V = any, T = any> extends BaseProps {
  value: V
  options: T[]
  hasOverlay: boolean
  placeholder?: string
  labelKey: string
  valueKey: string
  disabled?: boolean
}

export default class InputSelectValue extends PureComponent<
  InputSelectValueProps
> {
  getSelectedOptions() {
    const { valueKey } = this.props
    const setOfValues = new Set(toArray(this.props.value))
    const options = this.props.options.filter((option) =>
      setOfValues.has(option[valueKey])
    )

    return options
  }

  getValue(options) {
    const { labelKey } = this.props

    return options.map((option) => option[labelKey]).join(', ')
  }

  getDisplayValue(options) {
    const { labelKey } = this.props

    switch (options.length) {
      case 0:
        return ''
      case 1:
        return options[0][labelKey]
      case 2:
        return `${options[0][labelKey]}, ${options[1][labelKey]}`
      default:
        return `${options[0][labelKey]}, + ${options.length - 1} more`
    }
  }

  render() {
    const { disabled, placeholder, hasOverlay, icon } = this.props
    const options = this.getSelectedOptions()
    const value = this.getValue(options)
    const displayValue = this.getDisplayValue(options)

    return (
      <div
        className={classnames({ underlay: hasOverlay }, 'value')}
        title={value}
      >
        <input
          className={classnames('input', { 'with-icon': !!icon })}
          placeholder={placeholder}
          disabled={disabled}
          value={displayValue}
          tabIndex={-1}
          readOnly
        />
      </div>
    )
  }
}
