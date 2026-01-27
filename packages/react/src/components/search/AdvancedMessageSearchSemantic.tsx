'use client'

import * as React from 'react'
import {
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useReducedMotion,
} from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'
import {
  Search,
  Sparkles,
  Brain,
  Zap,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Lightbulb,
  TrendingUp,
  Eye,
  EyeOff,
  Settings,
  Sliders,
  Target,
  Wand2,
} from 'lucide-react'

// Type assertions for icons
const SearchIcon = Search as React.ComponentType<{ className?: string }>
const SparklesIcon = Sparkles as React.ComponentType<{ className?: string }>
const BrainIcon = Brain as React.ComponentType<{ className?: string }>
const ZapIcon = Zap as React.ComponentType<{ className?: string }>
const ClockIcon = Clock as React.ComponentType<{ className?: string }>
const XIcon = X as React.ComponentType<{ className?: string }>
const ChevronDownIcon = ChevronDown as React.ComponentType<{
  className?: string
}>
const ChevronUpIcon = ChevronUp as React.ComponentType<{ className?: string }>
const RefreshIcon = RefreshCw as React.ComponentType<{ className?: string }>
const CopyIcon = Copy as React.ComponentType<{ className?: string }>
const CheckIcon = Check as React.ComponentType<{ className?: string }>
const ExternalLinkIcon = ExternalLink as React.ComponentType<{
  className?: string
}>
const LightbulbIcon = Lightbulb as React.ComponentType<{ className?: string }>
const TrendingIcon = TrendingUp as React.ComponentType<{ className?: string }>
const EyeIcon = Eye as React.ComponentType<{ className?: string }>
const EyeOffIcon = EyeOff as React.ComponentType<{ className?: string }>
const SettingsIcon = Settings as React.ComponentType<{ className?: string }>
const SlidersIcon = Sliders as React.ComponentType<{ className?: string }>
const TargetIcon = Target as React.ComponentType<{ className?: string }>
const WandIcon = Wand2 as React.ComponentType<{ className?: string }>

// Import extracted types and utilities
import type {
  SemanticSearchConfig,
  SemanticSearchResult,
  SemanticMessageSearchProps,
  SearchHistoryEntry,
} from './AdvancedMessageSearchSemantic.types'
import { defaultConfig } from './AdvancedMessageSearchSemantic.utils'

// Import extracted components
import {
  SearchHistoryPanel,
  SearchConfigPanel,
  SearchResultCard,
} from './components'

// Import extracted hook
import { useSemanticSearch } from './hooks/useSemanticSearch'

// Re-export types for external consumers
export type {
  SemanticSearchConfig,
  SemanticSearchResult,
  SemanticMessageSearchProps,
  SearchHistoryEntry,
  EmbeddingProvider,
} from './AdvancedMessageSearchSemantic.types'

// getMatchQuality function moved to SearchResultCard component

/**
 * SemanticMessageSearch Component
 *
 * A premium semantic search experience with:
 * - Vector-based semantic similarity matching
 * - Hybrid search combining semantic + keyword
 * - Intelligent query expansion with synonyms
 * - Real-time relevance scoring
 * - Beautiful result cards with match indicators
 * - Search history with quick access
 * - Configurable search parameters
 * - Smooth animations and transitions
 * - Accessibility-first design
 *
 * @example
 * ```tsx
 * <SemanticMessageSearch
 *   messages={messages}
 *   onResultSelect={(result) => scrollToMessage(result.message)}
 *   onGenerateEmbedding={async (text) => {
 *     const response = await fetch('/api/embed', {
 *       method: 'POST',
 *       body: JSON.stringify({ text }),
 *     })
 *     return response.json()
 *   }}
 * />
 * ```
 */
