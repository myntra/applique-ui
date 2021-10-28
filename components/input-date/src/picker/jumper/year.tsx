import React from 'react'

export interface Props extends BaseProps {
  value: number
  onChange(year: number): void
}

export default function Year({
  value: year,
  onChange: onYearSelect,
  ...props
}: Props) {
  let startYearValue = year - 10
  let endYearValue = year + 10
  const yearArray = []
  if (startYearValue < 0) {
    startYearValue = 0
    endYearValue = 20
  }
  for (let i = startYearValue; i < endYearValue; i++) {
    yearArray.push(i)
  }

  return (
    <div {...props}>
      <select
        value={year}
        tabIndex={-1}
        onChange={(event) => onYearSelect(Number(event.target.value))}
      >
        {yearArray.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}
