import React, { PureComponent } from 'react'
import { Mask as _Mask, MASKS } from './default-masks'
import { findLastIndex, memoize } from '@myntra/uikit-utils'

import classnames from './input-masked.module.scss'

export type Mask = _Mask

export interface Props extends BaseProps {
  /**
   * The required pattern for the input field.
   */
  pattern: string

  /**
   * Current value of the masked input field.
   */
  value?: string

  /**
   * The callback function to call when the value changes.
   */
  onChange?(value: string): void

  /**
   * The placeholder text for input field.
   */
  placeholder?: string

  /**
   * Include mask characters in the value.
   */
  includeMaskChars?: boolean

  /**
   * Define custom masks.
   */
  masks?: Record<string, Mask>

  /**
   * Disables all interaction on the select field.
   */
  disabled?: boolean
  /**
   * Allows only previewing selected options.
   */
  readOnly?: boolean
  /**
   *  Makes select field required.
   */
  required?: boolean
  /**
   *  Decides Whether Autocomplete of the input field on/off.
   */
  autoComplete?: string
}

/**
 * Input component that provides a template for phone, credit card, etc.
 *
 * @since 0.0.0
 * @status REVIEWING
 */
export default class InputMasked extends PureComponent<Props> {
  static defaultProps = {
    includeMaskChars: false,
  }

  /**
   * Creates Mask meta data for transforming and validating input
   * and placeholder from the pattern if no placeholder is specified
   */
  computePlaceholderAndMaskMetadata = memoize(function(
    pattern: string,
    masks?: Record<string, Mask>,
    placeholder?: string
  ) {
    let text = ''

    const M = { ...MASKS, ...masks }
    const META: Mask[] = []

    if (pattern) {
      let maskIndex = 0
      while (maskIndex < pattern.length) {
        const maskToken = pattern.charAt(maskIndex)
        // string wrapped in double quotes.
        if (maskToken === '"') {
          let nextQuoteIndex = pattern.indexOf('"', maskIndex + 1)

          if (nextQuoteIndex < 0) {
            nextQuoteIndex = pattern.length
            console.error(
              `Invalid quoted string '${pattern.substr(maskIndex)}' in ${this}`
            )
          } else if (nextQuoteIndex === maskIndex + 1) {
            // escaped quote literal
            META.push({
              validate: (token) => token === '"',
              getToken: () => '"',
            })

            maskIndex += 2

            continue //
          }

          const literal = pattern.substring(maskIndex + 1, nextQuoteIndex)

          text += literal

          Array.prototype.forEach.call(literal, (letter) =>
            META.push({
              validate: (token) => token === letter,
              getToken: () => letter,
            })
          )
          maskIndex += nextQuoteIndex - maskIndex + 1 // literal and enclosing quotes.
        } else if (maskToken in M) {
          META.push(M[maskToken])
          text += maskToken
          maskIndex += 1
        } else {
          console.error(`Unknown mask character "${maskToken}" in ${this}`)
          META.push({
            validate: (token) => token === maskToken,
          })
          text += maskToken
          maskIndex += 1
        }
      }
    }
    return {
      meta: META,
      text: placeholder || text,
    }
  })

  get placeholder() {
    return this.computePlaceholderAndMaskMetadata(
      this.props.pattern,
      this.props.masks,
      this.props.placeholder
    ).text
  }

  get maskMetadata() {
    return this.computePlaceholderAndMaskMetadata(
      this.props.pattern,
      this.props.masks,
      this.props.placeholder
    ).meta
  }

  propagateChange(value) {
    this.props.onChange && this.props.onChange(this.getTargetValue(value))
  }

  /**
   * Creates new placeholder based on current masked input
   */
  getUpdatedPlaceholder(value: string) {
    return value + this.placeholder.substr(value.length)
  }

  handleKeyDown = (event) => {
    switch (event.key || event.keyCode) {
      case 'Backspace':
      case 8:
        event.preventDefault()
        event.stopPropagation()

        const value = this.removeLastChar(event.target.value)

        this.propagateChange(value)

        break
    }
  }

