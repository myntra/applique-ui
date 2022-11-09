import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import * as components from '@uikit'
import styles from './styles.scss'

export default class Preview extends PureComponent {
  componentDidUpdate() {
    const { onError } = this.props
    onError(null)
  }

  componentDidCatch(error) {
    const { onError } = this.props
    onError(error)
  }

  render() {
    const { component: Component } = this.props
    const { UikitIcons, ...uiComponents } = components
    return (
      <div className={styles('codeEditor__output')}>
        {Component ? (
          <Component context={{ ...React, ...UikitIcons, ...uiComponents }} />
        ) : (
          'Example is not working...'
        )}
      </div>
    )
  }
}

Preview.propTypes = {
  onError: PropTypes.func.isRequired,
  component: PropTypes.any.isRequired,
}
