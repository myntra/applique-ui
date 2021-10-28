import React, { Component } from 'react'
import { format, parse } from '@myntra/uikit-component-input-date'
import Dropdown from '@myntra/uikit-component-dropdown'
import InputMasked, { Mask } from '@myntra/uikit-component-input-masked'
import { Props as InputMonthPickerProps } from './input-month-picker'
import InputMonthPicker from './input-month-picker'
import classnames from './input-month.module.scss'

const MASKS: Record<string, Mask> = {
  Y: {
    validate(token) {
      return /\d/.test(token)
    },
  },
  M: {
    validate(token) {
      return /\w/.test(token)
    },
    transform(token) {
      return token.toUpperCase()
    },
  },
}

export interface Props
  extends BaseProps,
    Pick<
      InputMonthPickerProps,
      'value' | 'onChange' | 'highlight' | 'renderMonth'
    > {
  /**
   * Minimum date value for getting lower limit of year field
   */
  minDate?: string | Date
  /**
   * Maximum date value for getting upper limit of year field
   */
  maxDate?: string | Date
}

/**
 * A component to input month.
 *
 * @since 0.7.0
 * @status REVIEWING
 * @category input
 * @see http://uikit.myntra.com/components/input-month
 */
export default class InputMonth extends Component<
  Props,
  { isOpen: boolean; valueAsString: string }
> {
  static Picker = InputMonthPicker

  static propTypes = {
    _validate({ value }) {
      if (
        value &&
        typeof value.month === 'number' &&
        (value.month < 1 || value.month > 12)
      ) {
        throw new Error(
          `'value.month' should be a numeric value between 1 and 12.`
        )
      }
    },
  }

  static defaultProps = {
    format: 'MMM/yyyy',
  }

  state = {
    isOpen: false,
    valueAsString: '',
  }

  componentDidMount() {
    this.updateLocalValue()
  }

  componentDidUpdate(oldProps) {
    if (oldProps.value !== this.props.value) {
      this.updateLocalValue()
    }
  }

  updateLocalValue() {
    if (this.props.value && this.props.value.month && this.props.value.year) {
      const valueAsString = format(
        new Date(this.props.value.year, this.props.value.month - 1),
        this.props.format
      )
      if (this.state.valueAsString !== valueAsString) {
        this.setState({
          valueAsString,
        })
      }
    } else {
      this.setState({
        valueAsString: '',
      })
    }
  }

  get pattern() {
    return this.props.format
      .toUpperCase()
      .replace(/[^YM]+/g, (match) => `"${match}"`)
  }

  handleStringValueChange = (valueAsString) => {
    try {
      const date = parse(valueAsString, this.props.format)
      if (
        date &&
        format(date, this.props.format).toUpperCase() !== valueAsString
      )
        throw new Error('Not matching')
      const year = date instanceof Date ? date.getFullYear() : null
      const month = date instanceof Date ? date.getMonth() + 1 : null

      this.props.onChange && this.props.onChange({ year, month })
    } catch (e) {
      this.setState({ valueAsString })
    }
  }

  handleDropdownOpen = () => this.setState({ isOpen: true })
  handleDropdownClose = () => this.setState({ isOpen: false })

  handleMonthChange = ({ month, year }) => {
    this.props.onChange && this.props.onChange({ month, year })

    if (typeof month === 'number' && typeof year === 'number') {
      this.handleDropdownClose()
    }
  }

  render() {
    const { renderMonth } = this.props
    return (
      <Dropdown
        auto
        container
        renderTrigger={(props) => (
          <InputMasked
            {...props}
            autoComplete="off"
            value={this.state.valueAsString}
            onChange={this.handleStringValueChange}
            pattern={this.pattern}
            masks={MASKS}
            includeMaskChars
          />
        )}
        isOpen={this.state.isOpen}
        onOpen={this.handleDropdownOpen}
        onClose={this.handleDropdownClose}
      >
        <div>
          <InputMonthPicker
            {...this.props}
            className={classnames('wrapper')}
            onChange={this.handleMonthChange}
            renderMonth={renderMonth || (({ month }) => month.substr(0, 3))}
          />
        </div>
      </Dropdown>
    )
  }
}
