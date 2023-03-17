import React, { PureComponent } from 'react'
import {
  NAVIGATION_ITEM_L1_INTERFACE,
  MENU_TYPES,
  HOVER_MENU_COLUMN_BUCKET,
  QUICKLINK_BUTTON_TYPE,
} from './config'
import { getPathToInfoMapping, isMobileView } from './utils'
import DesktopTopNav from './DesktopTopNav'
import MobileSideNav from './MobileSideNav'

export interface TopNavProps extends BaseProps {
  config: {
    quickLinks: any
    logo: Node
    navigationConfig: Array<NAVIGATION_ITEM_L1_INTERFACE>
    quickLinksSideNav: Array<NAVIGATION_ITEM_L1_INTERFACE>
  }
  dispatchFunction: Function
  navigationKey: String
  currentNavigationValue: String
  additionalHeader?: Node
  hamburger?: Node
  close?: Node
}

interface TopNavState {
  navigationKeyToLevelsMapping: {
    [key: string]: {
      L1_LEVEL_ID?: string
      L2_LEVEL_ID?: string
      L3_LEVEL_ID?: string
    }
  }
}

/**
 * <Top Navigation that handled the Single Page Application navigation>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

class TopNav extends PureComponent<TopNavProps, TopNavState> {
  static MENU_TYPES = MENU_TYPES
  static HOVER_MENU_COLUMN_BUCKET = HOVER_MENU_COLUMN_BUCKET
  static QUICKLINK_BUTTON_TYPE = QUICKLINK_BUTTON_TYPE

  constructor(props) {
    super(props)
    let navigationKeyToLevelsMapping = getPathToInfoMapping(
      props.config && props.config.navigationConfig,
      props.navigationKey
    )
    const quickLinksMapping = getPathToInfoMapping(
      props.config && props.config.quickLinksSideNav,
      props.navigationKey
    )
    navigationKeyToLevelsMapping = {
      ...navigationKeyToLevelsMapping,
      ...quickLinksMapping,
    }

    this.state = {
      navigationKeyToLevelsMapping: navigationKeyToLevelsMapping,
    }
  }

  render() {
    return isMobileView ? (
      <MobileSideNav
        navigationKeyToLevelsMapping={this.state.navigationKeyToLevelsMapping}
        currentNavigationValue={this.props.currentNavigationValue}
        configurations={this.props.config}
        dispatchFunction={this.props.dispatchFunction}
        additionalHeader={this.props.additionalHeader}
        hamburger={this.props.hamburger}
        close={this.props.close}
        children={this.props.children}
      />
    ) : (
      <DesktopTopNav
        navigationKeyToLevelsMapping={this.state.navigationKeyToLevelsMapping}
        currentNavigationValue={this.props.currentNavigationValue}
        configurations={this.props.config}
        dispatchFunction={this.props.dispatchFunction}
        additionalHeader={this.props.additionalHeader}
        children={this.props.children}
      />
    )
  }
}

export default TopNav
