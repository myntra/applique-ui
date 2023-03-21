import {
  MENU_TYPES,
  NAVIGATION_ITEM_L1_INTERFACE,
  NAVIGATION_ITEM_L2_INTERFACE,
} from './config'

function getPathToInfoMapping(navigationConfig, navigationKey) {
  const pathMap = {}
  Object.entries(navigationConfig).forEach((navConfig) => {
    const L1_LEVEL_ID: String = navConfig[0]
    const l1Config: NAVIGATION_ITEM_L1_INTERFACE = navConfig[1] as NAVIGATION_ITEM_L1_INTERFACE
    if (l1Config.config) {
      l1Config.config.forEach((l2Config: NAVIGATION_ITEM_L2_INTERFACE) => {
        const L2_LEVEL_ID = l2Config.id || l2Config.title
        if (l2Config.type === MENU_TYPES.MENU) {
          l2Config.config.forEach((l3Config) => {
            const L3_LEVEL_ID = l3Config.id || l3Config.title
            pathMap[l3Config.routingInfo[navigationKey] || L3_LEVEL_ID] = {
              L1_LEVEL_ID,
              L2_LEVEL_ID,
              L3_LEVEL_ID,
            }
          })
        } else if (l2Config.type === MENU_TYPES.MENU_DIRECT_LINK) {
          pathMap[l2Config.routingInfo[navigationKey] || L2_LEVEL_ID] = {
            L1_LEVEL_ID,
            L2_LEVEL_ID,
          }
        }
      })
    } else {
      pathMap[l1Config.routingInfo[navigationKey]] = { L1_LEVEL_ID }
    }
  })
  return pathMap
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

function checkIfNonEmptyMenu(itemData) {
  const isMenu = Array.isArray(itemData.config) && itemData.config.length
  const { menus = [[], [], [], []], directs = [] } =
    isMenu && getFilteredNavs(itemData.config)
  const isNonEmptyMenu =
    isMenu && (menus.filter((nav) => nav.length).length || directs.length)
  return isNonEmptyMenu
}

function checkIfDirectLink(itemData) {
  return itemData.routingInfo && itemData.noHover
}

function checkIfDirectLinkOrMenu(itemData) {
  return checkIfDirectLink(itemData) || checkIfNonEmptyMenu(itemData)
}

export {
  getPathToInfoMapping,
  getFilteredNavs,
  checkIfDirectLink,
  checkIfNonEmptyMenu,
  checkIfDirectLinkOrMenu,
}
