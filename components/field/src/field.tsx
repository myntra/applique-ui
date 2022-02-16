import React, { PureComponent, ReactNode } from 'react'
import InfoCircleSolid from 'uikit-icons/svgs/InfoCircleSolid'
import Tooltip from '@myntra/uikit-component-tooltip'
import Icon from '@myntra/uikit-component-icon'

import classnames from './field.module.scss'

export interface Props extends BaseProps {
  /**
   * The name of the value.
   */
  title: ReactNode
  /** A small description to set the context of the input field. */
  description?: ReactNode

  /**
   * Display an error message instead of deccription
   */
  error?: ReactNode
  /**
   * Visually conveys that the field is required.
   */
  required?: boolean
  /**
   * Visually conveys that the field is disabled.
   */
  disabled?: boolean
  /**
   * Used to show info using tooltip
   * */
  info?: string
  /**
   * Used to identify info
   * */
  infoTitle?: string

  /** tooltipPosition with relative to icon */
  tooltipPosition?: 'up' | 'down' | 'left' | 'right'

  /** Displays a tooltip with dark background */
  tooltipDark?: boolean

  /** Event to display the tooltip */
  tooltipTriggerOn?: 'hover' | 'click' | 'focus'
}

/**
 * A wrapper component to add title, label and description to form fields.
 *
 * @since 0.6.0
 * @status REVIEWING
 */
export default function Field({
  title,
  error,
  description,
  required,
  htmlFor,
  children,
  className,
  disabled,
  info,
  infoTitle,
  tooltipPosition,
  tooltipDark,
  tooltipTriggerOn,
  ...props
}: Props) {
  const renderContent = () => (
    <div style={{ maxWidth: '200px' }}>
      {infoTitle && (
        <div
          className={classnames('tootltip-title')}
          style={{
            fontSize: '14px',
            lineHeight: 1.6,
            fontWeight: 'bold',
            textTransform: 'capitalize',
          }}
        >
          {infoTitle}
        </div>
      )}
      <div style={{ fontSize: '10px', lineHeight: 1.2 }}>{info}</div>
    </div>
  )

  return (
    <div
      className={classnames('container', className, {
        disabled,
      })}
      {...props}
    >
      <label
        id={htmlFor ? htmlFor + '__label' : null}
        className={classnames('title')}
        htmlFor={htmlFor}
      >
        {title}
        {required && <span className={classnames('required')}>*</span>}
      </label>
      {info && (
        <div className={classnames('input-tooltip')}>
          <Tooltip
            renderContent={renderContent}
            dark={tooltipDark}
            position={tooltipPosition}
            triggerOn={tooltipTriggerOn}
          >
            <Icon name={InfoCircleSolid} color="primary" />
          </Tooltip>
        </div>
      )}
      {children}
      {error || description ? (
        <div className={classnames('meta')}>
          {error ? (
            <div id={htmlFor ? htmlFor + '__error' : null} role="alert">
              {Array.isArray(error) ? error.join(' ') : error}
            </div>
          ) : (
            description && (
              <div id={htmlFor ? htmlFor + '__description' : null}>
                {description}
              </div>
            )
          )}
        </div>
      ) : null}
    </div>
  )
}

/* istanbul ignore next */
export function withField<P extends object>(BaseComponent: any) {
  let counter = 0

  return class InputField extends PureComponent<P & Props> {
    id = ++counter

    render() {
      const { label, error, description, required, ...props } = this.props
      let id = props.id || `__uikit_field_${this.id}_`

      return (
        <Field
          title={label}
          error={error}
          description={description}
          required={required}
          htmlFor={id}
        >
          <BaseComponent
            {...props}
            required={required}
            id={id}
            aria-describedby={`${id}__description ${id}__error`}
            aria-labelledby={`${id}__label`}
          />
        </Field>
      )
    }
  }
}
