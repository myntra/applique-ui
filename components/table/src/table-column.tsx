import React, { ReactElement, isValidElement, ReactNode } from 'react'
import { EditableCellRendererProps, CellRendererProps } from './table-interface'

export interface Props<T = any> extends BaseProps {
  /**
   * Unique column identifier for the column.
   */
  key: string

  /**
   * Header text for the column.
   */
  label?: ReactNode

  renderEditor?(props: EditableCellRendererProps): ReactNode

  fixed?: boolean | 'start' | 'end'

  sortable?: boolean | ((a: any, b: any) => number)

  minWidth?: number

  /**
   * Accessor to get value of column from the row object.
   */
  accessor?: string | ((item: T, index: number) => any)

  /**
   * Width for the column.
   */
  width?: string

  /**
   * Text alignment for the column.
   */
  align?: string
}

/**
 * Declarative way of defining table column configuration.
 *
 * @since 0.3.0
 * @status READY
 * @category renderless
 * @see http://uikit.myntra.com/components/table#tablecolumn
 */
export default function TableColumn(props: Props) {
  // This component is used to configure table. It won't render anything.
  return <span hidden />
}

export function isTableColumn(element: any): element is ReactElement<Props> {
  return isValidElement(element) && element.type === TableColumn
}
