import React from 'react'
import { shallow } from 'enzyme'

import InputSelectValue from './input-select-value'

describe('InputSelect', () => {
  describe('Value', () => {
    const options = ['foo', 'bar', 'baz'].map((value) => ({ value }))

    it('should render input', () => {
      const wrapper = shallow(
        <InputSelectValue
          value="foo"
          valueKey="value"
          labelKey="value"
          options={options}
        />
      )

      expect(wrapper.find('input').props().value).toBe('foo')
    })

    it('should be disabled if disabled props is passed', () => {
      const wrapper = shallow(
        <InputSelectValue
          value="foo"
          valueKey="value"
          labelKey="value"
          options={options}
        />
      )

      wrapper.setProps({ disabled: true })

      expect(wrapper.find('input').props().disabled).toBeTruthy()
    })

    it('should display value + more on more than 1 option', () => {
      const wrapper = shallow(
        <InputSelectValue
          value={['foo', 'bar']}
          valueKey="value"
          labelKey="value"
          options={options}
        />
      )

      expect(wrapper.find('input').props().value).toBe('foo, bar')

      wrapper.setProps({ value: ['foo', 'bar', 'baz'] })
      expect(wrapper.find('input').props().value).toBe('foo, + 2 more')
    })
  })
})
