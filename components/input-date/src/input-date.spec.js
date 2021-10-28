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
})
