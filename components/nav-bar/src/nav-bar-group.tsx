import React from 'react'
import { createContext } from '@myntra/uikit-context'
import Icon from '@myntra/uikit-component-icon'
import NavBarContext from './context'
import classnames from './nav-bar-group.module.scss'
import NavBarItem, { Props as NavBarItemProps } from './nav-bar-item'
import { isReactNodeType, Fragment } from '@myntra/uikit-utils'

import ChevronUpSolid from 'uikit-icons/svgs/ChevronUpSolid'
import ChevronDownSolid from 'uikit-icons/svgs/ChevronDownSolid'

interface Props extends BaseProps, NavBarItemProps {
  /**
   * The title of the nav group.
   */
  title: string

  /**
   * List of nav links and groups. Only [NavBar.Group](#NavBarGroup) and [NavBar.Item](#NavBarItem) should be used here.
   */
  children: React.ReactNode

  /**
   * Internal nav item ID. Auto injected.
   *
   * @private
   */
  __$navId: number[]
}

interface NavBarGroupContext {
  depth: number
}

export const Context = createContext<NavBarGroupContext>({
  depth: 0,
})

function injectNavId(children: any, id: number[]) {
  return React.Children.map(children, (child: any, index) =>
    isReactNodeType(child, NavBarGroup)
      ? React.cloneElement(child, { __$navId: [...id, index] })
      : child
  )
}

/**
 * A group of [links](#NavGroupItem) in the nav bar.
 *
 * This component should be used as a child of [NavBar](#NavBar) or other [NavBar.Group](#NavBarGroup) component.
 *
 * @since 0.3.0
 * @status REVIEWING
 * @category sub-component
 * @see http://uikit.myntra.com/components/nav-bar#NavBarGroup
 */
export default function NavBarGroup({
  title,
  children,
  className,
  __$navId: id,
  to,
  ...props
}: Props) {
  function render(
    depth: number,
    setActiveGroup: any,
    isActiveGroup: (id: any) => boolean,
    isActivePath: (to: any, isGroup?: boolean) => boolean,
    isOpen: boolean
  ) {
    if (!id) return null

    return depth > 0 ? (
      <Fragment>
        <NavBarItem
          {...props}
          className={classnames(className, {
            'is-active': to && isActivePath(to, true),
          })}
          onActivation={(event) => {
            // Stop event propagation so parent NavBar.Group is not triggered.
            event.stopPropagation()
            // Toggle state of the NavBar.Group.
            isActiveGroup(id)
              ? setActiveGroup(id.slice(0, id.length - 1))
              : setActiveGroup(id)
          }}
          aria-haspopup="true"
          aria-expanded={`${isActiveGroup(id)}`}
          tabIndex={0}
          key={id.join('.') + ':title'}
          role="button"
        >
          <div className={classnames('group-container')}>
            <div className={classnames('group-title')}>{title}</div>

            <Icon
              className={classnames('group-expand')}
              name={isActiveGroup(id) ? ChevronUpSolid : ChevronDownSolid}
              onClick={(event) => {
                // Stop event propagation so parent NavBar.Group is not triggered.
                event.stopPropagation()
                // Toggle state of the NavBar.Group.
                isActiveGroup(id)
                  ? setActiveGroup(id.slice(0, id.length - 1))
                  : setActiveGroup(id)
              }}
            />
          </div>
        </NavBarItem>
        {isOpen && isActiveGroup(id) && (
          <Context.Provider value={{ depth: depth + 1 }}>
            <ul className={classnames('group')} key={id.join('.')}>
              {injectNavId(children, id)}
            </ul>
          </Context.Provider>
        )}
      </Fragment>
    ) : (
      <Context.Provider value={{ depth: depth + 1 }}>
        <ul className={classnames('group', className)} key={id.join('.')}>
          {injectNavId(children, id)}
        </ul>
      </Context.Provider>
    )
  }

  return (
    <NavBarContext.Consumer>
      {({ setActiveGroup, isActiveGroup, isOpen, isActivePath }) => (
        <Context.Consumer>
          {({ depth }) =>
            render(depth, setActiveGroup, isActiveGroup, isActivePath, isOpen)
          }
        </Context.Consumer>
      )}
    </NavBarContext.Consumer>
  )
}
