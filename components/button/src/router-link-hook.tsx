import React, { useContext } from 'react'
import UIKitContext from '@applique-ui/uikit-context'

export default function UIKitContextRouterLink(props) {
  const { RouterLink } = useContext(UIKitContext)

  return <RouterLink {...props} />
}
