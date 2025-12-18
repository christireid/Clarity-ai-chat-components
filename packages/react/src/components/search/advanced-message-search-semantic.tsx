'use client'

import { logger } from '@clarity-chat/utils/logger'

import * as React from 'react'
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
  Settings2,
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
const SettingsIcon = Settings2 as React.ComponentType<{ className?: string }>
const SlidersIcon = Sliders as React.ComponentType<{ className?: string }>
const TargetIcon = Target as React.ComponentType<{ className?: string }>
const WandIcon = Wand2 as React.ComponentType<{ className?: string }>

/**
 * Embedding provider configuration
 */
export interface EmbeddingProvider {
  type: 'openai' | 'cohere' | 'huggingface' | 'local' | 'custom'
  model: string
  apiKey?: string
  endpoint?: string
}

/**
 * Semantic search configuration
 */
export interface SemanticSearchConfig {
  /** Embedding provider for vectorization */
  embeddings: EmbeddingProvider
  /** Hybrid search configuration */
  hybrid: {
    enabled: boolean
    /** Weight for semantic search (0-1), remainder is keyword */
    semanticWeight: number
  }
  /** Reranking configuration */
  reranking?: {
    enabled: boolean
    provider: 'cohere' | 'jina' | 'custom'
    apiKey?: string
    endpoint?: string
  }
  /** Multi-language support */
  multiLanguage?: boolean
  /** Query expansion with synonyms */
  queryExpansion?: boolean
  /** Maximum results to return */
  maxResults?: number
  /** Minimum similarity threshold (0-1) */
  similarityThreshold?: number
}

/**
 * Search result with relevance score
 */
export interface SemanticSearchResult {
  message: Message
  score: number
  highlights?: string[]
  matchType: 'semantic' | 'keyword' | 'hybrid'
  explanation?: string
}

/**
 * Props for SemanticMessageSearch
 */
export interface SemanticMessageSearchProps {
  /** Messages to search through */
  messages: Message[]
  /** Search configuration */
  config?: Partial<SemanticSearchConfig>
  /** Callback when results are found */
  onResultsFound?: (results: SemanticSearchResult[]) => void
  /** Callback when a result is selected */
  onResultSelect?: (result: SemanticSearchResult) => void
  /** Callback for custom embedding generation */
  onGenerateEmbedding?: (text: string) => Promise<number[]>
  /** Callback for custom reranking */
  onRerank?: (
    query: string,
    results: SemanticSearchResult[]
  ) => Promise<SemanticSearchResult[]>
  /** Show search history */
  showHistory?: boolean
  /** Show configuration panel */
  showConfig?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Compact mode */
  compact?: boolean
  className?: string
}

/**
 * Search history entry
 */
interface SearchHistoryEntry {
  query: string
  timestamp: number
  resultCount: number
}

const defaultConfig: SemanticSearchConfig = {
  embeddings: {
    type: 'openai',
    model: 'text-embedding-3-small',
  },
  hybrid: {
    enabled: true,
    semanticWeight: 0.7,
  },
  reranking: {
    enabled: false,
    provider: 'cohere',
  },
  multiLanguage: true,
  queryExpansion: true,
  maxResults: 10,
  similarityThreshold: 0.6,
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    const ai = a[i]!
    const bi = b[i]!
    dotProduct += ai * bi
    normA += ai * ai
    normB += bi * bi
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  return denominator === 0 ? 0 : dotProduct / denominator
}

/**
 * Escape special regex characters to prevent ReDoS
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Simple keyword search with TF-IDF-like scoring
 */
function keywordSearch(
  query: string,
  messages: Message[]
): Map<string, number> {
  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2)
  const scores = new Map<string, number>()
  const queryLower = query.toLowerCase()

  messages.forEach((message) => {
    const content = message.content.toLowerCase()
    let score = 0

    queryTerms.forEach((term) => {
      // Escape special regex characters to prevent ReDoS
      const escapedTerm = escapeRegex(term)
      const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi')
      const matches = content.match(regex)
      if (matches) {
        score += Math.log(1 + matches.length)
      }

      if (content.includes(queryLower)) {
        score += 5
      }
    })

    if (score > 0) {
      scores.set(message.id, score)
    }
  })

  return scores
}

/**
 * Expand query with synonyms and related terms
 */
