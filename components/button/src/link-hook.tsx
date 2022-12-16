import React, { useContext } from 'react'
import UIKitContext from '@mapplique/uikit-context'

export default function UIKitContextLink(props) {
  const { Link } = useContext(UIKitContext)

  return <Link {...props} />
}
