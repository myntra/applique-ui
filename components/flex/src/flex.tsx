import React, { PureComponent } from 'react'

import classnames from './flex.module.scss'

export interface Props extends BaseProps {
  className: string
  container: boolean
  inline: boolean
  column: boolean
  start: boolean
  center: boolean
  end: boolean
  around: boolean
  between: boolean
  top: boolean
  middle: boolean
  bottom: boolean
  stretch: boolean
  baseline: boolean
  acStart: boolean
  acCenter: boolean
  acEnd: boolean
  acAround: boolean
  acBetween: boolean
  acStretch: boolean
  wrap: boolean
  noWrap: boolean
  wrapReverse: boolean
  reverse: boolean
  asStart: boolean
  asEnd: boolean
  asCenter: boolean
  asBaseline: boolean
  asStretch: boolean
  order: number
  grow: number
  shrink: number
  basis: string | number
  equal: boolean
}

/**
 * Flex is a wrapper for inlining flex based styles in JSX.
 *
 * __NOTE:__ Flex is added to UIKit for backward compatibility.
 * Prefer using [Grid](../component-compounds/Grid) component for creating layouts.
 * Soon, we would either removing it or providing a simpler API with lesser props.
 *
 * @since 0.3.0
 * @status DEPRECATED
 */
export default function Flex({
  className,
  container,
  inline,
  reverse,
  start,
  center,
  end,
  around,
  between,
  top,
  middle,
  bottom,
  baseline,
  stretch,
  acStart,
  acCenter,
  acEnd,
  acAround,
  acBetween,
  acStretch,
  wrap,
  noWrap,
  wrapReverse,
  children,
  column,
  asStart,
  asEnd,
  asCenter,
  asBaseline,
  asStretch,
  order,
  grow,
  shrink,
  basis,
  equal,
  ...props
}: Props) {
  const styleObj: any = {}
  if (typeof order !== 'undefined') {
    styleObj.order = order
  }
  if (typeof grow !== 'undefined') {
    styleObj.flexGrow = grow
  }
  if (typeof shrink !== 'undefined') {
    styleObj.flexShrink = shrink
  }
  if (typeof basis !== 'undefined') {
    styleObj.flexBasis = basis
  }

  return React.createElement(
    'div',
    {
      style: styleObj,
      className: classnames(
        {
          flex: container,
          reverse: !column && reverse,
          column: column && !reverse,
          'column-reverse': column && reverse,
          'flex-inline': inline,
          start,
          center,
          end,
          around,
          between,
          top,
          middle,
          bottom,
          baseline,
          stretch,
          'ac-start': acStart,
          'ac-center': acCenter,
          'ac-end': acEnd,
          'ac-around': acAround,
          'ac-between': acBetween,
          'ac-stretch': acStretch,
          wrap,
          'no-wrap': noWrap,
          'wrap-reverse': wrapReverse,
          'item-start': asStart,
          'item-end': asEnd,
          'item-center': asCenter,
          'item-baseline': asBaseline,
          'item-stretch': asStretch,
          equal,
        },
        className
      ),
      ...props,
    },
    children
  )
}
