import React, { PureComponent, ReactNode } from 'react'
import classnames from './month.module.scss'

const months = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(
  ','
)
const shortMonths = months.map((month) => month.substr(0, 3))

export interface Props extends BaseProps {
  value?: number
  onChange?(value: number): void
  highlight?(
    month: number
  ): 'info' | 'danger' | 'warning' | 'success' | 'disabled' | null
  renderMonth?(props: { month: string; index: number }): ReactNode
}

/**
 * An embeddable month selection component.
 *
 * @since 0.7.0
 * @status REVIEWING
 * @category input
 * @see http://uikit.myntra.com/components/input-month#inputmonthpickermonth
 */
export default class InputMonthPickerMonth extends PureComponent<Props> {
  static propTypes = {
    _validate({ value }) {
      if (typeof value === 'number' && (value < 1 || value > 12)) {
        throw new Error(`'value' should be a numeric value between 1 and 12.`)
      }
    },
  }

  static defaultProps = {
    highlight() {
      return null
    },
  }

  render() {
    const value = this.props.value ? this.props.value - 1 : null

    return (
      <div className={classnames('month-container', this.props.className)}>
        {months.map((month, index) => (
          <div
            key={index}
            className={classnames('month', this.props.highlight(index + 1), {
              selected: index === value,
              disabled: this.props.highlight(index + 1) === 'disabled',
            })}
            onClick={() => this.props.onChange(index + 1)}
          >
            {this.props.renderMonth ? (
              this.props.renderMonth({ month, index })
            ) : (
              <div>
                <div className={classnames('month-number')}>
                  {`${index + 1}`.padStart(2, '0')}
                </div>
                <div>({shortMonths[index]})</div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }
}
