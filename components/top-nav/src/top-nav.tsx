import React, { PureComponent } from 'react'
import Layout from '@applique-ui/layout'
import Icon from '@applique-ui/icon'

import TopNavItem from './top-nav-item'
import TopNavSidebarWrapper from './top-nav-sidebar-menu-wrapper'
import QuickLink from './quick-link'
import {
  NAVIGATION_ITEM_L1_INTERFACE,
  MENU_TYPES,
  HOVER_MENU_COLUMN_BUCKET,
  QUICKLINK_BUTTON_TYPE,
} from './config'
import classnames from './top-nav.module.scss'
import { getPathToInfoMapping } from './utils'
import MainSideNavItem from './main-side-nav-item'

const isSideNav = window.matchMedia('(min-width: 576px)').matches ? false : true

export interface TopNavProps extends BaseProps {
  config: {
    quickLinks: any
    logo: Node
    navigationConfig: Array<NAVIGATION_ITEM_L1_INTERFACE>
    userSettings: any
    quickLinksSideNav: Array<NAVIGATION_ITEM_L1_INTERFACE>
    hamburger?: Node
    close?: Node
  }
  dispatchFunction: Function
  navigationKey: String
  currentNavigationValue: String
  additionalHeader?: Node
  isOpen?: Boolean
}

interface TopNavState {
  navigationKeyToLevelsMapping: {
    [key: string]: {
      L1_LEVEL_ID?: string
      L2_LEVEL_ID?: string
      L3_LEVEL_ID?: string
    }
  }
  isOpen: boolean
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
  static QUICKLINK_BUTTON_TYPE = QUICKLINK_BUTTON_TYPE

  constructor(props) {
    super(props)
    let navigationKeyToLevelsMapping = getPathToInfoMapping(
      props.config && props.config.navigationConfig,
      props.navigationKey
    )
    const x = getPathToInfoMapping(
      props.config && props.config.quickLinksSideNav,
      props.navigationKey
    )
    navigationKeyToLevelsMapping = { ...navigationKeyToLevelsMapping, ...x }

    this.state = {
      navigationKeyToLevelsMapping: navigationKeyToLevelsMapping,
      isOpen: false,
    }
  }

  setPath = ({ routingInfo }) => {
    this.props.dispatchFunction(routingInfo)
  }

  handleOpenClick = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  iconView = () => {
    return (
      <button
        className={classnames('top-nav-header-hamburger')}
        onClick={this.handleOpenClick}
      >
        {this.state.isOpen
          ? this.props.config.close
          : this.props.config.hamburger}
      </button>
    )
  }

  getSidebarView = ({ L1_LEVEL_ID, L2_LEVEL_ID, L3_LEVEL_ID }) => {
    const configurations = this.props.config
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

  getMobileSidebarView = ({ L1_LEVEL_ID, L2_LEVEL_ID, L3_LEVEL_ID }) => {
    const configurations = this.props.config
    return (
      <div
        className={classnames('top-nav-page-content-sidebar', 'main-sidebar')}
      >
        <div>
          {Object.entries(configurations.navigationConfig).map(
            ([levelId, navigationItem]) => (
              <MainSideNavItem
                isActive={L1_LEVEL_ID === levelId}
                dispatchFunction={this.setPath}
                itemData={navigationItem}
                l2LevelId={L2_LEVEL_ID}
                l3LevelId={L3_LEVEL_ID}
              />
            )
          )}
        </div>
        <div>
          {Object.entries(configurations.quickLinksSideNav).map(
            ([levelId, quickLinkItem]) => (
              <MainSideNavItem
                isActive={L1_LEVEL_ID === levelId}
                dispatchFunction={this.setPath}
                itemData={quickLinkItem}
                l2LevelId={L2_LEVEL_ID}
                l3LevelId={L3_LEVEL_ID}
              />
            )
          )}
        </div>
      </div>
    )
  }

  render() {
    const { L1_LEVEL_ID, L2_LEVEL_ID, L3_LEVEL_ID } =
      this.state.navigationKeyToLevelsMapping[
        `${this.props.currentNavigationValue}`
      ] || {}

    const configurations = this.props.config
    const { quickLinks, logo } = configurations
    const { additionalHeader } = this.props

    return !isSideNav ? (
      <Layout type="row" gutter="none" className={classnames('top-nav')}>
        <Layout
          gutter={'xxxl'}
          type="stack"
          alignment="middle"
          className={classnames('top-nav-header')}
        >
          <div className={classnames('top-nav-header-logo')}>{logo}</div>
          <div className={classnames('top-nav-header-content-container')}>
            {
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
            }
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
    ) : (
      <Layout type="row" gutter="none" className={classnames('top-nav')}>
        <Layout
          gutter={'large'}
          type="stack"
          alignment="middle"
          className={classnames('top-nav-header')}
        >
          {this.iconView()}
          <div className={classnames('top-nav-header-logo')}>{logo}</div>
          <div className={classnames('top-nav-header-content-container')}>
            <Layout
              type="stack"
              gutter="none"
              className={classnames('top-nav-header-content-quick-links')}
            >
              {quickLinks
                .filter((quickLink) => quickLink?.mobile)
                .map((link) => (
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
          {this.state.isOpen &&
            this.getMobileSidebarView({
              L1_LEVEL_ID,
              L2_LEVEL_ID,
              L3_LEVEL_ID,
            })}
          <div className={classnames('top-nav-page-content-view')}>
            {this.props.children}
          </div>
        </Layout>
      </Layout>
    )
  }
}

export default TopNav
