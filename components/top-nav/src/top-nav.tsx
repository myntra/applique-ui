import React, { PureComponent } from 'react'
import classnames from './top-nav.module.scss'
import Context from './context'
import TopNavItem from './top-nav-item'
import Layout from '@myntra/uikit-component-layout'
import TopNavHover from './top-nav-hover'
import TopNavSidebar from './top-nav-sidebar'
import Icon from '@myntra/uikit-component-icon'
import { fullData as utilData } from './utils'
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
    hoverItemPos: number
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
    hoverItemPos: null,

    sidebarEnabled: false,
    sidebarTitle: null,

    activeMenu: null,

    activeItem: null,

    quickLinkHover: false,
    quickLinkPos: null,
    quickLinkRenderItem: null,
  }

  componentDidMount(): void {
    /*
    get window url, set l0, l1, l2 based on it
    */
  }

  enableHover = (index, title) => {
    const parent = document.getElementsByClassName('tabs-container')[0]
    const hoverItemPos =
      parent.children[index].getBoundingClientRect().left -
      parent.getBoundingClientRect().left / 2
    this.setState({ isHovering: true, hoverItemPos, hoverTitle: title })
  }
  disableHover = () => {
    this.setState({ isHovering: false })
  }

  handleSidebarItemClicked = (object: any) => {
    this.setState({
      activeMenu: object.activeMenu,
      activeItem: object.child.title,
    })
    this.props.dispatchFunction(object.child.dispatchFunctionObject)
  }

  handleNoHoverClicked = (object: any) => {
    this.setState({
      activeMenu: null,
      activeItem: null,
      sidebarEnabled: false,
      sidebarTitle: null,
    })
    this.props.dispatchFunction(object.dispatchFunctionObject)
  }

  hoverItemClicked = (item) => {
    this.setState({
      sidebarEnabled: true,
      sidebarTitle: this.state.hoverTitle,
      activeMenu: item.menuTitle,
      activeItem: item.clickedTitle,
    })
    this.props.dispatchFunction(item.dispatchFunctionObject)
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

  render() {
    const fullData = this.props.data || utilData
    const labels = Object.keys(fullData).filter(
      (it) => it !== 'quickLinks' && it !== 'logo'
    )
    const {
      isHovering,
      sidebarEnabled,
      sidebarTitle,
      activeItem,
      activeMenu,
      quickLinkHover,
    } = this.state
    const { quickLinks } = fullData
    return (
      <Context.Provider
        value={{
          isOpen: true,
        }}
      >
        <div>
          <Layout
            type="stack"
            gutter="none"
            className={classnames('header-container')}
          >
            <div className={classnames('logo')}>{fullData.logo}</div>
            <Layout
              type="stack"
              distribution="spaceBetween"
              className={classnames('tabs-and-quick-links-container')}
            >
              <Layout
                type="stack"
                gutter="none"
                className={classnames('tabs-container')}
              >
                {labels.map((title, index) => {
                  return (
                    <TopNavItem
                      icon={fullData[title].icon}
                      key={title}
                      title={title}
                      onMouseEnter={() => this.enableHover(index, title)}
                      onMouseLeave={this.disableHover}
                      onClick={
                        fullData[title].noHover
                          ? () => this.handleNoHoverClicked(fullData[title])
                          : null
                      }
                      isActive={sidebarTitle == title}
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
              position={this.state.hoverItemPos}
              onMouseEnter={() => this.setState({ isHovering: true })}
            />
          )}
          {sidebarEnabled && (
            <TopNavSidebar
              data={fullData[this.state.sidebarTitle].data}
              activeMenu={activeMenu}
              activeItem={activeItem}
              onItemClick={this.handleSidebarItemClicked}
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
        </div>
      </Context.Provider>
    )
  }
}
