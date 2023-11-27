import React, { PureComponent } from 'react'
import InputSelect from '@applique-ui/input-select'
import InputNumber from '@applique-ui/input-number'
import Layout from '@applique-ui/layout'

import Pages from './pages'
import classnames from './pagination.module.scss'

export interface Props extends BaseProps {
  /** Current selected page */
  page: number
  /** On change handler */
  onChange(payload: { page: number; size: number }): void
  /** Sizes per page */
  size: number
  /** Total count of result items */
  total: number
  /** Allowed page sizes. Try using virtualized table for sizes > 50 */
  sizes?: number[]
  /** Hide size selector */
  hideSize?: boolean
  /** Hide page selector dropdown */
  pageInputDisabled?: boolean
  /** @private */
  className?: string
}

/**
 The Pagination component.
 @since 0.3.0
 @status REVIEWING
 @category basic
 @see http://uikit.myntra.com/components/pagination
 */
export default function Pagination(props: Props) {
  const [pageNumberCustom, setPageNumberCustom] = React.useState(null)

  const updatePage = (page) => {
    const pages = Math.ceil(props.total / props.size)
    const size = props.size

    if (page > 0 && page <= pages) {
      props.onChange({ size, page })
    }
  }

  const handlePageChange = (event) => {
    if (event.key === 'Enter') {
      updatePage(parseInt(event.target.value, 10))
      setPageNumberCustom(null)
    }
  }

  const handleSizeChange = (value) => {
    props.onChange({ size: parseInt(value, 10), page: 1 })
  }

  const {
    total,
    size,
    page,
    className,
    sizes,
    hideSize,
    pageInputDisabled,
  } = props

  return (
    <div className={classnames('pagination')}>
      {!hideSize && (
        <div className={classnames('pagination-select-size-wrapper')}>
          <InputSelect
            up
            variant="bordered"
            required
            options={sizes.map((size) => ({
              label: `${size}/page`,
              value: size,
            }))}
            value={size}
            onChange={handleSizeChange}
          />
        </div>
      )}
      <Pages
        className={className}
        currentPage={page}
        totalCount={total}
        pageSize={size}
        onPageChange={updatePage}
      />
      <Layout
        type="stack"
        distribution="center"
        alignment="middle"
        gutter="medium"
      >
        <span>Go to</span>
        <div className={classnames('pagination-page-input-wrapper')}>
          <InputNumber
            value={pageNumberCustom}
            onChange={setPageNumberCustom}
            disabled={!!pageInputDisabled}
            onKeyDown={handlePageChange}
          />
        </div>
        <span>Page</span>
      </Layout>
    </div>
  )
}

Pagination.defaultProps = {
  page: 8,
  size: 10,
  sizes: [10, 15, 30, 50],
}

Pagination.propTypes = {
  __$validation({ sizes }) {
    if (sizes.some((size) => size > 50))
      console.warn(
        'Too many rows rendered at a time. Try using virtualized table. Visit here https://uikit.myntra.com/components/table#very-large-table'
      )
  },
}
