import React, { PureComponent } from 'react'
import Icon from '@myntra/uikit-component-icon'

import classnames from './quick-link.module.scss'
import { QUICKLINK_BUTTON_TYPE } from './config'

export interface LinkInterface {
  icon: Node
  renderFunction: Function,
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
          <div
            className={classnames('quick-link-hover-container')}
            style={{
              top: `${this.overlayButtonRef.getBoundingClientRect().bottom}px`,
              right: `${window.innerWidth -
                this.overlayButtonRef.getBoundingClientRect().right}px`,
            }}
          >
            {link.renderFunction &&
              link.renderFunction({
                enableQuickLinkHover: this.enableQuickLinkHover,
                disableQuickLinkHover: this.disableQuickLinkHover,
              })}
          </div>
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
              top: `${this.overlayButtonRef.getBoundingClientRect().bottom}px`,
            }}
            className={classnames('quick-link-overlay-section')}
            onClick={this.disableQuickLinkHover}
          />
        )}
      </div>
    )
  }
}
