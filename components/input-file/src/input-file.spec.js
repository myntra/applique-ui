import React from 'react'
import { mount } from 'enzyme'

import InputFile from './input-file'
import InputText from '@myntra/uikit-component-input-text'
import Button from '@myntra/uikit-component-button'

describe('input-file', () => {
  it('is a component', () => {
    expect(InputFile).toBeComponent()
  })

  it('should render the component', () => {
    const wrapper = mount(<InputFile />)
    expect(wrapper.find('div.input-file')).toHaveLength(1)
    expect(wrapper.find(InputText)).toHaveLength(1)
    expect(wrapper.find(Button)).toHaveLength(1)
  })
  it('should call the onChange on uploading a file', () => {
    const handler = jest.fn()
    const wrapper = mount(<InputFile onChange={handler} />)
    wrapper
      .find('input')
      .at(1)
      .simulate('change', { target: { files: ['dummyValue.something'] } })
    expect(handler).toHaveBeenCalled()
  })
  it('should validate the file before change', () => {
    const fileValidation = jest.fn()
    const wrapper = mount(<InputFile validations={fileValidation} />)

    const expectedFileList = Object.create(Array.prototype)
    expectedFileList.push('dummyValue.something')
    expectedFileList.item = function(idx) {
      return this[idx]
    }

    wrapper
      .find('input[type="file"]')
      .at(0)
      .simulate('change', { target: { files: expectedFileList } })

    expect(fileValidation).toHaveBeenCalledWith(expectedFileList)
  })
  it('should run all validations on fileList before change if the validations prop is an array', () => {
    const [fileValidation1, fileValidation2] = [jest.fn(), jest.fn()]
    const wrapper = mount(
      <InputFile validations={[fileValidation1, fileValidation2]} />
    )

    const expectedFileList = Object.create(Array.prototype)
    expectedFileList.push('dummyValue.something')
    expectedFileList.item = function(idx) {
      return this[idx]
    }

    wrapper
      .find('input[type="file"]')
      .at(0)
      .simulate('change', { target: { files: expectedFileList } })

    expect(fileValidation1).toHaveBeenCalledWith(expectedFileList)
    expect(fileValidation2).toHaveBeenCalledWith(expectedFileList)
  })
  it('should not call onChange and should call onError when validation fails', () => {
    const fileValidationError = new Error('dummy.error')
    const fileValidation = jest.fn(() => {
      throw fileValidationError
    })
    const onChangeHandler = jest.fn()
    const onErrorHandler = jest.fn()
    const wrapper = mount(
      <InputFile
        validations={fileValidation}
        onChange={onChangeHandler}
        onError={onErrorHandler}
      />
    )

    const expectedFileList = Object.create(Array.prototype)
    expectedFileList.push('dummyValue.something')
    expectedFileList.item = function(idx) {
      return this[idx]
    }

    wrapper
      .find('input[type="file"]')
      .at(0)
      .simulate('change', { target: { files: expectedFileList } })

    expect(fileValidation).toHaveBeenCalledWith(expectedFileList)
    expect(fileValidation).toThrow(fileValidationError)
    expect(onChangeHandler).not.toHaveBeenCalled()
    expect(onErrorHandler).toHaveBeenCalledWith(fileValidationError)
  })
  it('Should render the actions as provided in props', () => {
    const getActions = () => {
      return (
        <>
          <Button>Browse</Button>
          <Button>Upload</Button>
        </>
      )
    }

    const wrapper = mount(<InputFile actions={getActions} />)
    expect(wrapper.find('Button')).toHaveLength(2)
  })

  it('Should show the progress bar with correct progress', () => {
    let progressPercentage = '18'
    const wrapper = mount(
      <InputFile
        validations={() => {}}
        onChange={() => {}}
        onError={() => {}}
        showProgress={true}
        progress={progressPercentage}
      />
    )
    console.log(wrapper.debug())
    expect(wrapper.find('Progress')).toHaveLength(1)
    expect(wrapper.find('Progress').props().value).toEqual(progressPercentage)
  })
})
