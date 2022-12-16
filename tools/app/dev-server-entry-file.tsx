import React from 'react'
import { render } from 'react-dom'
import { MDXProvider } from '@mdx-js/react'

import '@applique-ui/uikit/design.scss'

import './css-reset.css'

import App from '@component'

import { componentsList } from './componentsList'

import styles from './styles.scss'

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
