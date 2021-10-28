import React, { PureComponent, ReactNode, Children } from 'react'
import Icons, { IconName } from '@myntra/uikit-component-icon'
import Dropdown from '@myntra/uikit-component-dropdown'
import Button, { KIND } from '@myntra/uikit-component-button'
import classnames from './fab.module.scss'
import EllipsisVSolid from 'uikit-icons/svgs/EllipsisVSolid'

export interface Props extends BaseProps {
  direction: 'up' | 'left' | 'down' | 'right'
  /**
   * Disables the button (changes visual style and ignores button interactions).
   */
  disabled?: boolean
  /**
   * Event to trigger dropdown
   */
  triggerOn?: 'hover' | 'click' | 'focus'
  /** The handler to call when the button is clicked. */
  onClick?(event: MouseEvent): void
  className: string
  /** Fab primary button icon  */
  icon: IconName
  /** Fab secondary button icon. If specified if will toggle with primary on trigger   */
  secondaryIcon: IconName
  /** Fab buttons position on screen */
  position:
    | 'right-bottom'
    | 'center-bottom'
    | 'left-bottom'
    | 'right-center'
    | 'center-center'
    | 'left-center'
    | 'right-top'
    | 'center-top'
    | 'left-top'
}
/**
 * Floating action buttons (FABs)
 *
 * @since 1.13.20
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/fab
 */
export default class Fab extends PureComponent<
  Props,
  {
    isOpen: boolean
  }
> {
  static propTypes = {
    __$validation({ children }) {
      if (Children.toArray(children).length < 2)
        throw new Error(
          `Floating action button should have more than 1 action button`
        )
    },
  }

  state = {
    isOpen: false,
  }

  static defaultProps = {
    direction: 'up',
    triggerOn: 'click',
    disabled: false,
  }

  handleDropdownOpen = () => this.setState({ isOpen: true })
  handleDropdownClose = () => this.setState({ isOpen: false })
  toggleDropDown = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  getReactNodes(nodes) {
    const { direction } = this.props
    return nodes.map((item: any, index) => (
      <li
        className={classnames('fab-list__item', direction)}
        style={{
          transitionDelay: `${index * 0.05}s`,
        }}
      >
        {React.cloneElement(item, { type: KIND.text, key: index })}
      </li>
    ))
  }

  render() {
    const {
      direction,
      disabled,
      onClick,
      children,
      className,
      triggerOn,
      icon,
      position,
      ...props
    } = this.props

    const { isOpen } = this.state

    const nodes = Children.toArray(children)
    const reactNodes = this.getReactNodes(nodes)
    return (
      <Dropdown
        up={direction === 'up'}
        left={direction === 'left'}
        down={direction === 'down'}
        right={
          direction === 'right' || !!position.match(/right-top|right-bottom/)
        }
        container={true}
        trigger={
          <Button icon={EllipsisVSolid} onClick={() => this.toggleDropDown()} />
        }
        isOpen={true}
        onOpen={this.handleDropdownOpen}
        onClose={this.handleDropdownClose}
        triggerOn={triggerOn}
        wrapperClassName="no-shadow"
        className={classnames('fab', position)}
        {...props}
      >
        <ul
          className={classnames('fab-list', direction, position, {
            'is-open': isOpen,
          })}
        >
          {['up', 'left'].includes(direction)
            ? reactNodes.reverse()
            : reactNodes}
        </ul>
      </Dropdown>
    )
  }
}
