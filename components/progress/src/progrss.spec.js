import React from 'react'
import { mount } from 'enzyme'

import Progress from './progress'
import ProgressBar from './progress-bar'
import ProgressCircle from './progress-circle'

describe('progress', () => {
  it('is a component', () => {
    expect(Progress).toBeComponent()
  })
  it('shoould render the component', () => {
    const wrapper = mount(
      <Progress type="bar" value={25} style={{ width: '100px' }} />
    )
    expect(wrapper.find(ProgressBar)).toHaveLength(1)
  })
  it('shoould render circle progress bar', () => {
    const wrapper = mount(
      <Progress type="circle" value={25} style={{ width: '100px' }} />
    )
    expect(wrapper.find(ProgressCircle)).toHaveLength(1)
  })
})
