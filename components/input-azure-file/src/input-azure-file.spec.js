import React from 'react'
import { mount } from 'enzyme'

import InputAzureFile from './input-azure-file'
import InputText from '@myntra/uikit-component-input-text'

describe('InputAzureFile', () => {
  it('is a component', () => {
    expect(InputAzureFile).toBeComponent()
  })

  it('should render the component', () => {
    const wrapper = mount(<InputAzureFile />)
    expect(wrapper.find(InputText)).toHaveLength(1)
    expect(wrapper.find('[data-test-id="target"]')).toHaveLength(1)
  })

  it('should validate the file before upload', () => {
    const fileValidation = jest.fn()
    const wrapper = mount(<InputAzureFile autoStartUpload={true} validations={fileValidation} />)

    const expectedFileList = Object.create(Array.prototype)
    expectedFileList.push('dummyValue.something')
    expectedFileList.item = function(idx) {
      return this[idx]
    }

    wrapper
      .find('input[type="file"]')
      .at(0)
      .simulate('change', { target: { files: expectedFileList } })

    expect(fileValidation).toBeCalledWith(expectedFileList)
  })
})
