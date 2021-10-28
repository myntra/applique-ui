import React, { PureComponent } from 'react'
import Dropdown from '@myntra/uikit-component-dropdown'

import classnames from './tooltip.module.scss'

export interface Props extends BaseProps {
  /** Content of the tooltip */
  renderContent(): JSX.Element
  /** Position with relative to children */
  position?: 'up' | 'down' | 'left' | 'right'
  /** Event to display the tooltip */
  triggerOn?: 'hover' | 'click' | 'focus'
  /** Displays a tooltip with dark background */
  dark?: boolean
}

/**
 * Tooltip component.
 * @since 0.6.0
 * @status REVIEWING
 */
export default class Tooltip extends PureComponent<Props, { open: boolean }> {
  static defaultProps = {
    triggerOn: 'hover',
    position: 'up',
  }

  state = {
    open: false,
  }

  render() {
    const {
      position,
      children,
      className,
      triggerOn,
      dark,
      renderContent,
    } = this.props

    const dropdownPosition = {
      up: position === 'up',
      down: position === 'down',
      left: ['up', 'down', 'left'].includes(position),
      right: ['up', 'down', 'right'].includes(position),
    }

    const [child] = React.Children.toArray(children).filter((node) => !!node)

    return (
      <Dropdown
        container
        isOpen={this.state.open}
        className={classnames('dropdown', className)}
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        renderTrigger={(props) =>
          React.isValidElement(child) ? (
            React.cloneElement(child, props)
          ) : (
            <span {...props}>{child}</span>
          )
        }
        triggerOn={triggerOn}
        data-test-id="tooltip-trigger"
        wrapperClassName="no-shadow"
        {...dropdownPosition}
      >
        {({ content }) => (
          <div
            className={classnames('tooltip', this.props.position)}
            data-test-id="tooltip"
          >
            <div
              className={classnames(
                'tooltip-content',
                position,
                dark ? 'dark' : 'light'
              )}
              data-test-id="content"
            >
              {renderContent()}
            </div>
            <div
              className={classnames('arrow', position, dark ? 'dark' : 'light')}
              style={
                {
                  '--u-tooltip-x': `${content ? content.minWidth / 2 : 0}px`,
                } as any
              }
            />
          </div>
        )}
      </Dropdown>
    )
  }
}
