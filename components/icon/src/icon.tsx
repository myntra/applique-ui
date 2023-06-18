import React, { ReactNode } from 'react'

import classnames from './icon.module.scss'

export type IconName = string | ReactNode

interface Props extends BaseProps {
  /** icon component name from @myntra/uikit-icons */
  name: IconName
  /** Accessibility text for screen readers */
  title?: string
  /** Spin the  icon continuously in clockwise direction */
  spin?: boolean
  /** Set the size of the icon */
  fontSize?: 'small' | 'medium' | 'large' | 'inherit'
  /** Set the color of the icon */
  color?:
    | 'primary'
    | 'success'
    | 'error'
    | 'warning'
    | 'disabled'
    | 'dark'
    | 'light'
}

/**
 * Displays a glyph using an SVG.
 *
 * @since 0.0.0
 * @status REVIEWING
 * @category basic
 */
export default function Icon({
  name: IconComponent,
  className,
  title,
  spin,
  fontSize,
  color,
  ...props
}: Props) {
  return (
    <svg
      {...props}
      className={classnames(className, fontSize, color, { spin }, 'svg')}
      aria-hidden={title ? null : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      {typeof IconComponent === 'function' ? (
        <IconComponent />
      ) : (
        <use
          xlinkHref={`#uikit-i-${IconComponent}`}
          aria-hidden={title ? true : null}
        />
      )}
    </svg>
  )
}

Icon.defaultProps = {
  fontSize: 'inherit',
  spin: false,
}

Icon.propTypes = {
  __$validation({ name }) {
    if (typeof name === 'string')
      throw new Error(`Icon name cannot be a string. Choose your icon from here https://uikit.myntra.com/guide/icons and use it as 
      a component like name=${capitalize(name)}`)
  },
}

function capitalize(name) {
  return name.replace(/(^\w|(-)\w)/g, (m) => m.toUpperCase()).replace(/-/g, '')
}
