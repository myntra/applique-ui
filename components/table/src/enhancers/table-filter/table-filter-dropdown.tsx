import React, { Component } from 'react'
import Dropdown from '@myntra/uikit-component-dropdown'
import Icon from '@myntra/uikit-component-icon'
import List from '@myntra/uikit-component-list'
import InputText from '@myntra/uikit-component-input-text'
import Field from '@myntra/uikit-component-field'
import Button from '@myntra/uikit-component-button'
import classnames from './table-filter-dropdown.module.scss'
import { memoize } from '@myntra/uikit-utils'

import ChevronUpSolid from 'uikit-icons/svgs/ChevronUpSolid'
import ChevronDownSolid from 'uikit-icons/svgs/ChevronDownSolid'

export interface Props<V = any, O = { value: any; label: string }> {
  columnId: string
  value: Record<string, V[]>
  options?: O[]
  data: any[]

  onChange(value: Record<string, V[]>, shouldEmit: boolean): void
  getter(item: O): V
  renderOption?(item: O): JSX.Element
}

export default class TableFilterDropdown extends Component<
  Props,
  {
    isOpen: boolean
    searchText: string
    options: Array<{ value: any; label: string }>
  }
> {
  static defaultProps = {
    renderOption(item) {
      return item.label
    },
  }

  static getDerivedStateFromProps({ options }) {
    if (options) {
      return { options, rawOptions: options }
    }

    return {}
  }

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      searchText: '',
      options: this.options,
    }
  }

  get value() {
    return this.props.value ? this.props.value[this.props.columnId] : null
  }

  get options() {
    return (
      this.props.options ||
      this.computeOptions(this.props.data, this.props.getter)
    )
  }

  computeOptions = memoize((data, getter) =>
    Array.from(new Set(data.map((item) => getter(item)))).map((value: any) => ({
      value,
      label: `${value}`,
    }))
  )

  handleChange = (value: any[]) => {
    this.props.onChange(
      {
        ...this.props.value,
        [this.props.columnId]: value,
      },
      false
    )
  }

  handleApply = () => {
    this.props.onChange(this.props.value, true)
    this.handleClose()
  }
  handleClearAll = () =>
    this.props.onChange(
      {
        ...this.props.value,
        [this.props.columnId]: [],
      },
      false
    )
  handleSelectAll = () =>
    this.props.onChange(
      {
        ...this.props.value,
        [this.props.columnId]: this.state.options.map((option) => option.value),
      },
      false
    )

  idForItem = (item: any) => item.value
  handleOpen = () => this.setState({ isOpen: true })
  handleClose = () => this.setState({ isOpen: false, ...this.onSearch('') })
  handleSearch = (searchText: string) =>
    this.setState(this.onSearch(searchText))

  onSearch(searchText: string) {
    const rawOptions = this.options
    const re = new RegExp(
      searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i'
    )
    const options = !searchText
      ? rawOptions
      : rawOptions.filter((option) => re.test(option.label))

    return {
      searchText,
      options,
    }
  }

  render() {
    return (
      <Dropdown
        isOpen={this.state.isOpen}
        onOpen={this.handleOpen}
        auto={true}
        onClose={this.handleClose}
        renderTrigger={(props) => (
          <div
            className={classnames('filter-trigger', {
              active: this.value && this.value.length,
            })}
            {...props}
          >
            <Icon
              name={this.state.isOpen ? ChevronUpSolid : ChevronDownSolid}
            />
          </div>
        )}
        container
      >
        <div className={classnames('filter-container')}>
          <div className={classnames('header')}>
            <Button type="link" onClick={this.handleSelectAll}>
              <span className={classnames('tiny')}>Select All</span>
            </Button>
            <Button type="link" onClick={this.handleClearAll}>
              <span className={classnames('tiny')}>Clear All</span>
            </Button>
          </div>
          <Field className={classnames('search')} title="Filter column">
            <InputText
              value={this.state.searchText}
              onChange={this.handleSearch}
              type="search"
              placeholder="Search..."
            />
          </Field>
          <List
            className={classnames('list')}
            idForItem={this.idForItem}
            multiple
            items={this.state.options}
            value={this.value}
            onChange={this.handleChange}
          >
            {({ item }) => this.props.renderOption(item)}
          </List>
          <div className={classnames('footer')}>
            <Button type="link" onClick={this.handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </Dropdown>
    )
  }
}
