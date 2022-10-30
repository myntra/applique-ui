import React, { PureComponent } from 'react'

import TopNavSidebarMenu from './top-nav-sidebar-menu'
import classnames from './top-nav-sidebar.module.scss'

export interface Props extends BaseProps {
  classname?: string
  data?: any
}

/**
 * <Component description goes here>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

export default class TopNavSidebar extends PureComponent<Props, {}> {
  handleMenuItemClick = (parent, child) => {
    const clickObject = {
      activeMenu: parent.title,
      child,
    }
    this.props.onItemClick(clickObject)
  }

  handleDirectItemClick = (child) => {
    const clickObject = {
      activeMenu: null,
      child,
    }
    this.props.onItemClick(clickObject)
  }

  render() {
    const { activeConfig, activeMenu, activeItem } = this.props

    return (
      <div className={classnames('sidebar')}>
        {activeConfig.config.map((item) => (
          <TopNavSidebarMenu
            isActive={activeMenu && item.title == activeMenu}
            activeItem={activeItem}
            menuItem={item}
            key={item.title}
            handleMenuItemClick={this.handleMenuItemClick}
            handleDirectItemClick={this.handleDirectItemClick}
          />
        ))}
      </div>
    )
  }
}
