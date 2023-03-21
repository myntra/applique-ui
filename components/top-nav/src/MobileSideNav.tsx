import React, { PureComponent } from 'react'
import Layout from '@applique-ui/layout'
import Icon from '@applique-ui/icon'
import QuickLink from './quick-link'
import { MobileProps } from './config'
import classnames from './top-nav.module.scss'
import MainSideNavItem from './main-side-nav-item'

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

class MobileSideNav extends PureComponent<MobileProps, MobileSideNavState> {
  state = {
    isOpen: false,
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

  getMobileSidebarView = ({ levelOneId, levelTwoId, levelThreeId }) => {
    const configurations = this.props.config
    return (
      <Layout
        type="row"
        className={classnames('top-nav-page-content-sidebar', {
          ['top-nav-page-content-sidebar-open']: this.state.isOpen,
          ['top-nav-page-content-sidebar-closed']: !this.state.isOpen,
        })}
      >
        <Layout type="row" gutter="none">
          {Object.entries(configurations.navigationConfig).map(
            ([levelId, navigationItem]) => (
              <MainSideNavItem
                isActive={levelOneId === levelId}
                dispatchFunction={this.setPath}
                itemData={navigationItem}
                l2LevelId={levelTwoId}
                l3LevelId={levelThreeId}
              />
            )
          )}
        </Layout>
        <Layout type="row" gutter="none">
          {Object.entries(configurations.quickLinksSideNav).map(
            ([levelId, quickLinkItem]) => (
              <MainSideNavItem
                isActive={levelOneId === levelId}
                dispatchFunction={this.setPath}
                itemData={quickLinkItem}
                l2LevelId={levelTwoId}
                l3LevelId={levelThreeId}
              />
            )
          )}
        </Layout>
      </Layout>
    )
  }
  render() {
    const {
      config: { quickLinks, logo },
      additionalHeader,
      levelOneId,
      levelTwoId,
      levelThreeId,
    } = this.props
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
        {this.state.isOpen && (
          <div
            className={classnames('top-nav-page-content-backdrop')}
            onClick={() => this.handleOpenClick()}
          ></div>
        )}
        <Layout
          type="stack"
          gutter="large"
          className={classnames('top-nav-page-content')}
        >
          {this.getMobileSidebarView({
            levelOneId,
            levelTwoId,
            levelThreeId,
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
