import React, { PureComponent } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import VirtualList, {
  Props as VirtualListProps,
} from '@myntra/uikit-component-virtual-list'
import InputCheckbox from '@myntra/uikit-component-input-checkbox'
import classnames from './list.module.scss'
import { createRef, isNullOrUndefined } from '@myntra/uikit-utils'
import InputRadio from '@myntra/uikit-component-input-radio'

export interface Props<T = any> extends BaseProps {
  /**
   * An array of items to render in the list.
   */
  items: T[]

  /**
   * Renders markup for displaying a list item.
   */
  children(props: { index: number; id: string | number | T; item: T }): void

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
    this.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
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
          ? scrollIntoView(
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
      const selectedIDs = this.computeSelectedIds()

      if (value || (multiple && value && value.length)) {
        this.setState({
          activeIndex: Math.max(
            0,
            items.findIndex((item) => selectedIDs.has(idForItem(item)))
          ),
        })
      }
    }
    const selectedIds = this.computeSelectedIds()
    const totalItems = this.computeTotalItems()
    const disabledItems = this.computeDisabled()
    if (selectedIds.size === totalItems - disabledItems) {
      this.setState({ areSelectedAll: true })
    } else {
      this.setState({ areSelectedAll: false })
    }
  }

  get activeItemHTMLId() {
    if (this.state.activeIndex >= 0)
      return `${this.idPrefix}-option-${this.state.activeIndex}`

    return null
  }

  computeSelectedIds() {
    return this.props.value != null
      ? new Set(
          Array.isArray(this.props.value)
            ? this.props.value
            : [this.props.value]
        )
      : new Set()
  }

  computeDisabled() {
    let numDisabled = 0
    for (let i = 0; i < this.props.items.length; i++) {
      if (this.props.isItemDisabled(this.props.items[i])) {
        numDisabled++
      }
    }
    return numDisabled
  }

  computeTotalItems = () => {
    // compute total items
    var lenItems = 0
    if (typeof this.props.items === 'string') {
      // single list
      lenItems = this.props.children.length
    } else {
      // grouped list
      for (let index = 0; index < this.props.items.length; index++) {
        const item = this.props.items[index]
        const key = Object.keys(item)[0]
        const listGroup = item[key]
        lenItems = lenItems + listGroup.length
      }
    }
    return lenItems
  }

  updateValueById(id: any) {
    if (isNullOrUndefined(id)) return
    if (!this.props.onChange) return

    if (!this.props.multiple) {
      return this.props.onChange(id)
    }

    const ids = this.computeSelectedIds()

    let value = this.props.value ? (this.props.value as Array<any>).slice() : []

    if (ids.has(id)) {
      const index = value.indexOf(id)

      value.splice(index, 1)
    } else {
      value.push(id)
    }

    return this.props.onChange(value)
  }

  updateValueByRange(start: number, end: number, toggle: boolean = true) {
    if (!this.props.multiple) return
    if (!this.props.onChange) return

    const { idForItem, items, isItemDisabled } = this.props
    const ids = this.computeSelectedIds()

    let value = this.props.value ? (this.props.value as Array<any>).slice() : []

    for (let index = start; index <= end; ++index) {
      const id = idForItem(items[index])
      const isDisabled = isItemDisabled(items[index])
      if (isDisabled) {
        continue
      }
      if (typeof id === 'string') {
        // single list
        if (ids.has(id)) {
          if (toggle) {
            value.splice(value.indexOf(id), 1)
          }
        } else {
          value.push(id)
        }
      } else {
        // grouped list
        const key = Object.keys(id)[0]
        const listGroup = id[key]
        for (let i = 0; i < listGroup.length; i++) {
          if (ids.has(listGroup[i])) {
            if (toggle) {
              value.splice(value.indexOf(listGroup[i], 1))
            }
          } else {
            value.push(listGroup[i])
          }
        }
      }
    }
    this.props.onChange(value)
  }

  updateValueByIndex(index: number) {
    return this.updateValueById(this.props.idForItem(this.props.items[index]))
  }

  handleClick = ({ id, index }: { id: any; index: number }) => {
    this.setState({ activeIndex: index })
    this.updateValueById(id)
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
      }
    }

    switch (key) {
      case 'A':
        if (isCMD && multiple) {
          this.updateValueByRange(0, N - 1, false)
        } else {
          preventDefault = false
        }
        break
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

  handleBlur = () => {
    this.resetActiveIndex()
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
    const selectedIDs = this.computeSelectedIds()
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
            className={classnames('item', {
              'is-selected': this.state.areSelectedAll,
              selectall: true,
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
      if (typeof item !== 'string') {
        const key = Object.keys(item)[0]
        const listValue = item[key]
        return (
          <div>
            <div className={classnames('listheading')}>
              {key}
              <div className={classnames('hr1')}></div>
            </div>
            {listValue.map((currItem, currIndex) => {
              var item = currItem
              const id = idForItem(item)
              const isSelected = selectedIDs.has(id)
              const isActive = currIndex === activeIndex
              const isDisabled = isItemDisabled(item)
              return (
                <li
                  key={id}
                  role="option"
                  aria-selected={isSelected}
                  id={`${this.idPrefix}-option-${currIndex}`}
                  data-index={currIndex}
                  data-id={id}
                  style={style}
                  className={classnames('item', {
                    'is-selected': isSelected,
                    'is-active': isActive,
                    'is-disabled': isDisabled,
                  })}
                  onClick={() =>
                    !isDisabled && this.handleClick({ id, index: currIndex })
                  }
                >
                  {!multiple && this.props.onChange ? (
                    <InputRadio
                      className={classnames('radio')}
                      value={isSelected ? 'ok' : 'error'}
                      options={[{ value: 'ok', label: '' }]}
                    />
                  ) : null}
                  <InputCheckbox
                    className={classnames('checkbox')}
                    value={isSelected}
                    htmlValue={id}
                    tabIndex={-1}
                    readOnly
                    hidden={!multiple}
                    disabled={isDisabled}
                  />
                  {children({ index: currIndex, id, item })}
                </li>
              )
            })}
          </div>
        )
      } else {
        return (
          <li
            key={id}
            role="option"
            aria-selected={isSelected}
            id={`${this.idPrefix}-option-${index}`}
            data-index={index}
            data-id={id}
            style={style}
            className={classnames('item', {
              'is-selected': isSelected,
              'is-active': isActive,
              'is-disabled': isDisabled,
            })}
            onClick={() => !isDisabled && this.handleClick({ id, index })}
          >
            {!multiple && this.props.onChange ? (
              <InputRadio
                className={classnames('radio')}
                value={isSelected ? 'ok' : 'error'}
                options={[{ value: 'ok', label: '' }]}
              />
            ) : null}
            <InputCheckbox
              className={classnames('checkbox')}
              value={isSelected}
              htmlValue={id}
              tabIndex={-1}
              readOnly
              hidden={!multiple}
              disabled={isDisabled}
            />
            {children({ index, id, item })}
          </li>
        )
      }
    }

    if (virtualized) {
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
