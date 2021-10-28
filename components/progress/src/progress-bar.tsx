import React from 'react'
import classnames from './progress-bar.module.scss'
import T from '@myntra/uikit-component-text'

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
  ...props
}: Props) {
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
        <div
          className={classnames('foreground')}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      {showValue && <T className={classnames('value')}>{value}%</T>}
    </div>
  )
}

ProgressBar.defaultProps = {
  appearance: 'success',
}
