import React from 'react'
import { shallow } from 'enzyme'

import Tooltip from './index'

describe('tooltip', () => {
  it('is a component', () => {
    expect(Tooltip).toBeComponent()
  })
  it('should render the  component', () => {
    const wrapper = shallow(
      <Tooltip renderContent={() => <div>Hello</div>}>
        <p>hover over me!</p>
      </Tooltip>
    )
    const render = jest.spyOn(wrapper.instance(), 'render')
    wrapper.update()
    wrapper.instance().forceUpdate()
    expect(render).toHaveBeenCalled()
  })
})
