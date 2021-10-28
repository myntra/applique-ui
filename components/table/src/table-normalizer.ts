import {
  ReactNode,
  Children,
  ReactElement,
  isValidElement,
  JSXElementConstructor,
} from 'react'
import { isReactNodeType } from '@myntra/uikit-utils'

import Column, { Props as ColumnType } from './table-column'
import Row, { Props as RowType } from './table-row'
import TableSort from './enhancers/table-sort'
import * as I from './table-interface'

type EnhancerElement<P = any> = ReactElement<
  P,
  JSXElementConstructor<P> & I.EnhancerFactory
>

function isEnhancer<P = any>(node: any): node is EnhancerElement<P> {
  if (!isValidElement(node) || !node.type) return false

  const type = (node.type as any)._result || node.type
  if (!type.enhancer) return false

  return true
}

export default function normalizer(children: ReactNode, order?: string[]) {
  const context: I.TableMeta = {
    columnsByLevel: [],
    columnsByKey: {},
    columns: [],
    rows: [],
    cells: [],
  }

  Children.forEach(children, (child) => {
    if (isReactNodeType(child, Column))
      context.columns.push(processColumn(child))
    else if (isReactNodeType(child, Row)) context.rows.push(processRow(child))
    else if (isEnhancer(child)) {
      const column = processWrappedColumn(child)

      if (column) context.columns.push(column)
    } else if (isValidElement(child))
      console.error(`Unexpected component in Table.`, child)
  })

  // TODO: Do column sorting or filtering.

  context.columns.forEach((column) => append(context, column))

  let index = 0

  context.columnsByLevel[0].forEach((column) => {
    column.indexRange = [index, index + column.colSpan - 1]
    index += column.colSpan

    setIndexRange(column)
  })

  if (order && order.length) {
    const cellsById: Record<string, I.Column> = {}
    context.cells.forEach((cell) => {
      cellsById[cell.id] = cell
    })

    context.cells = order.map((id) => cellsById[id]).filter(Boolean)
  }

  return context
}

function setIndexRange(column: I.Column) {
  let index = column.indexRange![0]

  column.columns.forEach((column) => {
    column.indexRange = [index, index + column.colSpan - 1]
    index += column.colSpan

    setIndexRange(column)
  })
}

function append(context: I.TableMeta, column: I.Column) {
  if (column.id in context.columnsByKey) {
    console.error(`Duplicate column key '${column.id}' in table.`)
  }

  context.columnsByKey[column.id] = column

  while (context.columnsByLevel.length <= column.level) {
    context.columnsByLevel.push([])
  }
  context.columnsByLevel[column.level].push(column)

  if (!column.columns.length) context.cells.push(column)
  else column.columns.forEach((column) => append(context, column))
}

function processWrappedColumn(
  node: EnhancerElement,
  level: number = 0
): I.Column | null {
  const child = Children.only(node.props.children) // TODO: Handle error here!

  if (isReactNodeType(child, Column)) {
    const column = processColumn(child, level)

    const type: I.EnhancerFactory = (node.type as any)._result || node.type

    column.enhancers.push([type.enhancer, node.props])

    return column
  }

  return null
}

function processColumn(
  node: ReactElement<ColumnType>,
  level: number = 0
): I.Column {
  const { props, key } = node
  const id = `${key}`.replace(/^\.\$/, '')
  const {
    accessor,
    fixed,
    label,
    renderEditor,
    sortable,
    children,
    editing,
    minWidth,
    align,
    width,
  } = props

  const column: I.Column = {
    id: id,
    level: level,
    depth: 0,
    minWidth: minWidth || 0,
    colSpan: 1,
    editing,
    align: align || 'start',
    width: width || 'auto',
    indexRange: undefined,
    accessor:
      typeof accessor === 'string'
        ? createAccessor(accessor)
        : accessor || createAccessor(id),
    renderHead() {
      return label || id
    },
    renderCell({ value }) {
      return value
    },
    renderEditor,
    fixed:
      fixed === true || fixed === 'start'
        ? I.FixedPosition.START
        : fixed === 'end'
        ? I.FixedPosition.END
        : undefined,
    enhancers: [],
    columns: [],
  }

  if (sortable) {
    column.enhancers.push([
      TableSort.enhancer,
      typeof sortable === 'function' ? { compare: sortable } : {},
    ])
  }

  if (typeof children === 'function') {
    column.renderCell = children as any
  } else if (children) {
    function addSubColumn(sub?: I.Column) {
      if (sub) {
        column.columns.push(sub)
        sub.fixed = column.fixed
      }
    }

    const nodes = Children.toArray(children)

    nodes.forEach((node) => {
      if (isReactNodeType(node, Column))
        addSubColumn(processColumn(node, level + 1))
      else if (isEnhancer(node))
        addSubColumn(processWrappedColumn(node, level + 1))
      else if (isValidElement(node))
        console.error(`Unexpected component in Table.`, node)
    })

    if (column.columns.length) {
      column.colSpan = column.columns.reduce(
        (width, column) => width + column.colSpan,
        0
      )
      column.depth = column.columns.reduce(
        (depth, column) => Math.max(depth, column.depth + 1),
        0
      )
    }
  }

  return column
}

function processRow(node: ReactElement<RowType>): I.Row {
  const { props } = node
  const { selector, children, renderBody, editing } = props

  return {
    editing,
    selector:
      typeof selector === 'number'
        ? (rowId) => rowId === selector
        : selector || (() => true),
    render: children,
    renderBody,
  }
}

function createAccessor<T = any>(name: string) {
  return (item: T, index: number) => item[name]
}
