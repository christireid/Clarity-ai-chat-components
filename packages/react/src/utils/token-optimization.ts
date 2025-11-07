/**
 * Token Optimization Utilities
 * 
 * Comprehensive set of utilities for optimizing token usage in AI chat applications.
 * These utilities help reduce costs and improve performance by:
 * - Shortening and simplifying prompts
 * - Managing conversation history efficiently
 * - Caching responses
 * - Throttling requests
 * - Routing to appropriate models
 * - Using references instead of full data
 * - Limiting output length
 * - Batching requests
 */

import type { CoreMessage } from '../hooks/use-chat-enhanced'

// ============================================================================
// Types
// ============================================================================

export interface TokenOptimizationConfig {
  /** Enable prompt shortening */
  enablePromptShortening?: boolean
  /** Enable conversation history limiting */
  enableHistoryLimiting?: boolean
  /** Enable response caching */
  enableCaching?: boolean
  /** Enable request throttling */
  enableThrottling?: boolean
  /** Enable model routing */
  enableModelRouting?: boolean
  /** Enable similarity caching */
  enableSimilarityCaching?: boolean
  /** Enable reference system */
  enableReferences?: boolean
  /** Enable output limits */
  enableOutputLimits?: boolean
  /** Enable request batching */
  enableBatching?: boolean
}

export interface PromptShorteningOptions {
  /** Remove duplicate sentences */
  removeDuplicates?: boolean
  /** Remove filler words */
  removeFillers?: boolean
  /** Simplify complex sentences */
  simplifySentences?: boolean
  /** Target reduction percentage (0-1) */
  targetReduction?: number
  /** Preserve important keywords */
  preserveKeywords?: string[]
}

export interface HistoryLimitingOptions {
  /** Maximum number of messages to keep */
  maxMessages?: number
  /** Maximum tokens to use for history */
  maxTokens?: number
  /** Strategy: 'sliding-window' | 'fifo' | 'smart' | 'summarize' */
  strategy?: 'sliding-window' | 'fifo' | 'smart' | 'summarize'
  /** Always keep system message */
  keepSystemMessage?: boolean
  /** Always keep last N messages */
  keepLast?: number
}

export interface CacheOptions {
  /** Cache storage type */
  storage?: 'memory' | 'localStorage' | 'indexedDB'
  /** Cache TTL in milliseconds */
  ttl?: number
  /** Maximum cache size */
  maxSize?: number
}

export interface SimilarityCacheOptions extends CacheOptions {
  /** Similarity threshold (0-1) */
  similarityThreshold?: number
  /** Use embeddings for similarity */
  useEmbeddings?: boolean
  /** Embedding model */
  embeddingModel?: string
}

export interface ThrottlingOptions {
  /** Minimum delay between requests (ms) */
  minDelay?: number
  /** Maximum requests per time window */
  maxRequests?: number
  /** Time window in milliseconds */
  timeWindow?: number
}

export interface ModelRoutingOptions {
  /** Simple/complex threshold in tokens */
  complexityThreshold?: number
  /** Model for simple queries */
  simpleModel?: string
  /** Model for complex queries */
  complexModel?: string
  /** Cost per token for simple model */
  simpleModelCost?: number
  /** Cost per token for complex model */
  complexModelCost?: number
}

export interface ReferenceOptions {
  /** Maximum size before using reference (bytes) */
  maxSize?: number
  /** Reference prefix */
  referencePrefix?: string
  /** Storage backend */
  storageBackend?: 'memory' | 'localStorage' | 'indexedDB' | 'api'
}

export interface OutputLimitOptions {
  /** Maximum output tokens */
  maxTokens?: number
  /** Maximum output characters */
  maxCharacters?: number
  /** Enforce structured format */
  structuredFormat?: boolean
  /** Truncation strategy */
  truncationStrategy?: 'end' | 'smart' | 'summary'
}

export interface BatchingOptions {
  /** Batch size */
  batchSize?: number
  /** Maximum wait time before sending batch (ms) */
  maxWaitTime?: number
  /** Time window for batching (ms) */
  timeWindow?: number
}

// ============================================================================
// 1. Prompt Shortening & Simplification
// ============================================================================

/**
 * Common filler words to remove
 */
const FILLER_WORDS = new Set([
  'um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally',
  'really', 'very', 'quite', 'rather', 'pretty', 'somewhat', 'sort of',
  'kind of', 'a bit', 'a little', 'just', 'only', 'simply', 'merely',
])

