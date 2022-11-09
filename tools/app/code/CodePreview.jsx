import React, { useState, useEffect } from 'react'
// import { classnames } from '@myntra/uikit-utils'
import Preview from './Preview'
import useCompiler from './useCompiler'
// import styles from './styles.scss'

export default function CodePreview({ className, source }) {
  const [component, compilerError] = useCompiler(source)
  const [error, setError] = useState(null)
  // const [key, setKey] = useState(0)

  useEffect(() => {
    if (!compilerError) setError(null)
  }, [compilerError])

  return (
    <div className={className} style={{ maxWidth: '100%' }}>
      {/* <button type='button' title='Refresh' onClick={() => setKey(key + 1)}>
        refresh
      </button> */}
      <Preview /* key={key} */ component={component} onError={setError} />
      {compilerError && <pre>{compilerError.message}</pre>}
      {error && (
        <pre style={{ overflow: 'auto' }}>
          {error.message}
          <br />
          {error.stack}
        </pre>
      )}
    </div>
  )
}
