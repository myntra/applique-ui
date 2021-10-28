import Sifter from 'sifter'
import { Props } from './input-select'
import { toArray } from '@myntra/uikit-utils'

export function moveSelectedOptionsToTop<V, T>(
  options: T[],
  selectedOptionValues: V,
  valueKey: string
) {
  // sort options. selected should appear at top.
  const value = new Set(toArray(selectedOptionValues))

  const prefix: T[] = []
  const suffix: T[] = []

  options.forEach((option) =>
    (value.has(option[valueKey]) ? prefix : suffix).push(option)
  )

  return prefix.concat(suffix)
}

export function createSearchIndex(options) {
  return new Sifter(options)
}

export function executeFilterSearch<V, T>(
  sifter: Sifter,
  options: T[],
  keyword: string,
  config: Pick<Props<V, T>, 'searchableKeys' | 'sortBy' | 'filterOptions'> & {
    sortBy: string
    sortOrder: string
  }
) {
  const { searchableKeys, sortBy, sortOrder, filterOptions } = config
  const results = sifter.search(keyword, {
    fields: searchableKeys,
    sort: [{ field: sortBy, direction: sortOrder }],
    limit: options.length,
  })

  const target: T[] = results.items.map(({ id: index }) => options[index])

  if (filterOptions) {
    return target.filter(filterOptions)
  }

  return target
}
