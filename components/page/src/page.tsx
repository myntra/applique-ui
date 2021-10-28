import React from 'react'
import classnames from './page.module.scss'

export interface Props extends BaseProps {
  /**
   * Renders a nav using [NavBar](../components/nav-bar).
   */
  renderNavBar(): JSX.Element
  /**
   * Renders a header using [TopBar](../components/top-bar).
   */
  renderTopBar(): JSX.Element
  /**
   * Contents of the page.
   */
  children: JSX.Element
  /**
   * Flag to make the side navbar always open or open on hover
   */
  alwaysOpen: boolean
}

/**
 * A basic layout component with side nav and header.
 *
 * @since 0.11.0
 * @status READY
 * @category layout
 * @see http://uikit.myntra.com/components/page
 */
export default function Page({
  renderNavBar,
  renderTopBar,
  children,
  className,
  style,
  alwaysOpen,
  ...props
}: Props) {
  return (
    <div className={classnames('container', className)} style={style}>
      <div
        className={classnames('left', {
          'always-open': alwaysOpen,
        })}
        key="nav"
      >
        {renderNavBar()}
      </div>
      <div className={classnames('right')}>
        <div className={classnames('top')} key="header">
          {renderTopBar()}
        </div>
        <div {...props} className={classnames('main')} key="main">
          {children}
        </div>
      </div>
    </div>
  )
}
