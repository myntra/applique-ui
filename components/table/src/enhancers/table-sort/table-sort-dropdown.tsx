import React, { Component } from 'react'
import Dropdown from '@myntra/uikit-component-dropdown'
import Icon from '@myntra/uikit-component-icon'
import List from '@myntra/uikit-component-list'

import classnames from './table-sort-dropdown.module.scss'

import SortUpSolid from 'uikit-icons/svgs/SortUpSolid'
import SortDownSolid from 'uikit-icons/svgs/SortDownSolid'
import SortSolid from 'uikit-icons/svgs/SortSolid'

export interface Props<V = { columnId: string; order: 'asc' | 'desc' }> {
  columnId: string
  value: V
  onChange(value: V, emit?: boolean): void
}

export default class TableSortDropdown extends Component<
  Props,
  { isOpen: boolean }
> {
  options = [
    {
      label: (
        <div key="up">
          <Icon name={SortUpSolid} /> Ascending
        </div>
      ),
      value: 'asc',
    },
    {
      label: (
        <div key="down">
          <Icon name={SortDownSolid} /> Descending
        </div>
      ),
      value: 'desc',
    },
  ]
  state = {
    isOpen: false,
  }

  handleChange = (order: 'asc' | 'desc') =>
    this.props.onChange({ columnId: this.props.columnId, order })

  handleOpen = () => this.setState({ isOpen: true })
  handleClose = () => this.setState({ isOpen: false })

  idForItem = (item) => item.value

  render() {
    const value = this.props.value || { columnId: null, order: null }
    const isActive = this.props.columnId === value.columnId

    return (
      <Dropdown
        isOpen={this.state.isOpen}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        renderTrigger={(props) => (
          <div className={classnames('sort-trigger')} {...props}>
            <Icon
              name={
                isActive
                  ? value.order === 'desc'
                    ? SortDownSolid
                    : SortUpSolid
                  : SortSolid
              }
            />
          </div>
        )}
        container
      >
        <List
          className={classnames('sort-container')}
          idForItem={this.idForItem}
          items={this.options}
          value={isActive ? value.order : null}
          onChange={this.handleChange}
        >
          {({ item }) => item.label}
        </List>
      </Dropdown>
    )
  }
}
