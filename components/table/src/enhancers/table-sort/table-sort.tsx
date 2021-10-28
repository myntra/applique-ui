import React, { PureComponent } from 'react'
import { Enhancer } from '../../table-interface'
import TableSortDropdown from './table-sort-dropdown'

export interface Props<T = any> extends BaseProps {
  compare?(a: any, b: any): number
}

function compareFallback(a: any, b: any): number {
  if (a === b) return 0
  if (a < b) return -1
  return 1
}

export default class TableSort extends PureComponent<Props> {
  static enhancer: Enhancer<
    Props,
    { columnId: string; order: 'asc' | 'desc' },
    any,
    { onSort?(): void }
  > = {
    name: 'sort',

    renderHead({ columnId, value, onChange }) {
      return (
        <TableSortDropdown
          value={value}
          onChange={onChange}
          columnId={columnId}
          key="sort"
        />
      )
    },

    prepareData({ getter, query, columnId }, { compare }, data, { onSort }) {
      if (onSort) return data // Bail. Using external sorting logic.
      if (!query) return data
      if (query.columnId !== columnId) return data
      compare = compare || compareFallback

      const copy = data.slice()
      let fn = compare

      if (query.order === 'desc') fn = (a, b) => -compare(a, b)

      copy.sort((a, b) => fn(getter(a), getter(b)))

      return copy
    },
  }

  render() {
    // This component is used to configure table. It won't render anything.

    return <span hidden />
  }
}
