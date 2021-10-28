import React from 'react'
import { mount } from 'enzyme'

import InputS3File from './input-s3-file'
import InputText from '@myntra/uikit-component-input-text'

describe('InputS3File', () => {
  it('is a component', () => {
    expect(InputS3File).toBeComponent()
  })

  it('should render the component', () => {
    const wrapper = mount(<InputS3File />)
    expect(wrapper.find(InputText)).toHaveLength(1)
    expect(wrapper.find('[data-test-id="target"]')).toHaveLength(1)
  })
})
