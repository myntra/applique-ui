import React from 'react'
import InputText from './input-text'

it('renders a placeholder <input> by default', () => {
  expect(
    mountShallow(<InputText placeholder="Type" />)
      .find('input')
      .at(0)
      .prop('placeholder')
  ).toBe('Type')
})

it('should call onChange handler on text enter', () => {
  const handler = jest.fn()
  const wrapper = mountShallow(<InputText onChange={handler} />)

  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 'foo' } })
  expect(handler).toHaveBeenCalled()
})

describe('classes', () => {
  it('should render with custom class name', () => {
    expect(
      mountShallow(<InputText className="c-name" />)
        .find('div')
        .at(0)
        .props().className
    ).toEqual(expect.stringContaining('c-name'))
  })
})

it('focuses the element on mount', () => {
  const wrapper = mount(<InputText autoFocus id="test" />)
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
      mountShallow(<InputText disabled />)
        .find('input')
        .at(0)
        .props().disabled
    ).toBe(true)

    expect(
      mountShallow(<InputText disabled={false} />)
        .find('input')
        .at(0)
        .props().disabled
    ).toBe(false)
  })
})
