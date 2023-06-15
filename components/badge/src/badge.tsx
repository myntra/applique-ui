import React from 'react'

import Icon, { IconName } from '@applique-ui/icon'
import Button from '@applique-ui/button'
import TimesSolid from 'uikit-icons/svgs/TimesSolid'
import classnames from './badge.module.scss'

interface Props extends BaseProps {
  /** The visual style to convey purpose of the badge. */
  type?: 'info' | 'success' | 'warning' | 'error'
  /** The label text of the badge. */
  children: string
  /**
   * Variant  of the badge
   */
  variant: 'solid' | 'outlined'
  icon?: IconName
  onClose?: () => void
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
  icon,
  onClose,
  ...props
}: Props): JSX.Element {
  const badgeSmallWithIcon = (icon || onClose) && size === 'small'
  return (
    <div
      {...props}
      className={classnames('badge', size, type, variant, className)}
    >
      <div className={classnames('container')}>
        {icon && <Icon className={classnames('icon')} name={icon} />}
        {typeof children === 'string' ? (
          <span className={classnames('content')}>{children}</span>
        ) : (
          children
        )}
        {onClose && (
          <Button
            className={classnames('close')}
            type="link"
            icon={TimesSolid}
            inheritTextColor
            onClick={onClose}
            data-test-id="close"
          />
        )}
      </div>
    </div>
  )
}

Badge.defaultProps = {
  type: 'info',
  size: 'regular',
  variant: 'solid',
}
