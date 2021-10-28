import React from 'react'
import { mount } from 'enzyme'
import { createRef } from '@myntra/uikit-utils'
import ClickAway from './click-away'

describe('ClickAway', () => {
  const handlers = {}

  document.addEventListener = jest.fn((event, cb) => {
    handlers[event] = cb
  })

  document.removeEventListener = jest.fn()

  const ref = createRef()
  const fn = jest.fn()
  const TestComponent = (
    { eventName, target } // eslint-disable-line react/prop-types
  ) => (
    <div id="outer">
      <div id="target" ref={target}>
        <span id="child" />
      </div>
      <ClickAway onClickAway={fn} target={target} domEventName={eventName} />
    </div>
  )
  let wrapper

  beforeEach(() => {
    wrapper = mount(<TestComponent target={ref} />)
  })

  afterEach(() => {
    document.addEventListener.mockClear()
    document.removeEventListener.mockClear()
    fn.mockClear()
  })

  it('is a component', () => {
    expect(ClickAway).toBeComponent()
  })

  describe('behaviour', () => {
    it('calls `onClickAway` prop if any outside element is clicked', () => {
      handlers.click({
        target: wrapper.find('#outer').getDOMNode(),
      })

      expect(fn).toHaveBeenCalled()
    })

    it('does not call `onClickAway` prop if any element inside target is clicked', () => {
      handlers.click({
        target: wrapper.find('#child').getDOMNode(),
      })

      expect(fn).not.toHaveBeenCalled()
    })
  })
})
