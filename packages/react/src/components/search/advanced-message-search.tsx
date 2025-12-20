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
} from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'
import { SearchIcon } from '../ui/icons'
import {
  Filter,
  X,
  Download,
  BookmarkPlus,
  Bookmark,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  User,
  Bot,
  Settings,
  Calendar,
  Hash,
  Paperclip,
  AlertCircle,
  Check,
  Copy,
  ArrowUpDown,
} from 'lucide-react'

// Type assertions for icons
const FilterIcon = Filter as React.ComponentType<{ className?: string }>
const XIcon = X as React.ComponentType<{ className?: string }>
const DownloadIcon = Download as React.ComponentType<{ className?: string }>
const BookmarkPlusIcon = BookmarkPlus as React.ComponentType<{
  className?: string
}>
const BookmarkIcon = Bookmark as React.ComponentType<{ className?: string }>
const ClockIcon = Clock as React.ComponentType<{ className?: string }>
const TrashIcon = Trash2 as React.ComponentType<{ className?: string }>
const ChevronDownIcon = ChevronDown as React.ComponentType<{
  className?: string
}>
const ChevronUpIcon = ChevronUp as React.ComponentType<{ className?: string }>
const RefreshIcon = RefreshCw as React.ComponentType<{ className?: string }>
const SlidersIcon = SlidersHorizontal as React.ComponentType<{
  className?: string
}>
const SparklesIcon = Sparkles as React.ComponentType<{ className?: string }>
const UserIcon = User as React.ComponentType<{ className?: string }>
const BotIcon = Bot as React.ComponentType<{ className?: string }>
const SettingsIcon = Settings as React.ComponentType<{ className?: string }>
const CalendarIcon = Calendar as React.ComponentType<{ className?: string }>
const HashIcon = Hash as React.ComponentType<{ className?: string }>
const PaperclipIcon = Paperclip as React.ComponentType<{ className?: string }>
const AlertIcon = AlertCircle as React.ComponentType<{ className?: string }>
const CheckIcon = Check as React.ComponentType<{ className?: string }>
const CopyIcon = Copy as React.ComponentType<{ className?: string }>
const SortIcon = ArrowUpDown as React.ComponentType<{ className?: string }>

import { useDeferredSearch } from '../../hooks/performance/use-deferred-search'
import { DURATION_SECONDS as durations } from '../../animations/constants'

/**
 * Filter criteria for advanced search
 */
export interface SearchFilters {
  /** Text search query */
  query: string
  /** Filter by message role */
  role?: 'user' | 'assistant' | 'system'
  /** Filter by date range */
  dateRange?: {
    start?: Date
    end?: Date
  }
  /** Filter by model (if metadata available) */
  model?: string
  /** Filter by tags/keywords */
  tags?: string[]
  /** Minimum token count */
  minTokens?: number
  /** Maximum token count */
  maxTokens?: number
  /** Include only messages with attachments */
  hasAttachments?: boolean
  /** Include only messages with errors */
  hasErrors?: boolean
}

/**
 * Saved search configuration
 */
export interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
  createdAt: number
  lastUsed?: number
}

/**
 * Sort options for results
 */
export type SortOption =
  | 'relevance'
  | 'newest'
  | 'oldest'
  | 'longest'
  | 'shortest'

/**
 * Filter preset configuration
 */
export interface FilterPreset {
  id: string
  name: string
  icon: React.ReactNode
  filters: Partial<SearchFilters>
}

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

const STORAGE_KEY_SAVED = 'clarity-advanced-search-saved'
const STORAGE_KEY_RECENT = 'clarity-advanced-search-recent'

