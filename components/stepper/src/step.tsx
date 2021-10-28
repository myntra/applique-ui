import React, {
  PureComponent,
  ReactNode,
  Children,
  isValidElement,
  cloneElement,
} from 'react'
import Text from '@myntra/uikit-component-text'
import Layout from '@myntra/uikit-component-layout'
import Icon from '@myntra/uikit-component-icon'
import classnames from './step.module.scss'
import StepSeparator from './step-separator'

import TimesSolid from 'uikit-icons/svgs/TimesSolid'
import CheckSolid from 'uikit-icons/svgs/CheckSolid'

export interface Props extends BaseProps {
  /**
   * Orientation of the step ccomponent
   */
  orientation?: 'vertical' | 'horizontal'
  /** className */
  className?: string
  /** Label or title text */
  label: string
  /** Small description if required */
  description?: string
  /** Boolean to set if step error's out */
  error?: boolean
  /** Boolean to set if step is completed */
  completed?: boolean
}

/**
 * Step represents a single step on the tracker
 *
 * @since 1.13.42
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/stepper/step
 */
export default class Step extends PureComponent<Props> {
  /**
   * Your code goes here
   */
  static Separator = StepSeparator
  render() {
    const children: any = Children.toArray(
      this.props.children
    ).filter((child) => isValidElement(child))

    const {
      label,
      description,
      completed,
      error,
      className,
      orientation,
      hasSeparator,
      active,
      ...props
    } = this.props
    return (
      <div className={classnames('step', `step--${orientation}`)}>
        <div
          className={classnames('step__item', `step__item--${orientation}`, {
            'step__item--completed': completed,
            'step__item--has-small-step': !!children.length,
            'step__item--active': active,
            'step__item--error': error,
          })}
        >
          <div className={classnames('step__indicator')}>
            {completed && (
              <Icon
                name={CheckSolid}
                color="light"
                className={classnames('step__icon')}
              />
            )}
            {error && (
              <Icon
                name={TimesSolid}
                color="light"
                className={classnames('step__icon')}
              />
            )}
          </div>
          {hasSeparator && (
            <StepSeparator
              orientation={orientation}
              hasSmallSteps={!!children.length}
              completed={completed}
            >
              {Children.map(children, (child: any, index) =>
                cloneElement(child, {
                  'data-index': `step.${this.props['data-index']}.${index}`,
                  orientation,
                  children: null,
                })
              )}
            </StepSeparator>
          )}
          {!!children.length && completed && (
            <div className={classnames('step__half-complete')} />
          )}
        </div>
        <Layout
          type="row"
          gutter="none"
          className={classnames('step__label', `step__label--${orientation}`)}
        >
          <Text emphasis={completed || active ? 'high' : 'disabled'}>
            {label}
          </Text>
          {description && (
            <Text.p emphasis={completed || active ? 'high' : 'disabled'}>
              {description}
            </Text.p>
          )}
        </Layout>
      </div>
    )
  }
}
