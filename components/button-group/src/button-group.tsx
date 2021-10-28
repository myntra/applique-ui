import React, { PureComponent, Children } from 'react'
import classnames from './button-group.module.scss'
import Button, { KIND } from '@myntra/uikit-component-button'
import List from '@myntra/uikit-component-list'
import Dropdown from '@myntra/uikit-component-dropdown'
import EllipsisVSolid from 'uikit-icons/svgs/EllipsisVSolid'

export interface Props extends BaseProps {
  /** Property to be used in case only single type of button is required and all others under more drop down */
  structure?: 'primary-group' | 'secondary-group' | 'link-group'
}

interface State {
  isOpen: boolean
  sequenceMapping: Record<string, string>
}

/**
 * Button groups are used to bunch together buttons with similar actions in a horizontal row to help with arrangement and spacing.
 *
 * @since 1.0.0
 * @status EXPERIMENTAL
 * @category basic
 * @see http://uikit.myntra.com/components/button-group
 */

export default class ButtonGroup extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      sequenceMapping: {
        [KIND.primary]: KIND.secondary,
        [KIND.secondary]: KIND.text,
      },
    }
  }

  static defaultProps = {
    structure: null,
  }

  setOpen = (val) => {
    this.setState({
      isOpen: val,
    })
  }

  getNextValidButtonType = (type) => {
    const { sequenceMapping } = this.state
    return sequenceMapping[type]
  }

  render() {
    const { className, children, structure } = this.props
    const { isOpen } = this.state
    const nodes: any = Children.toArray(children)

    if (!nodes.length) return null

    const isStructureGroup =
      structure && structure.match(new RegExp(nodes[0].props.type))
    let buttons = []
    let moreStartIndex: number
    let typesFound: string[] = []

    // Structure will be valid only if the type of very first button element matched the structure name
    if (isStructureGroup) {
      buttons.push(nodes[0])
      moreStartIndex = 1
    } else {
      nodes.every((button: any, index: number) => {
        const { type } = button.props || Button.defaultProps
        if (
          !(
            typesFound.includes(type) ||
            typesFound.includes(this.getNextValidButtonType(type))
          )
        ) {
          buttons.push(button)
          typesFound.push(type)
          return true
        } else {
          moreStartIndex = index
          return false
        }
      })
    }

    let moreElements =
      moreStartIndex && nodes.slice(moreStartIndex, nodes.length)

    // Cases where more field will have only 1 button or 2 same button types are present
    if (!isStructureGroup && moreElements && moreElements.length === 1) {
      if (nodes.length >= 3) {
        const nextButtonType = this.getNextValidButtonType(
          moreElements[0].props.type
        )
        if (nextButtonType === KIND.text && nodes.length === 3) {
          buttons.push(
            React.cloneElement(moreElements[0], {
              type: nextButtonType,
            })
          )
          moreElements.pop()
        } else {
          moreElements.push(buttons.pop())
        }
      } else {
        const nextButtonType = this.getNextValidButtonType(
          buttons[0].props.type
        )
        if (nextButtonType) {
          buttons.push(
            React.cloneElement(moreElements[0], {
              type: nextButtonType,
            })
          )
        } else {
          throw new Error('Not a correct sequence')
        }

        moreElements = []
      }
    }

    return (
      <div className={classnames(className)}>
        {buttons.reverse()}
        {moreElements && !!moreElements.length && (
          <Dropdown
            auto={true}
            container={true}
            trigger={<Button icon={EllipsisVSolid} />}
            isOpen={isOpen}
            onOpen={() => this.setOpen(true)}
            onClose={() => this.setOpen(false)}
            className={classnames('menu')}
          >
            <List
              className={classnames('items')}
              items={moreElements}
              idForItem={(item) => item.key}
            >
              {({ item, index }) =>
                React.cloneElement(item, { type: KIND.text, key: index })
              }
            </List>
          </Dropdown>
        )}
      </div>
    )
  }
}
