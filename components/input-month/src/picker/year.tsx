import React, { PureComponent } from 'react'
import { DateTime, Info } from 'luxon'
import classnames from './year.module.scss'

const DEFAULT_RANGE_VALUE = 5

function getDate(value?: any) {
  if (typeof value === undefined) {
    return DateTime.local()
  }

  if (typeof value === null) {
    return null
  }

  if (typeof value === 'string') {
    return DateTime.fromJSDate(new Date(value)).set({ month: 1, day: 1 })
  }

  if (value instanceof DateTime) {
    return value
  }

  return DateTime.fromJSDate(value).set({ month: 1, day: 1 })
}

export interface Props extends BaseProps {
  value?: number
  onChange(value: number): void
  highlight({
    year: number,
  }): 'info' | 'danger' | 'warning' | 'success' | 'disabled' | null
  upperLimit?: string | Date | DateTime
  lowerLimit?: string | Date | DateTime
}

/**
 * An embeddable year selection component.
 *
 * @since 0.7.0
 * @status REVIEWING
 * @category input
 * @see http://uikit.myntra.com/components/input-month#inputmonthpickeryear
 */

export default class InputMonthPickerYear extends PureComponent<Props> {
  static defaultProps = {
    upperLimit: getDate(new Date()).plus({ year: DEFAULT_RANGE_VALUE }),
    lowerLimit: getDate(new Date()).minus({ year: DEFAULT_RANGE_VALUE }),
  }

  getYearRange = () => {
    const { upperLimit, lowerLimit } = this.props
    const start = getDate(lowerLimit)
    const end = getDate(upperLimit).plus({ year: 1 })
    const currentDate = getDate(new Date())
    const years =
      Math.min(
        end.diff(currentDate, 'years').toObject().years,
        DEFAULT_RANGE_VALUE + 1
      ) +
      Math.min(
        currentDate.diff(start, 'years').toObject().years,
        DEFAULT_RANGE_VALUE
      )

    if (!years || years <= 0) {
      return []
    }
    return new Array<number>(Math.round(years))
      .fill(0)
      .map((num, i) => i)
      .map((year) => start.plus({ years: year }))
  }

  render() {
    const { className, highlight, value, onChange } = this.props
    return (
      <div className={classnames(className, 'year-container')}>
        {this.getYearRange().map(({ year }) => (
          <div
            key={year}
            className={classnames('year', highlight(year), {
              selected: year === value,
              disabled: highlight({ year }) === 'disabled',
            })}
            onClick={() => onChange(year)}
          >
            {year}
          </div>
        ))}
      </div>
    )
  }
}
