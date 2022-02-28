import React, { PureComponent } from 'react'

import classnames from './grid.module.scss'
import GridColumn from './grid-column'

export interface Props extends BaseProps {
  colGap?: 'small' | 'base' | 'large' | 'xx-small' | 'x-small' | 'none'
  rowGap?: 'small' | 'base' | 'large' | 'xx-small' | 'x-small' | 'none'
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
      colGap,
      rowGap,
      gapless,
      centered,
      hcentered,
      vcentered,
      multiline,
      allowAnyChild,
      ...forwardedProps
    } = this.props

    return (
      <div
        {...forwardedProps}
        className={classnames(
          'container',
          className,
          { multiline, centered, hcentered, vcentered, gapless },
          colGap && ['variable-gap', 'col-gap-' + (colGap || 'none')],
          rowGap && ['row-gap-' + (rowGap || 'none')]
        )}
      >
        {children}
      </div>
    )
  }
}
