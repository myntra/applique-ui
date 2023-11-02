import React, { PureComponent, useState, useCallback, useMemo } from 'react'
import Icon from '@applique-ui/icon'
import { range } from '@applique-ui/uikit-utils'
import Button from '@applique-ui/button'
import ChevronLeftSolid from 'uikit-icons/svgs/ChevronLeftSolid'
import ChevronRightSolid from 'uikit-icons/svgs/ChevronRightSolid'

import classnames from './pagination.module.scss'
import { generateModel } from './generator'
import { VisuallyHidden } from "../../../internal/components";

type PaginationElements = {
    /** Current selected page */
    page: number
    /** On change handler */
    onChange(payload: { page: number; size: number }): void
    /** Total count of result items */
    total: number
    /** Allowed page sizes. Try using virtualized table for sizes > 50 */
    sizes?: number[]

    adjacentPageCount?: number

    totalPages: number

    pageLimit?: number
}

export type Props = Omit<React.ComponentPropsWithoutRef<'nav'>, 'onChange'> & BaseProps & {
  'aria-label': string
  /** Sizes per page */
  size: number
  /** Hide size selector */
  hideSize?: boolean
  /** Hide page selector dropdown */
  pageInputDisabled?: boolean
  /** Current selected page */
  page: number
  /** On change handler */
  onChange(payload: { page: number; size: number }): void
  /** Total count of result items */
  total: number
  /** Allowed page sizes. Try using virtualized table for sizes > 50 */
  sizes?: number[]

  adjacentPageCount?: number
}

const MAX_TRUNCATED_STEP_COUNT = 7

function useGenerateElements(config: PaginationElements) {
  const {
    page,
    onChange,
    total,
    sizes,
    adjacentPageCount,
    totalPages,
  } = config

  const selectPreviousPage = useCallback(() => {
    selectPage(Math.max(1, page - 1))
  }, [page])

  const selectNextPage = useCallback(() => {
    selectPage(Math.min(totalPages, page + 1))
  }, [totalPages, page]);

  const [startIndexOffset, setStartIndexOffset] = useState(() => {
    if ((page - adjacentPageCount) <= 2) {
      return 1
    }
    return (page - adjacentPageCount) - 1
  })

  const [model, hasLeadingTruncation, hasEndingTruncation] = React.useMemo(() => {
    return generateModel({
      page,
      total,
      sizes,
      adjacentPageCount,
      totalPages,
      startIndexOffset
    })
  }, [page,
    total,
    sizes,
    adjacentPageCount,
    totalPages,
    startIndexOffset
  ])
  
  const children = React.useMemo(() => {
    return model.map(page => {
      let props = {}
      let content = ''
      let key = ''
      switch(page.type) {
        case 'BREAK': {
          return <TruncationStep key={`page-${page.num}-break`}/>
        }
        case 'PREV': {
          key = 'page-prev'
          if (page.disabled) {
            props = { ...props, disabled: true, 'aria-disabled': 'true' }
          }
          else {
            props = { ...props, 'aria-label': 'Previous Page' }
          }
          return <PageStep
            {...props}
            key={key}
            onClick={() => {
              if (page.disabled) {
                return
              }
              if (hasLeadingTruncation && (( (totalPages -  page.num) - adjacentPageCount) > 2)) {
                setStartIndexOffset(prev => prev - 1)
              }
              selectPreviousPage()
            }}
            icon={ChevronLeftSolid}
          >
            <VisuallyHidden>&nbsp;page</VisuallyHidden>
          </PageStep>
        }
        case 'NEXT': {
          key = 'page-next'
          if (page.disabled) {
            props = { ...props, disabled: true, 'aria-disabled': 'true' }
          }
          else {
            props = { ...props, 'aria-label': 'Next Page' }
          }
          return <PageStep
            {...props}
            key={key}
            onClick={() => {
              if (page.disabled) {
                return
              }
              if (hasEndingTruncation && ((page.num - adjacentPageCount) > 2)) {
                setStartIndexOffset(prev => prev + 1)
              }
              selectNextPage()
            }}
            icon={ChevronRightSolid}
          >
            <VisuallyHidden>&nbsp;page</VisuallyHidden>
          </PageStep>
        }
        case 'NUM': {
          key = `page-${page.num}`
          return <PageStep
            {...props}
            key={key}
            type={page.selected ? 'primary' : 'tertiary'}
            onClick={() => {
              if (page.disabled) {
                return
              }
              // if (!(startIndexOffset === 1 && (page.num - adjacentPageCount) <= 2)) {
              //   setStartIndexOffset((page.num - adjacentPageCount) - 1)
              // }
              if (hasEndingTruncation && hasLeadingTruncation) {
                console.log("ss")
              }
              selectPage(parseInt(page.num))
            }}
          >
            {String(page.num)}
            {page.precedesBreak ? (
                        <VisuallyHidden>…</VisuallyHidden>
                      ) : null}
            <VisuallyHidden>&nbsp;page</VisuallyHidden>
          </PageStep>
        }
      }
      return {props, content, key}
    })
  }, [model, selectPage, selectNextPage, selectPreviousPage])

  function selectPage(newPage: number) {
    if (page !== newPage) {
      // logic for changing start and end index

      ////
      onChange({page: newPage, size: sizes[0]})
    }
  } 

  return children
}

