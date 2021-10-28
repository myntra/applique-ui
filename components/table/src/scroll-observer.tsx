import React, { PureComponent, isValidElement } from 'react'

export interface Props extends BaseProps {
  mode: 'container' | 'window'
  offsetAdjust: number
  onScroll(
    event: { scrollLeft: number; scrollTop: number },
    target: HTMLElement
  ): void
}

const RE = /(auto|scroll)/

/**
 * Check if the element is a scrollable element. This function is called by findScrollParent.
 * @param element
 */
function isElementScrollable(element: HTMLElement) {
  const style = window.getComputedStyle(element)
  const scroll = style.getPropertyValue('overflow')
  const scrollY = style.getPropertyValue('overflow-y')

  // For element to be scrollable it should satisfy both of these conditions
  return (
    (RE.test(scroll) || RE.test(scrollY)) &&
    element.offsetHeight < element.scrollHeight
  )
}

/**
 * Find the nearest scrollable element for the cases where mode = window
 * @param node
 */
function findScrollParent(node: Node) {
  if (!node || node === document.body) return window
  else if (isElementScrollable(node as HTMLElement)) return node
  else return findScrollParent(node.parentElement)
}

export default class ScrollObserver extends PureComponent<Props> {
  targetRef: { current: HTMLElement | null } = { current: null }
  scrollRef: { current: HTMLElement | null } = { current: null }

  detectedMode: 'window' | 'container'
  lastScrollLeft: number = 0
  lastScrollTop: number = 0

  componentDidUpdate() {
    if (this.scrollRef.current === (window as any)) {
      const current = findScrollParent(this.targetRef.current.parentNode)

      if (current !== (window as any)) {
        this.unregister()
        this.scrollRef.current = current
        this.register()
        this.handleScroll({ currentTarget: current } as any)
      }
    }
  }

  componentWillUnmount() {
    this.unregister()
  }

  get isWindowMode() {
    return this.props.mode === 'window'
  }

  /**
   * Registering scroll event for both target and scroll element
   */
  register() {
    if (this.scrollRef.current) {
      this.scrollRef.current.addEventListener('scroll', this.handleScroll, {
        passive: true,
      })
    }

    if (this.isWindowMode && this.targetRef.current) {
      this.targetRef.current.addEventListener('scroll', this.handleScroll, {
        passive: true,
      })
    }
  }

  unregister() {
    if (this.scrollRef.current) {
      this.scrollRef.current.removeEventListener('scroll', this.handleScroll)
    }

    if (this.targetRef.current) {
      this.targetRef.current.removeEventListener('scroll', this.handleScroll)
    }
  }

  getWindowScrollTop() {
    const scrollTop =
      'scrollY' in window ? window.scrollY : document.documentElement.scrollTop

    return Number.isFinite(scrollTop) ? scrollTop : 0
  }

  handleScroll = (event: UIEvent) => {
    const target = event.currentTarget as any
    const isTargetWindow = target === window

    const _scrollTop =
      target === this.scrollRef.current
        ? isTargetWindow
          ? this.getWindowScrollTop()
          : target.scrollTop
        : this.lastScrollTop
    const scrollLeft =
      this.targetRef.current === target
        ? target.scrollLeft
        : this.lastScrollLeft

    const offsetTop =
      this.findScrollParentPosition(
        this.targetRef.current.offsetParent as HTMLElement
      ).yPos + this.props.offsetAdjust

    this.lastScrollTop = _scrollTop
    this.lastScrollLeft = scrollLeft

    if (this.isWindowMode && isTargetWindow && offsetTop > _scrollTop) return

    const scrollTop = this.isWindowMode
      ? Math.max(0, _scrollTop - offsetTop)
      : _scrollTop

    this.props.onScroll({ scrollLeft, scrollTop }, this.targetRef.current)
  }

  /**
   * Set target element and scroll element references.
   * target param will be the only child element of ScrollObserver
   * @param target
   */
  handleRef = (target: HTMLElement | null | any) => {
    if (target === null) return
    if (this.targetRef.current !== target) {
      this.unregister()
      this.targetRef.current = target
      if (this.isWindowMode)
        this.scrollRef.current = findScrollParent(
          this.targetRef.current.parentNode
        )
      else this.scrollRef.current = target
      this.register()
    }

    const node = React.Children.only(this.props.children) as {
      ref?: (t: HTMLElement) => {}
    }
    if (typeof node.ref === 'function') {
      node.ref(target)
    }
  }

  /**
   * Get an Element's Position from the top.
   * We are adding up all the offsetTop and offsetLeft values starting from the element provided till body tag
   * @param element
   */
  findScrollParentPosition(element) {
    let xPos = 0
    let yPos = 0

    while (element) {
      xPos += element.offsetLeft + element.clientLeft
      yPos += element.offsetTop + element.clientTop

      element = element.offsetParent
    }

    return {
      xPos,
      yPos,
    }
  }

  render() {
    const node = React.Children.only(this.props.children)
    if (!isValidElement(node)) {
      return null
    }

    return React.cloneElement(node, {
      ref: this.handleRef,
    } as any)
  }
}
