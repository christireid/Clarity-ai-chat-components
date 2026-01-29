'use client'

/**
 * VirtualScroller Component
 *
 * A virtualized list component for efficiently rendering large datasets.
 * Only renders items currently visible in the viewport plus a buffer.
 *
 * Features:
 * - Efficient rendering of large lists (10k+ items)
 * - Dynamic item heights support
 * - Horizontal and vertical scrolling
 * - Custom item rendering
 * - Loading states (lazy loading)
 * - Scroll to item functionality
 * - Keyboard navigation
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <VirtualScroller
 *   items={messages}
 *   itemHeight={60}
 *   renderItem={(item, index) => (
 *     <MessageItem message={item} />
 *   )}
 *   height={500}
 * />
 * ```
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type VirtualScrollerOrientation = 'vertical' | 'horizontal'

export interface VirtualScrollerProps<T> {
  /** Array of items to render */
  items: T[]
  /** Item height (or width for horizontal) - can be number or function */
  itemHeight: number | ((item: T, index: number) => number)
  /** Render function for each item */
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode
  /** Container height (for vertical) or width (for horizontal) */
  height?: number | string
  /** Container width */
  width?: number | string
  /** Scroll orientation */
  orientation?: VirtualScrollerOrientation
  /** Number of items to render outside visible area (buffer) */
  overscan?: number
  /** Whether to show loading indicator at bottom */
  isLoading?: boolean
  /** Load more callback (infinite scroll) */
  onLoadMore?: () => void
  /** Threshold for triggering load more (pixels from bottom) */
  loadMoreThreshold?: number
  /** Key extractor function */
  getItemKey?: (item: T, index: number) => string | number
  /** Scroll to this index on mount */
  initialScrollIndex?: number
  /** Gap between items */
  gap?: number
  /** Empty state content */
  emptyContent?: React.ReactNode
  /** Additional class names */
  className?: string
  /** Inner container class */
  innerClassName?: string
  /** Item wrapper class */
  itemClassName?: string
  /** On scroll callback */
  onScroll?: (scrollTop: number, scrollLeft: number) => void
  /** On visible range change callback */
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void
}

export interface VirtualScrollerRef {
  /** Scroll to a specific item */
  scrollToItem: (index: number, align?: 'start' | 'center' | 'end') => void
  /** Scroll to top */
  scrollToTop: () => void
  /** Scroll to bottom */
  scrollToBottom: () => void
  /** Get current scroll position */
  getScrollPosition: () => { scrollTop: number; scrollLeft: number }
  /** Get visible range */
  getVisibleRange: () => { startIndex: number; endIndex: number }
}

// ============================================================================
// Helper Functions
// ============================================================================

function getItemSize<T>(
  itemHeight: number | ((item: T, index: number) => number),
  item: T,
  index: number
): number {
  return typeof itemHeight === 'function' ? itemHeight(item, index) : itemHeight
}

// ============================================================================
// VirtualScroller Component
// ============================================================================