/**
 * Remove duplicate sentences from text
 */
function removeDuplicateSentences(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const seen = new Set<string>()
  const unique: string[] = []

  for (const sentence of sentences) {
    const normalized = sentence.trim().toLowerCase()
    if (!seen.has(normalized)) {
      seen.add(normalized)
      unique.push(sentence.trim())
    }
  }

  return unique.join('. ') + (text.match(/[.!?]$/) ? text.slice(-1) : '')
}

/**
 * Remove filler words from text
 */
function removeFillers(text: string, preserveKeywords: string[] = []): string {
  const preserveSet = new Set(preserveKeywords.map(k => k.toLowerCase()))
  
  return text
    .split(/\s+/)
    .filter(word => {
      const lower = word.toLowerCase().replace(/[.,!?;:]$/, '')
      return !FILLER_WORDS.has(lower) || preserveSet.has(lower)
    })
    .join(' ')
}

/**
 * Simplify complex sentences
 */
function simplifySentences(text: string): string {
  // Simple heuristic: split long sentences, remove redundant clauses
  return text
    .replace(/,\s+which\s+/gi, '. ')
    .replace(/,\s+that\s+/gi, '. ')
    .replace(/\s+and\s+so\s+/gi, '. ')
    .replace(/\s+as\s+well\s+as\s+/gi, ' and ')
    .replace(/\s+in\s+order\s+to\s+/gi, ' to ')
    .replace(/\s+in\s+spite\s+of\s+the\s+fact\s+that\s+/gi, ' although ')
}

/**
 * Shorten and simplify a prompt
 * 
 * @example
 * ```ts
 * const shortened = shortenPrompt(
 *   "I really, really want to know, um, you know, what the weather is like today",
 *   { removeFillers: true, targetReduction: 0.3 }
 * )
 * // Returns: "I want to know what the weather is like today"
 * ```
 */
export function shortenPrompt(
  prompt: string,
  options: PromptShorteningOptions = {}
): string {
  const {
    removeDuplicates = true,
    removeFillers: shouldRemoveFillers = true,
    simplifySentences: shouldSimplifySentences = true,
    targetReduction = 0.2,
    preserveKeywords = [],
  } = options

  let result = prompt.trim()

  // Remove duplicates
  if (removeDuplicates) {
    result = removeDuplicateSentences(result)
  }

  // Remove fillers
  if (shouldRemoveFillers) {
    result = removeFillers(result, preserveKeywords)
  }

  // Simplify sentences
  if (shouldSimplifySentences) {
    result = simplifySentences(result)
  }

  // If we haven't reached target reduction, be more aggressive
  const originalLength = prompt.length
  const currentLength = result.length
  const reduction = 1 - currentLength / originalLength

  if (reduction < targetReduction) {
    // More aggressive: remove redundant phrases
    result = result
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*\.\s*/g, '. ')
      .trim()
  }

  return result
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokens(text: string): number {
  // More accurate: ~3.5 characters per token for English
  return Math.ceil(text.length / 3.5)
}

/**
 * Calculate token savings from shortening
 */
export function calculateTokenSavings(
  original: string,
  shortened: string
): { tokensSaved: number; percentage: number; originalTokens: number; shortenedTokens: number } {
  const originalTokens = estimateTokens(original)
  const shortenedTokens = estimateTokens(shortened)
  const tokensSaved = originalTokens - shortenedTokens
  const percentage = originalTokens > 0 ? (tokensSaved / originalTokens) * 100 : 0

  return {
    tokensSaved,
    percentage,
    originalTokens,
    shortenedTokens,
  }
}

// ============================================================================
// 2. Conversation History Management
// ============================================================================

/**
 * Limit conversation history using sliding window
 */
export function limitHistorySlidingWindow(
  messages: CoreMessage[],
  options: HistoryLimitingOptions = {}
): CoreMessage[] {
  const { maxMessages = 10, keepSystemMessage = true } = options

  const systemMessages = keepSystemMessage
    ? messages.filter(m => m.role === 'system')
    : []
  const otherMessages = messages.filter(m => m.role !== 'system')

  const recentMessages = otherMessages.slice(-maxMessages)

  return [...systemMessages, ...recentMessages]
}

/**
 * Limit conversation history using FIFO strategy
 */
