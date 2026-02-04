'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Check,
  X,
  ArrowUpDown,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Checkbox } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'

// Types
export interface Column<T> {
  id: string
  header: string | React.ReactNode
  accessorKey?: keyof T
  accessorFn?: (row: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  cell?: (row: T) => React.ReactNode
}

export type SortDirection = 'asc' | 'desc' | null

export interface SortConfig {
  column: string
  direction: SortDirection
}

// Sorting icon
function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === 'asc') return <ChevronUp className="h-4 w-4" />
  if (direction === 'desc') return <ChevronDown className="h-4 w-4" />
  return <ChevronsUpDown className="h-4 w-4 opacity-50" />
}

// Data table component
interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  selectable?: boolean
  pagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  onRowClick?: (row: T) => void
  onSelectionChange?: (selected: T[]) => void
  onExport?: () => void
  loading?: boolean
  emptyMessage?: string
  className?: string
  rowKey?: keyof T | ((row: T) => string)
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Search...',
  selectable = false,
  pagination = true,
  pageSize: defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onRowClick,
  onSelectionChange,
  onExport,
  loading = false,
  emptyMessage = 'No data available',
  className,
  rowKey = 'id',
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState('')
  const [sort, setSort] = React.useState<SortConfig | null>(null)
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(defaultPageSize)
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(columns.map((c) => c.id))
  )

  // Get row key
  const getRowKey = React.useCallback(
    (row: T): string => {
      if (typeof rowKey === 'function') return rowKey(row)
      return String(row[rowKey])
    },
    [rowKey]
  )

  // Filter data
  const filteredData = React.useMemo(() => {
    if (!search) return data
    const searchLower = search.toLowerCase()
    return data.filter((row) =>
      columns.some((col) => {
        const value = col.accessorKey
          ? row[col.accessorKey]
          : col.accessorFn?.(row)
        return String(value).toLowerCase().includes(searchLower)
      })
    )
  }, [data, search, columns])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sort?.direction) return filteredData
    const column = columns.find((c) => c.id === sort.column)
    if (!column) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = column.accessorKey
        ? a[column.accessorKey]
        : column.accessorFn?.(a)
      const bValue = column.accessorKey
        ? b[column.accessorKey]
        : column.accessorFn?.(b)

      if (aValue === bValue) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1

      const comparison = aValue < bValue ? -1 : 1
      return sort.direction === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sort, columns])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize, pagination])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  // Handle sort
  const handleSort = (columnId: string) => {
    setSort((prev) => {
      if (prev?.column !== columnId)
        return { column: columnId, direction: 'asc' }
      if (prev.direction === 'asc')
        return { column: columnId, direction: 'desc' }
      return null
    })
  }

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = paginatedData.map(getRowKey)
      setSelectedRows(new Set(allKeys))
      onSelectionChange?.(paginatedData)
    } else {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    }
  }

  const handleSelectRow = (row: T, checked: boolean) => {
    const key = getRowKey(row)
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (checked) next.add(key)
      else next.delete(key)

      const selected = data.filter((r) => next.has(getRowKey(r)))
      onSelectionChange?.(selected)
      return next
    })
  }

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRows.has(getRowKey(row)))
  const isSomeSelected = paginatedData.some((row) =>
    selectedRows.has(getRowKey(row))
  )

  // Visible columns
  const activeColumns = columns.filter((c) => visibleColumns.has(c.id))

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchable && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={visibleColumns.has(column.id)}
                  onCheckedChange={(checked) => {
                    setVisibleColumns((prev) => {
                      const next = new Set(prev)
                      if (checked) next.add(column.id)
                      else next.delete(column.id)
                      return next
                    })
                  }}
                >
                  {typeof column.header === 'string'
                    ? column.header
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Selection info */}
      {selectable && selectedRows.size > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md text-sm">
          <span className="font-medium">{selectedRows.size} selected</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => {
              setSelectedRows(new Set())
              onSelectionChange?.([])
            }}
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {selectable && (
                  <th className="w-12 px-4 py-3">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      className={cn(
                        isSomeSelected && !isAllSelected && 'opacity-50'
                      )}
                    />
                  </th>
                )}
                {activeColumns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      'px-4 py-3 text-left font-medium text-muted-foreground',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable &&
                        'cursor-pointer hover:text-foreground transition-colors'
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-1',
                        column.align === 'center' && 'justify-center',
                        column.align === 'right' && 'justify-end'
                      )}
                    >
                      {column.header}
                      {column.sortable && (
                        <SortIcon
                          direction={
                            sort?.column === column.id ? sort.direction : null
                          }
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {selectable && (
                      <td className="px-4 py-3">
                        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                      </td>
                    )}
                    {activeColumns.map((col) => (
                      <td key={col.id} className="px-4 py-3">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeColumns.length + (selectable ? 1 : 0)}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const key = getRowKey(row)
                  const isSelected = selectedRows.has(key)

                  return (
                    <tr
                      key={key}
                      className={cn(
                        'transition-colors',
                        onRowClick && 'cursor-pointer hover:bg-muted/50',
                        isSelected && 'bg-muted/30'
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {selectable && (
                        <td
                          className="px-4 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelectRow(row, !!checked)
                            }
                            aria-label="Select row"
                          />
                        </td>
                      )}
                      {activeColumns.map((column) => {
                        const value = column.cell
                          ? column.cell(row)
                          : column.accessorKey
                            ? row[column.accessorKey]
                            : column.accessorFn?.(row)

                        return (
                          <td
                            key={column.id}
                            className={cn(
                              'px-4 py-3',
                              column.align === 'center' && 'text-center',
                              column.align === 'right' && 'text-right'
                            )}
                          >
                            {value}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && sortedData.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Show</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>
              of {sortedData.length} result{sortedData.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="px-3 text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
