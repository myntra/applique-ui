import React from 'react'
import UIKitContext from '@myntra/uikit-context'

export default function UIKitContextRouterLink(props) {
  return (
    <UIKitContext.Consumer>
      {({ RouterLink }) => <RouterLink {...props} />}
    </UIKitContext.Consumer>
  )
}
