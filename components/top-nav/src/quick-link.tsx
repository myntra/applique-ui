import React, { PureComponent } from 'react'
import Icon from '@myntra/uikit-component-icon'

import classnames from './quick-link.module.scss'

export interface LinkInterface {
  icon: Node
  renderFunction: Function
}

export interface QuickLinkProps extends BaseProps {
  link: LinkInterface
}

interface QuickLinkState {
  quickLinkHover: boolean
}

/**
 * <Component description goes here>
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

  enableQuickLinkHover = () => this.setState({ quickLinkHover: true })

  disableQuickLinkHover = () => this.setState({ quickLinkHover: false })

  render() {
    const { link } = this.props
    return (
      <React.Fragment>
        <button
          onClick={this.enableQuickLinkHover}
          className={classnames('quick-link-icon-button')}
        >
          <Icon name={link.icon} fontSize="small" />
          {this.state.quickLinkHover && (
            <div className={classnames('quick-link-hover-container')}>
              {link.renderFunction({
                enableQuickLinkHover: this.enableQuickLinkHover,
                disableQuickLinkHover: this.disableQuickLinkHover,
              })}
            </div>
          )}
        </button>
        {this.state.quickLinkHover && (
          <button
            onClick={this.disableQuickLinkHover}
            className={classnames('quick-link-overlay')}
          />
        )}
      </React.Fragment>
    )
  }
}
