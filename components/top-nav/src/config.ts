export const MENU_TYPES = {
  MENU: 'MENU',
  MENU_ITEM: 'MENU_ITEM',
  MENU_DIRECT_LINK: 'MENU_DIRECT_LINK',
}

export const HOVER_MENU_COLUMN_BUCKET = {
  COLUMN_1: 0,
  COLUMN_2: 1,
  COLUMN_3: 2,
  COLUMN_4: 3,
}

export const QUICKLINK_BUTTON_TYPE = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
}

export interface ROUTING_INFO_INTERFACE {
  path: string
  handleClick?: Function
  meta: Object
}

export interface NAVIGATION_ITEM_L1_INTERFACE {
  label: string
  icon: Node
  routingInfo?: ROUTING_INFO_INTERFACE
  noHover: boolean
  config?: Array<NAVIGATION_ITEM_L2_INTERFACE>
  dispatchFunctionObject?: Function
  footerMessage?: string
  tagLabel?: string
  tagType?: string
}

export interface NAVIGATION_ITEM_L2_INTERFACE {
  id: string
  title: string
  type: string
  config: Array<NAVIGATION_ITEM_L3_INTERFACE>
  path: string
  routingInfo?: ROUTING_INFO_INTERFACE
  tagLabel?: string
  tagType?: string
}

export interface NAVIGATION_ITEM_L3_INTERFACE {
  id: string
  title: string
  routingInfo?: ROUTING_INFO_INTERFACE
  tagLabel?: string
  tagType?: string
}

export interface TopNavBaseProps extends BaseProps {
  config: {
    quickLinks: any
    logo: Node
    navigationConfig: Array<NAVIGATION_ITEM_L1_INTERFACE>
    quickLinksSideNav?: Array<NAVIGATION_ITEM_L1_INTERFACE>
  }
  dispatchFunction: Function
  additionalHeader?: Node
}

export interface TopNavProps extends TopNavBaseProps {
  hamburger?: Node
  close?: Node
  navigationKey: String
  currentNavigationValue: String
}

export interface DesktopProps extends TopNavBaseProps {
  children: any
  levelOneId: string
  levelTwoId: string
  levelThreeId: string
}
export interface MobileProps extends DesktopProps {
  hamburger?: Node
  close?: Node
}
