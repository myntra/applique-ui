import React from 'react'
import { mount } from 'enzyme'

import VirtualList from './virtual-list'
import VirtualListCellMeasure from './virtual-list-cell-measure'

describe('virtual-list', () => {
  it('is a component', () => {
    expect(VirtualList).toBeComponent()
  })
  it('should render the component with 12 rows', () => {
    const items = Array(5000)
      .fill(0)
      .map(() => ~~(50 * Math.random()))
    const wrapper = mount(
      <VirtualList
        itemCount={5000}
        viewportSize={250}
        style={{ height: '250px', minWidth: '200px' }}
      >
        {({ index, style }) => (
          <div
            style={{
              padding: `${10 + items[index]}px 24px`,
              backgroundColor: `hsl(${(index * 15) % 360}deg, 75%, 80%)`,
              ...style,
              left: 0,
              right: 0,
            }}
          >
            Hello {index + 1} ({items[index]})
          </div>
        )}
      </VirtualList>
    )
    expect(wrapper.find(VirtualListCellMeasure)).toHaveLength(12)
  })
})