function VirtualScrollerInner<T>(
  {
    items,
    itemHeight,
    renderItem,
    height = 400,
    width = '100%',
    orientation = 'vertical',
    overscan = 3,
    isLoading = false,
    onLoadMore,
    loadMoreThreshold = 100,
    getItemKey,
    initialScrollIndex,
    gap = 0,
    emptyContent,
    className,
    innerClassName,
    itemClassName,
    onScroll,
    onVisibleRangeChange,
  }: VirtualScrollerProps<T>,
  ref: React.Ref<VirtualScrollerRef>
) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = React.useState(0)

  const isVertical = orientation === 'vertical'

  // Calculate item offsets and total size
  const { itemOffsets, totalSize } = React.useMemo(() => {
    const offsets: number[] = []
    let total = 0

    for (let i = 0; i < items.length; i++) {
      offsets.push(total)
      total += getItemSize(itemHeight, items[i], i) + (i < items.length - 1 ? gap : 0)
    }

    return { itemOffsets: offsets, totalSize: total }
  }, [items, itemHeight, gap])

  // Get visible range based on scroll position
  const getVisibleRange = React.useCallback(() => {
    const containerSize = typeof height === 'number' ? height : 400

    // Binary search for start index
    let startIndex = 0
    let endIndex = items.length - 1

    // Find start index
    let low = 0
    let high = items.length - 1
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      if (itemOffsets[mid] < scrollPosition) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
    startIndex = Math.max(0, high)

    // Find end index
    const endPosition = scrollPosition + containerSize
    low = startIndex
    high = items.length - 1
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      if (itemOffsets[mid] <= endPosition) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
    endIndex = Math.min(items.length - 1, low)

    // Apply overscan
    startIndex = Math.max(0, startIndex - overscan)
    endIndex = Math.min(items.length - 1, endIndex + overscan)

    return { startIndex, endIndex }
  }, [scrollPosition, height, items.length, itemOffsets, overscan])

  const visibleRange = getVisibleRange()

  // Items to render
  const visibleItems = React.useMemo(() => {
    const result: Array<{ item: T; index: number; offset: number; size: number }> = []

    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      if (i < items.length) {
        result.push({
          item: items[i],
          index: i,
          offset: itemOffsets[i],
          size: getItemSize(itemHeight, items[i], i),
        })
      }
    }

    return result
  }, [visibleRange, items, itemOffsets, itemHeight])

  // Handle scroll
  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      const newPosition = isVertical ? target.scrollTop : target.scrollLeft

      setScrollPosition(newPosition)
      onScroll?.(target.scrollTop, target.scrollLeft)

      // Check for load more
      if (onLoadMore && !isLoading) {
        const scrollSize = isVertical ? target.scrollHeight : target.scrollWidth
        const clientSize = isVertical ? target.clientHeight : target.clientWidth
        const scrollEnd = scrollSize - clientSize - newPosition

        if (scrollEnd < loadMoreThreshold) {
          onLoadMore()
        }
      }
    },
    [isVertical, onScroll, onLoadMore, isLoading, loadMoreThreshold]
  )

  // Notify visible range changes
  React.useEffect(() => {
    onVisibleRangeChange?.(visibleRange.startIndex, visibleRange.endIndex)
  }, [visibleRange.startIndex, visibleRange.endIndex, onVisibleRangeChange])

  // Scroll to item
  const scrollToItem = React.useCallback(
    (index: number, align: 'start' | 'center' | 'end' = 'start') => {
      if (!containerRef.current || index < 0 || index >= items.length) return

      const containerSize = isVertical
        ? containerRef.current.clientHeight
        : containerRef.current.clientWidth
      const itemOffset = itemOffsets[index]
      const itemSize = getItemSize(itemHeight, items[index], index)

      let targetPosition: number

      switch (align) {
        case 'center':
          targetPosition = itemOffset - (containerSize - itemSize) / 2
          break
        case 'end':
          targetPosition = itemOffset - containerSize + itemSize
          break
        default:
          targetPosition = itemOffset
      }

      targetPosition = Math.max(0, Math.min(targetPosition, totalSize - containerSize))

      if (isVertical) {
        containerRef.current.scrollTop = targetPosition
      } else {
        containerRef.current.scrollLeft = targetPosition
      }
    },
    [items, itemOffsets, itemHeight, totalSize, isVertical]
  )

  // Initial scroll
  React.useEffect(() => {
    if (initialScrollIndex !== undefined) {
      scrollToItem(initialScrollIndex)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Expose ref methods
  React.useImperativeHandle(
    ref,
    () => ({
      scrollToItem,
      scrollToTop: () => {
        if (containerRef.current) {
          if (isVertical) {
            containerRef.current.scrollTop = 0
          } else {
            containerRef.current.scrollLeft = 0
          }
        }
      },
      scrollToBottom: () => {
        if (containerRef.current) {
          const containerSize = isVertical
            ? containerRef.current.clientHeight
            : containerRef.current.clientWidth
          const targetPosition = totalSize - containerSize

          if (isVertical) {
            containerRef.current.scrollTop = targetPosition
          } else {
            containerRef.current.scrollLeft = targetPosition
          }
        }
      },
      getScrollPosition: () => ({
        scrollTop: containerRef.current?.scrollTop || 0,
        scrollLeft: containerRef.current?.scrollLeft || 0,
      }),
      getVisibleRange: () => visibleRange,
    }),
    [scrollToItem, isVertical, totalSize, visibleRange]
  )

  if (items.length === 0 && !isLoading) {
    return (
      <div className={cn('virtual-scroller-empty', className)}>
        {emptyContent || <span>No items to display</span>}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'virtual-scroller',
        `virtual-scroller-${orientation}`,
        className
      )}
      style={{
        height,
        width,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
      role="list"
      aria-label="Virtual scrolling list"
      tabIndex={0}
    >
      {/* Spacer for scroll height */}
      <div
        className={cn('virtual-scroller-inner', innerClassName)}
        style={{
          [isVertical ? 'height' : 'width']: totalSize,
          [isVertical ? 'width' : 'height']: '100%',
          position: 'relative',
        }}
      >
        {/* Rendered items */}
        {visibleItems.map(({ item, index, offset, size }) => {
          const key = getItemKey ? getItemKey(item, index) : index
          const style: React.CSSProperties = {
            position: 'absolute',
            [isVertical ? 'top' : 'left']: offset,
            [isVertical ? 'height' : 'width']: size,
            [isVertical ? 'width' : 'height']: '100%',
            [isVertical ? 'left' : 'top']: 0,
          }

          return (
            <div
              key={key}
              className={cn('virtual-scroller-item', itemClassName)}
              style={style}
              role="listitem"
            >
              {renderItem(item, index, style)}
            </div>
          )
        })}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          className="virtual-scroller-loading"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION_SECONDS.fast }}
        >
          <motion.div
            className="virtual-scroller-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: durations.slower, repeat: Infinity, ease: 'linear' }}
          />
          <span>Loading more...</span>
        </motion.div>
      )}
    </div>
  )
}

