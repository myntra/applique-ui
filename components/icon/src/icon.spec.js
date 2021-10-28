import React from 'react'
import { shallow } from 'enzyme'
import Icon from './icon'
import Bell from 'uikit-icons/svgs/Bell'

it('should render title with SVG icon', () => {
  const wrapper = shallow(<Icon name={Bell} title="This is dangerous!" />)

  expect(wrapper.find('title').text()).toBe('This is dangerous!')
})
