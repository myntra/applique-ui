import React from 'react'
import classnames from './alert-tag.module.scss'

export interface AlertTagProps extends BaseProps {
  tagLabel: string
  tagType: 'beta' | 'new'
}

export default function AlertTag({ tagLabel, tagType }: AlertTagProps) {
  return <div className={classnames('tag-border', tagType)}>{tagLabel}</div>
}
