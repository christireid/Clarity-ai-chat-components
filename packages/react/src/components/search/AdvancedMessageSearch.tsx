'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Input,
  Button,
  Badge,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
  useReducedMotion,
} from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'
import { SearchIcon } from '../ui/icons'
import {
  X,
  Bookmark,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
} from 'lucide-react'

// Type assertions for icons
const XIcon = X as React.ComponentType<{ className?: string }>
const BookmarkIcon = Bookmark as React.ComponentType<{ className?: string }>
const SlidersIcon = SlidersHorizontal as React.ComponentType<{
  className?: string
}>
const SortIcon = ArrowUpDown as React.ComponentType<{ className?: string }>
const CheckIcon = Check as React.ComponentType<{ className?: string }>

import { useDeferredSearch } from '../../hooks/performance/use-deferred-search'
import {
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import {
  useFilteredMessages,
  useSavedSearches,
  useActiveFilterCount,
} from './hooks'
import {
  ActiveFiltersPills,
  SavedSearchesPanel,
  SearchFiltersPanel,
  SearchResultsSummary,
} from './components'
import type {
  SearchFilters,
  SortOption,
  FilterPreset,
  ExportFormat,
  ExtendedMessage,
} from './types'
import { defaultPresets } from './constants'

// Re-export types for backwards compatibility
export type {
  SearchFilters,
  SavedSearch,
  SortOption,
  FilterPreset,
} from './types'

/**
 * Props for AdvancedMessageSearch component
 */
export interface AdvancedMessageSearchProps {
  /** Messages to search through */
  messages: Message[]
  /** Callback when search results change */
  onResultsChange?: (filteredMessages: Message[]) => void
  /** Callback when a message is selected */
  onMessageSelect?: (message: Message) => void
  /** Enable fuzzy search with typo tolerance */
  enableFuzzySearch?: boolean
  /** Enable advanced filters */
  enableAdvancedFilters?: boolean
  /** Enable saved searches */
  enableSavedSearches?: boolean
  /** Enable export functionality */
  enableExport?: boolean
  /** Enable sorting */
  enableSorting?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Show filter count badge */
  showFilterCount?: boolean
  /** Custom filter presets */
  filterPresets?: FilterPreset[]
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Advanced Message Search Component
 *
 * A comprehensive search solution with:
 * - Full-text search with highlighting
 * - Advanced filtering (date, model, role, tokens, attachments, errors)
 * - Saved searches with persistent storage
 * - Quick filter presets
 * - Export functionality (JSON, CSV, Markdown)
 * - Sorting options
 * - Real-time results with deferred updates
 * - Beautiful animations and transitions
 * - Fully accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <AdvancedMessageSearch
 *   messages={messages}
 *   onResultsChange={(filtered) => setFilteredMessages(filtered)}
 *   enableSavedSearches
 *   enableExport
 *   enableSorting
 * />
 * ```
 */
export const AdvancedMessageSearch = React.memo(function AdvancedMessageSearch({
  messages,
  onResultsChange,
  onMessageSelect: _onMessageSelect,
  enableFuzzySearch: _enableFuzzySearch = false,
  enableAdvancedFilters = true,
  enableSavedSearches = true,
  enableExport = true,
  enableSorting = true,
  placeholder = 'Search messages...',
  showFilterCount = true,
  filterPresets = defaultPresets,
  size = 'md',
  className,
}: AdvancedMessageSearchProps) {
  const prefersReducedMotion = useReducedMotion()
  const [filters, setFilters] = React.useState<SearchFilters>({ query: '' })
  const [showFilters, setShowFilters] = React.useState(false)
  const [sortOption, setSortOption] = React.useState<SortOption>('relevance')
  const [showSavedSearches, setShowSavedSearches] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const onResultsChangeRef = React.useRef(onResultsChange)

  // Keep ref updated without triggering re-renders
  React.useEffect(() => {
    onResultsChangeRef.current = onResultsChange
  })

  // Custom hooks
  const activeFilterCount = useActiveFilterCount(filters)
  const {
    savedSearches,
    recentSearches,
    addToRecent,
    saveSearch,
    updateLastUsed,
    deleteSearch,
  } = useSavedSearches()

  // Perform search with deferred value
  const { filteredMessages, isPending } = useDeferredSearch(
    messages,
    filters.query
  )

  // Apply advanced filters and sorting
  const finalResults = useFilteredMessages(
    filteredMessages,
    filters,
    sortOption
  )

  // Notify parent of results (using ref to avoid infinite loops)
  React.useEffect(() => {
    onResultsChangeRef.current?.(finalResults)
  }, [finalResults])

  // Extract unique models for filter dropdown
  const availableModels = React.useMemo(() => {
    const models = new Set<string>()
    messages.forEach((msg) => {
      const metadata = (msg as ExtendedMessage).metadata
      if (metadata?.model && typeof metadata.model === 'string') {
        models.add(metadata.model)
      }
    })
    return Array.from(models)
  }, [messages])

  // Update filters helper
  const updateFilters = React.useCallback((update: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...update }))
  }, [])

  // Clear all filters
  const handleClearFilters = React.useCallback(() => {
    setFilters({ query: filters.query })
  }, [filters.query])

  // Apply preset filters
  const applyPreset = React.useCallback((preset: FilterPreset) => {
    setFilters((prev) => ({
      ...prev,
      ...preset.filters,
    }))
  }, [])

  // Load saved search
  const loadSavedSearch = React.useCallback(
    (search: { id: string; filters: SearchFilters }) => {
      setFilters(search.filters)
      setShowSavedSearches(false)
      updateLastUsed(search.id)
    },
    [updateLastUsed]
  )

  // Save current search
  const handleSaveSearch = React.useCallback(
    (name: string) => {
      saveSearch(name, filters)
    },
    [saveSearch, filters]
  )

  // Export results
  const handleExport = React.useCallback(
    (format: ExportFormat) => {
      let content = ''
      let filename = ''
      let mimeType = ''

      switch (format) {
        case 'json':
          content = JSON.stringify(finalResults, null, 2)
          filename = 'search-results.json'
          mimeType = 'application/json'
          break
        case 'csv': {
          const headers = ['id', 'role', 'content', 'createdAt', 'status']
          const rows = finalResults.map((msg) =>
            headers
              .map((h) => {
                const value = (msg as unknown as Record<string, unknown>)[h]
                return typeof value === 'string'
                  ? `"${value.replace(/"/g, '""')}"`
                  : value
              })
              .join(',')
          )
          content = [headers.join(','), ...rows].join('\n')
          filename = 'search-results.csv'
          mimeType = 'text/csv'
          break
        }
        case 'md':
          content = finalResults
            .map(
              (msg) =>
                `### ${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}\n\n${msg.content}\n\n---\n`
            )
            .join('\n')
          filename = 'search-results.md'
          mimeType = 'text/markdown'
          break
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    [finalResults]
  )

  // Copy results to clipboard
  const handleCopyResults = React.useCallback(async () => {
    const content = finalResults
      .map((msg) => `[${msg.role}]: ${msg.content}`)
      .join('\n\n')

    try {
      await navigator.clipboard.writeText(content)
    } catch {
      // Silently fail
    }
  }, [finalResults])

  // Size classes
  const sizeClasses = {
    sm: { input: 'h-8 text-sm', button: 'h-7 w-7', badge: 'text-xs' },
    md: { input: 'h-10 text-sm', button: 'h-8 w-8', badge: 'text-xs' },
    lg: { input: 'h-12 text-base', button: 'h-9 w-9', badge: 'text-sm' },
  }

  const currentSize = sizeClasses[size]

  return (
    <div className={cn('space-y-3', className)}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative group">
          <SearchIcon
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors',
              filters.query && 'text-primary'
            )}
          />
          <Input
            ref={inputRef}
            type="search"
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            placeholder={placeholder}
            className={cn(
              currentSize.input,
              'pl-9 pr-32 transition-all duration-200 border-2',
              'focus:border-primary focus:ring-2 focus:ring-primary/20'
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filters.query.trim()) {
                addToRecent(filters.query.trim())
              } else if (e.key === 'Escape') {
                if (filters.query) {
                  updateFilters({ query: '' })
                } else {
                  inputRef.current?.blur()
                }
              }
            }}
            onBlur={() => {
              if (filters.query.trim()) {
                addToRecent(filters.query.trim())
              }
            }}
          />

          {/* Right side controls */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Loading indicator */}
            {prefersReducedMotion ? (
              isPending && (
                <div className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              )
            ) : (
              <AnimatePresence>
                {isPending && (
                  <motion.div
                    {...ANIMATION_PRESETS.pop}
                    viewport={{ once: true }}
                    className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin"
                  />
                )}
              </AnimatePresence>
            )}

            {/* Clear button */}
            {prefersReducedMotion ? (
              filters.query && (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters({ query: '' })}
                    className="h-6 w-6 p-0 hover:bg-transparent hover:text-destructive"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )
            ) : (
              <AnimatePresence>
                {filters.query && (
                  <motion.div
                    {...ANIMATION_PRESETS.pop}
                    viewport={{ once: true }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilters({ query: '' })}
                      className="h-6 w-6 p-0 hover:bg-transparent hover:text-destructive"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Sorting */}
            {enableSorting && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      currentSize.button,
                      'p-0',
                      sortOption !== 'relevance' && 'text-primary'
                    )}
                  >
                    <SortIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-1" align="end">
                  {(
                    [
                      'relevance',
                      'newest',
                      'oldest',
                      'longest',
                      'shortest',
                    ] as SortOption[]
                  ).map((option) => (
                    <button
                      key={option}
                      onClick={() => setSortOption(option)}
                      className={cn(
                        'w-full px-2 py-1.5 text-sm text-left rounded hover:bg-accent flex items-center justify-between',
                        sortOption === option && 'bg-accent'
                      )}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                      {sortOption === option && (
                        <CheckIcon className="h-3.5 w-3.5 text-primary" />
                      )}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            )}

            {/* Saved searches */}
            {enableSavedSearches && (
              <Popover
                open={showSavedSearches}
                onOpenChange={setShowSavedSearches}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(currentSize.button, 'p-0')}
                  >
                    <BookmarkIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="end">
                  <SavedSearchesPanel
                    savedSearches={savedSearches}
                    recentSearches={recentSearches}
                    currentFilters={filters}
                    activeFilterCount={activeFilterCount}
                    onLoadSearch={loadSavedSearch}
                    onDeleteSearch={deleteSearch}
                    onSaveSearch={handleSaveSearch}
                    onApplyRecentSearch={(query) => updateFilters({ query })}
                  />
                </PopoverContent>
              </Popover>
            )}

            {/* Advanced filters */}
            {enableAdvancedFilters && (
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      currentSize.button,
                      'p-0 relative',
                      activeFilterCount > 0 && 'text-primary'
                    )}
                  >
                    <SlidersIcon className="h-4 w-4" />
                    {activeFilterCount > 0 && showFilterCount && (
                      <Badge
                        variant="default"
                        className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px]"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <SearchFiltersPanel
                    filters={filters}
                    activeFilterCount={activeFilterCount}
                    filterPresets={filterPresets}
                    availableModels={availableModels}
                    onUpdateFilters={updateFilters}
                    onClearFilters={handleClearFilters}
                    onApplyPreset={applyPreset}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {prefersReducedMotion ? (
          isPending && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden rounded-b-md">
              <div className="h-full bg-primary w-full" />
            </div>
          )
        ) : (
          <AnimatePresence>
            {isPending && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden rounded-b-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="h-full bg-primary"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: durations.slower,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Active Filters Pills */}
      <ActiveFiltersPills
        filters={filters}
        activeFilterCount={activeFilterCount}
        onUpdateFilters={updateFilters}
      />

      {/* Results Summary */}
      {(filters.query || activeFilterCount > 0) && (
        <SearchResultsSummary
          results={finalResults}
          totalMessages={messages.length}
          sortOption={sortOption}
          isPending={isPending}
          enableExport={enableExport}
          onExport={handleExport}
          onCopyResults={handleCopyResults}
        />
      )}
    </div>
  )
})

AdvancedMessageSearch.displayName = 'AdvancedMessageSearch'
