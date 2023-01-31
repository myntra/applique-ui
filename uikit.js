import { lazy } from 'react'
function asyncComponent(factory) {
  const Component = lazy(factory)
  const cache = {}

  return new Proxy(Component, {
    get(target, name) {
      if (typeof name === 'string' && /^[A-Z]/.test(name)) {
        // const result = Component._result

        return (
          cache[name] ||
          (cache[name] = lazy(async () => {
            const { default: Component } = await factory()

            return { __esModule: true, default: Component[name] }
          }))
        )
      }

      return target[name]
    }
  })
}
export const Accordion = asyncComponent(() =>
  import(/* webpackChunkName: 'components/accordion' */ '@applique-ui/accordion')
)
export const Avatar = asyncComponent(() => import(/* webpackChunkName: 'components/avatar' */ '@applique-ui/avatar'))
export const Badge = asyncComponent(() => import(/* webpackChunkName: 'components/badge' */ '@applique-ui/badge'))
export const Banner = asyncComponent(() => import(/* webpackChunkName: 'components/banner' */ '@applique-ui/banner'))
export const BreadCrumb = asyncComponent(() =>
  import(/* webpackChunkName: 'components/bread-crumb' */ '@applique-ui/bread-crumb')
)
export const Button = asyncComponent(() => import(/* webpackChunkName: 'components/button' */ '@applique-ui/button'))
export const ButtonGroup = asyncComponent(() =>
  import(/* webpackChunkName: 'components/button-group' */ '@applique-ui/button-group')
)
export const ClickAway = asyncComponent(() =>
  import(/* webpackChunkName: 'components/click-away' */ '@applique-ui/click-away')
)
export const Dropdown = asyncComponent(() =>
  import(/* webpackChunkName: 'components/dropdown' */ '@applique-ui/dropdown')
)
export const ErrorBoundary = asyncComponent(() =>
  import(/* webpackChunkName: 'components/error-boundary' */ '@applique-ui/error-boundary')
)
export const Fab = asyncComponent(() => import(/* webpackChunkName: 'components/fab' */ '@applique-ui/fab'))
export const Field = asyncComponent(() => import(/* webpackChunkName: 'components/field' */ '@applique-ui/field'))
export const Form = asyncComponent(() => import(/* webpackChunkName: 'components/form' */ '@applique-ui/form'))
export const Grid = asyncComponent(() => import(/* webpackChunkName: 'components/grid' */ '@applique-ui/grid'))
export const Icon = asyncComponent(() => import(/* webpackChunkName: 'components/icon' */ '@applique-ui/icon'))
export const Image = asyncComponent(() => import(/* webpackChunkName: 'components/image' */ '@applique-ui/image'))
export const Input = asyncComponent(() => import(/* webpackChunkName: 'components/input' */ '@applique-ui/input'))
export const InputCheckbox = asyncComponent(() =>
  import(/* webpackChunkName: 'components/input-checkbox' */ '@applique-ui/input-checkbox')
)
export const InputDate = asyncComponent(() =>
  import(/* webpackChunkName: 'components/input-date' */ '@applique-ui/input-date')
)
export const InputFile = asyncComponent(() =>
  import(/* webpackChunkName: 'components/input-file' */ '@applique-ui/input-file')
)
export const InputMasked = asyncComponent(() =>
  import(/* webpackChunkName: 'components/input-masked' */ '@applique-ui/input-masked')
)
export const InputMonth = asyncComponent(() =>
  import(/* webpackChunkName: 'components/input-month' */ '@applique-ui/input-month')
)
export const InputNumber = asyncComponent(() =>
  import(/* webpackChunkName: 'components/input-number' */ '@applique-ui/input-number')
)
export const InputRadio = asyncComponent(() =>
  import(/* webpackChunkName: 'components/input-radio' */ '@applique-ui/input-radio')
)
export const InputSelect = asyncComponent(() =>
  import(/* webpackChunkName: 'components/input-select' */ '@applique-ui/input-select')
)
export const InputText = asyncComponent(() =>
  import(/* webpackChunkName: 'components/input-text' */ '@applique-ui/input-text')
)
export const InputTextArea = asyncComponent(() =>
  import(/* webpackChunkName: 'components/input-text-area' */ '@applique-ui/input-text-area')
)
export const Layout = asyncComponent(() => import(/* webpackChunkName: 'components/layout' */ '@applique-ui/layout'))
export const List = asyncComponent(() => import(/* webpackChunkName: 'components/list' */ '@applique-ui/list'))
export const Loader = asyncComponent(() => import(/* webpackChunkName: 'components/loader' */ '@applique-ui/loader'))
export const Measure = asyncComponent(() => import(/* webpackChunkName: 'components/measure' */ '@applique-ui/measure'))
export const Modal = asyncComponent(() => import(/* webpackChunkName: 'components/modal' */ '@applique-ui/modal'))
export const NavBar = asyncComponent(() => import(/* webpackChunkName: 'components/nav-bar' */ '@applique-ui/nav-bar'))
export const Page = asyncComponent(() => import(/* webpackChunkName: 'components/page' */ '@applique-ui/page'))
export const Pagination = asyncComponent(() =>
  import(/* webpackChunkName: 'components/pagination' */ '@applique-ui/pagination')
)
export const Portal = asyncComponent(() => import(/* webpackChunkName: 'components/portal' */ '@applique-ui/portal'))
export const Progress = asyncComponent(() =>
  import(/* webpackChunkName: 'components/progress' */ '@applique-ui/progress')
)
export const SchemaForm = asyncComponent(() =>
  import(/* webpackChunkName: 'components/schema-form' */ '@applique-ui/schema-form')
)
export const Section = asyncComponent(() => import(/* webpackChunkName: 'components/section' */ '@applique-ui/section'))
export const Stepper = asyncComponent(() => import(/* webpackChunkName: 'components/stepper' */ '@applique-ui/stepper'))
export const Table = asyncComponent(() => import(/* webpackChunkName: 'components/table' */ '@applique-ui/table'))
export const Tabs = asyncComponent(() => import(/* webpackChunkName: 'components/tabs' */ '@applique-ui/tabs'))
export const Text = asyncComponent(() => import(/* webpackChunkName: 'components/text' */ '@applique-ui/text'))
export const Tooltip = asyncComponent(() => import(/* webpackChunkName: 'components/tooltip' */ '@applique-ui/tooltip'))
export const TopBar = asyncComponent(() => import(/* webpackChunkName: 'components/top-bar' */ '@applique-ui/top-bar'))
export const TopNav = asyncComponent(() => import(/* webpackChunkName: 'components/top-nav' */ '@applique-ui/top-nav'))
export const VirtualGrid = asyncComponent(() =>
  import(/* webpackChunkName: 'components/virtual-grid' */ '@applique-ui/virtual-grid')
)
export const VirtualList = asyncComponent(() =>
  import(/* webpackChunkName: 'components/virtual-list' */ '@applique-ui/virtual-list')
)

