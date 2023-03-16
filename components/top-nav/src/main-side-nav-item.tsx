import React, { PureComponent } from 'react'
import Icon from '@applique-ui/icon'
import Layout from '@applique-ui/layout'
import ChevronRightSolid from 'uikit-icons/svgs/ChevronRightSolid'
import ChevronLeftSolid from 'uikit-icons/svgs/ChevronLeftSolid'

import classnames from './top-nav-sidebar.module.scss'
import { NAVIGATION_ITEM_L1_INTERFACE, MENU_TYPES } from './config'
import TopNavSidebarWrapper from './top-nav-sidebar-menu-wrapper'
import { getFilteredNavs } from './utils'

export interface MainSideNavItemProps extends BaseProps {
  itemData: NAVIGATION_ITEM_L1_INTERFACE
  isActive?: boolean
  dispatchFunction: Function
}

interface MainSideNavItemState {
  isOpen: boolean
}

/**
 * <Component handles the view logic for nav item on the header component>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

export default class MainSideNavItem extends PureComponent<
  MainSideNavItemProps,
  MainSideNavItemState
> {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }

  tabItemRef = null

  handleNavItemClick = () => {
    this.props.dispatchFunction(this.props.itemData)
  }

  handleClick = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }
  componentDidMount = () => {
    if (this.props.l2LevelId && this.props.isActive)
      this.setState({ isOpen: true })
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
        <div className={this.state.isOpen ? classnames('sub-nav-menu') : null}>
          <button
            className={classnames(
              'sidebar-menu',
              !this.state.isOpen && !itemData.icon ? 'main-sidebar-menu' : null,
              isActive && itemData.routingInfo ? 'sidebar-menu-active' : null
            )}
            onClick={
              itemData.routingInfo && itemData.noHover
                ? this.handleNavItemClick
                : this.handleClick
            }
          >
            <Layout type="stack" distribution="spaceBetween">
              <Layout type="stack" gutter="large" alignment="middle">
                {this.state.isOpen ? (
                  <Icon
                    className={classnames('sidebar-menu-dropdown-icon')}
                    name={ChevronLeftSolid}
                  />
                ) : itemData.icon ? (
                  <Icon
                    className={classnames('sidebar-menu-dropdown-icon')}
                    name={itemData.icon}
                  />
                ) : null}
                <span>{itemData.label}</span>
              </Layout>
              {isNonEmptyMenu && !this.state.isOpen && (
                <Icon
                  className={classnames('sidebar-menu-dropdown-icon')}
                  name={
                    this.state.isOpen ? ChevronLeftSolid : ChevronRightSolid
                  }
                />
              )}
            </Layout>
          </button>
          {this.state.isOpen && (
            <TopNavSidebarWrapper
              config={itemData.config}
              l2LevelId={this.props.l2LevelId}
              l3LevelId={this.props.l3LevelId}
              setPath={this.props.dispatchFunction}
            />
          )}
        </div>
      )
    }
    return null
  }
}
