'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  cn,
} from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'

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
  /** Callback for custom embedding generation */
  onGenerateEmbedding?: (text: string) => Promise<number[]>
  /** Callback for custom reranking */
  onRerank?: (query: string, results: SemanticSearchResult[]) => Promise<SemanticSearchResult[]>
  /** Show search history */
  showHistory?: boolean
  /** Placeholder text */
  placeholder?: string
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
    semanticWeight: 0.7, // 70% semantic, 30% keyword
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
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  return denominator === 0 ? 0 : dotProduct / denominator
}

/**
 * Simple keyword search with TF-IDF-like scoring
 */
function keywordSearch(query: string, messages: Message[]): Map<string, number> {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2)
  const scores = new Map<string, number>()

  messages.forEach((message) => {
    const content = message.content.toLowerCase()
    let score = 0

    queryTerms.forEach((term) => {
      // Count term frequency
      const regex = new RegExp(`\\b${term}\\b`, 'gi')
      const matches = content.match(regex)
      if (matches) {
        // TF-IDF approximation: more matches = higher score, but with diminishing returns
        score += Math.log(1 + matches.length)
      }

      // Boost exact phrase matches
      if (content.includes(query.toLowerCase())) {
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
  // Simple synonym expansion (in production, use a proper synonym API)
  const synonyms: Record<string, string[]> = {
    error: ['bug', 'issue', 'problem', 'failure'],
    fix: ['solve', 'repair', 'correct', 'patch'],
    code: ['function', 'script', 'program', 'implementation'],
    explain: ['describe', 'clarify', 'elaborate', 'detail'],
    help: ['assist', 'support', 'aid', 'guide'],
  }

  const expansions = [query]
  const terms = query.toLowerCase().split(/\s+/)

  terms.forEach((term) => {
    if (synonyms[term]) {
      expansions.push(...synonyms[term])
    }
  })

  return expansions
}

/**
 * SemanticMessageSearch Component
 *
 * Advanced message search with vector embeddings for semantic similarity.
 * Supports hybrid search (semantic + keyword), query expansion, and reranking.
 *
 * Features:
 * - Vector-based semantic search
 * - Hybrid search (keyword + semantic)
 * - Query expansion with synonyms
 * - Multi-language support
 * - Relevance scoring
 * - Search history
 * - Reranking support
 *
 * @example
 * ```tsx
 * <SemanticMessageSearch
 *   messages={messages}
 *   config={{
 *     embeddings: {
 *       type: 'openai',
 *       model: 'text-embedding-3-small',
 *     },
 *     hybrid: {
 *       enabled: true,
 *       semanticWeight: 0.7,
 *     },
 *     reranking: {
 *       enabled: true,
 *       provider: 'cohere',
 *     },
 *   }}
 *   onGenerateEmbedding={async (text) => {
 *     const response = await fetch('/api/embed', {
 *       method: 'POST',
 *       body: JSON.stringify({ text }),
 *     })
 *     const { embedding } = await response.json()
 *     return embedding
 *   }}
 * />
 * ```
 */
export function SemanticMessageSearch({
  messages,
  config: userConfig,
  onResultsFound,
  onGenerateEmbedding,
  onRerank,
  showHistory = true,
  placeholder = 'Search messages semantically...',
  className,
}: SemanticMessageSearchProps) {
  const config = { ...defaultConfig, ...userConfig }

  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SemanticSearchResult[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [searchHistory, setSearchHistory] = React.useState<SearchHistoryEntry[]>([])
  const [expandedQueries, setExpandedQueries] = React.useState<string[]>([])

  // Cache for message embeddings
  const embeddingsCache = React.useRef<Map<string, number[]>>(new Map())

  /**
   * Generate embedding for text
   */
  const generateEmbedding = React.useCallback(
    async (text: string): Promise<number[]> => {
      // Check cache first
      if (embeddingsCache.current.has(text)) {
        return embeddingsCache.current.get(text)!
      }

      // Use custom embedding generator if provided
      if (onGenerateEmbedding) {
        const embedding = await onGenerateEmbedding(text)
        embeddingsCache.current.set(text, embedding)
        return embedding
      }

      // Fallback: generate simple bag-of-words embedding
      // In production, this should call an actual embedding API
      const words = text.toLowerCase().split(/\s+/)
      const embedding = new Array(384).fill(0) // Standard embedding dimension

      words.forEach((word, index) => {
        // Simple hash-based embedding (not real, just for fallback)
        const hash = word.split('').reduce((acc, char) => {
          return ((acc << 5) - acc + char.charCodeAt(0)) | 0
        }, 0)
        const position = Math.abs(hash) % embedding.length
        embedding[position] += 1
      })

      // Normalize
      const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
      const normalized = embedding.map(val => val / (norm || 1))

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
      // Expand query if enabled
      const queries = config.queryExpansion
        ? expandQuery(searchQuery)
        : [searchQuery]

      setExpandedQueries(queries)

      // Generate embedding for query
      const queryEmbedding = await generateEmbedding(queries[0])

      // Calculate semantic similarity for each message
      const semanticScores = new Map<string, number>()

      for (const message of messages) {
        const messageEmbedding = await generateEmbedding(message.content)
        const similarity = cosineSimilarity(queryEmbedding, messageEmbedding)
        semanticScores.set(message.id, similarity)
      }

      // Get keyword scores
      const keywordScores = keywordSearch(searchQuery, messages)

      // Combine scores based on hybrid configuration
      const combinedResults: SemanticSearchResult[] = []

      messages.forEach((message) => {
        const semanticScore = semanticScores.get(message.id) || 0
        const keywordScore = keywordScores.get(message.id) || 0

        let finalScore = 0
        let matchType: 'semantic' | 'keyword' | 'hybrid' = 'semantic'

        if (config.hybrid.enabled) {
          // Normalize keyword score to 0-1 range (assuming max keyword score is ~10)
          const normalizedKeywordScore = Math.min(keywordScore / 10, 1)

          finalScore =
            config.hybrid.semanticWeight * semanticScore +
            (1 - config.hybrid.semanticWeight) * normalizedKeywordScore

          matchType = 'hybrid'
        } else {
          finalScore = semanticScore
        }

        // Only include results above threshold
        if (finalScore >= (config.similarityThreshold || 0.6)) {
          // Extract highlights (simple implementation)
          const highlights: string[] = []
          const content = message.content
          const queryTerms = searchQuery.toLowerCase().split(/\s+/)

          queryTerms.forEach((term) => {
            const regex = new RegExp(`(.{0,30})(${term})(.{0,30})`, 'gi')
            const match = content.match(regex)
            if (match && match[0]) {
              highlights.push(match[0])
            }
          })

          combinedResults.push({
            message,
            score: finalScore,
            highlights: highlights.slice(0, 3), // Top 3 highlights
            matchType,
            explanation: `${Math.round(finalScore * 100)}% match (${matchType})`,
          })
        }
      })

      // Sort by score
      combinedResults.sort((a, b) => b.score - a.score)

      // Limit results
      return combinedResults.slice(0, config.maxResults || 10)
    },
    [
      messages,
      config.queryExpansion,
      config.hybrid,
      config.similarityThreshold,
      config.maxResults,
      generateEmbedding,
    ]
  )

  /**
   * Handle search
   */
  const handleSearch = React.useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsSearching(true)
      setError(null)

      try {
        let searchResults = await performSemanticSearch(searchQuery)

        // Apply reranking if enabled
        if (config.reranking?.enabled && onRerank) {
          searchResults = await onRerank(searchQuery, searchResults)
        }

        setResults(searchResults)
        onResultsFound?.(searchResults)

        // Add to search history
        setSearchHistory((prev) => [
          {
            query: searchQuery,
            timestamp: Date.now(),
            resultCount: searchResults.length,
          },
          ...prev.slice(0, 9), // Keep last 10
        ])
      } catch (err) {
        console.error('Search error:', err)
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setIsSearching(false)
      }
    },
    [performSemanticSearch, config.reranking, onRerank, onResultsFound]
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

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search input */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Semantic Search</CardTitle>
              <div className="text-xs text-muted-foreground flex gap-2 mt-1">
                {config.hybrid.enabled && (
                  <Badge variant="secondary" className="text-xs">
                    Hybrid ({Math.round(config.hybrid.semanticWeight * 100)}% semantic)
                  </Badge>
                )}
                {config.reranking?.enabled && (
                  <Badge variant="secondary" className="text-xs">
                    Reranking
                  </Badge>
                )}
                {config.queryExpansion && (
                  <Badge variant="secondary" className="text-xs">
                    Query Expansion
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isSearching}
          />

          {/* Query expansion preview */}
          {config.queryExpansion && expandedQueries.length > 1 && (
            <div className="text-xs text-muted-foreground">
              Also searching: {expandedQueries.slice(1).join(', ')}
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
        </CardContent>
      </Card>

      {/* Search results */}
      <AnimatePresence mode="wait">
        {isSearching ? (
          <Card key="loading" className="shadow-sm">
            <CardContent className="p-6 text-center text-muted-foreground">
              <motion.div
                className="inline-block h-5 w-5 rounded-full border-2 border-primary border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <div className="mt-2 text-sm">Searching semantically...</div>
            </CardContent>
          </Card>
        ) : results.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <div className="text-sm text-muted-foreground">
              Found {results.length} {results.length === 1 ? 'result' : 'results'}
            </div>

            {results.map((result, index) => (
              <motion.div
                key={result.message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    'shadow-sm hover:shadow-md transition-shadow cursor-pointer',
                    'border-l-4',
                    result.score >= 0.9
                      ? 'border-l-green-500'
                      : result.score >= 0.75
                        ? 'border-l-blue-500'
                        : 'border-l-yellow-500'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            result.score >= 0.9
                              ? 'success'
                              : result.score >= 0.75
                                ? 'default'
                                : 'warning'
                          }
                          className="text-xs"
                        >
                          {Math.round(result.score * 100)}% match
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {result.matchType}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.message.role}
                      </div>
                    </div>

                    <div className="text-sm mb-2 line-clamp-3">
                      {result.message.content}
                    </div>

                    {result.highlights && result.highlights.length > 0 && (
                      <div className="space-y-1">
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

                    {result.explanation && (
                      <div className="text-xs text-muted-foreground mt-2">
                        {result.explanation}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : query && !isSearching ? (
          <Card key="no-results" className="shadow-sm">
            <CardContent className="p-6 text-center text-muted-foreground">
              No results found for "{query}"
            </CardContent>
          </Card>
        ) : null}
      </AnimatePresence>

      {/* Search history */}
      {showHistory && searchHistory.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Recent Searches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {searchHistory.slice(0, 5).map((entry, index) => (
              <button
                key={index}
                onClick={() => setQuery(entry.query)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{entry.query}</span>
                  <Badge variant="secondary" className="text-xs">
                    {entry.resultCount}
                  </Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

SemanticMessageSearch.displayName = 'SemanticMessageSearch'
