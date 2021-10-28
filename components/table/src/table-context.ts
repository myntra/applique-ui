import { Context } from 'react'
import { createContext } from '@myntra/uikit-context'

export interface TableContext {
  TD(props: BaseProps): any
  TR(props: BaseProps): any
}

const context: Context<TableContext> = createContext<TableContext>(null)

export const Provider = context.Provider
export const Consumer = context.Consumer
