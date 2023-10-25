import React from 'react'
import Button from '@applique-ui/button'
import Layout from '@applique-ui/layout'
import Icon from '@applique-ui/icon'

import ChevronLeftSolid from 'uikit-icons/svgs/ChevronLeftSolid'
import ChevronRightSolid from 'uikit-icons/svgs/ChevronRightSolid'
import { usePagination, DOTS } from './usePagination'
import classnames from './pagination.module.scss'

export interface SkipPagesProps extends BaseProps {
  /** Type of skip page */
  type: DOTS.LEFT | DOTS.RIGHT
  /** On page change handler */
  onPageChange(page: number): void
  /** Current page number */
  currentPage: number
}

const SkipPages = ({ onPageChange, type, currentPage }) => {
  const [isHovering, setIsHovering] = React.useState(false)

  const handleMouseOver = () => {
    setIsHovering(true)
  }

  const handleMouseOut = () => {
    setIsHovering(false)
  }

  const onSkipClick = () => {
    onPageChange(type === DOTS.LEFT ? currentPage - 5 : currentPage + 5)
  }

  return (
    <Layout
      distribution="center"
      alignment="middle"
      type="stack"
      gutter="large"
      className={classnames('pages-item-skip-pages')}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {isHovering ? (
        <Icon name={ChevronRightSolid} onClick={onSkipClick} />
      ) : (
        <span>&#8230;</span>
      )}
    </Layout>
  )
}

export interface PagesProps extends BaseProps {
  /** total number of records */
  totalCount: number
  /** On page change handler */
  onPageChange(page: number): void
  /** The number of siblings */
  siblingCount?: number
  /** Current page number */
  currentPage: number
  /** Current page size */
  pageSize: number
}

const Pages = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}: PagesProps) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  })

  if (currentPage === 0 || paginationRange.length < 2) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  let lastPage = paginationRange[paginationRange.length - 1]

  return (
    <Layout
      distribution="center"
      alignment="middle"
      gutter="large"
      type="stack"
      className={classnames('pages-container')}
    >
      <Icon
        name={ChevronLeftSolid}
        className={classnames('pages-item-icon', {
          pagesItemIconDisabled: currentPage === 1,
        })}
        onClick={onPrevious}
      />
      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS.LEFT || pageNumber === DOTS.RIGHT) {
          return (
            <SkipPages
              currentPage={currentPage}
              type={pageNumber}
              onPageChange={onPageChange}
            />
          )
        }

        return (
          <Button
            className={classnames('pages-item')}
            size="small"
            type={pageNumber === currentPage ? 'secondary' : 'text'}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        )
      })}
      <Icon
        name={ChevronRightSolid}
        className={classnames('pages-item-icon', {
          pagesItemIconDisabled: currentPage === lastPage,
        })}
        onClick={onNext}
      />
    </Layout>
  )
}

export default Pages
