import React, { useState, useEffect } from 'react'
import { componentsList } from '../componentsList'

/**
 * @param {string[]} identifiers
 */
function unknownIdentifierPlugin(identifiers) {
  function getName(node) {
    return node.object ? getName(node.object) : node.name
  }

  function pushIdentifiers(binding, name) {
    if (!binding) {
      if (/^use[A-Z]/.test(name)) {
        if (!identifiers.includes(name)) {
          identifiers.push(name)
        }
      } else if (/^[A-Z]/.test(name)) {
        if (!identifiers.includes(name) && name !== 'React') {
          identifiers.push(name)
        }
      }
    }
  }

  return {
    visitor: {
      JSXOpeningElement(path) {
        const { node, scope } = path

        const name = getName(node.name)
        const binding = scope.getBinding(name)
        pushIdentifiers(binding, name)
      },
      Identifier(path) {
        const { node, scope } = path

        const { name } = node
        const binding = scope.getBinding(name)
        pushIdentifiers(binding, name)
      },
    },
  }
}

async function compile(src) {
  if (!src) return null

  const babel = await import(
    /* webpackPrefetch: true */
    /* webpackChunkName: 'monaco-babel' */ '@babel/standalone'
  )

  let code = src.trim()

  if (!code.startsWith('function ') && !code.startsWith('class ')) {
    code = `function Example(props) {\n  ${code}\n}`
  }

  const identifiers = []
  const output = await babel.transform(code, {
    presets: ['es2017', 'react'],
    plugins: [unknownIdentifierPlugin(identifiers)],
  })

  if (identifiers.length) {
    code = output.code.trim()

    if (code.startsWith('function ')) {
      const [
        ,
        name,
        ,
        body,
      ] = /^function\s+([^(]+)\(([^)]*)\)[^{]*\{((?:.|\n)*)$/.exec(code)

      code = `function ${name}(props) {\n  const { ${identifiers.join(
        ', '
      )} } = components\n${body}`
    } else if (code.startsWith('class ')) {
      const [prefix, suffix] = code.split(/render\s*\([^)]*\)[^{}]*\{/, 2)

      code = `${prefix}\n  render() {\n    const { ${identifiers.join(
        ', '
      )} } = this.components\n${suffix}`
    }
  } else {
    code = output.code
  }

  // eslint-disable-next-line no-new-func
  const fn = new Function(['React', 'components'], `${code}\nreturn Example`)

  return fn(React, componentsList)
}

export default function useCompiler(
  source,
  { watch = true, once = true } = {}
) {
  const [component, setComponent] = useState(null)
  const [fallback, setFallback] = useState(null)
  const [error, setError] = useState(null)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const run = async () => {
      if (watch || (counter === 0 && once)) {
        setCounter(counter + 1)
        try {
          const component2 = await compile(source)

          if (component2) {
            const factory = () => component2
            setComponent(factory)
            if (!fallback) setFallback(factory)
            setError(null)
          } else if (source) {
            throw new Error('No component returned by compiler')
          }
        } catch (e) {
          console.log(e)
          setError(() => e)
        }
      }
    }

    run()
  }, [source])

  function clearError() {
    setError(null)
  }

  return error ? [fallback, error, clearError] : [component, error, clearError]
}
