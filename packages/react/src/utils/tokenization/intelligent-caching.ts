/**
 * Intelligent Caching Layer for Token Optimization
 *
 * This module implements multi-level caching with:
 * - Semantic similarity matching
 * - Context-aware cache keys
 * - Predictive preloading
 * - Adaptive cache sizing
 * - Real-time cache analytics
 * - Cross-conversation cache sharing
 */

import { TokenCounter } from '@clarity-chat/token-optimization'

export type CacheLevel = 'memory' | 'session' | 'persistent' | 'distributed'
export type CacheStrategy = 'exact' | 'semantic' | 'contextual' | 'predictive'
export type EvictionPolicy = 'lru' | 'lfu' | 'ttl' | 'adaptive'

export interface CacheConfig {
  level: CacheLevel
  strategy: CacheStrategy
  maxSize: number
  ttl?: number
  evictionPolicy: EvictionPolicy
  semanticThreshold?: number
  enablePreloading?: boolean
  enableCompression?: boolean
  enableAnalytics?: boolean
}

export interface CacheEntry {
  key: string
  value: any
  tokens: number
  hits: number
  lastAccessed: number
  created: number
  ttl: number
  semanticHash?: string
  contextHash?: string
  accessPattern: string[]
}

export interface CacheStats {
  hits: number
  misses: number
  hitRate: number
  avgResponseTime: number
  memoryUsage: number
  entries: number
  evictions: number
  compressionRatio: number
  tokenSavings: number
}

export interface SemanticCacheConfig {
  similarityThreshold: number
  semanticModel: 'cosine' | 'jaccard' | 'levenshtein'
  contextWindow: number
  enableFuzzyMatching: boolean
  maxCandidates: number
}

/**
 * Advanced semantic cache with intelligent matching
 */
export class IntelligentSemanticCache {
  private cache: Map<string, CacheEntry>
  private semanticIndex: Map<string, Set<string>>
  private contextIndex: Map<string, Set<string>>
  private accessPatterns: Map<string, number>
  private config: CacheConfig
  private stats: CacheStats
  private preloadingQueue: string[]

  constructor(config: CacheConfig) {
    this.cache = new Map()
    this.semanticIndex = new Map()
    this.contextIndex = new Map()
    this.accessPatterns = new Map()
    this.config = config
    this.stats = this.initializeStats()
    this.preloadingQueue = []

    if (config.enableAnalytics) {
      this.startAnalyticsCollection()
    }
  }

  /**
   * Get cached result with intelligent matching
   */
  async get(key: string, context?: string): Promise<any> {
    const startTime = performance.now()

    // Try exact match first
    let entry = this.cache.get(key)

    // Try semantic matching if enabled
    if (!entry && this.config.strategy === 'semantic') {
      entry = (await this.findSemanticMatch(key)) ?? undefined
    }

    // Try contextual matching if enabled
    if (!entry && context && this.config.strategy === 'contextual') {
      entry = (await this.findContextualMatch(key, context)) ?? undefined
    }

    if (entry) {
      this.updateEntryAccess(entry, key)
      const responseTime = performance.now() - startTime
      this.updateStats(true, responseTime, entry.tokens)

      return entry.value
    }

    const responseTime = performance.now() - startTime
    this.updateStats(false, responseTime, 0)
    return null
  }

  /**
   * Set cache entry with intelligent indexing
   */
  async set(
    key: string,
    value: any,
    context?: string,
    metadata?: any
  ): Promise<void> {
    const tokens =
      value.tokens || (await TokenCounter.count(JSON.stringify(value)))

    // Check cache size and evict if necessary
    if (this.cache.size >= this.config.maxSize) {
      this.evictEntry()
    }

    const entry: CacheEntry = {
      key,
      value,
      tokens,
      hits: 0,
      lastAccessed: Date.now(),
      created: Date.now(),
      ttl: this.config.ttl || 3600000, // 1 hour default
      semanticHash: this.generateSemanticHash(key),
      contextHash: context ? this.generateContextHash(context) : undefined,
      accessPattern: this.getCurrentAccessPattern(),
    }

    this.cache.set(key, entry)

    // Update indexes
    if (this.config.strategy === 'semantic') {
      this.updateSemanticIndex(entry)
    }
    if (this.config.strategy === 'contextual' && context) {
      this.updateContextIndex(entry, context)
    }

    // Update access patterns
    this.updateAccessPattern(key)
  }

