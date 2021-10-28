import React from 'react'
import { shallow } from 'enzyme'
import NavBar from './index'

/*
NavBar specification

1. Displays links (using NavBarGroup).
2. Provides NavBar context.
  1. setActiveGroup sets active group.
  2. isActiveGroup checks if current group is active.
  3. isActivePath checks if current item is active.

 */

describe('NavBar', () => {
  it('should renders NavBarGroup', () => {
    const wrapper = shallow(
      <NavBar title="Test Title">
        <li data-test-id="item">Foo</li>
      </NavBar>
    )

    expect(wrapper.find('NavBarGroup')).toHaveLength(1)
  })
})
