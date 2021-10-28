export interface Cell {
  offset: number
  size: number
}

export interface PositionManagerOptions {
  count: number
  estimatedSize: number
  maxScrollSize?: number
  sizeGetter(index: number): number
}

export interface PositionManager {
  usesScaledOffsets: boolean
  configure(options: Partial<PositionManagerOptions>): void

  size: number
  count: number

  lastMeasuredCell: Cell
  getCellAt(index: number): Cell
  reset(): void
  resetCellAt(index: number): void
  findVisibleRange(
    offset: number,
    viewport: number
  ): { start: number; end: number }
  computeScaleAdjustmentOffset(offset: number, viewport: number): number
}
export function createPositionManager({
  count,
  estimatedSize,
  sizeGetter,
}: PositionManagerOptions): PositionManager {
  let cells: Record<number, Cell> = {}
  let lastMeasuredCellIndex = -1
  let lastDeferredCellIndex = -1

  const manager: PositionManager = {
    get usesScaledOffsets() {
      return false
    },
    get lastMeasuredCell() {
      return lastMeasuredCellIndex >= 0
        ? cells[lastMeasuredCellIndex]
        : { offset: 0, size: 0 }
    },
    get size() {
      const cell = manager.lastMeasuredCell
      const measuredTotalSize = cell.offset + cell.size
      const estimatedTotalSize =
        estimatedSize * (count - lastMeasuredCellIndex - 1)

      return measuredTotalSize + estimatedTotalSize
    },
    get count() {
      return count
    },
    reset() {
      lastDeferredCellIndex = lastMeasuredCellIndex = -1
      cells = {}
    },
    configure(options) {
      if (options.count) count = options.count
      if (options.estimatedSize) estimatedSize = options.estimatedSize
      if (options.sizeGetter) sizeGetter = options.sizeGetter
    },
    getCellAt(index) {
      if (index < 0 || index >= count)
        throw new Error(`${index} is out of range 0..${count - 1}`)

      if (index > lastMeasuredCellIndex) {
        if (index < lastDeferredCellIndex) {
        } else {
          const last = manager.lastMeasuredCell
          let offset = last.offset + last.size

          for (let i = lastMeasuredCellIndex + 1; i <= index; ++i) {
            const size = sizeGetter(i)
            if (typeof size === 'number') {
              cells[i] = {
                offset,
                size,
              }

              offset += size
              lastMeasuredCellIndex = i
            } else if (size === null) {
              cells[i] = {
                offset,
                size: estimatedSize,
              }

              offset += estimatedSize
              lastDeferredCellIndex = i
            } else {
              throw new Error(`Unexpected size ${size} at index ${i}`)
            }
          }
        }
      }

      return cells[index]
    },
    resetCellAt(index) {
      if (typeof index !== 'number')
        throw new Error(`${index} is out of range 0..${count - 1}`)

      lastMeasuredCellIndex = lastDeferredCellIndex = Math.min(
        index - 1,
        lastMeasuredCellIndex
      )
    },
    findVisibleRange(offset, viewport) {
      offset = Math.max(0, offset)

      const start = findNearestCellIndex(offset)
      const cell = manager.getCellAt(start)
      const offsetLimit = offset + viewport
      offset = cell.offset + cell.size
      let end = start

      while (end < count - 1 && offset < offsetLimit) {
        ++end

        offset += manager.getCellAt(end).size
      }

      return { start, end }
    },
    computeScaleAdjustmentOffset() {
      return 0
    },
  }

  function findNearestCellIndex(offset: number) {
    if (offset <= 0) return 0

    return binarySearch(0, count - 1, offset)
  }

  function binarySearch(low: number, high: number, offset: number) {
    while (low <= high) {
      const mid = low + ~~((high - low) / 2)
      const cell = manager.getCellAt(mid)

      if (offset === cell.offset) {
        return mid
      } else if (offset < cell.offset) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }

    return low > 0 ? low - 1 : 0
  }

  return manager
}

