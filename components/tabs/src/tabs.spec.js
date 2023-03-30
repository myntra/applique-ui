import React from 'react'
import { render } from 'enzyme'

import Tabs from './index'

describe('tabs', () => {
  it('is a component', () => {
    expect(Tabs).toBeComponent()
  })
  it('should render the  component', () => {
    const wrapper = render(
      <Tabs>
        <Tabs.Tab className="home" title="Home">
          {'This is the home page.'}
        </Tabs.Tab>

        <Tabs.Tab title="About">{'This is the about page.'}</Tabs.Tab>
      </Tabs>
    )
    expect(wrapper.find('.home').text()).toBe('Home')
  })
})
