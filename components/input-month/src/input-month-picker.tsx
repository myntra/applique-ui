import React, { Component, ReactNode } from 'react'
import MonthPane from './picker/month'
import YearPane from './picker/year'
import classnames from './input-month-picker.module.scss'

export interface Props extends BaseProps {
  /**
   * Current value of the input field.
   */
  value?: { month: number; year: number }

  /**
   * The callback function to call when the value changes.
   */
  onChange?(value: { month: number | null; year: number | null }): void

  /**
   * Customize appearance of values in picker dropdown.
   * @param value - Month or Year to highlight.
   */
  highlight?(value: {
    month: number | null
    year: number | null
  }): 'info' | 'danger' | 'warning' | 'success' | 'disabled' | null

  /**
   * Custom render function to override contents of month values in the picker dropdown.
   */
  renderMonth?(props: { month: string; index: number }): ReactNode
}

/**
 * An embeddable month/year selection component.
 *
 * @since 0.7.0
 * @status REVIEWING
 * @category input
 * @see http://uikit.myntra.com/components/input-month#inputmonthpicker
 */
export default class InputMonthPicker extends Component<Props> {
  static Month = MonthPane
  static Year = YearPane

  static propTypes = {
    _validate({ value }) {
      if (
        value &&
        typeof value.month === 'number' &&
        (value.month < 1 || value.month > 12)
      ) {
        throw new Error(
          `'value.month' should be a numeric value between 1 and 12.`
        )
      }
    },
  }

  highlightMonth = (month) =>
    this.props.highlight
      ? this.props.highlight({
          month,
          year: this.props.value ? this.props.value.year : null,
        })
      : null
  highlightYear = (year) =>
    this.props.highlight
      ? this.props.highlight({
          year,
          month: this.props.value ? this.props.value.month : null,
        })
      : null

  handleChange = (newValue) =>
    this.props.onChange &&
    this.props.onChange({ ...this.props.value, ...newValue })
  handleMonthChange = (month) => this.handleChange({ month })
  handleYearChange = (year) => this.handleChange({ year })

  render() {
    const value = this.props.value || { month: null, year: null }
    const { minDate, maxDate } = this.props
    return (
      <div className={classnames('picker', this.props.className)}>
        <div className={classnames('left-pane')}>
          <div className={classnames('title')}>Month</div>
          <MonthPane
            value={value.month}
            onChange={this.handleMonthChange}
            highlight={this.highlightMonth}
            renderMonth={this.props.renderMonth}
          />
        </div>
        <div className={classnames('right-pane')}>
          <div className={classnames('title')}>Year</div>
          <YearPane
            upperLimit={maxDate}
            lowerLimit={minDate}
            value={value.year}
            onChange={this.handleYearChange}
            highlight={this.highlightYear}
          />
        </div>
      </div>
    )
  }
}
