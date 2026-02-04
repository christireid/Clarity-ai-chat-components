'use client'

/**
 * DataTable Component
 *
 * A data table component for displaying tabular data with sorting,
 * filtering, and pagination support.
 *
 * Features:
 * - Column sorting
 * - Search/filtering
 * - Pagination
 * - Row selection
 * - Responsive design
 * - Loading states
 * - Empty states
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'email', label: 'Email' },
 *     { key: 'status', label: 'Status' },
 *   ]}
 *   data={users}
 *   pageSize={10}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type SortDirection = 'asc' | 'desc'
export type DataTableSize = 'sm' | 'md' | 'lg'

export interface DataTableColumn<T = Record<string, unknown>> {
  /** Column key (maps to data field) */
  key: string
  /** Column header label */
  label: string
  /** Whether column is sortable */
  sortable?: boolean
  /** Column width */
  width?: number | string
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
  /** Custom cell renderer */
  render?: (value: unknown, row: T, index: number) => React.ReactNode
  /** Whether column is hidden */
  hidden?: boolean
}

export interface DataTableProps<T = Record<string, unknown>> {
  /** Column definitions */
  columns: DataTableColumn<T>[]
  /** Data array */
  data: T[]
  /** Size preset */
  size?: DataTableSize
  /** Enable row selection */
  selectable?: boolean
  /** Selected row keys */
  selectedKeys?: string[]
  /** Row key field */
  rowKey?: string
  /** Enable search */
  searchable?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Enable pagination */
  paginated?: boolean
  /** Page size */
  pageSize?: number
  /** Current page (controlled) */
  currentPage?: number
  /** Total items (for server-side pagination) */
  totalItems?: number
  /** Loading state */
  isLoading?: boolean
  /** Empty state message */
  emptyMessage?: string
  /** Default sort column */
  defaultSortKey?: string
  /** Default sort direction */
  defaultSortDirection?: SortDirection
  /** Sort change handler */
  onSort?: (key: string, direction: SortDirection) => void
  /** Selection change handler */
  onSelectionChange?: (keys: string[]) => void
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void
  /** Page change handler */
  onPageChange?: (page: number) => void
  /** Search change handler */
  onSearch?: (query: string) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

function getValue<T>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

function sortData<T>(
  data: T[],
  sortKey: string | null,
  sortDirection: SortDirection
): T[] {
  if (!sortKey) return data

  return [...data].sort((a, b) => {
    const aVal = getValue(a, sortKey)
    const bVal = getValue(b, sortKey)

    if (aVal === bVal) return 0

    const comparison = aVal < bVal ? -1 : 1
    return sortDirection === 'asc' ? comparison : -comparison
  })
}

function filterData<T>(data: T[], query: string, columns: DataTableColumn<T>[]): T[] {
  if (!query) return data

  const lowerQuery = query.toLowerCase()
  const searchableKeys = columns.filter((c) => !c.hidden).map((c) => c.key)

  return data.filter((row) =>
    searchableKeys.some((key) => {
      const value = getValue(row, key)
      return String(value).toLowerCase().includes(lowerQuery)
    })
  )
}

// ============================================================================
// DataTable Component
// ============================================================================

export function DataTable<T = Record<string, unknown>>({
  columns,
  data,
  size = 'md',
  selectable = false,
  selectedKeys = [],
  rowKey = 'id',
  searchable = false,
  searchPlaceholder = 'Search...',
  paginated = false,
  pageSize = 10,
  currentPage: controlledPage,
  totalItems,
  isLoading = false,
  emptyMessage = 'No data available',
  defaultSortKey,
  defaultSortDirection = 'asc',
  onSort,
  onSelectionChange,
  onRowClick,
  onPageChange,
  onSearch,
  className,
}: DataTableProps<T>) {
  const prefersReducedMotion = useReducedMotion()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sortKey, setSortKey] = React.useState<string | null>(defaultSortKey || null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(defaultSortDirection)
  const [internalPage, setInternalPage] = React.useState(1)
  const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<Set<string>>(
    new Set(selectedKeys)
  )

  const currentPage = controlledPage ?? internalPage
  const selected = new Set(selectedKeys.length > 0 ? selectedKeys : internalSelectedKeys)

  // Process data
  const processedData = React.useMemo(() => {
    let result = [...data]

    // Filter
    if (searchQuery) {
      result = filterData(result, searchQuery, columns)
    }

    // Sort
    if (sortKey) {
      result = sortData(result, sortKey, sortDirection)
    }

    return result
  }, [data, searchQuery, sortKey, sortDirection, columns])

  // Paginate
  const totalPages = Math.ceil(
    (totalItems ?? processedData.length) / pageSize
  )
  const paginatedData = paginated
    ? processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : processedData

  const visibleColumns = columns.filter((c) => !c.hidden)

  // Handlers
  const handleSort = (key: string) => {
    const newDirection: SortDirection =
      sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortDirection(newDirection)
    onSort?.(key, newDirection)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
    if (!controlledPage) {
      setInternalPage(1)
    }
  }

  const handlePageChange = (page: number) => {
    if (!controlledPage) {
      setInternalPage(page)
    }
    onPageChange?.(page)
  }

  const handleRowSelect = (key: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }
    setInternalSelectedKeys(newSelected)
    onSelectionChange?.(Array.from(newSelected))
  }

