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
  defaultIndex?: number
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
function Tabs(props: Props) {
  const {
    className,
    onChange,
    type,
    defaultIndex = 0,
    activeIndex,
    ...remainingProps
  } = props
  const [state, setState] = useState({ activeIndex: defaultIndex })
  const ref = useRef(null)
  const children: any = Children.toArray(props.children).filter((child) =>
    isValidElement(child)
  )

  const getActiveIndex = () => {
    let activeTab =
      typeof activeIndex === 'number' ? activeIndex : state.activeIndex

    if (
      activeTab < 0 ||
      activeTab >= children.length ||
      children[activeTab]?.props?.disabled
    ) {
      for (let i = 0; i < children.length - 1; i++) {
        if (!children[i]?.props?.disabled) {
          activeTab = i
          break
        }
      }
    }
    return activeTab
  }

  useEffect(() => {
    calcSliderPos()
  }, [state, activeIndex, children])

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
    const activeTab = Number(event.currentTarget.dataset.index)

    if (props?.children?.[activeTab]?.props?.disabled) return
    if (!Number.isInteger(activeTab)) return

    if (props.onChange) props.onChange(activeTab)
    setState({ activeIndex: activeTab })
  }
  if (!children.length) return null

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
    if ('activeIndex' in props && !('onChange' in props)) {
      throw new Error(
        '`onChange` prop is required when using `activeIndex` props'
      )
    }
  },
}

Tabs.defaultProps = {
  type: 'primary',
}

export default Tabs
