/**
 * Virtual List Component
 * Efficient rendering of large lists using windowing
 * Only renders visible items plus a small buffer
 */

'use client'

import * as React from 'react'

export interface VirtualListProps<T> {
  /** Array of items to render */
  items: T[]
  /** Height of each item in pixels */
  itemHeight: number
  /** Height of the container in pixels */
  containerHeight: number
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Number of items to render outside visible area */
  overscan?: number
  /** Additional className for the container */
  className?: string
  /** Key extractor function */
  getKey?: (item: T, index: number) => string | number
  /** Called when scroll position changes */
  onScroll?: (scrollTop: number) => void
  /** Empty state content */
  emptyState?: React.ReactNode
}

/**
 * VirtualList Component
 * Renders only visible items for optimal performance with large lists
 */
export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className,
  getKey,
  onScroll,
  emptyState,
}: VirtualListProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = React.useState(0)

  // Calculate visible range
  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2
  const endIndex = Math.min(items.length, startIndex + visibleCount)

  // Get visible items
  const visibleItems = items.slice(startIndex, endIndex)

  // Handle scroll
  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop
      setScrollTop(newScrollTop)
      onScroll?.(newScrollTop)
    },
    [onScroll]
  )

  // Empty state
  if (items.length === 0) {
    return (
      <div
        className={`virtual-list virtual-list-empty ${className || ''}`}
        style={{ height: containerHeight }}
      >
        {emptyState || <div className="virtual-list-no-items">No items</div>}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`virtual-list ${className || ''}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
      role="list"
    >
      {/* Spacer to maintain scroll height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items positioned absolutely */}
        {visibleItems.map((item, localIndex) => {
          const actualIndex = startIndex + localIndex
          const key = getKey ? getKey(item, actualIndex) : actualIndex

          return (
            <div
              key={key}
              role="listitem"
              style={{
                position: 'absolute',
                top: actualIndex * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Auto-sizing Virtual List
 * Automatically measures container height
 */
export interface AutoSizeVirtualListProps<T> extends Omit<
  VirtualListProps<T>,
  'containerHeight'
> {
  /** Minimum height */
  minHeight?: number
  /** Maximum height */
  maxHeight?: number
}

export function AutoSizeVirtualList<T>({
  minHeight = 200,
  maxHeight = 600,
  ...props
}: AutoSizeVirtualListProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = React.useState(maxHeight)

  // Observe container size changes
  React.useEffect(() => {
    const element = containerRef.current?.parentElement
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = Math.min(
          Math.max(entry.contentRect.height, minHeight),
          maxHeight
        )
        setContainerHeight(height)
      }
    })

    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [minHeight, maxHeight])

  return (
    <div ref={containerRef} style={{ height: '100%' }}>
      <VirtualList {...props} containerHeight={containerHeight} />
    </div>
  )
}

/**
 * Scroll to item helper hook
 */
export function useVirtualListScrollTo<T>(
  items: T[],
  itemHeight: number,
  containerRef: React.RefObject<HTMLDivElement>
) {
  const scrollToIndex = React.useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      if (!containerRef.current) return
      const scrollTop = index * itemHeight
      containerRef.current.scrollTo({ top: scrollTop, behavior })
    },
    [itemHeight, containerRef]
  )

  const scrollToItem = React.useCallback(
    (predicate: (item: T) => boolean, behavior: ScrollBehavior = 'smooth') => {
      const index = items.findIndex(predicate)
      if (index !== -1) {
        scrollToIndex(index, behavior)
      }
    },
    [items, scrollToIndex]
  )

  return { scrollToIndex, scrollToItem }
}

export default VirtualList
