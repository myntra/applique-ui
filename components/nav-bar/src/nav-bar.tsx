import React, { PureComponent, RefObject } from 'react'
import UIKitContext, { LinkProps } from '@myntra/uikit-context'
import Icon from '@myntra/uikit-component-icon'
import ClickAway from '@myntra/uikit-component-click-away'
import NavBarContext from './context'
import NavBarGroup from './nav-bar-group'
import NavBarItem from './nav-bar-item'
import { is } from '@myntra/uikit-utils'

import LogoMyntraJabong from './logos/myntra-jabong.png'

// TODO: Use click away to close NavBar (if mouse leave fails)

import classnames from './nav-bar.module.scss'
import { createRef } from '@myntra/uikit-utils'

import BarsSolid from 'uikit-icons/svgs/BarsSolid'

// TODO: Use hooks.
const LinkFromUIKitContext = ({ href, children }: LinkProps) => (
  <UIKitContext.Consumer>
    {({ RouterLink }) => <RouterLink to={href}>{children}</RouterLink>}
  </UIKitContext.Consumer>
)

interface Props extends BaseProps {
  /**
   * The title of the nav bar. Generally, it is the name of the application/product/company.
   */
  title: string

  /**
   * URL of the current page. NavBar uses `currentPath` for highlighting active nav links.
   */
  currentPath: string | any

  /**
   * Check if current path is active.
   *
   * @since 0.10.0
   */
  isActivePath?(
    navLinkPath: any,
    currentPath: any,
    options?: {
      isGroup: boolean
    }
  ): boolean

  /**
   * Controls whether to show the overlay when navigation is opened
   */
  needOverlay: boolean

  /**
   * Callback to be called when overlay is clicked / touched
   */
  overlayClickHandler?(): void

  /**
   * Control NavBar state.
   */
  isOpen?: boolean

  /**
   * The [NavBar.Item](#NavBarItem) component renders an anchor tag (`<a>`).
   * This prop allows to override this behavior.
   *
   * @since 0.10.0
   */
  renderLink?(props: LinkProps): any

  /**
   * The callback fired when NavBar.Item is clicked.
   */
  onNavLinkClick?(link: { to: any }): void

  /**
   * The callback called when user clicks on the NavBar.
   */
  onClick?(event: MouseEvent): void

  /**
   * List of nav links and groups. Only [NavBar.Group](#NavBarGroup) and [NavBar.Item](#NavBarItem) should be used here.
   */
  children: React.ReactNode

  /**
   * @deprecated - Ambiguous prop name.
   */
  expand?: 'auto' | 'open' | 'close'

  /**
   * Match nav link with `currentPath`.
   *
   * @deprecated - Use [isActivePath](#NavBar-isActivePath) prop.
   */
  match?(args: { href: string; currentPath: string }): boolean

  /**
   * @deprecated - As NavBar does not control navigation, it should be handled by browser or any client-side router.
   */
  onChange?(href: string): void

  onHeaderClick?(event: MouseEvent): void

  /**
   * @deprecated - Use [renderLink](#NavBar-renderLink) prop.
   */
  linkComponent?(props: { href: string; children: JSX.Element }): JSX.Element
}

const ROOT_NAV_GROUP_ID = [0]
/**
 * A sidebar nav list for app navigation.
 *
 * @since 0.3.0
 * @status REVIEWING
 * @category opinionated
 * @see http://uikit.myntra.com/components/nav-bar
 */
export default class NavBar extends PureComponent<
  Props,
  { isOpen: boolean; activeGroup: number[] }
