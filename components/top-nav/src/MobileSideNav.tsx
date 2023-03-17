import React, { PureComponent } from 'react'
import Layout from '@applique-ui/layout'
import Icon from '@applique-ui/icon'
import QuickLink from './quick-link'
import { NAVIGATION_ITEM_L1_INTERFACE } from './config'
import classnames from './top-nav.module.scss'
import MainSideNavItem from './main-side-nav-item'

export interface MobileSideNavProps extends BaseProps {
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
  hamburger?: Node
  close?: Node
}

interface MobileSideNavState {
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

class MobileSideNav extends PureComponent<
  MobileSideNavProps,
  MobileSideNavState
> {
  constructor(props) {
    super(props)
    this.state = {
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
        <Icon
          fontSize="large"
          name={this.state.isOpen ? this.props.close : this.props.hamburger}
          className={classnames('top-nav-header-icon')}
        />
      </button>
    )
  }

  getMobileSidebarView = ({ L1_LEVEL_ID, L2_LEVEL_ID, L3_LEVEL_ID }) => {
    const configurations = this.props.configurations
    return (
      <div
        className={classnames('top-nav-page-content-sidebar', 'main-sidebar')}
      >
        <Layout type="row" gutter="none">
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
        </Layout>
        <Layout type="row" gutter="none">
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
        </Layout>
      </div>
    )
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
          gutter="medium"
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

export default MobileSideNav
