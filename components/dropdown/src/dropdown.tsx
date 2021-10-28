import React, { Component, RefObject } from 'react'

import Button from '@myntra/uikit-component-button'
import ClickAway from '@myntra/uikit-component-click-away'
import Measure, { MeasureData } from '@myntra/uikit-component-measure'
import Portal from '@myntra/uikit-component-portal'

import classnames from './dropdown.module.scss'
import { createRef } from '@myntra/uikit-utils'
import ChevronDownSolid from 'uikit-icons/svgs/ChevronDownSolid'

const scrollParents = new WeakMap<Element, Element[]>()

function elementHasOverflow(el: Element) {
  return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth
}

const SCROLL_RE = /auto|scroll/
function elementHasScrollableOverflow(el: Element) {
  const style = window.getComputedStyle(el, null)

  return SCROLL_RE.test(style.overflow + style.overflowX + style.overflowY)
}

function findScrollParents(el: Element) {
  if (scrollParents.has(el)) return scrollParents.get(el)

  const parents: Element[] = []
  let current = el.parentElement
  while (current) {
    if (elementHasOverflow(current) || elementHasScrollableOverflow(current)) {
      parents.push(current)
    }

    current = current.parentElement
  }

  if (!parents.length) {
    parents.push(document.scrollingElement || document.documentElement)
  }

  parents.push(window as any) // disguise as an element.

  scrollParents.set(el, parents)

  return parents
}

export interface Props extends BaseProps {
  renderTrigger?(props: {
    onMouseLeave?(event: MouseEvent | React.MouseEvent): void
    onMouseEnter?(event: MouseEvent | React.MouseEvent): void
    onClick?(event: MouseEvent | React.MouseEvent): void
    onFocus?(event: FocusEvent | React.FocusEvent): void
    onBlur?(event: FocusEvent | React.FocusEvent): void
  }): string | JSX.Element
  /**
   * Trigger to open dropdown.
   *
   * @deprecated - Use [renderTrigger](#Dropdown-renderTrigger)
   */
  trigger?: string | JSX.Element
  /** Dropdown state */
  isOpen: boolean
  /** Attach child to specific component/element */
  container?: boolean | string | HTMLElement
  /**
   * Event fired when dropdown drawer is displayed
   * @function
   */
  onOpen?(): void
  /**
   * Event fired when dropdown drawer is closed
   */
  onclose?(): void
  /** Open dropdown drawer above the trigger. */
  up?: boolean
  /** Align dropdown drawer with the right edge of the trigger. */
  right?: boolean
  /** Align dropdown drawer with the left edge of the trigger. */
  left?: boolean
  /** Align dropdown drawer below the trigger. */
  down?: boolean
  /**
   * Position dropdown drawer in best suited place.
   */
  auto?: boolean
  /**
   * Event to trigger dropdown
   */
  triggerOn?: 'hover' | 'click' | 'focus'
  /**
   * A className for popper wrapper element
   */
  wrapperClassName?: string
}

/**
 * A bare-bones dropdown implementation. It requires a trigger component or text.
 *
 * @since 0.0.0
 * @status READY
 * @category advanced
 * @see http://uikit.myntra.com/components/dropdown
 */
export default class Dropdown extends Component<
  Props,
  {
    up: boolean
    left: boolean
    right: boolean
    down: boolean
    height: number
    width: number
    position: null | {
      top: number
      left: number
      right?: number
      content?: {
        minWidth: number
      }
    }
  }
