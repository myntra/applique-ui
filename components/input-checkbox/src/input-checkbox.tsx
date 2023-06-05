import React, { ReactNode } from 'react'
import classnames from './input-checkbox.module.scss'

export interface Props extends BaseProps {
  /**
   * The state of the checkbox.
   *
   * > **Why `value` instead of `checked`?**
   * >
   * > All __InputXxx__ components accept `value` as the controlled input value and `onChange` event to
   * propagate the change back to parent component. For consistency, we use `value` prop instead `checked`.
   */
  value?: boolean

  /**
   * The handler to call when the value changes.
   */
  onChange?(value: boolean): void

  /**
   * Displays a disabled checkbox field.
   */
  disabled?: boolean

  /**
   * Displays a readonly checkbox field.
   */
  readOnly?: boolean

  /**
   * Checkbox value attribute.
   *
   * > **Why `htmlValue` instead of `value`?**
   * >
   * > As per [our convention](#input-checkbox-value), we use `value` prop for controlled input value so
   * an alternate prop (`htmlValue`) is accepted to set native `value` attribute.
   */
  htmlValue?: string

  /**
   * A label element for the checkbox.
   */
  title?: ReactNode

  /**
   * Select type between a checkbox and a dashbox
   */
  boxtype?: string
}

/**
 * A custom styled checkbox input.
 *
 * @since 0.0.0
 * @status READY
 * @category input
 * @see http://uikit.myntra.com/components/input-checkbox
 */
export default function InputCheckbox({
  className,
  value,
  htmlValue,
  onChange,
  title,
  readOnly,
  disabled,
  ...props
}: Props) {
  readOnly = readOnly || !onChange

  return (
    <label className={classnames(className, 'input')}>
      <div className={classnames('checkbox-input')} role="checkbox">
        <input
          {...props}
          type="checkbox"
          checked={!!value}
          value={htmlValue}
          disabled={disabled}
          className={classnames('target')}
          readOnly={readOnly}
          onChange={
            readOnly ? null : (event) => onChange(Boolean(event.target.checked))
          }
        />
        {props.boxtype === 'dashbox' ? (
          <span className={classnames('dashbox')} aria-hidden="true" />
        ) : (
          <span className={classnames('checkbox')} aria-hidden="true" />
        )}
      </div>
      <div className={classnames('content', { disabled: disabled })}>
        {title}
      </div>
    </label>
  )
}
