import { ReactNode } from 'react'

export interface BaseProps {
  /**
   * CSS class name.
   */
  className?: string

  children?: ReactNode

  [key: string]: any
}