> {
  static propTypes = {
    /** @private */
    _combination: (props) => {
      const positions = ['up', 'left', 'right'].filter((it) => it in props)

      if (props.auto && positions.length) {
        throw new Error(
          `Prop 'auto' cannot be used with ${positions.join(', ')}.`
        )
      }
    },
  }

  static defaultProps = {
    useClickAway: true,
    triggerOn: 'click',
  }

  containerRef: RefObject<HTMLDivElement>
  wrapperRef: RefObject<HTMLDivElement>
  triggerRef: RefObject<HTMLDivElement>

  /**
   * Clean scroll handlers.
   */
  _clearScrollHandler?(): void

  /**
   * Delay blurring to capture clicks in dropdown.
   */
  blurTimeout: number
  mouseLeaveTimeout: number

  constructor(props) {
    super(props)

    this.state = {
      up: false,
      left: false,
      right: false,
      down: true,
      height: 320,
      width: 240,
      position: null,
    }

    this.containerRef = createRef()
    this.wrapperRef = createRef()
    this.triggerRef = createRef()
  }

  componentWillUnmount() {
    // clean any scroll events.
    this._clearScrollHandler && this._clearScrollHandler()
  }

  /**
   * Open dropdown content drawer.
   *
   * @public
   * @returns {void}
   */
  open = () => {
    // if (this.shouldCancelEvent()) return

    this.positionContent()

    this.props.onOpen && this.props.onOpen()
  }

  /**
   * Dispatch dropdown direction in next macro task.
   */
  positionContent() {
    if (this.props.auto || this.props.container) {
      // TODO: Deduplicate dispatches.
      setTimeout(
        () =>
          this.setState(
            this.computeAutoDirection(this.triggerRef.current, document.body)
          ),
        0
      )
    }
  }

  handleClickAway = (event) => {
    // Ignore clicks in trigger.
    const path =
      event.path || (event.composedPath ? event.composedPath() : undefined)

    if (path && path.includes(this.triggerRef.current)) return

    this.close()
  }

  /**
   * Close dropdown content drawer.
   *
   * @public
   * @returns {void}
   */
  close = () => {
    // if (this.shouldCancelEvent()) return
    this.props.onClose && this.props.onClose()
  }

  /**
   * Toggle dropdown content drawer state.
   *
   * @returns {void}
   */
  toggle = () => {
    this.props.isOpen ? this.close() : this.open()
  }

  handleMeasure = ({ bounds: { width, height } }: MeasureData) => {
    if (
      (width && height && this.state.width !== width) ||
      this.state.height !== height
    ) {
      this.setState({ width, height })
      this.positionContent()
    }
  }

  /**
   * Find direction to render the dropdown content so it fits the viewport.
   */
  computeAutoDirection(element: Element, parent: Element): any {
    if (!element || !parent) {
      return { up: false, left: false, right: false }
    }

    const target = element.getBoundingClientRect()
    const reference = parent.getBoundingClientRect()

    const { height, width } = this.state
    const { auto } = this.props

    const maxWidth = reference.width
    const maxHeight = reference.height

    // Choose:
    const up = auto
      ? target.bottom + height > maxHeight && target.top - height >= 0
      : this.props.up
    const left = auto ? target.left + width < maxWidth : this.props.left
    const right = auto
      ? left
        ? false
        : target.right - width > 0
      : this.props.right
    const down = auto ? !up : this.down

    const layout = { up, left, right, down }

    // Absolute position when using portal.
    if (this.props.container) {
      return this.computeAutoPosition(layout)
    }

    return layout
  }

  /**
   * Find position of dropdown content so it sticks with the trigger.
   */
  computeAutoPosition({ up, left, right, down }) {
    type PositionObject = {
      top: number
      left: number
      right?: number
      content?: { minWidth: number }
    }
    const trigger = this.triggerRef.current
    const rect = trigger.getBoundingClientRect()
    const { height, width } = this.state

    const position: PositionObject = { top: rect.top, left: rect.left }

    if (up) {
      position.top -= height
    } else if (down) {
      position.top += rect.height
    }

    if (right && left) {
      position.right = position.left + rect.width
      position.content = { minWidth: rect.width }
    } else if (right) {
      if (up || down) {
        position.left += rect.width - width
      } else {
        position.top += (rect.height - height) / 2
        position.left += rect.width
      }
    } else if (left && !(up || down)) {
      position.left -= width
      position.top += (rect.height - height) / 2
    }

    // Register scroll handler.
    const recomputePosition = () => {
      const offsetTop = position.top - rect.top
      const offsetLeft = position.left - rect.left
      const newRect = trigger.getBoundingClientRect()

      const newPosition: PositionObject = {
        left: newRect.left + offsetLeft,
        top: newRect.top + offsetTop,
      }

      if (position.right) {
        newPosition.right = newPosition.left + newRect.width
        newPosition.content = {
          minWidth: newRect.width,
        }
      }

      this.setState({ position: newPosition })
    }

    const scrollParents = findScrollParents(trigger)

    // Clear old scroll events.
    this._clearScrollHandler && this._clearScrollHandler()
    this._clearScrollHandler = () =>
      scrollParents.map((scroll) =>
        scroll.removeEventListener('scroll', recomputePosition)
      )

    scrollParents.map((scroll) =>
      scroll.addEventListener('scroll', recomputePosition, { passive: true })
    )

    return { up, left, right, position }
  }

  get down() {
    return (
      (!this.props.up && !this.props.left && !this.props.right) ||
      (this.props.left && this.props.right && !this.props.up) ||
      this.props.down
    )
  }

  handleBlur = () => {
    // No active element
    if (!document.activeElement) return
    if (document.activeElement === document.body) return

    // In dropdown.
    if (!this.containerRef.current) return
    if (this.containerRef.current.contains(document.activeElement)) return

    // In dropdown content (in portal).
    if (!this.wrapperRef.current) return
    if (this.wrapperRef.current.contains(document.activeElement)) return

    this.close()
  }

  handleClick = (event: MouseEvent) => {
    if (this.props.isOpen) {
      // If target element is an input element, keep dropdown open.
      if (
        this.containerRef.current &&
        event.target &&
        /^(input|textarea|select)$/i.test((event.target as any).nodeName)
      ) {
        return
      }
    }

    this.toggle()
  }

  /**
   * Delay blur closing for 1 frame to keep dropdown open when trigger blurs
   * but content focuses.
   */
  handleBlurDelayed = () => {
    window.clearTimeout(this.blurTimeout)
    this.blurTimeout = window.setTimeout(this.handleBlur, 16)
  }

  handleMouseLeaveDelayed = () => {
    window.clearTimeout(this.mouseLeaveTimeout)
    this.mouseLeaveTimeout = window.setTimeout(() => {
      this.close()
    }, 16)
  }

  handleMouseEnter = () => {
    window.clearTimeout(this.mouseLeaveTimeout)
    if (!this.props.isOpen) this.open()
  }

  handleContainerMouseEnter = () => this.handleMouseEnter()
  handleTriggerMouseEnter = () => this.handleMouseEnter()
  handleContentMouseEnter = () => this.handleMouseEnter()
  handleContentMouseLeave = () => this.handleMouseLeaveDelayed()
  handleTriggerMouseLeave = () => this.handleMouseLeaveDelayed()
  handleContainerMouseLeave = () => this.handleMouseLeaveDelayed()

  extraProps() {
    const {
      auto,
      children,
      isOpen,
      className,
      container,
      down,
      left,
      onOpen,
      onclose,
      renderTrigger,
      right,
      trigger,
      triggerOn,
      up,
      wrapperClassName,
      useClickAway, // Private prop API
      ...props
    } = this.props

    return props
  }

  render() {
    const { up, left, right, down } = this.props.auto
      ? this.state
      : { ...this.props, down: this.down }
    const { position } = this.state
    const {
      renderTrigger,
      trigger,
      triggerOn,
      isOpen,
      className,
      children,
    } = this.props

    const getChildren = () =>
      typeof children === 'function' ? children(position || {}) : children

    const handlers: Record<string, any> = {
      onBlur: this.handleBlurDelayed,
    }

    switch (triggerOn) {
      case 'hover':
        handlers.onMouseEnter = this.handleTriggerMouseEnter
        handlers.onMouseLeave = this.handleTriggerMouseLeave
        break
      case 'focus':
        handlers.onFocus = this.open
      case 'click':
        handlers.onClick = this.handleClick
        break
    }

    const isHover = triggerOn === 'hover'

    return (
      <div
        {...this.extraProps()}
        onMouseEnter={isHover ? this.handleContainerMouseEnter : null}
        onMouseLeave={isHover ? this.handleContainerMouseLeave : null}
        ref={this.containerRef}
        className={classnames(className, 'dropdown', {
          open: this.props.isOpen,
        })}
      >
        <div
          className={classnames('trigger')}
          ref={this.triggerRef}
          onClick={(event) => event.stopPropagation()}
          data-test-id="trigger"
        >
          {renderTrigger ? (
            renderTrigger(handlers)
          ) : typeof trigger === 'string' ? (
            <Button
              type="secondary"
              secondaryIcon={ChevronDownSolid}
              {...handlers}
            >
              {trigger}
            </Button>
          ) : (
            cloneElement(trigger, handlers)
          )}
        </div>
        {isOpen &&
          (this.props.container ? (
            <Portal container={this.props.container} data-test-id="portal">
              <div
                className={classnames(
                  'content',
                  'fixed',
                  this.props.wrapperClassName
                )}
                style={
                  position
                    ? {
                        top: position.top,
                        left: position.left,
                      }
                    : null
                }
                ref={this.wrapperRef}
                hidden={!position}
                data-test-id="content"
                onMouseEnter={isHover ? this.handleContentMouseEnter : null}
                onMouseLeave={isHover ? this.handleContentMouseLeave : null}
              >
                <Measure onMeasure={this.handleMeasure}>
                  <div
                    className={classnames('content-wrapper')}
                    style={position && position.content}
                  >
                    {getChildren()}
                  </div>
                </Measure>
              </div>
            </Portal>
          ) : (
            <div
              className={classnames('content', { up, left, right, down })}
              ref={this.wrapperRef}
            >
              <Measure onMeasure={this.handleMeasure}>
                <div
                  className={classnames('content-wrapper')}
                  data-test-id="content"
                >
                  {getChildren()}
                </div>
              </Measure>
            </div>
          ))}
        {this.props.useClickAway && isOpen && (
          <ClickAway
            target={this.wrapperRef}
            onClickAway={this.handleClickAway}
            data-test-id="click-away"
          />
        )}
      </div>
    )
  }
}

// TODO: Extract to utils.
function cloneElement(element, props) {
  const newProps = {}
  const currentProps = element.props

  for (const key in props) {
    if (key in currentProps && /^on/.test(key)) {
      const fn1 = props[key]
      const fn2 = currentProps[key]

      newProps[key] = function() {
        if (typeof fn1 === 'function') fn1.call(this, arguments)
        if (typeof fn2 === 'function') fn2.call(this, arguments)
      }
    } else {
      newProps[key] = props[key]
    }
  }

  return React.cloneElement(element, newProps)
}
