import React from 'react'
import { mount } from 'enzyme'
import Pagination from './index'

describe('Pagination', () => {
  it('displays selected page range', () => {
    const wrapper = mount(
      <Pagination onChange={jest.fn()} page={1} size={15} total={100} />
    )

    expect(wrapper.text()).toEqual(expect.stringContaining('1 to 15 of 100'))
  })

  it('triggers change event on previous page', () => {
    const handleChange = jest.fn()
    const wrapper = mount(
      <Pagination onChange={handleChange} page={2} size={15} total={100} />
    )

    wrapper
      .find('.arrow-container')
      .at(0)
      .simulate('click')

    expect(handleChange).toHaveBeenCalledWith({ page: 1, size: 15 })
  })

  it('triggers change event on next page', () => {
    const handleChange = jest.fn()
    const wrapper = mount(
      <Pagination onChange={handleChange} page={1} size={15} total={100} />
    )

    wrapper
      .find('.arrow-container')
      .at(1)
      .simulate('click')

    expect(handleChange).toHaveBeenCalledWith({ page: 2, size: 15 })
  })

  it('does not trigger change event on previous page from first page', () => {
    const handleChange = jest.fn()
    const wrapper = mount(
      <Pagination onChange={handleChange} page={1} size={15} total={100} />
    )

    wrapper
      .find('.arrow-container')
      .at(0)
      .simulate('click')

    expect(handleChange).not.toHaveBeenCalled()
  })

  it('does not trigger change event on next page from last page', () => {
    const handleChange = jest.fn()
    const wrapper = mount(
      <Pagination onChange={handleChange} page={7} size={15} total={100} />
    )

    wrapper
      .find('.arrow-container')
      .at(1)
      .simulate('click')

    expect(handleChange).not.toHaveBeenCalled()
  })

  it('triggers change event on page selection', () => {
    const handleChange = jest.fn()
    const wrapper = mount(
      <Pagination onChange={handleChange} page={1} size={15} total={100} />
    )

    wrapper.find('.select-page').simulate('change', { target: { value: '3' } })

    expect(handleChange).toHaveBeenCalledWith({ page: 3, size: 15 })
  })

  it('triggers change event on page size selection', () => {
    const handleChange = jest.fn()
    const wrapper = mount(
      <Pagination onChange={handleChange} page={3} size={15} total={100} />
    )

    wrapper
      .find('.page-size > select')
      .simulate('change', { target: { value: '10' } })

    expect(handleChange).toHaveBeenCalledWith({ page: 1, size: 10 })
  })
})
