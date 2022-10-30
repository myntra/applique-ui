import React, { PureComponent } from 'react'

import Layout from '@myntra/uikit-component-layout'
import Icon from '@myntra/uikit-component-icon'
import ChevronDownSolid from 'uikit-icons/svgs/ChevronDownSolid'
import ChevronUpSolid from 'uikit-icons/svgs/ChevronUpSolid'
import Bell from 'uikit-icons/svgs/BoxSolid'

import classnames from './top-nav-sidebar.module.scss'

export interface MenuItem {
  type: String
  icon: Node
  title: String
  config: Array<{ title: String }>
}

export interface TopNavSideBarMenuProps extends BaseProps {
  menuItem: MenuItem
  isActive: boolean
  handleMenuItemClick: Function
  handleDirectItemClick: Function
}

interface TopNavSideBarMenuState {
  isOpen: boolean
}

/**
 * <Component description goes here>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

const MENU_TYPES = {
  MENU: 'MENU',
  MENU_ITEM: 'MENU_ITEM',
  MENU_DIRECT_LINK: 'MENU_DIRECT_LINK',
}

export default class TopNavSidebarMenu extends PureComponent<
  TopNavSideBarMenuProps,
  TopNavSideBarMenuState
> {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: this.props.isActive,
    }
  }

  handleSectionClick = () => this.setState({ isOpen: !this.state.isOpen })

  getViewRowItemView = (menuType, rowItem, isActive, handleSectionClick) => {
    return (
      <button
        className={classnames(
          'sidebar-navigation-menu',
          isActive ? 'sidebar-navigation-menu-active' : null
        )}
        onClick={handleSectionClick}
      >
        <Layout type="stack" distribution="spaceBetween">
          <Layout type="stack" gutter="large" alignment="middle">
            <Icon
              name={
                [MENU_TYPES.MENU, MENU_TYPES.MENU_DIRECT_LINK].includes(
                  menuType
                )
                  ? rowItem.icon || Bell
                  : null
              }
            />
            <span>{rowItem.title}</span>
          </Layout>
          {menuType === MENU_TYPES.MENU && (
            <Icon
              className={classnames('sidebar-navigation-menu-dropdown-icon')}
              name={this.state.isOpen ? ChevronUpSolid : ChevronDownSolid}
            />
          )}
        </Layout>
      </button>
    )
  }

  getView() {
    const {
      menuItem,
      isActive,
      activeItem,
      handleMenuItemClick,
      handleDirectItemClick,
    } = this.props

    if (menuItem.type === MENU_TYPES.MENU) {
      return (
        <React.Fragment>
          {this.getViewRowItemView(
            MENU_TYPES.MENU,
            menuItem,
            isActive,
            this.handleSectionClick
          )}
          {this.state.isOpen &&
            menuItem.config.map((subMenuItem) =>
              this.getViewRowItemView(
                MENU_TYPES.MENU_ITEM,
                subMenuItem,
                isActive,
                handleMenuItemClick
              )
            )}
        </React.Fragment>
      )
    }

    if (menuItem.type === MENU_TYPES.MENU_DIRECT_LINK) {
      return this.getViewRowItemView(
        MENU_TYPES.MENU_DIRECT_LINK,
        menuItem,
        isActive,
        handleDirectItemClick
      )
    }

    return null
  }

  render() {
    return this.getView()
  }
}
