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

  getCurrentState = (): { newState: Sort; icon: any } => {
    switch (this.state.sortOrder) {
      case 'asc':
        return { newState: null, icon: SortUpSolid }
      case 'desc':
        return { newState: 'asc', icon: SortDownSolid }
      default:
        return { newState: 'desc', icon: SortSolid }
    }
  }

  handleChange = () => {
    const newState = this.getCurrentState().newState
    this.props.onChange({ columnId: this.props.columnId, order: newState })
    this.setState({ sortOrder: newState })
  }

  render() {
    const value = this.props.value || { columnId: null, order: null }
    const isActive = this.props.columnId === value.columnId

    return (
      <div className={classnames('sort-trigger')} onClick={this.handleChange}>
        <Icon name={isActive ? this.getCurrentState().icon : SortSolid} />
      </div>
    )
  }
}
