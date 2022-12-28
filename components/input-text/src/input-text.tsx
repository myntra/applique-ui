import React from 'react'
import classnames from './input-text.module.scss'
import Icon, { IconName } from '@applique-ui/icon'
import SpinnerSolid from 'uikit-icons/svgs/SpinnerSolid'

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
  /*** Represent the variant of input box */
  variant?: 'bordered' | 'standard'
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
export default function InputText({
  className,
  onChange,
  value,
  readOnly,
  icon,
  adornment,
  adornmentPosition,
  __fieldContext = {},
  variant = 'standard',
  ...props
}: Props) {
  readOnly = readOnly || !onChange

  const { error, disabled } = {
    error: __fieldContext.error || props.error,
    disabled: __fieldContext.disabled || props.disabled,
  }
  const { placeholder = ' ' } = props
  const bordered = variant === 'bordered'
  const standard = variant === 'standard'

  return (
    <div
      className={classnames(
        'container',
        { disable: !!disabled },
        { standard: standard },
        { bordered: bordered },
        { filled: !isEmptyValue(value) },
        { error: !!error },
        className
      )}
    >
      {icon && <Icon className={classnames('icon')} name={icon} />}
      {adornment && adornmentPosition === 'start' && (
        <div className={classnames('input-adornment', `input-adornment-start`)}>
          {adornment}
        </div>
      )}
      <input
        {...props}
        readOnly={readOnly}
        value={typeof value !== 'string' ? '' : value}
        onChange={readOnly ? null : (event) => onChange(event.target.value)}
        className={classnames('input')}
        disabled={!!disabled}
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

InputText.defaultProps = {
  type: 'text',
  adornmentPosition: 'end',
  __fieldContext: {},
  variant: 'bordered',
}
