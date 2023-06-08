import React, { PureComponent } from 'react'

import Month from './jumper/month'
import Year from './jumper/year'
import classnames from './jumper.module.scss'
import { UTCDate } from '../input-date-utils'
import Icon from '@applique-ui/icon'
import ChevronLeftSolid from 'uikit-icons/svgs/ChevronLeftSolid'
import ChevronRightSolid from 'uikit-icons/svgs/ChevronRightSolid'
import { MONTHS_OF_YEAR } from '../constants'

export interface Props extends BaseProps {
  year: number
  month: number
  offset: number
  onJump(
    date: Date,
    closeMonthSelector: boolean,
    closeYearSelector: boolean
  ): void
  hasPrev?: boolean
  hasNext?: boolean
  openMonthPicker(): void
}

/**
 * Select year and month to jump to a date.
 *
 * @since 0.0.0
 * @status REVIEWING
 */
export default class Jumper extends PureComponent<Props> {
  static Month = Month
  static Year = Year

  handleJump = (year, month, diff = 0) => {
    const { monthSelector, yearSelector } = this.props

    const date = UTCDate(year, month, 1)

    monthSelector || yearSelector
      ? date.setFullYear(date.getFullYear() + diff - this.props.offset)
      : date.setMonth(date.getUTCMonth() + diff - this.props.offset)

    this.props.onJump(date, !monthSelector, !yearSelector)
  }
  handleNext = () => this.handleJump(this.props.year, this.props.month, 1)
  handlePrev = () => this.handleJump(this.props.year, this.props.month, -1)
  handlePrevDecade = () =>
    this.handleJump(this.props.year, this.props.month, -10)
  handleNextDecade = () =>
    this.handleJump(this.props.year, this.props.month, 10)

  render() {
    const {
      year,
      month,
      offset,
      className,
      onJump,
      hasNext,
      hasPrev,
      openMonthPicker,
      openYearPicker,
      monthSelector,
      yearSelector,
      ...props
    } = this.props

    const yearRangeStart = year - (year % 10 || 10) + 1

    return (
      <div {...props} className={classnames(className, 'jumper')}>
        {hasPrev ? (
          <div
            className={classnames('prev')}
            role="button"
            tabIndex={-1}
            onClick={yearSelector ? this.handlePrevDecade : this.handlePrev}
          >
            <Icon name={ChevronLeftSolid} />
          </div>
        ) : (
          <div className={classnames('prev', 'placeholder')} />
        )}
        {!monthSelector && !yearSelector && (
          <div onClick={openMonthPicker} className={classnames('jumper-text')}>
            {MONTHS_OF_YEAR[month]}
          </div>
        )}
        {!yearSelector && (
          <div onClick={openYearPicker} className={classnames('jumper-text')}>
            {year}
          </div>
        )}
        {yearSelector && (
          <div className={classnames('jumper-text')}>
            {`${yearRangeStart} - ${yearRangeStart + 9}`}
          </div>
        )}
        {hasNext ? (
          <div
            className={classnames('next')}
            role="button"
            tabIndex={-1}
            onClick={yearSelector ? this.handleNextDecade : this.handleNext}
          >
            <Icon name={ChevronRightSolid} />
          </div>
        ) : (
          <div className={classnames('next', 'placeholder')} />
        )}
      </div>
    )
  }
}
