import React from 'react'
import { shallow } from 'enzyme'

import Tabs from './index'

describe('tabs', () => {
  it('is a component', () => {
    expect(Tabs).toBeComponent()
  })
  it('should render the  component', () => {
    const wrapper = shallow(
      <Tabs>
        <Tabs.Tab title="Home">{'This is the home page.'}</Tabs.Tab>

        <Tabs.Tab title="About">{'This is the about page.'}</Tabs.Tab>
      </Tabs>
    )
    const render = jest.spyOn(wrapper.instance(), 'render')
    wrapper.update()
    wrapper.instance().forceUpdate()
    expect(render).toHaveBeenCalled()
  })
})
