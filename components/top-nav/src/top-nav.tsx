import React, { PureComponent } from 'react'
import classnames from './top-nav.module.scss'
import Context from './context'
import TopNavItem from './top-nav-item'
import Layout from '@myntra/uikit-component-layout'
import MyntraLogo from 'uikit-icons/svgs/MyntraLogo'
import TopNavHover from './top-nav-hover'
import TopNavSidebar from './top-nav-sidebar'
import Button from '@myntra/uikit-component-button'
import Icon from '@myntra/uikit-component-icon'
import CheckSolid from 'uikit-icons/svgs/CheckSolid'
import Bell from 'uikit-icons/svgs/Bell'
import { fullData } from './utils'
import Dropdown from '@myntra/uikit-component-dropdown'
import QuickLinkHover from './quicklink-hover'

export interface Props extends BaseProps {
  /** @private */
  className?: string
}

/**
 * <Component description goes here>
 *
 * @since 1.13.101
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/top-nav
 */
export default class TopNav extends PureComponent<
  Props,
  {
    isHovering: boolean
    hoverTitle: string
    position: number
    sidebarTitle: string
    sidebarEnabled: boolean
    activeMenu: string
    activeItem: string
    quickLinkHover: boolean
    quickLinkPos: any
    quickLinkRenderItem: any
  }
> {
  state = {
    isHovering: false,
    hoverTitle: null,
    position: null,
    sidebarEnabled: false,
    sidebarTitle: null,
    activeMenu: null,
    activeItem: null,
    quickLinkHover: false,
    quickLinkPos: null,
    quickLinkRenderItem: null,
  }

  enableHover = (index, title) => {
    const parent = document.getElementsByClassName('tabs-container')[0]
    const position =
      parent.children[index].getBoundingClientRect().left -
      parent.getBoundingClientRect().left / 2
    this.setState({ isHovering: true, position, hoverTitle: title })
  }
  disableHover = () => {
    this.setState({ isHovering: false })
  }

  handleClick = () => {
    const defaultState = {
      isHovering: false,
      position: null,
      sidebarEnabled: false,
      activeMenu: null,
      activeItem: null,
    }
    console.log('Clicked')
    this.setState({ ...defaultState })
  }

  hoverItemClicked = (item) => {
    this.setState({
      sidebarEnabled: true,
      sidebarTitle: this.state.hoverTitle,
      activeMenu: item.menuTitle,
      activeItem: item.clickedTitle,
    })
  }

  showState = () => {
    console.log(this.state)
  }

  enableQuickLinkHover = (event, renderFunction) => {
    const endPos = event.currentTarget.getBoundingClientRect()
    this.setState({
      quickLinkHover: !this.state.quickLinkHover,
      quickLinkPos: endPos,
      quickLinkRenderItem: renderFunction,
    })
  }

  renderADiv = () => {
    return (
      <div>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
        </ul>
      </div>
    )
  }

  render() {
    const labels = Object.keys(fullData)
    const {
      isHovering,
      sidebarEnabled,
      activeItem,
      activeMenu,
      quickLinkHover,
    } = this.state
    const quickLinks = [
      {
        icon: Bell,
        renderFunction: () => {
          return (
            <div>
              <ul>
                <li>First Item 1</li>
                <li>First Item 2</li>
                <li>Item 3</li>
                <li>Item 4</li>
              </ul>
            </div>
          )
        },
      },
      {
        icon: CheckSolid,
        renderFunction: () => {
          return (
            <div>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Second Item 3</li>
                <li>Second Item 4</li>
              </ul>
            </div>
          )
        },
      },
    ]
    return (
      <Context.Provider
        value={{
          isOpen: true,
        }}
      >
        <Layout
          type="stack"
          gutter="none"
          className={classnames('header-container')}
        >
          <div className={classnames('logo')}>
            <MyntraLogo />
          </div>
          <Layout
            type="stack"
            distribution="spaceBetween"
            className={classnames('tabs-and-quick-links-container')}
          >
            <Layout type="stack" className={classnames('tabs-container')}>
              {labels.map((title, index) => {
                return (
                  <TopNavItem
                    icon={fullData[title].icon}
                    key={title}
                    title={title}
                    onMouseEnter={() => this.enableHover(index, title)}
                    onMouseLeave={this.disableHover}
                  />
                )
              })}
            </Layout>
            <Layout
              type="stack"
              className={classnames('quick-links-container')}
              gutter="none"
            >
              {quickLinks.map((link) => {
                return (
                  <div
                    onClick={(event) =>
                      this.enableQuickLinkHover(event, link.renderFunction)
                    }
                    className={classnames('quick-links-icon')}
                  >
                    <Icon name={link.icon} fontSize="small" />
                  </div>
                )
              })}
            </Layout>
          </Layout>
        </Layout>
        {isHovering && !fullData[this.state.hoverTitle].noHover && (
          <TopNavHover
            onItemClick={this.hoverItemClicked}
            data={fullData[this.state.hoverTitle].data}
            onMouseLeave={this.disableHover}
            position={this.state.position}
            onMouseEnter={() => this.setState({ isHovering: true })}
          />
        )}
        {sidebarEnabled && (
          <TopNavSidebar
            data={fullData[this.state.sidebarTitle].data}
            activeMenu={activeMenu}
            activeItem={activeItem}
          />
        )}
        {quickLinkHover && (
          <div
            onClick={() => this.setState({ quickLinkHover: false })}
            className={classnames('quicklink-overlay')}
          ></div>
        )}
        {quickLinkHover && (
          <QuickLinkHover
            position={this.state.quickLinkPos}
            renderFunction={this.state.quickLinkRenderItem}
          />
        )}

        {/* <Button onClick={this.handleClick}>Reset to Default State</Button>
          <Button onClick={this.showState}>See State</Button> */}
      </Context.Provider>
    )
  }
}
