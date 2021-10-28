import React, { PureComponent } from 'react'
import Icon, { IconName } from '@myntra/uikit-component-icon'
import Button from '@myntra/uikit-component-button'
import Layout from '@myntra/uikit-component-layout'
import Text from '@myntra/uikit-component-text'
import classnames from './actionable.module.scss'
import TimesSolid from 'uikit-icons/svgs/TimesSolid'

import { ICONS, RE_BACKWARD_COMPAT } from './constants'

export interface Props extends BaseProps {
  data?: {
    type?: 'error' | 'warning' | 'success'
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
      } else if (!data.type) {
        throw new Error(
          `Type not found in data, default will be taken as error.`
        )
      }
    },
  }

  render() {
    const { data, className, ...props } = this.props

    if (!data) return null

    const {
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

    const bannerType = type || 'error'
    const typeName = RE_BACKWARD_COMPAT.test(bannerType)
      ? 'success'
      : bannerType
    const iconName = icon === undefined ? ICONS[bannerType] : icon

    return (
      <div {...props} className={classnames('actionable', typeName)}>
        <div className={classnames('header')}>
          <Text.h3 color="light">{header}</Text.h3>
          <Text.p color="light">{subHeader}</Text.p>
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
              <Text.h1 color="light">{feedback}</Text.h1>
              <Text.body color="light" emphasis="medium">
                {entityName}
              </Text.body>
              <Text.h2 className={classnames('entity-id')} color="light">
                {entityId}
              </Text.h2>
              <Text.h3 className={classnames('action-name')} color="light">
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
