import React, { Children, isValidElement } from 'react'

import classnames from './compat-text.module.scss'

export interface Props extends BaseProps {
  type:
    | 'title'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'heading4'
    | 'paragraph'
    | 'table'
    | 'small'
    | 'caption'
  /**
   * @deprecated
   */
  color?:
    | 'inherit'
    | 'dark'
    | 'light'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'primary'
    | 'accent'
    | 'gray400'
    | 'gray300'
    | 'gray200'
    | 'gray100'
    | 'gray50'
  /**
   * @deprecated
   */
  secondary?: boolean
  /**
   * @deprecated
   */
  disabled?: boolean
  /**
   * @deprecated
   */
  alternate?: boolean
  /**
   * @deprecated
   */
  italic?: boolean
  /**
   * @deprecated
   */
  oblique?: boolean
  /**
   * @deprecated
   */
  size?: 900 | 800 | 700 | 600 | 500 | 400 | 300 | 200
  /**
   * @deprecated
   */
  weight?: 'thin' | 'normal' | 'bold' | 'black' | 'bolder' | 'lighter'
}

/**
 * A utility component for styling text.
 */
export default function CompatText({
  type,
  children,
  style,
  color,
  size,
  weight,
  ...props
}: Props) {
  const element = isValidElement(children) ? (
    Children.only(children)
  ) : (
    <span>{children}</span>
  )

  if (typeof style === 'string') {
    type = style as any
    style = {}
  }

  const className = classnames(
    element.props && element.props.className,
    'text',
    style || 'current',
    color,
    size && `text${size}`,
    weight,
    type
  )

  return React.cloneElement(element, { className, style, ...props })
}

CompatText.defaultProps = {
  color: 'inherit',
}
