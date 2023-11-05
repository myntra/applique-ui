import React, {
  PureComponent,
  ReactNode,
  Children,
  isValidElement,
  cloneElement,
} from 'react'
import Text from '@applique-ui/text'
import Layout from '@applique-ui/layout'
import Icon from '@applique-ui/icon'
import classnames from './step.module.scss'

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
  description?: string | ReactNode
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
      active,
      ...props
    } = this.props
    return (
      <div className={classnames(
        'step',
        `step--${orientation}`, {
        'step--completed': completed,
      })
      }>
        <Layout type={orientation === 'vertical' ? "stack" : "row"} className={classnames('step__content')}>
          <div
            className={classnames('step__indicator', `step__indicator--${orientation}`, {
              'step__indicator--completed': completed,
              'step__indicator--has-small-step': !!children.length,
              'step__indicator--active': active,
              'step__indicator--error': error,
            })}
          >
            <div className={classnames('step__indicator--icon')}>
              {completed && (
                <Icon
                  name={CheckSolid}
                  color="light"
                  className={classnames('step__indicator--icon--design')}
                />
              )}
              {error && (
                <Icon
                  name={TimesSolid}
                  color="light"
                  className={classnames('step__indicator--icon--design')}
                />
              )}
            </div>
          </div>
          <Layout
            type="row"
            gutter="none"
            className={classnames('step__label', `step__label--${orientation}`)}
          >
            <Text.H4
              emphasis={completed || active ? 'high' : 'disabled'}
              weight={active ? 'bolder' : null}
              className={classnames('step__label--heading')}
            >
              {label}
            </Text.H4>
            {typeof description === 'string' ? (
              <Text.p
                emphasis={completed || active ? 'high' : 'disabled'}
                weight={active ? 'bolder' : null}
              >
                {description}
              </Text.p>
            ) : <div className={classnames('step__label--description')}>{description}</div>}
          </Layout>
        </Layout>
        {Children.map(children, (child: any, index) =>
          cloneElement(child, {
            'data-index': `step.${this.props['data-index']}.${index}`,
            orientation,
            children: null,
            active:
              active &&
              index ===
              children.findIndex((child) => !child.props.completed),
          })
        )}
      </div>
    )
  }
}
