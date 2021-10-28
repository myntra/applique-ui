import React, { PureComponent, RefObject } from 'react'
import {
  createSearchIndex,
  executeFilterSearch,
  moveSelectedOptionsToTop,
} from './helpers'
import { memoize, debounce, createRef } from '@myntra/uikit-utils'
import Icon, { IconName } from '@myntra/uikit-component-icon'
import classnames from './input-select-control.module.scss'
import TimesSolid from 'uikit-icons/svgs/TimesSolid'

export interface InputSelectControlProps<V = any, T = any> extends BaseProps {
  /**
   * Is options dropdown open?
   */
  isOpen: boolean

  /**
   * The value of the select field.
   */
  value: V
  /**
   * Callback to handle change in [value](#InputSelectControl-value) prop.
   *
   * @param value - New value of the select field.
   */
  onChange(value: V): void

  /**
   * List of select options.
   */
  options: T[]
  /**
   * Filtered options as user types.
   *
   * @param options - New options list after filtering.
   */
  onOptionsChange(options: T[]): void

  onSearch?(text: string): void

  /**
   * Filter options as user types.
   */
  searchable: boolean

  /**
   * Can reset value to null.
   */
  resettable: boolean

  /**
   * Property name to get display value from option.
   */
  labelKey: string

  /**
   * Property name to get value from option.
   */
  valueKey: string

  /**
   * Property names used to create search index.
   */
  searchableKeys: string[]

  /**
   * Custom filter logic.
   *
   * @param option - One of the options.
   */
  filterOptions?(option: T): boolean

  /**
   * Render placeholder or selected value as string.
   */
  renderPlaceholder(): JSX.Element | string

  /**
   * ID attribute prefix.
   */
  instancePrefix: string

  /** Displays the icon as prefix */
  icon?: IconName

  /**
   * Is options dropdown open?
   */
  disabled: boolean
}

/**
 * Displays selected values.
 * @since 0.6.0
 * @status REVIEWING
 * @category internal
 */

export default class InputSelectControl<V = any, T = any> extends PureComponent<
  InputSelectControlProps<V, T>,
  { searchText: string }
> {
  inputRef: RefObject<HTMLInputElement>

  state = {
    searchText: '',
  }

  constructor(props) {
    super(props)

    this.inputRef = createRef()
  }

  componentDidMount() {
    this.handleOptionsChange()
  }

  componentDidUpdate(nextProps) {
    if (this.props.options !== nextProps.options) {
      this.handleOptionsChange()
    }

    if (this.props.isOpen != nextProps.isOpen) {
      this.handleOptionsChange()
    }
  }

  doSearch() {
    if (this.state.searchText) {
      this.props.onSearch && this.props.onSearch(this.state.searchText)
    }
  }

  createSifterIndex = memoize(
    ({ options }: Pick<InputSelectControlProps, 'options'>) => {
      return createSearchIndex(options)
    }
  )

  handleSearchTextChange = (event) => {
    const searchText = event.target.value
    this.setState({ searchText })
    this.props.onSearch && this.props.onSearch(searchText)

    this.handleOptionsChangeDebounce()
  }

  handleOptionsChangeDebounce = debounce(() => this.handleOptionsChange(), 300)

  handleOptionsChange = () => {
    const { searchText } = this.state
    const {
      options,
      searchable,
      labelKey,
      searchableKeys,
      filterOptions,
      value,
      valueKey,
    } = this.props
    const sifter = this.createSifterIndex({ options })
    const newOptions = moveSelectedOptionsToTop(
      searchable && searchText
        ? executeFilterSearch(sifter, options, searchText, {
            searchableKeys: [labelKey, ...searchableKeys],
            sortBy: labelKey,
            sortOrder: 'asc',
            filterOptions,
          })
        : options,
      value,
      valueKey
    )

    this.props.onOptionsChange(newOptions)
  }

  handleClearClick = (event) => {
    event.stopPropagation()

    if (this.state.searchText) this.resetSearch()
    else this.resetValue()
  }

  handleBlur = () => {
    this.inputRef.current.contains(document.activeElement)
  }

  /**
   * Reset search field.
   * @public
   */
  resetSearch = () => this.setState({ searchText: '' })
  resetValue = () => this.props.onChange(null)

  render() {
    const {
      isOpen,
      instancePrefix,
      children,
      renderPlaceholder,
      searchable,
      resettable,
      className,
      // ---
      filterOptions,
      searchableKeys,
      labelKey,
      valueKey,
      onChange,
      onOptionsChange,
      onSearch,
      options,
      value,
      icon,
      disabled,
      // ---
      ...props
    } = this.props

    return (
      <div
        className={classnames('control', className)}
        onClick={() => this.inputRef.current && this.inputRef.current.focus()}
      >
        {(!this.state.searchText || !searchable) && renderPlaceholder()}
        {icon && (
          <Icon
            className={classnames('icon', {
              active: value || this.state.searchText,
            })}
            name={icon}
          />
        )}
        {searchable && (
          <input
            disabled={disabled}
            value={this.state.searchText}
            ref={this.inputRef}
            onChange={this.handleSearchTextChange}
            className={classnames('input', { 'with-icon': !!icon })}
            {...props}
            onBlur={this.handleBlur}
            role="combobox"
            autoComplete="off"
            aria-haspopup={isOpen}
            aria-expanded={isOpen}
            aria-autocomplete="both"
            aria-controls={`${instancePrefix}-options`}
            aria-owns={`${instancePrefix}-options`}
          />
        )}

        {!disabled && (
          <div className={classnames('buttons')}>
            {resettable && (value || this.state.searchText) && (
              <div
                className={classnames('button')}
                role="button"
                onClick={this.handleClearClick}
                data-test-id="reset"
              >
                <Icon name={TimesSolid} title="reset" />
              </div>
            )}
            {children}
          </div>
        )}
      </div>
    )
  }
}
