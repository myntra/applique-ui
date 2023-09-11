import React, { PureComponent, MouseEventHandler } from 'react'
import classnames from './alert-tag.module.scss'

export interface AlertTagProps extends BaseProps {
  tagLabel: string
  tagType: string
}

export default class AlertTag extends PureComponent<AlertTagProps> {
  render() {
    const { tagLabel, tagType } = this.props
    return (
      <div className={classnames('tag-border', tagType)}>
        {this.props.tagLabel}
      </div>
    )
  }
}
