import React, { Children, isValidElement } from 'react'

import classnames from './stack-layout.module.scss'

const distributions = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
}

const alignments = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
  normal: 'normal',
}

export interface Props extends BaseProps {
  type: 'stack'

  /**
   * Horizontally distribute the components within the stack.
   */
  distribution?: 'start' | 'center' | 'end' | 'spaceBetween' | 'spaceAround'

  /**
   * Vertically align the components within the stack.
   */
  alignment?: 'top' | 'middle' | 'bottom' | 'normal'

  /**
   * Regulates the size of the gutter between items.
   */
  gutter?: 'small' | 'medium' | 'large' | 'none'

  /**
   * Arrange items in multiple rows.
   */
  wrap?: boolean

  /**
   * Defines how much space each item within the stack container will take in relation to the others.
   */
  space?: (number | 'none')[]
}

/**
 * A layout which organizes it's children into flexible horizontal row.
 *
 * It gives control over the way they spread, space, and align.
 */
export default function StackLayout({
  type,
  distribution,
  alignment,
  wrap,
  className,
  children,
  gutter,
  style,
  space,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={classnames('stack', className, gutter)}
      style={{
        alignItems: alignments[alignment],
        justifyContent: distributions[distribution],
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {space
        ? Children.map(children, (child, index) => {
            if (!isValidElement(child)) return

            const flex = space[index]

            if (flex == null) return child

            const itemStyle = flex === 'none' ? { display: 'none' } : { flex }
            const { style } = child.props || ({} as any)

            return React.cloneElement(child, {
              style: { ...style, ...itemStyle },
            } as any)
          })
        : children}
    </div>
  )
}

StackLayout.defaultProps = {
  distribution: 'start',
  alignment: 'top',
  gutter: 'medium',
  wrap: false,
}
