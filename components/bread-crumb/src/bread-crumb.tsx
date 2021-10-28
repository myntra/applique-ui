import React, { PureComponent } from 'react'
import classnames from './bread-crumb.module.scss'
import BreadCrumbItem from './bread-crumb-item'

export interface Props extends BaseProps {}

/**
 * The BreadCrumb component.
 *
 * @since 0.3.0
 * @status READY
 * @category basic
 * @see http://uikit.myntra.com/components/bread-crumb
 */
export default class BreadCrumb extends PureComponent<Props> {
  static Item = BreadCrumbItem

  render() {
    const { className, children, ...props } = this.props
    return (
      <nav {...props} className={classnames(className, 'pages')}>
        <ol>{children}</ol>
      </nav>
    )
  }
}
