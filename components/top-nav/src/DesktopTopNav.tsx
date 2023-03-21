import React, { PureComponent } from 'react'
import Layout from '@applique-ui/layout'

import TopNavItem from './top-nav-item'
import TopNavSidebarWrapper from './top-nav-sidebar-menu-wrapper'
import QuickLink from './quick-link'
import { DesktopProps } from './config'
import classnames from './top-nav.module.scss'

/**
 * <Top Navigation that handled the Single Page Application navigation>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

class DesktopTopNav extends PureComponent<DesktopProps> {
  setPath = ({ routingInfo }) => {
    this.props.dispatchFunction(routingInfo)
  }

  getSidebarView = ({ levelOneId, levelTwoId, levelThreeId }) => {
    const configurations = this.props.config
    const firstLevelConfig = configurations.navigationConfig[levelOneId]

    if (levelOneId && firstLevelConfig.config) {
      return (
        <TopNavSidebarWrapper
          config={firstLevelConfig.config}
          l2LevelId={levelTwoId}
          l3LevelId={levelThreeId}
          setPath={this.setPath}
        />
      )
    }
    return null
  }

  render() {
    const {
      config,
      additionalHeader,
      levelOneId,
      levelTwoId,
      levelThreeId,
    } = this.props
    const { quickLinks, logo } = config
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
              {Object.entries(config.navigationConfig).map(
                ([levelId, navigationItem]) => (
                  <TopNavItem
                    itemData={navigationItem}
                    isActive={levelOneId === levelId}
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
          {this.getSidebarView({ levelOneId, levelTwoId, levelThreeId })}
          <div className={classnames('top-nav-page-content-view')}>
            {this.props.children}
          </div>
        </Layout>
      </Layout>
    )
  }
}

export default DesktopTopNav
