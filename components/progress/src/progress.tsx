import React, { PureComponent } from 'react'

import ProgressBar, { Props as ProgressBarProps } from './progress-bar'
import ProgressCircle, { Props as ProgressCircleProps } from './progress-circle'

export type Props =
  | ({
      /**
       * Type of progress view (bar or circular).
       */
      type: 'bar'
      showValue?: boolean
    } & ProgressBarProps)
  | ({ type: 'circle' } & ProgressCircleProps)

/**
 * A component to display loading progress.
 *
 * @since 0.6.0
 * @status READY
 * @category basic
 * @see http://uikit.myntra.com/components/progress
 */
export default class Progress extends PureComponent<Props> {
  static Bar = ProgressBar
  static Circle = ProgressCircle

  render() {
    const { type, ...props } = this.props
    return type === 'bar' ? (
      <ProgressBar {...props} />
    ) : type === 'circle' ? (
      <ProgressCircle {...props} />
    ) : null
  }
}