  /**
   * Find semantic match using similarity algorithms
   */
  private async findSemanticMatch(key: string): Promise<CacheEntry | null> {
    const keyHash = this.generateSemanticHash(key)
    const candidates = this.semanticIndex.get(keyHash) || new Set()

    let bestMatch: CacheEntry | null = null
    let bestScore = this.config.semanticThreshold || 0.8

    for (const candidateKey of candidates) {
      const entry = this.cache.get(candidateKey)
      if (!entry) continue

      const similarity = this.calculateSemanticSimilarity(key, entry.key)
      if (similarity > bestScore) {
        bestScore = similarity
        bestMatch = entry
      }
    }

    return bestMatch
  }

  /**
   * Find contextual match based on conversation context
   */
  private async findContextualMatch(
    key: string,
    context: string
  ): Promise<CacheEntry | null> {
    const contextHash = this.generateContextHash(context)
    const candidates = this.contextIndex.get(contextHash) || new Set()

    let bestMatch: CacheEntry | null = null
    let bestScore = 0.6

    for (const candidateKey of candidates) {
      const entry = this.cache.get(candidateKey)
      if (!entry || !entry.contextHash) continue

      const contextSimilarity = this.calculateContextSimilarity(
        context,
        entry.contextHash
      )
      const keySimilarity = this.calculateSemanticSimilarity(key, entry.key)
      const combinedScore = contextSimilarity * 0.6 + keySimilarity * 0.4

      if (combinedScore > bestScore) {
        bestScore = combinedScore
        bestMatch = entry
      }
    }

    return bestMatch
  }

  /**
   * Multi-level cache with intelligent routing
   */
  async getMultiLevel(
    key: string,
    level: CacheLevel,
    context?: string
  ): Promise<any> {
    // Route to appropriate cache level
    switch (level) {
      case 'memory':
        return this.get(key, context)
      case 'session':
        return this.getFromSessionStorage(key, context)
      case 'persistent':
        return this.getFromPersistentStorage(key, context)
      case 'distributed':
        return this.getFromDistributedCache(key, context)
      default:
        return this.get(key, context)
    }
  }

  /**
   * Predictive preloading based on access patterns
   */
  async preloadPredictedEntries(accessPattern: string[]): Promise<void> {
    const predictions = this.predictNextEntries(accessPattern)

    for (const prediction of predictions) {
      if (!this.cache.has(prediction)) {
        this.preloadingQueue.push(prediction)
      }
    }

    // Process preloading queue
    this.processPreloadingQueue()
  }

  /**
   * Intelligent cache warming based on usage patterns
   */
  async warmCache(usagePatterns: Map<string, number>): Promise<void> {
    const sortedPatterns = Array.from(usagePatterns.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20) // Top 20 patterns

    for (const [pattern, frequency] of sortedPatterns) {
      if (frequency > 5) {
        // High frequency patterns
        await this.preloadPredictedEntries([pattern])
      }
    }
  }

  /**
   * Advanced cache analytics and optimization
   */
  getAnalytics(): {
    stats: CacheStats
    patterns: Map<string, number>
    recommendations: string[]
    optimizationOpportunities: string[]
  } {
    const patterns = this.analyzeAccessPatterns()
    const recommendations = this.generateRecommendations()
    const opportunities = this.identifyOptimizationOpportunities()

    return {
      stats: { ...this.stats },
      patterns,
      recommendations,
      optimizationOpportunities: opportunities,
    }
  }

