import React from 'react'
import NavBarItem from './nav-bar-item'
import { shallow } from 'enzyme'
import BoxSolid from 'uikit-icons/svgs/BoxSolid'

/*

NavBarItem specification:

  1. Renders <li> element with any content.
    1. With given Icon
    2. With custom Icon
  2. Triggers onActivation prop on click or space/enter press

*/
describe('NavBar', () => {
  describe('NavBar.Item', () => {
    it.skip('should render given content in <li> element', () => {
      const wrapper = shallow(
        <NavBarItem>
          <span data-test-id="child">Test Content</span>
        </NavBarItem>
      )

      expect(wrapper.is('li')).toBe(true)
      expect(wrapper.find('[data-test-id="child"]')).toHaveLength(1)
      expect(wrapper.find('[data-test-id="child"]').text()).toBe('Test Content')
    })

    it.skip('should render icon by name', () => {
      const wrapper = shallow(
        <NavBarItem icon={BoxSolid}>
          <span data-test-id="child">Test Content</span>
        </NavBarItem>
      )

      expect(wrapper.find('Icon')).toHaveLength(1)
      expect(wrapper.find('Icon').prop('name')).toBe('box')
      expect(wrapper.find('[data-test-id="child"]')).toHaveLength(1)
      expect(wrapper.find('[data-test-id="child"]').text()).toBe('Test Content')
    })

    it.skip('should render custom icon', () => {
      const wrapper = shallow(
        <NavBarItem renderIcon={() => <span data-test-id="icon" />}>
          <span data-test-id="child">Test Content</span>
        </NavBarItem>
      )

      expect(wrapper.find('[data-test-id="icon"]')).toHaveLength(1)
      expect(wrapper.find('[data-test-id="child"]')).toHaveLength(1)
      expect(wrapper.find('[data-test-id="child"]').text()).toBe('Test Content')
    })

    it.skip('should call onActivation handler on click or space/enter press', () => {
      const fn = jest.fn()
      const preventDefault = jest.fn()
      const stopPropagation = jest.fn()

      function reset() {
        fn.mockReset()
        preventDefault.mockReset()
        stopPropagation.mockReset()
      }

      const wrapper = shallow(
        <NavBarItem onActivation={fn}>
          <span data-test-id="child">Test Content</span>
        </NavBarItem>
      )

      wrapper.simulate('click')
      expect(fn).toHaveBeenCalled()

      reset()
      wrapper.simulate('keydown', {
        key: ' ',
        preventDefault,
        stopPropagation,
      })
      expect(fn).toHaveBeenCalled()
      expect(preventDefault).toHaveBeenCalled()

      reset()
      wrapper.simulate('keydown', {
        key: 'Enter',
        preventDefault,
        stopPropagation,
      })
      expect(fn).toHaveBeenCalled()
      expect(preventDefault).toHaveBeenCalled()

      reset()
      wrapper.simulate('keydown', {
        key: 'Escape',
        preventDefault,
        stopPropagation,
      })
      expect(fn).not.toHaveBeenCalled()
      expect(preventDefault).not.toHaveBeenCalled()
    })
  })
})
