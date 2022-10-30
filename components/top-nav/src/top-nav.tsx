import React, { PureComponent } from 'react'
import Layout from '@myntra/uikit-component-layout'

import Context from './context'
import TopNavItem, {
  TopNavItemProps as TopNavItemInterface,
} from './top-nav-item'
import TopNavSidebar from './top-nav-sidebar'
import QuickLink, { LinkInterface } from './quick-link'
import { DUMMY_DATA } from './utils'
import classnames from './top-nav.module.scss'

export interface TopNavProps extends BaseProps {
  config: {
    quickLinks: Array<LinkInterface>
    logo: Node
    navigationConfig: { [key: string]: TopNavItemInterface }
  }
}

interface TopNavState {
  sidebarEnabled: boolean
  activeMenu: string
  activeItem: string
}

/**
 * <Top Navigation that handled the Single Page Application navigation>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

export default class TopNav extends PureComponent<TopNavProps, TopNavState> {
  state = {
    sidebarEnabled: false,

    activeMenu: null,

    activeItem: null,
  }

  render() {
    const configurations = this.props.config || DUMMY_DATA
    const { quickLinks, logo } = configurations

    const { sidebarEnabled, activeItem, activeMenu } = this.state

    return (
      <Context.Provider value={{ isOpen: true }}>
        <div>
          <div className={classnames('top-nav-header-container')}>
            <div className={classnames('top-nav-logo')}>{logo}</div>
            <Layout
              type="stack"
              distribution="spaceBetween"
              className={classnames('top-nav-content-container')}
            >
              <Layout type="stack" gutter="none">
                {Object.values(configurations.navigationConfig).map(
                  (navigationItem) => (
                    <TopNavItem itemData={navigationItem} isActive={true} />
                  )
                )}
              </Layout>
              <Layout type="stack" gutter="none">
                {quickLinks.map((link) => (
                  <QuickLink link={link} />
                ))}
              </Layout>
            </Layout>
          </div>
          {sidebarEnabled && (
            <TopNavSidebar
              // data={fullData[this.state.sidebarTitle].data}
              activeMenu={activeMenu}
              activeItem={activeItem}
              // onItemClick={this.handleSidebarItemClicked}
            />
          )}
        </div>
      </Context.Provider>
    )
  }
}
