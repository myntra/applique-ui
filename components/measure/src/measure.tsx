import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import ResizeObserver from 'resize-observer-polyfill'

export interface MeasureData {
  readonly bounds: { top: number; left: number; width: number; height: number }
  readonly client: { top: number; left: number; width: number; height: number }
  readonly margin: { top: number; left: number; bottom: number; right: number }
  readonly offset: { top: number; left: number; width: number; height: number }
  readonly scroll: { top: number; left: number; width: number; height: number }
}

export interface Props {
  /**
   * The callback fired when a DOM element is measured.
   */
  onMeasure?(data: MeasureData): void

  children:
    | React.ReactNode
    | ((props: {
        ref: React.RefObject<any>
        content: MeasureData
        measure(): MeasureData
      }) => React.ReactNode)
}

export const createObserver = function() {
  const observer = new ResizeObserver(function(entries) {
    entries.forEach((entry) => {
      const handler = handlers.get(entry.target)

      if (!handler) observer.unobserve(entry.target)
      else handler(entry)
    })
  })

  type Handler = (entry: ResizeObserverEntry) => void

  const handlers = new WeakMap<Element, Handler>()
  const elements = new WeakMap<Handler, Set<Element>>()

  return {
    connect(handler: Handler) {
      const currentElements = new Set<Element>()
      elements.set(handler, currentElements)

      return {
        observe(element: Element) {
          observer.observe(element)
          handlers.set(element, handler)
          currentElements.add(element)
        },
        unobserve(element: Element) {
          observer.unobserve(element)
          handlers.delete(element)
          currentElements.delete(element)
        },
        disconnect() {
          currentElements.forEach((element) => {
            observer.unobserve(element)
          })
          currentElements.clear()
        },
      }
    },
  }
}

export interface Observer {
  observe(element: HTMLElement): void
  unobserve(element: HTMLElement): void
  disconnect(): void
}

const observer = createObserver()

/**
 * A component to declaratively measure element size.
 *
 * @since 0.3.0
 * @status EXPERIMENTAL
 * @category advanced
 */
export default class Measure extends PureComponent<
  Props,
  { content: MeasureData }
> {
  _observer: Observer
  _node: HTMLElement
  _unMounted = false

  constructor(props) {
    super(props)
    this._observer = observer.connect(this.handleMeasure)
    this.state = {
      content: {
        bounds: {},
        client: {},
        margin: {},
        offset: {},
        scroll: {},
      } as any,
    }
  }

  componentWillUnmount() {
    if (this._observer && this._node) {
      this._observer.disconnect()
    }

    this._unMounted = true
  }

  handleMeasure = (entry) => {
    if (!entry || this._unMounted) return
    const content = this.measure(entry.target)

    this.setState({ content })

    if (this.props.onMeasure) {
      this.props.onMeasure(content)
    }
  }

  /**
   * @public
   */
  measure = (node) => {
    node = node || this._node

    if (!node) return

    const content: MeasureData = {
      get bounds() {
        const rect = node.getBoundingClientRect()

        return {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }
      },
      get client() {
        return {
          top: node.clientTop,
          left: node.clientLeft,
          width: node.clientWidth,
          height: node.clientHeight,
        }
      },
      get margin() {
        const styles = window.getComputedStyle(node)

        return {
          top: parseInt(styles.marginTop),
          right: parseInt(styles.marginRight),
          bottom: parseInt(styles.marginBottom),
          left: parseInt(styles.marginLeft),
        }
      },
      get offset() {
        return {
          top: node.offsetTop,
          left: node.offsetLeft,
          width: node.offsetWidth,
          height: node.offsetHeight,
        }
      },
      get scroll() {
        return {
          top: node.scrollTop,
          left: node.scrollLeft,
          width: node.scrollWidth,
          height: node.scrollHeight,
        }
      },
    }

    return content
  }

  handleRef = (node) => {
    if (!this._observer || this._node === node) return

    if (node) {
      if (!(node instanceof HTMLElement)) {
        try {
          node = ReactDOM.findDOMNode(node) // eslint-disable-line react/no-find-dom-node
        } catch (e) {
          console.error(e) // TODO: Capture errors in sentry.

          return
        }
      }

      this._observer.observe(node)

      if (this._node === node) return

      // ResizeObserver does not call on initial render.
      // Call handleMeasure in next macro task.
      setTimeout(
        () =>
          this.handleMeasure({
            target: node,
            get contentRect() {
              return node.getBoundingClientRect()
            },
          }),
        0
      )
    }

    if (this._node) {
      this._observer.unobserve(this._node)
    }

    this._node = node
  }

  render() {
    const { children } = this.props
    if (typeof children === 'function') {
      return (children as any)({
        ref: this.handleRef,
        measure: this.measure,
        content: this.state.content,
      })
    }

    if (!React.isValidElement(children)) {
      return null
    }

    return React.cloneElement(React.Children.only(children), {
      ref: this.handleRef,
    } as any)
  }
}
