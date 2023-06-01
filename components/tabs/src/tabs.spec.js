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
  it('without passing any props to Tabs', () => {
    // first non-disabled tab should be selected and tabs click would be working properly
  })

  it('passing defaultIndex props to Tabs', () => {
    // defaultIndex should be selected and tabs click would be working properly
  })

  it('passing defaultIndex props to Tabs and make that tab disable', () => {
    // first non-disabled tab should be selected and tabs click would be working properly
  })

  it('passing activeIndex props to Tabs', () => {
    // a warning should be visible stating that onChange props is required if you are using activeIndex
  })

  it('passing onChange props to Tabs', () => {
    // onChange would get back the clicked tab's index
  })

  it('passing activeIndex and onChange props to Tabs', () => {
    // tabs selection would be handled from the activeIndex
  })

  it('passing activeIndex and defaultIndex values as different in the props', () => {
    // tabs selection would be handled from the activeIndex
  })
})
