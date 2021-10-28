import React from 'react'
import { shallow } from 'enzyme'

import Alert from './index'

describe('Alert', () => {
  it('renders', () => {
    expect(Alert).toBeComponent()
    expect(Alert).toBeTransparentComponent()
  })

  describe('behaviour', () => {
    it('calls `onClose` prop if close button is clicked', () => {
      const handleClose = jest.fn()
      const wrapper = shallow(<Alert onClose={handleClose}>Alert</Alert>)

      wrapper.find('[data-test-id="close"]').simulate('click')

      expect(handleClose).toHaveBeenCalled()
    })
  })
})
