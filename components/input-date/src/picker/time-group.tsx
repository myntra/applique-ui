import React, { PureComponent, ReactNode } from 'react'
import dayJS from 'dayjs'
import classnames from './month-group.module.scss'
import { range, DateRange, isDateRange } from '../input-date-helpers'
import Time from './time'
import { onlyDate } from '../input-date-utils'

interface TimeLike {
  hour: number
  minute: number
}

export interface Props extends BaseProps {
  /**
   * Current value of the input field
   */
  value?: Date | DateRange
  /**
   * Callback function when the value is changed
   * @param value
   */
  disabled?: boolean
  range?: boolean
  onchange?(value: Date | DateRange): void
}

/**
 * @since 0.0.0
 * @status READY
 * @category input
 * @see http://uikit.myntra.com/components/input-time#inputtimepicker
 */
export default class TimeGroup extends PureComponent<Props> {
  static defaultProps = {
    value: {
      hour: dayJS().hour(),
      minute: dayJS().minute(),
      range: false,
    },
  }

  /**
   * @type {Date}
   */
  get referenceDate() {
    return this.props.openToDate || onlyDate(new Date())
  }

  getRange = (): number[] => {
    return range(this.props.range ? 2 : 1)
  }

  fireRangeEvent = (value) => {
    if (value.from && value.to) {
      const [from, to] = [value.from, value.to].sort(
        (a, b) => a.getTime() - b.getTime()
      )
      value = { from, to }
    }
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  handleTimeSelect = (hour: number, minute: number, active: string) => {
    if (this.props.disabled) return
    if (!isDateRange(this.props.value, this.props.range)) {
      const { value } = this.props
      const newValue = dayJS(value)
        .hour(hour)
        .minute(minute)
        .toDate()
      return this.props.onChange && this.props.onChange(newValue)
    }
    // Range selection.
    if (active) {
      if (
        active === 'from' &&
        this.props.value &&
        this.props.value.to &&
        this.props.value.from &&
        dayJS(this.props.value.to).isBefore(
          dayJS(this.props.value.from)
            .hour(hour)
            .minute(minute)
        )
      ) {
        return this.fireRangeEvent(this.props.value)
      }
      if (
        active === 'to' &&
        this.props.value &&
        this.props.value.to &&
        this.props.value.from &&
        dayJS(this.props.value.from).isAfter(
          dayJS(this.props.value.to)
            .hour(hour)
            .minute(minute)
        )
      ) {
        return this.fireRangeEvent(this.props.value)
      }
      if (this.props.value.from && this.props.value.to) {
        return this.fireRangeEvent({
          ...this.props.value,
          [active]: dayJS(this.props.value[active])
            .hour(hour)
            .minute(minute)
            .toDate(),
        })
      }
    }
  }

  createTimeData = (reference: Date | string, offset: number) => {
    const sections = {
      0: 'from',
      1: 'to',
    }
    const date = dayJS(new Date(reference))
    const hour: number = date.hour()
    const minute: number = date.minute()
    return {
      key: `${offset}_${hour}:${minute}`,
      hour,
      minute,
      active: this.props.range ? sections[offset] : null,
    }
  }

  render() {
    const date = this.referenceDate
    const { value, range: isRange, ...props } = this.props

    return (
      <div className={classnames(this.props.className, 'group')}>
        {range(isRange ? 2 : 1)
          .map((index) => this.createTimeData(date, index))
          .map(({ key, ...props }, offset) => (
            <Time
              {...props}
              key={key}
              onTimeSelect={this.handleTimeSelect}
            ></Time>
          ))}
      </div>
    )
  }
}
