import React, { PureComponent } from 'react'
import {
  createPositionManager,
  createMeasureCache,
  findOverScanRange,
  MeasureCache,
  PositionManager,
} from './helpers'
import CellMeasure from './virtual-list-cell-measure'

export interface Props extends BaseProps {
  /**
   * Number of items in the list.
   */
  itemCount: number
  /**
   * Height (or width for horizontal list) of the list container.
   */
  viewportSize: number
  /**
   * A callback to render list item at given position.
   */
  children(props: {
    list: VirtualList
    index: number
    /**
     * Position of children element from top (or left in horizontal scroller).
     */
    offset: number
    /**
     * Scroll position from top (or left in horizontal scroller).
     */
    offsetScroll: number
    size: number
    style: Record<string, string | number>
    fixedColumnWidth: number
  }): JSX.Element
  /**
   * Estimated item height (or width) to estimate content height (or width).
   */
  estimatedItemSize?: number
  /**
   * Number of items to render outside of viewport.
   */
  overScanItemCount?: number
  /**
   * Number of items (from start) always rendered.
   */
  fixedItemCountFromStart?: number

  /**
   * Number of items (from start) always rendered.
   */
  fixedItemCountFromEnd?: number

  /**
   * @deprecated use [fixedItemCountFromStart](#virtual-list.fixedItemCountFromStart)
   */
  fixedItemCount?: number
  /**
   * List scroll direction.
   */
  direction?: 'horizontal' | 'vertical'
  /**
   * Render a wrapper element which would have scrollbars.
   */
  renderScroller?(props: {
    /**
     * A callback function to recompute visible area on scroll.
     */
    onScroll(event: { target: { scrollLeft: number; screenTop: number } }): void
    /**
     * Height or width of the content.
     */
    size: number
    /**
     * Styles to position and configure scroll behaviour.
     */
    style: Record<string, string | number>
    className?: string
    children: any
  }): JSX.Element
  /**
   * Render inner container of scroller container. This sets the scroll height and
   * positions rendered content in visible window.
   */
  renderContainer?(props: {
    /**
     * Offset of rendered content from top (or left in horizontal scroller).
     */
    offsetStart: number
    /**
     * Scroll position from top (or left in horizontal scroller).
     */
    offsetScroll: number
    /**
     * Height or width of the content.
     */
    size: number
    /**
     * Styles to position and configure scroll behaviour.
     */
    style: Record<string, string | number>
    className?: string
    children: Array<any>
  }): JSX.Element

  getCellKey?(index: number): 'string' | 'number'
}

/**
 * A list using windowing technique to render only visible area.
 *
 * @since 0.7.0
 * @status READY
 * @category advanced
 * @see http://uikit.myntra.com/components/virtual-list
 */
export default class VirtualList extends PureComponent<
  Props,
  {
    offsetScroll: number
    scrollDirection: number
    _forceRender: number
  }
