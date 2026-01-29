'use client'

/**
 * Provider Caching Demo - Anthropic Prompt Caching
 *
 * Interactive demo showcasing Anthropic's prompt caching feature:
 * - Real-time cache hit/miss visualization
 * - Cost comparison with and without caching
 * - TTL (time-to-live) tracking
 * - Savings calculation over time
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Zap,
  DollarSign,
  Clock,
  TrendingDown,
  Activity,
  CheckCircle,
  XCircle,
  BarChart3,
  RefreshCw,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

interface CacheEntry {
  id: string
  prompt: string
  cachedTokens: number
  timestamp: number
  ttl: number // in seconds
  hits: number
}

interface RequestLog {
  id: string
  timestamp: number
  prompt: string
  inputTokens: number
  cachedTokens: number
  outputTokens: number
  cacheHit: boolean
  cost: number
  costWithoutCache: number
  savings: number
}

const SAMPLE_PROMPTS = [
  {
    label: 'System Prompt (8000 tokens)',
    content:
      'You are a helpful AI assistant with extensive knowledge about React, TypeScript, and modern web development...',
    tokens: 8000,
  },
  {
    label: 'Code Documentation (5000 tokens)',
    content:
      'Here is the complete API documentation for the ChatWindow component including all props, methods, and usage examples...',
    tokens: 5000,
  },
  {
    label: 'User Context (3000 tokens)',
    content:
      'Previous conversation history with detailed technical discussions about state management, performance optimization...',
    tokens: 3000,
  },
]

// Anthropic Claude Sonnet 4 pricing (per 1M tokens)
const PRICING = {
  inputCost: 3.0,
  outputCost: 15.0,
  cachedInputCost: 0.3, // 90% discount on cached tokens
  cacheWriteCost: 3.75, // 25% premium to write to cache
}

const CACHE_TTL = 300 // 5 minutes

export default function ProviderCachingDemoPage() {
  const [cacheEntries, setCacheEntries] = React.useState<CacheEntry[]>([])
  const [requestLogs, setRequestLogs] = React.useState<RequestLog[]>([])
  const [selectedPrompt, setSelectedPrompt] = React.useState(SAMPLE_PROMPTS[0])
  const [outputTokens, setOutputTokens] = React.useState(1000)
  const [isProcessing, setIsProcessing] = React.useState(false)

  // Calculate total statistics
  const totalRequests = requestLogs.length
  const cacheHits = requestLogs.filter((r) => r.cacheHit).length
  const cacheMisses = totalRequests - cacheHits
  const hitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0
  const totalSavings = requestLogs.reduce((sum, r) => sum + r.savings, 0)
  const totalCost = requestLogs.reduce((sum, r) => sum + r.cost, 0)
  const totalCostWithoutCache = requestLogs.reduce(
    (sum, r) => sum + r.costWithoutCache,
    0
  )

  // Clean up expired cache entries
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setCacheEntries((entries) =>
        entries.filter((entry) => now - entry.timestamp < entry.ttl * 1000)
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const sendRequest = () => {
    setIsProcessing(true)

    setTimeout(() => {
      const now = Date.now()
      const promptTokens = selectedPrompt.tokens

      // Check if this prompt is in cache
      const cachedEntry = cacheEntries.find(
        (entry) =>
          entry.prompt === selectedPrompt.label &&
          now - entry.timestamp < entry.ttl * 1000
      )

      const cacheHit = !!cachedEntry
      const cachedTokens = cacheHit ? promptTokens : 0
      const inputTokensToProcess = cacheHit ? 0 : promptTokens

      // Calculate costs
      const inputCost = (inputTokensToProcess / 1_000_000) * PRICING.inputCost
      const cachedCost = (cachedTokens / 1_000_000) * PRICING.cachedInputCost
      const outputCost = (outputTokens / 1_000_000) * PRICING.outputCost
      const cacheWriteCost = cacheHit
        ? 0
        : (promptTokens / 1_000_000) * PRICING.cacheWriteCost

      const cost = inputCost + cachedCost + outputCost + cacheWriteCost
      const costWithoutCache =
        ((promptTokens + outputTokens) / 1_000_000) *
        (PRICING.inputCost * (promptTokens / (promptTokens + outputTokens)) +
          PRICING.outputCost * (outputTokens / (promptTokens + outputTokens)))
      const savings = costWithoutCache - cost

      // Create request log
      const log: RequestLog = {
        id: Date.now().toString(),
        timestamp: now,
        prompt: selectedPrompt.label,
        inputTokens: promptTokens,
        cachedTokens,
        outputTokens,
        cacheHit,
        cost,
        costWithoutCache,
        savings,
      }

      setRequestLogs((prev) => [log, ...prev].slice(0, 20)) // Keep last 20

      // Update cache
      if (cacheHit && cachedEntry) {
        // Update hit count
        setCacheEntries((entries) =>
          entries.map((entry) =>
            entry.id === cachedEntry.id ? { ...entry, hits: entry.hits + 1 } : entry
          )
        )
      } else {
        // Add to cache
        const newEntry: CacheEntry = {
          id: Date.now().toString(),
          prompt: selectedPrompt.label,
          cachedTokens: promptTokens,
          timestamp: now,
          ttl: CACHE_TTL,
          hits: 0,
        }
        setCacheEntries((prev) => [...prev, newEntry])
      }

      setIsProcessing(false)
    }, 800)
  }

  const clearCache = () => {
    setCacheEntries([])
  }

  const resetDemo = () => {
    setCacheEntries([])
    setRequestLogs([])
  }

  return (
    <div className="min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: durations.moderate,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Database className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                Interactive Demo
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Anthropic Prompt Caching Demo
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl">
            Experience how Anthropic's prompt caching reduces costs by up to 90% and
            improves latency. Send multiple requests with the same prompt to see cache
            hits in action.
          </p>
        </motion.header>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-1">
                How Prompt Caching Works
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Anthropic caches the prefix of your prompt (like system prompts or
                context) for 5 minutes. Cached tokens cost 90% less ($0.30 vs $3.00 per
                1M tokens) and return instantly.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{totalRequests}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-green-500/10 border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs text-green-700 dark:text-green-300">Hits</span>
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {cacheHits}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-xs text-red-700 dark:text-red-300">Misses</span>
            </div>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {cacheMisses}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-lg bg-purple-500/10 border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs text-purple-700 dark:text-purple-300">
                Hit Rate
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {hitRate.toFixed(0)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs text-amber-700 dark:text-amber-300">Cost</span>
            </div>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              ${totalCost.toFixed(4)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs text-emerald-700 dark:text-emerald-300">
                Saved
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              ${totalSavings.toFixed(4)}
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Prompt Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="p-6 rounded-lg bg-muted/30 border border-border/50"
            >
              <h3 className="text-lg font-semibold mb-4">Select Prompt to Cache</h3>
              <div className="space-y-2">
                {SAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    onClick={() => setSelectedPrompt(prompt)}
                    className={cn(
                      'w-full text-left p-4 rounded-lg border transition-all',
                      selectedPrompt.label === prompt.label
                        ? 'bg-brand-500/10 border-brand-500 ring-2 ring-brand-500/20'
                        : 'bg-muted/20 border-border/50 hover:border-brand-500/30'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">
                          {prompt.label}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {prompt.content}
                        </div>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 rounded bg-muted/50 shrink-0">
                        {prompt.tokens.toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Output Tokens Slider */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold">Output Tokens</label>
                <span className="text-sm font-mono text-brand-600 dark:text-brand-400">
                  {outputTokens.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={outputTokens}
                onChange={(e) => setOutputTokens(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
              className="flex gap-3"
            >
              <button
                onClick={sendRequest}
                disabled={isProcessing}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
                  'bg-brand-500 text-white hover:bg-brand-600',
                  'transition-colors font-semibold',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Send Request
                  </>
                )}
              </button>
              <button
                onClick={resetDemo}
                className={cn(
                  'px-4 py-3 rounded-lg border border-border/50',
                  'hover:bg-muted/50 transition-colors text-sm font-medium'
                )}
              >
                Reset
              </button>
            </motion.div>

            {/* Cache Entries */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Cache Entries</h3>
                {cacheEntries.length > 0 && (
                  <button
                    onClick={clearCache}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline"
                  >
                    Clear Cache
                  </button>
                )}
              </div>

              {cacheEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No cached entries yet. Send a request to populate the cache.
                </p>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {cacheEntries.map((entry) => {
                      const timeRemaining = Math.max(
                        0,
                        entry.ttl - (Date.now() - entry.timestamp) / 1000
                      )
                      const percentRemaining = (timeRemaining / entry.ttl) * 100

                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-3 rounded-lg bg-muted/50 border border-border/30"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {entry.prompt}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {entry.cachedTokens.toLocaleString()} tokens •{' '}
                                {entry.hits} hits
                              </div>
                            </div>
                            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                          </div>

                          {/* TTL Progress Bar */}
                          <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-green-500"
                              initial={{ width: '100%' }}
                              animate={{ width: `${percentRemaining}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Expires in {Math.ceil(timeRemaining)}s
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Request Log */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
            className="p-6 rounded-lg bg-muted/30 border border-border/50"
          >
            <h3 className="text-lg font-semibold mb-4">Request History</h3>

            {requestLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                No requests yet. Click "Send Request" to start.
              </p>
            ) : (
              <div className="space-y-3 max-h-[800px] overflow-y-auto scrollbar-hide">
                <AnimatePresence>
                  {requestLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className={cn(
                        'p-4 rounded-lg border',
                        log.cacheHit
                          ? 'bg-green-500/10 border-green-200 dark:border-green-800'
                          : 'bg-blue-500/10 border-blue-200 dark:border-blue-800'
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {log.cacheHit ? (
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                          <span
                            className={cn(
                              'text-xs font-semibold',
                              log.cacheHit
                                ? 'text-green-700 dark:text-green-300'
                                : 'text-blue-700 dark:text-blue-300'
                            )}
                          >
                            {log.cacheHit ? 'CACHE HIT' : 'CACHE MISS'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {/* Prompt Info */}
                      <div className="text-sm font-medium mb-2">{log.prompt}</div>

                      {/* Token Breakdown */}
                      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Input: </span>
                          <span className="font-mono">
                            {log.inputTokens.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cached: </span>
                          <span className="font-mono text-green-600 dark:text-green-400">
                            {log.cachedTokens.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Output: </span>
                          <span className="font-mono">
                            {log.outputTokens.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Cost Info */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/30">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Cost: </span>
                          <span className="font-mono font-semibold">
                            ${log.cost.toFixed(6)}
                          </span>
                        </div>
                        {log.savings > 0 && (
                          <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                            Saved ${log.savings.toFixed(6)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        {/* Cost Comparison Section */}
        {totalRequests > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 p-6 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border border-purple-200 dark:border-purple-800"
          >
            <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  With Caching
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${totalCost.toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Without Caching
                </div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  ${totalCostWithoutCache.toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Total Savings
                </div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  ${totalSavings.toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {((totalSavings / totalCostWithoutCache) * 100).toFixed(1)}%
                  reduction
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
