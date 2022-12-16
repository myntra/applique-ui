import React from 'react'
import UIKitContext from '@mapplique/uikit-context'

export default function UIKitContextLink(props) {
  return (
    <UIKitContext.Consumer>
      {({ Link }) => <Link {...props} />}
    </UIKitContext.Consumer>
  )
}