function TruncationStep() {
  return (
    /**
     * aria-hidden attribute indicates that the element and all of its descendants 
     * are not visible or perceivable and screen readers will skip over this element.
     */
    <li className={classnames('truncation-step')}><span aria-hidden="true">...</span></li>
  )
}

function PageStep(config) {
  const {
    children,
    ...restProp
  } = config
  return (
    <li className={classnames('page-step')}>
      <Button {...restProp}>
        {children}
      </Button>
    </li>
  )
}

function Step({active, content}) {
  return (
    <li className={classnames('pagination-step')}>
      <Button
        className={classnames('pagination-page')}
        type={active ? "secondary" : 'tertiary'}
      >{content}</Button>
    </li>
  )
}

export function P({
  page,
  sizes = [10, 15, 30, 50],
  total,
  onChange = noOp,
  adjacentPageCount = 2,
  ...props
}: Props) {
  const [pageLimit, setPageLimit] = useState<number>(sizes[0])
  const totalPages: number = total / pageLimit
}

function Element(config: PaginationElements) {
  const [temp, setTemp] = React.useState(6)
  // const model = React.useMemo(() => {}, )
  const elementsToRender = useGenerateElements(config)
  return (
    <div>
      <ol className={classnames('pagination-new')}>
      {elementsToRender}
      </ol>
    </div>
  )
}

/**
 The Pagination component.
 @since 0.3.0
 @status REVIEWING
 @category basic
 @see http://uikit.myntra.com/components/pagination
 */
export default class Pagination extends PureComponent<Props> {
  static defaultProps = {
    page: 1,
    size: 15,
    sizes: [10, 15, 30, 50],
    adjacentPageCount: 2
  }

  static propTypes = {
    __$validation({ sizes }) {
      if (sizes.some((size) => size > 50))
        console.warn(
          'Too many rows rendered at a time. Try using virtualized table. Visit here https://uikit.myntra.com/components/table#very-large-table'
        )
    },
  }

  updatePage = (page) => {
    const pages = this.totalPages
    const size = this.props.size

    if (page > 0 && page <= pages) {
      this.props.onChange({ size, page })
    }
  }

  get totalPages() {
    return Math.ceil(this.props.total / this.props.size)
  }

  handlePageChange = (e) => {
    this.updatePage(parseInt(e.target.value, 10))
  }

  handleSizeChange = (e) => {
    // TODO: Should we keep user on current page?
    this.props.onChange({ size: parseInt(e.target.value, 10), page: 1 })
  }

  render() {
    const {
      total,
      size,
      page,
      className,
      sizes,
      hideSize,
      pageInputDisabled,
      adjacentPageCount,
      onChange,
    } = this.props
    const totalPages = Math.ceil(total / size)
    const pages = range(1, pageInputDisabled ? 1 : totalPages).map(
      (page) => page
    )
    const start = ((page - 1) * size) + 1
    const end = total < (page * size) ? total : (page * size)
    const prop = {
      page,
      onChange,
      total,
      sizes,
      adjacentPageCount,
      totalPages,
    }
    return (
      <div className={classnames('pagination', className)}>
        <Element {...prop}/>
        {!hideSize && (
          <div className={classnames('size')}>
            <span>Rows per page:</span>
            <div className={classnames('page-size')}>
              <select value={size} onChange={this.handleSizeChange}>
                {sizes.map((item) => {
                  return (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  )
                })}
              </select>
              <i className={classnames('select-chevron-down')} />
            </div>
          </div>
        )}

        <div className={classnames('size-label')}>
          <strong>
            {start} to {end}
          </strong>{' '}
          of {total}
        </div>

        <div
          role="button"
          className={classnames('arrow-container')}
          onClick={() => this.updatePage(page - 1)}
        >
          <Icon
            name={ChevronLeftSolid}
            className={classnames('pagination-arrow')}
          />
        </div>
        <select
          className={classnames('select-page')}
          value={page}
          onChange={this.handlePageChange}
          disabled={!!pageInputDisabled}
        >
          {pages.map((pageList) => {
            return (
              <option value={pageList} key={pageList}>
                {pageList}
              </option>
            )
          })}
        </select>
        <div
          role="button"
          className={classnames('arrow-container')}
          onClick={() => this.updatePage(page + 1)}
        >
          <Icon
            name={ChevronRightSolid}
            className={classnames('pagination-arrow')}
          />
        </div>
      </div>
    )
  }
}

const noOp = () => {
  /*noop*/
}