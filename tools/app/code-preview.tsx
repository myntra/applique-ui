import React, { useState, useEffect } from 'react'
import Preview from './preview'

export function useCompiler(source, { watch = true, once = true } = {}) {
  const [component, setComponent] = useState(null)
  const [fallback, setFallback] = useState(null)
  const [error, setError] = useState(null)
  const [counter, setCounter] = useState(0)

  useEffect(
    function compileOnSourceChange() {
      const run = async () => {
        if (watch || (counter === 0 && once)) {
          setCounter(counter + 1)
          try {
            const component = await compile(source)

            if (component) {
              const factory = () => component
              setComponent(factory)
              if (!fallback) setFallback(factory)
              setError(null)
            } else if (source) {
              throw new Error(`No component returned by 'compiler'`)
            }
          } catch (error) {
            setError(() => error)
          }
        }
      }

      run()
    },
    [source]
  )

  function clearError() {
    setError(null)
  }

  return error ? [fallback, error, clearError] : [component, error, clearError]
}

export default function CodePreview({ className, source }) {
  const [component, compilerError] = useCompiler(source)
  const [error, setError] = useState(null)
  const [key, setKey] = useState(0)

  useEffect(
    function onCompilerErrorChange() {
      if (!compilerError) setError(null)
    },
    [compilerError]
  )

  return (
    <div className={className} style={{ maxWidth: '100%' }}>
      <button title="Refresh" onClick={() => setKey(key + 1)}>
        refresh
      </button>
      {<Preview key={key} component={component} onError={setError} />}
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

async function compile(code) {
  if (!code) return null

  const babel = await import(
    /* webpackPrefetch: true */
    /* webpackChunkName: 'monaco/babel' */ '@babel/standalone'
  )

  code = code.trim()

  if (!code.startsWith('function ') && !code.startsWith('class ')) {
    code = `function Example(props) {\n  ${code.replace(
      /<(?:[A-Za-z0-9.]+(?: [^>]*)?|>)/,
      (tag) => `return ` + tag
    )}\n}`
  }

  const icons = [
    'AtSolid',
    'BarsSolid',
    'Bell',
    'BoxSolid',
    'CheckCircleSolid',
    'CheckSolid',
    'ChevronDownSolid',
    'ChevronLeftSolid',
    'ChevronRightSolid',
    'ChevronUpSolid',
    'ClockRegular',
    'ClockSolid',
    'CopyRegular',
    'EllipsisVSolid',
    'ExclamationCircleSolid',
    'ExclamationTriangleSolid',
    'InfoCircleSolid',
    'SignInAltSolid',
    'SignOutAltSolid',
    'SortDownSolid',
    'SortSolid',
    'SortUpSolid',
    'SpinnerSolid',
    'SyncSolid',
    'TimesSolid',
    'UserCircleSolid',
    'UserSolid',
  ]
  const identifiers = []
  const output = await babel.transform(code, {
    presets: ['es2017', 'react'],
    plugins: [unknownIdentifierPlugin(identifiers)],
  })

  if (identifiers.length) {
    code = output.code.trim()

    if (code.startsWith('function ')) {
      let [
        ,
        name,
        ,
        body,
      ] = /^function\s+([^(]+)\(([^)]*)\)[^{]*\{((?:.|\n)*)$/.exec(code)

      code = `function ${name}(props) {\n  const { ${identifiers.join(
        ', '
      )}, ${icons.join(', ')} } = props.context\n${body}`
    } else if (code.startsWith('class ')) {
      const [prefix, suffix] = code.split(/render\s*\([^)]*\)[^{}]*\{/, 2)

      code = `${prefix}\n  render() {\n    const { ${identifiers.join(
        ', '
      )}, ${icons.join(', ')} } = this.props.context\n${suffix}`
    }
  } else {
    code = output.code
  }

  // eslint-disable-next-line no-new-func
  const fn = new Function('React', `${code}\nreturn Example`)

  return fn(React)
}

/**
 * @param {string[]} identifiers
 */
function unknownIdentifierPlugin(identifiers) {
  function getName(node) {
    return node.object ? getName(node.object) : node.name
  }

  return {
    visitor: {
      JSXOpeningElement(path) {
        const { node, scope } = path

        const name = getName(node.name)
        const binding = scope.getBinding(name)

        if (!binding) {
          if (/^[A-Z]/.test(name)) {
            if (!identifiers.includes(name) && name !== 'React') {
              identifiers.push(name)
            }
          }
        }
      },
      Identifier(path) {
        const { node, scope } = path

        const name = node.name
        const binding = scope.getBinding(name)

        if (!binding) {
          if (/^use[A-Z]/.test(name)) {
            if (!identifiers.includes(name)) {
              identifiers.push(name)
            }
          }
        }
      },
    },
  }
}
