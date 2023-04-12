import React, { ReactNode } from 'react'
import { MODAL_TYPE } from './constants'

import classnames from './modal-layout.module.scss'

export interface Props extends BaseProps {
  /**
   * The title of the modal.
   */
  title?: ReactNode
  /**
   * Display action buttons.
   */
  actions?: ReactNode | ((close: () => void) => void)
  /**
   *  Enable/Disable the modal close behaviour on clicking outside content.
   */
  closeOnClickAway?: boolean
  /**
   * The callback function called on modal is closed.
   */
  onClose?(): void

  type?: 'MOBILE_DRAWER' | 'MOBILE' | 'DESKTOP'
}

/**
 * A layout component to display a card (used for Modal component).
 *
 * @since 0.3.0
 * @status REVIEWING
 * @category layout
 * @see http://uikit.myntra.com/components/modal#modal-layout
 */
export default function ModalLayout({
  title,
  actions,
  children,
  onClose,
  type = 'DESKTOP',
}: Props) {
  return (
    <div
      className={classnames('wrapper', {
        ['drawer-wrapper']: type === MODAL_TYPE.MOBILE_DRAWER,
      })}
    >
      {title && <h1 className={classnames('title')}>{title}</h1>}

      <div>{children}</div>

      {actions && (
        <div
          className={classnames('actions', {
            ['drawer-actions']: type === MODAL_TYPE.MOBILE_DRAWER,
          })}
        >
          {typeof actions === 'function' ? actions(onClose) : actions}
        </div>
      )}
    </div>
  )
}
