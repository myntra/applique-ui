import React, { PureComponent, ReactNode } from 'react'

import classnames from './day.module.scss'
import { UTCDate } from '../input-date-utils'

export interface Props extends BaseProps {
  year: number
  month: number
  day: number

  focused?: boolean
  disabled?: boolean
  selected?: boolean

  isSelectionStart?: boolean
  isSelectionEnd?: boolean

  onSelect?(date: Date): void
  onFocus?(date: Date): void

  children?(props: { date: Date; children: ReactNode }): ReactNode
}

/**
 * @since 0.0.0
 * @status REVIEWING
 */
export default class Day extends PureComponent<Props> {
  static propTypes = {
    _isValidDate(props) {
      const names = ['year', 'month', 'day']

      if (props.day === 0) return

      if (names.every((name) => typeof props[name] === 'number')) {
        if (
          Number.isNaN(UTCDate(props.year, props.month, props.day).getTime())
        ) {
          throw new Error(`Invalid date`)
        }
      }
    },
  }

  dragging: boolean

  get date() {
    return UTCDate(this.props.year, this.props.month, this.props.day)
  }

  get isEmpty() {
    return this.props.day === 0 || Number.isNaN(this.date.getTime())
  }

  handleFocus = () => {
    if (this.props.onFocus) {
      if (this.isEmpty || this.props.disabled) {
        this.props.onFocus(null)
      } else if (!this.props.focused) {
        this.props.onFocus(this.date)
      }
    }
  }

  handleBlur = () => {
    if (this.props.onFocus && this.props.focused) {
      this.props.onFocus(null)
    }
  }

  handleMouseDown = (event) => {
    if (this.props.disabled) {
      event.stopPropagation()
    } else if (this.props.onSelect && !this.isEmpty) {
      this.props.onSelect(this.date)
    }
  }

  handleMouseEnter = () => this.handleFocus()
  handleMouseLeave = () => this.handleBlur()

  handleTouchStart = () => {
    this.dragging = false
  }
  handleTouchMove = () => {
    this.dragging = true
  }
  handleTouchEnd = (event) => {
    if (this.dragging) return

    this.handleMouseDown(event)
  }

  render() {
    const { date, isEmpty } = this
    const {
      disabled,
      focused,
      selected,
      isSelectionEnd,
      isSelectionStart,
      children,
      className,
    } = this.props
    const isToday =
      !isEmpty && date.toDateString() === new Date().toDateString()

    return (
      <div
        className={classnames('day', className, {
          focused,
          selected,
          start: selected && isSelectionStart,
          end: selected && isSelectionEnd,
          empty: isEmpty,
          today: isToday,
          disabled: disabled,
        })}
        aria-hidden={isEmpty}
        title={isEmpty ? null : this.date.toDateString()}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        {isEmpty
          ? null
          : typeof children === 'function'
          ? children({
              date,
              children: date.getUTCDate(),
            })
          : date.getUTCDate()}
      </div>
    )
  }
}