export function limitHistoryFIFO(
  messages: CoreMessage[],
  options: HistoryLimitingOptions = {}
): CoreMessage[] {
  const { maxTokens = 2000, keepSystemMessage = true, keepLast = 2 } = options

  const systemMessages = keepSystemMessage
    ? messages.filter(m => m.role === 'system')
    : []
  const otherMessages = messages.filter(m => m.role !== 'system')

  // Always keep last N messages
  const lastMessages = otherMessages.slice(-keepLast)
  const remainingMessages = otherMessages.slice(0, -keepLast)

  // Calculate tokens used by last messages
  let tokensUsed = lastMessages.reduce(
    (sum, msg) => sum + estimateTokens(typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)),
    0
  )

  // Add system message tokens
  tokensUsed += systemMessages.reduce(
    (sum, msg) => sum + estimateTokens(typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)),
    0
  )

  // Add older messages until we hit the limit
  const keptMessages: CoreMessage[] = []
  for (let i = remainingMessages.length - 1; i >= 0; i--) {
    const msg = remainingMessages[i]
    const msgTokens = estimateTokens(typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content))
    
    if (tokensUsed + msgTokens <= maxTokens) {
      keptMessages.unshift(msg)
      tokensUsed += msgTokens
    } else {
      break
    }
  }

  return [...systemMessages, ...keptMessages, ...lastMessages]
}

/**
 * Limit conversation history using smart strategy (keeps conversation pairs)
 */
export function limitHistorySmart(
  messages: CoreMessage[],
  options: HistoryLimitingOptions = {}
): CoreMessage[] {
  const { maxTokens = 2000, keepSystemMessage = true } = options

  const systemMessages = keepSystemMessage
    ? messages.filter(m => m.role === 'system')
    : []
  const otherMessages = messages.filter(m => m.role !== 'system')

  // Group into conversation turns (user + assistant pairs)
  const turns: CoreMessage[][] = []
  let currentTurn: CoreMessage[] = []

  for (const msg of otherMessages) {
    if (msg.role === 'user') {
      if (currentTurn.length > 0) {
        turns.push(currentTurn)
      }
      currentTurn = [msg]
    } else {
      currentTurn.push(msg)
    }
  }

  if (currentTurn.length > 0) {
    turns.push(currentTurn)
  }

  // Calculate system message tokens
  let tokensUsed = systemMessages.reduce(
    (sum, msg) => sum + estimateTokens(typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)),
    0
  )

  // Add turns from newest, keeping pairs together
  const keptTurns: CoreMessage[][] = []
  for (let i = turns.length - 1; i >= 0; i--) {
    const turn = turns[i]
    const turnTokens = turn.reduce(
      (sum, msg) => sum + estimateTokens(typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)),
      0
    )

    if (tokensUsed + turnTokens <= maxTokens) {
      keptTurns.unshift(turn)
      tokensUsed += turnTokens
    } else {
      break
    }
  }

  return [...systemMessages, ...keptTurns.flat()]
}

/**
 * Limit conversation history based on strategy
 */
export function limitHistory(
  messages: CoreMessage[],
  options: HistoryLimitingOptions = {}
): CoreMessage[] {
  const { strategy = 'sliding-window' } = options

  switch (strategy) {
    case 'sliding-window':
      return limitHistorySlidingWindow(messages, options)
    case 'fifo':
      return limitHistoryFIFO(messages, options)
    case 'smart':
      return limitHistorySmart(messages, options)
    case 'summarize':
      // Summarization requires async call - return limited version for now
      return limitHistorySmart(messages, options)
    default:
      return limitHistorySlidingWindow(messages, options)
  }
}

// ============================================================================
// 3. Basic Response Caching
// ============================================================================

interface CacheEntry {
  key: string
  value: any
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry>()
  private maxSize: number

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.value
  }

  set(key: string, value: any, ttl: number = 3600000): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      key,
      value,
      timestamp: Date.now(),
      ttl,
    })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

/**
 * Create a cache instance
 */
export function createCache(options: CacheOptions = {}): {
  get: (key: string) => any | null
  set: (key: string, value: any, ttl?: number) => void
  clear: () => void
  size: () => number
} {
  const { storage = 'memory', maxSize = 100 } = options

  if (storage === 'memory') {
    return new MemoryCache(maxSize)
  }

  // For localStorage and indexedDB, return simplified memory cache for now
  // Full implementation would use async storage
  return new MemoryCache(maxSize)
}

/**
 * Generate cache key from message
 */
