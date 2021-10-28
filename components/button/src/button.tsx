import React, { PureComponent, ReactNode } from 'react'
import Icon, { IconName } from '@myntra/uikit-component-icon'
import Text from '@myntra/uikit-component-text'
import Loader from '@myntra/uikit-component-loader'
import classnames from './button.module.scss'
import { CAN_USE_HOOKS } from '@myntra/uikit-can-i-use'

import Link from './link'
import HookLink from './link-hook'
import RouterLink from './router-link'
import HookRouterLink from './router-link-hook'

import Bell from 'uikit-icons/svgs/Bell'

export interface Props extends BaseProps {
  /** The visual style to convey purpose of the button. */
  type?: 'primary' | 'secondary' | 'link' | 'text'
  /** Will show the button as a notification button with the number of notifications. (provided)*/
  notifications?: number
  /** The label text of the button. */
  children?: string | ReactNode
  /** The handler to call when the button is clicked. */
  onClick?(event: MouseEvent): void
  /** The name of the icon (displayed on left side of content). */
  icon?: IconName
  /** The name of the icon (displayed on right side of content). */
  secondaryIcon?: IconName
  /** Disables the button (changes visual style and ignores button interactions). */
  disabled?: boolean
  /** Changes visual style to show progress. */
  loading?: boolean
  /** Uses current text color (useful for link buttons). */
  inheritTextColor?: boolean
  /** The 'type' attribute for the button element (as 'type' is used for defining visual type) */
  htmlType?: 'submit' | 'reset' | 'button'
  /** The URL to navigate to when the button is clicked (uses client side router). */
  to?: string | object
  /** The URL to navigate to when the button is clicked (uses browser anchor tag). */
  href?: string
  /** The transform attribute to transform button label. */
  transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase'
  /**
   * Size of the button
   */
  size?: 'small' | 'regular' | 'large'
  /**
   * Backgroud color for button
   */
  color?: string
  /** This will be used for large buttons */
  caption?: string
}

/**
 * Buttons are clickable items used to perform an action. Use buttons to trigger actions and links. Buttons can contain a combination of a clear label and an icon while links are always text.
 *
 * @since 0.0.0
 * @status READY
 * @category basic
 * @see http://uikit.myntra.com/components/button
 */
export default class Button extends PureComponent<Props> {
  static RouterLink = CAN_USE_HOOKS ? HookRouterLink : RouterLink
  static Link = CAN_USE_HOOKS ? HookLink : Link

  static propTypes = {
    __$validation({ to, href }) {
      if (to && href)
        throw new Error(`The props 'to' and 'href' cannot coexist.`)
    },
  }

  static defaultProps = {
    type: 'secondary',
    disabled: false,
    inheritTextColor: false,
    loading: false,
    transform: 'uppercase',
    size: 'regular',
  }

  state = {
    active: false,
  }

  clickCoolDown: number

  componentWillUnmount() {
    window.clearTimeout(this.clickCoolDown)
  }

  handleClick = (event) => {
    if (this.props.disabled || this.state.active || this.props.loading) {
      return event.preventDefault()
    }

    // show button press animation.
    this.setState({ active: true })
    this.clickCoolDown = window.setTimeout(
      () => this.setState({ active: false }),
      100
    )

    if (this.props.onClick) {
      return this.props.onClick(event)
    }
  }

  render() {
    const {
      icon,
      secondaryIcon,
      htmlType = 'button',
      className,
      type,
      to,
      state,
      href,
      disabled,
      inheritTextColor,
      loading,
      children,
      label,
      notifications,
      transform,
      size,
      color,
      caption,
      ...props
    } = this.props
    const Tag = (to ? Button.RouterLink : href ? Button.Link : 'button') as any
    const isNotificationButton = typeof notifications == 'number'
    const notificationsActive = isNotificationButton && notifications > 0
    const isIconButton = !(children || label) || isNotificationButton
    const needLeftSlot = !!icon || isIconButton
    const needRightSlot = !!secondaryIcon && !isIconButton
    const typeName =
      type === 'link' ? 'text' : notificationsActive ? 'primary' : type

    return (
      <Tag
        tabIndex={0} // enable tab navigation.
        {...props}
        type={type !== 'text' ? htmlType : ''}
        className={classnames('container', className, state, size, {
          [typeName]: size !== 'large' || !color,
          loading,
          inherit: inheritTextColor,
          icon: isIconButton,
          'notification-button': isNotificationButton,
          [color]: !!color,
        })}
        to={to}
        href={href}
        disabled={disabled || loading}
        role="button"
        onClick={this.handleClick}
        data-test-id="target"
        style={{
          textTransform: transform,
        }}
      >
        {needLeftSlot && (
          <span
            className={classnames(
              'icon',
              { leading: !isIconButton },
              { 'notification-icon': notificationsActive }
            )}
            data-test-id="primary-icon"
          >
            {notificationsActive && (
              <span
                className={classnames('count')}
                title={notifications.toString()}
              >
                {notifications > 99 ? '99+' : notifications}
              </span>
            )}
            <Icon name={icon || Bell} aria-hidden="true" />
          </span>
        )}
        {isIconButton ? null : children || label}
        {needRightSlot && (
          <span
            className={classnames('icon', 'trailing')}
            data-test-id="secondary-icon"
          >
            <Icon
              name={secondaryIcon}
              aria-hidden="true"
              className={classnames('button-icon')}
            />
          </span>
        )}

        {loading && (
          <Loader
            className={classnames('loading')}
            type="inline"
            appearance="spinner"
          />
        )}
        {size === 'large' && (
          <Text.caption className={classnames('caption')}>
            {caption}
          </Text.caption>
        )}
      </Tag>
    )
  }
}
