import React from 'react'
import { shallow } from 'enzyme'

import InputSelect from './input-select'

describe('InputSelect', () => {
  const options = ['foo', 'bar', 'baz'].map((value) => ({
    value,
    label: value,
  }))

  it('renders', () => {
    expect(() =>
      shallow(<InputSelect value={null} options={[]} onChange={() => null} />)
    ).not.toConsoleError()
  })

  it('renders options', () => {
    const wrapper = shallow(
      <InputSelect value={null} options={options} onChange={() => null} />
    )

    expect(wrapper.find('[data-test-id="selector"]').prop('items')).toEqual(
      options
    )
  })

  it('renders multiple selected values', () => {
    const wrapper = shallow(
      <InputSelect
        value={['foo', 'bar']}
        options={options}
        onChange={() => null}
        multiple
      />
    )

    expect(
      wrapper
        .find('[data-test-id="dropdown"]')
        .dive()
        .find('[data-test-id="control"]')
        .dive()
        .find('[data-test-id="value"]')
        .prop('value')
    ).toEqual(['foo', 'bar'])
  })

  it('renders clear button', () => {
    const wrapper = shallow(
      <InputSelect value={1} options={options} onChange={() => null} />
    )

    expect(
      wrapper
        .find('[data-test-id="dropdown"]')
        .dive()
        .find('[data-test-id="control"]')
        .dive()
        .find('[data-test-id="reset"]')
    ).toBeTag('[role="button"]')
  })

  it('does not renders clear button for required', () => {
    const wrapper = shallow(
      <InputSelect value={1} options={options} onChange={() => null} required />
    )

    expect(
      wrapper
        .find('[data-test-id="dropdown"]')
        .dive()
        .find('[data-test-id="control"]')
        .dive()
        .find('[data-test-id="reset"]')
    ).toHaveLength(0)
  })

  it('does not renders clear button for disabled', () => {
    const wrapper = shallow(
      <InputSelect value={1} options={options} onChange={() => null} disabled />
    )

    expect(
      wrapper
        .find('[data-test-id="dropdown"]')
        .dive()
        .find('[data-test-id="control"]')
        .dive()
        .find('[data-test-id="clear"]')
    ).toHaveLength(0)
  })

  it('renders loading state', () => {
    const wrapper = shallow(
      <InputSelect value={1} options={options} onChange={() => null} />
    )

    expect(
      wrapper
        .find('[data-test-id="dropdown"]')
        .dive()
        .find('[data-test-id="control"]')
        .dive()
        .find('[data-test-id="loading"]')
    ).toHaveLength(0)

    wrapper.setProps({ isLoading: true })

    expect(
      wrapper
        .find('[data-test-id="dropdown"]')
        .dive()
        .find('[data-test-id="control"]')
        .dive()
        .find('[data-test-id="loading"]')
    ).toHaveLength(1)
  })

  describe('behaviour', () => {
    it('calls `onChange` prop if option is selected', () => {
      const fn = jest.fn((value) => wrapper.setProps({ value }))
      const wrapper = mount(
        <InputSelect value={'foo'} options={options} onChange={fn} />
      )

      wrapper.setState({ isOpen: true })
      wrapper.find('[data-id="bar"]').simulate('click')

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenLastCalledWith('bar')
    })
  })
})
