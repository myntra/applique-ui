import React from 'react'
import { shallow } from 'enzyme'

import VirtualGrid from './virtual-grid'

describe('virtual-grid', () => {
  it('is a component', () => {
    expect(VirtualGrid).toBeComponent()
  })
  it('should render the component', () => {
    // on initial render it
    const wrapper = shallow(
      <VirtualGrid
        rows={100}
        columns={100}
        width={Math.min(600, window.innerWidth)}
        height={360}
      >
        {({ style, rowIndex, columnIndex }) => (
          <div
            style={{
              ...style,
              width: '300px',
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `hsl(${(30 * rowIndex) % 361}, ${40 +
                ((5 * columnIndex) % 61)}%, 80%)`,
            }}
          >
            {rowIndex}, {columnIndex}
          </div>
        )}
      </VirtualGrid>
    )
    const render = jest.spyOn(wrapper.instance(), 'render')
    wrapper.update()
    wrapper.instance().forceUpdate()
    expect(render).toHaveBeenCalled()
  })
})
