import React from 'react'
import UIKitContext from '@myntra/uikit-context'

export default function UIKitContextLink(props) {
  return (
    <UIKitContext.Consumer>
      {({ Link }) => <Link {...props} />}
    </UIKitContext.Consumer>
  )
}
