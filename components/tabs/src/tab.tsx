import React, { ReactNode } from 'react'
import classnames from './tab.module.scss'

export interface Props extends BaseProps {
  title: ReactNode
}

/**
 *
 */
export default function Tab({
  isActive,
  title,
  className,
  children,
  type,
  disabled,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={classnames('tab', className, type, {
        active: isActive,
        disabled,
      })}
    >
      {title}
    </div>
  )
}
