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
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={classnames('tab', className, { active: isActive })}
    >
      {title}
    </div>
  )
}
