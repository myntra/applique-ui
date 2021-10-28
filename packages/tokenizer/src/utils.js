const camelCase = require('camelcase')
const isPlainObject = require('lodash.isplainobject')

class Value {
  onResolve(resolve) {}
}

module.exports = {
  resolve,
  transform,
  camelize,
  flatten,
  Value
}

function resolve(value, root = null, meta = {}) {
  if (!value) return value

  root = root || value

  if (Array.isArray(value)) {
    return value.map(it => resolve(it, root, meta))
  }

  if (value instanceof Value) {
    return value.onResolve((newValue, newMeta) => resolve(newValue, root, { ...newMeta, ...meta }))
  }

  if (typeof value === 'object') {
    const result = {}

    meta = { ...meta, ...value._meta }

    Object.keys(value).forEach(key => {
      if (!key.startsWith('_')) result[key] = resolve(value[key], root, meta)
    })

    return result
  }

  if (typeof value === 'string' && /^\$[a-z0-9._-]+$/i.test(value)) {
    resolve.__cache = resolve.__cache || {}
    if (value in resolve.__cache) return resolve.__cache[value]
    const keys = value.substr(1).split('.')
    try {
      return (resolve.__cache[value] = resolve(
        keys.reduce((acc, key) => acc[key], root),
        root,
        keys.reduce((acc, key) => ({ ...acc[key], _meta: { ...acc._meta, ...(acc[key] || {})._meta } }), root)._meta
      ))
    } catch (e) {
      throw Error('Unknown reference: ' + value)
    }
  }

  if (typeof value === 'string') {
    value = value.replace(/\$[a-z0-9._-]+/, match => resolve(match, root))
  }

  if (!Number.isNaN(Number(value))) value = Number(value)

  value = transform(value, meta)

  return value
}

function transform(value, meta) {
  if ('transformTo' in meta) {
    if (Number.isNaN(Number(value))) return value

    const base = Number(meta.base || 1)
    const unit = meta.transformTo

    switch (unit) {
      case 'px':
        return value + 'px'
      case 'em':
        return Number(Number(value / base).toFixed(5)) + 'em'
      case 'rem':
        return Number(Number(value / base).toFixed(5)) + 'rem'
    }
  }

  return value
}

function camelize(data) {
  if (Array.isArray(data)) return data.map(camelize)

  if (isPlainObject(data)) {
    const result = {}
    Object.keys(data).forEach(key => {
      result[camelCase(key)] = camelize(data[key])
    })

    return result
  }

  return data
}

function flatten(obj, sep = '.') {
  const result = {}

  if (isPlainObject(obj))
    Object.keys(obj).map(key => {
      if (isPlainObject(obj[key])) {
        const target = flatten(obj[key], sep)
        Object.keys(target).forEach(it => {
          result[key + sep + it] = target[it]
        })
      } else if (Array.isArray(obj[key])) {
        result[key] = obj[key].map(it => flatten(it, sep))
      } else {
        result[key] = obj[key]
      }
    })
  else return obj

  return result
}
