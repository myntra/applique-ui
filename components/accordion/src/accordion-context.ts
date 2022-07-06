import { createContext } from '@myntra/uikit-context'
import AccordionItem from './accordion-item'
import { Props as ItemProps } from './accordion-item'

export interface AccordionContext {
  getIndex(item: AccordionItem): number
  itemProps: ItemProps
}

export default createContext<AccordionContext>(null)
