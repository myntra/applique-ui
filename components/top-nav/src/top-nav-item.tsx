import React, { PureComponent } from 'react'
import classnames from './top-nav-item.module.scss'
import Context, { TopNavContext } from './context'
import TopNavHover from './top-nav-hover'
import Icon from '@myntra/uikit-component-icon'

export interface Props extends BaseProps {
  className?: string
  title: string
  data?: any
  onClick?: any
  onMouseEnter?: any
  onMouseLeave?: any
}

/**
 * <Component description goes here>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

export default function TopNavItem({
  className,
  title,
  data,
  onClick,
  icon,
  isActive,
  ...props
}: Props) {
  return (
    <li
      className={classnames(
        'top-nav-label',
        className,
        isActive ? 'active-label' : null
      )}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onClick={onClick}
    >
      {icon ? <Icon className={classnames('icon')} name={icon} /> : null}
      {title}
    </li>
  )
}
