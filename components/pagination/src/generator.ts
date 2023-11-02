const MAX_TRUNCATED_STEP_COUNT = 7
export function generateModel({
  page,
  total,
  sizes,
  adjacentPageCount,
  totalPages,
  startIndexOffset, 
}) {
  const truncatedPageCount = totalPages > 2 ? Math.min(totalPages - 2, MAX_TRUNCATED_STEP_COUNT) : 0
  // const [startIndexOffset, setStartIndexOffset] = useState(() => {
  //   if ((page - adjacentPageCount) <= 2) {
  //     return 0
  //   }
  //   return (page - adjacentPageCount) - 1
  // })
  // const startIndexOffset = (page - adjacentPageCount) <= 2 ? 1 : (page - adjacentPageCount) - 1
  const endIndexOffset = startIndexOffset + truncatedPageCount - 1
  const hasLeadingTruncation = startIndexOffset >= 2
  const hasEndingTruncation = totalPages - 1 - endIndexOffset >= 1

  const disableNextPage = page === totalPages
  const disablePreviousPage = page === 1
  let pages: any = [
    {
      type: 'NUM',
      num: 1,
      selected: page === 1,
      precedesBreak: hasLeadingTruncation,
    }
  ]
  if(totalPages > 2) {
    pages = [
      ...pages,
      ...Array.from({length: truncatedPageCount}).map((_, i) => {
        if(i === 0 &&  hasLeadingTruncation) {
          return {
            type: 'BREAK',
            num: 1,
          }
        }
        const pageNumber = startIndexOffset > 2 ? startIndexOffset + i : startIndexOffset + i + 1
        if(i === truncatedPageCount - 1 && hasEndingTruncation) {
          return {
            type: 'BREAK',
            num: totalPages - 1,
          }
        }
        return {
          type: 'NUM',
          num: pageNumber,
          selected: page === pageNumber,
          precedesBreak: (i === truncatedPageCount - 2) && hasEndingTruncation,
        }
      })
    ]
  } 

  if(totalPages > 1) {
    pages.push({
      type: 'NUM',
      num: totalPages,
      selected: page === totalPages,
      precedesBreak: false,
    })
  }
  const prev = {type: 'PREV', num: page - 1, disabled: disablePreviousPage}
  const next = {type: 'NEXT', num: page + 1, disabled: disableNextPage}

  return [[prev, ...pages, next], hasLeadingTruncation, hasEndingTruncation]
}