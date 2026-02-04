'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import {
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Filter,
  Calendar,
  User,
  MessageSquare,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface SearchResult {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  matchPositions: Array<{ start: number; end: number }>
  conversationId?: string
  conversationName?: string
}

export interface SearchFilters {
  author?: string
  dateFrom?: Date
  dateTo?: Date
  conversationId?: string
  hasAttachments?: boolean
}

// ============================================================================
// SEARCH BAR
// ============================================================================

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  showFilters?: boolean
  filters?: SearchFilters
  onFiltersChange?: (filters: SearchFilters) => void
  isLoading?: boolean
  resultCount?: number
  currentResult?: number
  onNextResult?: () => void
  onPrevResult?: () => void
  onClear?: () => void
  className?: string
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search messages...',
  showFilters = false,
  filters,
  onFiltersChange,
  isLoading = false,
  resultCount,
  currentResult,
  onNextResult,
  onPrevResult,
  onClear,
  className,
}: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(value)
    } else if (e.key === 'Escape') {
      onClear?.()
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-9 pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
          {resultCount !== undefined && resultCount > 0 && (
            <>
              <span className="text-xs text-muted-foreground">
                {currentResult !== undefined ? `${currentResult + 1}/` : ''}
                {resultCount}
              </span>
              {onPrevResult && onNextResult && (
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onPrevResult}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onNextResult}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </>
          )}
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      {showFilters && onFiltersChange && (
        <SearchFiltersPopover filters={filters} onChange={onFiltersChange} />
      )}
    </div>
  )
}

// ============================================================================
// SEARCH FILTERS POPOVER
// ============================================================================

interface SearchFiltersPopoverProps {
  filters?: SearchFilters
  onChange: (filters: SearchFilters) => void
}

function SearchFiltersPopover({
  filters,
  onChange,
}: SearchFiltersPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const hasFilters = filters && Object.values(filters).some(Boolean)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasFilters ? 'secondary' : 'outline'}
          size="icon"
          className="h-9 w-9"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h4 className="font-medium">Search Filters</h4>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              From user
            </label>
            <Input
              value={filters?.author || ''}
              onChange={(e) =>
                onChange({ ...filters, author: e.target.value || undefined })
              }
              placeholder="Username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date range
            </label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters?.dateFrom?.toISOString().split('T')[0] || ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    dateFrom: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
              <Input
                type="date"
                value={filters?.dateTo?.toISOString().split('T')[0] || ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    dateTo: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" size="sm" onClick={() => onChange({})}>
              Clear filters
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ============================================================================
// SEARCH RESULTS LIST
// ============================================================================

interface SearchResultsListProps {
  results: SearchResult[]
  query: string
  onResultClick: (result: SearchResult) => void
  activeResultId?: string
  isLoading?: boolean
  className?: string
}

export function SearchResultsList({
  results,
  query,
  onResultClick,
  activeResultId,
  isLoading = false,
  className,
}: SearchResultsListProps) {
  if (isLoading) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">Searching...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <Search className="h-8 w-8 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">No results found</p>
      </div>
    )
  }

  return (
    <div className={cn('divide-y divide-border', className)}>
      {results.map((result) => (
        <SearchResultItem
          key={result.id}
          result={result}
          query={query}
          onClick={() => onResultClick(result)}
          isActive={result.id === activeResultId}
        />
      ))}
    </div>
  )
}

// ============================================================================
// SEARCH RESULT ITEM
// ============================================================================

interface SearchResultItemProps {
  result: SearchResult
  query: string
  onClick: () => void
  isActive?: boolean
  className?: string
}

export function SearchResultItem({
  result,
  query,
  onClick,
  isActive = false,
  className,
}: SearchResultItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 hover:bg-muted/50 transition-colors',
        isActive && 'bg-primary/10',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          {result.author.avatar ? (
            <img
              src={result.author.avatar || '/placeholder.svg'}
              alt={result.author.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium">
              {result.author.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-medium text-sm">{result.author.name}</span>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {result.timestamp.toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm mt-1">
            <HighlightedText text={result.content} query={query} />
          </p>
          {result.conversationName && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {result.conversationName}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}

// ============================================================================
// HIGHLIGHTED TEXT
// ============================================================================

interface HighlightedTextProps {
  text: string
  query: string
  highlightClassName?: string
  className?: string
}

export function HighlightedText({
  text,
  query,
  highlightClassName = 'bg-yellow-200 dark:bg-yellow-900/50 text-foreground rounded px-0.5',
  className,
}: HighlightedTextProps) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'))

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  )
}

// ============================================================================
// INLINE SEARCH HIGHLIGHT
// ============================================================================

interface InlineSearchHighlightProps {
  text: string
  positions: Array<{ start: number; end: number }>
  highlightClassName?: string
  className?: string
}

export function InlineSearchHighlight({
  text,
  positions,
  highlightClassName = 'bg-yellow-200 dark:bg-yellow-900/50',
  className,
}: InlineSearchHighlightProps) {
  if (positions.length === 0) {
    return <span className={className}>{text}</span>
  }

  const sortedPositions = [...positions].sort((a, b) => a.start - b.start)
  const parts: React.ReactNode[] = []
  let lastEnd = 0

  sortedPositions.forEach((pos, index) => {
    if (pos.start > lastEnd) {
      parts.push(
        <span key={`text-${index}`}>{text.slice(lastEnd, pos.start)}</span>
      )
    }
    parts.push(
      <mark key={`highlight-${index}`} className={highlightClassName}>
        {text.slice(pos.start, pos.end)}
      </mark>
    )
    lastEnd = pos.end
  })

  if (lastEnd < text.length) {
    parts.push(<span key="text-end">{text.slice(lastEnd)}</span>)
  }

  return <span className={className}>{parts}</span>
}

// ============================================================================
// SEARCH NAVIGATION
// ============================================================================

interface SearchNavigationProps {
  currentIndex: number
  totalResults: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
  className?: string
}

export function SearchNavigation({
  currentIndex,
  totalResults,
  onNext,
  onPrev,
  onClose,
  className,
}: SearchNavigationProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 bg-muted rounded-lg',
        className
      )}
    >
      <span className="text-sm text-muted-foreground">
        {currentIndex + 1} of {totalResults}
      </span>
      <div className="flex">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onPrev}
          disabled={currentIndex === 0}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onNext}
          disabled={currentIndex === totalResults - 1}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

// ============================================================================
// HELPERS
// ============================================================================

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ============================================================================
// HOOKS
// ============================================================================

export function useMessageSearch<T extends { id: string; content: string }>(
  messages: T[]
) {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<T[]>([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isSearching, setIsSearching] = React.useState(false)

  const search = React.useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setCurrentIndex(0)
        return
      }

      setIsSearching(true)
      const queryLower = searchQuery.toLowerCase()
      const found = messages.filter((m) =>
        m.content.toLowerCase().includes(queryLower)
      )
      setResults(found)
      setCurrentIndex(0)
      setIsSearching(false)
    },
    [messages]
  )

  const nextResult = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % results.length)
  }, [results.length])

  const prevResult = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + results.length) % results.length)
  }, [results.length])

  const clearSearch = React.useCallback(() => {
    setQuery('')
    setResults([])
    setCurrentIndex(0)
  }, [])

  return {
    query,
    setQuery,
    results,
    currentIndex,
    currentResult: results[currentIndex],
    isSearching,
    search,
    nextResult,
    prevResult,
    clearSearch,
  }
}
