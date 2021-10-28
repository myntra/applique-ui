import React from 'react'
import { mount } from 'enzyme'

import InputMonth from './index'
import Dropdown from '@myntra/uikit-component-dropdown'

describe('input-month', () => {
  const originalConsoleError = global.console.error
  beforeEach(() => {
    global.console.error = (...args) => {
      const propTypeFailures = [/Failed prop typs/, /Warning: Received/]
      if (propTypeFailures.some((e) => e.test(args[0]))) {
        throw new Error(args[0])
      }
      originalConsoleError(...args)
    }
  })

  it('is a component', () => {
    expect(InputMonth).toBeComponent()
  })
  it('should render the component', () => {
    const wrapper = mount(<InputMonth value={{ month: 2, year: 2019 }} />)
    expect(wrapper.find(Dropdown)).toHaveLength(1)
    expect(wrapper.state('valueAsString')).toEqual('Feb/2019')
  })
  it('should throw exception for wrong month value in input', () => {
    mount(<InputMonth value={{ month: 0, year: 2019 }} />)
  })
  it('should call the updateLocalValue with empty value prop', () => {
    const wrapper = mount(<InputMonth />)
    expect(wrapper.state('valueAsString')).toEqual('')
  })
  it('shoul call the function handleStringValueChange', () => {
    const wrapper = mount(<InputMonth value={{ month: 2, year: 2019 }} />)
    const spy = jest.spyOn(wrapper.instance(), 'handleStringValueChange')
    wrapper.update()
    wrapper.instance().forceUpdate()
    wrapper
      .find('input')
      .at(0)
      .simulate('keydown', { keyCode: 8 })
    expect(spy).toHaveBeenCalled()
  })
  it('should open/close the dropdown on click', () => {
    const wrapper = mount(<InputMonth value={{ month: 2, year: 2019 }} />)
    const handleDropdownOpen = jest.spyOn(
      wrapper.instance(),
      'handleDropdownOpen'
    )
    wrapper.update()
    wrapper.instance().forceUpdate()
    wrapper
      .find('input')
      .at(0)
      .simulate('click')
    expect(handleDropdownOpen).toHaveBeenCalled()
  })
})
