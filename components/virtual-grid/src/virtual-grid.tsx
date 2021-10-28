import React, { PureComponent, ReactNode } from 'react'
import {
  createMeasureCache,
  findOverScanRange,
  createPositionManager,
  CellMeasure,
  MeasureCache,
  PositionManager,
} from '@myntra/uikit-component-virtual-list'

export interface ScrollPosition {
  scrollTop: number
  scrollLeft: number
}

export interface Props extends BaseProps {
  /**
   * Number of rows in the grid.
   */
  rows: number
  /**
   * Number of columns in the grid.
   */
  columns: number
  /**
   * Height of the grid container.
   */
  height: number
  /**
   * Width of the grid container.
   */
  width: number
  /**
   * A callback to render grid item at given cell.
   */
  children(props: {
    rowIndex: number
    columnIndex: number
    offsetTop: number
    offsetLeft: number
    rowHeight: number
    columnWidth: number
    isScrolling: boolean
    style: Record<string, string | number>
  }): JSX.Element
  /**
   * Number of columns (from start) always rendered.
   * @deprecated Use [fixedColumnsFromStart](#table.fixedColumnsFromStart)
   */
  fixedColumns?: number
  /**
   * Number of columns (from start) always rendered.
   */
  fixedColumnsFromStart?: number
  /**
   * Number of columns (from end) always rendered.
   */
  fixedColumnsFromEnd?: number
  /**
   * Number of rows to render outside of viewport.
   */
  overScanRows?: number
  /**
   * Number of columns to render outside of viewport.
   */
  overScanColumns?: number
  /**
   * Estimated item height to estimate content height.
   */
  estimatedCellHeight?: number
  /**
   * Estimated item width to estimate content width.
   */
  estimatedCellWidth: number
  renderScroller?(props: {
    onScroll(event: {
      target: {
        scrollTop: number
        scrollLeft: number
      }
    }): void
    width: number
    height: number
    style: Record<string, string | number>
    children: any
  }): JSX.Element
  renderContainer?(props: {
    /**
     * Height of grid content.
     */
    offsetHeight: number
    /**
     * Width of grid content.
     */
    offsetWidth: number
    /**
     * Height of rendered content.
     */
    renderedHeight: number
    /**
     * Width of rendered content.
     */
    renderedWidth: number
    /**
     * Scroll position from left.
     */
    offsetLeft: number
    /**
     * Scroll position from top.
     */
    offsetTop: number
    /**
     * Styles to position and configure scroll behaviour.
     */
    style: Record<string, string | number>
    className?: string
    children: any
  }): ReactNode
  renderRow?(props: {
    grid: VirtualGrid
    offsetTop: number
    height: number
    rowIndex: number
    isScrolling: boolean
    scrollLeft: number
    children: Array<any>
  }): ReactNode
  onMeasure?(event: {
    row: number
    column: number
    size: { width: number; height: number }
  }): void
}

/**
 * A grid using windowing technique to render only visible area.
 *
 * @since 0.8.0
 * @status READY
 * @category advanced
 * @see http://uikit.myntra.com/components/virtual-grid
 */
export default class VirtualGrid extends PureComponent<
  Props,
  {
    _render: number
    isScrolling: boolean
    scrollTop: number
    scrollLeft: number
    scrollDirectionHorizontal: number
    scrollDirectionVertical: number
  }
