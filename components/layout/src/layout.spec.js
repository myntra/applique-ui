import React from 'react'
import { shallow } from 'enzyme'

import Layout from './layout'
import StackLayout from './stack-layout'

describe('layout', () => {
  it('is a component', () => {
    expect(Layout).toBeComponent()
  })
  it('should render the  component', () => {
    const wrapper = shallow(
      <Layout type="stack">
        <div style={{ padding: '16px', border: '1px solid' }}>One</div>
        <div style={{ padding: '16px', border: '1px solid' }}>Two</div>
        <div style={{ padding: '16px', border: '1px solid' }}>Three</div>
        <div style={{ padding: '16px', border: '1px solid' }}>Four</div>
      </Layout>
    )
    expect(wrapper.find(StackLayout)).toHaveLength(1)
  })
})
