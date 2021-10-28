import React from 'react'
import { shallow, mount } from 'enzyme'

import InputMasked from './input-masked'

/**
 * 1. Renders mask input tag, placeholder input tag
 * 2. pattern - creates maskMeta with fixed chars/validations/transforms, creates placeholder
 * 3. Include mask characters - value, onKeyPress, Backspace, other keys, target value as is
 * 4. Exclude mask characters
 * 5. Value - update placeholder on update, call props.onchange
 */

describe('Masked Input', () => {
  it('should render input tag', () => {
    const wrapper = shallow(<InputMasked />)
    expect(wrapper.find('div').children()).toHaveLength(2)

    expect(
      wrapper
        .find('div')
        .childAt(0)
        .is('.masked-input')
    ).toBe(true)

    expect(
      wrapper
        .find('div')
        .childAt(1)
        .is('.mask')
    ).toBe(true)
  })
})

describe('Masked Input with mask pattern', () => {
  const handleChange = jest.fn()
  const wrapper = mount(
    <InputMasked
      pattern={'dL"ABC"lAa*'}
      onChange={handleChange}
      includeMaskChars={true}
    />
  )

  it('should create mask meta data', () => {
    expect(wrapper.instance().maskMetadata).toHaveLength(9)
    expect(wrapper.instance().placeholder).toEqual('dLABClAa*')
  })

  it('should propagate all other key strokes', () => {
    const event = {
      key: 'ArrowLeft',
      target: {
        value: '',
        selectionStart: 0,
      },
    }
    wrapper.find('.masked-input').simulate('keydown', event)
    expect(handleChange).not.toHaveBeenCalledWith('')
  })

  it('should not call onchange if invalid character is entered', () => {
    const event = {
      key: 'A',
      target: {
        value: '',
        selectionStart: 0,
      },
    }
    wrapper.find('.masked-input').simulate('keypress', event)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('should call onchange if valid character is entered', () => {
    const event = {
      key: '1',
      target: {
        value: '',
        selectionStart: 0,
      },
    }
    wrapper.find('.masked-input').simulate('keypress', event)
    expect(handleChange).toHaveBeenCalledWith('1')
  })

  it('should call onchange with mask if valid character is entered', () => {
    const event = {
      key: '2',
      target: {
        value: '',
        selectionStart: 0,
      },
    }
    wrapper.find('.masked-input').simulate('keypress', event)
    event.key = 'Z'
    event.target.value = '2'
    event.target.selectionStart = 1
    wrapper.find('.masked-input').simulate('keypress', event)
    expect(handleChange).toHaveBeenCalledWith('2ZABC')
  })

  it('should remove mask and one character on backspacing mask', () => {
    const event = {
      key: 'Backspace',
      target: {
        value: '2ZABC',
        selectionStart: 5,
      },
    }
    wrapper.find('.masked-input').simulate('keydown', event)
    expect(handleChange).toHaveBeenCalledWith('2')
  })

  it('should remove one character on backspace', () => {
    const event = {
      keyCode: 8,
      target: {
        value: '2',
        selectionStart: 1,
      },
    }
    wrapper.find('.masked-input').simulate('keydown', event)
    expect(handleChange).toHaveBeenCalledWith('')
  })

  it('should have empty value on backspacing empty field', () => {
    const event = {
      keyCode: 8,
      target: {
        value: '',
        selectionStart: 0,
      },
    }
    wrapper.find('.masked-input').simulate('keydown', event)
    expect(handleChange).toHaveBeenCalledWith('')
  })
})

describe('Masked Input that excludes mask character', () => {
  const handleChange = jest.fn()
  const initValue = '_z2d&'
  const wrapper = mount(
    <InputMasked
      pattern={'w*a"ABC"lA"$"'}
      placeholder={'xxxABCxx$'}
      onChange={handleChange}
      value={initValue}
    />
  )

  it('should add mask characters to input', () => {
    expect(wrapper.find('.masked-input').props().value).toEqual('_z2ABCd')
    expect(wrapper.find('.mask').props().value).toEqual('_z2ABCdx$')
  })

  it('should call onchange if valid character is entered, without mask', () => {
    const event = {
      key: 'x',
      target: {
        value: '_z2ABCd',
        selectionStart: 7,
      },
    }
    wrapper.find('.masked-input').simulate('keypress', event)
    expect(handleChange).toHaveBeenCalledWith('_z2dX')
  })

  it('should not remove mask on backspace if pattern starts with a mask', () => {
    const event = {
      key: 'Backspace',
      target: {
        value: '$.',
        selectionStart: 2,
      },
    }
    mount(
      <InputMasked
        pattern={'"$."dd'}
        includeMaskChars={false}
        onChange={handleChange}
      />
    )
      .find('.masked-input')
      .simulate('keydown', event)
    expect(handleChange).toHaveBeenCalledWith('')
  })
})
