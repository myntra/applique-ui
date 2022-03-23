import React, { PureComponent } from 'react'

import classnames from './grid.module.scss'
import GridColumn from './grid-column'

export interface Props extends BaseProps {
  gap?: 'small' | 'base' | 'large' | 'xx-small' | 'x-small' | 'none' | number
  gapless?: boolean
  centered?: boolean
  hcentered?: boolean
  vcentered?: boolean
  multiline?: boolean
}

/**
 * It is a flexbox based layouting component.
 *
 * @since 0.0.0
 * @status REVIEWING
 */
export default class Grid extends PureComponent<Props> {
  static Column = GridColumn

  render() {
    const {
      className,
      children,
      gap,
      gapless,
      centered,
      hcentered,
      vcentered,
      multiline,
      allowAnyChild,
      ...forwardedProps
    } = this.props
    const style: any =
      typeof gap === 'number'
        ? {
            '--column-gap': `${gap * 4}px`,
          }
        : null
    return (
      <div
        {...forwardedProps}
        className={classnames(
          'container',
          className,
          { multiline, centered, hcentered, vcentered, gapless },
          gap && ['variable-gap', 'gap-' + (gap || 'none')]
        )}
        style={style}
      >
        {children}
      </div>
    )
  }
}
