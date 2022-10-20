import React, { PureComponent } from 'react'
import classnames from './top-nav-hover.module.scss'
import Context, { TopNavContext } from './context'
import Layout from '@myntra/uikit-component-layout'

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

export default class TopNavHover extends PureComponent<Props, {}> {
  onItemClick = (child, menu = null) => {
    const obj = {
      clickedTitle: child.title,
      menuTitle: menu ? menu.title : null,
      ...child,
      //   ...menu
    }
    this.props.onItemClick(obj)
  }

  render() {
    const {
      className,
      data: sampleData,
      position,
      onMouseEnter,
      onMouseLeave,
    } = this.props
    const menus = sampleData.filter((it) => {
      return it.type == 'menu'
    })
    const directs = sampleData.filter((it) => {
      return it.type == 'direct'
    })
    return (
      <div
        className={classnames('hover-item-container')}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ left: `${position}px` }}
      >
        <Layout type="stack" gutter="xl">
          {menus &&
            menus.length &&
            menus.map((child) => {
              return (
                <Layout
                  type="row"
                  key={child.title}
                  className={classnames('hover-item-menu')}
                >
                  <label className={classnames('hover-item-menu-title')}>
                    {child.title}
                  </label>
                  <hr className={classnames('hover-item-menu-hr')} />
                  {child.data.map((it) => {
                    return (
                      <label
                        onClick={() => this.onItemClick(it, child)}
                        key={it.title}
                        className={classnames('hover-item-link')}
                      >
                        {it.title}
                      </label>
                    )
                  })}
                </Layout>
              )
            })}
          {directs && directs.length ? (
            <Layout type="row" className={classnames('hover-item-direct')}>
              {directs.map((child) => {
                return (
                  <label
                    onClick={() => this.onItemClick(child)}
                    key={child.title}
                    className={classnames('hover-item-link')}
                  >
                    {child.title}
                  </label>
                )
              })}
            </Layout>
          ) : null}
        </Layout>
      </div>
    )
  }
}