> {
  // Sub-components
  static Group = NavBarGroup
  static Item = NavBarItem

  static defaultProps = {
    isActivePath(navLinkPath, currentPath, { isGroup }) {
      return isGroup && typeof currentPath === 'string'
        ? currentPath.startsWith(navLinkPath)
        : !!navLinkPath && navLinkPath === currentPath
    },
    renderLink({ href, children }) {
      return <LinkFromUIKitContext href={href}>{children}</LinkFromUIKitContext>
    },
    needOverlay: is.mobile(),
  }

  state = {
    isOpen: false,
    activeGroup: ROOT_NAV_GROUP_ID,
  }

  idPrefix: string

  navbarRef: RefObject<HTMLElement>

  constructor(props) {
    super(props)

    this.idPrefix = `nav-${Date.now()}-`
    this.navbarRef = createRef()
  }

  get isOpen(): boolean {
    if (this.props.expand) {
      if (__DEV__)
        console.warn(`The prop 'expand' is deprecated. Use 'isOpen' instead.`)

      if (this.props.expand !== 'auto') return this.props.expand === 'open'
    }

    // Controlled NavBar
    if (typeof this.props.isOpen === 'boolean') return this.props.isOpen

    // Uncontrolled NavBar
    return this.state.isOpen
  }

  get renderLink() {
    if (this.props.linkComponent) {
      if (__DEV__)
        console.warn(
          `The prop 'linkComponent' is deprecated. Use 'renderLink' instead.`
        )

      return this.props.linkComponent
    }

    return this.props.renderLink
  }

  get isActivePath() {
    if (this.props.match) {
      if (__DEV__)
        console.warn(
          `The prop 'match' is deprecated. Use 'isActivePath' instead.`
        )

      return (href: string, currentPath: string) =>
        this.props.match({ href, currentPath })
    }

    return this.props.isActivePath
  }

  handleClick = (event: any) => {
    if (this.props.onClick) {
      this.props.onClick(event)
    }
  }

  handleMouseEnter = (event: any) => {
    if (!is.mobile()) this.open()
  }

  handleMouseLeave = (event: any) => {
    if (!is.mobile()) this.close()
  }

  handleFocus = (event: any) => {
    if (!is.mobile()) this.open()
  }

  handleBlur = (event: any) => {
    // DO NOT CLOSE ON BLUR.
  }

  headerClickHandler = (event: any) => {
    this.state.isOpen ? this.close() : this.open()
  }

  handleClickAway = () => {
    if (this.props.overlayClickHandler && this.props.needOverlay) {
      this.overlayClickHandler()
    }
  }

  open = () => {
    if (!this.state.isOpen) this.setState({ isOpen: true })
  }

  close = () => {
    if (this.state.isOpen) this.setState({ isOpen: false })
  }

  handleNavLinkClick = (navLink: { path: string }) => {
    if (this.props.onChange) {
      if (__DEV__)
        console.warn(
          `The prop 'match' is deprecated. See http://uikit.myntra.com/components/nav-link#NavLink-onChange.`
        )

      this.props.onChange(navLink.path)
    }

    if (this.props.onNavLinkClick && navLink.path) {
      this.props.onNavLinkClick({ to: navLink.path })
    }

    if (navLink.path) {
      this.close()
    }
  }

  isActiveNavLinkPath = (navLinkPath: string, isGroup?: boolean): boolean => {
    return this.isActivePath(navLinkPath, this.props.currentPath, { isGroup })
  }

  setActiveGroup = (id: number[]) => {
    this.setState({ activeGroup: id })
  }

  isActiveGroup = (id: number[]) => {
    return (
      Array.isArray(id) &&
      id.length <= this.state.activeGroup.length &&
      id.every((value, index) => value === this.state.activeGroup[index])
    )
  }

  overlayClickHandler = () => {
    this.close()
    this.props.overlayClickHandler && this.props.overlayClickHandler()
  }

  get attrs() {
    const {
      children,
      currentPath,
      expand,
      isActivePath,
      isOpen,
      linkComponent,
      match,
      onChange,
      onClick,
      onNavLinkClick,
      renderLink,
      title,
      className,
      needOverlay,
      ...attrs
    } = this.props

    return attrs
  }

  render() {
    const { className, needOverlay, currentPath, title, children } = this.props

    return (
      <NavBarContext.Provider
        value={{
          currentPath: currentPath,
          isActivePath: this.isActiveNavLinkPath,
          isActiveGroup: this.isActiveGroup,
          renderLink: this.renderLink,
          isOpen: this.isOpen,
          onNavLinkClick: this.handleNavLinkClick,
          setActiveGroup: this.setActiveGroup,
        }}
      >
        <nav
          ref={this.navbarRef}
          tabIndex={0}
          role="navigation"
          {...this.attrs}
          id={`${this.idPrefix}nav`}
          className={classnames('nav', className, {
            'is-open': this.isOpen,
          })}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          aria-labelledby={`${this.idPrefix}header`}
        >
          {needOverlay ? (
            <div
              className={classnames('backdrop')}
              onClick={this.overlayClickHandler}
            ></div>
          ) : null}
          <header
            id={`${this.idPrefix}header`}
            className={classnames('header')}
            onClick={this.headerClickHandler}
          >
            <Icon
              className={classnames('hamburger')}
              name={BarsSolid}
              title="Navigation"
            />
            <img src={LogoMyntraJabong} alt="Myntra Jabong" />
            {title}
          </header>

          <NavBarGroup
            className={classnames('body')}
            title={title}
            __$navId={ROOT_NAV_GROUP_ID}
            key={ROOT_NAV_GROUP_ID.join('.')}
          >
            {children}
          </NavBarGroup>
          {this.isOpen && (
            <ClickAway
              target={this.navbarRef}
              onClickAway={this.handleClickAway}
              data-test-id="click-away"
            />
          )}
        </nav>
      </NavBarContext.Provider>
    )
  }
}
