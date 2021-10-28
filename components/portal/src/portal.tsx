/* eslint react/no-find-dom-node: 0 */
import React, { PureComponent, isValidElement } from 'react'
import ReactDOM from 'react-dom'

let counter = 0

export interface Props {
  /** Attach child to specific component/element */
  container?: boolean | string | HTMLElement
  /** Wrapper <div> */
  wrapper?: HTMLElement
}

/**
 * Declarative way of rendering content outside of react root node.
 *
 * @since 0.0.0
 * @status REVIEWING
 * @category advanced
 */
class Portal extends PureComponent<Props> {
  static isReact15 =
    typeof ReactDOM.createPortal !== 'function' &&
    /* istanbul ignore next: Tests are running with React 16 */
    typeof ReactDOM.unstable_renderSubtreeIntoContainer === 'function'
  static isReact16 = typeof ReactDOM.createPortal === 'function'

  fallback: HTMLDivElement

  constructor(props) {
    super(props)
    this.fallback = document.createElement('div')
    this.fallback.id = `--portal-wrapper-${counter++}--`
  }

  get el() {
    return this.props.wrapper || this.fallback
  }

  get container() {
    return typeof this.props.container === 'boolean'
      ? document.body
      : typeof this.props.container === 'string'
      ? document.querySelector(this.props.container)
      : this.props.container || document.body
  }

  componentDidMount() {
    this.container.appendChild(this.el)
    if (Portal.isReact15) {
      this.fallbackRenderInPortal()
    }
  }

  componentWillUnmount() {
    const container = this.container
    const el = this.el

    setTimeout(() => container.removeChild(el), 1)
  }

  componentDidUpdate() {
    if (Portal.isReact15) {
      this.fallbackRenderInPortal()
    }
  }

  fallbackRenderInPortal() {
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      this.props.children && isValidElement(this.props.children) ? this.props.children : <div>{this.props.children}</div>,
      this.el
    )
  }

  render() {
    if (this.context && this.el) {
      this.el.classList.add(this.context.theme)
    }

    if (Portal.isReact16) {
      return ReactDOM.createPortal(this.props.children, this.el)
    } else if (Portal.isReact15) {
      return null // rendered in componentDidUpdate & componentDidMount
    } else throw new Error('Portal not supported.')
  }
}

export default Portal
