import React, { PureComponent, ReactNode } from 'react'

import classnames from './field.module.scss'
const VALIDATION_STATUS_ERROR = 'error'
const VALIDATION_STATUS_SUCCESS = 'success'
import InfoCircleSolid from 'uikit-icons/svgs/InfoCircleSolid'
import Icon, { IconName } from '@myntra/uikit-component-icon'

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
  error?: ReactNode | boolean
  /**
   * Visually conveys that the field is required.
   */
  required?: boolean
  /**
   * Visually conveys that the field is disabled.
   */
  disabled?: boolean
  /**
   * Display a success message instead of description
   */
  success?: ReactNode
  /**
   * Display Info Icon
   */
  info: Boolean
}

/**
 * A wrapper component to add title, label and description to form fields.
 *
 * @since 0.6.0
 * @status REVIEWING
 */
export default function Field({
  title,
  error = false,
  description = 'This is description',
  required,
  htmlFor,
  children,
  className,
  disabled,
  success,
  hovered,
  focused,
  filled,
  info,
  ...props
}: Props) {
  return (
    <div
      className={classnames('container', className, {
        disabled,
      })}
      {...props}
    >
      <label
        id={htmlFor ? htmlFor + '__label' : null}
        className={classnames('title', { error: !!error })}
        htmlFor={htmlFor}
      >
        <span>
          {title}
          {required && <span className={classnames('required')}>&nbsp;*</span>}
        </span>

        {info && <Icon className={classnames('info')} name={InfoCircleSolid} />}
      </label>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          __fieldContext: { error, disabled },
        })
      })}
      {children}
      {error || description || success ? (
        <div className={classnames('meta')}>
          {error ? (
            <div
              id={htmlFor ? htmlFor + '__error' : null}
              role="alert"
              className={classnames({ error: !!error })}
            >
              {Array.isArray(error) ? error.join(' ') : error}
            </div>
          ) : success ? (
            <div
              id={htmlFor ? htmlFor + '__success' : null}
              className={classnames('success')}
            >
              {success}
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
