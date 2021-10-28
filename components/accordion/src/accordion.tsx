import React, { PureComponent } from 'react'
import AccordionItem from './accordion-item'
import AccordionContext from './accordion-context'

export interface Props extends BaseProps {
  /**
   * Sets the expanded item for the accordion.
   */
  active?: number
  /**
   * The callback function called when an item is expanded.
   *
   * @param active - Next expanded item.
   */
  onChange?(active: number): void
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

  handleClick = (active) => {
    if (this.props.onChange) this.props.onChange(active)
    else this.setState({ active })
  }

  render() {
    this.itemsCount = 0

    if (!React.createContext) {
      const { active, onChange, ...props } = this.props

      return <div {...props} />
    }

    return (
      <AccordionContext.Provider
        value={{
          active: this.active,
          onActivation: this.handleClick,
          getIndex: this.getItemIndex,
        }}
      >
        {this.props.children}
      </AccordionContext.Provider>
    )
  }
}
