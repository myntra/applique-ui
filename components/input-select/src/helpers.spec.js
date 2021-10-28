import { createSearchIndex, executeFilterSearch } from './helpers'

describe('executeFilterSearch', () => {
  const options = ['foo', 'bar', 'baz', 'yay', 'nay'].map((value) => ({
    value,
  }))
  const sifter = createSearchIndex(options)
  const config = {
    searchableKeys: ['value'],
    sortBy: 'value',
    sortOrder: 'asc',
  }

  it('should filter items', () => {
    expect(executeFilterSearch(sifter, options, '', config)).toHaveLength(5)
    expect(executeFilterSearch(sifter, options, 'ba', config)).toHaveLength(2)
  })

  it('should filter items with custom filter', () => {
    const custom = {
      ...config,
      filterOptions: (item) => /[fry]/.test(item.value),
    }
    expect(executeFilterSearch(sifter, options, '', custom)).toHaveLength(4)
    expect(executeFilterSearch(sifter, options, 'ba', custom)).toHaveLength(1)
  })
})