export function generateCacheKey(message: string | CoreMessage): string {
  const text = typeof message === 'string' 
    ? message 
    : typeof (message as any).content === 'string'
    ? (message as any).content
    : JSON.stringify((message as any).content)

  // Simple hash function
  let hash = 0
  const normalized = text.toLowerCase().trim()
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return `cache_${Math.abs(hash)}`
}

// ============================================================================
// 4. Request Throttling
// ============================================================================

class RequestThrottler {
  private requests: number[] = []
  private minDelay: number
  private maxRequests: number
  private timeWindow: number

  constructor(options: ThrottlingOptions = {}) {
    this.minDelay = options.minDelay ?? 500
    this.maxRequests = options.maxRequests ?? 10
    this.timeWindow = options.timeWindow ?? 60000 // 1 minute
  }

  canMakeRequest(): boolean {
    const now = Date.now()

    // Remove old requests outside time window
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.timeWindow
    )

    // Check if we're within rate limits
    if (this.requests.length >= this.maxRequests) {
      return false
    }

    // Check minimum delay
    if (this.requests.length > 0) {
      const lastRequest = this.requests[this.requests.length - 1]
      if (now - lastRequest < this.minDelay) {
        return false
      }
    }

    return true
  }

  recordRequest(): void {
    this.requests.push(Date.now())
  }

  getTimeUntilNextRequest(): number {
    if (this.requests.length === 0) return 0

    const now = Date.now()
    const lastRequest = this.requests[this.requests.length - 1]
    const timeSinceLastRequest = now - lastRequest

    if (timeSinceLastRequest < this.minDelay) {
      return this.minDelay - timeSinceLastRequest
    }

    return 0
  }
}

/**
 * Create a request throttler
 */
export function createThrottler(options: ThrottlingOptions = {}): RequestThrottler {
  return new RequestThrottler(options)
}

// ============================================================================
// 5. Model Routing
// ============================================================================

/**
 * Determine if a query is simple or complex
 */
export function classifyQueryComplexity(
  query: string,
  threshold: number = 50
): 'simple' | 'complex' {
  const tokens = estimateTokens(query)
  return tokens < threshold ? 'simple' : 'complex'
}

/**
 * Route query to appropriate model
 */
export function routeToModel(
  query: string,
  options: ModelRoutingOptions = {}
): string {
  const {
    complexityThreshold = 50,
    simpleModel = 'gpt-3.5-turbo',
    complexModel = 'gpt-4',
  } = options

  const complexity = classifyQueryComplexity(query, complexityThreshold)
  return complexity === 'simple' ? simpleModel : complexModel
}

/**
 * Estimate cost savings from model routing
 */
export function estimateRoutingSavings(
  query: string,
  options: ModelRoutingOptions = {}
): { saved: number; percentage: number; selectedModel: string } {
  const {
    complexityThreshold = 50,
    simpleModel = 'gpt-3.5-turbo',
    complexModel = 'gpt-4',
    simpleModelCost = 0.0000005,
    complexModelCost = 0.00003,
  } = options

  const tokens = estimateTokens(query)
  const complexity = classifyQueryComplexity(query, complexityThreshold)
  const selectedModel = complexity === 'simple' ? simpleModel : complexModel

  const simpleCost = tokens * simpleModelCost
  const complexCost = tokens * complexModelCost
  const actualCost = complexity === 'simple' ? simpleCost : complexCost
  const maxCost = Math.max(simpleCost, complexCost)
  const saved = maxCost - actualCost
  const percentage = maxCost > 0 ? (saved / maxCost) * 100 : 0

  return { saved, percentage, selectedModel }
}

// ============================================================================
// 6. Reference System
// ============================================================================

/**
 * Check if data should use reference system
 */
export function shouldUseReference(
  data: string | object,
  options: ReferenceOptions = {}
): boolean {
  const { maxSize = 1000 } = options // 1KB default

  const size = typeof data === 'string' 
    ? new Blob([data]).size 
    : new Blob([JSON.stringify(data)]).size

  return size > maxSize
}

/**
 * Create a reference for large data
 */
