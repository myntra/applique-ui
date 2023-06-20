import React, { ReactNode } from 'react'
import classnames from './tab.module.scss'

export interface Props extends BaseProps {
  isActive: boolean
  title: ReactNode
  className?: string
  disabled: boolean
  type: string
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
  disabled = false,
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
