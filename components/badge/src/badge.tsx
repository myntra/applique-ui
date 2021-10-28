import React from 'react'

import classnames from './badge.module.scss'

interface Props extends BaseProps {
  /** The visual style to convey purpose of the badge. */
  type?: 'primary' | 'success' | 'warning' | 'error' | 'incomplete'
  /** The label text of the badge. */
  children: string
  /**
   * Size of the badge
   */
  size?: 'small' | 'regular' | 'large'
  /**
   * Variant  of the badge
   */
  variant: 'solid' | 'outlined'
}

/**
 * Displays an information pill/badge.
 *
 * @since 0.8.0
 * @status REVIEWING
 * @category basic
 */
export default function Badge({
  type,
  children,
  className,
  size,
  variant,
  ...props
}: Props): JSX.Element {
  return (
    <div
      {...props}
      className={classnames('badge', size, type, variant, className)}
    >
      {typeof children === 'string' ? (
        <span className={classnames('content')}>{children}</span>
      ) : (
        children
      )}
    </div>
  )
}

Badge.defaultProps = {
  type: 'primary',
  size: 'regular',
  variant: 'solid',
}
