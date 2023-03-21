import React, { PureComponent } from 'react'
import {
  MENU_TYPES,
  HOVER_MENU_COLUMN_BUCKET,
  QUICKLINK_BUTTON_TYPE,
  TopNavProps,
} from './config'
import { getPathToInfoMapping } from './utils'
import { is } from '@applique-ui/uikit-utils'
import DesktopTopNav from './DesktopTopNav'
import MobileSideNav from './MobileSideNav'

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
    const {
      currentNavigationValue,
      config,
      dispatchFunction,
      additionalHeader,
      hamburger,
      close,
      children,
    } = this.props

    const { L1_LEVEL_ID, L2_LEVEL_ID, L3_LEVEL_ID } =
      this.state.navigationKeyToLevelsMapping[`${currentNavigationValue}`] || {}

    return is.mobile() ? (
      <MobileSideNav
        config={config}
        dispatchFunction={dispatchFunction}
        additionalHeader={additionalHeader}
        children={children}
        hamburger={hamburger}
        close={close}
        levelOneId={L1_LEVEL_ID}
        levelTwoId={L2_LEVEL_ID}
        levelThreeId={L3_LEVEL_ID}
      />
    ) : (
      <DesktopTopNav
        config={config}
        dispatchFunction={dispatchFunction}
        additionalHeader={additionalHeader}
        children={children}
        levelOneId={L1_LEVEL_ID}
        levelTwoId={L2_LEVEL_ID}
        levelThreeId={L3_LEVEL_ID}
      />
    )
  }
}

export default TopNav
