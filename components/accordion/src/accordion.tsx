import React, { PureComponent } from 'react'
import AccordionItem from './accordion-item'
import AccordionContext from './accordion-context'
import { IconName } from '@mapplique/uikit-component-icon'
import ChevronDownSolid from 'uikit-icons/svgs/ChevronDownSolid'
import ChevronUpSolid from 'uikit-icons/svgs/ChevronUpSolid'

export interface Props extends BaseProps {
  /**
   * Sets the expanded item for the accordion.
   */
  active?: number
  /**
   * The callback function called when an item is expanded.
   *
   * @param currentIndex - Index of accordian item clicked.
   */
  onChange?(currentIndex: number, active: boolean): void
  /**
   * The icon used to
   */
  controlIcons?: { open: IconName; close: IconName }
}

/**
 * A component to render accordion effect.
 *
 * @since 0.3.0
 * @status REVIEWING
 * @category functional
 * @see http://uikit.myntra.com/components/accordion
 */
export default class Accordion extends PureComponent<
  Props,
  { active: number }
> {
  static Item = AccordionItem

  static defaultProps = {
    active: 0,
    controlIcons: {
      close: ChevronDownSolid,
      open: ChevronUpSolid,
    },
  }

  itemsCount = 0
  itemsToIndex = new WeakMap<AccordionItem, number>()

  constructor(props) {
    super(props)

    this.state = {
      active: props.active || 0,
    }
  }

  get active() {
    return typeof this.props.onChange === 'function'
      ? this.props.active
      : this.state.active
  }

  getItemIndex = (item) => {
    if (this.itemsToIndex.has(item)) {
      return this.itemsToIndex.get(item)
    }

    const index = this.itemsCount++

    this.itemsToIndex.set(item, index)

    return index
  }

  handleClick = (currentIndex, active) => {
    if (this.props.onChange) this.props.onChange(currentIndex, active)
  }

  render() {
    const { active, ...props } = this.props
    this.itemsCount = 0

    return (
      <AccordionContext.Provider
        value={{
          onActivation: this.handleClick,
          getIndex: this.getItemIndex,
          itemProps: props,
        }}
      >
        {this.props.children}
      </AccordionContext.Provider>
    )
  }
}
