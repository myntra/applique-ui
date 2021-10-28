import React, { PureComponent, ReactNode } from 'react'
import classnames from './step-separator.module.scss'

export interface Props extends BaseProps {
  /** @private */
  className?: string
}

/**
 * Connector between the steps
 *
 * @since 1.13.42
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/stepper/step-separator
 */
export default class StepSeparator extends PureComponent<Props> {
  render() {
    const {
      orientation,
      children,
      hasSmallSteps,
      completed,
      className,
    } = this.props
    return (
      <div
        className={classnames(
          className,
          'step-separator',
          `step-separator--${orientation}`,
          {
            'step-separator--has-small-steps': hasSmallSteps,
            'step-separator--completed': completed,
          }
        )}
      >
        {children}
      </div>
    )
  }
}
