import React, { Component, ReactNode } from 'react'
import dayJS from 'dayjs'

import { UTCDate, onlyDate } from '../input-date-utils'
import { isDateRange, DateRange } from '../input-date-helpers'

import Month from './month'
import Jumper from './jumper'

import classnames from './month-group.module.scss'

/**
 * Create range.
 */
function range(n: number): number[] {
  return Array.apply(null, { length: n }).map((_, i) => i)
}

export interface Props extends BaseProps {
  /**
   * @private
   */
  value?: Date | DateRange
  /**
   * @private
   */
  onchange?(value: Date | DateRange): void
  /**
   * @private
   */
  renderDate?(props: { date: Date; children: ReactNode }): ReactNode
  monthsToDisplay?: number
  disabledDates?: DateRange[]
  disabled?: boolean
  range?: boolean
  openToDate?: Date
  onOpenToDateChange?(date: Date): void
  onRangeStartSelected?(date: Date): void
  onRangeEndSelected?(date: Date): void
  active?: 'from' | 'to'
}

/**
 * Render a calendar to select a date.
 * @since 0.0.0
 * @status REVIEWING
 */
export default class MonthGroup extends Component<
  Props,
  { focused: null | Date; openToDate: null | Date }
> {
  static Jumper = Jumper
  static Month = Month
  static propTypes = {
    validate(props) {
      if (props.range && props.value instanceof Date) {
        throw new Error(
          'When using `range` prop, value should be a plain object of type ({ from?: Date, to?: Date }).'
        )
      } else if (
        !props.range &&
        props.value &&
        !(props.value instanceof Date)
      ) {
        throw new Error('Value should be an instance of date.')
      }
    },
  }
  static defaultProps = {
    disabledDates: [],
    monthsToDisplay: 1,
    range: false,
  }

  state = {
    focused: null,
    openToDate: null,
  }

  handleJump = (openToDate: Date) => {
    this.setState({ openToDate })

    if (this.props.onOpenToDateChange) this.props.onOpenToDateChange(openToDate)
  }

  handleDateFocus = (_: number, focused: Date) => {
    if (!this.props.disabled) {
      this.setState({ focused })
    }
  }

  handleDateSelect = (_: number, value: Date) => {
    if (this.props.disabled) return
    if (!isDateRange(this.props.value, this.props.range)) {
      // TODO: use isDateRange
      return this.props.onChange && this.props.onChange(value)
    }

    // Range selection.
    if (this.props.active) {
      if (
        this.props.active === 'from' &&
        this.props.value &&
        this.props.value.to &&
        dayJS(this.props.value.to).isBefore(dayJS(value))
      ) {
        return this.fireRangeEvent({ from: value })
      }

      if (
        this.props.active === 'to' &&
        this.props.value &&
        this.props.value.to &&
        this.props.value.from &&
        dayJS(this.props.value.from).isAfter(dayJS(value))
      ) {
        return this.fireRangeEvent({ from: value })
      }

      return this.fireRangeEvent({
        ...this.props.value,
        [this.props.active]: value,
      })
    }

    if (!this.props.value) return this.fireRangeEvent({ from: value })
    if (this.props.value.from && this.props.value.to) {
      return this.fireRangeEvent({
        ...this.props.value,
        [this.props.active || 'from']: value,
      })
    } else if (this.props.value.from && !this.props.value.to) {
      return this.fireRangeEvent({ from: this.props.value.from, to: value })
    } else if (!this.props.value.from && this.props.value.to) {
      return this.fireRangeEvent({ from: value, to: this.props.value.to })
    } else {
      return this.fireRangeEvent({ from: value })
    }
  }

  fireRangeEvent(value) {
    if (value.from && value.to) {
      const [from, to] = [value.from, value.to].sort(
        (a, b) => a.getTime() - b.getTime()
      )
      value = { from, to }
    }
    if (this.props.onRangeStartSelected && value.from)
      this.props.onRangeStartSelected(value.from)
    if (this.props.onRangeEndSelected && value.to)
      this.props.onRangeEndSelected(value.to)
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  /**
   * @type {Date}
   */
  get referenceDate() {
    return (
      this.props.openToDate || this.state.openToDate || onlyDate(new Date())
    )
  }

  isSameMonth(a, b) {
    return (
      a instanceof Date &&
      b instanceof Date &&
      a.getUTCFullYear() === b.getUTCFullYear() &&
      a.getUTCMonth() === b.getUTCMonth()
    )
  }

  findSelectionRange(value: { from: Date; to: Date }, date: Date) {
    // re-order if required.
    value =
      value.from.getTime() <= value.to.getTime()
        ? value
        : { from: value.to, to: value.from }

    let from: undefined | number
    let to: undefined | number

    const isFrom = this.isSameMonth(value.from, date)
    const isTo = this.isSameMonth(value.to, date)
    const first = UTCDate(date.getUTCFullYear(), date.getUTCMonth(), 1)

    if (isFrom) from = value.from.getUTCDate()
    else if (dayJS(value.from).isBefore(first)) from = 0
    else return null

    const last = dayJS(first)
      .endOf('month')
      .toDate()

    if (isTo) to = value.to.getUTCDate()
    else if (dayJS(value.to).isAfter(last)) to = last.getUTCDate() + 1
    else return null

    return { from, to }
  }

  createSelectionData(date: Date) {
    const value = this.props.value
    const focused = this.state.focused
    const selecting = this.props.active
    if (!isDateRange(value, this.props.range)) {
      if (this.isSameMonth(value, date)) {
        return { from: value.getUTCDate(), to: value.getUTCDate() }
      }
    } else if (value) {
      const hasFrom = !!value.from
      const hasTo = !!value.to
      const hasFocused = !!focused

      if (selecting === 'from' && !hasTo)
        return hasFrom
          ? this.findSelectionRange(
              { from: value.from, to: UTCDate(9999, 11, 31) },
              date
            )
          : null
      if (selecting === 'to' && !hasFrom)
        return hasTo
          ? this.findSelectionRange(
              { from: UTCDate(0, 0, 1), to: value.to },
              date
            )
          : null

      if (hasFrom && hasTo) {
        return this.findSelectionRange(value as any, date)
      } else if (hasFrom && hasFocused) {
        return this.findSelectionRange({ from: value.from, to: focused }, date)
      } else if (hasTo && hasFocused) {
        return this.findSelectionRange({ from: focused, to: value.to }, date)
      } else if (hasFrom) {
        return this.findSelectionRange(
          { from: value.from, to: UTCDate(9999, 11, 31) },
          date
        )
      } else if (hasTo) {
        return this.findSelectionRange(
          { from: UTCDate(0, 0, 1), to: value.to },
          date
        )
      }
    }

    return null
  }

  normalizeDisabledRange(value, date) {
    if (!value) return null

    return {
      from: value.from || UTCDate(0, 0, 1),
      to: value.to || UTCDate(9999, 11, 31),
    }
  }

  createDisabledData(date) {
    return this.props.disabledDates
      .map((value) => this.normalizeDisabledRange(value, date))
      .filter(Boolean)
      .map((value) => this.findSelectionRange(value, date))
      .filter(Boolean)
  }

  createMonthData(reference, offsetMonth) {
    const date = new Date(reference)
    const focused = this.state.focused

    date.setMonth(date.getUTCMonth() + offsetMonth)

    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    const selected = this.createSelectionData(date)
    const disabled = this.createDisabledData(date)

    return {
      key: month + '/' + year,
      year,
      month,
      selected,
      disabled,
      focused:
        focused &&
        year === focused.getUTCFullYear() &&
        month === focused.getUTCMonth()
          ? focused.getUTCDate()
          : null,
    }
  }

  render() {
    const date = this.referenceDate

    return (
      <div className={classnames(this.props.className, 'group')}>
        {range(this.props.monthsToDisplay)
          .map((index) => this.createMonthData(date, index))
          .map(({ key, ...props }, offset) => (
            <Month
              {...props}
              key={key}
              onDateFocus={this.handleDateFocus}
              onDateSelect={this.handleDateSelect}
              renderDate={this.props.renderDate}
            >
              <Jumper
                year={props.year}
                month={props.month}
                offset={offset}
                hasPrev={offset === 0}
                hasNext={offset + 1 === this.props.monthsToDisplay}
                onJump={this.handleJump}
              />
            </Month>
          ))}
        {this.props.children}
      </div>
    )
  }
}
