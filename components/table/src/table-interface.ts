import { ReactNode } from 'react'

export interface EnhancerFactory {
  enhancer: Enhancer
}

export interface Enhancer<P = any, V = any, R = any, HP = any> {
  name: string

  renderHead?(
    context: {
      columnId: string
      value: V
      onChange(value: V): void
      getter(item: R): any
    },
    props: P,
    data: R[]
  ): JSX.Element

  prepareData?(
    context: {
      getter(item: R): any
      query: V
      columnId: string
    },
    props: P,
    data: R[],
    hoistedProps: HP
  ): R[]
}

export type EnhancerInstance<P = any, V = any> = [Enhancer<P, V>, P]

export interface TableMeta {
  columnsByLevel: Column<any, any>[][]
  columnsByKey: Record<string, Column<any, any>>
  columns: Column<any, any>[]
  rows: Row<any>[]
  cells: Column<any, any>[]
}

export const enum FixedPosition {
  START,
  END,
}

export interface RowRendererProps extends BaseProps {
  rowId: number
  item: any
}
export interface CellRendererProps extends BaseProps {
  rowId: number
  columnId: string
  item: any
  value: any
}
export interface EditableCellRendererProps {}

export interface Column<T = any, V = any> {
  id: string
  level: number
  depth: number
  colSpan: number
  minWidth: number
  indexRange: undefined | [number, number]
  accessor(item: T, index?: number): V
  renderHead(): ReactNode
  renderCell(props: CellRendererProps): ReactNode
  renderEditor?(props: EditableCellRendererProps): ReactNode
  editing: boolean | undefined
  fixed: FixedPosition | undefined
  enhancers: EnhancerInstance[]
  columns: Column<T, V>[]
  align: string
  width: string
}

export interface Row<T = any> {
  editing: boolean | undefined
  selector(rowId: number): boolean
  render(props: RowRendererProps): ReactNode
  renderBody?(props: RowRendererProps): ReactNode
}
