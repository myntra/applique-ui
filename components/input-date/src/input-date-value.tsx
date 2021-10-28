import React, { PureComponent } from 'react'
import Icon from '@myntra/uikit-component-icon'
import InputMasked, {
  Props as InputMaskedProps,
} from '@myntra/uikit-component-input-masked'

import classnames from './input-date-value.module.scss'
import { parse, format } from './input-date-utils'
import {
  DateRange,
  StringDateRange,
  isStringDateRange,
} from './input-date-helpers'
import TimesSolid from 'uikit-icons/svgs/TimesSolid'

const MASKS: InputMaskedProps['masks'] = {
  Y: {
    validate(token) {
      return /\d/.test(token)
    },
  },
  M: {
    validate(token) {
      return /\d/.test(token)
    },
  },
  D: {
    validate(token) {
      return /\d/.test(token)
    },
  },
}

export interface Props extends BaseProps {
  format: string

  value?: string | StringDateRange
  onchange?(value: Date | DateRange): void

  active?: 'from' | 'to'

  range?: boolean
  onRangeFocus?(active: 'from' | 'to'): void
  onFocus?(event: FocusEvent): void
}

/**
 *
 */
export default class InputDateValue extends PureComponent<
  Props,
  { value: string | StringDateRange }
> {
  state = { value: null }

  get value() {
    return this.state.value
      ? this.state.value
      : this.props.range
      ? this.props.value || {}
      : this.props.value
  }

  get pattern() {
    return this.props.format
      .toUpperCase()
      .replace(/[^YMD]+/g, (match) => `"${match}"`)
  }

  handleFromChange = (value) => this.handleChange(value, 'from')
  handleToChange = (value) => this.handleChange(value, 'to')
  handleChange = (value: string, key?: 'to' | 'from') => {
    if (!this.props.onchange) return // readOnly input.

    try {
      const date = parse(value, this.props.format)

      if (date && format(date, this.props.format) === value) {
        this.setState({ value: null })
        this.props.onChange(typeof key === 'string' ? { [key]: date } : date)
      }

      throw new Error('invalid date')
    } catch (e) {
      this.setState(
        key ? { value: { ...this.value, [key]: value } } : { value }
      )
    }
  }

  handleBlur = () => this.setState({ value: null })

  handleFromFocus = (event: FocusEvent) => this.handleRangeFocus('from', event)
  handleToFocus = (event: FocusEvent) => this.handleRangeFocus('to', event)
  handleRangeFocus = (value: 'from' | 'to', event: FocusEvent) => {
    this.props.onRangeFocus && this.props.onRangeFocus(value)
    this.props.onFocus && this.props.onFocus(event)
  }

  handleFromClear = () => this.handleClear('from')
  handleToClear = () => this.handleClear('to')
  handleClear = (key: 'from' | 'to') => {
    this.setState({ value: null })
    this.props.onChange &&
      this.props.onChange(typeof key === 'string' ? { [key]: null } : null)
  }

  render() {
    const { value, pattern } = this
    const {
      range,
      active,
      onFocus,
      onBlur,
      children,
      className,
      format,
      onRangeFocus,
      onchange,
      value: _,
      disabled,
      ...props
    } = this.props

    return (
      <div
        className={classnames('date-value', className, {
          'date-value-active': active,
        })}
        {...props}
      >
        {isStringDateRange(value, range) ? (
          [
            <div
              key="from"
              className={classnames('wrapper', {
                active: this.props.active === 'from',
              })}
            >
              <InputMasked
                includeMaskChars
                id="from"
                autoComplete="off"
                value={value.from}
                masks={MASKS}
                pattern={pattern}
                onClick={this.handleFromFocus}
                onFocus={this.handleFromFocus}
                onBlur={this.handleBlur}
                onChange={this.handleFromChange}
                disabled={disabled}
              />
              {this.props.value && (this.props.value as DateRange).from && (
                <Icon
                  className={classnames('icon')}
                  name={TimesSolid}
                  title="Clear date"
                  onClick={this.handleFromClear}
                />
              )}
            </div>,
            <div
              key="to"
              className={classnames('wrapper', {
                active: this.props.active === 'to',
              })}
            >
              <InputMasked
                includeMaskChars
                id="to"
                autoComplete="off"
                value={value.to}
                masks={MASKS}
                pattern={pattern}
                onClick={this.handleToFocus}
                onFocus={this.handleToFocus}
                onBlur={this.handleBlur}
                onChange={this.handleToChange}
                disabled={disabled}
              />
              {this.props.value && (this.props.value as DateRange).to && (
                <Icon
                  className={classnames('icon')}
                  name={TimesSolid}
                  title="Clear date"
                  onClick={this.handleToClear}
                />
              )}
            </div>,
          ]
        ) : (
          <div key="both" className={classnames('wrapper')}>
            <InputMasked
              includeMaskChars
              autoComplete="off"
              value={value}
              masks={MASKS}
              pattern={pattern}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              disabled={disabled}
            />
            {this.props.value && (
              <Icon
                className={classnames('icon')}
                name={TimesSolid}
                title="Clear date"
                onClick={this.handleClear}
              />
            )}
          </div>
        )}
      </div>
    )
  }
}
