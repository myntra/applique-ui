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

    it('calls `onClick` prop if action Button element is clicked', () => {
      const handleClick = jest.fn()
      const wrapper = shallow(
        <Alert.Actionable
          data={{
            color: 'info',
            actionButtonText: 'OKAY',
            onActionClick: handleClick,
          }}
        />
      )

      wrapper.find('[data-test-id="action"]').simulate('click')

      expect(handleClick).toHaveBeenCalled()
      wrapper.unmount()
    })

    it('throws error if both href and displayText are not there in link prop', () => {
      const linkProps = {
        link: {
          href: 'https://myntra.com',
        },
      }
      shallow(<Alert {...linkProps}>Click me</Alert>)
    })

    it('throws error if data not there in actionable', () => {
      shallow(<Alert.Actionable />)
    })

    it('throws error if data.color not there in actionable', () => {
      shallow(
        <Alert.Actionable
          data={{
            feedback: 'Wrong Carton!',
            header: 'Adding MasterBags',
            subHeader: 'Deepak Kumar - New Whitefield',
          }}
        />
      )
    })
  })
})
