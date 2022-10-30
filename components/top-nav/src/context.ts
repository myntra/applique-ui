import { createContext } from '@myntra/uikit-context'

export interface TopNavContext {
  isOpen: boolean
}

export default createContext<TopNavContext>(null)
