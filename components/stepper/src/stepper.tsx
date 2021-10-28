import React, {
  PureComponent,
  Children,
  isValidElement,
  cloneElement,
} from 'react'
import classnames from './stepper.module.scss'
import Step from './step'
import SmallStep from './small-step'

interface Props extends BaseProps {
  /**
   * Orientation of the stepper
   */
  orientation: 'vertical' | 'horizontal'
  /** className */
  className?: string
}

/**
 * Stepper works as a progress tracker through linear workflow
 *
 * @since 1.13.42
 * @status REVIEWING
 * @category basic
 * @see http://uikit.myntra.com/components/stepper
 */
export default class Stepper extends PureComponent<
  Props,
  {
    activeStep: number
  }
> {
  static Step = Step
  static SmallStep = SmallStep

  static propTypes = {
    __$validation({ children }) {
      if (Children.toArray(children).length < 2) {
        throw new Error('Minimum of 2 steps should be present for the Stepper')
      }
    },
  }
  static defaultProps = {
    orientation: 'horizontal',
  }

  constructor(props) {
    super(props)
    this.state = {
      activeStep: 0,
    }
  }

  componentDidMount() {
    const children: any = Children.toArray(
      this.props.children
    ).filter((child) => isValidElement(child))
    var activeStep: number = this.state.activeStep
    Children.forEach(children, (child: any, index) => {
      if (child.props.completed) {
        if (child.props.children) {
          const allChildComplete = !Children.toArray(child.props.children).find(
            (child: any) => !child.props.completed
          )
          if (allChildComplete) activeStep = index + 1
        } else {
          activeStep = index + 1
        }
      }
    })
    this.setState({
      activeStep,
    })
  }

  render() {
    const children: any = Children.toArray(
      this.props.children
    ).filter((child) => isValidElement(child))
    if (!children.length) return null
    const { className, orientation, children: _, ...props } = this.props
    const { activeStep } = this.state

    return (
      <div className={classnames('stepper', className)} {...props}>
        <div
          className={classnames(
            'stepper__pane',
            `stepper__pane--${orientation}`
          )}
        >
          {Children.map(children, (child: any, index) =>
            cloneElement(child, {
              'data-index': index,
              hasSeparator: !(index === children.length - 1),
              orientation,
              active: activeStep === index,
            })
          )}
        </div>
      </div>
    )
  }
}
