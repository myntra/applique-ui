import React from 'react'
import { mount } from 'enzyme'

import InputRadio from './input-radio'

const options = [
  { title: 'PASS', value: 'ok' },
  { title: 'RETRY', value: 'error' },
]
describe('InputRadio', () => {
  it('is a component', () => {
    expect(InputRadio).toBeComponent()
  })

  it('should render the component', () => {
    const wrapper = mount(<InputRadio options={options} />)
    expect(wrapper.find('[data-test-id="group"]')).toHaveLength(1)
    expect(wrapper.find('[type="radio"]')).toHaveLength(2)
  })
})
