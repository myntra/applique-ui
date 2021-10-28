import React from 'react'
import List from './list'

/*

List Specification.

1. Renders a list of items.
2. Optionally use virtual list.
3. Allow single/multiple selection.
4. Keyboard accessibility (navigate with keyboard).

*/

describe('List', () => {
  const items = ['Foo', 'Bar', 'Baz']
  it('should render list of items', () => {
    mountShallow(<List items={items}>{(item) => item}</List>)
  })
})