> {
  static defaultProps = {
    estimatedItemSize: 30,
    overScanItemCount: 3,
    fixedItemCountFromStart: 0,
    fixedItemCountFromEnd: 0,
    direction: 'vertical',
    renderScroller: ({ onScroll, style, className, children }) => (
      <div style={style} className={className} onScroll={onScroll}>
        {children}
      </div>
    ),
    renderContainer: ({ style, className, children }) => (
      <div style={style} className={className}>
        {children}
      </div>
    ),
    getCellKey: (index) => index,
  }

  isHorizontal: boolean
  hasPendingRender: number
  scrollFrameId: number
  sizes: MeasureCache
  manager: PositionManager

  constructor(props) {
    super(props)

    this.state = {
      offsetScroll: 0,
      scrollDirection: 1,
      _forceRender: 0,
    }

    this.isHorizontal = props.direction === 'horizontal'

    this.sizes = createMeasureCache()
    this.manager =
      props._manager ||
      createPositionManager({
        count: props.itemCount,
        estimatedSize: props.estimatedItemSize,
        sizeGetter: this.isHorizontal
          ? (index) =>
              this.sizes.has(index) ? this.sizes.get(index).width : null
          : (index) =>
              this.sizes.has(index) ? this.sizes.get(index).height : null,
      })
  }

  // TODO: Replace when min version is >= 16.0.0
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (nextProps.itemCount !== this.props.itemCount) {
      this.manager.configure({
        count: nextProps.itemCount,
        estimatedSize: nextProps.estimatedItemSize,
      })
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.hasPendingRender)
  }

  genStyle(offset: number) {
    return this.isHorizontal
      ? { position: 'absolute', left: offset + 'px' }
      : { position: 'absolute', top: offset + 'px' }
  }

  handleMeasure = ({ row, column, size }) => {
    this.sizes.set(row, column, size)
    this.manager.resetCellAt(row)

    this.triggerRender()
  }

  triggerRender = () => {
    if (!this.hasPendingRender) {
      this.hasPendingRender = window.requestAnimationFrame(() => {
        this.hasPendingRender = null
        this.setState((state) => ({ _forceRender: state._forceRender + 1 }))
      })
    }
  }

  handleScroll = (event) => {
    this.scrollTo(event.target)
  }

  /** @public */
  scrollToIndex(index: number) {
    if (index >= this.manager.count) return

    const cell = this.manager.getCellAt(index)

    if (
      this.state.offsetScroll > cell.offset ||
      this.state.offsetScroll + this.props.viewportSize <
        cell.offset + cell.size
    ) {
      const offset =
        cell.offset < this.state.offsetScroll
          ? cell.offset
          : cell.offset - this.props.viewportSize + cell.size

      this.scrollTo({ scrollLeft: offset, scrollTop: offset })

      return offset
    }
  }

  /** @public */
  scrollTo(position: { scrollLeft: number; scrollTop: number }) {
    this.triggerRender()
    window.cancelAnimationFrame(this.scrollFrameId)
    this.scrollFrameId = window.requestAnimationFrame(() => {
      this.scrollFrameId = null

      this.computeScrollOffsets(
        this.isHorizontal ? position.scrollLeft : position.scrollTop
      )
    })
  }

  computeScrollOffsets(offsetScroll) {
    offsetScroll = Math.max(0, offsetScroll)
    if (offsetScroll !== this.state.offsetScroll) {
      this.setState({
        offsetScroll,
        scrollDirection: offsetScroll < this.state.offsetScroll ? -1 : 1,
      })
    }
  }

  render() {
    this.hasPendingRender = null

    const {
      viewportSize,
      itemCount,
      overScanItemCount,
      fixedItemCount,
      fixedItemCountFromStart,
      fixedItemCountFromEnd,
      className,
      children: renderItem,
      direction,
      estimatedItemSize,
      renderContainer,
      renderScroller,
      getCellKey,
      ...props
    } = this.props
    const { offsetScroll, scrollDirection } = this.state

    const visibleRange = this.manager.findVisibleRange(
      offsetScroll,
      viewportSize
    )
    const range = findOverScanRange(
      visibleRange,
      scrollDirection,
      overScanItemCount,
      itemCount
    )

    const children = []

    const renderChild = (index) => {
      const { offset, size } = this.manager.getCellAt(index)
      const style = this.genStyle(offset)
      const fixedColumnWidth = this.manager.getCellAt(fixedItemCountFromStart)
        .offset

      const node = renderItem({
        list: this,
        index,
        offset,
        offsetScroll,
        size,
        style,
        fixedColumnWidth,
      })

      children.push(
        node && this.props._skipMeasure !== true ? (
          <CellMeasure
            key={getCellKey(index)}
            row={index}
            column={0}
            cache={this.sizes}
            onMeasure={this.handleMeasure}
          >
            {node}
          </CellMeasure>
        ) : (
          node
        )
      )
    }

    const fixedFromStart =
      typeof fixedItemCount === 'number'
        ? fixedItemCount
        : fixedItemCountFromStart
    for (
      let index = 0;
      index < fixedFromStart && index < range.start;
      ++index
    ) {
      renderChild(index)
    }

    for (let index = range.start; index <= range.end; ++index) {
      renderChild(index)
    }

    const fixedFromEnd = Math.max(0, itemCount - fixedItemCountFromEnd)
    for (
      let index = Math.max(fixedFromEnd, range.end + 1);
      index < itemCount;
      ++index
    ) {
      renderChild(index)
    }

    return renderScroller({
      ...props,
      className,
      onScroll: this.handleScroll,
      size: this.manager.size,
      style: this.isHorizontal
        ? {
            ...props.style,
            overflowX: 'auto',
            width: viewportSize + 'px',
          }
        : {
            ...props.style,
            overflowY: 'auto',
            height: viewportSize + 'px',
          },
      children: renderContainer({
        offsetStart: this.manager.getCellAt(range.start).offset,
        offsetScroll,
        size: this.manager.size,
        style: this.isHorizontal
          ? {
              overflow: 'hidden',
              position: 'relative',
              width: this.manager.size + 'px',
            }
          : {
              overflow: 'hidden',
              position: 'relative',
              height: this.manager.size + 'px',
            },
        children,
      }),
    })
  }
}
