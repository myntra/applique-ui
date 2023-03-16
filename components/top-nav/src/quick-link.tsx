import React, { PureComponent } from 'react'
import Icon from '@applique-ui/icon'

import classnames from './quick-link.module.scss'
import { QUICKLINK_BUTTON_TYPE } from './config'

const isSideNav = window.matchMedia('(min-width: 576px)').matches ? false : true

interface QuickLinkHoverProps extends BaseProps {
  link: LinkInterface
  parentPositions: {
    bottom: number
    right: number
  }
  enableQuickLinkHover: Function
  disableQuickLinkHover: Function
}

interface QuickLinkHoverState {
  left: number
}

export interface LinkInterface {
  icon: Node
  renderFunction: Function
  type: String
}

export interface QuickLinkProps extends BaseProps {
  link: LinkInterface
}

interface QuickLinkState {
  quickLinkHover: boolean
}

/**
 * <Component handles the render logic and other functionalities for showing the quick lick view>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

class QuickLinkHover extends PureComponent<
  QuickLinkHoverProps,
  QuickLinkHoverState
> {
  constructor(props) {
    super(props)
    this.state = {
      left: 0,
    }
  }

  componentDidMount(): void {
    isSideNav
      ? this.setState({ left: 0 })
      : this.setState({
          left:
            this.props.parentPositions.right -
            this.quickLinkHoverItemRef.offsetWidth,
        })
  }

  quickLinkHoverItemRef = null

  render() {
    const {
      link,
      parentPositions,
      enableQuickLinkHover,
      disableQuickLinkHover,
    } = this.props
    return (
      <div
        ref={(ref) => {
          this.quickLinkHoverItemRef = ref
        }}
        className={classnames('quick-link-hover-container')}
        style={{
          top: `${parentPositions.bottom}px`,
          left: `${this.state.left}px`,
        }}
      >
        {link.renderFunction &&
          link.renderFunction({
            enableQuickLinkHover: enableQuickLinkHover,
            disableQuickLinkHover: disableQuickLinkHover,
          })}
      </div>
    )
  }
}

export default class QuickLink extends PureComponent<
  QuickLinkProps,
  QuickLinkState
> {
  constructor(props) {
    super(props)
    this.state = {
      quickLinkHover: false,
    }
  }

  overlayButtonRef = null

  enableQuickLinkHover = () => this.setState({ quickLinkHover: true })

  disableQuickLinkHover = () => this.setState({ quickLinkHover: false })

  render() {
    const { link } = this.props
    return (
      <div className={classnames('quick-link')}>
        <button
          ref={(ref) => {
            this.overlayButtonRef = ref
          }}
          onClick={this.enableQuickLinkHover}
          className={
            link.type === QUICKLINK_BUTTON_TYPE.PRIMARY
              ? classnames(
                  'quick-link-icon-button',
                  this.state.quickLinkHover
                    ? 'quick-link-icon-button-active'
                    : null
                )
              : classnames(
                  'quick-link-icon-button-secondary',
                  this.state.quickLinkHover
                    ? 'quick-link-icon-button-secondary-active'
                    : null
                )
          }
        >
          <Icon name={link.icon} fontSize="small" />
        </button>

        {this.state.quickLinkHover && (
          <QuickLinkHover
            link={link}
            parentPositions={{
              bottom:
                this.overlayButtonRef.offsetTop +
                this.overlayButtonRef.offsetHeight,
              right:
                this.overlayButtonRef.offsetLeft +
                this.overlayButtonRef.offsetWidth,
            }}
            enableQuickLinkHover={this.enableQuickLinkHover}
            disableQuickLinkHover={this.disableQuickLinkHover}
          />
        )}

        {this.state.quickLinkHover && (
          <span
            onClick={this.disableQuickLinkHover}
            className={classnames('quick-link-overlay')}
          ></span>
        )}

        {this.state.quickLinkHover && (
          <span
            style={{
              top: `${this.overlayButtonRef.offsetTop +
                this.overlayButtonRef.offsetHeight}px`,
            }}
            className={classnames('quick-link-overlay-section')}
            onClick={this.disableQuickLinkHover}
          />
        )}
      </div>
    )
  }
}
