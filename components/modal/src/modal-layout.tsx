import React, { ReactNode } from 'react'

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
}: Props) {
  return (
    <div className={classnames('wrapper')}>
      {title && <h1 className={classnames('title')}>{title}</h1>}

      {children}

      {actions && (
        <div className={classnames('actions')}>
          {typeof actions === 'function' ? actions(onClose) : actions}
        </div>
      )}
    </div>
  )
}
