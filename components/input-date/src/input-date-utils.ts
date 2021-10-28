import { parse as _parse, format as _format } from 'date-fns'

import { DateRange, StringDateRange, is } from './input-date-helpers'
export const RE_ISO_DATE = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)$/

function padStartWithZeros(value: string | number, digits: number = 2) {
  return `${value}`.padStart(digits, '0')
}

export function UTCDate(year: number, month: number, date: number) {
  return new Date(
    `${padStartWithZeros(year, 4)}-${padStartWithZeros(
      month + 1
    )}-${padStartWithZeros(date)}T00:00:00.000Z`
  )
}

export function onlyDate(date: Date | { toDate(): Date }) {
  if (!(date instanceof Date)) {
    date = date.toDate() // dayjs interop.
  }

  return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

export function parse(str: string | Date, format: string) {
  if (str instanceof Date) return str
  if (typeof str !== 'string' || str === '') return null
  if (RE_ISO_DATE.test(str)) return new Date(str)
  if (!format) throw new Error(`'format' is required.`)

  const date = _parse(str, format, new Date())

  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return UTCDate(date.getFullYear(), date.getMonth(), date.getDate())
  }

  throw new Error(`Date parse exception: '${str}' does not match '${format}'`)
}

export function format(
  value: Date | string | { from?: Date | string; to?: Date | string },
  pattern: string
) {
  if (!value) return value
  if (!pattern) throw new Error(`'format' is required.`)
  if (value instanceof Date) return _format(value, pattern)
  if (typeof value === 'string') return format(parse(value, pattern), pattern)

  const result: { from?: Date; to?: Date } = {}
  if (value.from) result.from = format(value.from, pattern)
  if (value.to) result.to = format(value.to, pattern)
  return result
}

export function isDateEqual(a: any, b: any) {
  if (!(a instanceof Date)) return false
  if (!(b instanceof Date)) return false
  if (a.getTime() === b.getTime()) return true

  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  )
}