function expandQuery(query: string): string[] {
  const synonyms: Record<string, string[]> = {
    error: ['bug', 'issue', 'problem', 'failure', 'exception', 'crash'],
    fix: ['solve', 'repair', 'correct', 'patch', 'resolve', 'debug'],
    code: ['function', 'script', 'program', 'implementation', 'snippet'],
    explain: ['describe', 'clarify', 'elaborate', 'detail', 'break down'],
    help: ['assist', 'support', 'aid', 'guide', 'show'],
    create: ['make', 'build', 'generate', 'construct', 'develop'],
    improve: ['enhance', 'optimize', 'refactor', 'upgrade', 'better'],
    remove: ['delete', 'eliminate', 'drop', 'clear', 'purge'],
    add: ['include', 'insert', 'append', 'attach', 'incorporate'],
    update: ['modify', 'change', 'edit', 'alter', 'revise'],
  }

  const expansions = [query]
  const terms = query.toLowerCase().split(/\s+/)

  terms.forEach((term) => {
    if (synonyms[term]) {
      expansions.push(...synonyms[term])
    }
  })

  return [...new Set(expansions)]
}

/**
 * Get match quality label
 */
function getMatchQuality(score: number): {
  label: string
  color: string
  icon: React.ReactNode
} {
  if (score >= 0.9) {
    return {
      label: 'Excellent',
      color: 'bg-green-500',
      icon: <TargetIcon className="h-3 w-3" />,
    }
  } else if (score >= 0.8) {
    return {
      label: 'Very Good',
      color: 'bg-emerald-500',
      icon: <TrendingIcon className="h-3 w-3" />,
    }
  } else if (score >= 0.7) {
    return {
      label: 'Good',
      color: 'bg-blue-500',
      icon: <CheckIcon className="h-3 w-3" />,
    }
  } else if (score >= 0.6) {
    return {
      label: 'Fair',
      color: 'bg-yellow-500',
      icon: <LightbulbIcon className="h-3 w-3" />,
    }
  }
  return {
    label: 'Partial',
    color: 'bg-orange-500',
    icon: <SearchIcon className="h-3 w-3" />,
  }
}

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
  const [expandedQueries, setExpandedQueries] = React.useState<string[]>([])
  const [showExpansions, setShowExpansions] = React.useState(false)
  const [showHistoryPanel, setShowHistoryPanel] = React.useState(false)
  const [showConfigPanel, setShowConfigPanel] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [expandedResults, setExpandedResults] = React.useState<Set<string>>(
    new Set()
  )
  const [localConfig, setLocalConfig] = React.useState(config)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const searchAbortRef = React.useRef<AbortController | null>(null)
  const isMountedRef = React.useRef(true)
  const onResultsFoundRef = React.useRef(onResultsFound)

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

  // Cache for message embeddings
  const embeddingsCache = React.useRef<Map<string, number[]>>(new Map())

  // Load history from localStorage with validation
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const history = localStorage.getItem('clarity-semantic-search-history')
      if (history) {
        const parsed = JSON.parse(history)
        // Validate history structure
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (h: unknown) =>
              typeof h === 'object' &&
              h !== null &&
              'query' in h &&
              'timestamp' in h &&
              'resultCount' in h &&
              typeof (h as SearchHistoryEntry).query === 'string' &&
              typeof (h as SearchHistoryEntry).timestamp === 'number' &&
              typeof (h as SearchHistoryEntry).resultCount === 'number'
          )
        ) {
          setSearchHistory(parsed)
        }
      }
    } catch {
      // Silently fail - invalid data will use defaults
    }
  }, [])

  /**
   * Generate embedding for text
   */
  const generateEmbedding = React.useCallback(
    async (text: string): Promise<number[]> => {
      if (embeddingsCache.current.has(text)) {
        return embeddingsCache.current.get(text)!
      }

      if (onGenerateEmbedding) {
        const embedding = await onGenerateEmbedding(text)
        embeddingsCache.current.set(text, embedding)
        return embedding
      }

      // Fallback: generate simple bag-of-words embedding
      const words = text.toLowerCase().split(/\s+/)
      const embedding = new Array(384).fill(0)

      words.forEach((word) => {
        const hash = word.split('').reduce((acc, char) => {
          return ((acc << 5) - acc + char.charCodeAt(0)) | 0
        }, 0)
        const position = Math.abs(hash) % embedding.length
        embedding[position] += 1
      })

      const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
      const normalized = embedding.map((val) => val / (norm || 1))

      embeddingsCache.current.set(text, normalized)
      return normalized
    },
    [onGenerateEmbedding]
  )

  /**
   * Perform semantic search
   */
  const performSemanticSearch = React.useCallback(
    async (searchQuery: string): Promise<SemanticSearchResult[]> => {
      const queries = localConfig.queryExpansion
        ? expandQuery(searchQuery)
        : [searchQuery]

      setExpandedQueries(queries)

      const primaryQuery = queries[0] ?? searchQuery
      const queryEmbedding = await generateEmbedding(primaryQuery)

      const semanticScores = new Map<string, number>()

      for (const message of messages) {
        const messageEmbedding = await generateEmbedding(message.content)
        const similarity = cosineSimilarity(queryEmbedding, messageEmbedding)
        semanticScores.set(message.id, similarity)
      }

      const keywordScores = keywordSearch(searchQuery, messages)

      const combinedResults: SemanticSearchResult[] = []

      messages.forEach((message) => {
        const semanticScore = semanticScores.get(message.id) || 0
        const keywordScore = keywordScores.get(message.id) || 0

        let finalScore = 0
        let matchType: 'semantic' | 'keyword' | 'hybrid' = 'semantic'

        if (localConfig.hybrid.enabled) {
          const normalizedKeywordScore = Math.min(keywordScore / 10, 1)

          finalScore =
            localConfig.hybrid.semanticWeight * semanticScore +
            (1 - localConfig.hybrid.semanticWeight) * normalizedKeywordScore

          matchType = 'hybrid'
        } else {
          finalScore = semanticScore
        }

        if (finalScore >= (localConfig.similarityThreshold || 0.6)) {
          const highlights: string[] = []
          const content = message.content
          const queryTerms = searchQuery.toLowerCase().split(/\s+/)

          queryTerms.forEach((term) => {
            if (term.length < 3) return
            // Escape special regex characters to prevent ReDoS
            const escapedTerm = escapeRegex(term)
            const regex = new RegExp(`(.{0,40})(${escapedTerm})(.{0,40})`, 'gi')
            const match = content.match(regex)
            if (match && match[0]) {
              highlights.push(match[0])
            }
          })

          combinedResults.push({
            message,
            score: finalScore,
            highlights: highlights.slice(0, 3),
            matchType,
            explanation: `${Math.round(finalScore * 100)}% relevance`,
          })
        }
      })

      combinedResults.sort((a, b) => b.score - a.score)

      return combinedResults.slice(0, localConfig.maxResults || 10)
    },
    [messages, localConfig, generateEmbedding]
  )

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
        let searchResults = await performSemanticSearch(searchQuery)

        // Check if component is still mounted and search wasn't aborted
        if (!isMountedRef.current || searchAbortRef.current?.signal.aborted) {
          return
        }

        if (localConfig.reranking?.enabled && onRerank) {
          searchResults = await onRerank(searchQuery, searchResults)
          // Check again after reranking
          if (!isMountedRef.current || searchAbortRef.current?.signal.aborted) {
            return
          }
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

        logger.error('Search error:', err)
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        if (isMountedRef.current) {
          setIsSearching(false)
        }
      }
    },
    [performSemanticSearch, localConfig.reranking, onRerank]
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
      // Clear any existing timeout
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
                <AnimatePresence>
                  {isSearching && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="h-4 w-4 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin"
                    />
                  )}
                </AnimatePresence>

                {/* Clear button */}
                <AnimatePresence>
                  {query && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
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

                {/* History button */}
                {showHistory && (
                  <Popover
                    open={showHistoryPanel}
                    onOpenChange={setShowHistoryPanel}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-7 w-7 p-0',
                          searchHistory.length > 0 && 'text-violet-500'
                        )}
                      >
                        <ClockIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72" align="end">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            Recent Searches
                          </h4>
                          {searchHistory.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearHistory}
                              className="h-6 text-xs text-muted-foreground hover:text-destructive"
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        {searchHistory.length > 0 ? (
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {searchHistory.map((entry, index) => (
                              <motion.button
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => {
                                  setQuery(entry.query)
                                  setShowHistoryPanel(false)
                                }}
                                className="w-full text-left px-2 py-1.5 rounded hover:bg-accent flex items-center justify-between"
                              >
                                <span className="text-sm truncate">
                                  {entry.query}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {entry.resultCount}
                                </Badge>
                              </motion.button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No recent searches
                          </p>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {/* Config button */}
                {showConfig && (
                  <Popover
                    open={showConfigPanel}
                    onOpenChange={setShowConfigPanel}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <SlidersIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4" />
                          Search Settings
                        </h4>

                        {/* Semantic weight slider */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-muted-foreground">
                              Semantic Weight
                            </label>
                            <span className="text-sm font-medium">
                              {Math.round(
                                localConfig.hybrid.semanticWeight * 100
                              )}
                              %
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={localConfig.hybrid.semanticWeight * 100}
                            onChange={(e) =>
                              setLocalConfig((prev) => ({
                                ...prev,
                                hybrid: {
                                  ...prev.hybrid,
                                  semanticWeight:
                                    parseInt(e.target.value) / 100,
                                },
                              }))
                            }
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Keyword</span>
                            <span>Semantic</span>
                          </div>
                        </div>

                        {/* Similarity threshold */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-muted-foreground">
                              Min Similarity
                            </label>
                            <span className="text-sm font-medium">
                              {Math.round(
                                (localConfig.similarityThreshold || 0.6) * 100
                              )}
                              %
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={
                              (localConfig.similarityThreshold || 0.6) * 100
                            }
                            onChange={(e) =>
                              setLocalConfig((prev) => ({
                                ...prev,
                                similarityThreshold:
                                  parseInt(e.target.value) / 100,
                              }))
                            }
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
                          />
                        </div>

                        {/* Max results */}
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">
                            Max Results
                          </label>
                          <Input
                            type="number"
                            min="1"
                            max="50"
                            value={localConfig.maxResults || 10}
                            onChange={(e) =>
                              setLocalConfig((prev) => ({
                                ...prev,
                                maxResults: parseInt(e.target.value) || 10,
                              }))
                            }
                            className="h-8"
                          />
                        </div>

                        {/* Toggle options */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={localConfig.queryExpansion}
                              onChange={(e) =>
                                setLocalConfig((prev) => ({
                                  ...prev,
                                  queryExpansion: e.target.checked,
                                }))
                              }
                              className="rounded"
                            />
                            <span className="text-sm">Query Expansion</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={localConfig.hybrid.enabled}
                              onChange={(e) =>
                                setLocalConfig((prev) => ({
                                  ...prev,
                                  hybrid: {
                                    ...prev.hybrid,
                                    enabled: e.target.checked,
                                  },
                                }))
                              }
                              className="rounded"
                            />
                            <span className="text-sm">Hybrid Search</span>
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
          </div>

          {/* Query expansion preview */}
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
                          <Badge key={i} variant="outline" className="text-xs">
                            {term}
                          </Badge>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive flex items-center gap-2"
            >
              <XIcon className="h-4 w-4" />
              {error}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {/* Results header */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <motion.span
                  className="inline-block w-2 h-2 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: durations.slower, repeat: Infinity }}
                />
                Found{' '}
                <span className="font-semibold text-foreground">
                  {results.length}
                </span>{' '}
                semantically relevant messages
              </span>
            </div>

            {/* Result cards */}
            {results.map((result, index) => {
              const quality = getMatchQuality(result.score)
              const isExpanded = expandedResults.has(result.message.id)

              return (
                <motion.div
                  key={result.message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={cn(
                      'shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden',
                      'border-l-4',
                      result.score >= 0.9
                        ? 'border-l-green-500'
                        : result.score >= 0.8
                          ? 'border-l-emerald-500'
                          : result.score >= 0.7
                            ? 'border-l-blue-500'
                            : result.score >= 0.6
                              ? 'border-l-yellow-500'
                              : 'border-l-orange-500'
                    )}
                    onClick={() => onResultSelect?.(result)}
                  >
                    <CardContent className="p-4">
                      {/* Result header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Score badge */}
                          <Badge
                            className={cn(
                              'text-xs gap-1 text-white',
                              quality.color
                            )}
                          >
                            {quality.icon}
                            {Math.round(result.score * 100)}%
                          </Badge>

                          {/* Match type badge */}
                          <Badge variant="outline" className="text-xs gap-1">
                            {result.matchType === 'semantic' && (
                              <BrainIcon className="h-3 w-3" />
                            )}
                            {result.matchType === 'keyword' && (
                              <SearchIcon className="h-3 w-3" />
                            )}
                            {result.matchType === 'hybrid' && (
                              <ZapIcon className="h-3 w-3" />
                            )}
                            {result.matchType}
                          </Badge>

                          {/* Role badge */}
                          <Badge variant="secondary" className="text-xs">
                            {result.message.role}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopy(result)
                            }}
                            className="h-7 w-7 p-0"
                          >
                            {copiedId === result.message.id ? (
                              <CheckIcon className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <CopyIcon className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleExpanded(result.message.id)
                            }}
                            className="h-7 w-7 p-0"
                          >
                            {isExpanded ? (
                              <EyeOffIcon className="h-3.5 w-3.5" />
                            ) : (
                              <EyeIcon className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Content preview */}
                      <div
                        className={cn(
                          'text-sm mb-2',
                          !isExpanded && 'line-clamp-2'
                        )}
                      >
                        {result.message.content}
                      </div>

                      {/* Highlights */}
                      {result.highlights && result.highlights.length > 0 && (
                        <div className="space-y-1 mt-3">
                          {result.highlights.map((highlight, i) => (
                            <div
                              key={i}
                              className="text-xs bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded"
                            >
                              ...{highlight}...
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quality indicator */}
                      <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {quality.icon}
                          {quality.label} match
                        </span>
                        <span>{result.explanation}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        ) : query && !isSearching ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
    </div>
  )
}

SemanticMessageSearch.displayName = 'SemanticMessageSearch'
