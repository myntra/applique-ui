import { createContext, LinkProps } from '@myntra/uikit-context'

export interface TopNavContext {
  isOpen: boolean
  //   currentPath: string
  //   isActivePath(navLinkPath: string, isGroup?: boolean): boolean
  //   isActiveGroup(id: number[]): boolean
  //   onNavLinkClick(navLink: { path: string }): void
  //   setActiveGroup(id: number[]): void
  //   renderLink(props: LinkProps): any
}

export default createContext<TopNavContext>(null)
