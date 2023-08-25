import React, { Component } from 'react'
import Icon from '@applique-ui/icon'

import classnames from './table-sort-dropdown.module.scss'

import SortUpSolid from 'uikit-icons/svgs/SortUpSolid'
import SortDownSolid from 'uikit-icons/svgs/SortDownSolid'
import SortSolid from 'uikit-icons/svgs/SortSolid'

type Sort = 'asc' | 'desc' | null
export interface Props<V = { columnId: string; order: Sort }> {
  columnId: string
  value: V
  onChange(value: V, emit?: boolean): void
}
export default class TableSortDropdown extends Component<
  Props,
  { sortOrder: Sort }
> {
  state = {
    sortOrder: null,
  }

  getIcon = (): any => {
    switch (this.state.sortOrder) {
      case 'asc':
        return SortUpSolid
      case 'desc':
        return SortDownSolid
      default:
        return SortSolid
    }
  }

  getNewState = (): Sort => {
    switch (this.state.sortOrder) {
      case 'asc':
        return null
      case 'desc':
        return 'asc'
      default:
        return 'desc'
    }
  }

  handleChange = () => {
    const newState = this.getNewState()
    this.props.onChange({ columnId: this.props.columnId, order: newState })
    this.setState({ sortOrder: newState })
  }

  render() {
    const value = this.props.value || { columnId: null, order: null }
    const isActive = this.props.columnId === value.columnId

    return (
      <div className={classnames('sort-trigger')} onClick={this.handleChange}>
        <Icon name={isActive ? this.getIcon() : SortSolid} />
      </div>
    )
  }
}
