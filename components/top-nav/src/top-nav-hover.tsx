import React, { PureComponent, MouseEventHandler } from 'react'
import Layout from '@applique-ui/layout'

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

function getFilteredNavs(config) {
  return config.reduce(
    (aggregate, currentValue) => {
      switch (currentValue.type) {
        case MENU_TYPES.MENU:
          if (
            currentValue.config.length &&
            currentValue.hoverMenuColumnBucket >= 0 &&
            currentValue.hoverMenuColumnBucket < 4
          ) {
            const menus = aggregate.menus
            menus[currentValue.hoverMenuColumnBucket].push(currentValue)
            return { ...aggregate, menus }
          } else {
            return aggregate
          }
        case MENU_TYPES.MENU_DIRECT_LINK:
          return {
            ...aggregate,
            directs: [...aggregate.directs, currentValue],
          }
        default:
          return aggregate
      }
    },
    {
      menus: new Array([], [], [], []),
      directs: [],
    }
  )
}

/**
 * Component handles the render of hover view for a nav item
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */
export default class TopNavHover extends PureComponent<TopNavHoverProps, {}> {
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
          {menus.map((menusBucket) =>
            menusBucket.length ? (
              <div>
                {menusBucket.map((menu) => (
                  <div
                    key={menu.title}
                    className={classnames('hover-item-menu')}
                  >
                    <label className={classnames('hover-item-menu-title')}>
                      {menu.title}
                    </label>
                    <hr className={classnames('hover-item-menu-hr')} />
                    {menu.config.map((it) => {
                      return (
                        <button
                          onClick={() => this.props.handleSubNavItemClick(it)}
                          key={it.title}
                          className={classnames('hover-item-menu-link')}
                        >
                          {it.title}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            ) : null
          )}
          {directs && directs.length ? (
            <Layout
              type="row"
              gutter="xxl"
              className={classnames('hover-item-direct')}
            >
              {directs.map((directLink) => {
                return (
                  <button
                    onClick={() => this.props.handleSubNavItemClick(directLink)}
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
