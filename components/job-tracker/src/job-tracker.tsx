import React, { PureComponent } from 'react'
import dayJS from 'dayjs'

import JobTrackerItem, {
  Props as JobTrackerItemProps,
} from './job-tracker-item'
import classnames from './job-tracker.module.scss'
import { isNullOrUndefined } from '@myntra/uikit-utils'

export type Job = Pick<
  JobTrackerItemProps,
  Exclude<keyof JobTrackerItemProps, 'className' | 'children' | 'apiRoot'>
>

export interface Props extends BaseProps {
  /**
   * A list of job items.
   */
  data?: Job[]
  /**
   * API Root for downloading job files.
   */
  apiRoot: string
  /**
   * Backend service getting used
   */
  service: 'jobtracker' | 'workflow'
  /**
   * The date format to format value for displaying.
   */
  dateFormat?: string
}

/**
 * The JobTracker component.
 * @since 0.6.0
 * @status REVIEWING
 * @category widget
 * @see http://uikit.myntra.com/components/job-tracker
 */
export default class JobTracker extends PureComponent<Props> {
  static propTypes = {
    __$validation({ dateFormat }) {
      if (isNullOrUndefined(dateFormat) || !dateFormat)
        throw new Error(
          `The props dateFormat should have a proper format. Refer this https://day.js.org/docs/en/display/format`
        )
    },
  }

  static defaultProps = {
    service: 'jobtracker',
    dateFormat: 'DD MMM, YYYY',
  }

  render() {
    const { data, className, children, dateFormat, ...childProps } = this.props
    const jobsByDate = {}
    const jobs = Array.isArray(data) ? data : []

    jobs.forEach((job) => {
      const date = dayJS(job.createdOn).format(dateFormat)
      if (!jobsByDate.hasOwnProperty(date)) {
        jobsByDate[date] = []
      }

      jobsByDate[date].push(job)
    })

    return (
      <div className={className}>
        {Object.keys(jobsByDate).map((date) => (
          <div key={date} data-test-id="group">
            <div className={classnames('date')} data-test-id="date">
              {date}
            </div>
            <div className={classnames('jobs')}>
              {jobsByDate[date].map((job) => (
                <JobTrackerItem
                  className={classnames('job')}
                  {...job}
                  key={job.id}
                  data-test-id="group-item"
                  {...childProps}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
}
