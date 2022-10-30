import React, { PureComponent } from 'react'
import Icon from '@myntra/uikit-component-icon'

import classnames from './top-nav-item.module.scss'
import TopNavHover from './top-nav-hover'

export interface TopNavItemProps extends BaseProps {
  itemData?: {
    icon: Node
    label: string
    config: Array<any>
    dispatchFunctionObject: Object
  }
  isActive?: boolean
}

interface TopNavItemState {
  isHovering: boolean
}

/**
 * <Component description goes here>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

export default class TopNavItem extends PureComponent<
  TopNavItemProps,
  TopNavItemState
> {
  constructor(props) {
    super(props)
    this.state = {
      isHovering: false,
    }
  }

  tabItemRef = null

  enableHover = () => this.setState({ isHovering: true })

  disableHover = () => this.setState({ isHovering: false })

  handleNavItemClick = () =>
    this.props.dispatchFunction(this.props.itemData.dispatchFunctionObject)

  handleSubNavItemClick = (dispatchFunctionObject) =>
    this.props.dispatchFunction(dispatchFunctionObject)

  render() {
    const { itemData, isActive } = this.props

    return (
      <button
        ref={(ref) => {
          this.tabItemRef = ref
        }}
        className={classnames(
          'top-nav-button',
          isActive ? 'top-nav-button-active' : null
        )}
        onMouseEnter={this.enableHover}
        onMouseLeave={this.disableHover}
        onClick={this.handleNavItemClick}
      >
        {itemData.icon && (
          <Icon
            className={classnames('top-nav-button-icon')}
            name={itemData.icon}
          />
        )}
        {itemData.label}
        {this.state.isHovering && itemData.config && (
          <TopNavHover
            navTabConfig={itemData.config}
            disableHover={this.disableHover}
            handleSubNavItemClick={this.handleSubNavItemClick}
            parentPositions={{
              bottom: this.tabItemRef.getBoundingClientRect().bottom,
              left: this.tabItemRef.getBoundingClientRect().left,
            }}
          />
        )}
      </button>
    )
  }
}
