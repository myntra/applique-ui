import React from 'react'
import { shallow } from 'enzyme'

import Accordion from './accordion'
import AccordionItem from './accordion-item'

describe('Accordion', () => {
  it('is a component', () => {
    expect(Accordion).toBeComponent()
  })
  it('renders accordion', () => {
    const wrapper = shallow(
      <Accordion active={1}>
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

    expect(wrapper.find(AccordionItem).get(0).props.title).toEqual('One')
    expect(wrapper.find(AccordionItem).get(1).props.title).toEqual('Two')
    expect(wrapper.find(AccordionItem).get(2).props.title).toEqual('Three')
  })
})
