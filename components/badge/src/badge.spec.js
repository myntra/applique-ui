import React from 'react'
import { shallow } from 'enzyme'
import Badge from './index'

describe('Badge', () => {
  it('is a component', () => {
    expect(Badge).toBeComponent()
    expect(Badge).toBeTransparentComponent({ children: 'Text' })
  })

  it('renders contents', () => {
    const wrapper = shallow(<Badge>Foo</Badge>)

    expect(wrapper.text()).toBe('Foo')
  })
})
