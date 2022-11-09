import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { prism as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneLight as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { vs as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { classnames } from '@myntra/uikit-utils'
import React from 'react'

import styles from './styles.scss'

const resetStyles = {
  background: 'none',
  border: 'none',
  padding: '0',
  margin: '0',
}

function Source({ source }) {
  return (
    <SyntaxHighlighter
      language="javascript"
      style={style}
      customStyle={resetStyles}
      codeTagProps={resetStyles}
    >
      {source}
    </SyntaxHighlighter>
  )
}

export default function CodeSource({ source, showSource = true }) {
  return (
    <div className={styles('codeEditor__input', 'codeEditor__background')}>
      {showSource && <Source source={source} />}
    </div>
  )
}
