import React, { PureComponent } from 'react'
import Icon from '@applique-ui/icon'

import classnames from './top-nav-item.module.scss'
import TopNavHover from './top-nav-hover'
import { NAVIGATION_ITEM_L1_INTERFACE, MENU_TYPES } from './config'

export interface TopNavItemProps extends BaseProps {
  itemData: NAVIGATION_ITEM_L1_INTERFACE
  isActive?: boolean
  dispatchFunction: Function
}

interface TopNavItemState {
  isHovering: boolean
}

function getFilteredNavs(config) {
  return config.reduce(
    (aggregate, currentValue) => {
      switch (currentValue.type) {
        case MENU_TYPES.MENU:
          if (
            currentValue.config.length &&
            currentValue.hoverMenuColumnBucket >= 0 &&
            currentValue.hoverMenuColumnBucket < 4
          ) {
            const menus = aggregate.menus
            menus[currentValue.hoverMenuColumnBucket].push(currentValue)
            return { ...aggregate, menus }
          } else {
            return aggregate
          }
        case MENU_TYPES.MENU_DIRECT_LINK:
          return {
            ...aggregate,
            directs: [...aggregate.directs, currentValue],
          }
        default:
          return aggregate
      }
    },
    {
      menus: new Array([], [], [], []),
      directs: [],
    }
  )
}

/**
 * <Component handles the view logic for nav item on the header component>
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

  handleNavItemClick = () => {
    this.props.dispatchFunction(this.props.itemData)
  }

  handleSubNavItemClick = (dispatchFunctionObject) => {
    this.disableHover()
    this.props.dispatchFunction(dispatchFunctionObject)
  }

  render() {
    const { itemData, isActive } = this.props
    const isDirectLink = itemData.routingInfo && itemData.noHover
    const isMenu = Array.isArray(itemData.config) && itemData.config.length
    const { menus = [[], [], [], []], directs = [] } =
      isMenu && getFilteredNavs(itemData.config)
    const isNonEmptyMenu =
      isMenu && (menus.filter((nav) => nav.length).length || directs.length)

    if (isDirectLink || isNonEmptyMenu) {
      return (
        <button
          ref={(ref) => {
            this.tabItemRef = ref
          }}
          className={classnames(
            'top-nav-button',
            isActive ? 'top-nav-button-active' : null
          )}
          onMouseOver={this.enableHover}
          onMouseLeave={this.disableHover}
          onClick={
            itemData.routingInfo && itemData.noHover
              ? this.handleNavItemClick
              : null
          }
        >
          {itemData.icon && (
            <Icon
              className={classnames('top-nav-button-icon')}
              name={itemData.icon}
            />
          )}
          {itemData.label}
          {this.state.isHovering && isNonEmptyMenu && (
            <TopNavHover
              navTabConfig={{ menus, directs }}
              disableHover={this.disableHover}
              handleSubNavItemClick={this.handleSubNavItemClick}
              parentPositions={{
                bottom:
                  this.tabItemRef.offsetTop + this.tabItemRef.offsetHeight,
                left: this.tabItemRef.offsetLeft,
              }}
              footerMessage={itemData?.footerMessage}
            />
          )}
        </button>
      )
    }
    return null
  }
}
