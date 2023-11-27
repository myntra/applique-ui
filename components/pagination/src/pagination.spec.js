import React from 'react'
import Pagination from './pagination'

describe('Pagination', () => {
  it('is a component', () => {
    expect(Pagination).toBeComponent()
  })

  it('should render the component', () => {
    const [total, size, page] = [10, 5, 1]
    const onChange = jest.fn()
    mount(
      <Pagination total={total} size={size} page={page} onChange={onChange} />
    )
  })
})
