import React from 'react'
import BreadCrumb from './bread-crumb'

it('should render nav', () => {
  const wrapper = mount(<BreadCrumb />)
  expect(wrapper.find('nav').hasClass('pages')).toBe(true)
})

it('should render children', () => {
  const wrapper = mount(
    <BreadCrumb>
      <BreadCrumb.Item onClick={() => {}}>First</BreadCrumb.Item>
      <BreadCrumb.Item>
        <a className="test" href="#">
          Second
        </a>
      </BreadCrumb.Item>
    </BreadCrumb>
  )

  expect(wrapper.find('.page')).toHaveLength(2)
  expect(
    wrapper
      .find('.page')
      .at(1)
      .find('a')
      .hasClass('test')
  ).toBe(true)
})

it('should call onClick for breadCrumb item', () => {
  const handler = jest.fn()
  const wrapper = mount(
    <BreadCrumb>
      <BreadCrumb.Item onClick={handler}>First</BreadCrumb.Item>
      <BreadCrumb.Item>
        <a href="#">Second</a>
      </BreadCrumb.Item>
    </BreadCrumb>
  )
  wrapper
    .find('.page')
    .at(0)
    .simulate('click')
  expect(handler).toHaveBeenCalled()
})
