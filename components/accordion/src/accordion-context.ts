import { createContext } from '@applique-ui/uikit-context'
import AccordionItem from './accordion-item'
import { Props as ItemProps } from './accordion-item'

export interface AccordionContext {
  onActivation(index: number, active: boolean): void
  getIndex(item: AccordionItem): number
  itemProps: ItemProps
}

export default createContext<AccordionContext>(null)
