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
    expect(wrapper.find('textarea').props()).toHaveProperty('rows', 3)
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
    const inputwrapper = mountShallow(<InputTextArea error />)
    expect(inputwrapper.hasClass('error')).toBe(true)

    inputwrapper.setProps({ error: false })
    inputwrapper.update()
    expect(inputwrapper.hasClass('error')).toBe(false)
  })
})
describe('Variants Check', () => {
  it('should have bordered, standard classes corrosponding to variant passed', () => {
    const inputwrapper = mountShallow(<InputTextArea />)
    expect(inputwrapper.hasClass('bordered')).toBe(true)

    inputwrapper.setProps({ variant: 'standard' })
    inputwrapper.update()
    expect(inputwrapper.hasClass('standard')).toBe(true)
  })
})
describe('Filled  Check', () => {
  it('should have filled class when there is value present, only string values supported', () => {
    const inputwrapper = mountShallow(<InputTextArea value="test" />)
    expect(inputwrapper.hasClass('filled')).toBe(true)
    inputwrapper.setProps({ value: '' })
    inputwrapper.update()

    expect(inputwrapper.hasClass('filled')).toBe(false)

    inputwrapper.setProps({ value: false })
    inputwrapper.update()
    expect(inputwrapper.hasClass('filled')).toBe(false)

    inputwrapper.setProps({ value: 1 })
    inputwrapper.update()
    expect(inputwrapper.hasClass('filled')).toBe(false)
  })
})
