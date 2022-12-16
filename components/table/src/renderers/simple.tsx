import React, { PureComponent, ReactNode, isValidElement } from 'react'
import { TableMeta, FixedPosition, Column } from '../table-interface'
import classnames from './simple.module.scss'
import { Provider } from '../table-context'
import Measure, { MeasureData } from '@mapplique/uikit-component-measure'
import Button from '@mapplique/uikit-component-button'

export interface Props extends BaseProps {
  config: TableMeta
  data: any[]
  getEnhancerState<T = any>(
    name: string
  ): { value: T; onChange(value: T): void }
}

const TR = (props: BaseProps) => <tr {...props} />
const TD = (props: BaseProps) => <td {...props} />

export default class SimpleTable extends PureComponent<
  Props,
  {
    offsets: Record<number, number>
    editing: boolean
  }
> {
  nextAnimationFrame: number
  state = {
    offsets: {},
    editing: false,
  }

  tableContext = { TR, TD }

  defaultRowRenderer = {
    selector() {
      return true
    },
    render({ rowId, rowIndex, item, ...props }) {
      return <tr key={rowId} {...props} />
    },
  }

  warpIfNeeded(
    node: ReactNode,
    props: Record<string, any>,
    column: Object | any,
    rowIndex: number
  ) {
    const key = column.id
    const { editing } = this.state
    if (isValidElement(node)) {
      if (node.type === 'td') {
        return React.cloneElement(node, { key })
      }
    }
    return (
      <td key={key} {...props}>
        {editing && typeof node !== 'object' && column.editorComponent
          ? React.cloneElement(column.editorComponent, {
              value: node,
              onChange: (value) =>
                this.props.onEdit(value, rowIndex, column.id),
            })
          : node}
      </td>
    )
  }

  getRowRenderer(rowId: number) {
    const row = this.props.config.rows.find((row) => row.selector(rowId))

    if (!row) return this.defaultRowRenderer

    return row
  }

  handleColumnMeasure = (column: Column, offset: MeasureData['offset']) => {
    const index = this.props.config.cells.indexOf(column)

    if (index >= 0) {
      this.setState(({ offsets }) => ({
        offsets: { ...offsets, [index]: offset.left },
      }))
    }
  }

  getEnhancerState(enhancer: string) {
    return this.props.getEnhancerState(enhancer)
  }

  toggleEdit = () => {
    this.setState({ editing: !this.state.editing })
  }

  render() {
    const {
      config,
      data,
      className,
      children,
      style,
      getEnhancerState: getEnhancerStateForColumn,
      editable,
      isEditing,
      ...props
    } = this.props
    const maxDepth = config.columnsByLevel.length
    const { editing } = this.state

    return (
      <Provider value={this.tableContext}>
        <div className={classnames('simple', className)} style={style}>
          {editable && (
            <Button
              type="secondary"
              className={classnames('edit-button')}
              onClick={this.toggleEdit}
            >
              {editing ? `Cancel` : `Edit`}
            </Button>
          )}
          <div className={classnames('container')}>
            <table {...props} className={classnames('table')}>
              <thead>
                {config.columnsByLevel.map((columns, headLevel) => (
                  <tr key={headLevel}>
                    {columns.map((column) => (
                      <Measure
                        key={column.id}
                        onMeasure={({ offset }) =>
                          this.handleColumnMeasure(column, offset)
                        }
                      >
                        {({ ref, content }) => (
                          <th
                            ref={ref}
                            key={column.id}
                            rowSpan={maxDepth - column.level - column.depth}
                            colSpan={column.colSpan}
                            className={classnames({
                              'has-sub-columns': column.columns.length > 0,
                              fixed: typeof column.fixed !== 'undefined',
                              end: column.fixed === FixedPosition.END,
                            })}
                            style={{
                              // @ts-ignore
                              '--sticky-top-offset': `calc(${headLevel} * var(--table-head-height))`,
                              '--sticky-left-offset':
                                typeof column.fixed !== 'undefined'
                                  ? content.offset.left + 'px'
                                  : 'unset',
                              width: column.width,
                              // @ts-ignore
                              textAlign: `${column.align}`,
                            }}
                          >
                            {column.renderHead()}
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
                          </th>
                        )}
                      </Measure>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {data.map((item, rowId) =>
                  React.cloneElement(
                    this.getRowRenderer(rowId).render({
                      rowIndex: rowId,
                      rowId,
                      item,
                      children: config.cells.map((column, columnIndex) => {
                        const cellProps = {
                          className: classnames({
                            fixed: typeof column.fixed !== 'undefined',
                            end: column.fixed === FixedPosition.END,
                          }),
                          style: {
                            '--sticky-left-offset':
                              typeof column.fixed !== 'undefined'
                                ? this.state.offsets[columnIndex] + 'px'
                                : 'unset',
                            width: column.width,
                            // @ts-ignore
                            textAlign: `${column.align}`,
                          },
                        }

                        return this.warpIfNeeded(
                          column.renderCell({
                            ...cellProps,
                            index: rowId,
                            rowId,
                            columnId: column.id,
                            item,
                            data: item,
                            value: column.accessor(item, rowId),
                          }),
                          cellProps,
                          column,
                          rowId
                        )
                      }),
                    }) as any,
                    { key: rowId }
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Provider>
    )
  }
}
