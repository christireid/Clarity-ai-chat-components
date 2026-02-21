'use client'

/**
 * Caching Comparison Demo
 *
 * Interactive demo showcasing three-tier cache system:
 * - Exact Match Cache: <1ms, 100% accuracy
 * - Smart Cache: <5ms, semantic similarity
 * - Semantic Cache: <50ms, contextual understanding
 *
 * Features:
 * - Waterfall visualization showing tier fallthrough
 * - Real-time latency tracking per tier
 * - Cache hit rate statistics
 * - Cost savings calculator
 * - Session-based analytics
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Zap,
  Brain,
  Search,
  TrendingUp,
  Clock,
  DollarSign,
  ChevronDown,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'

// Types
interface CacheHit {
  tier: 'exact' | 'smart' | 'semantic' | 'miss'
  query: string
  cachedQuery?: string
  similarity?: number
  latency: number
  timestamp: number
  tokensSaved: number
  costSaved: number
}

interface CacheStats {
  totalQueries: number
  exactHits: number
  smartHits: number
  semanticHits: number
  misses: number
  avgLatency: number
  totalTokensSaved: number
  totalCostSaved: number
}

interface CacheTier {
  id: 'exact' | 'smart' | 'semantic'
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  latency: string
  accuracy: string
  color: string
  bgColor: string
  borderColor: string
}

// Cache tier definitions
const cacheTiers: CacheTier[] = [
  {
    id: 'exact',
    name: 'Exact Match',
    description: 'Hash-based lookup for identical queries',
    icon: Database,
    latency: '<1ms',
    accuracy: '100%',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500',
  },
  {
    id: 'smart',
    name: 'Smart Cache',
    description: 'Embedding similarity for related queries',
    icon: Zap,
    latency: '<5ms',
    accuracy: '90-95%',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500',
  },
  {
    id: 'semantic',
    name: 'Semantic Cache',
    description: 'Contextual understanding for intent matching',
    icon: Brain,
    latency: '<50ms',
    accuracy: '80-90%',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500',
  },
]

// Simulated cache data
const sampleCachedQueries = [
  'What are the benefits of using React hooks?',
  'How do I optimize React performance?',
  'Explain useEffect in React',
  'What is TypeScript?',
  'How to use Tailwind CSS?',
]

// Simulate cache lookup with latency
function simulateCacheLookup(query: string): CacheHit {
  const normalizedQuery = query.toLowerCase().trim()

  // Exact match (hash lookup)
  const exactMatch = sampleCachedQueries.find(
    (cached) => cached.toLowerCase() === normalizedQuery
  )
  if (exactMatch) {
    return {
      tier: 'exact',
      query,
      cachedQuery: exactMatch,
      similarity: 1.0,
      latency: Math.random() * 0.5 + 0.3, // 0.3-0.8ms
      timestamp: Date.now(),
      tokensSaved: 1500,
      costSaved: 0.0075,
    }
  }

  // Smart cache (embedding similarity)
  const smartMatch = sampleCachedQueries.find((cached) => {
    const words = normalizedQuery.split(' ')
    const cachedWords = cached.toLowerCase().split(' ')
    const overlap = words.filter((w) => cachedWords.includes(w)).length
    return overlap >= Math.min(words.length, cachedWords.length) * 0.6
  })
  if (smartMatch) {
    const similarity = 0.85 + Math.random() * 0.1 // 0.85-0.95
    return {
      tier: 'smart',
      query,
      cachedQuery: smartMatch,
      similarity,
      latency: Math.random() * 2 + 2, // 2-4ms
      timestamp: Date.now(),
      tokensSaved: Math.floor(1500 * similarity),
      costSaved: 0.0075 * similarity,
    }
  }

  // Semantic cache (contextual intent)
  const semanticMatch = sampleCachedQueries.find((cached) => {
    const queryIntent = normalizedQuery.includes('how') || normalizedQuery.includes('what')
    const cachedIntent = cached.toLowerCase().includes('how') || cached.toLowerCase().includes('what')
    return queryIntent && cachedIntent
  })
  if (semanticMatch) {
    const similarity = 0.75 + Math.random() * 0.1 // 0.75-0.85
    return {
      tier: 'semantic',
      query,
      cachedQuery: semanticMatch,
      similarity,
      latency: Math.random() * 20 + 25, // 25-45ms
      timestamp: Date.now(),
      tokensSaved: Math.floor(1500 * similarity),
      costSaved: 0.0075 * similarity,
    }
  }

  // Cache miss
  return {
    tier: 'miss',
    query,
    latency: Math.random() * 50 + 150, // 150-200ms (full API call)
    timestamp: Date.now(),
    tokensSaved: 0,
    costSaved: 0,
  }
}

// Calculate statistics
function calculateStats(history: CacheHit[]): CacheStats {
  if (history.length === 0) {
    return {
      totalQueries: 0,
      exactHits: 0,
      smartHits: 0,
      semanticHits: 0,
      misses: 0,
      avgLatency: 0,
      totalTokensSaved: 0,
      totalCostSaved: 0,
    }
  }

  return {
    totalQueries: history.length,
    exactHits: history.filter((h) => h.tier === 'exact').length,
    smartHits: history.filter((h) => h.tier === 'smart').length,
    semanticHits: history.filter((h) => h.tier === 'semantic').length,
    misses: history.filter((h) => h.tier === 'miss').length,
    avgLatency: history.reduce((sum, h) => sum + h.latency, 0) / history.length,
    totalTokensSaved: history.reduce((sum, h) => sum + h.tokensSaved, 0),
    totalCostSaved: history.reduce((sum, h) => sum + h.costSaved, 0),
  }
}

export default function CachingDemoPage() {
  const [query, setQuery] = React.useState('')
  const [isSearching, setIsSearching] = React.useState(false)
  const [currentHit, setCurrentHit] = React.useState<CacheHit | null>(null)
  const [searchHistory, setSearchHistory] = React.useState<CacheHit[]>([])
  const [waterfallStep, setWaterfallStep] = React.useState<number>(0)

  const stats = calculateStats(searchHistory)
  const hitRate = stats.totalQueries > 0
    ? ((stats.exactHits + stats.smartHits + stats.semanticHits) / stats.totalQueries) * 100
    : 0

  // Simulate waterfall cache lookup
  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    setWaterfallStep(0)
    setCurrentHit(null)

    // Simulate waterfall progression
    for (let i = 0; i < 3; i++) {
      setWaterfallStep(i + 1)
      await new Promise((resolve) => setTimeout(resolve, 400))
    }

    // Perform actual lookup
    const result = simulateCacheLookup(query)
    setCurrentHit(result)
    setSearchHistory((prev) => [result, ...prev].slice(0, 20))
    setIsSearching(false)
    setWaterfallStep(0)
  }

  const resetSession = () => {
    setSearchHistory([])
    setCurrentHit(null)
    setQuery('')
  }

  const tryExample = (example: string) => {
    setQuery(example)
  }

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Database className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  Interactive Demo
                </span>
                <span className="text-xs text-muted-foreground">
                  Three-Tier Cache System
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Caching Strategy Comparison
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl">
            See how different caching tiers work together to reduce latency and costs.
            Watch queries flow through the cache waterfall from exact matching to semantic understanding.
          </p>
        </motion.header>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="p-6 rounded-lg bg-muted/30 border border-border/50">
            <label htmlFor="cache-query" className="block text-sm font-semibold mb-3">
              Enter your query
            </label>
            <div className="flex gap-3">
              <input
                id="cache-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="What are the benefits of using React hooks?"
                disabled={isSearching}
                className={cn(
                  'flex-1 px-4 py-3 rounded-lg border',
                  'bg-background text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium',
                  'bg-purple-600 text-white',
                  'hover:bg-purple-700 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center gap-2'
                )}
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search Cache
                  </>
                )}
              </button>
            </div>

            {/* Example queries */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Try examples:</p>
              <div className="flex flex-wrap gap-2">
                {sampleCachedQueries.map((example) => (
                  <button
                    key={example}
                    onClick={() => tryExample(example)}
                    className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/60 border border-border/50 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cache Waterfall Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Cache Tier Waterfall</h2>
          <div className="p-6 rounded-lg bg-muted/30 border border-border/50">
            <div className="space-y-4">
              {cacheTiers.map((tier, index) => {
                const Icon = tier.icon
                const isActive = isSearching && waterfallStep === index + 1
                const isComplete = currentHit && (
                  (tier.id === 'exact' && currentHit.tier === 'exact') ||
                  (tier.id === 'smart' && currentHit.tier === 'smart') ||
                  (tier.id === 'semantic' && currentHit.tier === 'semantic')
                )
                const isPassed = isSearching && waterfallStep > index + 1
                const isHit = currentHit?.tier === tier.id

                return (
                  <div key={tier.id}>
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.02 : 1,
                        opacity: isSearching && !isActive && !isPassed ? 0.5 : 1,
                      }}
                      className={cn(
                        'p-4 rounded-lg border-2 transition-all',
                        isHit
                          ? `${tier.bgColor} ${tier.borderColor}`
                          : 'bg-muted/20 border-border/50',
                        isActive && 'ring-2 ring-purple-500 ring-offset-2'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={cn(
                              'p-2 rounded-md',
                              isHit ? tier.bgColor : 'bg-muted/50'
                            )}
                          >
                            <Icon
                              className={cn(
                                'w-5 h-5',
                                isHit ? tier.color : 'text-muted-foreground'
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3
                                className={cn(
                                  'font-semibold text-sm',
                                  isHit ? tier.color : 'text-foreground'
                                )}
                              >
                                {tier.name}
                              </h3>
                              {isHit && (
                                <CheckCircle2 className={cn('w-4 h-4', tier.color)} />
                              )}
                              {isPassed && !isComplete && (
                                <XCircle className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {tier.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium text-muted-foreground">
                            {tier.latency}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {tier.accuracy}
                          </div>
                        </div>
                      </div>

                      {/* Hit details */}
                      <AnimatePresence>
                        {isHit && currentHit && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-border/50"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">
                                  Latency
                                </div>
                                <div className={cn('font-semibold', tier.color)}>
                                  {currentHit.latency.toFixed(2)}ms
                                </div>
                              </div>
                              {currentHit.similarity && (
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Similarity
                                  </div>
                                  <div className={cn('font-semibold', tier.color)}>
                                    {(currentHit.similarity * 100).toFixed(0)}%
                                  </div>
                                </div>
                              )}
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">
                                  Tokens Saved
                                </div>
                                <div className={cn('font-semibold', tier.color)}>
                                  {currentHit.tokensSaved.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">
                                  Cost Saved
                                </div>
                                <div className={cn('font-semibold', tier.color)}>
                                  ${currentHit.costSaved.toFixed(4)}
                                </div>
                              </div>
                            </div>
                            {currentHit.cachedQuery && (
                              <div className="mt-3">
                                <div className="text-xs text-muted-foreground mb-1">
                                  Matched with:
                                </div>
                                <div className="text-xs font-mono px-3 py-2 rounded bg-muted/50">
                                  {currentHit.cachedQuery}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Arrow between tiers */}
                    {index < cacheTiers.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 text-muted-foreground transition-opacity',
                            isSearching && waterfallStep <= index + 1 && 'opacity-30'
                          )}
                        />
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Cache Miss */}
              {currentHit?.tier === 'miss' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-red-500/10 border-2 border-red-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-red-500/20">
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-red-700 dark:text-red-300">
                        Cache Miss
                      </h3>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Full API call required
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-red-600 dark:text-red-400">
                        {currentHit.latency.toFixed(0)}ms
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Session Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Session Statistics</h2>
            {searchHistory.length > 0 && (
              <button
                onClick={resetSession}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Session
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Queries */}
            <div className="p-6 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-blue-500/10">
                  <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold">{stats.totalQueries}</div>
              </div>
              <div className="text-sm text-muted-foreground">Total Queries</div>
            </div>

            {/* Hit Rate */}
            <div className="p-6 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-emerald-500/10">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl font-bold">{hitRate.toFixed(1)}%</div>
              </div>
              <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
              {stats.totalQueries > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {stats.exactHits + stats.smartHits + stats.semanticHits} hits / {stats.misses} misses
                </div>
              )}
            </div>

            {/* Avg Latency */}
            <div className="p-6 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-purple-500/10">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold">
                  {stats.avgLatency > 0 ? stats.avgLatency.toFixed(1) : '0'}ms
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Avg Latency</div>
              {stats.avgLatency > 0 && (
                <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                  {((1 - stats.avgLatency / 150) * 100).toFixed(0)}% faster
                </div>
              )}
            </div>

            {/* Cost Savings */}
            <div className="p-6 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-amber-500/10">
                  <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-2xl font-bold">
                  ${stats.totalCostSaved.toFixed(3)}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Cost Saved</div>
              {stats.totalTokensSaved > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {stats.totalTokensSaved.toLocaleString()} tokens
                </div>
              )}
            </div>
          </div>

          {/* Hit breakdown */}
          {stats.totalQueries > 0 && (
            <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <h3 className="text-sm font-semibold mb-3">Hit Distribution</h3>
              <div className="space-y-2">
                {[
                  {
                    tier: 'Exact Match',
                    count: stats.exactHits,
                    color: 'bg-emerald-500',
                  },
                  {
                    tier: 'Smart Cache',
                    count: stats.smartHits,
                    color: 'bg-blue-500',
                  },
                  {
                    tier: 'Semantic Cache',
                    count: stats.semanticHits,
                    color: 'bg-purple-500',
                  },
                  { tier: 'Cache Miss', count: stats.misses, color: 'bg-red-500' },
                ].map((item) => {
                  const percentage = (item.count / stats.totalQueries) * 100
                  return (
                    <div key={item.tier}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          {item.tier}
                        </span>
                        <span className="text-xs font-medium">
                          {item.count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5 }}
                          className={cn('h-full', item.color)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-4">Recent Queries</h2>
            <div className="space-y-2">
              {searchHistory.slice(0, 10).map((hit, index) => {
                const tier = cacheTiers.find((t) => t.id === hit.tier)
                return (
                  <motion.div
                    key={hit.timestamp}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {hit.query}
                        </div>
                        {hit.cachedQuery && hit.query !== hit.cachedQuery && (
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" />
                            Matched: {hit.cachedQuery}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {tier && (
                          <div
                            className={cn(
                              'px-2 py-1 rounded text-xs font-medium',
                              tier.bgColor,
                              tier.color
                            )}
                          >
                            {tier.name}
                          </div>
                        )}
                        {hit.tier === 'miss' && (
                          <div className="px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400">
                            Miss
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {hit.latency.toFixed(1)}ms
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800"
        >
          <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
            How Cache Tiers Work
          </h3>
          <div className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
            <p>
              <strong>Exact Match:</strong> Uses hash-based lookup for identical queries.
              Fastest but requires perfect match.
            </p>
            <p>
              <strong>Smart Cache:</strong> Uses embedding similarity to find related queries.
              Balances speed and flexibility.
            </p>
            <p>
              <strong>Semantic Cache:</strong> Understands query intent and context.
              Slowest but most flexible.
            </p>
            <p className="mt-3">
              The waterfall approach tries each tier in order, falling through to the next
              if no match is found. This maximizes hit rate while maintaining low latency.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
