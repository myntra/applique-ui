import React from 'react'
import { mount } from 'enzyme'

import JobTracker from './index'
import JobTrackerItem from './job-tracker-item'

describe('job-tracker', () => {
  it('is a component', () => {
    expect(JobTracker).toBeComponent()
  })
  it('should render Job Tracker component', () => {
    const data = [
      {
        id: 123,
        createdBy: 'Ash Ketchum',
        remark: "Gotta catch 'em all",
        createdOn: 1542623683000,
        status: 'IN_PROGRESS',
        totalStepCount: 100,
        completedStepCount: 30,
      },
      {
        id: 321,
        createdBy: 'Ash Ketchum',
        remark: "Gotta catch 'em all",
        createdOn: 1542623683000,
        status: 'HALTED',
        totalStepCount: 100,
        completedStepCount: 30,
      },
      {
        id: 234,
        createdBy: 'Ash Ketchum',
        remark: "Gotta catch 'em all",
        createdOn: 1544643683000,
        successFileName: 'success.xslx',
        errorFileName: 'error.xslx',
        status: 'FAILED',
        totalStepCount: 100,
        completedStepCount: 30,
      },
      {
        id: 444,
        createdBy: 'Ash Ketchum',
        remark: "Gotta catch 'em all",
        createdOn: 1544643683000,
        fileName: 'success.xslx',
        status: 'COMPLETED',
        totalStepCount: 100,
        completedStepCount: 30,
      },
    ]
    const wrapper = mount(<JobTracker data={data} />)
    expect(wrapper.find(JobTrackerItem)).toHaveLength(4)
  })
})
