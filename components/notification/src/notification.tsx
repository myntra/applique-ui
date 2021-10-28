import React, {
  PureComponent,
  Fragment,
  ReactNode,
  isValidElement,
} from 'react'
import classnames from './notification.module.scss'
import Button from '@myntra/uikit-component-button'
import TimesSolid from 'uikit-icons/svgs/TimesSolid'

export interface Props extends BaseProps {
  /** An element which opens the modal. */
  trigger: ReactNode

  /**
   * The title of the notification container.
   */
  title: string

  /**
   * The custom class name of the notification container.
   */
  className: string

  /**
   * Controls whether to show the overlay when Notification is opened
   */
  removeOverlay: boolean

  /**
   * Whether to remove the close button
   */
  removeClose: boolean

  /**
   * Control Notification window state.
   */
  isOpen?: boolean

  /**
   * List of notification items
   */
  children: React.ReactNode

  /**
   * Whether to close the side drawer on click outside
   */
  closeOnClickAway: boolean

  /**
   * The callback function called on notification panel is opened.
   */
  onOpen?(): void
}

// eslint-disable-next-line
const FragmentWithFallback =
  Fragment ||
  (({ children }) => <div style={{ display: 'contents' }}>{children}</div>)

/**
 * A component to render notifications.
 *
 * @since 1.13.4
 * @status REVIEWING
 * @category functional
 * @see http://uikit.myntra.com/components/notification
 */

export default class Notification extends PureComponent<
  Props,
  { isOpen: boolean }
> {
  state = {
    isOpen: false,
  }

  constructor(props) {
    super(props)
  }

  get isOpen(): boolean {
    // Controlled Notification window
    if (typeof this.props.isOpen === 'boolean') return this.props.isOpen

    // Uncontrolled Notification window
    return this.state.isOpen
  }

  handleClose = () => {
    this.setState({ isOpen: false })
    this.props.onClose && this.props.onClose()
  }

  handleOpen = () => {
    this.setState({ isOpen: true })
    this.props.onOpen && this.props.onOpen()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpen !== this.props.isOpen) {
      this.props.isOpen ? this.handleOpen() : this.handleClose()
    }
  }

  render() {
    const {
      children,
      title,
      closeOnClickAway,
      removeOverlay,
      trigger,
      removeClose,
      className,
    } = this.props

    const isOpen = this.isOpen

    const renderContent = () => (
      <div
        className={classnames('notification', className, {
          'is-open': isOpen,
        })}
      >
        {isOpen && !removeOverlay && (
          <div
            className={classnames('backdrop')}
            onClick={closeOnClickAway == false ? null : this.handleClose}
          />
        )}

        <div className={classnames('body')}>
          <div className={classnames('title')}>{title || 'Notifications'}</div>
          <div className={classnames('content')}>{children}</div>

          {this.isOpen && !removeClose && (
            <div
              className={classnames('close', {
                'no-overlay': removeOverlay,
              })}
            >
              <Button
                inheritTextColor
                type="link"
                icon={TimesSolid}
                title="close"
                onClick={this.handleClose}
              />
            </div>
          )}
        </div>
      </div>
    )

    return (
      <FragmentWithFallback>
        {typeof trigger === 'string' ? (
          <Button type="secondary" onClick={this.handleOpen}>
            {trigger}
          </Button>
        ) : isValidElement(trigger) ? (
          React.cloneElement(trigger, { onClick: this.handleOpen } as any)
        ) : null}
        {renderContent()}
      </FragmentWithFallback>
    )
  }
}
