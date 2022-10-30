import React, { PureComponent } from 'react'
import Layout from '@myntra/uikit-component-layout'

import classnames from './top-nav-hover.module.scss'

export interface Props extends BaseProps {
  classname?: string
  data?: any
  position?: number
  onMouseEnter?: any
  onMouseLeave?: any
  onItemClick?: any
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
        case 'menu':
          return {
            ...aggregate,
            menus: [...aggregate.menus, currentValue],
          }
        case 'direct':
          return {
            ...aggregate,
            directs: [...aggregate.menus, currentValue],
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

export default class TopNavHover extends PureComponent<Props, {}> {
  onSubNavItemClick = (subNav) => {
    this.props.handleSubNavItemClick(subNav.dispatchFunctionObject)
  }

  render() {
    const { navTabConfig, disableHover, parentPositions } = this.props

    if (!navTabConfig) {
      return null
    }

    const { menus, directs } = getFilteredNavs(navTabConfig)

    return (
      <div
        className={classnames('hover-item-container')}
        onMouseLeave={disableHover}
        style={{
          top: `${parentPositions.bottom}px`,
          left: `${parentPositions.left}px`,
        }}
      >
        <Layout type="stack" gutter="xl">
          {menus.map((menu) => {
            return (
              <Layout
                type="row"
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
                      onClick={() => this.onSubNavItemClick(it)}
                      key={it.title}
                      className={classnames('hover-item-link')}
                    >
                      {it.title}
                    </button>
                  )
                })}
              </Layout>
            )
          })}
          {directs && directs.length ? (
            <Layout type="row" className={classnames('hover-item-direct')}>
              {directs.map((directLink) => {
                return (
                  <button
                    onClick={() => this.onSubNavItemClick(directLink)}
                    key={directLink.title}
                    className={classnames('hover-item-link')}
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
