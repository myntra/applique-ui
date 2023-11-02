import React from "react"
import classnames from './common.component.scss'

const VisuallyHidden: React.DOMAttributes<HTMLDivElement> = ({ children }) => {
    return <div className={classnames('visually-hidden')}>{children}</div>;
}

export default VisuallyHidden