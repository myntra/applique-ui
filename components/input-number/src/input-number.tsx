import React from 'react'
import Input from '@applique-ui/input'

export interface Props extends BaseProps {
  /** Sets the text format for the field. */
  type?: 'number'
  /** Current value of the text input field. */
  value?: string | number
  /** The handler to call when the value changes. */
  onChange?(value: number): void
}
/**
 * An input component to read numbers. It is like `<input type="number">` but
 * value is a JavaScript number.
 *
 * @since 0.0.0
 * @status REVIEWING
 * @category input
 * @see http://uikit.myntra.com/components/input-number
 */
export default function InputNumber({
  className,
  onChange,
  value,
  ...props
}: Props): JSX.Element {
  const newVal: number = parseFloat(value as string)
  return (
    <Input
      {...props}
      type="number"
      value={isNaN(newVal) ? '' : value}
      onChange={(event) => onChange?.(parseFloat(event.target.value))}
    />
  )
}
