import React from 'react'
import InputText from './input'

it('renders a placeholder <input> by default', () => {
  expect(
    mountShallow(<Input placeholder="Type" />)
      .find('input')
      .at(0)
      .prop('placeholder')
  ).toBe('Type')
})

it('should call onChange handler on text enter', () => {
  const handler = jest.fn()
  const wrapper = mountShallow(<Input onChange={handler} />)

  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 'foo' } })
  expect(handler).toHaveBeenCalled()
})

describe('classes', () => {
  it('should render with custom class name', () => {
    expect(
      mountShallow(<Input className="c-name" />)
        .find('div')
        .at(0)
        .props().className
    ).toEqual(expect.stringContaining('c-name'))
  })
})

it('focuses the element on mount', () => {
  const wrapper = mount(<Input autoFocus id="test" />)
  expect(
    wrapper
      .find('input')
      .at(0)
      .props().id
  ).toBe(document.activeElement.id)
})

describe('disabled', () => {
  it('Check input element ', () => {
    expect(
      mountShallow(<Input disabled />)
        .find('input')
        .at(0)
        .props().disabled
    ).toBe(true)

    expect(
      mountShallow(<Input disabled={false} />)
        .find('input')
        .at(0)
        .props().disabled
    ).toBe(false)
  })
})
describe('Error', () => {
  it('should have error class corrosponding to error prop ', () => {
    const inputwrapper = mountShallow(<Input error />)
    expect(inputwrapper.hasClass('error')).toBe(true)

    inputwrapper.setProps({ error: false })
    inputwrapper.update()
    expect(inputwrapper.hasClass('error')).toBe(false)
  })
})
describe('Variants Check', () => {
  it('should have bordered, standard classes corrosponding to variant passed', () => {
    const inputwrapper = mountShallow(<Input />)
    expect(inputwrapper.hasClass('bordered')).toBe(true)

    inputwrapper.setProps({ variant: 'standard' })
    inputwrapper.update()
    expect(inputwrapper.hasClass('standard')).toBe(true)
  })
})
describe('Filled  Check', () => {
  it('should have filled class when there is value present, only string values supported', () => {
    const inputwrapper = mountShallow(<Input value="test" />)
    expect(inputwrapper.hasClass('filled')).toBe(true)
    inputwrapper.setProps({ value: '' })
    inputwrapper.update()

    expect(inputwrapper.hasClass('filled')).toBe(false)

    inputwrapper.setProps({ value: false })
    inputwrapper.update()
    expect(inputwrapper.hasClass('filled')).toBe(false)

    inputwrapper.setProps({ value: 1 })
    inputwrapper.update()
    expect(inputwrapper.hasClass('filled')).toBe(false)
  })
})
describe('Adornments support', () => {
  it('Should render Adornment Text', () => {
    const inputwrapper = mountShallow(<Input adornment="/kg" />)
    const adornmentWrapper = inputwrapper.find('.input-adornment')
    expect(adornmentWrapper.text()).toBe('/kg')
  })
  it('Should render Adornment Component', () => {
    const inputwrapper = mountShallow(
      <Input adornment={<button>Click Me</button>} />
    )
    const adornmentComp = inputwrapper.find('.input-adornment')
    expect(adornmentComp.find('button').length).toBe(1)
  })
  it('Should Support start and end position of adornment', () => {
    const inputwrapper = mountShallow(
      <Input
        adornment={<button>Click Me</button>}
        adornmentPosition="start"
      />
    )
    let adornmentWrapper = inputwrapper.find('.input-adornment')
    expect(adornmentWrapper.hasClass('input-adornment-start')).toBe(true)
    inputwrapper.setProps({ adornmentPosition: 'end', adornment: '/kg' })
    inputwrapper.update()
    adornmentWrapper = inputwrapper.find('.input-adornment')
    expect(adornmentWrapper.hasClass('input-adornment-end')).toBe(true)
  })
})
