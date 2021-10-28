import React, { PureComponent, isValidElement, ReactElement } from 'react'
import BreadCrumb from '@myntra/uikit-component-bread-crumb'
import Dropdown from '@myntra/uikit-component-dropdown'
import List from '@myntra/uikit-component-list'
import classnames from './top-bar.module.scss'
import Item from './top-bar-item'
import Icon from '@myntra/uikit-component-icon'
import { isReactNodeType, is } from '@myntra/uikit-utils'

import ChevronUpSolid from 'uikit-icons/svgs/ChevronUpSolid'
import ChevronDownSolid from 'uikit-icons/svgs/ChevronDownSolid'
import UserCircleSolid from 'uikit-icons/svgs/UserCircleSolid'
import SignInAltSolid from 'uikit-icons/svgs/SignInAltSolid'

export interface Props extends BaseProps {
  title: string
  user?: Partial<{ name: string; photo: string }> & { email: string }
  headerNavigationElem?: JSX.Element
}

/**
 * A component for page header
 *
 * @since 0.3.0
 * @status READY
 * @category basic
 * @see http://uikit.myntra.com/components/top-bar
 */
export default class TopBar extends PureComponent<Props, { isOpen: boolean }> {
  static Item = Item

  state = {
    isOpen: false,
  }

  handleOpen = () => this.setState({ isOpen: true })
  handleClose = () => this.setState({ isOpen: false })

  render() {
    const {
      children,
      className,
      title,
      user,
      headerNavigationElem,
      ...props
    } = this.props
    const breadcrumbs = []
    const actions = []
    const others = []

    React.Children.forEach(children, (child) => {
      if (isReactNodeType(child, BreadCrumb)) {
        breadcrumbs.push(child)
      } else if (isReactNodeType(child, Item)) {
        actions.push(child)
      } else {
        others.push(child)
      }
    })

    return (
      <div {...props} className={classnames('container', className)}>
        {headerNavigationElem ? headerNavigationElem : null}
        <div className={classnames('title')}>
          <h1>{title}</h1>
          {!is.mobile() && breadcrumbs}
        </div>
        <div className={classnames('body')}>{others}</div>
        <nav className={classnames('nav')}>
          <Dropdown
            down
            right
            container
            wrapperClassName={classnames('dropdown')}
            isOpen={this.state.isOpen}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            renderTrigger={(props) => (
              <div className={classnames('user')} {...props}>
                {user ? (
                  user.photo ? (
                    <img
                      className={classnames('user-avatar', 'photo')}
                      src={user.photo}
                    />
                  ) : (
                    <Icon
                      className={classnames('user-avatar')}
                      name={UserCircleSolid}
                    />
                  )
                ) : (
                  <Icon
                    className={classnames('user-avatar')}
                    name={SignInAltSolid}
                  />
                )}
                {!is.mobile() && (
                  <div className={classnames('user-name')}>
                    {user
                      ? user.name
                        ? `${user.name} ${user.email ? `(${user.email})` : ''}`
                        : user.email
                      : 'Login'}
                  </div>
                )}
                {actions.length && !is.mobile() ? (
                  <Icon
                    name={
                      this.state.isOpen
                        ? { ChevronUpSolid }
                        : { ChevronDownSolid }
                    }
                  />
                ) : null}
              </div>
            )}
          >
            <List
              className={classnames('menu')}
              items={actions}
              idForItem={(item) => actions.indexOf(item)}
            >
              {({ item }) => item}
            </List>
          </Dropdown>
        </nav>
      </div>
    )
  }
}
