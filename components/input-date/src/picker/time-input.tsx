import React from 'react'
import Icon from '@applique-ui/icon'
import InputNumber from '@applique-ui/input-number'
import ChevronDownSolid from 'uikit-icons/svgs/ChevronDownSolid'
import ChevronUpSolid from 'uikit-icons/svgs/ChevronUpSolid'
import classnames from './time-input.module.scss'

export interface Props extends BaseProps {
  /** TimeInput onUp event */
  onUp: () => void
  /** TimeInput onDown event */
  onDown: () => void
  /** TimeInput onChange event */
  onChange: (value: number) => void
  /** TimeInput onBlur event */
  onBlur: (e: React.FormEvent<HTMLInputElement>) => void
  /** TimeInput value */
  value: number
}

export default function TimeInput({
  onUp,
  value,
  onChange,
  onBlur,
  onDown,
  ...props
}: Props) {
  return (
    <div className={classnames('time-input')}>
      <div className={classnames('time-input__up')} onClick={onUp}>
        <Icon name={ChevronUpSolid} />
      </div>
      <InputNumber
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={classnames('time-input__text')}
      />
      <div className={classnames('time-input__down')} onClick={onDown}>
        <Icon name={ChevronDownSolid} />
      </div>
    </div>
  )
}