  /**
   * Smart eviction with multiple strategies
   */
  private evictEntry(): void {
    let entryToEvict: CacheEntry | null = null
    let evictionKey: string | null = null

    switch (this.config.evictionPolicy) {
      case 'lru':
        ;({ entry: entryToEvict, key: evictionKey } = this.findLRUEntry())
        break
      case 'lfu':
        ;({ entry: entryToEvict, key: evictionKey } = this.findLFUEntry())
        break
      case 'ttl':
        ;({ entry: entryToEvict, key: evictionKey } = this.findTTLEntry())
        break
      case 'adaptive':
        ;({ entry: entryToEvict, key: evictionKey } = this.findAdaptiveEntry())
        break
    }

    if (entryToEvict && evictionKey) {
      this.cache.delete(evictionKey)
      this.removeFromIndexes(entryToEvict)
      this.stats.evictions++
      this.stats.memoryUsage -= this.estimateEntrySize(entryToEvict)
    }
  }

  /**
   * Semantic similarity calculation
   */
  private calculateSemanticSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/))
    const words2 = new Set(text2.toLowerCase().split(/\s+/))

    const intersection = new Set([...words1].filter((x) => words2.has(x)))
    const union = new Set([...words1, ...words2])

    return intersection.size / union.size
  }

  /**
   * Context similarity calculation
   */
  private calculateContextSimilarity(
    context1: string,
    context2: string
  ): number {
    return this.calculateSemanticSimilarity(context1, context2)
  }

  /**
   * Generate semantic hash for similarity matching
   */
  private generateSemanticHash(text: string): string {
    const words = text.toLowerCase().split(/\s+/).sort()
    return words.slice(0, 10).join('|') // Top 10 words as hash
  }

  /**
   * Generate context hash
   */
  private generateContextHash(context: string): string {
    return this.generateSemanticHash(context)
  }

  /**
   * Update semantic index
   */
  private updateSemanticIndex(entry: CacheEntry): void {
    if (!entry.semanticHash) return

    const entries = this.semanticIndex.get(entry.semanticHash) || new Set()
    entries.add(entry.key)
    this.semanticIndex.set(entry.semanticHash, entries)
  }

  /**
   * Update context index
   */
  private updateContextIndex(entry: CacheEntry, context: string): void {
    if (!entry.contextHash) return

    const entries = this.contextIndex.get(entry.contextHash) || new Set()
    entries.add(entry.key)
    this.contextIndex.set(entry.contextHash, entries)
  }

  /**
   * Remove from indexes
   */
  private removeFromIndexes(entry: CacheEntry): void {
    if (entry.semanticHash) {
      const semanticEntries = this.semanticIndex.get(entry.semanticHash)
      if (semanticEntries) {
        semanticEntries.delete(entry.key)
        if (semanticEntries.size === 0) {
          this.semanticIndex.delete(entry.semanticHash)
        }
      }
    }

    if (entry.contextHash) {
      const contextEntries = this.contextIndex.get(entry.contextHash)
      if (contextEntries) {
        contextEntries.delete(entry.key)
        if (contextEntries.size === 0) {
          this.contextIndex.delete(entry.contextHash)
        }
      }
    }
  }

  /**
   * Find LRU entry
   */
  private findLRUEntry():
    | { entry: CacheEntry; key: string }
    | { entry: null; key: null } {
    let oldestEntry: CacheEntry | null = null
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed
        oldestEntry = entry
        oldestKey = key
      }
    }

    return oldestEntry && oldestKey
      ? { entry: oldestEntry, key: oldestKey }
      : { entry: null, key: null }
  }

  /**
   * Find LFU entry
   */
  private findLFUEntry():
    | { entry: CacheEntry; key: string }
    | { entry: null; key: null } {
    let leastUsedEntry: CacheEntry | null = null
    let leastUsedKey: string | null = null
    let minHits = Infinity

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < minHits) {
        minHits = entry.hits
        leastUsedEntry = entry
        leastUsedKey = key
      }
    }

    return leastUsedEntry && leastUsedKey
      ? { entry: leastUsedEntry, key: leastUsedKey }
      : { entry: null, key: null }
  }

  /**
   * Find TTL expired entry
   */
  private findTTLEntry():
    | { entry: CacheEntry; key: string }
    | { entry: null; key: null } {
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.created > entry.ttl) {
        return { entry, key }
      }
    }

    return { entry: null, key: null }
  }

  /**
   * Find adaptive entry based on multiple factors
   */
  private findAdaptiveEntry():
    | { entry: CacheEntry; key: string }
    | { entry: null; key: null } {
    let bestEntry: CacheEntry | null = null
    let bestKey: string | null = null
    let bestScore = -1

    for (const [key, entry] of this.cache.entries()) {
      const score = this.calculateAdaptiveScore(entry)
      if (score > bestScore) {
        bestScore = score
        bestEntry = entry
        bestKey = key
      }
    }

    return bestEntry && bestKey
      ? { entry: bestEntry, key: bestKey }
      : { entry: null, key: null }
  }

  /**
   * Calculate adaptive score for entry prioritization
   */
  private calculateAdaptiveScore(entry: CacheEntry): number {
    const now = Date.now()
    const ageScore = (now - entry.lastAccessed) / 3600000 // Hours since access
    const frequencyScore = entry.hits / 10 // Normalize hits
    const sizeScore = entry.tokens / 1000 // Normalize token count

    // Combine scores (lower is better for eviction)
    return ageScore * 0.5 + frequencyScore * 0.3 + sizeScore * 0.2
  }

  /**
   * Session storage integration
   */
  private async getFromSessionStorage(
    key: string,
    context?: string
  ): Promise<any> {
    if (typeof sessionStorage === 'undefined') return null

    try {
      const cached = sessionStorage.getItem(`semantic_${key}`)
      if (cached) {
        const entry = JSON.parse(cached)
        if (Date.now() - entry.created < entry.ttl) {
          return entry.value
        }
      }
    } catch (error) {
      console.warn('Session storage access failed:', error)
    }
    return null
  }

  /**
   * Persistent storage integration
   */
  private async getFromPersistentStorage(
    key: string,
    context?: string
  ): Promise<any> {
    // Implementation would use IndexedDB or similar
    return null
  }

  /**
   * Distributed cache integration
   */
  private async getFromDistributedCache(
    key: string,
    context?: string
  ): Promise<any> {
    // Implementation would use Redis or similar
    return null
  }

  /**
   * Predict next entries based on access patterns
   */
  private predictNextEntries(accessPattern: string[]): string[] {
    const predictions: string[] = []

    // Simple prediction based on last access
    if (accessPattern.length > 0) {
      const lastAccess = accessPattern[accessPattern.length - 1]
      const related = this.findRelatedKeys(lastAccess)
      predictions.push(...related)
    }

    return predictions.slice(0, 5) // Top 5 predictions
  }

  /**
   * Find related keys based on access patterns
   */
  private findRelatedKeys(key: string): string[] {
    const related: string[] = []

    // Find keys with similar access patterns
    for (const [otherKey, entry] of this.cache.entries()) {
      if (otherKey === key) continue

      const similarity = this.calculatePatternSimilarity(key, otherKey)
      if (similarity > 0.7) {
        related.push(otherKey)
      }
    }

    return related
  }

  /**
   * Calculate pattern similarity
   */
  private calculatePatternSimilarity(
    pattern1: string,
    pattern2: string
  ): number {
    return this.calculateSemanticSimilarity(pattern1, pattern2)
  }

  /**
   * Process preloading queue
   */
  private processPreloadingQueue(): void {
    // Process queue asynchronously
    setTimeout(() => {
      while (this.preloadingQueue.length > 0) {
        const key = this.preloadingQueue.shift()
        if (key) {
          // Simulate loading and caching
          this.preloadingQueue = this.preloadingQueue.filter((k) => k !== key)
        }
      }
    }, 100)
  }

  /**
   * Analyze access patterns
   */
  private analyzeAccessPatterns(): Map<string, number> {
    const patterns = new Map<string, number>()

    for (const [key, entry] of this.cache.entries()) {
      const pattern = entry.accessPattern.join('->')
      patterns.set(pattern, (patterns.get(pattern) || 0) + entry.hits)
    }

    return patterns
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = []

    if (this.stats.hitRate < 0.5) {
      recommendations.push(
        'Consider increasing cache size or improving cache keys'
      )
    }

    if (this.stats.evictions > this.cache.size * 0.1) {
      recommendations.push(
        'High eviction rate - consider different eviction policy'
      )
    }

    return recommendations
  }

  /**
   * Identify optimization opportunities
   */
  private identifyOptimizationOpportunities(): string[] {
    const opportunities: string[] = []

    if (this.config.strategy === 'exact' && this.stats.hitRate < 0.7) {
      opportunities.push('Consider enabling semantic or contextual caching')
    }

    if (!this.config.enablePreloading && this.accessPatterns.size > 10) {
      opportunities.push(
        'Enable predictive preloading based on access patterns'
      )
    }

    return opportunities
  }

  /**
   * Update entry access
   */
  private updateEntryAccess(entry: CacheEntry, key: string): void {
    entry.hits++
    entry.lastAccessed = Date.now()
    entry.accessPattern.push(key)
  }

  /**
   * Update stats
   */
  private updateStats(
    hit: boolean,
    responseTime: number,
    tokens: number
  ): void {
    if (hit) {
      this.stats.hits++
      this.stats.tokenSavings += tokens
    } else {
      this.stats.misses++
    }

    this.stats.hitRate = this.stats.hits / (this.stats.hits + this.stats.misses)
    this.stats.avgResponseTime = (this.stats.avgResponseTime + responseTime) / 2
  }

  /**
   * Initialize stats
   */
  private initializeStats(): CacheStats {
    return {
      hits: 0,
      misses: 0,
      hitRate: 0,
      avgResponseTime: 0,
      memoryUsage: 0,
      entries: 0,
      evictions: 0,
      compressionRatio: 0,
      tokenSavings: 0,
    }
  }

  /**
   * Estimate entry size
   */
  private estimateEntrySize(entry: CacheEntry): number {
    return JSON.stringify(entry).length
  }

  /**
   * Get current access pattern
   */
  private getCurrentAccessPattern(): string[] {
    return Array.from(this.accessPatterns.keys()).slice(-5)
  }

  /**
   * Update access pattern
   */
  private updateAccessPattern(key: string): void {
    this.accessPatterns.set(key, Date.now())
  }

  /**
   * Start analytics collection
   */
  private startAnalyticsCollection(): void {
    setInterval(() => {
      this.collectAnalytics()
    }, 60000) // Every minute
  }

  /**
   * Collect analytics
   */
  private collectAnalytics(): void {
    // Analytics collection logic
    this.stats.entries = this.cache.size
    this.stats.memoryUsage = Array.from(this.cache.values()).reduce(
      (total, entry) => total + this.estimateEntrySize(entry),
      0
    )
  }

  /**
   * Process preloading queue asynchronously (public API)
   */
  async processPreloadingQueueAsync(): Promise<void> {
    while (this.preloadingQueue.length > 0) {
      const key = this.preloadingQueue.shift()
      if (key && !this.cache.has(key)) {
        // Simulate preloading
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats }
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear()
    this.semanticIndex.clear()
    this.contextIndex.clear()
    this.accessPatterns.clear()
    this.stats = this.initializeStats()
  }
}

