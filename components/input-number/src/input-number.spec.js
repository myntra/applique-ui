import React from 'react'
import { shallow, mount } from 'enzyme'
import InputNumber from './input-number'

it('renders a placeholder <input> by default', () => {
  expect(
    shallow(<InputNumber placeholder="Type" />)
      .find('input')
      .at(0)
      .prop('placeholder')
  ).toBe('Type')
})

it('should call onChange handler on number enter', () => {
  const handler = jest.fn()
  const wrapper = shallow(<InputNumber onChange={handler} />)

  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: '2.5' } })
  expect(handler).toHaveBeenCalledWith(2.5)
})

describe('classes', () => {
  it('should render with custom class name', () => {
    expect(
      shallow(<InputNumber className="c-name" />)
        .find('.c-name')
        .at(0)
        .props().className
    ).toBe('container c-name')
  })
})

it('focuses the element on mount', () => {
  const wrapper = mount(<InputNumber autoFocus id="test" />)
  expect(
    wrapper
      .find('input')
      .at(0)
      .props().id
  ).toBe(document.activeElement.id)
})

describe('disabled', () => {
  it('Check input element ', () => {
    expect(
      shallow(<InputNumber disabled />)
        .find('input')
        .at(0)
        .props().disabled
    ).toBe(true)

    expect(
      shallow(<InputNumber disabled={false} />)
        .find('input')
        .at(0)
        .props().disabled
    ).toBe(false)
  })
})

describe('Test input HTML5 properties', () => {
  it('Value should be 5 ', () => {
    expect(
      shallow(<InputNumber value={5} />)
        .find('input')
        .at(0)
        .props().value
    ).toBe(5)
  })
  it('Should not exceed max value', () => {
    expect(
      shallow(<InputNumber value={5} min={1} max={10} />)
        .find('input')
        .at(0)
        .props().value
    ).toBe(5)
  })
})