> {
  cellSizeManager: MeasureCache

  rowPositionManager: PositionManager
  columnManager: PositionManager

  renderCache: Record<string, any>

  isScrollingTimerId: number
  hasPendingRender: number
  scrollFrameId: number

  static defaultProps = {
    estimatedCellHeight: 30,
    estimatedCellWidth: 120,
    overScanRows: 3,
    overScanColumns: 3,
    fixedColumnsFromStart: 0,
    fixedColumnsFromEnd: 0,
    renderScroller: ({ onScroll, style, children }) => (
      <div style={style} onScroll={onScroll}>
        {children}
      </div>
    ),
    renderContainer: ({ style, children }) => (
      <div style={style}>{children}</div>
    ),
  }

  constructor(props) {
    super(props)

    this.state = {
      _render: 0,
      isScrolling: false,
      scrollTop: 0,
      scrollLeft: 0,
      scrollDirectionHorizontal: 1,
      scrollDirectionVertical: 1,
    }

    this.cellSizeManager = createMeasureCache(
      props.estimatedCellHeight,
      props.estimatedCellWidth
    )
    this.rowPositionManager = createPositionManager({
      count: props.rows,
      estimatedSize: props.estimatedCellHeight,
      sizeGetter: (index) =>
        this.cellSizeManager.hasMax(index, Infinity)
          ? this.cellSizeManager.rowHeight(index)
          : null,
    })
    this.columnManager = createPositionManager({
      count: props.columns,
      estimatedSize: props.estimatedCellWidth,
      sizeGetter: (index) =>
        this.cellSizeManager.hasMax(Infinity, index)
          ? this.cellSizeManager.columnWidth(index)
          : null,
    })
    this.renderCache = {}
  }

  /**
   * Clear position and size caches on row/column count change.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.rows !== nextProps.rows) {
      this.rowPositionManager.configure({
        count: nextProps.rows,
        estimatedSize: nextProps.estimatedCellHeight,
      })
    }

    if (this.props.columns !== nextProps.columns) {
      this.columnManager.configure({
        count: nextProps.columns,
        estimatedSize: nextProps.estimatedCellWidth,
      })
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.scrollFrameId)
    window.cancelAnimationFrame(this.hasPendingRender)
  }

  handleScroll = (event) => {
    const el = event.target

    if (el.scrollTop < 0) return

    this.scrollTo(el)
  }

  /** @public */
  scrollTo(position: ScrollPosition) {
    if (!this.state.isScrolling) this.setState({ isScrolling: true })

    clearTimeout(this.isScrollingTimerId)

    this.isScrollingTimerId = window.setTimeout(
      () => this.setState({ isScrolling: false }),
      300
    )

    window.cancelAnimationFrame(this.scrollFrameId)
    this.scrollFrameId = window.requestAnimationFrame(() => {
      this.scrollFrameId = null
      this.computeScrollOffsets(position)
    })
  }

  handleMeasure = ({ row, column, size }, data) => {
    this.cellSizeManager.set(row, column, size, {
      ignoreColumnWidth: Number(data.colSpan) > 1,
      ignoreRowHeight: Number(data.rowSpan) > 1,
    })

    this.rowPositionManager.resetCellAt(row)
    this.columnManager.resetCellAt(column)

    if (this.props.onMeasure) {
      this.props.onMeasure({ row, column, size })
    }

    if (!this.hasPendingRender) {
      this.hasPendingRender = window.setTimeout(() => {
        this.setState((state) => ({ _render: state._render + 1 }))
      }, 16)
    }
  }

  computeScrollOffsets({ scrollTop, scrollLeft }: ScrollPosition) {
    scrollTop = Math.max(0, scrollTop)
    scrollLeft = Math.max(0, scrollLeft)
    if (
      scrollTop !== this.state.scrollTop ||
      scrollLeft !== this.state.scrollLeft
    ) {
      this.setState({
        scrollTop,
        scrollLeft,
        scrollDirectionVertical: scrollTop < this.state.scrollTop ? -1 : 1,
        scrollDirectionHorizontal: scrollLeft < this.state.scrollLeft ? -1 : 1,
      })
    }
  }

  render() {
    this.hasPendingRender = null

    const {
      width,
      height,
      rows,
      columns,
      fixedColumnsFromEnd,
      overScanRows,
      overScanColumns,
    } = this.props
    const {
      scrollTop,
      scrollLeft,
      scrollDirectionVertical,
      scrollDirectionHorizontal,
      isScrolling,
    } = this.state

    const fixedColumnsFromStart =
      typeof this.props.fixedColumns === 'number'
        ? this.props.fixedColumns
        : this.props.fixedColumnsFromStart

    if (isScrolling) {
      this.renderCache = {}
    }

    const visibleVerticalRange = this.rowPositionManager.findVisibleRange(
      scrollTop,
      height
    )
    const visibleHorizontalRange = this.columnManager.findVisibleRange(
      scrollLeft,
      width
    )

    const verticalRange = findOverScanRange(
      visibleVerticalRange,
      scrollDirectionVertical,
      overScanRows,
      rows
    )
    const horizontalRange = findOverScanRange(
      visibleHorizontalRange,
      scrollDirectionHorizontal,
      overScanColumns,
      columns
    )

    const children = []

    const doRenderColumn = ({
      i,
      j,
      rowOffsetTop,
      cellHeight,
      currentRowChildren,
    }) => {
      const renderId = `${i}:${j}`

      if (isScrolling && renderId in this.renderCache) {
        currentRowChildren.push(this.renderCache[renderId])
        return
      }

      const {
        offset: columnOffsetLeft,
        size: cellWidth,
      } = this.columnManager.getCellAt(j)

      const style = {
        position: 'absolute',
        top: rowOffsetTop + 'px',
        left: columnOffsetLeft + 'px',
        minHeight: cellHeight + 'px',
        minWidth: cellWidth + 'px',
      }

      const node = this.props.children({
        rowIndex: i,
        columnIndex: j,
        offsetTop: rowOffsetTop,
        offsetLeft: columnOffsetLeft,
        rowHeight: cellHeight,
        columnWidth: cellWidth,
        isScrolling,
        style,
      })

      const cell = node ? (
        <CellMeasure
          key={i + ':' + j}
          row={i}
          column={j}
          cache={this.cellSizeManager}
          onMeasure={this.handleMeasure}
        >
          {node}
        </CellMeasure>
      ) : (
        node
      )

      if (isScrolling && cell) {
        this.renderCache[renderId] = cell
      }

      currentRowChildren.push(cell)
    }

    const doRenderRow = ({ i }) => {
      const currentRowChildren = []
      const {
        offset: rowOffsetTop,
        size: cellHeight,
      } = this.rowPositionManager.getCellAt(i)

      for (let j = 0; j < fixedColumnsFromStart; ++j) {
        doRenderColumn({ i, j, rowOffsetTop, cellHeight, currentRowChildren })
      }

      for (
        let j = Math.max(fixedColumnsFromStart, horizontalRange.start);
        j <= horizontalRange.end;
        ++j
      ) {
        doRenderColumn({ i, j, rowOffsetTop, cellHeight, currentRowChildren })
      }

      for (
        let j = Math.max(horizontalRange.end, columns - fixedColumnsFromEnd);
        j < columns;
        ++j
      ) {
        doRenderColumn({ i, j, rowOffsetTop, cellHeight, currentRowChildren })
      }

      if (this.props.renderRow) {
        children.push(
          React.cloneElement(
            this.props.renderRow({
              offsetTop: rowOffsetTop,
              height: cellHeight,
              rowIndex: i,
              children: currentRowChildren,
              grid: this,
              isScrolling,
              scrollLeft,
            }) as any,
            { key: `${i}` }
          )
        )
      } else {
        children.push(...currentRowChildren)
      }
    }

    for (let i = verticalRange.start; i <= verticalRange.end; ++i) {
      doRenderRow({ i })
    }

    const offsetHeight = this.rowPositionManager.size
    const offsetWidth = this.columnManager.size
    const renderedHeight =
      this.rowPositionManager.getCellAt(verticalRange.end).offset +
      this.rowPositionManager.getCellAt(verticalRange.end).size -
      this.rowPositionManager.getCellAt(verticalRange.start).offset
    const renderedWidth =
      this.columnManager.getCellAt(horizontalRange.end).offset +
      this.columnManager.getCellAt(horizontalRange.end).size -
      this.columnManager.getCellAt(horizontalRange.start).offset

    return this.props.renderScroller({
      onScroll: this.handleScroll,
      width,
      height,
      style: {
        overflow: 'auto',
        height: height + 'px',
        width: width + 'px',
      },
      children: this.props.renderContainer({
        offsetHeight,
        offsetWidth,
        renderedHeight,
        renderedWidth,
        offsetLeft: this.columnManager.getCellAt(horizontalRange.start).offset,
        offsetTop: this.rowPositionManager.getCellAt(verticalRange.start)
          .offset,
        style: {
          overflow: 'hidden',
          position: 'relative',
          height: offsetHeight + 'px',
          width: offsetWidth + 'px',
        },
        children,
      }),
    })
  }
}
