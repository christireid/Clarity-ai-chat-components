'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  cn,
  useReducedMotion,
} from '@clarity-chat/primitives'
import { Search, X } from 'lucide-react'
import {
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../../animations/constants'

import type { SemanticMessageSearchProps, SemanticSearchResult } from './types'
import { defaultConfig, STORAGE_KEYS } from './config'
import { useSemanticSearch } from './hooks'
import {
  SemanticSearchHeader,
  SemanticSearchInput,
  SemanticSearchResultCard as ResultCard,
  SemanticConfigPanel,
  QueryExpansionPreview,
  SemanticSearchHistory,
} from './components'
import type { SearchHistoryEntry } from '../shared/types'
import { storage, isValidSearchHistory } from '../shared/utils'

// Type assertions for icons
const SearchIcon = Search as React.ComponentType<{ className?: string }>
const XIcon = X as React.ComponentType<{ className?: string }>

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
  const prefersReducedMotion = useReducedMotion()
  const config = React.useMemo(
    () => ({ ...defaultConfig, ...userConfig }),
    [userConfig]
  )

  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SemanticSearchResult[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [searchHistory, setSearchHistory] = React.useState<
    SearchHistoryEntry[]
  >([])
  const [localConfig, setLocalConfig] = React.useState(config)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [expandedResults, setExpandedResults] = React.useState<Set<string>>(
    new Set()
  )

  const inputRef = React.useRef<HTMLInputElement>(null)
  const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const searchAbortRef = React.useRef<AbortController | null>(null)
  const isMountedRef = React.useRef(true)
  const onResultsFoundRef = React.useRef(onResultsFound)

  // Semantic search hook
  const { performSearch, expandedQueries } = useSemanticSearch({
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

  // Load history from storage
  React.useEffect(() => {
    const history = storage.get<SearchHistoryEntry[]>(STORAGE_KEYS.HISTORY)
    if (history && isValidSearchHistory(history)) {
      setSearchHistory(history)
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
          storage.set(STORAGE_KEYS.HISTORY, newHistory)
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

  // Copy result content with timeout cleanup
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
    storage.remove(STORAGE_KEYS.HISTORY)
  }, [])

  return (
    <div className={cn('space-y-4 backdrop-blur-md backdrop-saturate-150 bg-white/60 dark:bg-background/60 border border-glass-light dark:border-glass-dark-light rounded-lg p-4 bg-glass-pastel-blue-medium dark:bg-glass-pastel-blue-dark-medium shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]', className)}>
      {/* Search Header */}
      <Card
        className={cn(
          'shadow-sm overflow-hidden backdrop-blur-sm bg-transparent border-glass-light dark:border-glass-dark-light',
          compact && 'shadow-none border-0'
        )}
      >
        <SemanticSearchHeader config={localConfig} compact={compact} />

        <CardContent className={cn('space-y-3', compact && 'p-0')}>
          {/* Search Input */}
          <SemanticSearchInput
            ref={inputRef}
            query={query}
            onQueryChange={setQuery}
            placeholder={placeholder}
            isSearching={isSearching}
            compact={compact}
          >
            {/* History button */}
            {showHistory && (
              <SemanticSearchHistory
                history={searchHistory}
                onSelectQuery={setQuery}
                onClearHistory={clearHistory}
              />
            )}

            {/* Config button */}
            {showConfig && (
              <SemanticConfigPanel
                config={localConfig}
                onConfigChange={setLocalConfig}
              />
            )}
          </SemanticSearchInput>

          {/* Query expansion preview */}
          <QueryExpansionPreview
            queries={expandedQueries}
            query={query}
            enabled={localConfig.queryExpansion || false}
          />

          {/* Error display */}
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
        <div>
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
                <ResultCard
                  key={result.message.id}
                  result={result}
                  index={index}
                  isExpanded={expandedResults.has(result.message.id)}
                  isCopied={copiedId === result.message.id}
                  onExpand={() => toggleExpanded(result.message.id)}
                  onCopy={() => handleCopy(result)}
                  onSelect={() => onResultSelect?.(result)}
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
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="loading"
              {...ANIMATION_PRESETS.slideUp}
              viewport={{ once: true }}
            >
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
              viewport={{ once: true }}
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
                <ResultCard
                  key={result.message.id}
                  result={result}
                  index={index}
                  isExpanded={expandedResults.has(result.message.id)}
                  isCopied={copiedId === result.message.id}
                  onExpand={() => toggleExpanded(result.message.id)}
                  onCopy={() => handleCopy(result)}
                  onSelect={() => onResultSelect?.(result)}
                />
              ))}
            </motion.div>
          ) : query && !isSearching ? (
            <motion.div
              key="no-results"
              {...ANIMATION_PRESETS.slideUp}
              viewport={{ once: true }}
            >
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
