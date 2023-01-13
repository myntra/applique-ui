import React, { PureComponent, MouseEventHandler } from 'react'
import Layout from '@applique-ui/layout'

import { MENU_TYPES, NAVIGATION_ITEM_L2_INTERFACE } from './config'
import classnames from './top-nav-hover.module.scss'

export interface TopNavHoverProps extends BaseProps {
  navTabConfig: {
    menus: Array<Array<NAVIGATION_ITEM_L2_INTERFACE>>,
    directs: Array<NAVIGATION_ITEM_L2_INTERFACE>
  }
  handleSubNavItemClick?: Function
  disableHover: MouseEventHandler
  parentPositions: {
    left: number
    bottom: number
  }
  footerMessage?: string
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
  hoverItemRef = null

  state = {
    left: null,
  }

  componentDidMount(): void {
    this.setState({
      left:
        this.props.parentPositions.left + this.hoverItemRef?.offsetWidth >
        document.documentElement.clientWidth
          ? document.documentElement.clientWidth -
            this.hoverItemRef?.offsetWidth
          : this.props.parentPositions.left,
    })
  }

  render() {
    const { navTabConfig, disableHover, parentPositions, footerMessage } = this.props

    const { menus, directs } = navTabConfig

    return (
      <div 
      className={classnames('hover-container')}
      style={{
        top: `${parentPositions.bottom}px`,
        left: `${this.state.left}px`,
      }}
      >
        <div
          className={classnames('hover-item')}
          ref={(el) => {
            this.hoverItemRef = el
          }}
          onMouseLeave={disableHover}
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
                gutter="xl"
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
        {footerMessage ? <div className={classnames('hover-item-footer')} dangerouslySetInnerHTML={{__html: footerMessage}}></div> : null}
      </div>
    )
  }
}
