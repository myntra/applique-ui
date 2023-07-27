import React, { PureComponent } from 'react'
import TimeInput from './time-input'
import classnames from './time.module.scss'
export interface Props extends BaseProps {
  /** hour to display */
  hour?: number
  /** minute to display */
  minute?: number
  /** hour, minute, type change event */
  onTimeSelect?: (hour: number, minute: number, active: string) => void
  /** hour, minute blur event */
  onBlur?: (hour: number, minute: number) => void
}

export default class Time extends PureComponent<
  Props,
  {
    hour: number
    /** minute to display */
    minute: number
  }
> {
  state = {
    hour: this.props.hour || 0,
    minute: this.props.minute || 0,
  }

  handleChange = (item: string) => (value: number) => {
    const min = 0
    const max = item === 'hour' ? 23 : 59
    // let value = parseInt(e.currentTarget.value, 10);

    if (isNaN(value)) {
      value = 0
    }

    if (max < value) {
      value = max
    }

    if (min > value) {
      value = min
    }

    this.setState(
      {
        ...this.state,
        [item]: value,
      },
      () => this.invokeOnChange()
    )
  }

  handleUp = (item: string) => () => {
    const max = item === 'hour' ? 23 : 59

    const value = this.state[item]

    this.setState(
      {
        ...this.state,
        [item]: Math.min(value + 1, max),
      },
      () => this.invokeOnChange()
    )
  }

  handleDown = (item: string) => () => {
    const min = 0
    const value = this.state[item]
    this.setState(
      {
        ...this.state,
        [item]: Math.max(value - 1, min),
      },
      () => this.invokeOnChange()
    )
  }

  handleBlur = () => {
    const { onBlur } = this.props
    const { hour, minute } = this.state
    // ifExistCall(onBlur, hour, minute);
  }

  invokeOnChange = () => {
    const { onTimeSelect, active } = this.props
    const { hour, minute } = this.state
    onTimeSelect(hour, minute, active)
  }

  render() {
    const { hour, minute } = this.state
    const { disabledTime } = this.props
    return (
      <div className={classnames('time__container')}>
        <TimeInput
          onUp={this.handleUp('hour')}
          onDown={this.handleDown('hour')}
          onChange={this.handleChange('hour')}
          onBlur={this.handleBlur}
          value={hour}
          disabled={disabledTime}
        />
        <div className={classnames('time__seperator')}>:</div>
        <TimeInput
          onUp={this.handleUp('minute')}
          onDown={this.handleDown('minute')}
          onChange={this.handleChange('minute')}
          onBlur={this.handleBlur}
          value={minute}
          disabled={disabledTime}
        />
      </div>
    )
  }
}
