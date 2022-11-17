import React, { PureComponent } from 'react'
import Layout from '@myntra/uikit-component-layout'

import TopNavItem from './top-nav-item'
import TopNavSidebarMenu from './top-nav-sidebar-menu'
import QuickLink from './quick-link'
import {
  NAVIGATION_ITEM_L1_INTERFACE,
  MENU_TYPES,
  HOVER_MENU_COLUMN_BUCKET,
} from './config'
import classnames from './top-nav.module.scss'
import { getPathToInfoMapping } from './utils'

export interface TopNavProps extends BaseProps {
  config: {
    quickLinks: any
    logo: Node
    navigationConfig: Array<NAVIGATION_ITEM_L1_INTERFACE>
  }
  dispatchFunction: Function
  navigationKey: String
  currentNavigationValue: String
}

interface TopNavState {
  navigationKeyToLevelsMapping: {
    [key: string]: {
      L1_LEVEL_ID?: string
      L2_LEVEL_ID?: string
      L3_LEVEL_ID?: string
    }
  }
}

/**
 * <Top Navigation that handled the Single Page Application navigation>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

class TopNav extends PureComponent<TopNavProps, TopNavState> {
  static MENU_TYPES = MENU_TYPES
  static HOVER_MENU_COLUMN_BUCKET = HOVER_MENU_COLUMN_BUCKET

  constructor(props) {
    super(props)
    const navigationKeyToLevelsMapping = getPathToInfoMapping(
      props.config && props.config.navigationConfig,
      props.navigationKey
    )
    this.state = { navigationKeyToLevelsMapping }
  }

  setPath = ({ routingInfo }) => {
    this.props.dispatchFunction(routingInfo)
  }

  getSidebarView = ({ L1_LEVEL_ID, L2_LEVEL_ID, L3_LEVEL_ID }) => {
    const configurations = this.props.config
    const firstLevelConfig = configurations.navigationConfig[L1_LEVEL_ID]

    if (L1_LEVEL_ID && firstLevelConfig.config) {
      return (
        <div className={classnames('top-nav-page-content-sidebar')}>
          {firstLevelConfig.config.map((item) => (
            <TopNavSidebarMenu
              selectedMenuId={L2_LEVEL_ID}
              selectedSubMenuId={L3_LEVEL_ID}
              menuItem={item}
              handleDirectItemClick={this.setPath}
              handleMenuItemClick={this.setPath}
            />
          ))}
        </div>
      )
    }
    return null
  }

  render() {
    const { L1_LEVEL_ID, L2_LEVEL_ID, L3_LEVEL_ID } =
      this.state.navigationKeyToLevelsMapping[
        `${this.props.currentNavigationValue}`
      ] || {}

    const configurations = this.props.config
    const { quickLinks, logo } = configurations

    return (
      <div className={classnames('top-nav')}>
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
              gutter="none"
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
            <Layout type="stack" gutter="none">
              {quickLinks.map((link) => (
                <QuickLink link={link} />
              ))}
            </Layout>
          </div>
        </Layout>
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
      </div>
    )
  }
}

export default TopNav