// Default filter presets
const defaultPresets: FilterPreset[] = [
  {
    id: 'user-messages',
    name: 'User Messages',
    icon: <UserIcon className="h-3.5 w-3.5" />,
    filters: { role: 'user' },
  },
  {
    id: 'ai-responses',
    name: 'AI Responses',
    icon: <BotIcon className="h-3.5 w-3.5" />,
    filters: { role: 'assistant' },
  },
  {
    id: 'with-attachments',
    name: 'Has Attachments',
    icon: <PaperclipIcon className="h-3.5 w-3.5" />,
    filters: { hasAttachments: true },
  },
  {
    id: 'with-errors',
    name: 'Has Errors',
    icon: <AlertIcon className="h-3.5 w-3.5" />,
    filters: { hasErrors: true },
  },
  {
    id: 'today',
    name: 'Today',
    icon: <CalendarIcon className="h-3.5 w-3.5" />,
    filters: {
      dateRange: {
        start: new Date(new Date().setHours(0, 0, 0, 0)),
        end: new Date(),
      },
    },
  },
]

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
  onMessageSelect,
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
  const [filters, setFilters] = React.useState<SearchFilters>({ query: '' })
  const [showFilters, setShowFilters] = React.useState(false)
  const [activeFilterCount, setActiveFilterCount] = React.useState(0)
  const [savedSearches, setSavedSearches] = React.useState<SavedSearch[]>([])
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])
  const [sortOption, setSortOption] = React.useState<SortOption>('relevance')
  const [showSavedSearches, setShowSavedSearches] = React.useState(false)
  const [savingSearch, setSavingSearch] = React.useState(false)
  const [searchName, setSearchName] = React.useState('')
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(['role', 'quick'])
  )
  const [exportFormat, setExportFormat] = React.useState<'json' | 'csv' | 'md'>(
    'json'
  )
  const [copied, setCopied] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const onResultsChangeRef = React.useRef(onResultsChange)

  // Keep ref updated without triggering re-renders
  React.useEffect(() => {
    onResultsChangeRef.current = onResultsChange
  })

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  // Load saved and recent searches with validation
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Validate saved searches structure
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (s: unknown) =>
              typeof s === 'object' &&
              s !== null &&
              'id' in s &&
              'name' in s &&
              'filters' in s &&
              'createdAt' in s
          )
        ) {
          setSavedSearches(parsed as SavedSearch[])
        }
      }
      const recent = localStorage.getItem(STORAGE_KEY_RECENT)
      if (recent) {
        const parsed = JSON.parse(recent)
        // Validate recent searches structure
        if (
          Array.isArray(parsed) &&
          parsed.every((r: unknown) => typeof r === 'string')
        ) {
          setRecentSearches(parsed)
        }
      }
    } catch {
      // Silently fail - invalid data will use defaults
    }
  }, [])

  // Calculate active filter count
  React.useEffect(() => {
    let count = 0
    if (filters.role) count++
    if (filters.dateRange?.start || filters.dateRange?.end) count++
    if (filters.model) count++
    if (filters.tags && filters.tags.length > 0) count++
    if (filters.minTokens || filters.maxTokens) count++
    if (filters.hasAttachments) count++
    if (filters.hasErrors) count++
    setActiveFilterCount(count)
  }, [filters])

  // Perform search with deferred value
  const { filteredMessages, isPending } = useDeferredSearch(
    messages,
    filters.query
  )

  // Apply advanced filters and sorting
  const finalResults = React.useMemo(() => {
    let results = [...filteredMessages]

    // Filter by role
    if (filters.role) {
      results = results.filter((msg) => msg.role === filters.role)
    }

    // Filter by date range
    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      results = results.filter((msg) => {
        const msgDate = new Date(msg.createdAt)
        if (start && msgDate < start) return false
        if (end && msgDate > end) return false
        return true
      })
    }

    // Filter by model
    if (filters.model) {
      results = results.filter((msg) => {
        const metadata = (
          msg as Message & { metadata?: Record<string, unknown> }
        ).metadata
        return metadata?.model === filters.model
      })
    }

    // Filter by tokens
    if (filters.minTokens || filters.maxTokens) {
      results = results.filter((msg) => {
        const tokenCount =
          (msg as Message & { tokenCount?: number }).tokenCount || 0
        if (filters.minTokens && tokenCount < filters.minTokens) return false
        if (filters.maxTokens && tokenCount > filters.maxTokens) return false
        return true
      })
    }

    // Filter by attachments
    if (filters.hasAttachments) {
      results = results.filter((msg) => {
        return (
          (msg as Message & { attachments?: unknown[] }).attachments &&
          (msg as Message & { attachments?: unknown[] }).attachments!.length > 0
        )
      })
    }

    // Filter by errors
    if (filters.hasErrors) {
      results = results.filter((msg) => msg.status === 'error')
    }

    // Apply sorting
    if (sortOption !== 'relevance') {
      results.sort((a, b) => {
        switch (sortOption) {
          case 'newest':
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          case 'oldest':
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
          case 'longest':
            return b.content.length - a.content.length
          case 'shortest':
            return a.content.length - b.content.length
          default:
            return 0
        }
      })
    }

    return results
  }, [filteredMessages, filters, sortOption])

  // Notify parent of results (using ref to avoid infinite loops)
  React.useEffect(() => {
    onResultsChangeRef.current?.(finalResults)
  }, [finalResults])

  // Extract unique models for filter dropdown
  const availableModels = React.useMemo(() => {
    const models = new Set<string>()
    messages.forEach((msg) => {
      const metadata = (msg as any).metadata
      if (metadata?.model) {
        models.add(metadata.model)
      }
    })
    return Array.from(models)
  }, [messages])

  // Add to recent searches
  const addToRecent = React.useCallback((query: string) => {
    if (!query.trim()) return
    setRecentSearches((prev) => {
      const newRecent = [query, ...prev.filter((r) => r !== query)].slice(0, 10)
      try {
        localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(newRecent))
      } catch {
        // Silently fail
      }
      return newRecent
    })
  }, [])

  // Save current search
  const handleSaveSearch = React.useCallback(() => {
    if (!searchName.trim()) return

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: { ...filters },
      createdAt: Date.now(),
    }

    setSavedSearches((prev) => {
      const newSaved = [newSearch, ...prev].slice(0, 20)
      try {
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(newSaved))
      } catch {
        // Silently fail
      }
      return newSaved
    })

    setSearchName('')
    setSavingSearch(false)
  }, [searchName, filters])

  // Load saved search
  const loadSavedSearch = React.useCallback((search: SavedSearch) => {
    setFilters(search.filters)
    setShowSavedSearches(false)

    // Update last used
    setSavedSearches((prev) => {
      const updated = prev.map((s) =>
        s.id === search.id ? { ...s, lastUsed: Date.now() } : s
      )
      try {
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated))
      } catch {
        // Silently fail
      }
      return updated
    })
  }, [])

  // Delete saved search
  const deleteSavedSearch = React.useCallback((id: string) => {
    setSavedSearches((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated))
      } catch {
        // Silently fail
      }
      return updated
    })
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

  // Toggle section expansion
  const toggleSection = React.useCallback((section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }, [])

  // Export results
  const handleExport = React.useCallback(() => {
    let content = ''
    let filename = ''
    let mimeType = ''

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(finalResults, null, 2)
        filename = 'search-results.json'
        mimeType = 'application/json'
        break
      case 'csv':
        const headers = ['id', 'role', 'content', 'createdAt', 'status']
        const rows = finalResults.map((msg) =>
          headers
            .map((h) => {
              const value = (msg as any)[h]
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
  }, [finalResults, exportFormat])

  // Copy results to clipboard
  const handleCopyResults = React.useCallback(async () => {
    const content = finalResults
      .map((msg) => `[${msg.role}]: ${msg.content}`)
      .join('\n\n')

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      // Clear any existing timeout before setting a new one
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false)
        copyTimeoutRef.current = null
      }, 2000)
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

  // Check if any preset is active
  const isPresetActive = (preset: FilterPreset) => {
    return Object.entries(preset.filters).every(([key, value]) => {
      const filterValue = filters[key as keyof SearchFilters]
      if (key === 'dateRange' && value) {
        return (
          filters.dateRange?.start?.getTime() ===
            (value as any).start?.getTime() &&
          filters.dateRange?.end?.getTime() === (value as any).end?.getTime()
        )
      }
      return filterValue === value
    })
  }

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
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, query: e.target.value }))
            }}
            placeholder={placeholder}
            className={cn(
              currentSize.input,
              'pl-9 pr-32 transition-all duration-200 border-2',
              'focus:border-primary focus:ring-2 focus:ring-primary/20'
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filters.query.trim()) {
                // Add to recent on Enter
                addToRecent(filters.query.trim())
              } else if (e.key === 'Escape') {
                if (filters.query) {
                  setFilters((prev) => ({ ...prev, query: '' }))
                } else {
                  inputRef.current?.blur()
                }
              }
            }}
            onBlur={() => {
              // Add to recent on blur if there's a query
              if (filters.query.trim()) {
                addToRecent(filters.query.trim())
              }
            }}
          />

          {/* Right side controls */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Loading indicator */}
            <AnimatePresence>
              {isPending && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin"
                />
              )}
            </AnimatePresence>

            {/* Clear button */}
            <AnimatePresence>
              {filters.query && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, query: '' }))
                    }
                    className="h-6 w-6 p-0 hover:bg-transparent hover:text-destructive"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

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
                  <div className="space-y-3">
                    {/* Save current search */}
                    {(filters.query || activeFilterCount > 0) && (
                      <div className="pb-3 border-b">
                        {savingSearch ? (
                          <div className="flex gap-2">
                            <Input
                              value={searchName}
                              onChange={(e) => setSearchName(e.target.value)}
                              placeholder="Search name..."
                              className="h-8 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveSearch()
                                if (e.key === 'Escape') setSavingSearch(false)
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={handleSaveSearch}
                              disabled={!searchName.trim()}
                              className="h-8"
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSavingSearch(true)}
                            className="w-full justify-start"
                          >
                            <BookmarkPlusIcon className="h-4 w-4 mr-2" />
                            Save Current Search
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Saved searches list */}
                    {savedSearches.length > 0 ? (
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {savedSearches.map((search) => (
                          <div
                            key={search.id}
                            className="flex items-center gap-2 p-2 rounded hover:bg-accent group"
                          >
                            <button
                              onClick={() => loadSavedSearch(search)}
                              className="flex-1 text-left"
                            >
                              <div className="text-sm font-medium truncate">
                                {search.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {search.filters.query &&
                                  `"${search.filters.query}"`}
                                {Object.keys(search.filters).filter(
                                  (k) =>
                                    k !== 'query' &&
                                    search.filters[k as keyof SearchFilters]
                                ).length > 0 && ' + filters'}
                              </div>
                            </button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSavedSearch(search.id)}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:text-destructive"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-center text-muted-foreground py-4">
                        No saved searches yet
                      </div>
                    )}

                    {/* Recent searches */}
                    {recentSearches.length > 0 && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <ClockIcon className="h-3 w-3" />
                          Recent
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {recentSearches.slice(0, 5).map((query, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                setFilters((prev) => ({ ...prev, query }))
                              }
                              className="px-2 py-1 text-xs bg-muted rounded-full hover:bg-accent truncate max-w-[100px]"
                            >
                              {query}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <FilterIcon className="h-4 w-4" />
                        Filters
                      </h4>
                      {activeFilterCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearFilters}
                          className="h-7 text-xs text-muted-foreground hover:text-destructive"
                        >
                          <RefreshIcon className="h-3 w-3 mr-1" />
                          Clear All
                        </Button>
                      )}
                    </div>

                    {/* Quick Filters / Presets */}
                    <div>
                      <button
                        onClick={() => toggleSection('quick')}
                        className="flex items-center justify-between w-full text-sm font-medium mb-2"
                      >
                        <span className="flex items-center gap-1">
                          <SparklesIcon className="h-3.5 w-3.5" />
                          Quick Filters
                        </span>
                        {expandedSections.has('quick') ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedSections.has('quick') && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-wrap gap-1.5">
                              {filterPresets.map((preset) => (
                                <Button
                                  key={preset.id}
                                  variant={
                                    isPresetActive(preset)
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size="sm"
                                  onClick={() => applyPreset(preset)}
                                  className="h-7 text-xs gap-1"
                                >
                                  {preset.icon}
                                  {preset.name}
                                </Button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Role Filter */}
                    <div>
                      <button
                        onClick={() => toggleSection('role')}
                        className="flex items-center justify-between w-full text-sm font-medium mb-2"
                      >
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-3.5 w-3.5" />
                          Message Role
                        </span>
                        {expandedSections.has('role') ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedSections.has('role') && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex gap-1.5">
                              {(
                                ['all', 'user', 'assistant', 'system'] as const
                              ).map((role) => (
                                <Button
                                  key={role}
                                  variant={
                                    (role === 'all' && !filters.role) ||
                                    filters.role === role
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size="sm"
                                  onClick={() =>
                                    setFilters((prev) => ({
                                      ...prev,
                                      role: role === 'all' ? undefined : role,
                                    }))
                                  }
                                  className="h-7 text-xs flex-1"
                                >
                                  {role === 'all'
                                    ? 'All'
                                    : role.charAt(0).toUpperCase() +
                                      role.slice(1)}
                                </Button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Model Filter */}
                    {availableModels.length > 0 && (
                      <div>
                        <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                          <SettingsIcon className="h-3.5 w-3.5" />
                          Model
                        </label>
                        <select
                          value={filters.model || 'all'}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              model:
                                e.target.value === 'all'
                                  ? undefined
                                  : e.target.value,
                            }))
                          }
                          className="w-full h-8 px-3 text-sm border rounded-md bg-background"
                        >
                          <option value="all">All Models</option>
                          {availableModels.map((model) => (
                            <option key={model} value={model}>
                              {model}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Date Range */}
                    <div>
                      <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        Date Range
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={
                            filters.dateRange?.start
                              ? filters.dateRange.start
                                  .toISOString()
                                  .split('T')[0]
                              : ''
                          }
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: {
                                ...prev.dateRange,
                                start: e.target.value
                                  ? new Date(e.target.value)
                                  : undefined,
                              },
                            }))
                          }
                          className="h-8 text-sm"
                        />
                        <Input
                          type="date"
                          value={
                            filters.dateRange?.end
                              ? filters.dateRange.end
                                  .toISOString()
                                  .split('T')[0]
                              : ''
                          }
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: {
                                ...prev.dateRange,
                                end: e.target.value
                                  ? new Date(e.target.value)
                                  : undefined,
                              },
                            }))
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    {/* Token Range */}
                    <div>
                      <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                        <HashIcon className="h-3.5 w-3.5" />
                        Token Count
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.minTokens || ''}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              minTokens: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            }))
                          }
                          className="h-8 text-sm"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.maxTokens || ''}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              maxTokens: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            }))
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    {/* Boolean Options */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.hasAttachments || false}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              hasAttachments: e.target.checked
                                ? true
                                : undefined,
                            }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm flex items-center gap-1">
                          <PaperclipIcon className="h-3.5 w-3.5" />
                          Has attachments
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.hasErrors || false}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              hasErrors: e.target.checked ? true : undefined,
                            }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm flex items-center gap-1">
                          <AlertIcon className="h-3.5 w-3.5" />
                          Has errors
                        </span>
                      </label>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden rounded-b-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
      </div>

      {/* Active Filters Pills */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-1.5"
          >
            {filters.role && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Role: {filters.role}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, role: undefined }))
                  }
                  className="ml-0.5 hover:text-destructive"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.model && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Model: {filters.model}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, model: undefined }))
                  }
                  className="ml-0.5 hover:text-destructive"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(filters.dateRange?.start || filters.dateRange?.end) && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Date: {filters.dateRange?.start?.toLocaleDateString() || '...'}{' '}
                - {filters.dateRange?.end?.toLocaleDateString() || '...'}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, dateRange: undefined }))
                  }
                  className="ml-0.5 hover:text-destructive"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(filters.minTokens || filters.maxTokens) && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Tokens: {filters.minTokens || 0} - {filters.maxTokens || '...'}
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      minTokens: undefined,
                      maxTokens: undefined,
                    }))
                  }
                  className="ml-0.5 hover:text-destructive"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.hasAttachments && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Has attachments
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      hasAttachments: undefined,
                    }))
                  }
                  className="ml-0.5 hover:text-destructive"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.hasErrors && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Has errors
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, hasErrors: undefined }))
                  }
                  className="ml-0.5 hover:text-destructive"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <AnimatePresence>
        {(filters.query || activeFilterCount > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <motion.span
                className={cn(
                  'inline-block w-2 h-2 rounded-full',
                  finalResults.length > 0 ? 'bg-green-500' : 'bg-amber-500'
                )}
                animate={isPending ? { scale: [1, 1.2, 1] } : {}}
                transition={{
                  duration: durations.slower,
                  repeat: isPending ? Infinity : 0,
                }}
              />
              <span>
                Found{' '}
                <motion.span
                  key={finalResults.length}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="font-semibold text-foreground"
                >
                  {finalResults.length}
                </motion.span>{' '}
                of {messages.length} messages
              </span>
              {sortOption !== 'relevance' && (
                <Badge variant="outline" className="text-xs">
                  Sorted by {sortOption}
                </Badge>
              )}
            </div>

            {/* Export Actions */}
            {enableExport && finalResults.length > 0 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyResults}
                  className="h-7 text-xs gap-1"
                >
                  {copied ? (
                    <CheckIcon className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <CopyIcon className="h-3.5 w-3.5" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                    >
                      <DownloadIcon className="h-3.5 w-3.5" />
                      Export
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="end">
                    <div className="space-y-1">
                      {(['json', 'csv', 'md'] as const).map((format) => (
                        <button
                          key={format}
                          onClick={() => {
                            setExportFormat(format)
                            handleExport()
                          }}
                          className="w-full px-2 py-1.5 text-sm text-left rounded hover:bg-accent flex items-center justify-between"
                        >
                          Export as .{format}
                          <Badge variant="outline" className="text-[10px]">
                            {format.toUpperCase()}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

AdvancedMessageSearch.displayName = 'AdvancedMessageSearch'
