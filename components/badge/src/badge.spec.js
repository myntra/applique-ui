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

  describe('behaviour', () => {
    it('calls `onClose` prop if close button is clicked', () => {
      const handleClose = jest.fn()
      const wrapper = shallow(
        <Badge onClose={handleClose}>Dismissable badge</Badge>
      )

      wrapper.find('[data-test-id="close"]').simulate('click')

      expect(handleClose).toHaveBeenCalled()
    })
  })
})
