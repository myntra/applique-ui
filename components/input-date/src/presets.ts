import dayJS from 'dayjs'
import { onlyDate } from './input-date-utils'

export const TODAY = {
  range: false,
  label: 'Today',
  value: () => onlyDate(new Date()),
}

export const YESTERDAY = {
  range: false,
  label: 'Yesterday',
  value: () => onlyDate(dayJS().subtract(1, 'day')),
}

export const CURRENT_WEEK = {
  range: true,
  label: 'Current Week',
  value: () => ({
    from: onlyDate(dayJS().startOf('week')), // TODO(bug): Selects wrong date range.
    to: onlyDate(dayJS()),
  }),
}

export const LAST_7_DAYS = {
  range: true,
  label: 'Last 7 Days',
  value: () => ({
    from: onlyDate(dayJS().subtract(6, 'day')),
    to: onlyDate(dayJS()),
  }),
}

export const LAST_30_DAYS = {
  range: true,
  label: 'Last 30 Days',
  value: () => ({
    from: onlyDate(dayJS().subtract(29, 'day')),
    to: onlyDate(dayJS()),
  }),
}

export const LAST_WEEK = {
  range: true,
  label: 'Last Week',
  value: () => ({
    from: onlyDate(
      dayJS()
        .subtract(1, 'week')
        .startOf('week')
        .day(1)
    ),
    to: onlyDate(
      dayJS()
        .subtract(1, 'week')
        .endOf('week')
    ),
  }),
}

export const LAST_MONTH = {
  range: true,
  label: 'Last Month',
  value: () => ({
    from: onlyDate(
      dayJS()
        .subtract(1, 'month')
        .startOf('month')
        .add(1, 'day')
    ),
    to: onlyDate(
      dayJS()
        .subtract(1, 'month')
        .endOf('month')
    ),
  }),
}

export const LAST_YEAR = {
  range: true,
  label: 'Last Year',
  value: () => ({
    from: onlyDate(
      dayJS()
        .subtract(1, 'year')
        .startOf('year')
        .add(1, 'day')
    ),
    to: onlyDate(
      dayJS()
        .subtract(1, 'year')
        .endOf('year')
    ),
  }),
}
