/**
 * Clarity Memory - Pagination Utilities
 * 
 * Efficient pagination for large result sets
 */

import type { MemoryItem } from '../core/types'

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

/**
 * Paginate an array
 */
export function paginate<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResult<T> {
  const total = items.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    items: items.slice(start, end),
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  }
}

/**
 * Cursor-based pagination (more efficient for large datasets)
 */
export interface CursorPaginationOptions {
  limit: number
  cursor?: string
  sortBy?: 'timestamp' | 'importance' | 'id'
  order?: 'asc' | 'desc'
}

export interface CursorPaginatedResult<T> {
  items: T[]
  nextCursor?: string
  hasMore: boolean
  limit: number
}

/**
 * Cursor-based pagination
 */
export function cursorPaginate<T extends { id: string; timestamp: Date; importance: number }>(
  items: T[],
  options: CursorPaginationOptions
): CursorPaginatedResult<T> {
  const { limit, cursor, sortBy = 'timestamp', order = 'desc' } = options
  
  // Sort items
  let sorted = [...items]
  sorted.sort((a, b) => {
    let aVal: any
    let bVal: any
    
    switch (sortBy) {
      case 'timestamp':
        aVal = a.timestamp.getTime()
        bVal = b.timestamp.getTime()
        break
      case 'importance':
        aVal = a.importance
        bVal = b.importance
        break
      case 'id':
        aVal = a.id
        bVal = b.id
        break
      default:
        return 0
    }
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
  
  // Find cursor position
  let startIndex = 0
  if (cursor) {
    const cursorIndex = sorted.findIndex(item => item.id === cursor)
    if (cursorIndex >= 0) {
      startIndex = cursorIndex + 1
    }
  }
  
  // Get items
  const resultItems = sorted.slice(startIndex, startIndex + limit)
  const hasMore = startIndex + limit < sorted.length
  const lastItem = resultItems[resultItems.length - 1]
  const nextCursor = hasMore && lastItem
    ? lastItem.id 
    : undefined
  
  return {
    items: resultItems,
    nextCursor,
    hasMore,
    limit,
  }
}

/**
 * Stream results (async generator)
 */
export async function* streamResults<T>(
  items: T[],
  pageSize: number = 10
): AsyncGenerator<T[], void, unknown> {
  for (let i = 0; i < items.length; i += pageSize) {
    yield items.slice(i, i + pageSize)
  }
}
