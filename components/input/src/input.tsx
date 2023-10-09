import React from 'react'
import classnames from './input.module.scss'
import Icon, { IconName } from '@applique-ui/icon'

export interface Props extends BaseProps {
  /** Sets the text format for the field. */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'
  /** Current value of the text input field. */
  value?: string | number
  /** Displays a disabled text field */
  disabled?: boolean
  /** Displays a readonly text field */
  readOnly?: boolean
  /** Displays the icon as prefix */
  icon?: IconName
  /** Can be used to add prefix, suffix or any jsx element */
  adornment?: string | JSX.Element
  /** Position of the adornment */
  adornmentPosition?: 'start' | 'end'
  /*** Field Context Passed from parent Field */
  __fieldContext?: FieldContext
  /*** Visually Representing error state of component */
  error?: boolean
  /*** Visually Representing active state of component */
  active?: boolean
  /*** Represent the variant of input box */
  variant?: 'bordered' | 'standard'
  /*** Placeholder for input box */
  placeholder?: string
}
type FieldContext = {
  error?: boolean
  disabled?: boolean
}
function isEmptyValue(value) {
  return typeof value !== 'string' || !value
}

/**
 * A component to input text-like data (email, tel, text, password and url).
 *
 * @since 0.0.0
 * @status READY
 * @category input
 * @see http://uikit.myntra.com/components/input-text
 */
export default function Input({
  className,
  readOnly,
  icon,
  adornment,
  adornmentPosition,
  __fieldContext = {},
  variant,
  placeholder = ' ',
  error: propError,
  disabled: propDisabled,
  active,
  ...props
}: Props) {
  const { error, disabled } = {
    error: __fieldContext.error || propError,
    disabled: __fieldContext.disabled || propDisabled,
  }

  const bordered = variant === 'bordered'
  const standard = variant === 'standard'

  return (
    <div
      className={classnames(
        'container',
        {
          disable: !!disabled,
          standard: standard,
          bordered: bordered,
          filled: !isEmptyValue(props.value),
          error: !!error,
          active: !!active,
          readOnly: !!readOnly
        },
        className
      )}
    >
      {icon && (
        <Icon className={classnames('input-adornment-start')} name={icon} />
      )}
      {adornment && adornmentPosition === 'start' && (
        <div className={classnames('input-adornment', `input-adornment-start`)}>
          {adornment}
        </div>
      )}
      <input
        {...props}
        readOnly={readOnly || !props.onChange}
        className={classnames('input')}
        disabled={!!disabled || !!readOnly}
        placeholder={placeholder}
      />
      {adornment && adornmentPosition === 'end' && (
        <div className={classnames('input-adornment', `input-adornment-end`)}>
          {adornment}
        </div>
      )}
    </div>
  )
}

Input.defaultProps = {
  adornmentPosition: 'end',
  __fieldContext: {},
  variant: 'bordered',
}
