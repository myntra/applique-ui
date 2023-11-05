import React, { PureComponent } from 'react'
import classnames from './small-step.module.scss'
import { Props as StepProps } from './step'
import Text from '@applique-ui/text'
import Layout from '@applique-ui/layout'

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
      active,
      ...props
    } = this.props

    return (
      <div
        className={classnames('small-step', `small-step--${orientation}`, {
          'small-step--completed': completed,
          'small-step--error': error,
        })}
      >
        <div className={classnames('small-step__tooltip')}>
          <div className={classnames('small-step__indicator', `small-step__indicator--${orientation}`)} />
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
            <Text.p
              color={orientation === 'horizontal' ? 'light' : 'dark'}
              weight={active ? 'bolder' : null}
              className={classnames('small-step__label--heading')}
            >
              {label}
            </Text.p>
            {description && (
              <Text.p
                color={orientation === 'horizontal' ? 'light' : 'dark'}
                weight={active ? 'bolder' : null}
              >
                {description}
              </Text.p>
            )}
          </Layout>
        </div>
      </div>
    )
  }
}
