import React from 'react'
import { shallow } from 'enzyme'

import Loader from './loader'

describe('loader', () => {
  it('is a component', () => {
    expect(Loader).toBeComponent()
  })
  it('should render the  component', () => {
    const wrapper = shallow(<Loader appearance="bar" />)
    expect(wrapper.find('.loader')).toHaveLength(1)
  })
})
