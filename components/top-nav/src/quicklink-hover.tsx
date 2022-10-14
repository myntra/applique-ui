import React, { PureComponent } from 'react'
import classnames from './quicklink-hover.module.scss'
import Context, { TopNavContext } from './context'

export interface Props extends BaseProps {
  classname?: string
  renderFunction?: any
  position?: any
}

/**
 * <Component description goes here>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

export default class QuickLinkHover extends PureComponent<Props, {}> {
  render() {
    const renderItem = this.props.renderFunction()
    const { position } = this.props
    const { right, bottom } = position
    return (
      <div
        className={classnames('quicklink-hover-container')}
        style={{ left: `${right - 250}px`, top: bottom }}
      >
        {renderItem}
      </div>
    )
  }
}
