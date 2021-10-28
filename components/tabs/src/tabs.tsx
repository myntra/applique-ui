import React, {
  PureComponent,
  Children,
  isValidElement,
  cloneElement,
} from 'react'
import Tab from './tab'

import classnames from './tabs.module.scss'

export interface Props extends BaseProps {
  /**
   * Current active tab.
   */
  activeIndex?: number
  /**
   * The callback function called when active tab changes.
   *
   * @param activeIndex - New active tab.
   */
  onChange?(activeIndex: number): void
}

export { Tab }

/**
 * A layout component to display tabbed interface.
 *
 * @since 0.3.0
 * @status REVIEWING
 * @category layout
 * @see http://uikit.myntra.com/components/tabs
 */
export default class Tabs extends PureComponent<
  Props,
  { activeIndex: number }
> {
  static Tab = Tab

  static propTypes = {
    /** @private  */
    _validate(props) {
      if ('active' in props && !('onChange' in props)) {
        throw new Error('`onChange` prop is required when using `active` props')
      }
    },
  }

  state = {
    activeIndex: 0,
  }

  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const activeIndex = Number(event.currentTarget.dataset.index)

    if (!Number.isInteger(activeIndex)) return

    if (this.props.onChange) this.props.onChange(activeIndex)
    else this.setState({ activeIndex })
  }

  render() {
    let activeIndex =
      typeof this.props.activeIndex === 'number'
        ? this.props.activeIndex
        : this.state.activeIndex
    const children: any = Children.toArray(
      this.props.children
    ).filter((child) => isValidElement(child))

    if (!children.length) return null
    if (activeIndex < 0 || children.length <= activeIndex) activeIndex = 0

    const {
      className,
      onChange,
      children: _,
      activeIndex: __,
      ...props
    } = this.props

    const content = children[activeIndex].props.children

    return (
      <div className={classnames('group', className)} {...props}>
        <div className={classnames('pane')}>
          {Children.map(children, (child: any, index) =>
            cloneElement(child, {
              'data-index': index,
              isActive: index === activeIndex,
              onClick: this.handleClick,
              children: null,
            })
          )}
        </div>
        {content}
      </div>
    )
  }
}
