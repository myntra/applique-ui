import React, { MouseEventHandler, PureComponent } from 'react'

import Layout from '@myntra/uikit-component-layout'
import Icon from '@myntra/uikit-component-icon'
import ChevronDownSolid from 'uikit-icons/svgs/ChevronDownSolid'
import ChevronUpSolid from 'uikit-icons/svgs/ChevronUpSolid'
import Bell from 'uikit-icons/svgs/BoxSolid'

import classnames from './top-nav-sidebar.module.scss'
import { MENU_TYPES } from './config'

export interface MenuItem {
  id: string
  type: String
  icon: Node
  title: String
  config: Array<{ id: string; title: String }>
}

export interface TopNavSideBarMenuProps extends BaseProps {
  menuItem: MenuItem
  selectedMenuId?: string
  selectedSubMenuId?: string
  handleMenuItemClick?: MouseEventHandler
  handleDirectItemClick?: MouseEventHandler
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

export default class TopNavSidebarMenu extends PureComponent<
  TopNavSideBarMenuProps,
  TopNavSideBarMenuState
> {
  constructor(props) {
    super(props)
    const { menuItem, selectedMenuId } = this.props
    this.state = {
      isOpen: menuItem.id === selectedMenuId,
    }
  }

  handleSectionClick = () => this.setState({ isOpen: !this.state.isOpen })

  getMenuRowItemView = (menuType, rowItem, isActive, handleSectionClick) => {
    return (
      <button
        className={classnames(
          'sidebar-menu',
          isActive ? 'sidebar-menu-active' : null
        )}
        onClick={handleSectionClick}
      >
        <Layout type="stack" distribution="spaceBetween">
          <Layout type="stack" gutter="large" alignment="middle">
            <Icon name={rowItem.icon || Bell} />
            <span>{rowItem.title}</span>
          </Layout>
          {menuType === MENU_TYPES.MENU && (
            <Icon
              className={classnames('sidebar-menu-dropdown-icon')}
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
      selectedMenuId,
      selectedSubMenuId,
      handleMenuItemClick,
      handleDirectItemClick,
    } = this.props

    if (menuItem.type === MENU_TYPES.MENU) {
      return (
        <React.Fragment>
          {this.getMenuRowItemView(
            MENU_TYPES.MENU,
            menuItem,
            menuItem.id === selectedMenuId,
            this.handleSectionClick
          )}
          {this.state.isOpen &&
            menuItem.config.map((subMenuItem) => (
              <button
                className={classnames(
                  'sidebar-menu',
                  'sidebar-menu-sub-item',
                  subMenuItem.id === selectedSubMenuId
                    ? 'sidebar-menu-active'
                    : null
                )}
                onClick={handleMenuItemClick}
              >
                <span>{subMenuItem.title}</span>
              </button>
            ))}
        </React.Fragment>
      )
    }

    if (menuItem.type === MENU_TYPES.MENU_DIRECT_LINK) {
      return this.getMenuRowItemView(
        MENU_TYPES.MENU_DIRECT_LINK,
        menuItem,
        menuItem.id === selectedMenuId,
        handleDirectItemClick
      )
    }

    return null
  }

  render() {
    return this.getView()
  }
}
