import {
  get,
  set,
  classnames,
  unique,
  objectWithoutProperties,
  onlyExtraProps,
  memoize,
  toArray,
  toSet,
  isEqualShallow,
  debounce,
  findLastIndex,
} from './index'

jest.disableAutomock()

describe('findLastIndex', () => {
  it('last index', () => {
    const items = [0, 1, 2, 3, 4, 5, 6, 7]

    expect(findLastIndex(items, (item) => item === 5)).toBe(5)
    expect(findLastIndex(items, (item) => item === 3)).toBe(3)
    expect(findLastIndex(items, (item) => item === 8)).toBe(-1)
  })
})
describe('debounce', () => {
  it('debounce consecutive calls', () => {
    const fn = jest.fn()
    const debounceFn = debounce(fn)

    debounceFn()
    debounceFn()
    debounceFn()

    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('findLast', () => {
  it('debounce consecutive calls', () => {
    const fn = jest.fn()
    const debounceFn = debounce(fn)

    debounceFn()
    debounceFn()
    debounceFn()

    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('classnames', () => {
  it('should format class names', () => {
    expect(
      classnames('foo', 'bar', { baz: true, zen: false }, [
        'and',
        undefined,
        null,
        1,
      ]).toString()
    ).toBe('foo bar baz and')
  })

  it('should apply css modules', () => {
    expect(
      classnames(
        'foo',
        'bar',
        { baz: true, zen: false },
        ['and', undefined, null, 1],
        undefined
      ).use({
        foo: 'foo0',
        bar: 'bar0',
        and: 'and0',
      })
    ).toBe('foo0 bar0 baz and0')
  })
})

describe('unique', () => {
  it('should remove duplicates', () => {
    expect(unique([1, 1, 2, 2, 2])).toEqual([1, 2])
    expect(unique([1, 1, 2, null, 2, 'foo'])).toEqual([1, 2, null, 'foo'])
  })
})

describe('objectWithoutProperties', () => {
  it('should remove keys', () => {
    expect(objectWithoutProperties({ foo: 1, bar: 2 }, ['foo'])).toEqual({
      bar: 2,
    })
  })

  it('should ignore prototype keys', () => {
    class Foo {
      constructor() {
        this.foo = 1
      }
      bar() {}
    }
    expect(objectWithoutProperties(new Foo(), ['foo'])).toEqual({})
  })

  it('should remove matching keys', () => {
    expect(objectWithoutProperties({ foo: 1, bar: 2 }, { foo: 3 })).toEqual({
      bar: 2,
    })
  })
})

describe('onlyExtraProps', () => {
  it('should remove extra props', () => {
    const only = onlyExtraProps({ foo: null })

    expect(only({ foo: 1, bar: 2 })).toEqual({ bar: 2 })
  })

  it('should memoize results', () => {
    const only = onlyExtraProps({ foo: null })
    const props = { foo: 1, bar: 2 }

    expect(only(props)).toEqual({ bar: 2 })

    props.bar = 3
    expect(only(props)).toEqual({ bar: 2 })
  })

  it('should refresh results when props change', () => {
    const only = onlyExtraProps({ foo: null })
    let props = { foo: 1, bar: 2 }

    expect(only(props)).toEqual({ bar: 2 })

    props = { ...props, bar: 3 }
    expect(only(props)).toEqual({ bar: 3 })
  })
})

describe('memoize', () => {
  it('should should memoize', () => {
    const fn = memoize((foo, bar) => 'foo:' + foo + ',bar:' + bar)

    expect(fn(1, 2)).toEqual('foo:1,bar:2')
    expect(fn(1, 2)).toEqual('foo:1,bar:2')
    expect(fn(1, 3)).toEqual('foo:1,bar:3')
    expect(fn(2, 3)).toEqual('foo:2,bar:3')
  })

  it('should use custom equals', () => {
    const fn = memoize((foo, bar) => 'foo:' + foo + ',bar:' + bar, () => true)
    expect(fn(1, 2)).toEqual('foo:1,bar:2')
    expect(fn(2, 3)).toEqual('foo:1,bar:2')
  })
})

describe('toArray', () => {
  it('should always return an array', () => {
    expect(toArray([1])).toEqual([1])
    expect(toArray(1)).toEqual([1])
    expect(toArray(false)).toEqual([false])
    expect(toArray('')).toEqual([''])
    expect(toArray(undefined)).toEqual([])
    expect(toArray(null)).toEqual([])
  })
})

describe('toSet', () => {
  it('should always return a set', () => {
    expect(toSet([1])).toEqual(new Set([1]))
    expect(toSet(1)).toEqual(new Set([1]))
    expect(toSet(false)).toEqual(new Set([false]))
    expect(toSet('')).toEqual(new Set(['']))
    expect(toSet(undefined)).toEqual(new Set())
    expect(toSet(null)).toEqual(new Set())
  })
})

describe('isEqualShallow', () => {
  expect(isEqualShallow(null, [])).toBe(false)
  expect(isEqualShallow([], null)).toBe(false)
  expect(isEqualShallow([1, 2], [1])).toBe(false)
  expect(isEqualShallow([1, 2], [1, 2])).toBe(true)
})

describe('get', () => {
  expect(get(null, [])).toBe(undefined)
  expect(get({ foo: 'foo' }, ['foo'])).toBe('foo')
  expect(get({ foo: { bar: 'bar' } }, ['foo', 'bar'])).toBe('bar')
  expect(get({ foo: { bar: 'bar' } }, ['foo', 'baz'])).toBe(undefined)
  expect(get({ foo: { bar: 'bar' } }, ['foo', 'baz', 'bam'])).toBe(undefined)
})

describe('set', () => {
  expect(set(null, [], 'foo')).toBe(null)
  expect(set(null, ['foo'], 'foo')).toStrictEqual({ foo: 'foo' })
  expect(set({ bar: 'bar' }, ['foo'], 'foo')).toStrictEqual({
    foo: 'foo',
    bar: 'bar',
  })
  expect(set({}, ['foo', 'bar'], 'bar')).toStrictEqual({ foo: { bar: 'bar' } })
})
