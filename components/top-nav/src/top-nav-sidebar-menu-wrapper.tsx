import React from 'react'

import classnames from './top-nav.module.scss'
import TopNavSidebarMenu from './top-nav-sidebar-menu'

export default function TopNavSidebarWrapper({ config, l2LevelId, l3LevelId }) {
  return (
    <div className={classnames('top-nav-page-content-sidebar')}>
      {config.map((item) => (
        <TopNavSidebarMenu
          selectedMenuId={l2LevelId}
          selectedSubMenuId={l3LevelId}
          menuItem={item}
          handleDirectItemClick={this.setPath}
          handleMenuItemClick={this.setPath}
        />
      ))}
    </div>
  )
}
