import React, { ReactElement, isValidElement } from 'react'
import { RowRendererProps } from './table-interface'

export interface Props<T = any> extends BaseProps {
  /**
   * Unique column identifier for the column.
   */
  key: string

  /**
   * Find a row to customize.
   */
  selector?: number | ((rowId: number) => boolean)

  /**
   * Render contents of expanded row. Also, presence of this prop
   * makes the table row expandable.
   */
  renderBody?(props: RowRendererProps): JSX.Element

  /**
   * Customize row rendering behavior.
   *
   * __NOTE:__ Make sure to render `children` and use `Table.TR` as root element.
   */
  children(props: RowRendererProps): JSX.Element
}

/**
 * Declarative way of defining table row customizers. It is a render-less component,
 * use to declare rendering behavior of the table.
 *
 * @since 1.3.0
 * @status READY
 * @category renderless
 * @see http://uikit.myntra.com/components/table#tablerow
 */
export default function TableRow(props: Props) {
  // This component is used to configure table. It won't render anything.
  return <span hidden />
}

export function isTableRow(element: any): element is ReactElement<Props> {
  return isValidElement(element) && element.type === TableRow
}
