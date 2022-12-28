import React from 'react'
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