export function createScaledPositionManager({
  maxScrollSize = getMaxElementSize(),
  ...options
}: PositionManagerOptions): PositionManager {
  const manager = createPositionManager(options)
  const scaledManager: PositionManager = {
    configure(newOptions) {
      if (newOptions.maxScrollSize) maxScrollSize = newOptions.maxScrollSize

      manager.configure(newOptions)
    },
    get lastMeasuredCell() {
      return manager.lastMeasuredCell
    },
    get usesScaledOffsets() {
      return manager.size > maxScrollSize
    },
    get size() {
      return Math.min(maxScrollSize, manager.size)
    },
    get count() {
      return manager.count
    },
    reset() {
      manager.reset()
    },
    getCellAt(index) {
      return manager.getCellAt(index)
    },
    resetCellAt(index) {
      return manager.resetCellAt(index)
    },
    computeScaleAdjustmentOffset(offset, viewport) {
      const size = manager.size
      const safeSize = scaledManager.size

      return ~~(
        offsetInPercentage(offset, viewport, safeSize) *
        (safeSize - size)
      )
    },
    findVisibleRange(offset, viewport) {
      offset = safeOffsetToOffset(offset, viewport)
      offsetToSafeOffset(offset, viewport)

      return manager.findVisibleRange(offset, viewport)
    },
  }

  function offsetInPercentage(offset: number, viewport: number, size: number) {
    return size <= viewport ? 0 : offset / (size - viewport)
  }

  function safeOffsetToOffset(offset: number, viewport: number) {
    const size = manager.size
    const safeSize = scaledManager.size

    if (size === safeSize) {
      return offset
    }

    const offsetPercentage = offsetInPercentage(offset, viewport, safeSize)

    return Math.round(offsetPercentage * (size - viewport))
  }

  function offsetToSafeOffset(offset: number, viewport: number) {
    const size = manager.size
    const safeSize = scaledManager.size

    if (size === safeSize) {
      return offset
    }

    const offsetPercentage = offsetInPercentage(offset, viewport, size)

    return Math.round(offsetPercentage * (safeSize - viewport))
  }

  return scaledManager
}

const DEFAULT_MAX_ELEMENT_SIZE = 1500000
const CHROME_MAX_ELEMENT_SIZE = 1.67771e7

const isBrowser = () => typeof window !== 'undefined'

const isChrome = () =>
  !!(window as any).chrome && !!(window as any).chrome.webstore

export function getMaxElementSize() {
  if (isBrowser()) {
    if (isChrome()) {
      return CHROME_MAX_ELEMENT_SIZE
    }
  }

  return DEFAULT_MAX_ELEMENT_SIZE
}

export interface MeasureCache {
  reset(): void
  has(row: number, column?: number): boolean
  get(row: number, column?: number): { height: number; width: number }
  set(
    row: number,
    column: number | null,
    value: { height: number; width: number },
    options?: { ignoreRowHeight: boolean; ignoreColumnWidth: boolean }
  ): void
  remove(row: number, column?: number): void

  configure(height: number, width: number): void

  hasMax(row: number, column?: number): boolean
  rowHeight(row: number): number
  columnWidth(column: number): number
}

export function createMeasureCache(
  estimatedHeight = 30,
  estimatedWidth = 120,
  key = (row: number, column: number) => `${row}:${column}`
): MeasureCache {
  let store = {}
  let rowHeights = {}
  let columnWidths = {}
  const cache: MeasureCache = {
    reset() {
      store = {}
      rowHeights = {}
      columnWidths = {}
    },
    configure(height, width) {
      estimatedHeight = height
      estimatedWidth = width
    },
    has(row, column = 0) {
      return key(row, column) in store
    },
    hasMax(row, column) {
      if (column === Infinity) {
        return !!rowHeights[row] && rowHeights[row].valid
      }

      if (row === Infinity) {
        return !!columnWidths[column] && columnWidths[column].valid
      }

      return cache.has(row, column)
    },
    get(row, column = 0) {
      return (
        store[key(row, column)] || {
          height: estimatedHeight,
          width: estimatedWidth,
        }
      )
    },
    set(
      row,
      column = 0,
      value,
      { ignoreRowHeight, ignoreColumnWidth } = {
        ignoreRowHeight: false,
        ignoreColumnWidth: false,
      }
    ) {
      store[key(row, column)] = value

      if (ignoreRowHeight !== true) {
        rowHeights[row] = {
          valid: true,
          value: Math.max(value.height, cache.rowHeight(row)),
        }
      }
      if (ignoreColumnWidth !== true) {
        columnWidths[column] = {
          valid: true,
          value: Math.max(value.width, cache.columnWidth(column)),
        }
      }
    },
    rowHeight(row) {
      if (row in rowHeights) {
        return rowHeights[row].value
      }

      return estimatedHeight
    },
    columnWidth(column) {
      if (column in columnWidths) {
        return columnWidths[column].value
      }

      return estimatedWidth
    },
    remove(row, column = 0) {
      delete store[key(row, column)]

      rowHeights[row] = {
        valid: false,
        value: cache.rowHeight(row),
      }

      columnWidths[column] = {
        valid: false,
        value: cache.columnWidth(column),
      }
    },
  }

  return cache
}

export function findOverScanRange(
  { start, end }: { start: number; end: number },
  scrollDirection: number,
  overScanCount: number,
  total: number
) {
  overScanCount = Math.max(1, overScanCount)

  if (scrollDirection >= 0) {
    end = Math.min(total - 1, end + overScanCount)
  } else {
    start = Math.max(0, start - overScanCount)
  }

  return { start, end }
}
