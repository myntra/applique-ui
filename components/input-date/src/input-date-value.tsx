import React, { PureComponent } from 'react'
import Icon from '@applique-ui/icon'
import InputMasked, {
  Props as InputMaskedProps,
} from '@applique-ui/input-masked'

import classnames from './input-date-value.module.scss'
import { parse, format } from './input-date-utils'
import {
  DateRange,
  StringDateRange,
  isStringDateRange,
} from './input-date-helpers'
import TimesSolid from 'uikit-icons/svgs/TimesSolid'
import ClockSolid from 'uikit-icons/svgs/ClockSolid' //Need to change to calender

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
  H: {
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
  includeTime?: boolean
}

/**
 *
 */
export default class InputDateValue extends PureComponent<
  Props,
  { value: string | StringDateRange }
> {
  state = { value: null }

  static defaultProps = {
    includeTime: false,
  }

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
      .replace(/[^YMDH]+/g, (match) => `"${match}"`)
  }

  handleFromChange = (value) => this.handleChange(value, 'from')
  handleToChange = (value) => this.handleChange(value, 'to')
  handleChange = (value: string, key?: 'to' | 'from') => {
    if (!this.props.onchange) return // readOnly input.

    try {
      const date = parse(value, this.props.format, this.props.includeTime)

      if (
        date &&
        format(date, this.props.format, this.props.includeTime) === value
      ) {
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
      includeTime,
      label,
      ...props
    } = this.props

    const labelCompatibility =
      label ||
      (range ? { from: 'Start Date', to: 'End Date' } : 'Enter Date Here')
    return (
      <div
        className={classnames('date-value', className, {
          'date-value-active': active,
        })}
        {...props}
      >
        {isStringDateRange(value, range) ? (
          [
            <div className={classnames('date-label-container', 'from')}>
              <label className={classnames('date-label')}>
                {labelCompatibility.from}
              </label>
              <div
                key="from"
                className={classnames('wrapper', {
                  active: this.props.active === 'from',
                })}
              >
                <Icon
                  name={ClockSolid}
                  className={classnames('pre-icon')}
                  color={disabled ? 'disabled' : 'dark'}
                />
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
                  className={classnames('custom-input')}
                />
                {this.props.value && (this.props.value as DateRange).from && (
                  <Icon
                    className={classnames('icon')}
                    name={TimesSolid}
                    title="Clear date"
                    onClick={this.handleFromClear}
                  />
                )}
              </div>
            </div>,
            <div className={classnames('date-label-container', 'to')}>
              <label className={classnames('date-label')}>
                {labelCompatibility.to}
              </label>
              <div
                key="to"
                className={classnames('wrapper', {
                  active: this.props.active === 'to',
                })}
              >
                <Icon
                  name={ClockSolid}
                  className={classnames('pre-icon')}
                  color={disabled ? 'disabled' : 'dark'}
                />
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
                  className={classnames('custom-input')}
                />
                {this.props.value && (this.props.value as DateRange).to && (
                  <Icon
                    className={classnames('icon')}
                    name={TimesSolid}
                    title="Clear date"
                    onClick={this.handleToClear}
                  />
                )}
              </div>
            </div>,
          ]
        ) : (
          <div className={classnames('date-label-container')}>
            <label className={classnames('date-label')}>
              {labelCompatibility}
            </label>
            <div key="both" className={classnames('wrapper')}>
              <Icon
                name={ClockSolid}
                className={classnames('pre-icon')}
                color={disabled ? 'disabled' : 'dark'}
              />
              <InputMasked
                includeMaskChars
                autoComplete="off"
                value={value}
                masks={MASKS}
                pattern={pattern}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                disabled={disabled}
                className={classnames('custom-input')}
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
          </div>
        )}
      </div>
    )
  }
}
