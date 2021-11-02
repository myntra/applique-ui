import React from 'react'

import CodePreview from './code-preview'

export default function Code({
  preview = false,
  align = 'center',
  children: source,
  language = 'jsx',
}) {
  return (
    <div>
      {preview ? (
        <CodePreview source={source} />
      ) : (
        <pre style={{ overflow: 'unset' }}>
          <code dangerouslySetInnerHTML={{ __html: source }} />
        </pre>
      )}
    </div>
  )
}
