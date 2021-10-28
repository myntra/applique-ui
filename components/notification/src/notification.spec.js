import React from 'react'
import { mount } from 'enzyme'

import Notification from './index'
import Button from '@myntra/uikit-component-button'

let wrapper
beforeEach(() => {
  wrapper = mount(
    <Notification
      closeOnClickAway={false}
      trigger="Notification"
      title="Example Notification"
    >
      <p>{'A simple Notification window'}</p>

      <p>{'You can render anything here!!'}</p>
    </Notification>
  )
})
afterEach(() => {
  wrapper.unmount()
})
describe('notification', () => {
  it('is a component', () => {
    expect(Notification).toBeComponent()
  })
  it('should render the component', () => {
    expect(wrapper.find(Button)).toHaveLength(1)
  })
  it('should open/close the notification', () => {
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
})
