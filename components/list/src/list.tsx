import React, { createElement, PureComponent } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import VirtualList, {
  Props as VirtualListProps,
} from '@applique-ui/virtual-list'
import InputCheckbox from '@applique-ui/input-checkbox'
import { createRef, isNullOrUndefined } from '@applique-ui/uikit-utils'
import classnames from './list.module.scss'
import ListItem from './list-item'

export interface Props<T = any> extends BaseProps {
  /**
   * An array of items to render in the list.
   */
  items: T[]

  /**
   * Renders markup for displaying a list item.
   */
  children(props: {
    index: number
    id: string | number | T
    item: T
  }): ReturnType<typeof createElement>

  /**
   * The selected value in the list.
   */
  value?: T | T[]

  /**
   * The callback fired when a list item is selected or unselected.
   */
  onChange?(value: T | T[]): void

  /**
   * A getter function to get unique ID of a list item.
   */
  idForItem?(item: T): T | number | string

  /**
   * Checks if the item is disabled or not.
   */
  isItemDisabled?(item: T): boolean

  /**
   * Sets selection mode to multiple.
   */
  multiple?: boolean

  /**
   * Use [VirtualList](../virtual-list) component to render the list.
   */
  virtualized?: boolean
}
/**
 * An accessible list of item.
 *
 * @since 0.11.0
 * @status READY
 * @category basic
 * @see http://uikit.myntra.com/components/list
 */
export default class List extends PureComponent<
  Props,
  { activeIndex: number; areSelectedAll: boolean }
