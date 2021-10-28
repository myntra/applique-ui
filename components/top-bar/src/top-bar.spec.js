import React from 'react'
import { shallow } from 'enzyme'

import TopBar from './index'
import BreadCrumb from '@myntra/uikit-component-bread-crumb'
import UserSolid from 'uikit-icons/svgs/UserSolid'
import SignOutAltSolid from 'uikit-icons/svgs/SignOutAltSolid'

describe('top-bar', () => {
  it('is a component', () => {
    expect(TopBar).toBeComponent()
  })
  it('should render the component', () => {
    const wrapper = shallow(
      <TopBar title="UIKit Documentation" user={{ name: 'Jane' }}>
        <BreadCrumb>
          <BreadCrumb.Item>Home</BreadCrumb.Item>
          <BreadCrumb.Item>Components</BreadCrumb.Item>
          <BreadCrumb.Item>TopBar</BreadCrumb.Item>
        </BreadCrumb>

        <TopBar.Item icon={UserSolid}>Profile</TopBar.Item>
        <TopBar.Item icon={SignOutAltSolid}>Logout</TopBar.Item>
      </TopBar>
    )
    const render = jest.spyOn(wrapper.instance(), 'render')
    wrapper.update()
    wrapper.instance().forceUpdate()
    expect(render).toHaveBeenCalled()
  })
})
