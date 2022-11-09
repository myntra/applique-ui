import React from 'react'
import { render } from 'react-dom'
import { MDXProvider } from '@mdx-js/react'

import '@myntra/uikit/design.scss'

import './css-reset.css'

import App from '@component'

import Code, { Documenter } from './code'
import ImagePreview from './ImagePreview'
import ApiSection from './ApiSection'
import Text from '@myntra/uikit-component-text'
import * as components from '@uikit'

import styles from './styles.scss'

const { UikitIcons, ...uiComponents } = components

const componentsList = {
  ...UikitIcons,
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

const Wrapper = () => {
  return (
    <div className={styles('mdx__container')}>
      <MDXProvider components={componentsList}>
        <App />
      </MDXProvider>
    </div>
  )
}

render(<Wrapper />, document.querySelector('#app'))
