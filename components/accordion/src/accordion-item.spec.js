import React from 'react'
import { shallow, mount } from 'enzyme'
import Accordion from './index'
import AccordionItem from './accordion-item'

describe('Accordion', () => {
  const element = (
    <Accordion>
      <Accordion.Item title="One">
        <div>First component</div>
      </Accordion.Item>
      <Accordion.Item title="Two">
        <div>Second component</div>
      </Accordion.Item>
      <Accordion.Item title="Three">
        <div>Third component</div>
      </Accordion.Item>
    </Accordion>
  )
  it('is a component', () => {
    expect(Accordion).toBeComponent()
  })

  it('should output 3 AccordionItem', () => {
    const wrapper = shallow(element)
    expect(wrapper.find(AccordionItem)).toHaveLength(3)
  })

  it('renders first AccordionItem', () => {
    const wrapper = mount(element)
    expect(
      wrapper
        .find('div')
        .at(1)
        .text()
    ).toEqual('First component')
  })

  it('renders second AccordionItem', () => {
    const wrapper = mount(element)
    wrapper.find('[data-accordion-index=1]').prop('onClick')()
    wrapper.update()
    expect(
      wrapper
        .find('div')
        .at(2)
        .text()
    ).toEqual('Second component')
  })

  it('calls onChange function provided as props', () => {
    const onChange = jest.fn()
    afterEach(() => {
      onChange.mockClear()
    })
    const wrapper = mount(
      <Accordion onChange={onChange}>
        <Accordion.Item title="One">
          <div>First component</div>
        </Accordion.Item>
      </Accordion>
    )
    wrapper.find('[data-accordion-index=0]').prop('onClick')()
    expect(onChange).toHaveBeenCalled()
  })
})
