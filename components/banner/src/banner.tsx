import React, { PureComponent } from 'react'
import Icon, { IconName } from '@applique-ui/icon'
import Button from '@applique-ui/button'
import classnames from './banner.module.scss'
import Actionable from './actionable'
import { ICONS, Link, RE_BACKWARD_COMPAT } from './constants'
import TimesSolid from 'uikit-icons/svgs/TimesSolid'
import ChevronRightSolid from 'uikit-icons/svgs/ChevronRightSolid'

export interface Props extends BaseProps {
  /**
   * The visual style to convey purpose of the alert.
   */
  color?: 'error' | 'warning' | 'success' | 'info'
  /**
   *
   * _TIP:_ Set `icon` to `null` to remove icon.
   *
   * @since 1.6.0
   */
  icon?: IconName
  /**
   * @since 1.6.0
   */
  title?: string
  /**
   * The handler to call when the alert box is dismissed.
   */
  onClose?: () => void
  /**
   * The message/body of the alert box.
   */
  children: string | JSX.Element
  /**
   * If you need to add link to the banner
   */

  link?: Link
}

// Design: https://zpl.io/bA7ZRWp
// Documentation: https://zpl.io/bJGxg6E

/**
 * Informs users about important changes.
 * Use this component if you need to communicate to users in a prominent way.
 * Banners are placed at the top of the page or section they apply to, and below the page or section header.
 *
 * @since 1.6.0
 * @status READY
 * @category basic
 * @see https://uikit.myntra.com/components/alert
 */

export default class Banner extends PureComponent<Props> {
  static Actionable = Actionable

  static defaultProps = {
    color: 'info',
  }

  render() {
    const {
      className,
      icon,
      title,
      solid,
      onClose,
      noFill,
      children,
      link,
      color,
      ...props
    } = this.props

    const typeName = color
    const heading = title || children
    const body = title ? children : null
    const iconName = icon === undefined ? ICONS[color] : icon

    return (
      <div
        {...props}
        className={classnames('container', typeName, className)}
        role="alert"
      >
        {iconName ? (
          <Icon
            className={classnames(`icon-${typeName}`, { top: !!body })}
            name={iconName}
          />
        ) : null}
        <div className={classnames('content')}>
          <div className={classnames('title')}>{heading}</div>
          <div className={classnames('fullBody')}>
            {body ? <div className={classnames('body')}>{body}</div> : null}
            {link?.href && (
              <a
                href={link.href}
                target="_blank"
                className={classnames('text-link')}
              >
                {link.displayText}{' '}
                <Icon
                  className={classnames('icon-link')}
                  name={ChevronRightSolid}
                />
              </a>
            )}
          </div>
        </div>

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
    )
  }
}
