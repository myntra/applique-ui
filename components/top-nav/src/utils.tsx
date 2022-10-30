import { MENU_TYPES } from './config'

function getPathToInfoMapping(navigationConfig) {
  const pathMap = {}
  Object.entries(navigationConfig).forEach(([l1LevelId, l1Config]) => {
    const L1_LEVEL_ID = l1LevelId
    //@ts-ignore
    if (l1Config.config) {
      //@ts-ignore
      l1Config.config.forEach((l2Config) => {
        //@ts-ignore
        const L2_LEVEL_ID = l2Config.id || l2Config.title
        if (l2Config.type === MENU_TYPES.MENU) {
          l2Config.config.forEach((l3Config) => {
            //@ts-ignore
            const L3_LEVEL_ID = l3Config.id || l3Config.title
            pathMap[l3Config.path || L3_LEVEL_ID] = {
              L1_LEVEL_ID,
              L2_LEVEL_ID,
              L3_LEVEL_ID,
            }
          })
        } else if (l2Config.type === MENU_TYPES.MENU_DIRECT_LINK) {
          //@ts-ignore
          pathMap[l2Config.path || L2_LEVEL_ID] = { L1_LEVEL_ID, L2_LEVEL_ID }
        }
      })
    } else {
      //@ts-ignore
      pathMap[l1Config.path] = { L1_LEVEL_ID }
    }
  })
  return pathMap
}

export { getPathToInfoMapping }
