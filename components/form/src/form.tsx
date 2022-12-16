import React, {
  PureComponent,
  ReactNode,
  FormEvent,
  Children,
  isValidElement,
} from 'react'
import Grid from '@mapplique/uikit-component-grid'
import {
  ColumnSize,
  Props as GridColumnProps,
} from '@mapplique/uikit-component-grid'

import InputCheckbox, {
  Props as InputCheckboxProps,
} from '@mapplique/uikit-component-input-checkbox'
import InputDate, {
  Props as InputDateProps,
} from '@mapplique/uikit-component-input-date'
import InputMasked, {
  Props as InputMaskedProps,
} from '@mapplique/uikit-component-input-masked'
import InputNumber, {
  Props as InputNumberProps,
} from '@mapplique/uikit-component-input-number'
import InputSelect, {
  Props as InputSelectProps,
} from '@mapplique/uikit-component-input-select'
import InputText, {
  Props as InputTextProps,
} from '@mapplique/uikit-component-input-text'
import InputRadio, {
  Props as InputRadioProps,
} from '@mapplique/uikit-component-input-radio'
import InputTextArea, {
  Props as InputTextAreaProps,
} from '@mapplique/uikit-component-input-text-area'
import InputFile, {
  Props as InputFileProps,
} from '@mapplique/uikit-component-input-file'
import Button from '@mapplique/uikit-component-button'
import ButtonGroup from '@mapplique/uikit-component-button-group'
import Field, { Props as FieldProps } from '@mapplique/uikit-component-field'
import { createContext } from '@mapplique/uikit-context'
import { get, set, isReactNodeType, is } from '@mapplique/uikit-utils'

import classnames from './form.module.scss'

export interface FormContext {
  value: unknown
  onChange(value: any): void
  createFieldProps(
    name: string
  ): {
    value: unknown
    onChange(value: unknown): void
  }
}

const FormContext = createContext<FormContext>({
  createFieldProps() {
    console.warn(
      'Form.Xxx components should have be rendered inside a Form component.'
    )
  },
} as any)

export interface Props<T extends Record<string, unknown> = {}>
  extends BaseProps {
  /**
   * A heading/label for the form.
   */
  title?: ReactNode

  /**
   * Default width of a field in the form.
   */
  defaultFieldSize?: ColumnSize

  /**
   * The callback function called when form is submitted.
   *
   * @param event - Form submission event.
   */
  onSubmit?(event: FormEvent): void

  /**
   * Value of all form elements.
   */
  value?: T

  /**
   * The callback function called when form is submitted.
   *
   * @param event - Form submission event.
   */
  onChange?(value: T): void
  /**
   * Position of form related cta
   */
  actions?: 'left' | 'right' | 'centered'
  /**
   * Disable the complete form
   */
  disabled?: boolean
  /**
   * Padding required between rows.
   */
  rowGap?: number
}

export interface FormFieldProps
  extends Pick<
    GridColumnProps,
    Exclude<keyof GridColumnProps, 'className' | 'children'>
  > {}

/**
 * The Form component
 *
 * @since 0.3.0
 * @status REVIEWING
 */
export default class Form extends PureComponent<Props> {
  static defaultProps = {
    defaultFieldSize: 4,
    actions: 'right',
  }

  static Action = Button

  static Text = withField<InputTextProps & FormFieldProps>(InputText)
  static Select = withField<InputSelectProps & FormFieldProps>(InputSelect)
  static Checkbox = withField<InputCheckboxProps & FormFieldProps>(
    InputCheckbox
  )
  static CheckBox = withField<InputCheckboxProps & FormFieldProps>(
    InputCheckbox
  ) // For backward compat.
  static Date = withField<InputDateProps & FormFieldProps>(InputDate)
  static Masked = withField<InputMaskedProps & FormFieldProps>(InputMasked)
  static Number = withField<InputNumberProps & FormFieldProps>(InputNumber)
  static Radio = withField<InputRadioProps & FormFieldProps>(InputRadio)
  static TextArea = withField<InputTextAreaProps & FormFieldProps>(
    InputTextArea
  )
  static File = withField<InputFileProps & FormFieldProps>(InputFile)

  cache: Record<string, (value: unknown) => void> = {}

  handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (this.props.onSubmit) {
      this.props.onSubmit(event)
    }
  }

  createFieldProps = (name: string) => {
    if (!name) return
    if (!this.props.onChange) return

    const result = {
      value: get(this.props.value, name.split('.')),
      onChange:
        this.cache[name] ||
        (this.cache[name] = (value) => {
          if (this.props.onChange) {
            this.props.onChange(
              set({ ...this.props.value }, name.split('.'), value)
            )
          }
        }),
    }

    return result
  }

  render() {
    const {
      children,
      title,
      defaultFieldSize,
      onSubmit,
      className,
      actions: actionPosition,
      value,
      onChange,
      rowGap,
      ...props
    } = this.props

    const fields = []
    const actions = []
    let group = null

    Children.forEach(children, (child) => {
      if (
        isReactNodeType(child, Form.Action) ||
        isReactNodeType(child, Button)
      ) {
        actions.push(
          React.cloneElement(child, {
            disabled: props.disabled || child.props.disabled,
          })
        )
      } else if (isReactNodeType(child, ButtonGroup)) {
        group = child
      } else if (isValidElement(child)) {
        fields.push(React.cloneElement(child, { ...props }))
      } else if (child) {
        fields.push(child)
      }
    })

    if (!group) {
      group = <ButtonGroup></ButtonGroup>
    }

    if (actions.length) {
      group = React.Children.toArray(group.props.children).concat(actions)
    }

    return (
      <FormContext.Provider
        value={{
          value,
          onChange,
          createFieldProps: this.createFieldProps,
        }}
      >
        <form
          {...props}
          className={classnames('form', className)}
          onSubmit={this.handleSubmit}
        >
          {title && <div className={classnames('title')}>{title}</div>}
          <Grid multiline gap={rowGap} key="body">
            {fields.map((field, index) => (
              <Grid.Column
                key={field.key || index}
                size={
                  (field.props && field.props.fieldSize) ||
                  (is.mobile() ? 'full' : defaultFieldSize)
                }
                {...(field.props && field.props.field)}
              >
                {field}
              </Grid.Column>
            ))}
          </Grid>
          <div className={classnames('actions', `actions--${actionPosition}`)}>
            {group}
          </div>
        </form>
      </FormContext.Provider>
    )
  }
}

function createFieldName(name: string) {
  if (!name) return name

  const field = name.replace(/[^a-z0-9]+/gi, '')

  return field[0].toLowerCase() + field.substr(1)
}

function withField<P extends object>(BaseComponent: any) {
  let counter = 0
  const componentName = `FormField(${BaseComponent.name})`

  return class extends PureComponent<P & FieldProps & { name?: string }> {
    // @ts-ignore
    static get name() {
      return componentName
    }

    id = ++counter

    render() {
      const {
        label,
        error,
        description,
        required,
        fieldInfo,
        ...props
      } = this.props
      let id = props.id || `__uikit_field_${this.id}_`

      return (
        <FormContext.Consumer>
          {({ createFieldProps }) => (
            <Field
              title={label}
              error={error}
              description={description}
              required={required}
              htmlFor={id}
              disabled={props.disabled}
              fieldInfo={fieldInfo}
            >
              <BaseComponent
                {...createFieldProps(props.name || createFieldName(label))}
                {...props}
                required={required}
                id={id}
                aria-describedby={`${id}__description ${id}__error`}
                aria-labelledby={`${id}__label`}
              />
            </Field>
          )}
        </FormContext.Consumer>
      )
    }
  }
}
