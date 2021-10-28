import React, { Component, Fragment, cloneElement, ReactElement } from 'react'
import AccordionContext from './accordion-context'

/* eslint-disable */
const FragmentWithFallback =
  Fragment ||
  (({ children }) => <div style={{ display: 'contents' }}>{children}</div>)
/* eslint-enable */

export interface Props extends BaseProps {
  /**
   * The title or always visible part of the accordion item.
   */
  title: ReactElement | string
}

/**
 * @since 0.3.0
 * @status REVIEWING
 * @see http://uikit.myntra.com/components/accordion#AccordionItem
 */
export default class AccordionItem extends Component<Props> {
  index: number

  render() {
    const { title, children, ...props } = this.props

    return (
      <AccordionContext.Consumer>
        {({ getIndex, active, onActivation }) => {
          const index = (this.index = getIndex(this))

          return (
            <FragmentWithFallback>
              {cloneElement(
                typeof title === 'string' ? <div>{title}</div> : title,
                {
                  onClick: () => onActivation(index),
                  'data-accordion-index': index,
                  ...props,
                }
              )}
              {active === index && children}
            </FragmentWithFallback>
          )
        }}
      </AccordionContext.Consumer>
    )
  }
}
