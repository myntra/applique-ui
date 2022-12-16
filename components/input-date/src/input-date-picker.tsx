import React, { PureComponent, ReactNode } from 'react'
import Layout from '@applique-ui/layout'
import ButtonGroup from '@applique-ui/button-group'
import Button from '@applique-ui/button'

import MonthGroup from './picker/month-group'
import Month from './picker/month'
import Day from './picker/day'
import { format, parse, onlyDate } from './input-date-utils'
import {
  DateRange,
  StringDateRange,
  Preset,
  is,
  isDateRange,
} from './input-date-helpers'
import PresetView from './picker/preset'
import * as PRESETS from './presets'
import classnames from './input-date-picker.module.scss'
import TimeGroup from './picker/time-group'
import dayJS from 'dayjs'

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
  includeTime?: boolean
}

/**
 * @since 0.0.0
 * @status READY
 * @category input
 * @see http://uikit.myntra.com/components/input-date#inputdatepicker
 */
export default class InputDatePicker extends PureComponent<
  Props,
  {
    showTime: boolean
    value: Date | DateRange
  }
> {
  state = {
    showTime: false,
    value: null,
  }

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
    includeTime: false,
  }

  handleDateChange = (value: Date | DateRange) => {
    if (this.props.includeTime) {
      if (!isDateRange(this.props.value, this.props.range)) {
        const oldValue = dayJS(this.props.value || new Date())
        value = dayJS(value as any)
          .hour(oldValue.hour())
          .minute(oldValue.minute())
          .toDate()
      } else if (value) {
        if ('from' in value) {
          const oldValue = dayJS((this.props.value || {}).from || new Date())
          value.from = dayJS(value.from as any)
            .hour(oldValue.hour())
            .minute(oldValue.minute())
            .toDate()
        }
        if ('to' in value) {
          const oldValue = dayJS((this.props.value || {}).to || new Date())
          value.to = dayJS(value.to as any)
            .hour(oldValue.hour())
            .minute(oldValue.minute())
            .toDate()
        }
      }
    }
    this.handleChange(value)
  }

  handleChange = (value: Date | DateRange) => {
    this.setState(
      {
        value,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(value)
        }
      }
    )
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
      return parse(
        dateOrDates,
        this.props.format,
        this.props.includeTime
      ) as any
    }

    return null
  }

  toggleView = () => {
    this.setState({
      showTime: !this.state.showTime,
    })
  }

  render() {
    const {
      value,
      onChange,
      disabledRanges,
      presets,
      range,
      includeTime,
      closePicker,
      ...props
    } = this.props
    const normalizedDate = this.normalize(this.state.value || value)
    const { showTime } = this.state
    return (
      <Layout type="row" gutter="none">
        {showTime && normalizedDate ? (
          <TimeGroup
            {...props}
            value={normalizedDate}
            onChange={this.handleChange}
            range={range}
          ></TimeGroup>
        ) : (
          <MonthGroup
            {...props}
            value={normalizedDate}
            onChange={this.handleDateChange}
            disabledDates={disabledRanges.map(this.normalize)}
            includeTime={includeTime}
            range={range}
          >
            {this.props.presets && (
              <PresetView
                range={range}
                value={normalizedDate}
                onChange={this.handleChange}
                presets={
                  Array.isArray(this.props.presets)
                    ? this.props.presets
                    : !!this.props.presets
                    ? DEFAULT_PRESETS
                    : null
                }
              />
            )}
          </MonthGroup>
        )}

        {includeTime && (
          <ButtonGroup className={classnames('input-date-picker__actions')}>
            <Button
              type="primary"
              size="small"
              transform="capitalize"
              onClick={closePicker}
            >
              Confirm
            </Button>
            <Button
              type="link"
              size="small"
              transform="capitalize"
              onClick={this.toggleView}
              disabled={
                range
                  ? !(
                      normalizedDate &&
                      'from' in normalizedDate &&
                      'to' in normalizedDate
                    )
                  : !normalizedDate
              }
            >
              Select {`${showTime ? 'date' : 'time'}`}
            </Button>
          </ButtonGroup>
        )}
      </Layout>
    )
  }
}
