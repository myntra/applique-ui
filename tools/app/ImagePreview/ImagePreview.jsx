import React from 'react'
import { classnames } from '@myntra/uikit-utils'
import styles from './styles.scss'

export default function ImagePreview({ children, background = false }) {
  return (
    <div
      className={styles('imagePreview', {
        imagePreview__background: background,
      })}
    >
      {children}
    </div>
  )
}
