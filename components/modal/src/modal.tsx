import React, {
  PureComponent,
  Fragment,
  ReactNode,
  isValidElement,
} from 'react'
import Button from '@applique-ui/button'
import Portal from '@applique-ui/portal'

import classnames from './modal.module.scss'
import ModalLayout, { Props as ModalLayoutProps } from './modal-layout'
import TimesSolid from 'uikit-icons/svgs/TimesSolid'
import ChevronDownSolid from 'uikit-icons/svgs/ChevronDownSolid'
import { MODAL_TYPE } from './constants'

export interface Props extends BaseProps, ModalLayoutProps {
  /** An element which opens the modal. */
  trigger: ReactNode

  /** Controls the state of the modal. */
  isOpen: boolean

  /** Hides the close button (small cross icon in top-right corner). */
  hideClose?: boolean

  /**
   * The callback function called on modal is opened.
   */
  onOpen?(): void

  /**
   * Render modal contents in a custom layout.
   */
  render?(props: ModalLayoutProps): JSX.Element
}

// eslint-disable-next-line
const FragmentWithFallback =
  Fragment ||
  (({ children }) => <div style={{ display: 'contents' }}>{children}</div>)

/**
 * A component to display popup modal.
 *
 * @since 0.3.0
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/modal
 */
export default class Modal extends PureComponent<Props> {
  static Layout = ModalLayout

  static defaultProps = {
    render(props) {
      return <ModalLayout {...props} />
    },
  }

  state = {
    isOpen: false,
  }

  constructor(props) {
    super(props)

    if (props.isOpen) {
      this.addBodyClass()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpen !== this.props.isOpen) {
      if (this.props.isOpen) {
        this.addBodyClass()
      } else {
        this.removeBodyClass()
      }
    }
  }

  componentWillUnmount() {
    this.removeBodyClass()
  }

  addBodyClass = () => document.body.classList.add('aui-modal-is-open')
  removeBodyClass = () => document.body.classList.remove('aui-modal-is-open')

  handleOpen = () => {
    this.setState({ isOpen: true }, this.addBodyClass)
    this.props.onOpen && this.props.onOpen()
  }

  handleClose = () => {
    this.setState({ isOpen: false }, this.removeBodyClass)
    this.props.onClose && this.props.onClose()
  }

  render() {
    const {
      className,
      trigger,
      children,
      isOpen,
      render,
      title,
      actions,
      hideClose,
      closeOnClickAway,
      onOpen,
      type = 'DESKTOP',
      ...props
    } = this.props

    const renderContent = () => (
      <div className={classnames('modal', className)} {...props}>
        <div
          className={classnames('backdrop')}
          onClick={closeOnClickAway == false ? null : this.handleClose}
        />
        <div
          className={classnames('body', {
            'drawer-body': type === MODAL_TYPE.MOBILE_DRAWER,
            side_drawer_body: type === MODAL_TYPE.SIDE_DRAWER,
          })}
        >
          {render({
            title,
            actions,
            children,
            onClose: this.handleClose,
            type,
          })}

          {hideClose ? null : (
            <div
              className={classnames('close', {
                ['drawer-close']: type === MODAL_TYPE.MOBILE_DRAWER,
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
          <Button
            type="secondary"
            secondaryIcon={ChevronDownSolid}
            onClick={this.handleOpen}
          >
            {trigger}
          </Button>
        ) : isValidElement(trigger) ? (
          React.cloneElement(trigger, { onClick: this.handleOpen } as any)
        ) : null}
        {(typeof isOpen === 'boolean' ? isOpen : this.state.isOpen) && (
          <Portal container>{renderContent()}</Portal>
        )}
      </FragmentWithFallback>
    )
  }
}
