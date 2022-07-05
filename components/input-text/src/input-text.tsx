import React from 'react'
import classnames from './input-text.module.scss'
import Icon, { IconName } from '@myntra/uikit-component-icon'

export interface Props extends BaseProps {
  /** Sets the text format for the field. */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
  /** Current value of the text input field. */
  value?: string
  /** The handler to call when the value changes. */
  onChange?(value: string): void
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
  /*** Visually Representing focused state of component */
  focused?: boolean
  /*** Visually Representing filled state of component */
  filled?: boolean
  /*** Represent the variant of input box */
  variant: 'bordered' | 'standard'
}
type FieldContext = {
  error?: boolean
  disabled?: boolean
}

/**
 * A component to input text-like data (email, tel, text, password and url).
 *
 * @since 0.0.0
 * @status READY
 * @category input
 * @see http://uikit.myntra.com/components/input-text
 */
export default function InputText({
  className,
  onChange,
  value,
  readOnly,
  icon,
  adornment,
  adornmentPosition,
  __fieldContext = {},
  variant,
  ...props
}: Props) {
  readOnly = readOnly || !onChange

  const { error, disabled } = {
    error: __fieldContext.error || props.error,
    disabled: __fieldContext.disabled || props.disabled,
  }
  const { placeholder = ' ' } = props

  return (
    <div
      className={classnames(
        'container',
        { 'with-adornment': adornment },
        { input: !!adornment },
        className
      )}
    >
      {icon && <Icon className={classnames('icon')} name={icon} />}
      {adornment && adornmentPosition === 'start' && (
        <div
          className={classnames(
            'input-adornment',
            `input-adornment--${adornmentPosition}`
          )}
        >
          {adornment}
        </div>
      )}
      <input
        {...props}
        readOnly={readOnly}
        value={typeof value !== 'string' ? '' : value}
        onChange={readOnly ? null : (event) => onChange(event.target.value)}
        className={classnames(
          'input',
          { 'with-icon': !!icon },
          { underline: !!(variant === 'standard') },
          { error: !!error }
        )}
        disabled={!!disabled}
        placeholder={placeholder}
      />
      {adornment && adornmentPosition === 'end' && (
        <div
          className={classnames(
            'input-adornment',
            `input-adornment--${adornmentPosition}`
          )}
        >
          {adornment}
        </div>
      )}
    </div>
  )
}

InputText.defaultProps = {
  type: 'text',
  adornmentPosition: 'end',
  __fieldContext: {},
  variant: 'bordered',
}
