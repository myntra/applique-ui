import React, { PureComponent } from 'react'
import { Enhancer } from '../../table-interface'
import Filter from './table-filter-dropdown'

export interface Props<T = any> extends BaseProps {
  /**
   * List of options for filtering a table column.
   */
  options?: Array<T>
  /**
   * Customize rendering behaviour of an option in the options list.
   */
  renderOption?<Option extends T>(option: Option): JSX.Element
}

/**
 * Declarative way of defining table column filtering logic.
 *
 * @since 1.0.0
 * @status READY
 * @category renderless
 * @see http://uikit.myntra.com/components/table#tablefilter
 */
export default class TableFilter extends PureComponent<Props> {
  static enhancer: Enhancer<
    Props,
    Record<string, any[]>,
    any,
    { onFilter?(): void }
  > = {
    name: 'filter',

    renderHead({ columnId, value, onChange, getter }, props, data) {
      return (
        <Filter
          key="filter"
          columnId={columnId}
          getter={getter}
          data={data}
          value={value}
          onChange={onChange}
          {...props}
        />
      )
    },

    prepareData({ getter, query, columnId }, props, data, { onFilter }) {
      if (onFilter) return data // Bail. Using external filtering logic.
      if (!query) return data
      if (!query[columnId]) return data
      if (!query[columnId].length) return data

      const value = new Set(query[columnId])

      return data.filter((item) => value.has(getter(item)))
    },
  }

  render() {
    // This component is used to configure table. It won't render anything.
    return <span hidden />
  }
}
