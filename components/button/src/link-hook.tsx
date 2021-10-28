import React, { useContext } from 'react'
import UIKitContext from '@myntra/uikit-context'

export default function UIKitContextLink(props) {
  const { Link } = useContext(UIKitContext)

  return <Link {...props} />
}
