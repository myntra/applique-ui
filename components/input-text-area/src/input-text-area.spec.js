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

    expect(wrapper.childAt(0).is('textarea')).toBe(true)
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
    console.log(wrapper.debug())
    expect(wrapper.hasClass('noResize')).toBe(true)
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
describe('Error', () => {
  it('should have error class corrosponding to error prop ', () => {
    const wrapper = mount(<InputTextArea error="error" />)
    expect(wrapper.find('.error')).toHaveLength(1)

    wrapper.setProps({ error: false })
    wrapper.update()
    expect(wrapper.find('.error')).toHaveLength(0)
  })
})
describe('Variants Check', () => {
  it('should have bordered, standard classes corrosponding to variant passed', () => {
    const wrapper = mount(<InputTextArea />)
    expect(wrapper.find('.bordered')).toHaveLength(1)

    wrapper.setProps({ variant: 'standard' })
    wrapper.update()
    expect(wrapper.find('.standard')).toHaveLength(1)
  })
})
describe('Filled  Check', () => {
  it('should have filled class when there is value present, only string values supported', () => {
    const wrapper = mount(<InputTextArea value="test" />)
    expect(wrapper.find('.filled')).toHaveLength(1)
    wrapper.setProps({ value: '' })
    wrapper.update()

    expect(wrapper.find('.filled')).toHaveLength(0)

    wrapper.setProps({ value: false })
    wrapper.update()
    expect(wrapper.find('.filled')).toHaveLength(0)

    wrapper.setProps({ value: 1 })
    wrapper.update()
    expect(wrapper.find('.filled')).toHaveLength(0)
  })
})
