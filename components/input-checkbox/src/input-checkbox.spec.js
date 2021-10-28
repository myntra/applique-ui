import React from 'react'
import InputCheckBox from './input-checkbox'

// testCodeMod(__dirname, 'InputCheckBox.codemod.js')

it('should call onChange handler on change', () => {
  const handler = jest.fn()
  const wrapper = mountShallow(<InputCheckBox onChange={handler} />)
  wrapper.find('input').simulate('change', { target: { checked: true } })
  expect(handler).toHaveBeenCalled()
})

it('should ignore change events if no change handler', () => {
  const wrapper = mountShallow(<InputCheckBox onChange={null} />)
  wrapper.find('input').simulate('change')
})

it('should render title component beside the checkbox', () => {
  const wrapper = mountShallow(<InputCheckBox onChange={null} title="Text" />)
  expect(wrapper.text()).toEqual('Text')
})
