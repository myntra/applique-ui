import React from 'react'
import CompatText from './compat-text'

import classnames from './text.module.scss'

const mapTagToName = {
  div: 'body',
  span: 'caption',
}
export interface Props extends BaseProps {
  /**
   * Abstract component does not render any extra elements.
   * However, it allows only one child component.
   */
  abstract?: boolean

  /**
   * Make font-weight one weight bold or light.
   */
  weight?: 'bolder' | 'lighter'

  /**
   * Use theme colors for text.
   */
  color?:
    | 'primary'
    | 'success'
    | 'warning'
    | 'error'
    | 'dark'
    | 'light'
    | 'gray'

  /**
   * Controls the legibility of the text.
   *
   * **When the `color` prop is provided, it defaults to `'primary'`.**
   *
   * @see https://uikit.myntra.com/guide/text-legibility
   */
  emphasis?: 'high' | 'medium' | 'disabled'

  /**
   * Override default tag for the element.
   */
  tag?: string
  /** Controls the display type */
  display?: 'initial' | 'block' | 'inline'
  /** Set gutter margins to none */
  noGutter?: boolean
}

/**
 * A component to input text-like data (email, tel, text, password and url).
 *
 * @since 1.0.0
 * @status EXPERIMENTAL
 * @category basic
 * @see http://uikit.myntra.com/components/text
 */

export default function Text(props: Props) {
  if ('type' in props) {
    if (__DEV__) {
      console.warn(
        'You are using deprecated Text API. See https://uikit.myntra.com/components/text.'
      )
    }

    return <CompatText {...(props as any)} />
  }

  const { tag } = props
  const Tag = createComponent(
    tag ? mapTagToName[tag] || tag : 'body',
    tag || 'div'
  )
  return <Tag {...props} />
}

Text.Title = Text.title = createComponent('title', 'div')
Text.H1 = Text.h1 = createComponent('h1', 'h1')
Text.H2 = Text.h2 = createComponent('h2', 'h2')
Text.H3 = Text.h3 = createComponent('h3', 'h3')
Text.H4 = Text.h4 = createComponent('h4', 'h4')
Text.Body = Text.body = createComponent('body', 'div')
Text.P = Text.p = createComponent('p', 'p')
Text.Caption = Text.caption = createComponent('caption')

function createComponent(name: string, tag: any = 'span') {
  return function({
    className,
    children,
    abstract = false,
    color = 'dark',
    emphasis = 'high',
    weight,
    noGutter,
    display,
    ...props
  }: Props) {
    className = classnames(
      name,
      className,
      color,
      emphasis,
      weight,
      {
        'no-gutter': noGutter,
      },
      `display-${display || 'initial'}`
    )

    if (abstract) {
      children = React.Children.only(children)
      if (React.isValidElement(children)) {
        return React.cloneElement(children, {
          className: classnames(className, (children.props as any).className),
        } as any)
      }
    }
    return React.createElement(tag, { ...props, className }, children)
  }
}
