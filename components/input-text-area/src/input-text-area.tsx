import React from 'react'
import classnames from './input-text-area.module.scss'
import { IconName } from '@applique-ui/icon'
import Input from '@applique-ui/input'

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
export default function InputTextArea({onChange, value, ...props}: Props) {
  return (
    <Input
      {...props}
      value={typeof value !== 'string' ? '' : value}
      onChange={(event) => onChange?.(event.target.value)}
      type='textarea'
    />
  )
}

InputTextArea.defaultProps = {
  disabled: false,
  noResize: false,
  rows: 1,
}
