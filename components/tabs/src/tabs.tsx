import React, {
  Children,
  isValidElement,
  cloneElement,
  useState,
  useRef,
  useEffect,
} from 'react'
import Tab from './tab'

import classnames from './tabs.module.scss'

export interface Props extends BaseProps {
  /**
   * Default active tab.
   */
  defaultTab?: number
  /**
   * Current active tab.
   */
  activeTab?: number
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
function Tabs(props: Props) {
  const {
    className,
    onChange,
    type,
    defaultTab = 0,
    activeTab,
    ...remainingProps
  } = props
  const [state, setState] = useState({ activeIndex: defaultTab })
  const ref = useRef(null)
  const children: any = Children.toArray(props.children).filter((child) =>
    isValidElement(child)
  )
  if (!children.length) return null

  const getActiveIndex = () => {
    let activeIndex =
      typeof activeTab === 'number' ? activeTab : state.activeIndex

    if (
      activeIndex < 0 ||
      activeIndex >= children.length ||
      children[activeIndex]?.props?.disabled
    ) {
      for (let i = 0; i < children.length - 1; i++) {
        if (!children[i]?.props?.disabled) {
          activeIndex = i
          break
        }
      }
    }
    return activeIndex
  }

  useEffect(() => {
    calcSliderPos()
  }, [state, activeTab])

  const calcSliderPos = () => {
    const target = ref.current
    if (props.type !== 'primary' || !target) return
    const selectedTab = target.childNodes[getActiveIndex()] as HTMLElement
    ;(target.lastChild as HTMLElement).style.left =
      selectedTab.offsetLeft + 'px'
    ;(target.lastChild as HTMLElement).style.width =
      selectedTab.getBoundingClientRect().width + 'px'
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const activeIndex = Number(event.currentTarget.dataset.index)

    if (props.children[activeIndex].props.disabled) return
    if (!Number.isInteger(activeIndex)) return

    if (props.onChange) props.onChange(activeIndex)
    setState({ activeIndex })
  }

  const content = children[getActiveIndex()]?.props?.children
  return (
    <div className={classnames('group', className)} {...remainingProps}>
      <div className={classnames('pane', type)} ref={ref}>
        {Children.map(children, (child: any, index) =>
          cloneElement(child, {
            'data-index': index,
            isActive: index === getActiveIndex(),
            onClick: handleClick,
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

Tabs.Tab = Tab

Tabs.propTypes = {
  /** @private  */
  _validate(props) {
    if ('activeTab' in props && !('onChange' in props)) {
      throw new Error(
        '`onChange` prop is required when using `activeTab` props'
      )
    }
  },
}

Tabs.defaultProps = {
  type: 'primary',
}

export default Tabs
