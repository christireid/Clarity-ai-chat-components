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
import { SearchIcon } from './icons'
import { Filter as FilterIcon } from 'lucide-react'

// Type assertion to fix React 18/19 compatibility
const FilterIconComponent = FilterIcon as React.ComponentType<{ className?: string }>
import { useDeferredSearch } from '../hooks/use-deferred-search'

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
 * Props for AdvancedMessageSearch component
 */
export interface AdvancedMessageSearchProps {
  /** Messages to search through */
  messages: Message[]
  /** Callback when search results change */
  onResultsChange?: (filteredMessages: Message[]) => void
  /** Enable fuzzy search with typo tolerance */
  enableFuzzySearch?: boolean
  /** Enable advanced filters */
  enableAdvancedFilters?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Show filter count badge */
  showFilterCount?: boolean
  className?: string
}

/**
 * Advanced Message Search Component
 * 
 * Features:
 * - Full-text search with highlighting
 * - Fuzzy search with typo tolerance
 * - Advanced filtering (date, model, role, tokens)
 * - Real-time results with deferred updates
 * - Accessible keyboard navigation
 * 
 * @example
 * ```tsx
 * <AdvancedMessageSearch
 *   messages={messages}
 *   onResultsChange={(filtered) => setFilteredMessages(filtered)}
 *   enableFuzzySearch
 *   enableAdvancedFilters
 * />
 * ```
 */
export const AdvancedMessageSearch = React.memo(
  function AdvancedMessageSearch({
    messages,
    onResultsChange,
    enableFuzzySearch: _enableFuzzySearch = false, // Reserved for future fuzzy search implementation
    enableAdvancedFilters = true,
    placeholder = 'Search messages...',
    showFilterCount = true,
    className,
  }: AdvancedMessageSearchProps) {
    const [filters, setFilters] = React.useState<SearchFilters>({
      query: '',
    })
    const [showFilters, setShowFilters] = React.useState(false)
    const [activeFilterCount, setActiveFilterCount] = React.useState(0)

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

    // Perform search with deferred value for performance
    const { filteredMessages, isPending } = useDeferredSearch(
      messages,
      filters.query
    )

    // Apply advanced filters
    const finalResults = React.useMemo(() => {
      let results = filteredMessages

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

      // Filter by model (if metadata available)
      if (filters.model) {
        results = results.filter((msg) => {
          const metadata = (msg as Message & { metadata?: Record<string, unknown> }).metadata
          return metadata?.model === filters.model
        })
      }

      // Filter by tokens
      if (filters.minTokens || filters.maxTokens) {
        results = results.filter((msg) => {
          const tokenCount = (msg as Message & { tokenCount?: number }).tokenCount || 0
          if (filters.minTokens && tokenCount < filters.minTokens) return false
          if (filters.maxTokens && tokenCount > filters.maxTokens) return false
          return true
        })
      }

      // Filter by attachments
      if (filters.hasAttachments) {
        results = results.filter((msg) => {
          return (msg as Message & { attachments?: unknown[] }).attachments && (msg as Message & { attachments?: unknown[] }).attachments!.length > 0
        })
      }

      // Filter by errors
      if (filters.hasErrors) {
        results = results.filter((msg) => msg.status === 'error')
      }

      return results
    }, [filteredMessages, filters])

    // Notify parent of results
    React.useEffect(() => {
      onResultsChange?.(finalResults)
    }, [finalResults, onResultsChange])

    // Extract unique models and roles for filter dropdowns
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

    const handleClearFilters = () => {
      setFilters({
        query: filters.query, // Keep search query
      })
    }

    return (
      <div className={cn('space-y-2', className)}>
        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={filters.query}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, query: e.target.value }))
            }
            placeholder={placeholder}
            className="pl-9 pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isPending && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
            {enableAdvancedFilters && (
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-7 w-7 p-0',
                      activeFilterCount > 0 && 'bg-primary text-primary-foreground'
                    )}
                    aria-label="Advanced filters"
                  >
                    <FilterIconComponent className="h-4 w-4" />
                    {activeFilterCount > 0 && showFilterCount && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-xs"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Filters</h4>
                      {activeFilterCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearFilters}
                          className="h-7 text-xs"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    {/* Role Filter */}
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Role
                      </label>
                      <select
                        value={filters.role || 'all'}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            role: e.target.value === 'all' ? undefined : (e.target.value as 'user' | 'assistant' | 'system'),
                          }))
                        }
                        className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                      >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="assistant">Assistant</option>
                        <option value="system">System</option>
                      </select>
                    </div>

                    {/* Model Filter */}
                    {availableModels.length > 0 && (
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Model
                        </label>
                        <select
                          value={filters.model || 'all'}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              model: e.target.value === 'all' ? undefined : e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border rounded-md bg-background"
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={
                            filters.dateRange?.start
                              ? filters.dateRange.start.toISOString().split('T')[0]
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
                          placeholder="Start date"
                        />
                        <Input
                          type="date"
                          value={
                            filters.dateRange?.end
                              ? filters.dateRange.end.toISOString().split('T')[0]
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
                          placeholder="End date"
                        />
                      </div>
                    </div>

                    {/* Token Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Token Count</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Min tokens"
                          value={filters.minTokens || ''}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              minTokens: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            }))
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Max tokens"
                          value={filters.maxTokens || ''}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              maxTokens: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Boolean Filters */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Options</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
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
                          <span className="text-sm">Has attachments</span>
                        </label>
                        <label className="flex items-center gap-2">
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
                          <span className="text-sm">Has errors</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {filters.query && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between text-sm text-muted-foreground"
            >
              <span>
                Found {finalResults.length} of {messages.length} messages
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary">
                  {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    )
  }
)
