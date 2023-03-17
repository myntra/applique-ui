import React, {
  PureComponent,
  Children,
  isValidElement,
  cloneElement,
  createElement,
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
  type?: 'primary' | 'secondary'
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

  static defaultProps = {
    type: 'primary',
  }

  state = {
    activeIndex: 0,
  }

  ref = React.createRef<HTMLDivElement>()

  componentDidMount(): void {
    this.calcSliderPos(this.ref.current)
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<{ activeIndex: number }>
  ): void {
    if (
      this.props.activeIndex !== prevProps.activeIndex ||
      this.state.activeIndex !== prevState.activeIndex
    ) {
      this.calcSliderPos(this.ref.current)
    }
  }

  calcSliderPos = (target) => {
    if (this.props.type !== 'primary' || !target) return
    const activeIndex =
      typeof this.props.activeIndex === 'number'
        ? this.props.activeIndex
        : this.state.activeIndex

    const selectedTab = target.childNodes[activeIndex]
    target.lastChild.style.left = selectedTab.offsetLeft + 'px'
    target.lastChild.style.width =
      selectedTab.getBoundingClientRect().width + 'px'
  }

  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const activeIndex = Number(event.currentTarget.dataset.index)

    if (this.props.children[activeIndex].props.disabled) return
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
      type,
      ...props
    } = this.props

    const content = children[activeIndex].props.children

    return (
      <div className={classnames('group', className)} {...props}>
        <div className={classnames('pane', type)} ref={this.ref}>
          {Children.map(children, (child: any, index) =>
            cloneElement(child, {
              'data-index': index,
              isActive: index === activeIndex,
              onClick: this.handleClick,
              children: null,
              type,
            })
          )}
          {type === 'primary' && <div className={classnames('slider')}></div>}
        </div>
        {content}
      </div>
    )
  }
}
