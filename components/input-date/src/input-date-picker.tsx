import React, { PureComponent, ReactNode } from 'react'

import MonthGroup from './picker/month-group'
import Month from './picker/month'
import Day from './picker/day'
import { format, parse } from './input-date-utils'
import { DateRange, StringDateRange, Preset, is } from './input-date-helpers'
import PresetView from './picker/preset'
import * as PRESETS from './presets'

const DEFAULT_PRESETS = Object.values(PRESETS)

export interface Props<
  DateLike = string | Date,
  DateLikeOrDateRangeLike = string | Date | DateRange | StringDateRange
> extends BaseProps {
  /**
   * Current value of the text input field.
   */
  value?: DateLikeOrDateRangeLike

  /**
   * The callback function called when the value changes.
   */
  onChange?(value: DateLikeOrDateRangeLike): void

  /**
   * The date format to parse and format value when using string dates.
   */
  format?: string

  /**
   * Set the picker in range selection mode. The value would have two dates (`from` and `to`).
   */
  range?: boolean

  /**
   * Custom renderer to display day in the picker dropdown.
   */
  renderDate?(props: { date: Date; children: ReactNode }): ReactNode

  /**
   * Number of month blocks to be visible.
   * By default value is 2 for range selection
   */
  monthsToDisplay?: number

  /**
   * Range of date to be disabled
   */
  disabledRanges?: Array<DateRange | StringDateRange>

  /**
   * Presets to select a single or range of date
   */
  presets?: Array<Preset> | boolean

  /**
   * The callback function when month or year is changed
   */
  onYearMonthChange?(value: DateLikeOrDateRangeLike): void
}

/**
 * @since 0.0.0
 * @status READY
 * @category input
 * @see http://uikit.myntra.com/components/input-date#inputdatepicker
 */
export default class InputDatePicker extends PureComponent<Props> {
  static MonthGroup = MonthGroup
  static Month = Month
  static Day = Day

  static propTypes = {
    /** @private */
    validate(props) {
      if (!props.value) return
      if (
        (props.range
          ? props.value &&
            (typeof props.value.from === 'string' ||
              typeof props.value.to === 'string')
          : typeof props.value === 'string') &&
        !props.format
      ) {
        throw new Error(
          `Set 'format' prop to 'yyyy-MM-dd' to use string dates.`
        )
      }
    },
  }

  static defaultProps = {
    range: false,
    disabledRanges: [],
    monthsToDisplay: 1,
  }

  handleChange = (value: Date | DateRange) => {
    if (this.props.onChange) {
      this.props.onChange(
        this.props.format ? format(value, this.props.format) : value
      )
    }
  }

  normalize = <T extends null | string | Date | DateRange | StringDateRange>(
    dateOrDates: T
  ): T extends string
    ? Date
    : T extends StringDateRange
    ? DateRange
    : T extends Date
    ? Date
    : T extends DateRange
    ? DateRange
    : T extends null
    ? null
    : never => {
    if (!dateOrDates) return null
    // 1. Date or undefined or null
    if (dateOrDates instanceof Date) return dateOrDates as any
    // 2. Range object
    if (
      is<DateRange | StringDateRange>(
        dateOrDates,
        typeof dateOrDates === 'object'
      )
    ) {
      const result: DateRange = {}

      if ('from' in dateOrDates) result.from = this.normalize(dateOrDates.from)
      if ('to' in dateOrDates) result.to = this.normalize(dateOrDates.to)

      return result as any
    }
    // 3. String!
    if (
      is<string>(
        dateOrDates,
        typeof dateOrDates === 'string' && !!this.props.format
      )
    ) {
      return parse(dateOrDates, this.props.format) as any
    }

    return null
  }

  render() {
    const {
      value,
      onChange,
      disabledRanges,
      presets,
      range,
      ...props
    } = this.props
    const normalizedDate = this.normalize(value)

    return (
      <MonthGroup
        {...props}
        value={normalizedDate}
        onChange={this.handleChange}
        disabledDates={disabledRanges.map(this.normalize)}
        range={range}
      >
        {this.props.presets && (
          <PresetView
            range={range}
            value={normalizedDate}
            onChange={this.handleChange}
            presets={
              !!this.props.presets ? DEFAULT_PRESETS : this.props.presets
            }
          />
        )}
      </MonthGroup>
    )
  }
}
