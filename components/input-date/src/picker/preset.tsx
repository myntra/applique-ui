import React, { PureComponent } from 'react'
import classnames from './preset.module.scss'
import { isDateEqual } from '../input-date-utils'
import { DateRange, Preset, isDateRange } from '../input-date-helpers'

export interface Props extends BaseProps {
  value: DateRange | Date
  presets: Array<Preset> | boolean
  range?: boolean
  onChange(value: Date | DateRange): void
}

export default class PresetView extends PureComponent<Props> {
  static defaultProps = {
    range: true,
  }

  handleChange = (preset: Preset) => {
    return this.props.onChange(this.normalize(preset.value()))
  }

  normalize = (value: DateRange | Date) => {
    if (this.props.range && value instanceof Date) {
      return { from: value, to: value }
    }

    return value
  }

  isActive = (preset: Preset) => {
    if (!isDateRange(this.props.value, this.props.range)) {
      return isDateEqual(this.props.value, preset.value())
    }

    const value: any = this.normalize(preset.value())
    return (
      this.props.value &&
      isDateEqual(this.props.value.from, value.from) &&
      isDateEqual(this.props.value.to, value.to)
    )
  }

  render() {
    const { presets } = this.props
    return (
      <div className={classnames('presets')}>
        {presets
          // @ts-ignore
          .filter(
            (preset: Preset) =>
              preset.range === undefined || preset.range === this.props.range
          )
          .map((preset) => (
            <div
              key={preset.label}
              onClick={() => this.handleChange(preset)}
              className={classnames('preset', {
                active: this.isActive(preset),
              })}
            >
              {preset.label}
            </div>
          ))}
      </div>
    )
  }
}
