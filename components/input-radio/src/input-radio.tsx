import React, { ReactNode, PureComponent, ChangeEvent } from 'react'
import classnames from './input-radio.module.scss'

export interface Props extends BaseProps {
  /**
   * A list of options for the radio element.
   */
  options: Array<{ value: string; label: string }>
  /**
   * Selected option value.
   */
  value?: string
  /**
   * The callback function to call when the value changes.
   */
  onChange?(value: string): void
  /**
   * A render function to customize the appearance of each radio item.
   */
  renderOption?(option: { value: string; label: string }): ReactNode
  /**
   * Disables all interaction on the radio element.
   */
  disabled?: boolean
}

/**
 * A component to render radio inputs.
 * @since 0.6.0
 * @status REVIEWING
 * @category input
 * @see http://uikit.myntra.com/components/input-radio
 */
export default class InputRadio extends PureComponent<Props> {
  name = `uikit-radio-${Date.now()}`

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) this.props.onChange(event.target.value)
  }

  render() {
    const {
      value,
      onChange,
      name = this.name,
      options,
      disabled,
      renderOption,
      className,
      children,
      ...props
    } = this.props
    return (
      <div
        className={classnames('group', className)}
        data-test-id="group"
        {...props}
      >
        {options.map((option) => (
          <label key={option.value} className={classnames('radio')}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={disabled}
              onChange={this.handleChange}
              data-test-id={option.value}
            />
            {renderOption ? (
              renderOption({ ...option, title: option.label } as any)
            ) : (
              <span> {option.label || (option as any).title}</span>
            )}
          </label>
        ))}
      </div>
    )
  }
}
