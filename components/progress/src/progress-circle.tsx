import React from 'react'
import classnames from './progress-circle.module.scss'

export interface Props extends BaseProps {
  value: number
  appearance?: 'success' | 'info' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
}

export default function ProgressCircle({
  value: rawValue,
  size,
  appearance,
  className,
  children,
  showValue,
  ...props
}: Props) {
  const value = rawValue / 100
  const height = 24
  const stroke = 3
  const outerRadius = height / 2
  const arcLength = value * 2 * Math.PI * outerRadius
  const arcAngle = value * 360
  const arcEX = outerRadius + Math.sin((arcAngle / 180) * Math.PI) * outerRadius
  const arcEY = outerRadius - Math.cos((arcAngle / 180) * Math.PI) * outerRadius
  const isLarger = arcAngle > 180 ? 1 : 0

  return (
    <div
      {...props}
      className={classnames('circle', className, appearance, size)}
      role="progressbar"
      aria-valuenow={rawValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        viewBox={`-${stroke / 2} -${stroke / 2} ${height + stroke} ${height +
          stroke}`}
      >
        {showValue && (
          <text
            x={outerRadius}
            y={outerRadius}
            textAnchor="middle"
            alignmentBaseline="central"
            className={classnames('value')}
          >
            {value * 100}%
          </text>
        )}
        <path
          className={classnames('filled')}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={arcLength}
          data-test-id="filled"
          d={
            value < 1
              ? `
              M${outerRadius},0
              A${outerRadius},${outerRadius} 0 ${isLarger},1 ${arcEX},${arcEY}
            `
              : `
              M${outerRadius},0
              A${outerRadius},${outerRadius} 0 0,1 ${outerRadius},${outerRadius *
                  2}
              A${outerRadius},${outerRadius} 0 0,1 ${outerRadius},0
            `
          }
        />
        <circle
          className={classnames('base')}
          strokeWidth={stroke}
          r={outerRadius}
          cx={outerRadius}
          cy={outerRadius}
        />
      </svg>
      {children}
    </div>
  )
}

ProgressCircle.defaultProps = {
  appearance: 'success',
}
