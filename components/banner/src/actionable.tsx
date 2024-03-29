import React, { PureComponent } from 'react'
import Icon, { IconName } from '@applique-ui/icon'
import Button from '@applique-ui/button'
import Layout from '@applique-ui/layout'
import Text from '@applique-ui/text'
import classnames from './actionable.module.scss'
import TimesSolid from 'uikit-icons/svgs/TimesSolid'

import { ICONS, RE_BACKWARD_COMPAT } from './constants'

export interface Props extends BaseProps {
  data?: {
    /**
     * @deprecated
     */
    type?: 'error' | 'warning' | 'success' | 'info'
    color?: 'error' | 'warning' | 'success' | 'info'
    icon?: IconName
    header?: string
    subHeader?: string
    feedback?: string
    entityName?: string
    entityId?: string
    actionToTake: string | JSX.Element
    actionButtonText: string
    onActionClick?: () => void
    onClose?: () => void
  }
}

/**
 *
 * @since 1.13.19
 * @status READY
 * @category basic
 * @see https://uikit.myntra.com/components/alert
 */

export default class Actionable extends PureComponent<Props> {
  static propTypes = {
    _validate({ data }) {
      if (!data) {
        throw new Error(`Data prop not found.`)
      } else if (!data.color) {
        throw new Error(
          `Color not found in data, default will be taken as info.`
        )
      }
    },
  }

  render() {
    const { data, className, ...props } = this.props

    if (!data) return null

    const {
      color,
      type,
      icon,
      header,
      subHeader,
      feedback,
      entityName,
      entityId,
      actionToTake,
      actionButtonText,
      onClose,
      onActionClick,
    } = data
    const typeName = RE_BACKWARD_COMPAT.test(color)
      ? 'info'
      : color || RE_BACKWARD_COMPAT.test(type)
      ? 'info'
      : type || 'info'
    const iconName = icon === undefined ? ICONS[typeName] : icon

    return (
      <div {...props} className={classnames('actionable', typeName)}>
        <div className={classnames('header')}>
          <Text.h3>{header}</Text.h3>
          <Text.p>{subHeader}</Text.p>
        </div>
        {onClose && (
          <Button
            className={classnames('close')}
            type="link"
            icon={TimesSolid}
            inheritTextColor
            onClick={onClose}
            data-test-id="close"
          />
        )}
        <div className={classnames('contents-wrapper')}>
          <Layout type="stack" className={classnames('contents')}>
            <Icon className={classnames('icon')} name={iconName} />
            <Layout type="row" className={classnames('feedback-contain')}>
              <Text.h1>{feedback}</Text.h1>
              <Text.body emphasis="medium">{entityName}</Text.body>
              <Text.h2 className={classnames('entity-id')}>{entityId}</Text.h2>
              <Text.h3 className={classnames('action-name')}>
                {actionToTake}
              </Text.h3>
              {actionButtonText && (
                <Button //button type has to be added once new button is added
                  className={classnames('action')}
                  inheritTextColor
                  onClick={onActionClick}
                  data-test-id="action"
                  label={actionButtonText}
                />
              )}
            </Layout>
          </Layout>
        </div>
      </div>
    )
  }
}
