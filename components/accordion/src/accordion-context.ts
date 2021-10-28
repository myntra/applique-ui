import { createContext } from '@myntra/uikit-context'
import AccordionItem from './accordion-item'

export interface AccordionContext {
  active: number
  onActivation(index: number): void
  getIndex(item: AccordionItem): number
}

export default createContext<AccordionContext>(null)
