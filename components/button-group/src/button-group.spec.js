import React from 'react'
import { shallow, mount } from 'enzyme'
import ButtonGroup from './button-group'
import Button from '@myntra/uikit-component-button'
import List from '@myntra/uikit-component-list'
import Dropdown from '@myntra/uikit-component-dropdown'

describe('ButtonGroup', () => {
  it('renders a ButtonGroup', () => {
    expect(ButtonGroup).toBeComponent()
  })

  it('should render only buttons for group of less then 3 buttons', () => {
    let wrapper = shallow(
      <ButtonGroup>
        <Button type="primary">primary</Button>
        <Button type="secondary">secondary</Button>
        <Button type="link">link</Button>
      </ButtonGroup>
    )
    expect(wrapper.find(List).exists()).toEqual(false)

    wrapper = shallow(
      <ButtonGroup>
        <Button type="primary">primary</Button>
        <Button type="secondary">secondary</Button>
      </ButtonGroup>
    )
    expect(wrapper.find(List).exists()).toEqual(false)
  })

  it('should render buttons and a more button for group of more then 3 buttons', () => {
    const wrapper = shallow(
      <ButtonGroup>
        <Button type="primary">primary</Button>
        <Button type="secondary">secondary</Button>
        <Button type="primary">primary</Button>
        <Button type="secondary">secondary</Button>
      </ButtonGroup>
    )
    expect(wrapper.find(List).exists()).toEqual(true)
  })

  it('should render the next valid button in case of repeated buttons', () => {
    const wrapper = shallow(
      <ButtonGroup>
        <Button type="secondary">secondary</Button>
        <Button type="secondary">second secondary</Button>
      </ButtonGroup>
    )

    expect(wrapper.find({ type: 'secondary' })).toHaveLength(1)
    expect(wrapper.find({ type: 'text' })).toHaveLength(1)
  })

  it('should throw an error in case of repeated link buttons', () => {
    try {
      shallow(
        <ButtonGroup>
          <Button type="link">link</Button>
          <Button type="link">second link</Button>
        </ButtonGroup>
      )
    } catch (e) {
      expect(e.message).toEqual('Not a correct sequence')
    }
  })

  it('should render secondary button in case of no type prop defined', () => {
    const wrapper = shallow(
      <ButtonGroup>
        <Button>secondary</Button>
        <Button>second secondary</Button>
      </ButtonGroup>
    )
    expect(wrapper.find(Button)).toHaveLength(2)
    expect(wrapper.find({ type: 'secondary' })).toHaveLength(1)
    expect(wrapper.find({ type: 'text' })).toHaveLength(1)
  })

  it('should follow the button sequence link -> secondary -> primary', () => {
    let wrapper = shallow(
      <ButtonGroup>
        <Button type="primary">primary</Button>
        <Button type="secondary">secondary</Button>
        <Button type="link">link</Button>
      </ButtonGroup>
    )
    expect(wrapper.find(Button).get(0).props.type).toEqual('link')
    expect(wrapper.find(Button).get(1).props.type).toEqual('secondary')
    expect(wrapper.find(Button).get(2).props.type).toEqual('primary')

    wrapper = shallow(
      <ButtonGroup>
        <Button type="primary">primary</Button>
        <Button type="link">link</Button>
        <Button type="secondary">secondary</Button>
        <Button type="secondary">secondary</Button>
      </ButtonGroup>
    )

    expect(wrapper.find(Button).get(0).props.type).toEqual('link')
    expect(wrapper.find(Button).get(1).props.type).toEqual('primary')
    expect(wrapper.find(Button).get(2)).toEqual(undefined) // All buttons after link type goes in more buttons
  })
  it('should render nothing', () => {
    const wrapper = shallow(<ButtonGroup />)
    expect(wrapper.type()).toEqual(null)
  })
  it('should render only primary button. Everything other than primary button in more', () => {
    const wrapper = shallow(
      <ButtonGroup structure="primary-group">
        <Button type="primary">primary</Button>
        <Button type="link">link</Button>
        <Button type="secondary">secondary</Button>
        <Button type="secondary">secondary</Button>
      </ButtonGroup>
    )
    expect(wrapper.find({ type: 'primary' }).props().type).toEqual('primary')
    expect(
      wrapper
        .find(Dropdown)
        .find(List)
        .prop('items')
    ).toHaveLength(3)
  })
  it('should open/close the more button', () => {
    const wrapper = mount(
      <ButtonGroup structure="primary-group">
        <Button type="primary">primary</Button>
        <Button type="link">link</Button>
        <Button type="secondary">secondary</Button>
        <Button type="secondary">secondary</Button>
      </ButtonGroup>
    )
    expect(wrapper.find(Dropdown).find(List)).toHaveLength(0)
    wrapper
      .find(Dropdown)
      .find(Button)
      .prop('onClick')()
    wrapper.update()
    expect(
      wrapper
        .find(Dropdown)
        .find(List)
        .prop('items')
    ).toHaveLength(3)
    wrapper.find(Dropdown).prop('onClose')()
    wrapper.update()
    expect(wrapper.find(Dropdown).find(List)).toHaveLength(0)
  })
})