  handleKeyPress = (event) => {
    const value = event.target.value
    const selectionStart = event.target.selectionStart
    const inputChar = this.transformInput(event.key, selectionStart)

    if (
      selectionStart === value.length &&
      this.validateInput(inputChar, selectionStart)
    ) {
      const newValue = value + inputChar
      const maskedValue = newValue + this.getNextMask(newValue)
      this.propagateChange(maskedValue)
    }
  }

  transformInput(token: string, index: number) {
    const mask = this.maskMetadata[index]

    return mask && mask.transform ? mask.transform(token) : token
  }

  validateInput(token: string, index: number) {
    const mask = this.maskMetadata[index]

    return mask && mask.validate && mask.validate(token)
  }

  /**
   * Get maskedValue from the value prop supplied to the component
   *
   * @param {String} value
   * @returns {String} maskedValue
   */
  getDisplayValue(value) {
    let text = ''

    if (this.props.includeMaskChars) {
      text += value
    } else {
      let index = 0
      const masks = this.maskMetadata
      // TODO: Auto fill literal value.
      for (let i = 0; i < value.length; ) {
        if (masks[index].getToken) {
          text += masks[index].getToken()
        } else {
          text += value.charAt(i)
          i += 1
        }

        index += 1
      }
    }

    return this.getValidMaskedValue(text)
  }

  /**
   * Validates the masked input based on mask definitions
   */
  getValidMaskedValue(text: string) {
    let value = ''

    for (let i = 0; i < text.length; i++) {
      const nextChar = this.transformInput(text.charAt(i), i)

      if (!this.validateInput(nextChar, i)) break // Ignore everything after first invalid character.

      value += nextChar
    }

    return value + this.getNextMask(value)
  }

  /**
   * Value sent to onchange handler based on whether mask characters are included or not.
   */
  getTargetValue = (value) => {
    if (!value) return value

    let unmaskedValue = ''
    const masks = this.maskMetadata
    if (this.props.includeMaskChars) {
      return value
    }

    Array.prototype.forEach.call(value, (token, i) => {
      unmaskedValue += masks[i].getToken ? '' : token
    })

    return unmaskedValue
  }

  /**
   * Returns the next set of mask characters after current input
   *
   * @param {String} value
   * @return {String} nextMask
   */
  getNextMask = (value) => {
    const start = value.length
    const maskMetadata = this.maskMetadata
    if (!(maskMetadata[start] && maskMetadata[start].getToken)) {
      return ''
    }
    const subMask = maskMetadata.slice(start)
    const end = subMask.findIndex((mask) => !mask.getToken)

    return subMask
      .slice(0, end < 0 ? subMask.length : end)
      .map((mask) => mask.getToken())
      .join('')
  }

  /**
   * Removes last character (including mask)
   */
  removeLastChar(value: string) {
    if (!value.length) return

    const masks = this.maskMetadata

    if (!masks[value.length - 1].getToken) {
      return value.slice(0, value.length - 1)
    }

    const appliedMasks = masks.slice(0, value.length)
    const maskStartIndex = findLastIndex(appliedMasks, (mask) => !mask.getToken)

    return value.slice(0, maskStartIndex < 0 ? 0 : maskStartIndex)
  }

  get attrs() {
    const {
      children,
      className,
      includeMaskChars,
      masks,
      onChange,
      pattern,
      placeholder,
      value,
      ...props
    } = this.props

    return props
  }

  render() {
    const value = this.getDisplayValue(
      typeof this.props.value === 'string' ? this.props.value : ''
    )
    const placeholder = this.getUpdatedPlaceholder(value)
    const isEditable = !(this.props.readOnly || this.props.disabled)
    const autoComplete = this.props.autoComplete || 'on'

    return (
      <div className={classnames(this.props.className, 'container')}>
        <input
          {...this.attrs}
          className={classnames('input', 'masked-input')}
          value={value}
          onKeyPress={isEditable ? this.handleKeyPress : null}
          onKeyDown={isEditable ? this.handleKeyDown : null}
          onChange={() => {}}
          maxLength={this.maskMetadata.length}
          autoComplete={autoComplete}
        />
        <input
          className={classnames('mask', 'input', {
            disabled: !isEditable,
          })}
          value={placeholder}
          readOnly
          tabIndex={-1}
        />
      </div>
    )
  }
}
