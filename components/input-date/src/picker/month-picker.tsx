import React from 'react'

import { UTCDate } from '../input-date-utils'
import classnames from './month.module.scss'
import { MONTHS_OF_YEAR } from '../constants'

type MonthPickerProps = {
  month: number
  year: number
  offset: number
  onJump: Function
}

export const MonthPicker = ({
  month,
  year,
  offset,
  onJump,
}: MonthPickerProps) => {
  function handleMonthChange(month, diff = 0) {
    const date = UTCDate(year, month, 1)
    date.setMonth(date.getUTCMonth() + diff - offset)
    onJump(date)
  }

  const today = new Date()

  return (
    <div className={classnames('month-picker-container')}>
      {MONTHS_OF_YEAR.map((m, index) => (
        <div
          onClick={() => handleMonthChange(index)}
          key={index}
          className={classnames(
            'picker-text',
            today.getMonth() === index && today.getFullYear() === year
              ? 'current'
              : '',
            month === index ? 'active' : ''
          )}
        >
          {m}
        </div>
      ))}
    </div>
  )
}