export function createReference(
  data: string | object,
  options: ReferenceOptions = {}
): { type: 'reference'; id: string; originalSize: number } | { type: 'data'; data: string | object } {
  const { maxSize = 1000, referencePrefix = 'ref_' } = options

  if (!shouldUseReference(data, options)) {
    return { type: 'data', data }
  }

  const id = `${referencePrefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const size = typeof data === 'string' 
    ? new Blob([data]).size 
    : new Blob([JSON.stringify(data)]).size

  // In production, store data in backend and return reference
  return {
    type: 'reference',
    id,
    originalSize: size,
  }
}

// ============================================================================
// 7. Output Limits
// ============================================================================

/**
 * Enforce output length limits
 */
export function enforceOutputLimit(
  output: string,
  options: OutputLimitOptions = {}
): string {
  const { maxTokens, maxCharacters, truncationStrategy = 'end' } = options

  // Character limit takes precedence
  if (maxCharacters && output.length > maxCharacters) {
    if (truncationStrategy === 'end') {
      return output.slice(0, maxCharacters) + '...'
    }
    if (truncationStrategy === 'smart') {
      // Try to truncate at sentence boundary
      const truncated = output.slice(0, maxCharacters)
      const lastPeriod = truncated.lastIndexOf('.')
      const lastQuestion = truncated.lastIndexOf('?')
      const lastExclamation = truncated.lastIndexOf('!')
      const lastBoundary = Math.max(lastPeriod, lastQuestion, lastExclamation)
      
      if (lastBoundary > maxCharacters * 0.8) {
        return truncated.slice(0, lastBoundary + 1) + '...'
      }
      
      return truncated + '...'
    }
  }

  // Token limit
  if (maxTokens) {
    const tokens = estimateTokens(output)
    if (tokens > maxTokens) {
      // Rough approximation: tokens * 3.5 = characters
      const maxChars = Math.floor(maxTokens * 3.5)
      return enforceOutputLimit(output, { maxCharacters: maxChars, truncationStrategy })
    }
  }

  return output
}

// ============================================================================
// 8. Request Batching
// ============================================================================

interface BatchedRequest {
  id: string
  request: () => Promise<any>
  resolve: (value: any) => void
  reject: (error: any) => void
  timestamp: number
}

class RequestBatcher {
  private queue: BatchedRequest[] = []
  private batchSize: number
  private maxWaitTime: number
  private timeWindow: number
  private timer: NodeJS.Timeout | null = null

  constructor(options: BatchingOptions = {}) {
    this.batchSize = options.batchSize ?? 5
    this.maxWaitTime = options.maxWaitTime ?? 1000
    this.timeWindow = options.timeWindow ?? 5000
  }

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const batchedRequest: BatchedRequest = {
        id: Math.random().toString(36).substr(2, 9),
        request,
        resolve,
        reject,
        timestamp: Date.now(),
      }

      this.queue.push(batchedRequest)

      // If batch is full, process immediately
      if (this.queue.length >= this.batchSize) {
        this.processBatch()
        return
      }

      // Otherwise, set timer to process after maxWaitTime
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.processBatch()
        }, this.maxWaitTime)
      }
    })
  }

  private async processBatch(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    if (this.queue.length === 0) return

    const batch = this.queue.splice(0, this.batchSize)

    // Process all requests in parallel
    const results = await Promise.allSettled(
      batch.map(req => req.request())
    )

    // Resolve/reject each promise
    batch.forEach((req, index) => {
      const result = results[index]
      if (result.status === 'fulfilled') {
        req.resolve(result.value)
      } else {
        req.reject(result.reason)
      }
    })
  }

  clear(): void {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.queue.forEach(req => {
      req.reject(new Error('Batch cleared'))
    })
    this.queue = []
  }
}

/**
 * Create a request batcher
 */
export function createBatcher(options: BatchingOptions = {}): RequestBatcher {
  return new RequestBatcher(options)
}

// ============================================================================
// 9. Similarity Caching (Basic Implementation)
// ============================================================================

/**
 * Calculate simple similarity between two strings (Jaccard similarity)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().split(/\s+/))
  const words2 = new Set(str2.toLowerCase().split(/\s+/))

  const intersection = new Set([...words1].filter(x => words2.has(x)))
  const union = new Set([...words1, ...words2])

  return union.size > 0 ? intersection.size / union.size : 0
}

/**
 * Find similar cached response
 */
export function findSimilarCached(
  query: string,
  cache: Map<string, { query: string; response: any; timestamp: number }>,
  threshold: number = 0.7
): any | null {
  for (const [key, entry] of cache.entries()) {
    const similarity = calculateSimilarity(query, entry.query)
    if (similarity >= threshold) {
      return entry.response
    }
  }
  return null
}
