import React, { PureComponent } from 'react'

import Month from './jumper/month'
import Year from './jumper/year'
import classnames from './jumper.module.scss'
import { UTCDate } from '../input-date-utils'
import Icon from '@myntra/uikit-component-icon'
import ChevronLeftSolid from 'uikit-icons/svgs/ChevronLeftSolid'
import ChevronRightSolid from 'uikit-icons/svgs/ChevronRightSolid'

export interface Props extends BaseProps {
  year: number
  month: number
  offset: number
  onJump(date: Date): void
  hasPrev?: boolean
  hasNext?: boolean
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
    const date = UTCDate(year, month, 1)

    date.setMonth(date.getUTCMonth() + diff - this.props.offset)

    this.props.onJump(date)
  }
  handleNext = () => this.handleJump(this.props.year, this.props.month, 1)
  handlePrev = () => this.handleJump(this.props.year, this.props.month, -1)
  handleYearSelect = (year) => this.handleJump(year, this.props.month)
  handleMonthSelect = (month) => this.handleJump(this.props.year, month)

  render() {
    const {
      year,
      month,
      offset,
      className,
      onJump,
      hasNext,
      hasPrev,
      ...props
    } = this.props

    return (
      <div {...props} className={classnames(className, 'jumper')}>
        {hasPrev ? (
          <div
            className={classnames('prev')}
            role="button"
            tabIndex={-1}
            onClick={this.handlePrev}
          >
            <Icon name={ChevronLeftSolid} />
          </div>
        ) : (
          <div className={classnames('prev', 'placeholder')} />
        )}
        <Month
          value={month}
          onChange={this.handleMonthSelect}
          className={classnames('select')}
        />
        <Year
          className={classnames('select')}
          value={year}
          onChange={this.handleYearSelect}
        />
        {hasNext ? (
          <div
            className={classnames('next')}
            role="button"
            tabIndex={-1}
            onClick={this.handleNext}
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
