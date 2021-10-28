import React, { PureComponent, ReactNode, isValidElement } from 'react'
import { TableMeta, FixedPosition, Row, Column } from '../table-interface'
import classnames from './virtual.module.scss'
import Measure, { MeasureData } from '@myntra/uikit-component-measure'
import VirtualList from '@myntra/uikit-component-virtual-list'
import VirtualGrid from '@myntra/uikit-component-virtual-grid'
import ScrollObserver from '../scroll-observer'
import { Provider } from '../table-context'
import { createRef } from '@myntra/uikit-utils'

export interface Props extends BaseProps {
  config: TableMeta
  data: any[]
  scrollMode?: 'container' | 'window'
  getEnhancerState<T = any>(
    name: string
  ): { value: T; onChange(value: T): void }
}

export interface State {
  width: number
  height: number
  viewportWidth: number
  viewportHeight: number
  showFixedEnd: boolean
}

const ESTIMATED_CELL_HEIGHT = 38
const ESTIMATED_CELL_WIDTH = 16
const ESTIMATED_HEADER_HEIGHT = 30

const TR = ({ className, ...props }: BaseProps) => (
  <div className={classnames('tr', className)} {...props} />
)
const TD = ({ className, ...props }: BaseProps) => (
  <div className={classnames('td', className)} {...props} />
)

export default class VirtualTable extends PureComponent<Props, State> {
  static defaultProps = {
    scrollMode: 'container',
  }

  constructor(props) {
    super(props)

    this.state = {
      showFixedEnd: true,
      ...this.getEstimatedSizeAndViewport(),
    }
  }

