import React, { useContext } from 'react'
import UIKitContext from '@mapplique/uikit-context'

export default function UIKitContextRouterLink(props) {
  const { RouterLink } = useContext(UIKitContext)

  return <RouterLink {...props} />
}
