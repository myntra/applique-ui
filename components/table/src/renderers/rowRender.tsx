import classnames from './simple.module.scss'
import { FixedPosition } from '../table-interface'

export default function RowRender({
  rowId,
  item,
  config,
  state,
  warpIfNeeded,
  rowRender,
  defaultProps,
}) {
  const { render, isSelected } = rowRender
  return render({
    rowIndex: rowId,
    rowId,
    item,
    children: config.cells.map((column, columnIndex) => {
      const cellProps = {
        className: classnames({
          selected: isSelected || false,
          fixed: typeof column.fixed !== 'undefined',
          end: column.fixed === FixedPosition.END,
        }),
        style: {
          '--sticky-left-offset':
            typeof column.fixed !== 'undefined'
              ? state.offsets[columnIndex] + 'px'
              : 'unset',
          width: column.width,
          // @ts-ignore
          textAlign: `${column.align}`,
        },
      }

      return warpIfNeeded(
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
        rowId,
        state,
        defaultProps
      )
    }),
  })
}