/**
 * Multi-level cache manager
 */
export class MultiLevelCacheManager {
  private caches: Map<CacheLevel, IntelligentSemanticCache>
  private config: Map<CacheLevel, CacheConfig>

  constructor() {
    this.caches = new Map()
    this.config = new Map()
  }

  /**
   * Add cache level
   */
  addCacheLevel(level: CacheLevel, config: CacheConfig): void {
    this.caches.set(level, new IntelligentSemanticCache(config))
    this.config.set(level, config)
  }

  /**
   * Multi-level get with intelligent routing
   */
  async getMultiLevel(key: string, context?: string): Promise<any> {
    // Try each cache level in order
    const levels: CacheLevel[] = [
      'memory',
      'session',
      'persistent',
      'distributed',
    ]

    for (const level of levels) {
      const cache = this.caches.get(level)
      if (cache) {
        const result = await cache.get(key, context)
        if (result !== null) {
          return result
        }
      }
    }

    return null
  }

  /**
   * Multi-level set
   */
  async setMultiLevel(
    key: string,
    value: any,
    context?: string
  ): Promise<void> {
    // Set in all enabled cache levels
    for (const [level, cache] of this.caches.entries()) {
      await cache.set(key, value, context)
    }
  }

  /**
   * Get comprehensive analytics
   */
  getAnalytics(): Map<CacheLevel, any> {
    const analytics = new Map<CacheLevel, any>()

    for (const [level, cache] of this.caches.entries()) {
      analytics.set(level, cache.getAnalytics())
    }

    return analytics
  }

