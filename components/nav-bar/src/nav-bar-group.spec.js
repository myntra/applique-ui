import React from 'react'
import { shallow, mount } from 'enzyme'
import NavBarGroup, { Context as DepthContext } from './nav-bar-group'
import NavContext from './context'

/*

NavBarGroup specification:

  1. Renders <ul> element.
    1. Uses <NavBarItem> if non-root group
  2. Injects __$navId in child <NavBarGroup>
  3. Toggles sub-nav group.

*/

describe('NavBar', () => {
  describe('NavBar.Group', () => {
    it.skip('should render root nav group', () => {
      const wrapper = shallow(
        <NavBarGroup __$navId={[0]}>
          <li data-test-id="item">Foo</li>
        </NavBarGroup>
      )

      expect(wrapper.find('ul')).toHaveLength(1)
      expect(wrapper.find('[data-test-id="item"]')).toHaveLength(1)
    })

    it('should render sub nav group', () => {
      const ID = [0]
      const context = {
        setActiveGroup: jest.fn(),
        isActiveGroup: jest.fn().mockImplementation((id) => id === ID),
        isOpen: true,
      }
      const wrapper = mount(
        <NavContext.Provider value={context}>
          <DepthContext.Provider value={{ depth: 1 }}>
            <NavBarGroup __$navId={ID}>
              <li data-test-id="item0">Foo</li>
            </NavBarGroup>
            <NavBarGroup __$navId={[1]}>
              <li data-test-id="item1">Foo</li>
            </NavBarGroup>
          </DepthContext.Provider>
        </NavContext.Provider>,
        { context }
      )
      expect(wrapper.find('NavBarItem')).toHaveLength(2)

      // Should be expanded.
      expect(context.isActiveGroup).toHaveBeenCalledWith([0])
      expect(wrapper.find('[data-test-id="item0"]')).toHaveLength(1)

      // Should be collapsed.
      expect(context.isActiveGroup).toHaveBeenCalledWith([1])
      expect(wrapper.find('[data-test-id="item1"]')).not.toHaveLength(1)
    })

    it('should inject __$navId in sub NavBarGroup components', () => {
      const context = {
        setActiveGroup: jest.fn(),
        isActiveGroup: jest.fn(),
        isOpen: true,
      }
      const wrapper = mount(
        <NavContext.Provider value={context}>
          <NavBarGroup __$navId={[0]}>
            <li data-test-id="item0">Foo</li>
            <NavBarGroup>
              <li data-test-id="item1">Foo</li>
            </NavBarGroup>
          </NavBarGroup>
        </NavContext.Provider>,
        { context }
      )
      expect(wrapper.find(NavBarGroup)).toHaveLength(2)
      expect(
        wrapper
          .find(NavBarGroup)
          .at(1) // Second NavBarGroup component instance.
          .prop('__$navId')
      ).toEqual([0, 1])
    })

    it('should collapse/expand component', () => {
      let activeNavId = [0, 0]
      const context = {
        setActiveGroup: jest.fn().mockImplementation((id) => {
          activeNavId = id
          wrapper.update()
        }),
        isActiveGroup: jest
          .fn()
          .mockImplementation(
            (id) => activeNavId[0] === id[0] && activeNavId[1] === id[1]
          ),
        isOpen: true,
      }

      const wrapper = mount(
        <NavContext.Provider value={context}>
          <NavBarGroup __$navId={[0]}>
            <NavBarGroup data-test-id="group0">
              <li data-test-id="item0">Foo</li>
            </NavBarGroup>
            <NavBarGroup data-test-id="group1">
              <li data-test-id="item1">Foo</li>
            </NavBarGroup>
          </NavBarGroup>
        </NavContext.Provider>,
        { context }
      )

      expect(wrapper.find('[data-test-id="item0"]')).toHaveLength(1)
      expect(wrapper.find('[data-test-id="item1"]')).toHaveLength(0)

      context.isActiveGroup.mockClear()

      // Click on second NavBarGroup
      wrapper.find('NavBarItem[data-test-id="group1"]').simulate('click')

      expect(context.setActiveGroup).toHaveBeenCalledWith([0, 1])
    })
  })
})
