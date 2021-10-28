import React from 'react'
import { mount } from 'enzyme'

import Modal from './index'
import Button from '@myntra/uikit-component-button'
import ModalLayout from './modal-layout'

let wrapper
beforeEach(() => {
  wrapper = mount(
    <Modal
      trigger="Open Modal"
      title="Example Modal"
      actions={(close) => <Button onClick={close}>Okay</Button>}
    >
      <p>{'A simple modal with a form.'}</p>

      <p>{'You can render anything here!!'}</p>
    </Modal>
  )
})
afterEach(() => {
  wrapper.unmount()
})
describe('modal', () => {
  it('is a component', () => {
    expect(Modal).toBeComponent()
  })
  it('should render the component', () => {
    expect(wrapper.find(Button)).toHaveLength(1)
  })
  it('should open/close the modal', () => {
    const handleOpen = jest.spyOn(wrapper.instance(), 'handleOpen')
    const handleClose = jest.spyOn(wrapper.instance(), 'handleClose')
    wrapper.update()
    wrapper.instance().forceUpdate()
    wrapper
      .find('button')
      .at(0)
      .simulate('click')
    expect(handleOpen).toHaveBeenCalled()
    wrapper
      .find('.close')
      .find('button')
      .at(0)
      .simulate('click')
    expect(handleClose).toHaveBeenCalled()
  })
  it('should render with modal open', () => {
    wrapper.setProps({ isOpen: true })
    expect(wrapper.find(ModalLayout)).toHaveLength(1)
  })
})
