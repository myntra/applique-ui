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

export { getPathToInfoMapping }
