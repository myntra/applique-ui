import React from 'react'
import { shallow, mount } from 'enzyme'
import Field from './field'
import InputText from '@myntra/uikit-component-input-text'

let wrapper
beforeEach(() => {
  wrapper = mount(
    <Field title="Name" description="Enter your full name.">
      <InputText value="" onChange={() => null} id="name" />
    </Field>
  )
})

afterEach(() => {
  wrapper.unmount()
})

describe('Field', () => {
  it('renders field with title and description', () => {
    expect(wrapper.text()).toEqual(expect.stringContaining('Name'))
    expect(wrapper.text()).toEqual(
      expect.stringContaining('Enter your full name.')
    )
    expect(wrapper.find(InputText)).toHaveLength(1)
  })
  it('should render with a for attr in label', () => {
    wrapper.setProps({ htmlFor: 'name' })
    expect(wrapper.find('label').prop('htmlFor')).toEqual('name')
  })
  it('should render as a required field', () => {
    wrapper.setProps({ required: true })
    expect(wrapper.find('span.required')).toHaveLength(1)
  })
  it('should render with error param', () => {
    wrapper.setProps({ error: 'Name should contain characters from a-Z|A-Z' })
    expect(wrapper.find('[role="alert"]').text()).toEqual(
      'Name should contain characters from a-Z|A-Z'
    )
  })
  it('should render no meta element', () => {
    wrapper = shallow(
      <Field>
        <InputText value="" onChange={() => null} id="name" />
      </Field>
    )
    expect(wrapper.find('.meta')).toHaveLength(0)
  })
})
