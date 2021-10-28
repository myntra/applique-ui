import React, { Children, isValidElement, ReactElement } from 'react'
import Button from '@myntra/uikit-component-button'

import classnames from './section.module.scss'

export interface Props extends BaseProps {
  title: string

  noPadding: boolean
}

// TODO: Extract it to utils package.
function isReactNodeType<T = any>(node: any, type: T): node is ReactElement {
  if (!isValidElement(node)) return false
  if (node.type === (type as any)) return true
  if ((node.type as any)._result === type) return true
  return false
}

/**
 * A building block of the page layout.
 *
 * @since 0.7.0
 * @status REVIEWING
 * @category layout
 * @see http://uikit.myntra.com/components/section
 */
export default function Section({
  className,
  title,
  noPadding,
  children,
  ...props
}: Props) {
  const actions = []
  const others = []

  Children.forEach(children, (child) => {
    if (isReactNodeType(child, Button)) {
      actions.push(child)
    } else if (child) {
      others.push(child)
    }
  })

  return (
    <section
      className={classnames('container', className, { noPadding })}
      {...props}
    >
      {title || actions.length ? (
        <header className={classnames('header')}>
          {title && <h3 className={classnames('title')}>{title}</h3>}
          {actions.length ? (
            <div className={classnames('actions')}>{actions}</div>
          ) : null}
        </header>
      ) : null}

      {others.length ? (
        <div className={classnames('content')}>{others}</div>
      ) : null}
    </section>
  )
}

Section.defaultProps = {
  noPadding: false,
}
