import React from 'react'
import classnames from './input-text-area.module.scss'
import Icon, { IconName } from '@myntra/uikit-component-icon'
import SpinnerSolid from 'uikit-icons/svgs/SpinnerSolid'

export interface Props extends BaseProps {
  /** @private */
  className?: string
  /** Current value of the text area input field. */
  value?: string
  /** The handler to call when the value changes. */
  onChange?(value: string): void
  /** Displays a disabled text area field */
  disabled?: boolean
  /** Number of Rows*/
  rows?: number
  /** Disable resize and hide resize handle */
  noResize?: boolean
  /** Placeholder */
  placeholder?: string
  /** Displays a readonly text field */
  readOnly?: boolean
  /** Displays the icon as prefix */
  icon?: IconName
  /*** Field Context Passed from parent Field */
  __fieldContext?: FieldContext
  /*** Visually Representing error state of component */
  error?: boolean
  /*** Represent the variant of input box */
  variant: 'bordered' | 'standard'
}
type FieldContext = {
  error?: boolean
  disabled?: boolean
}
function isEmptyValue(value) {
  return typeof value !== 'string' || !value
}

/**
 * A large text input component.
 *
 * @since 0.0.0
 * @status READY
 * @category input
 * @see http://uikit.myntra.com/components/input-text-area
 */
export default function InputTextArea({
  className,
  noResize,
  value,
  onChange,
  variant = 'bordered',
  error = false,
  disabled,
  __fieldContext = {},
  adornmentPosition = 'start',
  icon,
  ...props
}: Props) {
  error = !!(error || __fieldContext.error)
  disabled = !!(disabled || __fieldContext.disabled)
  return (
    <div
      className={classnames(
        className,
        'container',
        { error },
        { disable: disabled },
        { standard: variant === 'standard' },
        { bordered: variant === 'bordered' },
        { filled: !isEmptyValue(value) },
        { noResize }
      )}
    >
      {icon && <Icon className={classnames('icon')} name={icon} />}

      <textarea
        {...props}
        value={value || ''}
        disabled={disabled}
        className={classnames('input')}
        onChange={(event) => onChange && onChange(event.target.value)}
      />
    </div>
  )
}

InputTextArea.defaultProps = {
  disabled: false,
  noResize: false,
  rows: 3,
}
