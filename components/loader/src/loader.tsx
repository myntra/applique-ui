import React from 'react'

import classnames from './loader.module.scss'

export interface Props extends BaseProps {
  /**
   * The variant of the loader.
   */
  type: 'inline' | 'small' | 'large'

  /**
   * Use current color for loading spinner.
   */
  currentColor?: boolean
  /**
   * Type of progress loader.
   */
  appearance: 'spinner' | 'bar'
  children?: never
  isLoading?: boolean
  /**
   * Text to display with loader
   */
  text?: string
  /**
   * Text to display with loader
   */
  textPosition?: 'left | right | top | bottom'
}

/**
 * A component to display infinite loading progress.
 *
 * @since 0.5.0
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/loader
 */
export default function Loader({
  className,
  type,
  appearance,
  isLoading,
  text,
}: Props) {
  return (
    <div className={classnames(className, 'loader', type)}>
      <div className={classnames(appearance, { 'is-loading': isLoading })}>
        <div />
        <div />
        <div />
      </div>
      {text && <span>{text}</span>}
    </div>
  )
}

Loader.defaultProps = {
  type: 'inline',
  appearance: 'spinner',
  isLoading: true,
}
