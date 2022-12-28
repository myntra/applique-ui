import React, { useContext } from 'react'
import UIKitContext from '@applique-ui/uikit-context'

export default function UIKitContextLink(props) {
  const { Link } = useContext(UIKitContext)

  return <Link {...props} />
}
