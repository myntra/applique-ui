const regEx = {
  mobile: /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/g,
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isArray<T = unknown>(value: any): value is T[] {
  return Array.isArray(value)
}

export function isNullOrUndefined(value: any) {
  return value === null || value === undefined
}

export function isPlainObject<T = unknown>(
  value: any
): value is Record<string, T> {
  return value !== null && typeof value === 'object'
}

export function unique<T = unknown>(items: T[]): T[] {
  return Array.from(new Set(items))
}

export function get(target: any, keys: (string | number)[]) {
  if (!keys.length) return undefined
  let currentTarget = target

  keys.every((key) => {
    if (currentTarget == null) {
      currentTarget = undefined
      return false
    }
    if (typeof currentTarget !== 'object') {
      currentTarget = undefined
      return false
    }

    currentTarget = currentTarget[key]

    return true
  })

  return currentTarget
}

export function set(target: any, keys: (string | number)[], value: unknown) {
  if (!keys.length) return target

  let currentTarget = target == null ? (target = {}) : target
  const lastKey = keys.pop()

  keys.every((key) => {
    if (currentTarget == null) return false
    if (typeof currentTarget[key] !== 'object') {
      currentTarget[key] = {}
    }

    currentTarget = currentTarget[key]

    return true
  })

  currentTarget[lastKey] = value

  return target
}

/**
 * Create an iterator of given range.
 */
export function range(start: number, end: number) {
  const result: number[] = []

  for (let i = start; i <= end; ++i) result.push(i)

  return result
}

/**
 * Wrap single element to array if required.
 *
 * @export
 * @template T
 * @param {Array.<T>|T} any
 * @return {Array.<T>}
 */
export function toArray(any) {
  return Array.isArray(any)
    ? any
    : any === undefined || any === null
    ? []
    : [any]
}

/**
 * Create set from values.
 *
 * @export
 * @template T
 * @param {Array.<T>|T} any
 * @return {Set.<T>}
 */
export function toSet(any) {
  return new Set(toArray(any))
}

/**
 * @typedef object ClassNames
 * @property {function(Object.<string, string>): string} use Load class names from CSS modules mapping.
 */

/**
 * Format CSS class names.
 *
 * @export
 * @param {...string|string[]|Object.<string, boolean>} args
 * @returns {ClassNames & Array.<string>}
 */
export function classnames(...args) {
  const classes: any = []

  classes.use = (cssModule) => {
    return unique(
      classes.map((it) => cssModule[it] || it).filter(isString)
    ).join(' ')
  }

  classes.toString = () => {
    return unique(classes.filter(isString)).join(' ')
  }

  args.forEach((arg) => {
    if (isString(arg)) classes.push(arg)
    else if (isArray(arg)) classes.push(...arg)
    else if (isPlainObject(arg)) {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) classes.push(key)
      })
    }
  })

  return classes
}
/**
 * Create object from [source] without [keys].
 *
 * @export
 * @template T
 * @param {Object.<string, T>} source
 * @param {string[]|Object.<string, any>} keys
 * @returns {Object.<string, T>}
 */
export function objectWithoutProperties(source, keys) {
  const target = Object.assign({}, source)
  const remove = (key) => delete target[key]
  ;(Array.isArray(keys) ? keys : Object.keys(keys)).forEach(remove)

  return target
}

/**
 * Extract extra props.
 *
 * @export
 * @template T
 * @param {Object.<string, any>} propTypes
 * @returns {function(Object.<string, T>): Object.<string, T>}
 */
export function onlyExtraProps(propTypes) {
  const keys = Object.keys(propTypes)

  return memoize((props) => objectWithoutProperties(props, keys))
}

/**
 * Compare arrays shallowly.
 *
 * @param {Array.<any>} prev
 * @param {Array.<any>} next
 * @param {function(any, any): boolean} [isEqual=(a, b) => a === b]
 * @returns {boolean}
 */
export function isEqualShallow(prev, next, isEqual = (a, b) => a === b) {
  if (!Array.isArray(prev) || !Array.isArray(next)) return false
  if (prev.length !== next.length) {
    return false
  }

  const length = prev.length
  for (let i = 0; i < length; i++) {
    if (!isEqual(prev[i], next[i])) {
      return false
    }
  }

  return true
}

export function findLastIndex<T = unknown>(
  items: T[],
  check: (item: T, index: number, items: T[]) => boolean
): number {
  const index = items
    .slice()
    .reverse()
    .findIndex(check)

  if (index < 0) return -1

  return items.length - index - 1
}

/**
 * Debounce a frequently called function.
 */
export function debounce<T = unknown>(
  fn: (...args: T[]) => void,
  wait: number = 300,
  immediate: boolean = true
): (...args: T[]) => void {
  let timeout: any = null

  return function(...args: T[]) {
    const context = this
    const later = () => {
      timeout = null
      if (immediate) fn.apply(context, args)
    }

    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) fn.apply(context, args)
  }
}

/**
 * Memoize results of a function.
 */
export function memoize<F extends (...args: any[]) => any>(
  func: F,
  isEqual = (a, b) => a === b
): F {
  let lastArgs = null
  let lastResult = null
  let lastThis = null
  let calledOnce = false

  return function(...args) {
    if (
      calledOnce &&
      lastThis === this &&
      isEqualShallow(lastArgs, args, isEqual)
    ) {
      return lastResult
    }

    calledOnce = true
    lastArgs = args
    lastThis = this
    lastResult = func.apply(this, args)

    return lastResult
  } as any
}

export function looseEquals(a, b) {
  if (a === b) return true
  if ((a === null && b) || (a && b === null)) return false
  if (typeof a !== typeof b) return false
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false

    return a.every((item, index) => looseEquals(item, b[index]))
  }
  if (typeof a === 'object') {
    const keysA = Object.keys(a)
    const keysB = new Set(Object.keys(b))

    if (keysA.length !== keysB.size) return false

    if (keysA.some((key) => !keysB.has(key))) return false

    return keysA.every((key) => looseEquals(a[key], b[key]))
  }

  return false
}

import React, {
  isValidElement,
  ReactElement,
  JSXElementConstructor,
  RefObject,
  Fragment as ReactFragment,
} from 'react'
// --

export const Fragment =
  ReactFragment ||
  (({ children }) =>
    React.createElement('div', { style: { display: 'contents' } }, children))

export function isReactNodeType<
  T extends JSXElementConstructor<P> = any,
  P = any
>(node: any, type: T): node is ReactElement<P, T> {
  if (!isValidElement(node)) return false
  if (node.type == null) return false
  if (node.type === (type as any)) return true
  if ((node.type as any)._result === type) return true
  return false
}

export function createRef<T = unknown>(): RefObject<T> {
  const CAN_USE_CREATEREF = !!React.createRef
  if (CAN_USE_CREATEREF) {
    return React.createRef()
  } else {
    const fn: any = (elem) => {
      fn.current = elem
    }
    return fn
  }
}

export const is = {
  mobile: function() {
    const userAgent = navigator.userAgent
    return !!userAgent.match(regEx.mobile)
  },
}
