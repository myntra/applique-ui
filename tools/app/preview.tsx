import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// @ts-ignore
import * as components from '@uikit'

export default class Preview extends PureComponent<{
  component: any
  onError: (error: any) => void
}> {
  static propTypes = {
    onError: PropTypes.func.isRequired,
    component: PropTypes.any,
  }

  componentDidCatch(error) {
    this.props.onError(error)
  }

  componentDidUpdate() {
    this.props.onError(null)
  }

  render() {
    const Component = this.props.component
    const { UikitIcons, ...uiComponents } = components
    return (
      <div style={{ padding: '24px' }}>
        {Component ? (
          <Component context={{ ...React, ...uiComponents, ...UikitIcons }} />
        ) : (
          'Example is not working...'
        )}
      </div>
    )
  }
}