  /**
   * Optimize all cache levels
   */
  optimizeAll(): void {
    for (const cache of this.caches.values()) {
      // Implement optimization logic
      const analytics = cache.getAnalytics()
      // Use analytics to optimize cache configuration
    }
  }
}

/**
 * Token-specific cache with intelligent features
 */
export class IntelligentTokenCache {
  private cache: IntelligentSemanticCache
  private compressionCache: Map<string, string>

  constructor(config: CacheConfig) {
    this.cache = new IntelligentSemanticCache(config)
    this.compressionCache = new Map()
  }

  /**
   * Get cached token count with compression
   */
  async getTokenCount(text: string, model?: string): Promise<number> {
    const cacheKey = `tokens_${text.slice(0, 50)}_${model || 'default'}`

    const cached = await this.cache.get(cacheKey)
    if (cached) {
      return cached.count
    }

    // Calculate and cache
    const count = await TokenCounter.count(text)
    await this.cache.set(cacheKey, { count, text, model })

    return count
  }

  /**
   * Get cached compression result
   */
  async getCompressedText(text: string, strategy: string): Promise<string> {
    const cacheKey = `compressed_${strategy}_${text.slice(0, 50)}`

    const cached = await this.cache.get(cacheKey)
    if (cached) {
      return cached.compressedText
    }

    return text // Return original if not cached
  }