> {
  static defaultProps = {
    idForItem: (item) => item,
    isItemDisabled: () => false,
  }

  idPrefix: string
  isMac: boolean
  containerRef: React.RefObject<HTMLUListElement>
  virtualListRef: React.RefObject<VirtualList>
  scrollerRef: React.RefObject<HTMLDivElement>

  state = {
    activeIndex: -1,
    areSelectedAll: false,
  }

  constructor(props) {
    super(props)

    this.idPrefix = `list-${Date.now()}`
    this.isMac = navigator?.platform?.toUpperCase?.()?.indexOf?.('MAC') >= 0
    this.containerRef = createRef()
    this.virtualListRef = createRef()
    this.scrollerRef = createRef()
  }

  componentDidUpdate() {
    if (this.state.activeIndex >= 0) {
      if (this.props.virtualized) {
        if (this.virtualListRef.current) {
          const offset = this.virtualListRef.current.scrollToIndex(
            this.state.activeIndex
          )

          if (this.scrollerRef.current && offset !== undefined)
            this.scrollerRef.current.scrollTo({ top: offset })
        }
      } else {
        // TODO: Check if scroll is required.
        this.containerRef.current &&
        this.containerRef.current.children.length > this.state.activeIndex
          ? // check if activeIndex does not exceed length of children, for lists with group headings,
            // a list group can have more elements than the total number of list groups
            scrollIntoView(
              this.containerRef.current.children[this.state.activeIndex],
              {
                scrollMode: 'if-needed',
                block: 'nearest',
                inline: 'nearest',
              }
            )
          : null
      }
    } else {
      const { multiple, value, idForItem, items } = this.props
      const selectedIDs = this.selectedIDs

      if (value || (multiple && value && value.length)) {
        this.setState({
          activeIndex: Math.max(
            0,
            items.findIndex((item) => selectedIDs.has(idForItem(item)))
          ),
        })
      }
    }

    this.areAllSelected()
  }

  get activeItemHTMLId() {
    if (this.state.activeIndex >= 0)
      return `${this.idPrefix}-option-${this.state.activeIndex}`

    return null
  }

  get selectedIDs() {
    return this.props.value != null
      ? new Set(
          Array.isArray(this.props.value)
            ? this.props.value
            : this.props.value?.split?.(',') || this.props.value
        )
      : new Set()
  }

  get disabledItems() {
    if (!this.props.isItemDisabled) {
      return []
    }
    return this.props.items.filter((item) => this.props.isItemDisabled(item))
  }

  areAllSelected = () => {
    // calculate if all are selected
    const selectedIds = this.selectedIDs
    const totalItems = this.props.items.length
    const disabledItems = this.disabledItems.length
    if (selectedIds.size === totalItems - disabledItems) {
      this.setState({ areSelectedAll: true })
    } else {
      this.setState({ areSelectedAll: false })
    }
  }

  resetActiveIndex = () => {
    this.setState({ activeIndex: -1 })
  }

  selectAll = (children) => {
    if (this.state.areSelectedAll) {
      this.updateValueByRange(0, children.length - 1, true)
      this.setState({ areSelectedAll: false })
    } else {
      this.updateValueByRange(0, children.length - 1, false)
      this.setState({ areSelectedAll: true })
    }
  }

  updateValueById(id: any) {
    if (isNullOrUndefined(id)) return
    if (!this.props.onChange) return

    if (!this.props.multiple) {
      return this.props.onChange(id)
    }

    const ids = this.selectedIDs

    if (ids.has(id)) ids.delete(id)
    else ids.add(id)

    return this.props.onChange([...ids])
  }

  updateValueByIndex(index: number) {
    return this.updateValueById(this.props.idForItem(this.props.items[index]))
  }

  updateValueByRange(start: number, end: number, toggle = true) {
    if (!this.props.multiple) return
    if (!this.props.onChange) return

    const { idForItem, items, isItemDisabled } = this.props
    const ids = this.selectedIDs

    // let value = this.props.value ? (this.props.value as Array<any>).slice() : []

    for (let index = start; index <= end; ++index) {
      const id = idForItem(items[index])

      const isDisabled = isItemDisabled(items[index])
      if (isDisabled) {
        continue
      }

      if (toggle && ids.has(id)) ids.delete(id)
      else ids.add(id)
    }
    this.props.onChange([...ids])
  }

  handleKeyPress = (event: KeyboardEvent) => {
    const N = this.props.items.length
    const { activeIndex } = this.state
    const { multiple } = this.props
    const isCMD = this.isMac ? event.metaKey : event.ctrlKey
    const isShift = event.shiftKey

    let preventDefault = true
    let key = event.key

    if (isCMD) {
      switch (key) {
        case 'ArrowDown':
          key = 'End'
          break
        case 'ArrowUp':
          key = 'Home'
          break
        case 'A':
          this.updateValueByRange(0, N - 1, false)
          break
      }
    }

    switch (key) {
      case ' ':
      case 'Enter':
      case 'Space':
        if (activeIndex >= 0) {
          event.stopPropagation()

          this.updateValueByIndex(this.state.activeIndex)
        } else {
          preventDefault = false
        }
        break
      case 'ArrowDown':
        const nextIndex = (activeIndex + 1) % N
        this.setState({
          activeIndex: nextIndex,
        })
        if (isShift) {
          this.updateValueByIndex(activeIndex)
        }
        break
      case 'ArrowUp':
        const prevIndex = (((activeIndex - 1) % N) + N) % N
        this.setState({
          activeIndex: prevIndex,
        })
        if (isShift) {
          this.updateValueByIndex(activeIndex)
        }
        break
      case 'Home':
        this.setState({
          activeIndex: 0,
        })

        if (isShift && multiple) {
          this.updateValueByRange(0, activeIndex, false)
        }
        break
      case 'End':
        this.setState({
          activeIndex: N - 1,
        })

        if (isShift && multiple) {
          this.updateValueByRange(activeIndex, N - 1, false)
        }
        break
      default:
        preventDefault = false
    }

    if (preventDefault) event.preventDefault()
  }

  handleClick = ({ id, index }: { id: any; index: number }) => {
    console.log(id, 'handleClick')
    this.setState({ activeIndex: index })
    this.updateValueById(id)
  }

  handleBlur = () => {
    this.resetActiveIndex()
  }

  render() {
    const {
      items,
      className,
      children,
      idForItem,
      isItemDisabled,
      value,
      onChange,
      multiple,
      virtualized,
      ...props
    } = this.props
    const { activeIndex } = this.state
    const selectedIDs = this.selectedIDs

    const renderContainer: VirtualListProps['renderContainer'] = ({
      className,
      children,
      style,
    }) => (
      <ul
        tabIndex={0}
        {...props}
        ref={this.containerRef}
        className={classnames(className, 'container', {
          'is-single-selectable': !multiple,
        })}
        role="listbox"
        aria-readonly={!onChange}
        aria-required={props.required}
        aria-multiselectable={multiple}
        aria-activedescendant={this.activeItemHTMLId}
        style={style}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyPress as any}
      >
        {multiple ? (
          <li
            role="option"
            className={classnames('item', 'selectall', {
              'is-selected': this.state.areSelectedAll,
            })}
            onClick={() => this.selectAll(children)}
          >
            <InputCheckbox
              className={classnames('checkbox', {
                'is-selected': this.state.areSelectedAll,
              })}
              value={this.state.areSelectedAll}
              boxtype={'dashbox'}
              readOnly={false}
            ></InputCheckbox>
            Select All
          </li>
        ) : null}
        {children}
      </ul>
    )
    const renderItem = ({ index, style }) => {
      const item = items[index]
      const id = idForItem(item)
      const isSelected = selectedIDs.has(id)
      const isActive = index === activeIndex
      const isDisabled = isItemDisabled(item)

      return (
        <ListItem
          {...{
            isSelected,
            isActive,
            isDisabled,
            id: `${this.idPrefix}-option-${index}`,
            index,
            style,
            interaction: !this.props.onChange
              ? 'none'
              : multiple
              ? 'checkbox'
              : 'radio',
            handleClick: () => {
              !isDisabled && this.handleClick({ id, index })
            },
          }}
        >
          {children({ index, id, item })}
        </ListItem>
      )

      // if (Array.isArray(item)) {
      //   const key = Object.keys(item)[0]
      //   const listValue = item[key]
      //   return (
      //     <div>
      //       <div className={classnames('listheading')}>
      //         {key}
      //         <br className={classnames('hr1')} />
      //       </div>
      //       {listValue.map((currItem, currIndex) => {
      //         var item = currItem
      //         const id = idForItem(item)
      //         const isSelected = selectedIDs.has(id)
      //         const isActive = currIndex === activeIndex
      //         const isDisabled = isItemDisabled(item)
      //         return (
      //           <ListItem {...{
      //             isSelected,
      //             isActive,
      //             isDisabled,
      //             id: `${this.idPrefix}-option-${currIndex}`,
      //             index: currIndex,
      //             style,
      //             interaction: !this.props.onChange ? 'none' : multiple ? 'checkbox' : 'radio',
      //             handleClick: () => !isDisabled && this.handleClick({ id, index: currIndex })
      //           }}>
      //             {children({ index: currIndex, id, item })}
      //           </ListItem>
      //         )
      //       })}
      //      </div>
      //   )
      // }
    }

    if (virtualized) {
      const renderScroller: VirtualListProps['renderScroller'] = ({
        onScroll,
        style,
        className,
        children,
      }) => (
        <div
          style={style}
          className={className}
          onScroll={onScroll as any}
          ref={this.scrollerRef}
        >
          {children}
        </div>
      )
      return (
        <VirtualList
          ref={this.virtualListRef}
          itemCount={items.length}
          className={classnames(className, 'scroller')}
          estimatedItemSize={33}
          viewportSize={Math.min(360, items.length * 33)}
          renderContainer={renderContainer}
          renderScroller={renderScroller}
          getCellKey={(index) => idForItem(items[index])}
        >
          {renderItem}
        </VirtualList>
      )
    }

    return renderContainer({
      className,
      children: items.map((_, index) => renderItem({ index } as any)),
    } as any)
  }
}
