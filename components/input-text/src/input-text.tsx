import React from 'react'
import Input from '@applique-ui/input'

export interface Props extends BaseProps {
  /** Sets the text format for the field. */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
  /** Current value of the text input field. */
  value?: string
  /** The handler to call when the value changes. */
  onChange?(value: string): void
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
  ...props
}: Props) {
  return (
    <Input
      {...props}
      value={typeof value !== 'string' ? '' : value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

InputText.defaultProps = {
  type: 'text',
}
