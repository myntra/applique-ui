module.exports = (content, write) =>
  write(
    `import React, { Component } from 'react'
import classnames from './tokens.module.css'

// eslint-disable-next-line react/prop-types
/**
 * @since 0.3.0
 * @status READY
 */
export default class ThemeProvider extends Component {
  static childContextTypes = {
    theme () {
      return null
    }
  }

  getChildContext() {
    return { theme: classnames('theme') }
  }

  render() {
    return React.createElement('div', { className: classnames('theme') }, this.props.children)
  }
}
`
  )
