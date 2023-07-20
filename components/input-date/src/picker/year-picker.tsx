import { calculateDate } from '../input-date-utils'
import classnames from './month.module.scss'
import React from 'react'

type YearPickerProps = {
  month: number
  year: number
  offset: number
  onJump: Function
}

export const YearPicker = ({
  month,
  year,
  offset,
  onJump,
}: YearPickerProps) => {
  function handleYearChange(year) {
    const date = calculateDate(month, year, offset)
    onJump(date)
  }

  const today = new Date()
  const yearRangeStart = year - (year % 10 || 10) + 1
  const yearPicker = []
  Array.from({ length: 10 }, (val, ind) => ind + yearRangeStart).forEach(
    (y, index) => {
      yearPicker.push(
        <div
          onClick={() => handleYearChange(y)}
          key={index}
          className={classnames(
            'picker-text',
            today.getFullYear() == y ? 'current' : '',
            year == y ? 'active' : ''
          )}
        >
          {y}
        </div>
      )
    }
  )

  return <div className={classnames('year-picker-container')}>{yearPicker}</div>
}
