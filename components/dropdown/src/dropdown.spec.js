import React from 'react'
import { shallow, mount } from 'enzyme'
import Dropdown from './dropdown'

describe('Dropdown', () => {
  const element = (
    <Dropdown auto={true} container={true} trigger="Open" isOpen={false}>
      <div
        style={{
          padding: '100px',
          background: 'white',
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, .34)',
        }}
      >
        Anything here!
        <p>Yes. Anything!</p>
      </div>
    </Dropdown>
  )
  it('is a component', () => {
    expect(Dropdown).toBeComponent()
  })

  it('toggles open/closed when clicked', () => {
    const wrapper = shallow(element)
    expect(wrapper.find('div.dropdown')).toHaveLength(1)
    expect(wrapper.find('div.open')).toHaveLength(0)
    wrapper.setProps({ isOpen: true })
    expect(wrapper.find('div.open')).toHaveLength(1)
    wrapper.setProps({ isOpen: false })
    expect(wrapper.find('div.open')).toHaveLength(0)
  })

  it('renders trigger with trigger params as a string value', () => {
    const wrapper = mount(element)
    expect(wrapper.props().trigger).toEqual('Open')
    expect(wrapper.find('button').text()).toEqual('Open')
  })

  it.skip('closes dropdown content if clicked outside', () => {
    // const TestComponent = ({}) => <div id="outer">{element}</div>
  })
  it('should work with all position params[up, down, left, right]', () => {
    const wrapper = shallow(element)
    wrapper.setProps({ auto: false, up: true })
    expect(wrapper.find('div.dropdown')).toHaveLength(1)
    wrapper.setProps({ auto: false, up: false, down: true })
    expect(wrapper.find('div.dropdown')).toHaveLength(1)
    wrapper.setProps({ auto: false, up: false, down: false, left: true })
    expect(wrapper.find('div.dropdown')).toHaveLength(1)
    wrapper.setProps({
      auto: false,
      up: false,
      down: false,
      left: false,
      right: true,
    })
    expect(wrapper.find('div.dropdown')).toHaveLength(1)
  })
})
