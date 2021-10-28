import React, { PureComponent } from 'react'
import classnames from './small-step.module.scss'
import { Props as StepProps } from './step'
import Text from '@myntra/uikit-component-text'
import Layout from '@myntra/uikit-component-layout'
import StepSeparator from './step-separator'

export interface Props extends BaseProps, StepProps {
  /** Make label and description always visible */
  showLabel?: boolean
  /** className */
  className?: string
}

/**
 * Small step represents smaller tracking unites for the parent step
 *
 * @since 1.13.42
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/stepper/small-step
 */
export default class SmallStep extends PureComponent<Props> {
  render() {
    const {
      label,
      description,
      completed,
      error,
      orientation,
      showLabel,
      ...props
    } = this.props

    return (
      <div
        className={classnames('small-step', `small-step--${orientation}`, {
          'small-step--completed': completed,
          'small-step--error': error,
        })}
      >
        <StepSeparator
          orientation={orientation}
          className={classnames('small-step__left-separator')}
          completed={completed}
        />
        <div className={classnames('small-step__tooltip')}>
          <div className={classnames('small-step__indicator')} />
          <Layout
            type="row"
            gutter="none"
            className={classnames(
              'small-step__label',
              `small-step__label--${orientation}`,
              {
                'small-step__label--always-open': showLabel,
              }
            )}
          >
            <Text color="light">{label}</Text>
            {description && <Text.p color="light">{description}</Text.p>}
          </Layout>
        </div>
        <StepSeparator
          orientation={orientation}
          className={classnames('small-step__right-separator')}
          completed={completed}
        />
      </div>
    )
  }
}
