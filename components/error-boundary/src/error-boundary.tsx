import React, { Component } from 'react'

export interface Props extends BaseProps {
  /**
   * Render fallback content in case of error.
   */
  renderFallback?(props: { hasError: boolean; error: Error; info: string })
}

/**
 * Contains errors in child components.
 *
 * @since 0.0.0
 * @status REVIEWING
 * @category basic
 */
export default class ErrorBoundary extends Component<
  Props,
  {
    hasError: boolean
    error?: Error
    info?: string
  }
> {
  static defaultProps = {
    renderFallback: () => <p>{'Oops!!! Something went wrong'}</p>,
  }

  state = { hasError: false }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info })
  }

  render() {
    if (this.state.hasError) {
      return this.props.renderFallback(this.state as any)
    }

    return this.props.children
  }
}
