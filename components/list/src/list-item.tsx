import React from 'react'
import InputCheckbox from '@myntra/uikit-component-input-checkbox'
import InputRadio from '@myntra/uikit-component-input-radio'
import classnames from './list.module.scss'

export interface Props extends BaseProps {
  /**
   * Unique Id for the list item
   */
  id: string
  /**
   * Index in the List
   */
  index: number
  /**
   * Is the Item Selected
   */
  isSelected: boolean
  /**
   * Is the item Active
   */
  isActive: boolean
  /**
   * Is the item Disabled
   */
  isDisabled: boolean
  /**
   * If none then no interaction element is rendered. Otherwise a radio list/ checkbox list is rendered
   */
  interaction: 'none' | 'radio' | 'checkbox'
  /**
   * Style for the List HTML Element
   */
  style: any
  /**
   * onClick Handler
   */
  handleClick(): void
}

/**
 * List Item to render each row in the list
 *
 * @since 0.0.0
 * @status READY
 * @category input
 * @see http://uikit.myntra.com/components/list
 */
export default function ListItem({
  id,
  index,
  isSelected,
  isActive,
  isDisabled,
  style,
  interaction = 'none',
  handleClick,
  children,
}: Props) {
  return (
    <li
      key={id}
      role="option"
      aria-selected={isSelected}
      id={id}
      data-index={index}
      data-id={id}
      style={style}
      className={classnames('item', {
        'is-selected': isSelected,
        'is-active': isActive,
        'is-disabled': isDisabled,
      })}
      onClick={(e) => {
        console.log(e)
        handleClick()
      }}
    >
      {interaction === 'radio' ? (
        <InputRadio
          className={classnames('radio')}
          value={isSelected ? 'ok' : 'error'}
          options={[{ value: 'ok', label: '' }]}
        />
      ) : interaction === 'checkbox' ? (
        <InputCheckbox
          className={classnames('checkbox')}
          value={isSelected}
          htmlValue={id}
          tabIndex={-1}
          readOnly
          hidden={true}
          disabled={isDisabled}
        />
      ) : null}
      {children}
    </li>
  )
}
