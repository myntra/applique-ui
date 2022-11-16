import React from 'react'

import CodePreview from './CodePreview'
import CodeSource from './CodeSource'
import styles from './styles.scss'

export default function Code({ children, className }) {
  const showPreview = className === 'language-preview'
  const showSource = className === 'language-readOnly'

  if (showSource)
    return (
      <div className={styles('codeEditor__input', 'codeEditor__background')}>
        {children}
      </div>
    )

  return (
    <div className={styles('codeEditor')}>
      <CodePreview
        source={children}
        className={styles(className, { codeEditor__background: !showPreview })}
      />
      {showPreview && <CodeSource source={children} />}
    </div>
  )
}
