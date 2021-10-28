import React, { PureComponent, Children, isValidElement } from 'react'
import { RowRendererProps } from './table-interface'
import normalize from './table-normalizer'

import SimpleRenderer from './renderers/simple'
import VirtualRenderer from './renderers/virtual'
import TableColumn from './table-column'
import TableRow from './table-row'
import { Consumer as TableContext } from './table-context'
import TableFilter from './enhancers/table-filter'

export interface Props<T = any> extends BaseProps {
  data: T[]

  displayColumns?: string[]

  renderRow?(props: RowRendererProps): JSX.Element

  appearance?: 'default' | 'striped'

  virtualized?: boolean

  /**
   * Sets the overflow scroll container.
   */
  scrollMode?: 'container' | 'window'

  columnOrder?: string[]

  onSort?(props: { columnId: string; order: 'asc' | 'desc' }): void

  onFilter?(props: Record<string, any[]>): void
}

interface State {
  /**
   * @example js
   *  {
   *    foo: {
   *      [symbol('sort')]: 'asc'
   *    }
   *  }
   */
  enhancers: Record<string, Record<symbol, any>>
}

/**
 * A table.
 *
 * @since 0.3.0
 * @status REVIEWING
 * @see https://uikit.myntra.com/components/table
 */
export default class Table extends PureComponent<Props, State> {
  static Column = TableColumn
  static Row = TableRow

  /**
   * @deprecated Use [Table.Filter] instead.
   */
  static ColumnFilter = TableFilter
  static Filter = TableFilter
  static TR = (props: BaseProps) => (
    <TableContext>{({ TR }) => <TR {...props} />}</TableContext>
  )
  static TD = (props: BaseProps) => (
    <TableContext>{({ TD }) => <TD {...props} />}</TableContext>
  )

  state = {
    enhancers: {},
  }

  enhancerSetters: Record<string, (value: any, emit: boolean) => void> = {}

  getEnhancerState = (enhancer: string) => {
    return {
      value: this.state.enhancers[enhancer],
      onChange: this.getEnhancerChangeHandler(enhancer),
    } as any
  }

  getEnhancerChangeHandler(enhancer: string) {
    if (!(enhancer in this.enhancerSetters)) {
      const event = `on${enhancer[0].toUpperCase()}${enhancer.substr(1)}`
      this.enhancerSetters[enhancer] = (value, emit = true) => {
        this.setState(
          (state) => ({
            enhancers: {
              ...state.enhancers,
              [enhancer]: value,
            },
          }),
          () => {
            if (emit && typeof this.props[event] === 'function') {
              const fn = this.props[event]
              fn(this.state.enhancers[enhancer])
            }
          }
        )
      }
    }

    return this.enhancerSetters[enhancer]
  }

  componentWillUnmount() {
    delete this.enhancerSetters
  }

  render() {
    const {
      children,
      renderRow,
      virtualized,
      columnOrder,
      data,
      onFilter,
      onSort,
      ...props
    } = this.props
    const nodes = Children.toArray(children)

    if (!virtualized) {
      delete props.scrollMode
    }

    if (!nodes.length) return null

    const node: any = nodes.find(
      (node) =>
        isValidElement(node) &&
        node.type &&
        typeof (node.type as any)._ctor === 'function' &&
        (node.type as any)._status !== 1
    )

    if (node && typeof node.type._ctor === 'function') {
      node.type._ctor().then(() => this.forceUpdate())

      return (
        <div style={{ display: 'none' }} data-note="waiting for children">
          {children}
        </div>
      )
    }

    const table = normalize(children, columnOrder)

    if (!table.columnsByLevel.length) return null

    if (renderRow) {
      table.rows.push({
        editing: undefined,
        selector: () => true,
        render: renderRow,
      })
    }

    const hoistedProps = { onFilter, onSort }

    const preparedData = table.columns
      .filter((column) => column.enhancers.length)
      .reduce(
        (data, column) =>
          column.enhancers.reduce(
            (data, [enhancer, props]) =>
              enhancer.prepareData
                ? enhancer.prepareData(
                    {
                      getter: column.accessor,
                      columnId: column.id,
                      query: this.state.enhancers[enhancer.name],
                    },
                    props,
                    data,
                    hoistedProps
                  )
                : data,
            data
          ),
        data
      )

    const Renderer = virtualized ? VirtualRenderer : SimpleRenderer

    return (
      <Renderer
        {...props}
        data={preparedData}
        getEnhancerState={this.getEnhancerState}
        config={table}
      />
    )
  }
}
