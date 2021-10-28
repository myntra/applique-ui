import React from 'react'
import { shallow } from 'enzyme'

import ErrorBoundary from './index'

class CustomComponent extends React.Component {
  render() {
    return <div>{this.props.children}</div> // eslint-disable-line
  }
}

describe('ErrorBoundary', () => {
  it('renders nothing', () => {
    const wrapper = shallow(
      <ErrorBoundary>
        <div data-test-it="mock" />
      </ErrorBoundary>
    )

    expect(wrapper.html()).toBe('<div data-test-it="mock"></div>')
  })

  describe('behaviour', () => {
    it('captures error message', () => {
      const wrapper = shallow(
        <ErrorBoundary>
          <CustomComponent>Child</CustomComponent>
        </ErrorBoundary>
      )

      expect(wrapper.text()).not.toEqual(
        expect.stringContaining('Oops!!! Something went wrong')
      )

      wrapper.find(CustomComponent).simulateError('error')

      expect(wrapper.text()).toEqual(
        expect.stringContaining('Oops!!! Something went wrong')
      )
    })
  })
})