  headRef = createRef<VirtualList>()
  bodyRef = createRef<VirtualGrid>()
  renderContext = { TD, TR }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    if (prevProps.data.length !== this.props.data.length) {
      this.setState(this.getEstimatedSizeAndViewport())
    }
  }

  getEnhancerState(enhancer: string) {
    return this.props.getEnhancerState(enhancer)
  }

  handleTableMeasure = (size: MeasureData) => {
    const { width, height } = size.bounds

    if (this.state.width !== width || this.state.height !== height) {
      this.setState({ width, height, ...this.getViewport({ width, height }) })
    }
  }

  getViewport({ height = this.state.height, width = this.state.width }) {
    const viewportHeight = Math.min(height, window.innerHeight)
    const viewportWidth = Math.min(width, window.innerWidth)

    return { viewportHeight, viewportWidth }
  }

  handleScroll = (
    position: { scrollLeft: number; scrollTop: number },
    target: HTMLElement
  ) => {
    this.headRef.current.scrollTo(position)
    this.bodyRef.current.scrollTo(position)

    const showFixedEnd =
      position.scrollLeft + target.offsetWidth < target.scrollWidth

    if (showFixedEnd !== this.state.showFixedEnd) {
      this.setState({ showFixedEnd })
    }
  }

  defaultRowRenderer: Row<any> = {
    editing: undefined,
    selector() {
      return true
    },
    render({ rowId, rowIndex, item, ...props }) {
      return <div className={classnames('tr')} key={rowId} {...props} />
    },
  }

  getRowRenderer(rowId: number) {
    const row = this.props.config.rows.find((row) => row.selector(rowId))

    if (!row) return this.defaultRowRenderer

    return row
  }

  // TODO: Refactor this to derived state.
  getEstimatedCellWidth() {
    return Math.max(
      ESTIMATED_CELL_WIDTH,
      (this.state.width - 2) / this.props.config.cells.length
    )
  }

  getEstimatedTableHeight() {
    const headerHeight =
      ESTIMATED_HEADER_HEIGHT * this.props.config.columnsByLevel.length
    if (this.bodyRef.current) {
      return headerHeight + this.bodyRef.current.rowPositionManager.size
    }

    return headerHeight + this.props.config.rows.length * ESTIMATED_CELL_HEIGHT
  }

  getEstimatedTableWidth() {
    if (this.bodyRef.current) {
      return this.bodyRef.current.columnManager.size
    }

    return this.props.config.cells.length * ESTIMATED_CELL_WIDTH
  }

  findColumnWidthByIndex(
    index: number,
    useEstimates = true
  ): number | undefined {
    if (this.bodyRef.current) {
      return this.bodyRef.current.cellSizeManager.columnWidth(index)
    }

    if (useEstimates) return this.getEstimatedCellWidth()
  }

  findColumnWidth(column: Column, useEstimates = true): number {
    const [start, end] = column.indexRange!

    let width = 0

    for (let i = start; i <= end; ++i) {
      width += this.findColumnWidthByIndex(i, useEstimates)
    }

    return Number.isNaN(width) ? null : Math.max(width, column.minWidth || 0)
  }

  renderColumn(column: Column, offsetScroll: number, fixedColumnWidth: number) {
    const stickyWidth =
      this.state.width - (fixedColumnWidth + ESTIMATED_CELL_WIDTH)
    const columnWidth = this.findColumnWidth(column)

    return (
      <div
        key={column.id}
        className={classnames('h-col')}
        style={{ minWidth: columnWidth }}
      >
        <div
          className={classnames('h-col-head', { center: column.colSpan > 1 })}
          style={
            column.fixed === undefined && column.columns.length
              ? {
                  width: columnWidth > stickyWidth ? stickyWidth : null,
                  left: `${offsetScroll + fixedColumnWidth}px`,
                  position: 'sticky',
                }
              : {}
          }
        >
          <span className={classnames('h-col-head-text')}>
            {column.renderHead()}
          </span>
          {column.enhancers.map(([enhancer, props]) =>
            enhancer.renderHead(
              {
                columnId: column.id,
                ...this.getEnhancerState(enhancer.name),
                getter: column.accessor,
              },
              props,
              this.props.data
            )
          )}
        </div>
        {column.columns.length ? (
          <div className={classnames('h-col-children')}>
            {column.columns.map((column) =>
              this.renderColumn(column, offsetScroll, fixedColumnWidth)
            )}
          </div>
        ) : null}
      </div>
    )
  }

  getEstimatedSizeAndViewport = () => {
    const width = this.state
      ? Math.max(this.state.width, this.getEstimatedTableWidth())
      : this.getEstimatedTableWidth()
    const height = this.state
      ? Math.max(this.state.height, this.getEstimatedTableHeight())
      : this.getEstimatedTableHeight()

    return {
      width,
      height,
      ...this.getViewport({ width, height }),
    }
  }

  render() {
    const {
      config,
      data,
      className,
      getEnhancerState: getEnhancerStateForColumn,
      scrollMode,
      ...props
    } = this.props
    const body = config.cells
    const header = config.columnsByLevel[0]
    const headerFixedStart = header.filter(
      (column) => column.fixed === FixedPosition.START
    )
    const headerFixedStartCount = headerFixedStart.length
    const headerFixedEnd = header.filter(
      (column) => column.fixed === FixedPosition.END
    )
    const headerFixedEndCount = headerFixedEnd.length
    const bodyFixedStartCount = headerFixedStart.reduce(
      (sum, column) => sum + column.colSpan,
      0
    )
    const bodyFixedEndCount = headerFixedEnd.reduce(
      (sum, column) => sum + column.colSpan,
      0
    )
    const cellWidth = this.getEstimatedCellWidth()
    const headerHeight = ESTIMATED_HEADER_HEIGHT * config.columnsByLevel.length

    return (
      <Provider value={this.renderContext}>
        <div
          {...props}
          className={classnames('virtual', className, scrollMode)}
          style={
            scrollMode === 'window'
              ? {
                  ...props.style,
                  height: this.getEstimatedTableHeight(),
                  maxHeight: 'unset',
                }
              : props.style
          }
        >
          <div className={classnames('container')}>
            <Measure onMeasure={this.handleTableMeasure}>
              <ScrollObserver
                mode={scrollMode}
                offsetAdjust={headerHeight}
                onScroll={this.handleScroll}
              >
                <div className={classnames('table')}>
                  <VirtualList
                    ref={this.headRef}
                    direction="horizontal"
                    viewportSize={this.state.viewportWidth}
                    estimatedItemSize={cellWidth}
                    itemCount={header.length}
                    fixedItemCountFromStart={headerFixedStart.length}
                    fixedItemCountFromEnd={headerFixedEnd.length}
                    renderScroller={({ children }) =>
                      React.Children.only(children)
                    }
                    renderContainer={({
                      style,
                      children,
                      size,
                      offsetScroll,
                    }) => {
                      const start = children.slice(0, headerFixedStartCount)
                      const middle = children.slice(
                        headerFixedStartCount,
                        children.length - headerFixedEndCount
                      )
                      const end = children.slice(
                        children.length - headerFixedEndCount
                      )

                      return (
                        <div
                          className={classnames('thead')}
                          style={{
                            ...style,
                            position: 'sticky',
                            top: 0,
                            left: -size,
                            height: headerHeight,
                          }}
                        >
                          {start.length ? (
                            <div
                              className={classnames('fixed', 'show')}
                              key="start"
                              style={{
                                left: offsetScroll,
                                height: headerHeight,
                              }}
                            >
                              {start}
                            </div>
                          ) : null}
                          {middle}
                          {end.length ? (
                            <div
                              className={classnames('fixed', 'end', {
                                show: this.state.showFixedEnd,
                              })}
                              key="end"
                              style={{
                                left: offsetScroll + this.state.width,
                                height: headerHeight,
                              }}
                            >
                              {end}
                            </div>
                          ) : null}
                        </div>
                      )
                    }}
                  >
                    {({ index, style, offsetScroll, fixedColumnWidth }) => {
                      const column = header[index]

                      return (
                        <div
                          key={index}
                          style={{
                            ...style,
                            position: null,
                            minWidth: cellWidth * column.colSpan,
                            width: this.findColumnWidth(column, false),
                          }}
                          className={classnames('th')}
                        >
                          {this.renderColumn(
                            column,
                            offsetScroll,
                            fixedColumnWidth
                          )}
                        </div>
                      )
                    }}
                  </VirtualList>
                  {!!data.length && (
                    <VirtualGrid
                      ref={this.bodyRef}
                      rows={data.length}
                      columns={body.length}
                      fixedColumnsFromStart={bodyFixedStartCount}
                      fixedColumnsFromEnd={bodyFixedEndCount}
                      height={this.state.viewportHeight}
                      width={this.state.viewportWidth}
                      renderContainer={({ children, style }) => (
                        <div style={style} className={classnames('tbody')}>
                          {children}
                        </div>
                      )}
                      renderScroller={({ children }) =>
                        React.Children.only(children)
                      }
                      renderRow={({
                        rowIndex,
                        offsetTop,
                        scrollLeft,
                        isScrolling,
                        children,
                        height,
                      }) => {
                        const start = children.slice(0, bodyFixedStartCount)
                        const middle = children.slice(
                          bodyFixedStartCount,
                          children.length - bodyFixedEndCount
                        )
                        const end = children.slice(
                          children.length - bodyFixedEndCount
                        )

                        const row = this.getRowRenderer(rowIndex)
                        return row.render({
                          rowIndex,
                          rowId: rowIndex,
                          item: data[rowIndex],
                          className: classnames('tr'),
                          style: {
                            top: offsetTop + 'px',
                            height: height + 'px',
                            pointerEvents: isScrolling ? 'none' : null,
                          },
                          children: [
                            start.length ? (
                              <div
                                key="start"
                                className={classnames('fixed', 'show')}
                                style={{ left: scrollLeft }}
                              >
                                {start}
                              </div>
                            ) : null,
                            middle,
                            end.length ? (
                              <div
                                key="end"
                                className={classnames('fixed', 'end', {
                                  show: this.state.showFixedEnd,
                                })}
                                style={{ left: scrollLeft + this.state.width }}
                              >
                                {end}
                              </div>
                            ) : null,
                          ],
                        })
                      }}
                      estimatedCellHeight={ESTIMATED_CELL_HEIGHT}
                      estimatedCellWidth={cellWidth}
                    >
                      {({ rowIndex, columnIndex, style }) => {
                        const cell = body[columnIndex]
                        const row = this.getRowRenderer(rowIndex)
                        const props = {
                          index: rowIndex,
                          rowId: rowIndex,
                          columnId: cell.id,
                          item: data[rowIndex],
                          data: data[rowIndex],
                          value: cell.accessor(data[rowIndex], rowIndex),
                        }

                        return (
                          <div
                            className={classnames('td')}
                            key={cell.id}
                            data-row-index={rowIndex}
                            data-column-index={columnIndex}
                            style={{
                              ...style,
                              top: 0,
                              minWidth: Math.max(
                                cell.colSpan * cellWidth,
                                this.findColumnWidthByIndex(columnIndex),
                                config.cells[columnIndex].minWidth || 0
                              ),
                              position: null,
                            }}
                          >
                            {row.editing !== false &&
                            cell.editing &&
                            cell.renderEditor
                              ? cell.renderEditor(props)
                              : cell.renderCell(props)}
                          </div>
                        )
                      }}
                    </VirtualGrid>
                  )}
                </div>
              </ScrollObserver>
            </Measure>
          </div>
        </div>
      </Provider>
    )
  }
}
