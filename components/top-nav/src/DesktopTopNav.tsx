import React, { PureComponent } from 'react'
import Layout from '@applique-ui/layout'

import TopNavItem from './top-nav-item'
import TopNavSidebarWrapper from './top-nav-sidebar-menu-wrapper'
import QuickLink from './quick-link'
import { NAVIGATION_ITEM_L1_INTERFACE } from './config'
import classnames from './top-nav.module.scss'

export interface DesktopTopNavProps extends BaseProps {
  navigationKeyToLevelsMapping: any
  currentNavigationValue: String
  configurations: {
    quickLinks: any
    logo: Node
    navigationConfig: Array<NAVIGATION_ITEM_L1_INTERFACE>
    quickLinksSideNav: Array<NAVIGATION_ITEM_L1_INTERFACE>
  }
  dispatchFunction: Function
  additionalHeader?: Node
}

/**
 * <Top Navigation that handled the Single Page Application navigation>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

class DesktopTopNav extends PureComponent<DesktopTopNavProps> {
  setPath = ({ routingInfo }) => {
    this.props.dispatchFunction(routingInfo)
  }

  getSidebarView = ({ L1_LEVEL_ID, L2_LEVEL_ID, L3_LEVEL_ID }) => {
    const configurations = this.props.configurations
    const firstLevelConfig = configurations.navigationConfig[L1_LEVEL_ID]

    if (L1_LEVEL_ID && firstLevelConfig.config) {
      return (
        <TopNavSidebarWrapper
          config={firstLevelConfig.config}
          l2LevelId={L2_LEVEL_ID}
          l3LevelId={L3_LEVEL_ID}
          setPath={this.setPath}
        />
      )
    }
    return null
  }

  render() {
    const { L1_LEVEL_ID, L2_LEVEL_ID, L3_LEVEL_ID } =
      this.props.navigationKeyToLevelsMapping[
        `${this.props.currentNavigationValue}`
      ] || {}

    const configurations = this.props.configurations
    const { quickLinks, logo } = configurations
    const { additionalHeader } = this.props
    return (
      <Layout type="row" gutter="none" className={classnames('top-nav')}>
        <Layout
          gutter="xxxl"
          type="stack"
          alignment="middle"
          className={classnames('top-nav-header')}
        >
          <div className={classnames('top-nav-header-logo')}>{logo}</div>
          <div className={classnames('top-nav-header-content-container')}>
            <Layout
              type="stack"
              gutter="small"
              className={classnames('top-nav-header-content-tabs')}
            >
              {Object.entries(configurations.navigationConfig).map(
                ([levelId, navigationItem]) => (
                  <TopNavItem
                    itemData={navigationItem}
                    isActive={L1_LEVEL_ID === levelId}
                    dispatchFunction={this.setPath}
                  />
                )
              )}
            </Layout>
            <Layout
              type="stack"
              gutter="none"
              className={classnames('top-nav-header-content-quick-links')}
            >
              {quickLinks.map((link) => (
                <QuickLink link={link} />
              ))}
            </Layout>
          </div>
        </Layout>
        {additionalHeader}
        <Layout
          type="stack"
          gutter="large"
          className={classnames('top-nav-page-content')}
        >
          {this.getSidebarView({ L1_LEVEL_ID, L2_LEVEL_ID, L3_LEVEL_ID })}
          <div className={classnames('top-nav-page-content-view')}>
            {this.props.children}
          </div>
        </Layout>
      </Layout>
    )
  }
}

export default DesktopTopNav
