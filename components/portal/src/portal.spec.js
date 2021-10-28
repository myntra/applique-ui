import React from 'react'
import { mount } from 'enzyme'
import Portal from './portal'

describe('Portal', () => {
  const container = document.createElement('div')

  container.id = 'target'

  document.body.appendChild(container)

  describe('react 16', () => {
    const isReact16 = Portal.isReact16

    beforeAll(() => {
      Portal.isReact16 = true
    })

    afterAll(() => {
      Portal.isReact16 = isReact16
    })

    it('is a component', () => {
      expect(Portal).toBeComponent()
    })

    it('should render in container', () => {
      const Temp = ({ name }) => ( // eslint-disable-line
        <div>
          <Portal container={container}>
            <div id="foo">{name || 'Foo'}</div>
          </Portal>
          <span>Bar</span>
        </div>
      )
      const ref = mount(<Temp />)

      expect(ref.text()).toBe('Bar')
      expect(document.querySelector('#target').querySelector('#foo').textContent).toBe('Foo')
      ref.setProps({ name: 'Bar' })
      expect(document.querySelector('#target').querySelector('#foo').textContent).toBe('Bar')
      ref.unmount()
    })

    it('should render in container with selector', () => {
      const ref = mount(
        <div>
          <Portal container="#target">
            <span id="foo">Foo</span>
          </Portal>
          <span>Bar</span>
        </div>
      )

      expect(ref.text()).toBe('Bar')
      expect(document.querySelector('#target').querySelector('#foo').textContent).toBe('Foo')
      ref.unmount()
    })

    it('should render in container with custom', () => {
      const ref = mount(
        <div>
          <Portal container={container} wrapper={document.createElement('p')}>
            <span id="foo">Foo</span>
          </Portal>
          <span>Bar</span>
        </div>
      )

      expect(ref.text()).toBe('Bar')
      expect(document.querySelector('#target').querySelector('#foo').textContent).toBe('Foo')
      expect(document.querySelector('#target > p').textContent).toBe('Foo')
      ref.unmount()
    })

    it('should remove wrapper from container', done => {
      const ref = mount(
        <div>
          <Portal container={container} wrapper={document.createElement('p')}>
            <span id="foo">Foo</span>
          </Portal>
          <span>Bar</span>
        </div>
      )

      expect(ref.text()).toBe('Bar')
      expect(document.querySelector('#target').querySelector('#foo').textContent).toBe('Foo')
      expect(document.querySelector('#target > p > span').textContent).toBe('Foo')
      ref.unmount()

      setTimeout(() => {
        expect(document.querySelector('#target')).toBeTruthy()
        expect(document.querySelector('#target > p')).toBeFalsy()
        done()
      }, 10)
    })
  })

  describe('react 15', () => {
    const isReact15 = Portal.isReact15
    const isReact16 = Portal.isReact16

    beforeAll(() => {
      Portal.isReact15 = true
      Portal.isReact16 = false
    })

    afterAll(() => {
      Portal.isReact15 = isReact15
      Portal.isReact16 = isReact16
    })

    it('should render in container', () => {
      const Temp = ({ name }) => ( // eslint-disable-line
        <div>
          <Portal container={container}>
            <div id="foo">{name || 'Foo'}</div>
          </Portal>
          <span>Bar</span>
        </div>
      )
      const ref = mount(<Temp />)

      expect(ref.text()).toBe('Bar')
      expect(document.querySelector('#target').querySelector('#foo').textContent).toBe('Foo')
      ref.setProps({ name: 'Bar' })
      expect(document.querySelector('#target').querySelector('#foo').textContent).toBe('Bar')
      ref.unmount()
    })
  })

  describe('react 14', () => {
    const isReact15 = Portal.isReact15
    const isReact16 = Portal.isReact16

    beforeAll(() => {
      Portal.isReact15 = false
      Portal.isReact16 = false
    })

    afterAll(() => {
      Portal.isReact15 = isReact15
      Portal.isReact16 = isReact16
    })

    it('should throw error', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        mount(
          <div>
            <Portal container={container}>
              <div id="foo">Foo</div>
            </Portal>
            <span>Bar</span>
          </div>
        )
      }).toThrow()

      spy.mockReset()
      spy.mockClear()
    })
  })
})
