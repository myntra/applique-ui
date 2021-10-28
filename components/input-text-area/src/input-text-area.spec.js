import React from 'react'
import { shallow } from 'enzyme'
import InputTextArea from './input-text-area'

describe('Should render textarea tag', () => {
  let value = ''
  const handleChange = jest.fn()
  it('should render textarea tag', () => {
    const wrapper = shallow(
      <InputTextArea onChange={handleChange} value={value} />
    )
    expect(wrapper.find('div').children()).toHaveLength(1)

    expect(
      wrapper
        .find('div')
        .childAt(0)
        .is('textarea')
    ).toBe(true)
  })
})

describe('Props check', () => {
  let value = 'Hello'
  const handleChange = jest.fn()
  it('should have basic properties passed as props', () => {
    const wrapper = shallow(
      <InputTextArea onChange={handleChange} value={value} />
    )
    expect(wrapper.find('div').children()).toHaveLength(1)

    expect(wrapper.find('textarea').props()).toHaveProperty('value', 'Hello')
    wrapper.setProps({ disabled: true })
    expect(wrapper.find('textarea').props()).toHaveProperty('disabled', true)
    wrapper.setProps({ placeholder: 'Hello' })
    expect(wrapper.find('textarea').props()).toHaveProperty(
      'placeholder',
      'Hello'
    )
  })
  it('should have rows="1" by default', () => {
    const wrapper = shallow(
      <InputTextArea onChange={handleChange} value={value} />
    )
    expect(wrapper.find('textarea').props()).toHaveProperty('rows', 1)
  })
  it('should have classes as defined by props', () => {
    const wrapper = shallow(
      <InputTextArea onChange={handleChange} value={value} disabled noResize />
    )
    expect(wrapper.find('textarea').hasClass('no-resize')).toBe(true)
    expect(
      wrapper
        .find('.input')
        .at(0)
        .is('[disabled]')
    ).toBe(true)
  })
})

describe('On Change handler', () => {
  let value = 'Hello'
  const handleChange = jest.fn()
  it('should call onChange handler on input change', () => {
    const wrapper = shallow(
      <InputTextArea onChange={handleChange} value={value} />
    )
    wrapper
      .find('textarea')
      .simulate('change', { target: { value: 'Value Changed' } })
    expect(handleChange).toHaveBeenLastCalledWith('Value Changed')
  })
})
