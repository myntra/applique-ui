import React, { Component, cloneElement, ReactElement, RefObject } from 'react'
import AccordionContext from './accordion-context'
import Layout from '@myntra/uikit-component-layout'
import Icon, { IconName } from '@myntra/uikit-component-icon'
import classnames from './accordion-item.module.scss'
import { createRef } from '@myntra/uikit-utils'

export interface Props extends BaseProps {
  /**
   * The title or always visible part of the accordion item.
   */
  title?: ReactElement | string
  /**
   * The icon used to
   */
  controlIcons?: { open: IconName; close: IconName }
}

/**
 * @since 0.3.0
 * @status REVIEWING
 * @see http://uikit.myntra.com/components/accordion#AccordionItem
 */
export default class AccordionItem extends Component<
  Props,
  { active: boolean; style: object }
> {
  index: number
  titleRef: RefObject<HTMLDivElement>
  contentRef: RefObject<HTMLDivElement>

  constructor(props) {
    super(props)

    this.state = {
      active: false,
      style: {},
    }

    this.titleRef = createRef()
    this.contentRef = createRef()
  }

  componentDidMount(): void {
    this.setState({
      style: {
        ...this.state.style,
        height: this.titleRef.current.clientHeight,
      },
    })
  }

  onTitleClick = (callback) => {
    this.setState(
      {
        active: !this.state.active,
        style: {
          ...this.state.style,
          height: !this.state.active
            ? this.contentRef.current.clientHeight +
              this.titleRef.current.clientHeight
            : this.titleRef.current.clientHeight,
        },
      },
      () => {
        callback && callback(this.index, this.state.active)
      }
    )
  }
  render() {
    const { title, children, className, ...props } = this.props
    const { active, style } = this.state

    return (
      <AccordionContext.Consumer>
        {({ getIndex, onActivation, itemProps }) => {
          const index = (this.index = getIndex(this))

          return (
            <Layout
              type="row"
              gutter="none"
              className={classnames('item-container', className, {
                active,
              })}
              data-accordion-index={index}
              style={style}
            >
              <Layout
                type="stack"
                distribution="spaceBetween"
                alignment="middle"
                onClick={() => this.onTitleClick(onActivation)}
                className={classnames('item-title')}
                reference={this.titleRef}
                {...props}
              >
                {typeof title === 'string' ? <div>{title}</div> : title}
                <Icon
                  name={
                    active
                      ? itemProps.controlIcons.open
                      : itemProps.controlIcons.close
                  }
                />
              </Layout>
              <div className={classnames('item-content')} ref={this.contentRef}>
                {children}
              </div>
            </Layout>
          )
        }}
      </AccordionContext.Consumer>
    )
  }
}
