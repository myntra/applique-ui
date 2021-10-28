import React, { Children, isValidElement } from 'react'

import classnames from './row-layout.module.scss'

export interface Props extends BaseProps {
  type: 'row'

  /**
   * Regulates the size of the gutter between items.
   */
  gutter?: 'small' | 'medium' | 'large' | 'none'
}

/**
 * A layout which organizes it's children vertically.
 */
export default function RowLayout({
  type,
  className,
  children,
  gutter,
  ...props
}: Props) {
  return (
    <div {...props} className={classnames('row', className, gutter)}>
      {children}
    </div>
  )
}

RowLayout.defaultProps = {
  gutter: 'medium',
}
