import React from 'react'
import { mount } from 'enzyme'
import InputNumber from './input-number'

it('renders a placeholder <input> by default', () => {
  expect(
    mount(<InputNumber placeholder="Type" />)
      .find('input')
      .at(0)
      .prop('placeholder')
  ).toBe('Type')
})

it('should call onChange handler on number enter', () => {
  const handler = jest.fn()
  const wrapper = mount(<InputNumber onChange={handler} />)

  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: '2.5' } })
  expect(handler).toHaveBeenCalledWith(2.5)
})

describe('classes', () => {
  it('should render with custom class name', () => {
    expect(
      mount(<InputNumber className="c-name" />).find('.c-name')
    ).toHaveLength(1)
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
      mount(<InputNumber disabled />)
        .find('input')
        .at(0)
        .props().disabled
    ).toBe(true)

    expect(
      mount(<InputNumber disabled={false} />)
        .find('input')
        .at(0)
        .props().disabled
    ).toBe(false)
  })
})

describe('Test input HTML5 properties', () => {
  it('Value should be 5 ', () => {
    expect(
      mount(<InputNumber value={5} />)
        .find('input')
        .at(0)
        .prop('value')
    ).toBe(5)
  })
  it('Should not exceed max value', () => {
    expect(
      mount(<InputNumber value={5} min={1} max={10} />)
        .find('input')
        .at(0)
        .prop('value')
    ).toBe(5)
  })
})
