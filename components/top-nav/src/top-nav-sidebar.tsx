import React, { PureComponent, Component } from 'react'
import classnames from './top-nav-sidebar.module.scss'
import Context, { TopNavContext } from './context'
import Layout from '@myntra/uikit-component-layout'
import TopNavSidebarMenu from './top-nav-sidebar-menu'
import Icon from '@myntra/uikit-component-icon'
import Bell from 'uikit-icons/svgs/BoxSolid'

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
  handleMenuItemClicked = (parent, child) => {
    const clickObject = {
      activeMenu: parent.title,
      child,
    }
    this.props.onItemClick(clickObject)
  }

  handleDirectItemClicked = (child) => {
    const clickObject = {
      activeMenu: null,
      child,
    }
    this.props.onItemClick(clickObject)
  }

  render() {
    const { data, activeMenu, activeItem } = this.props

    return (
      <div className={classnames('sidebar-container')}>
        {data.map((item) => {
          return item.type === 'menu' ? (
            <TopNavSidebarMenu
              isActive={activeMenu && item.title == activeMenu}
              activeItem={activeItem}
              data={item}
              key={item.title}
              onItemClick={(child) => this.handleMenuItemClicked(item, child)}
            />
          ) : (
            <label
              className={classnames('sidebar-menu-child-link')}
              onClick={() => this.handleDirectItemClicked(item)}
            >
              <li
                className={classnames(
                  'sidebar-menu-child',
                  activeItem == item.title ? 'active-link' : null
                )}
                key={item.title}
              >
                <Layout type="stack" gutter="none" alignment="middle">
                  <Icon className="sidebar-menu-icon" name={Bell} />
                  <div
                    className={classnames(
                      'sidebar-menu-link-title',
                      activeItem == item.title ? 'active-link' : null
                    )}
                  >
                    {item.title}
                  </div>
                </Layout>
              </li>
            </label>
          )
        })}
      </div>
    )
  }
}
