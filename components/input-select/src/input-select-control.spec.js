import React from 'react'
import { shallow } from 'enzyme'
import InputSelectControl from './input-select-control'

describe('InputSelect', () => {
  describe('Control', () => {
    const options = ['foo', 'bar', 'baz'].map((value) => ({ value }))
    const renderPlaceholder = () => <div data-test-id="placeholder" />

    it('should render placeholder', () => {
      const wrapper = shallow(
        <InputSelectControl
          onOptionsChange={jest.fn()}
          labelKey="value"
          options={options}
          renderPlaceholder={renderPlaceholder}
        />
      )

      expect(wrapper.find('[data-test-id="placeholder"]')).toHaveLength(1)
    })

    it('should forward props to input element', () => {
      const wrapper = shallow(
        <InputSelectControl
          onOptionsChange={jest.fn()}
          labelKey="value"
          options={options}
          data-test-id="InputTarget"
          renderPlaceholder={renderPlaceholder}
          searchable
        />
      )

      expect(wrapper.find('[data-test-id="InputTarget"]')).toHaveLength(1)
    })

    it('should clear value', () => {
      const handleChange = jest.fn()
      const wrapper = shallow(
        <InputSelectControl
          value="foo"
          onChange={handleChange}
          onOptionsChange={jest.fn()}
          valueKey="value"
          labelKey="value"
          options={options}
          renderPlaceholder={renderPlaceholder}
          resettable
        />
      )

      wrapper
        .find('[data-test-id="reset"]')
        .simulate('click', { stopPropagation() {} })

      expect(handleChange).toHaveBeenCalledWith(null)
    })

    it('should surface search terms', () => {
      const handleSearch = jest.fn()
      const wrapper = shallow(
        <InputSelectControl
          labelKey="value"
          options={options}
          onSearch={handleSearch}
          onOptionsChange={jest.fn()}
          renderPlaceholder={renderPlaceholder}
          searchableKeys={[]}
          searchable
        />
      )

      wrapper
        .find('input[role="combobox"]')
        .simulate('change', { target: { value: 'f' } })
      expect(handleSearch).toHaveBeenCalledWith('f')
    })

    it('should filter options on search', () => {
      const handleOptionsChange = jest.fn()
      const wrapper = shallow(
        <InputSelectControl
          labelKey="value"
          options={options}
          onOptionsChange={handleOptionsChange}
          renderPlaceholder={renderPlaceholder}
          searchableKeys={[]}
          searchable
        />
      )

      expect(handleOptionsChange).toHaveBeenCalledWith(options)
      wrapper
        .find('input[role="combobox"]')
        .simulate('change', { target: { value: 'f' } })
      expect(handleOptionsChange).toHaveBeenCalledWith([{ value: 'foo' }])
    })
  })
})
