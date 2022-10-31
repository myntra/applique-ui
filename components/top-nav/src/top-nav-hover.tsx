import React, { PureComponent, MouseEventHandler } from 'react'
import Layout from '@myntra/uikit-component-layout'

import { MENU_TYPES, NAVIGATION_ITEM_L2_INTERFACE } from './config'
import classnames from './top-nav-hover.module.scss'

export interface TopNavHoverProps extends BaseProps {
  navTabConfig: Array<NAVIGATION_ITEM_L2_INTERFACE>
  handleSubNavItemClick?: Function
  disableHover: MouseEventHandler
  parentPositions: {
    left: number
    bottom: number
  }
}

/**
 * <Component description goes here>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

function getFilteredNavs(config) {
  return config.reduce(
    (aggregate, currentValue) => {
      switch (currentValue.type) {
        case MENU_TYPES.MENU:
          return {
            ...aggregate,
            menus: [...aggregate.menus, currentValue],
          }
        case MENU_TYPES.MENU_DIRECT_LINK:
          return {
            ...aggregate,
            directs: [currentValue],
          }
        default:
          return aggregate
      }
    },
    {
      menus: [],
      directs: [],
    }
  )
}

export default class TopNavHover extends PureComponent<TopNavHoverProps, {}> {
  onSubNavItemClick = (subNav) => {
    this.props.handleSubNavItemClick(subNav)
  }

  render() {
    const { navTabConfig, disableHover, parentPositions } = this.props

    const { menus, directs } = getFilteredNavs(navTabConfig)

    return (
      <div
        className={classnames('hover-item')}
        onMouseLeave={disableHover}
        style={{
          top: `${parentPositions.bottom}px`,
          left: `${parentPositions.left}px`,
        }}
      >
        <Layout type="stack" gutter="xl">
          {menus.map((menu) => {
            return (
              <div key={menu.title} className={classnames('hover-item-menu')}>
                <label className={classnames('hover-item-menu-title')}>
                  {menu.title}
                </label>
                <hr className={classnames('hover-item-menu-hr')} />
                {menu.config.map((it) => {
                  return (
                    <button
                      onClick={() => this.onSubNavItemClick(it)}
                      key={it.title}
                      className={classnames('hover-item-menu-link')}
                    >
                      {it.title}
                    </button>
                  )
                })}
              </div>
            )
          })}
          {directs && directs.length ? (
            <Layout
              type="row"
              gutter="xxl"
              className={classnames('hover-item-direct')}
            >
              {directs.map((directLink) => {
                return (
                  <button
                    onClick={() => this.onSubNavItemClick(directLink)}
                    key={directLink.title}
                    className={classnames('hover-item-direct-link')}
                  >
                    {directLink.title}
                  </button>
                )
              })}
            </Layout>
          ) : null}
        </Layout>
      </div>
    )
  }
}
