import React, { PureComponent, Component } from 'react'
import classnames from './top-nav-sidebar.module.scss'
import Context, { TopNavContext } from './context'
import Layout from '@myntra/uikit-component-layout'
import TopNavSidebarMenu from './top-nav-sidebar-menu'
import Icon from '@myntra/uikit-component-icon'
import Bell from 'uikit-icons/svgs/Bell'

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
            />
          ) : (
            <label className={classnames('sidebar-menu-child-link')}>
              <li className={classnames('sidebar-menu-child')} key={item.title}>
                <Layout type="stack">
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
