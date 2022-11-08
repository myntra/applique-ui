import React, { PureComponent } from 'react'
import Layout from '@myntra/uikit-component-layout'

import TopNavItem from './top-nav-item'
import TopNavSidebarMenu from './top-nav-sidebar-menu'
import QuickLink, { LinkInterface } from './quick-link'
import { DUMMY_DATA, NAVIGATION_ITEM_L1_INTERFACE } from './config'
import classnames from './top-nav.module.scss'
import { getPathToInfoMapping } from './utils'

export interface TopNavProps extends BaseProps {
  config: {
    quickLinks: any
    logo: Node
    navigationConfig: Array<NAVIGATION_ITEM_L1_INTERFACE>
  }
}

interface TopNavState {
  selectedTabDetails: {
    currentPath: string
    currentLevels: {
      L1_LEVEL_ID?: string
      L2_LEVEL_ID?: string
      L3_LEVEL_ID?: string
    }
  }
  pathToDetailMapping: {
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

export default class TopNav extends PureComponent<TopNavProps, TopNavState> {
  constructor(props) {
    super(props)
    const currentPath = '/testingpath'
    const pathToDetailsMapping = getPathToInfoMapping(
      (props.config && props.config.navigationConfig) ||
        DUMMY_DATA.navigationConfig
    )
    this.state = {
      selectedTabDetails: {
        currentPath,
        currentLevels: pathToDetailsMapping[currentPath] || {},
      },
      pathToDetailMapping: pathToDetailsMapping,
    }
  }

  setPath(routingInfo) {
    const { path } = routingInfo
    const { pathToDetailMapping } = this.state
    this.setState({
      selectedTabDetails: {
        currentPath: path,
        currentLevels: pathToDetailMapping[path],
      },
    })
    this.props.dispatchFunction(routingInfo)
  }

  getSidebarView() {
    const configurations = this.props.config || DUMMY_DATA
    const firstLevelId = this.state.selectedTabDetails.currentLevels.L1_LEVEL_ID
    const firstLevelConfig = configurations.navigationConfig[firstLevelId]

    if (firstLevelId && firstLevelConfig.config) {
      return (
        <div className={classnames('top-nav-page-content-sidebar')}>
          {firstLevelConfig.config.map((item) => (
            <TopNavSidebarMenu
              selectedMenuId={
                this.state.selectedTabDetails.currentLevels.L2_LEVEL_ID
              }
              selectedSubMenuId={
                this.state.selectedTabDetails.currentLevels.L3_LEVEL_ID
              }
              menuItem={item}
              handleDirectItemClick={this.setPath}
              handleMenuItemClick={(object) => this.setPath(object.routingInfo)}
            />
          ))}
        </div>
      )
    }
    return null
  }

  render() {
    const configurations = this.props.config || DUMMY_DATA
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
            <Layout type="stack" gutter="none">
              {Object.entries(configurations.navigationConfig).map(
                ([levelId, navigationItem]) => (
                  <TopNavItem
                    itemData={navigationItem}
                    isActive={
                      this.state.selectedTabDetails.currentLevels
                        .L1_LEVEL_ID === levelId
                    }
                    dispatchFunction={(object) => {
                      this.setPath(object.routingInfo)
                    }}
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
          {this.getSidebarView()}
          <div className={classnames('top-nav-page-content-view')}>
            {this.props.children}
          </div>
        </Layout>
      </div>
    )
  }
}
