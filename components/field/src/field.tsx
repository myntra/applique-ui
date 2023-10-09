import React, {
  PureComponent,
  ReactNode,
  Children,
  isValidElement,
} from 'react'
import Icon from '@applique-ui/icon'
import TimesSolid from "uikit-icons/svgs/TimesSolid"
import CheckSolid from "uikit-icons/svgs/CheckSolid"

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
   * Block to show info about the field. Should be a react component.
   */
  fieldInfo?: ReactNode
  /*
   * Display a success message instead of description
   */
  success?: ReactNode
  /**
   * Display Info Icon
   */
  info?: Boolean
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
  description,
  required,
  htmlFor,
  children,
  className,
  disabled,
  fieldInfo,
  success,
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
          {required && <span className={classnames('required')}>*</span>}
        </span>
        {isValidElement(fieldInfo) && fieldInfo}
      </label>
      {Children.map(
        children,
        (
          child: ReactNode & { props: { disabled: Boolean; error: Boolean } },
          index
        ) => {
          if (isValidElement(child)) {
            return React.cloneElement(child, {
              __fieldContext: {
                error: !!error || child.props.error,
                disabled: disabled || child.props.disabled,
              },
            } as any)
          }
          return child
        }
      )}
      {error || description || success ? (
        <div className={classnames('meta')}>
          {error ? (
            <div
              id={htmlFor ? htmlFor + '__error' : null}
              role="alert"
              className={classnames({ error: !!error })}
            >
              <Icon name={TimesSolid} className={classnames('meta-icon')}/>
              {Array.isArray(error) ? error.join(' ') : error}
            </div>
          ) : success ? (
            <div
              id={htmlFor ? htmlFor + '__success' : null}
              className={classnames('success')}
            >
              <Icon name={CheckSolid} className={classnames('meta-icon')}/>
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
