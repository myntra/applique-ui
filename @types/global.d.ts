import { BaseProps as AbstractBaseProps } from './api'
import { mount as Mount, shallow as Shallow } from 'enzyme'

declare global {
  const __DEV__: boolean

  const mount: typeof Mount
  const shallow: typeof Shallow

  interface BaseProps extends AbstractBaseProps {}
}
