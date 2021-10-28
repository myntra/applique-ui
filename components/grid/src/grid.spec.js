import React from 'react'
import { shallow, mount } from 'enzyme'

import Grid from './grid'

it('should render grid wrapper', () => {
  const wrapper = shallow(<Grid />)
  expect(wrapper.hasClass('container')).toBe(true)
  expect(wrapper.html()).toMatchSnapshot()
})

it('should allow null/undefined child', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  mount(
    <Grid>
      <Grid.Column />
      {null}
      {undefined}
    </Grid>
  )
  expect(spy).not.toHaveBeenCalled()
  spy.mockReset()
})

it('should render columns centered', () => {
  const wrapper = shallow(<Grid centered />)

  expect(wrapper.hasClass('container')).toBe(true)
  expect(wrapper.hasClass('centered')).toBe(true)
  expect(wrapper.html()).toMatchSnapshot()
})

it('should render columns vertically centered', () => {
  const wrapper = shallow(<Grid vcentered />)

  expect(wrapper.hasClass('container')).toBe(true)
  expect(wrapper.hasClass('vcentered')).toBe(true)
  expect(wrapper.html()).toMatchSnapshot()
})

it('should wrap columns', () => {
  const wrapper = shallow(<Grid multiline />)

  expect(wrapper.hasClass('container')).toBe(true)
  expect(wrapper.hasClass('multiline')).toBe(true)
  expect(wrapper.html()).toMatchSnapshot()
})

it('mixing props', () => {
  const wrapper = shallow(<Grid multiline gapless centered vcentered />)

  expect(wrapper.hasClass('container')).toBe(true)
  expect(wrapper.hasClass('multiline')).toBe(true)
  expect(wrapper.hasClass('centered')).toBe(true)
  expect(wrapper.hasClass('vcentered')).toBe(true)
  expect(wrapper.html()).toMatchSnapshot()
})
