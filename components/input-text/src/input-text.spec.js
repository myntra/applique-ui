import React from 'react'
import InputText from './input-text'

it('renders a placeholder <input> by default', () => {
  expect(
    mount(<InputText placeholder="Type" />)
      .find('input')
      .at(0)
      .prop('placeholder')
  ).toBe('Type')
})

it('should call onChange handler on text enter', () => {
  const handler = jest.fn()
  const wrapper = mount(<InputText onChange={handler} />)

  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 'foo' } })
  expect(handler).toHaveBeenCalled()
})

describe('classes', () => {
  it('should render with custom class name', () => {
    expect(
      mount(<InputText className="c-name" />)
        .find('div')
        .at(0)
        .props().className
    ).toEqual(expect.stringContaining('c-name'))
  })
})

it('focuses the element on mount', () => {
  const wrapper = mount(<InputText autoFocus id="test" />)
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
      mount(<InputText disabled />)
        .find('input')
        .at(0)
        .props().disabled
    ).toBe(true)

    expect(
      mount(<InputText disabled={false} />)
        .find('input')
        .at(0)
        .props().disabled
    ).toBe(false)
  })
})

describe('Error', () => {
  it('should have error class corrosponding to error prop ', () => {
    const wrapper = mount(<InputText error="error" />)
    console.log(wrapper.html())
    expect(wrapper.find('.error')).toHaveLength(1)

    wrapper.setProps({ error: false })
    wrapper.update()
    expect(wrapper.find('.error')).toHaveLength(0)
  })
})

describe('Variants Check', () => {
  it('should have bordered, standard classes corrosponding to variant passed', () => {
    const wrapper = mount(<InputText />)
    expect(wrapper.find('.bordered')).toHaveLength(1)

    wrapper.setProps({ variant: 'standard' })
    wrapper.update()
    expect(wrapper.find('.standard')).toHaveLength(1)
  })
})

describe('Filled  Check', () => {
  it('should have filled class when there is value present, only string values supported', () => {
    const wrapper = mount(<InputText value="test" />)
    expect(wrapper.find('.filled')).toHaveLength(1)
    wrapper.setProps({ value: '' })
    wrapper.update()

    expect(wrapper.find('.filled')).toHaveLength(0)

    wrapper.setProps({ value: false })
    wrapper.update()
    expect(wrapper.find('.filled')).toHaveLength(0)

    wrapper.setProps({ value: 1 })
    wrapper.update()
    expect(wrapper.find('.filled')).toHaveLength(0)
  })
})

describe('Adornments support', () => {
  it('Should render Adornment Text', () => {
    const inputwrapper = mount(<InputText adornment="/kg" />)
    const adornmentWrapper = inputwrapper.find('.input-adornment')
    expect(adornmentWrapper.text()).toBe('/kg')
  })
  it('Should render Adornment Component', () => {
    const inputwrapper = mount(
      <InputText adornment={<button>Click Me</button>} />
    )
    const adornmentComp = inputwrapper.find('.input-adornment')
    expect(adornmentComp.find('button').length).toBe(1)
  })
  it('Should Support start and end position of adornment', () => {
    const inputwrapper = mount(
      <InputText
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
