import React from 'react'
import classnames from './progress-bar.module.scss'
import T from '@applique-ui/text'

export interface Props extends BaseProps {
  /**
   * Completion state in percentage.
   */
  value: number
  /**
   * Visual style of progress bar.
   *
   * @since 0.11.0
   */
  appearance?: 'success' | 'info' | 'warning' | 'danger'
  /**
   * @deprecated - Use children prop.
   */
  title?: string
  /**
   * Height of progress bar.
   *
   * @since 0.11.0
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Stripe or regular type of progress bar.
   *
   * @since 0.11.0
   */
  types?: 'stripes' | 'regular'
  /**
   * movement of progress bar.
   *
   * @since 0.11.0
   */
  movement?: 'continuous' | 'static'
}

export default function ProgressBar({
  title,
  value,
  height,
  appearance,
  className,
  children,
  size,
  showValue,
  types,
  movement,
  ...props
}: Props) {
  const customStyles: React.CSSProperties = {
    '--custom-width': `${Math.min(100, value)}%`,
    '--movement-width': `${Math.abs(100 - value)}%`,
  }
  return (
    <div
      {...props}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={classnames('bar', className, size, appearance)}
    >
      {title || children ? (
        <div className={classnames('title')}>{children || title}</div>
      ) : null}
      <div className={classnames('background')}>
        {types && types === 'stripes' ? (
          <div
            className={classnames(
              'stripes-back',
              movement === 'continuous' ? 'movement' : ''
            )}
            style={customStyles}
          >
            <div className={classnames('stripes-fore')}></div>
          </div>
        ) : (
          <div
            className={classnames('foreground')}
            style={{ width: `${Math.min(100, value)}%` }}
          />
        )}
      </div>
      {showValue && <T className={classnames('value')}>{value}%</T>}
    </div>
  )
}

ProgressBar.defaultProps = {
  appearance: 'success',
}
