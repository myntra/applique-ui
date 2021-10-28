import React from 'react'
import { shallow } from 'enzyme'

import GridColumn from './grid-column'

it('should render grid wrapper', () => {
  const wrapper = shallow(<GridColumn />)
  expect(wrapper.hasClass('column')).toBe(true)
  expect(wrapper.html()).toMatchSnapshot()
})

it('should accept sizes', () => {
  const wrapper = shallow(<GridColumn size={4} sizeOnMobile={5} sizeOnTablet={4} sizeOnDesktop={3} />)
  expect(wrapper.hasClass('column')).toBe(true)
  expect(wrapper.hasClass('is-4')).toBe(true)
  expect(wrapper.hasClass('is-5-mobile')).toBe(true)
  expect(wrapper.hasClass('is-4-tablet')).toBe(true)
  expect(wrapper.hasClass('is-3-desktop')).toBe(true)
  expect(wrapper.html()).toMatchSnapshot()
})

it('should accept offsets', () => {
  const wrapper = shallow(<GridColumn offset={4} offsetOnMobile={5} offsetOnTablet={4} offsetOnDesktop={3} />)
  expect(wrapper.hasClass('column')).toBe(true)
  expect(wrapper.hasClass('offset-4')).toBe(true)
  expect(wrapper.hasClass('offset-5-mobile')).toBe(true)
  expect(wrapper.hasClass('offset-4-tablet')).toBe(true)
  expect(wrapper.hasClass('offset-3-desktop')).toBe(true)
  expect(wrapper.html()).toMatchSnapshot()
})

it('should accept narrow', () => {
  const wrapper = shallow(<GridColumn narrow narrowOnMobile narrowOnTablet narrowOnDesktop />)
  expect(wrapper.hasClass('column')).toBe(true)
  expect(wrapper.hasClass('narrow')).toBe(true)
  expect(wrapper.hasClass('narrow-mobile')).toBe(true)
  expect(wrapper.hasClass('narrow-tablet')).toBe(true)
  expect(wrapper.hasClass('narrow-desktop')).toBe(true)
  expect(wrapper.html()).toMatchSnapshot()
})