  const handleSelectAll = () => {
    const allKeys = paginatedData.map((row) => String(getValue(row, rowKey)))
    const allSelected = allKeys.every((key) => selected.has(key))

    const newSelected = new Set(selected)
    if (allSelected) {
      allKeys.forEach((key) => newSelected.delete(key))
    } else {
      allKeys.forEach((key) => newSelected.add(key))
    }
    setInternalSelectedKeys(newSelected)
    onSelectionChange?.(Array.from(newSelected))
  }

  const allCurrentSelected = paginatedData.length > 0 &&
    paginatedData.every((row) => selected.has(String(getValue(row, rowKey))))

  return (
    <motion.div
      className={cn('data-table-container', `data-table-${size}`, className)}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION_SECONDS.normal }}
    >
      {/* Search */}
      {searchable && (
        <div className="data-table-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="data-table-search-input"
          />
        </div>
      )}

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table" role="grid">
          <thead className="data-table-header">
            <tr>
              {selectable && (
                <th className="data-table-cell data-table-cell-select">
                  <input
                    type="checkbox"
                    checked={allCurrentSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </th>
              )}
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'data-table-cell',
                    'data-table-header-cell',
                    column.sortable && 'data-table-cell-sortable',
                    column.align && `data-table-cell-${column.align}`
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                  role={column.sortable ? 'columnheader button' : 'columnheader'}
                  aria-sort={
                    sortKey === column.key
                      ? sortDirection === 'asc' ? 'ascending' : 'descending'
                      : undefined
                  }
                >
                  <span>{column.label}</span>
                  {column.sortable && (
                    <span className="data-table-sort-icon">
                      {sortKey === column.key ? (
                        sortDirection === 'asc' ? '↑' : '↓'
                      ) : (
                        '↕'
                      )}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="data-table-body">
            {/* Loading */}
            {isLoading && (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                  className="data-table-loading"
                >
                  <div className="data-table-spinner" />
                  Loading...
                </td>
              </tr>
            )}

            {/* Empty */}
            {!isLoading && paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                  className="data-table-empty"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading && (
              <AnimatePresence mode="popLayout">
                {paginatedData.map((row, index) => {
                  const key = String(getValue(row, rowKey))
                  const isSelected = selected.has(key)

                  return (
                    <motion.tr
                      key={key}
                      className={cn(
                        'data-table-row',
                        isSelected && 'data-table-row-selected',
                        onRowClick && 'data-table-row-clickable'
                      )}
                      initial={prefersReducedMotion ? {} : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={prefersReducedMotion ? {} : { opacity: 0 }}
                      transition={{ duration: DURATION_SECONDS.fast }}
                      onClick={() => onRowClick?.(row, index)}
                      role="row"
                      aria-selected={isSelected}
                    >
                      {selectable && (
                        <td className="data-table-cell data-table-cell-select">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleRowSelect(key)
                            }}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Select row ${key}`}
                          />
                        </td>
                      )}
                      {visibleColumns.map((column) => {
                        const value = getValue(row, column.key)
                        return (
                          <td
                            key={column.key}
                            className={cn(
                              'data-table-cell',
                              column.align && `data-table-cell-${column.align}`
                            )}
                          >
                            {column.render
                              ? column.render(value, row, index)
                              : String(value ?? '')}
                          </td>
                        )
                      })}
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="data-table-pagination">
          <span className="data-table-pagination-info">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, totalItems ?? processedData.length)} of{' '}
            {totalItems ?? processedData.length}
          </span>

          <div className="data-table-pagination-controls">
            <button
              type="button"
              className="data-table-pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  type="button"
                  className={cn(
                    'data-table-pagination-btn',
                    currentPage === pageNum && 'data-table-pagination-btn-active'
                  )}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              type="button"
              className="data-table-pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default DataTable
