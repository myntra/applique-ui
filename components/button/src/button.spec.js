import React from 'react'
import { shallow } from 'enzyme'
import Button from './button'
import Bell from 'uikit-icons/svgs/Bell'

describe('Button', () => {
  it('renders correct tag according to prop provided (href -> <a> | to -> <RouterLink> | -> <button>)', () => {
    expect(Button).toBeTransparentComponent()
    expect(shallow(<Button />)).toBeTag('button')
    expect(shallow(<Button href="/foo" />)).toBeTag(Button.Link)
    expect(shallow(<Button to="/foo" />)).toBeTag(Button.RouterLink)
  })

  it('renders icon on left when icon prop is present', () => {
    const wrapper = shallow(<Button icon={Bell} />)

    expect(wrapper.find('[data-test-id="primary-icon"]')).toHaveLength(1)
    wrapper.unmount()
  })

  it('renders icon on right when secondaryIcon prop is present', () => {
    const wrapper = shallow(<Button secondaryIcon={Bell}>Button</Button>)

    expect(wrapper.find('[data-test-id="secondary-icon"]')).toHaveLength(1)
    wrapper.unmount()
  })

  it('renders children prop as inner HTML', () => {
    expect(shallow(<Button>foo</Button>).text()).toBe('foo')
  })

  it('prefers `children` prop over `label` prop', () => {
    expect(shallow(<Button label="bar">foo</Button>).text()).toBe('foo')
  })

  const originalConsoleError = global.console.error
  beforeEach(() => {
    global.console.error = (...args) => {
      const propTypeFailures = [/Failed prop typs/, /Warning: Received/]
      if (propTypeFailures.some((e) => e.test(args[0]))) {
        throw new Error(args[0])
      }
      originalConsoleError(...args)
    }
  })
  describe('behaviour', () => {
    it('calls `onClick` prop if target element is clicked', () => {
      const handleClick = jest.fn()
      const wrapper = shallow(<Button onClick={handleClick} />)

      wrapper.find('[data-test-id="target"]').simulate('click')

      expect(handleClick).toHaveBeenCalled()
      wrapper.unmount()
    })

    it('ignores click events on target element if `onClick` prop is not present', () => {
      expect(() => {
        const wrapper = shallow(<Button onClick={null} />)
        wrapper.find('[data-test-id="target"]').simulate('click')
      }).not.toConsoleError(expect.anything())
    })

    it('ignores click events on target element if `disabled` prop is set to `true`', () => {
      const handleClick = jest.fn()
      const preventDefault = jest.fn()
      const wrapper = shallow(<Button disabled onClick={handleClick} />)

      wrapper
        .find('[data-test-id="target"]')
        .simulate('click', { preventDefault })

      expect(handleClick).not.toHaveBeenCalled()
      expect(preventDefault).toHaveBeenCalled()
      wrapper.unmount()
    })
    it('throws error if bot to and href is used as a prop', () => {
      const props = {
        onClick: jest.fn(),
        type: 'primary',
        to: '/some/path',
        href: '/some/path',
      }
      shallow(<Button {...props}>Click me</Button>)
    })
  })
})
