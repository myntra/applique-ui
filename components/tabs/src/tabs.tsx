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
function Tabs({ ...props }: Props) {
  const [state, setState] = useState({ activeIndex: 0 })
  const ref = useRef(null)

  useEffect(() => {
    calcSliderPos()
  }, [state, props.activeIndex])

  const calcSliderPos = () => {
    const target = ref.current
    if (props.type !== 'primary' || !target) return
    const activeIndex =
      typeof props.activeIndex === 'number'
        ? props.activeIndex
        : state.activeIndex

    const selectedTab = target.childNodes[activeIndex] as HTMLElement
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
    else setState({ activeIndex })
  }

  let activeIndex =
    typeof props.activeIndex === 'number'
      ? props.activeIndex
      : state.activeIndex
  const children: any = Children.toArray(props.children).filter((child) =>
    isValidElement(child)
  )

  if (!children.length) return null
  if (activeIndex < 0 || children.length <= activeIndex) activeIndex = 0

  const {
    className,
    onChange,
    children: _,
    activeIndex: __,
    type,
    ...remainingProps
  } = props

  const content = children[activeIndex].props.children

  return (
    <div className={classnames('group', className)} {...remainingProps}>
      <div className={classnames('pane', type)} ref={ref}>
        {Children.map(children, (child: any, index) =>
          cloneElement(child, {
            'data-index': index,
            isActive: index === activeIndex,
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
    if ('active' in props && !('onChange' in props)) {
      throw new Error('`onChange` prop is required when using `active` props')
    }
  },
}

Tabs.defaultProps = {
  type: 'primary',
}

export default Tabs
