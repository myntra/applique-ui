import React from 'react'
import { mount } from 'enzyme'

import InputDate from './input-date'
import moment from 'moment' // eslint-disable-line node/no-extraneous-import

import InputDateValue from './input-date-value'

describe('input-date', () => {
  it('is a component', () => {
    expect(InputDate).toBeComponent()
  })

  it('should render the component', () => {
    const onChange = jest.fn()
    const wrapper = mount(<InputDate value={new Date()} onChange={onChange} />)
    expect(wrapper.find(InputDateValue).props().value).toEqual(
      moment().format('YYYY-MM-DD')
    )
  })

  it('displays the value in the input', () => {
    const expectedDate = moment().format('YYYY-MM-DD')
    const onChange = jest.fn()
    const wrapper = mount(<InputDate value={new Date()} onChange={onChange} />)
    expect(wrapper.find(InputDateValue).props().value).toBe(expectedDate)
  })

  it('renders InputDatePicker without includeTime prop', () => {
    const onChange = jest.fn()
    const wrapper = mount(<InputDate onChange={onChange} includeTime={true} />)
    expect(wrapper.find(InputDate).props().includeTime).toBe(true)
  })

  it('returns correct display active range end', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <InputDate
        value={{ from: new Date(), to: new Date() }}
        range
        onChange={onChange}
      />
    )
    wrapper.instance().handleDropdownOpen()
    wrapper.setState({ activeRangeEnd: 'to' })
    expect(wrapper.instance().displayActiveRangeEnd).toBe('to')
  })

  it('handles display value change correctly', () => {
    const onChange = jest.fn()
    const wrapper = mount(<InputDate onChange={onChange} />)
    const newValue = new Date()
    wrapper.instance().handleDisplayValueChange(newValue)
    expect(onChange).toHaveBeenCalledWith(newValue)
  })

  it('handles change correctly', () => {
    const onChange = jest.fn()
    const wrapper = mount(<InputDate onChange={onChange} includeTime />)
    const newValue = new Date()
    wrapper.instance().handleChange(newValue)
    expect(onChange).toHaveBeenCalledWith(newValue)
  })

  it('handles open-to-date change correctly', () => {
    const wrapper = mount(<InputDate />)
    const openToDate = new Date()
    wrapper.instance().handleOpenToDateChange(openToDate)
    expect(wrapper.state('openToDate')).toBe(openToDate)
  })

  it('handles dropdown open correctly', () => {
    const wrapper = mount(<InputDate range />)
    wrapper.instance().handleDropdownOpen()
    expect(wrapper.state('isOpen')).toBe(true)
  })

  it('handles dropdown close correctly', () => {
    const wrapper = mount(<InputDate range />)
    wrapper.instance().handleDropdownClose()
    expect(wrapper.state('isOpen')).toBe(false)
  })

  it('handles range selection correctly', () => {
    const onChange = jest.fn()
    const wrapper = mount(<InputDate onChange={onChange} range />)
    const newValue = { from: new Date(2022, 0, 1), to: new Date(2022, 0, 5) }
    wrapper.instance().handleChange(newValue)
    expect(onChange).toHaveBeenCalledWith(newValue)
  })
})
