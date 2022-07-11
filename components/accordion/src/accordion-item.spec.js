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

  it('renders any AccordionItem', () => {
    const wrapper = mount(element)
    const accordian = wrapper
      .find('div[data-accordion-index=1]')
      .find('div')
      .at(1)
    expect(
      wrapper.find('div[data-accordion-index=1]').hasClass('active')
    ).toEqual(false)
    accordian.prop('onClick')()
    wrapper.update()
    expect(
      wrapper.find('div[data-accordion-index=1]').hasClass('active')
    ).toEqual(true)
  })

  it('calls onChange function provided as props', () => {
    const onChange = jest.fn()
    onChange.mockReturnValueOnce(0, true).mockReturnValueOnce(0, false)
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
    // Open the Accordion item
    wrapper
      .find('div[data-accordion-index=0]')
      .find('div')
      .at(1)
      .prop('onClick')()
    expect(onChange.mock.calls[0]).toEqual([0, true]) // 0 is index of item and true being is active

    // Close the Accordion item
    wrapper
      .find('div[data-accordion-index=0]')
      .find('div')
      .at(1)
      .prop('onClick')()
    expect(onChange.mock.calls[1]).toEqual([0, false]) // 0 is index of item and false being is not active
  })
})
