import React, { useContext } from 'react'
import UIKitContext from '@myntra/uikit-context'

export default function UIKitContextRouterLink(props) {
  const { RouterLink } = useContext(UIKitContext)

  return <RouterLink {...props} />
}
