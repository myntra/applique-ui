import React, { PureComponent, Component } from 'react'
import classnames from './top-nav-sidebar.module.scss'
import Context, { TopNavContext } from './context'
import Layout from '@myntra/uikit-component-layout'
import ChevronDownSolid from 'uikit-icons/svgs/ChevronDownSolid'
import ChevronUpSolid from 'uikit-icons/svgs/ChevronUpSolid'
import Bell from 'uikit-icons/svgs/BoxSolid'
import Icon from '@myntra/uikit-component-icon'

export interface Props extends BaseProps {
  classname?: string
  data?: any
}

/**
 * <Component description goes here>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */

export default class TopNavSidebarMenu extends PureComponent<
  Props,
  { isOpen: boolean }
> {
  state = {
    isOpen: false,
  }

  componentDidMount(): void {
    this.setState({ isOpen: this.props.isActive })
  }

  render() {
    const { data, isActive, activeItem, onItemClick } = this.props
    return (
      <React.Fragment>
        <li
          className={classnames(
            'sidebar-menu-child',
            'sidebar-menu-dropdown',
            isActive ? 'active-link' : null
          )}
          onClick={() => {
            this.setState({ isOpen: !this.state.isOpen })
          }}
        >
          <Layout type="stack" gutter="none" alignment="middle">
            <Icon className="sidebar-menu-icon" name={Bell} />
            <div
              className={classnames(
                'sidebar-menu-link-title',
                isActive ? 'active-link' : null
              )}
            >
              {data.title}
            </div>
            <Icon
              className={classnames('sidebar-menu-chevron')}
              name={this.state.isOpen ? ChevronUpSolid : ChevronDownSolid}
            />
          </Layout>
        </li>
        {this.state.isOpen &&
          data.data.map((child) => {
            return (
              <label
                className={classnames('sidebar-menu-child-link')}
                onClick={() => onItemClick(child)}
              >
                <li
                  className={classnames(
                    'sidebar-menu-child',
                    'sidebar-menu-dropdown-link'
                  )}
                  key={child.title}
                >
                  <Layout type="stack" gutter="none">
                    <Icon className="sidebar-menu-icon" name={null} />
                    <div
                      className={classnames(
                        'sidebar-menu-link-title',
                        isActive && child.title == activeItem
                          ? 'active-link'
                          : null
                      )}
                    >
                      {child.title}
                    </div>
                  </Layout>
                </li>
              </label>
            )
          })}
      </React.Fragment>
    )
  }
}