export function SemanticMessageSearch({
  messages,
  config: userConfig,
  onResultsFound,
  onResultSelect,
  onGenerateEmbedding,
  onRerank,
  showHistory = true,
  showConfig = true,
  placeholder = 'Search semantically...',
  compact = false,
  className,
}: SemanticMessageSearchProps) {
  // Merge user config with defaults
  const [localConfig, setLocalConfig] = React.useState(() => ({
    ...defaultConfig,
    ...userConfig,
  }))

  // UI state
  const prefersReducedMotion = useReducedMotion()
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SemanticSearchResult[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [searchHistory, setSearchHistory] = React.useState<SearchHistoryEntry[]>([])
  const [showExpansions, setShowExpansions] = React.useState(false)
  const [showHistoryPanel, setShowHistoryPanel] = React.useState(false)
  const [showConfigPanel, setShowConfigPanel] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [expandedResults, setExpandedResults] = React.useState<Set<string>>(new Set())

  // Refs
  const inputRef = React.useRef<HTMLInputElement>(null)
  const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchAbortRef = React.useRef<AbortController | null>(null)
  const isMountedRef = React.useRef(true)
  const onResultsFoundRef = React.useRef(onResultsFound)

  // Use semantic search hook
  const { search: performSearch, expandedQueries } = useSemanticSearch({
    messages,
    config: localConfig,
    onGenerateEmbedding,
    onRerank,
  })

  // Keep callback refs updated
  React.useEffect(() => {
    onResultsFoundRef.current = onResultsFound
  })

  // Cleanup on unmount
  React.useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
      if (searchAbortRef.current) {
        searchAbortRef.current.abort()
      }
    }
  }, [])

  // Load history from localStorage
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const history = localStorage.getItem('clarity-semantic-search-history')
      if (history) {
        const parsed = JSON.parse(history)
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed)
        }
      }
    } catch {
      // Silently fail
    }
  }, [])

  /**
   * Handle search with proper cleanup
   */
  const handleSearch = React.useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      // Abort any in-flight search
      if (searchAbortRef.current) {
        searchAbortRef.current.abort()
      }
      searchAbortRef.current = new AbortController()

      setIsSearching(true)
      setError(null)

      try {
        const searchResults = await performSearch(searchQuery)

        // Check if component is still mounted and search wasn't aborted
        if (!isMountedRef.current || searchAbortRef.current?.signal.aborted) {
          return
        }

        setResults(searchResults)
        onResultsFoundRef.current?.(searchResults)

        // Add to search history
        setSearchHistory((prev) => {
          const newHistory = [
            {
              query: searchQuery,
              timestamp: Date.now(),
              resultCount: searchResults.length,
            },
            ...prev.filter((h) => h.query !== searchQuery).slice(0, 9),
          ]
          try {
            localStorage.setItem(
              'clarity-semantic-search-history',
              JSON.stringify(newHistory)
            )
          } catch {
            // Silently fail
          }
          return newHistory
        })
      } catch (err) {
        // Don't show error if aborted or unmounted
        if (!isMountedRef.current) return
        if (err instanceof Error && err.name === 'AbortError') return

        if (process.env.NODE_ENV === 'development') {
          console.error('Search error:', err)
        }
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        if (isMountedRef.current) {
          setIsSearching(false)
        }
      }
    },
    [performSearch]
  )

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        handleSearch(query)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, handleSearch])

  // Copy result content
  const handleCopy = React.useCallback(async (result: SemanticSearchResult) => {
    try {
      await navigator.clipboard.writeText(result.message.content)
      setCopiedId(result.message.id)
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
      copyTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setCopiedId(null)
        }
        copyTimeoutRef.current = null
      }, 2000)
    } catch {
      // Silently fail
    }
  }, [])

  // Toggle result expansion
  const toggleExpanded = React.useCallback((id: string) => {
    setExpandedResults((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  // Clear history
  const clearHistory = React.useCallback(() => {
    setSearchHistory([])
    try {
      localStorage.removeItem('clarity-semantic-search-history')
    } catch {
      // Silently fail
    }
  }, [])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Header */}
      <Card
        className={cn(
          'shadow-sm overflow-hidden',
          compact && 'shadow-none border-0'
        )}
      >
        {!compact && (
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25">
                  <BrainIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Semantic Search
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    AI-powered understanding of your queries
                  </p>
                </div>
              </div>

              {/* Config badges */}
              <div className="hidden sm:flex items-center gap-1.5">
                {localConfig.hybrid.enabled && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <ZapIcon className="h-3 w-3" />
                    Hybrid
                  </Badge>
                )}
                {localConfig.queryExpansion && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <WandIcon className="h-3 w-3" />
                    Expansion
                  </Badge>
                )}
                {localConfig.reranking?.enabled && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <TrendingIcon className="h-3 w-3" />
                    Reranking
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        )}

        <CardContent className={cn('space-y-3', compact && 'p-0')}>
          {/* Search Input */}
          <div className="relative">
            <div className="relative group">
              <motion.div
                className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors z-10',
                  query && 'text-violet-500'
                )}
                animate={isSearching ? { scale: [1, 1.1, 1] } : {}}
                transition={{
                  duration: durations.slower,
                  repeat: isSearching ? Infinity : 0,
                }}
                viewport={{ once: true }}
              >
                <SearchIcon className="h-4 w-4" />
              </motion.div>

              <Input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className={cn(
                  'pl-9 pr-24 h-11 transition-all duration-200 border-2',
                  'focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20',
                  'bg-gradient-to-r from-background to-muted/30'
                )}
                disabled={isSearching}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setQuery('')
                    inputRef.current?.blur()
                  }
                }}
              />

              {/* Right controls */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Loading indicator */}
                {prefersReducedMotion ? (
                  isSearching && (
                    <div className="h-4 w-4 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
                  )
                ) : (
                  <AnimatePresence>
                    {isSearching && (
                      <motion.div
                        {...ANIMATION_PRESETS.pop}
                        className="h-4 w-4 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin"
                      />
                    )}
                  </AnimatePresence>
                )}

                {/* Clear button */}
                {prefersReducedMotion ? (
                  query && (
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setQuery('')
                          setResults([])
                        }}
                        className="h-6 w-6 p-0 hover:bg-transparent hover:text-destructive"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )
                ) : (
                  <AnimatePresence>
                    {query && (
                      <motion.div {...ANIMATION_PRESETS.pop}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setQuery('')
                            setResults([])
                          }}
                          className="h-6 w-6 p-0 hover:bg-transparent hover:text-destructive"
                        >
                          <XIcon className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* History button */}
                {showHistory && (
                  <SearchHistoryPanel
                    searchHistory={searchHistory}
                    isOpen={showHistoryPanel}
                    onOpenChange={setShowHistoryPanel}
                    onSelectEntry={(historyQuery) => {
                      setQuery(historyQuery)
                      setShowHistoryPanel(false)
                    }}
                    onClearHistory={clearHistory}
                  />
                )}

                {/* Config button */}
                {showConfig && (
                  <SearchConfigPanel
                    config={localConfig}
                    isOpen={showConfigPanel}
                    onOpenChange={setShowConfigPanel}
                    onConfigChange={setLocalConfig}
                  />
                )}
              </div>
            </div>

            {/* Progress bar */}
            {prefersReducedMotion ? (
              isSearching && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden rounded-b-md">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 w-full" />
                </div>
              )
            ) : (
              <AnimatePresence>
                {isSearching && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden rounded-b-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
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

          {/* Query expansion preview */}
          {prefersReducedMotion ? (
            localConfig.queryExpansion &&
            expandedQueries.length > 1 &&
            query && (
              <div>
                <button
                  onClick={() => setShowExpansions(!showExpansions)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <WandIcon className="h-3 w-3" />
                  {showExpansions ? 'Hide' : 'Show'} related terms (
                  {expandedQueries.length - 1})
                  {showExpansions ? (
                    <ChevronUpIcon className="h-3 w-3" />
                  ) : (
                    <ChevronDownIcon className="h-3 w-3" />
                  )}
                </button>
                {showExpansions && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {expandedQueries.slice(1).map((term, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {term}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )
          ) : (
            <AnimatePresence>
              {localConfig.queryExpansion &&
                expandedQueries.length > 1 &&
                query && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <button
                      onClick={() => setShowExpansions(!showExpansions)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <WandIcon className="h-3 w-3" />
                      {showExpansions ? 'Hide' : 'Show'} related terms (
                      {expandedQueries.length - 1})
                      {showExpansions ? (
                        <ChevronUpIcon className="h-3 w-3" />
                      ) : (
                        <ChevronDownIcon className="h-3 w-3" />
                      )}
                    </button>
                    <AnimatePresence>
                      {showExpansions && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 flex flex-wrap gap-1"
                        >
                          {expandedQueries.slice(1).map((term, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {term}
                            </Badge>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
            </AnimatePresence>
          )}

          {error && (
            <motion.div
              {...ANIMATION_PRESETS.slideDown}
              viewport={{ once: true }}
              className="text-sm text-destructive flex items-center gap-2"
            >
              <XIcon className="h-4 w-4" />
              {error}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {prefersReducedMotion ? (
        <>
          {isSearching ? (
            <div key="loading">
              <Card className="shadow-sm">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full border-3 border-violet-500/30 border-t-violet-500 animate-spin" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Analyzing semantic meaning...
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : results.length > 0 ? (
            <div key="results" className="space-y-3">
              {/* Results header */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                  Found{' '}
                  <span className="font-semibold text-foreground">
                    {results.length}
                  </span>{' '}
                  semantically relevant messages
                </span>
              </div>

              {/* Result cards */}
              {results.map((result, index) => (
                <SearchResultCard
                  key={result.message.id}
                  result={result}
                  isExpanded={expandedResults.has(result.message.id)}
                  isCopied={copiedId === result.message.id}
                  index={index}
                  onSelect={onResultSelect}
                  onCopy={handleCopy}
                  onToggleExpand={toggleExpanded}
                  animated={false}
                />
              ))}
            </div>
          ) : query && !isSearching ? (
            <div key="no-results">
              <Card className="shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <SearchIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Results Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    No messages match your search "{query}"
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery('')}
                    >
                      Clear Search
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          similarityThreshold: Math.max(
                            0.3,
                            (prev.similarityThreshold || 0.6) - 0.1
                          ),
                        }))
                      }
                    >
                      Lower Threshold
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </>
      ) : (
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div key="loading" {...ANIMATION_PRESETS.slideUp}>
              <Card className="shadow-sm">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <motion.div
                    className="h-12 w-12 rounded-full border-3 border-violet-500/30 border-t-violet-500"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: durations.slower,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <motion.p
                    className="mt-4 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Analyzing semantic meaning...
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              {...ANIMATION_PRESETS.slideUp}
              className="space-y-3"
            >
              {/* Results header */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <motion.span
                    className="inline-block w-2 h-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: durations.slower,
                      repeat: Infinity,
                    }}
                  />
                  Found{' '}
                  <span className="font-semibold text-foreground">
                    {results.length}
                  </span>{' '}
                  semantically relevant messages
                </span>
              </div>

              {/* Result cards */}
              {results.map((result, index) => (
                <SearchResultCard
                  key={result.message.id}
                  result={result}
                  isExpanded={expandedResults.has(result.message.id)}
                  isCopied={copiedId === result.message.id}
                  index={index}
                  onSelect={onResultSelect}
                  onCopy={handleCopy}
                  onToggleExpand={toggleExpanded}
                  animated={!prefersReducedMotion}
                />
              ))}
            </motion.div>
          ) : query && !isSearching ? (
            <motion.div key="no-results" {...ANIMATION_PRESETS.slideUp}>
              <Card className="shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <SearchIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Results Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    No messages match your search "{query}"
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery('')}
                    >
                      Clear Search
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          similarityThreshold: Math.max(
                            0.3,
                            (prev.similarityThreshold || 0.6) - 0.1
                          ),
                        }))
                      }
                    >
                      Lower Threshold
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  )
}

SemanticMessageSearch.displayName = 'SemanticMessageSearch'