// Forward ref with generic support
export const VirtualScroller = React.forwardRef(VirtualScrollerInner) as <T>(
  props: VirtualScrollerProps<T> & { ref?: React.Ref<VirtualScrollerRef> }
) => React.ReactElement

// ============================================================================
// useVirtualScroller Hook
// ============================================================================

export interface UseVirtualScrollerOptions<T> {
  /** Initial items */
  initialItems?: T[]
  /** Item height */
  itemHeight?: number
  /** Container height */
  containerHeight?: number
  /** Overscan count */
  overscan?: number
}

export interface UseVirtualScrollerReturn<T> {
  /** Current items */
  items: T[]
  /** Set items */
  setItems: React.Dispatch<React.SetStateAction<T[]>>
  /** Add items to the end */
  appendItems: (newItems: T[]) => void
  /** Add items to the beginning */
  prependItems: (newItems: T[]) => void
  /** Remove an item */
  removeItem: (index: number) => void
  /** Update an item */
  updateItem: (index: number, item: T) => void
  /** Clear all items */
  clearItems: () => void
  /** Ref for the scroller */
  scrollerRef: React.RefObject<VirtualScrollerRef>
  /** Scroll to item */
  scrollToItem: (index: number, align?: 'start' | 'center' | 'end') => void
  /** Scroll to top */
  scrollToTop: () => void
  /** Scroll to bottom */
  scrollToBottom: () => void
}

export function useVirtualScroller<T>(
  options: UseVirtualScrollerOptions<T> = {}
): UseVirtualScrollerReturn<T> {
  const { initialItems = [] } = options
  const [items, setItems] = React.useState<T[]>(initialItems)
  const scrollerRef = React.useRef<VirtualScrollerRef>(null)

  const appendItems = React.useCallback((newItems: T[]) => {
    setItems((prev) => [...prev, ...newItems])
  }, [])

  const prependItems = React.useCallback((newItems: T[]) => {
    setItems((prev) => [...newItems, ...prev])
  }, [])

  const removeItem = React.useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateItem = React.useCallback((index: number, item: T) => {
    setItems((prev) => prev.map((it, i) => (i === index ? item : it)))
  }, [])

  const clearItems = React.useCallback(() => {
    setItems([])
  }, [])

  const scrollToItem = React.useCallback(
    (index: number, align?: 'start' | 'center' | 'end') => {
      scrollerRef.current?.scrollToItem(index, align)
    },
    []
  )

  const scrollToTop = React.useCallback(() => {
    scrollerRef.current?.scrollToTop()
  }, [])

  const scrollToBottom = React.useCallback(() => {
    scrollerRef.current?.scrollToBottom()
  }, [])

  return {
    items,
    setItems,
    appendItems,
    prependItems,
    removeItem,
    updateItem,
    clearItems,
    scrollerRef,
    scrollToItem,
    scrollToTop,
    scrollToBottom,
  }
}

// ============================================================================
// FixedSizeList - Simpler API for fixed-height items
// ============================================================================

export interface FixedSizeListProps<T> extends Omit<VirtualScrollerProps<T>, 'itemHeight'> {
  /** Fixed height for all items */
  itemSize: number
}

export function FixedSizeList<T>({ itemSize, ...props }: FixedSizeListProps<T>) {
  return <VirtualScroller {...props} itemHeight={itemSize} />
}

// ============================================================================
// VariableSizeList - Explicit API for variable-height items
// ============================================================================

export interface VariableSizeListProps<T> extends Omit<VirtualScrollerProps<T>, 'itemHeight'> {
  /** Function to get item size */
  getItemSize: (item: T, index: number) => number
}

export function VariableSizeList<T>({ getItemSize, ...props }: VariableSizeListProps<T>) {
  return <VirtualScroller {...props} itemHeight={getItemSize} />
}

export default VirtualScroller