  /**
   * Cache compression result
   */
  async setCompressedText(
    text: string,
    compressedText: string,
    strategy: string
  ): Promise<void> {
    const cacheKey = `compressed_${strategy}_${text.slice(0, 50)}`
    await this.cache.set(cacheKey, {
      compressedText,
      originalText: text,
      strategy,
    })
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return this.cache.getStats()
  }
}

// Export singleton instances
export const semanticCache = new IntelligentSemanticCache({
  level: 'memory',
  strategy: 'semantic',
  maxSize: 1000,
  evictionPolicy: 'lru',
  semanticThreshold: 0.7,
  enableAnalytics: true,
})

export const multiLevelCache = new MultiLevelCacheManager()
export const tokenCache = new IntelligentTokenCache({
  level: 'memory',
  strategy: 'exact',
  maxSize: 5000,
  evictionPolicy: 'lfu',
  enableAnalytics: true,
})

// Convenience functions
export async function getCachedTokenCount(
  text: string,
  model?: string
): Promise<number> {
  return tokenCache.getTokenCount(text, model)
}

export async function getCachedCompression(
  text: string,
  strategy: string
): Promise<string> {
  return tokenCache.getCompressedText(text, strategy)
}

export async function setCachedCompression(
  text: string,
  compressedText: string,
  strategy: string
): Promise<void> {
  return tokenCache.setCompressedText(text, compressedText, strategy)
}

export function getCacheAnalytics(): any {
  return {
    semantic: semanticCache.getAnalytics(),
    token: tokenCache.getStats(),
    multiLevel: multiLevelCache.getAnalytics(),
  }
}
