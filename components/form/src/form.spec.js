import React from 'react'
import { mount } from 'enzyme'
import Button from '@myntra/uikit-component-button'
import Field from '@myntra/uikit-component-field'

import Form from './form'

describe('form', () => {
  it('is a component', () => {
    expect(Form).toBeComponent()
  })

  it('should render the component', () => {
    const onSubmit = jest.fn()
    const setValue = jest.fn()
    const wrapper = mount(
      <Form title="Search Handover" onSubmit={onSubmit} onChange={setValue}>
        <Form.Text label="Article Type" />
        <Form.Text label="Master Category" />
        <Button type="text">Reset All</Button>
      </Form>
    )
    expect(wrapper.find('form')).toHaveLength(1)
    expect(wrapper.find('div.title').text()).toEqual('Search Handover')
    expect(wrapper.find(Field)).toHaveLength(2)
  })
})
