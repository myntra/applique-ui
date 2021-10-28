import React, { PureComponent, ReactNode } from 'react'
import Button from '@myntra/uikit-component-button'
import Icon, { IconName } from '@myntra/uikit-component-icon'
import Layout from '@myntra/uikit-component-layout'
import Loader from '@myntra/uikit-component-loader'
import T from '@myntra/uikit-component-text'
import dayJS from 'dayjs'

import classnames from './job-tracker-item.module.scss'

import ClockSolid from 'uikit-icons/svgs/ClockSolid'
import ExclamationTriangleSolid from 'uikit-icons/svgs/ExclamationTriangleSolid'
import CheckCircleSolid from 'uikit-icons/svgs/CheckCircleSolid'
import ExclamationCircleSolid from 'uikit-icons/svgs/ExclamationCircleSolid'

export interface Props extends BaseProps {
  /** Job ID */
  id: number
  /** Remarks */
  remark: string
  /** Login Id of job creator */
  createdBy: string
  /** Job creation time */
  createdOn: number
  /** Attachment of other kinds */
  fileName: string
  /** Attachment on job success */
  successFileName: string
  /** Attachment on job error */
  errorFileName: string
  /** Completed Step Count */
  /**
   * @deprecated Not getting used anymore
   */
  completedStepCount: number
  /** Total Step Count */
  /**
   * @deprecated Not getting used anymore
   */
  totalStepCount: number
  /** Remarks renderer */
  renderRemarks(props: Props): ReactNode
  /** Status */
  status: 'IN_PROGRESS' | 'FAILED' | 'COMPLETED' | 'HALTED' | 'INTERRUPTED'
  /** API Root for downloading job tracker files */
  apiRoot: string

  /** Workflow service specific params */

  /**
   * Project name for which job tracker is getting used. Required only when using workflow service
   */
  projectName?: string
  /**
   * Work flow instance id of the job.
   */
  workflowInstanceId?: string
  /**
   * Task instance id of the job
   */
  taskInstance?: number
}

const iconByStatus: Record<string, IconName> = {
  IN_PROGRESS: ClockSolid,
  FAILED: ExclamationTriangleSolid,
  COMPLETED: CheckCircleSolid,
  HALTED: ExclamationCircleSolid,
  INTERRUPTED: ExclamationCircleSolid,
}
const colorByStatus: Record<string, string> = {
  IN_PROGRESS: 'primary',
  FAILED: 'error',
  COMPLETED: 'success',
  HALTED: 'warning',
  INTERRUPTED: 'warning',
}

/**
 * @since 0.6
 * @status REVIEWING
 */
export default class JobTrackerItem extends PureComponent<Props> {
  static defaultProps = {
    renderRemarks: ({ remark }) => <div>{remark}</div>,
    status: 'IN_PROGRESS',
  }

  render() {
    const {
      status,
      id,
      renderRemarks,
      createdBy,
      createdOn,
      fileName,
      successFileName,
      apiRoot,
      errorFileName,
      className,
      service,
      projectName,
      workflowInstanceId,
      taskInstance,
      ...props
    } = this.props

    const statusName = (status || '').replace('_', ' ').toLowerCase()
    const iconName = iconByStatus[status]
    const getDownloadURL = (type) => {
      switch (service) {
        case 'jobtracker':
          return `${apiRoot}/api/jobtracker/download?jobId=${id}&fileType=${type}`
        case 'workflow':
          return `${apiRoot}/api/${projectName}/jobsTracker/DownloadResultFile/?workflowInstanceId=${workflowInstanceId}&taskInstance=${taskInstance}`
      }
    }
    const isLoading = status === 'IN_PROGRESS'
    const needLoader = !(
      fileName ||
      successFileName ||
      errorFileName ||
      ['COMPLETED', 'FAILED'].includes(status)
    )
    return (
      <Layout
        className={classnames(className, 'item')}
        type="row"
        gutter="small"
      >
        <Layout type="stack" space={[1]} alignment="middle">
          <T.h3>{id}</T.h3>
          <T.p>{createdBy}</T.p>
        </Layout>
        <Layout type="stack" space={[1]} alignment="middle">
          <div>
            <T.p emphasis="medium" abstract>
              {renderRemarks(this.props)}
            </T.p>
          </div>
          <T.p emphasis="medium">{dayJS(createdOn).format('hh:mm A')}</T.p>
        </Layout>
        <Layout type="row" gutter="large">
          <Layout type="stack" space={[, 1]} alignment="middle">
            <T.body className={classnames('field')}>
              <Icon
                name={iconName}
                className={classnames('icon', colorByStatus[status])}
              />{' '}
              Status: {statusName}
            </T.body>
            <T.body className={classnames('actions')}>
              {fileName ? (
                <Button
                  type="text"
                  className={classnames('primary')}
                  href={getDownloadURL('file')}
                  download={fileName}
                  inheritTextColor
                >
                  Download File
                </Button>
              ) : null}
              {successFileName ? (
                <Button
                  type="text"
                  className={classnames('success')}
                  href={getDownloadURL('success-file')}
                  download={successFileName}
                  inheritTextColor
                >
                  Download Success File
                </Button>
              ) : null}
              {errorFileName ? (
                <Button
                  type="text"
                  className={classnames('error')}
                  href={getDownloadURL('error-file')}
                  download={errorFileName}
                  inheritTextColor
                >
                  Download Error File
                </Button>
              ) : null}
            </T.body>
          </Layout>
          {needLoader ? (
            <Loader
              className={classnames('loader')}
              type="inline"
              appearance="bar"
              isLoading={isLoading}
            />
          ) : null}
        </Layout>
      </Layout>
    )
  }
}
