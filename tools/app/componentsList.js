import Code, { Documenter } from './code'
import ImagePreview from './ImagePreview'
import ApiSection from './ApiSection'
import Text from '@applique-ui/text'
import * as components from '@uikit'
import * as icons from '@applique-ui/uikit-icons'

const { /*UikitIcons,*/ ...uiComponents } = components

export const componentsList = {
  ...icons,
  // ...UikitIcons,
  ...uiComponents,
  Documenter,
  ImagePreview,
  code: Code,
  p: Text.P,
  h1: Text.H1,
  h2: Text.H2,
  h3: Text.H3,
  h4: Text.H4,
  caption: Text.Caption,
  Api: ApiSection,
  pre: 'div',
}