export const META = [
  {
    name: 'Accordion',
    path: '/components/accordion'
  },
  {
    name: 'Accordion',
    path: '/components/accordion'
  },
  {
    name: 'Avatar',
    path: '/components/avatar'
  },
  {
    name: 'Badge',
    path: '/components/badge'
  },
  {
    name: 'Banner',
    path: '/components/banner'
  },
  {
    name: 'Banner',
    path: '/components/banner'
  },
  {
    name: 'BreadCrumb',
    path: '/components/bread-crumb'
  },
  {
    name: 'BreadCrumb',
    path: '/components/bread-crumb'
  },
  {
    name: 'Button',
    path: '/components/button'
  },
  {
    name: 'Button',
    path: '/components/button'
  },
  {
    name: 'Button',
    path: '/components/button'
  },
  {
    name: 'Button',
    path: '/components/button'
  },
  {
    name: 'Button',
    path: '/components/button'
  },
  {
    name: 'ButtonGroup',
    path: '/components/button-group'
  },
  {
    name: 'ClickAway',
    path: '/components/click-away'
  },
  {
    name: 'Dropdown',
    path: '/components/dropdown'
  },
  {
    name: 'ErrorBoundary',
    path: '/components/error-boundary'
  },
  {
    name: 'Fab',
    path: '/components/fab'
  },
  {
    name: 'Field',
    path: '/components/field'
  },
  {
    name: 'Form',
    path: '/components/form'
  },
  {
    name: 'Grid',
    path: '/components/grid'
  },
  {
    name: 'Grid',
    path: '/components/grid'
  },
  {
    name: 'Icon',
    path: '/components/icon'
  },
  {
    name: 'Image',
    path: '/components/image'
  },
  {
    name: 'Input',
    path: '/components/input'
  },
  {
    name: 'InputCheckbox',
    path: '/components/input-checkbox'
  },
  {
    name: 'InputDate',
    path: '/components/input-date'
  },
  {
    name: 'InputDate',
    path: '/components/input-date'
  },
  {
    name: 'InputDate',
    path: '/components/input-date'
  },
  {
    name: 'InputFile',
    path: '/components/input-file'
  },
  {
    name: 'InputMasked',
    path: '/components/input-masked'
  },
  {
    name: 'InputMonth',
    path: '/components/input-month'
  },
  {
    name: 'InputMonth',
    path: '/components/input-month'
  },
  {
    name: 'InputNumber',
    path: '/components/input-number'
  },
  {
    name: 'InputRadio',
    path: '/components/input-radio'
  },
  {
    name: 'InputSelect',
    path: '/components/input-select'
  },
  {
    name: 'InputSelect',
    path: '/components/input-select'
  },
  {
    name: 'InputSelect',
    path: '/components/input-select'
  },
  {
    name: 'InputText',
    path: '/components/input-text'
  },
  {
    name: 'InputTextArea',
    path: '/components/input-text-area'
  },
  {
    name: 'Layout',
    path: '/components/layout'
  },
  {
    name: 'Layout',
    path: '/components/layout'
  },
  {
    name: 'Layout',
    path: '/components/layout'
  },
  {
    name: 'List',
    path: '/components/list'
  },
  {
    name: 'List',
    path: '/components/list'
  },
  {
    name: 'Loader',
    path: '/components/loader'
  },
  {
    name: 'Measure',
    path: '/components/measure'
  },
  {
    name: 'Modal',
    path: '/components/modal'
  },
  {
    name: 'Modal',
    path: '/components/modal'
  },
  {
    name: 'NavBar',
    path: '/components/nav-bar'
  },
  {
    name: 'NavBar',
    path: '/components/nav-bar'
  },
  {
    name: 'NavBar',
    path: '/components/nav-bar'
  },
  {
    name: 'Page',
    path: '/components/page'
  },
  {
    name: 'Pagination',
    path: '/components/pagination'
  },
  {
    name: 'Portal',
    path: '/components/portal'
  },
  {
    name: 'Progress',
    path: '/components/progress'
  },
  {
    name: 'Progress',
    path: '/components/progress'
  },
  {
    name: 'Progress',
    path: '/components/progress'
  },
  {
    name: 'SchemaForm',
    path: '/components/schema-form'
  },
  {
    name: 'Section',
    path: '/components/section'
  },
  {
    name: 'Stepper',
    path: '/components/stepper'
  },
  {
    name: 'Stepper',
    path: '/components/stepper'
  },
  {
    name: 'Stepper',
    path: '/components/stepper'
  },
  {
    name: 'Stepper',
    path: '/components/stepper'
  },
  {
    name: 'Table',
    path: '/components/table'
  },
  {
    name: 'Table',
    path: '/components/table'
  },
  {
    name: 'Table',
    path: '/components/table'
  },
  {
    name: 'Table',
    path: '/components/table'
  },
  {
    name: 'Tabs',
    path: '/components/tabs'
  },
  {
    name: 'Tabs',
    path: '/components/tabs'
  },
  {
    name: 'Text',
    path: '/components/text'
  },
  {
    name: 'Text',
    path: '/components/text'
  },
  {
    name: 'Tooltip',
    path: '/components/tooltip'
  },
  {
    name: 'TopBar',
    path: '/components/top-bar'
  },
  {
    name: 'TopBar',
    path: '/components/top-bar'
  },
  {
    name: 'TopNav',
    path: '/components/top-nav'
  },
  {
    name: 'TopNav',
    path: '/components/top-nav'
  },
  {
    name: 'TopNav',
    path: '/components/top-nav'
  },
  {
    name: 'TopNav',
    path: '/components/top-nav'
  },
  {
    name: 'TopNav',
    path: '/components/top-nav'
  },
  {
    name: 'TopNav',
    path: '/components/top-nav'
  },
  {
    name: 'VirtualGrid',
    path: '/components/virtual-grid'
  },
  {
    name: 'VirtualList',
    path: '/components/virtual-list'
  },
  {
    name: 'VirtualList',
    path: '/components/virtual-list'
  }
]
