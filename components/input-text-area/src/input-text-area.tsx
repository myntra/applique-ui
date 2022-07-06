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
  variant = 'standard',
  error = false,
  disabled,
  __fieldContext = {},
  adornmentPosition = 'start',
  icon = <Icon name={SpinnerSolid} />,
  ...props
}: Props) {
  error = !!(error || __fieldContext.error)
  disabled = !!(disabled || __fieldContext.disabled)
  return (
    <div
      className={classnames(
        className,
        'container',
        { standard: variant === 'standard' },
        { bordered: variant === 'bordered' }
      )}
    >
      {icon && (
        <Icon
          className={classnames('icon', { disable: disabled })}
          name={SpinnerSolid}
        />
      )}

      <textarea
        {...props}
        value={value || ''}
        disabled={disabled}
        className={classnames(
          'input',
          { 'no-resize': noResize },
          { error: error },
          { 'with-icon': !!icon }
        )}
        onChange={(event) => onChange && onChange(event.target.value)}
      />
    </div>
  )
}

InputTextArea.defaultProps = {
  disabled: false,
  noResize: false,
  rows: 1,
}
