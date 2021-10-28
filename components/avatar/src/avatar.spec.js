import React from 'react'
import { shallow } from 'enzyme'
import Avatar from './index'

describe('Avatar', () => {
  it('is a component', () => {
    expect(Avatar).toBeComponent()
    expect(Avatar).toBeTransparentComponent({ name: 'Jane Doe' })
  })

  it('renders avatar', () => {
    const wrapper = shallow(<Avatar name="Jane Doe" />)

    expect(wrapper.find('[data-test-id="initials"]').text()).toBe('JD')
  })
})
