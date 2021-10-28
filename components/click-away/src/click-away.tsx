import { PureComponent, RefObject } from 'react'

export interface Props {
  /**
   * Reference to the container which requires click away functionality.
   */
  target: RefObject<HTMLElement>
  /**
   * The handler to call when click-away is triggered.
   */
  onClickAway: (event: MouseEvent) => void
  /**
   * Browser event which triggers click-away.
   */
  domEventName?: 'click' | 'mousedown' | 'mouseup'
}

/**
 * Watch for clicks outside the target element.
 *
 * @since 0.0.0
 * @status REVIEWING
 * @category advanced
 */
export default class ClickAway extends PureComponent<Props> {
  static defaultProps = {
    domEventName: 'click',
  }

  componentDidUpdate(oldProps) {
    if (oldProps.domEventName !== this.props.domEventName) {
      this.unregister(oldProps.domEventName)
      this.register()
    }
  }

  componentDidMount() {
    this.register()
  }

  componentWillUnmount() {
    this.unregister()
  }

  register() {
    document.addEventListener(this.props.domEventName, this.handleClickAway, {
      passive: true,
    })
  }

  unregister(eventName: string = this.props.domEventName) {
    document.removeEventListener(eventName, this.handleClickAway)
  }

  handleClickAway = (event) => {
    if (!this.props.target) return

    const path =
      event.path || (event.composedPath ? event.composedPath() : undefined)

    if (
      path
        ? path.indexOf(this.props.target.current) < 0
        : event.target !== this.props.target.current &&
          !this.props.target.current.contains(event.target)
    ) {
      this.props.onClickAway(event)
    }
  }

  render() {
    return null
  }
}
