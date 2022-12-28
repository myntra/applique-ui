import React from 'react'
import UIKitContext from '@applique-ui/uikit-context'

export default function UIKitContextLink(props) {
  return (
    <UIKitContext.Consumer>
      {({ Link }) => <Link {...props} />}
    </UIKitContext.Consumer>
  )
}
