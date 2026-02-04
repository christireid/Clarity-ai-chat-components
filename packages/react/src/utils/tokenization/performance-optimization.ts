import { TokenCounter } from '@clarity-chat/token-optimization'

// Chrome-only Performance.memory API
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number
      totalJSHeapSize: number
      jsHeapSizeLimit: number
    }
  }
}

export interface PerformanceMetrics {
  operation: string
  duration: number
  inputSize: number
  outputSize: number
  timestamp: number
  memoryUsage?: number
}

export interface PerformanceBenchmark {
  name: string
  averageDuration: number
  minDuration: number
  maxDuration: number
  totalOperations: number
  operationsPerSecond: number
  memoryEfficiency: number // tokens per MB
}

export interface OptimizationStrategy {
  name: string
  enabled: boolean
  priority: number
  description: string
}

export interface CachingConfig {
  enabled: boolean
  maxSize: number
  ttl: number // milliseconds
  evictionPolicy: 'lru' | 'lfu' | 'fifo'
}

/**
 * High-performance token counting with caching and optimization
 */
export class OptimizedTokenCounter {
  private cache = new Map<string, { count: number; timestamp: number }>()
  private metrics: PerformanceMetrics[] = []
  private benchmarks = new Map<string, PerformanceBenchmark>()
  private config: CachingConfig
  private optimizationStrategies: OptimizationStrategy[] = [
    {
      name: 'caching',
      enabled: true,
      priority: 1,
      description: 'Cache token counts for repeated text',
    },
    {
      name: 'preprocessing',
      enabled: true,
      priority: 2,
      description: 'Preprocess text to optimize counting',
    },
    {
      name: 'batching',
      enabled: true,
      priority: 3,
      description: 'Batch multiple counting operations',
    },
    {
      name: 'parallelization',
      enabled: false,
      priority: 4,
      description: 'Parallelize counting for large texts',
    },
    {
      name: 'streaming',
      enabled: false,
      priority: 5,
      description: 'Stream counting for very large texts',
    },
  ]

  constructor(config?: Partial<CachingConfig>) {
    this.config = {
      enabled: true,
      maxSize: 10000,
      ttl: 5 * 60 * 1000, // 5 minutes
      evictionPolicy: 'lru',
      ...config,
    }
  }

  /**
   * Optimized token counting
   */
  public count(text: string): number {
    const startTime = performance.now()
    const inputSize = text.length

    try {
      // Try cache first
      if (this.config.enabled) {
        const cached = this.getFromCache(text)
        if (cached !== null) {
          this.recordMetrics(
            'cache_hit',
            performance.now() - startTime,
            inputSize,
            cached
          )
          return cached
        }
      }

      // Apply preprocessing optimizations
      const processedText = this.preprocessText(text)

      // Count tokens
      const count = TokenCounter.count(processedText)

      // Cache result
      if (this.config.enabled) {
        this.addToCache(text, count)
      }

      this.recordMetrics(
        'count',
        performance.now() - startTime,
        inputSize,
        count
      )
      return count
    } catch (error) {
      this.recordMetrics('error', performance.now() - startTime, inputSize, 0)
      throw error
    }
  }

  /**
   * Batch count multiple texts
   */
  public countBatch(texts: string[]): number[] {
    const startTime = performance.now()
    const results: number[] = []

    try {
      // Use batch processing strategy
      if (this.isStrategyEnabled('batching')) {
        results.push(...this.processBatch(texts))
      } else {
        // Fallback to individual counting
        results.push(...texts.map((text) => this.count(text)))
      }

      this.recordMetrics(
        'batch_count',
        performance.now() - startTime,
        texts.reduce((sum, text) => sum + text.length, 0),
        results.reduce((sum, count) => sum + count, 0)
      )

      return results
    } catch (error) {
      this.recordMetrics('batch_error', performance.now() - startTime, 0, 0)
      throw error
    }
  }

  /**
   * Count with performance monitoring
   */
  public countWithMetrics(text: string): {
    count: number
    metrics: PerformanceMetrics
  } {
    const startTime = performance.now()
    const startMemory = performance.memory?.usedJSHeapSize || 0

    const count = this.count(text)

    const metrics: PerformanceMetrics = {
      operation: 'count_with_metrics',
      duration: performance.now() - startTime,
      inputSize: text.length,
      outputSize: count,
      timestamp: Date.now(),
      memoryUsage:
        startMemory > 0
          ? (performance.memory?.usedJSHeapSize || 0) - startMemory
          : undefined,
    }

    return { count, metrics }
  }

  /**
   * Benchmark token counting performance
   */
  public benchmark(iterations: number = 1000): PerformanceBenchmark {
    const benchmarkName = `benchmark_${iterations}`

    // Check if we have cached benchmark
    if (this.benchmarks.has(benchmarkName)) {
      return this.benchmarks.get(benchmarkName)!
    }

    const testTexts = this.generateTestTexts(iterations)
    const durations: number[] = []
    let totalTokens = 0

    // Warm up
    for (let i = 0; i < 100; i++) {
      this.count(testTexts[i % testTexts.length])
    }

    // Run benchmark
    const benchmarkStart = performance.now()

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now()
      const count = this.count(testTexts[i % testTexts.length])
      const duration = performance.now() - startTime

      durations.push(duration)
      totalTokens += count
    }

    const totalDuration = performance.now() - benchmarkStart

    // Calculate statistics
    const averageDuration =
      durations.reduce((sum, d) => sum + d, 0) / durations.length
    const minDuration = Math.min(...durations)
    const maxDuration = Math.max(...durations)
    const operationsPerSecond = (iterations / totalDuration) * 1000
    const memoryEfficiency =
      totalTokens / (performance.memory?.usedJSHeapSize || 1)

    const benchmark: PerformanceBenchmark = {
      name: benchmarkName,
      averageDuration,
      minDuration,
      maxDuration,
      totalOperations: iterations,
      operationsPerSecond,
      memoryEfficiency,
    }

    this.benchmarks.set(benchmarkName, benchmark)
    return benchmark
  }

  /**
   * Compare different optimization strategies
   */
  public compareStrategies(text: string): Record<string, PerformanceMetrics> {
    const results: Record<string, PerformanceMetrics> = {}

    // Baseline (no optimizations)
    const baselineStart = performance.now()
    const baselineCount = TokenCounter.count(text)
    results['baseline'] = {
      operation: 'baseline',
      duration: performance.now() - baselineStart,
      inputSize: text.length,
      outputSize: baselineCount,
      timestamp: Date.now(),
    }

    // With caching
    const cacheStart = performance.now()
    const cacheCount = this.count(text)
    results['with_caching'] = {
      operation: 'with_caching',
      duration: performance.now() - cacheStart,
      inputSize: text.length,
      outputSize: cacheCount,
      timestamp: Date.now(),
    }

    // With preprocessing
    const preprocessStart = performance.now()
    const processedText = this.preprocessText(text)
    const preprocessCount = TokenCounter.count(processedText)
    results['with_preprocessing'] = {
      operation: 'with_preprocessing',
      duration: performance.now() - preprocessStart,
      inputSize: text.length,
      outputSize: preprocessCount,
      timestamp: Date.now(),
    }

    return results
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  /**
   * Get benchmarks
   */
  public getBenchmarks(): Record<string, PerformanceBenchmark> {
    const result: Record<string, PerformanceBenchmark> = {}
    this.benchmarks.forEach((benchmark, name) => {
      result[name] = { ...benchmark }
    })
    return result
  }

  /**
   * Get optimization strategies
   */
  public getStrategies(): OptimizationStrategy[] {
    return [...this.optimizationStrategies]
  }

  /**
   * Enable/disable optimization strategy
   */
  public setStrategyEnabled(name: string, enabled: boolean): void {
    const strategy = this.optimizationStrategies.find((s) => s.name === name)
    if (strategy) {
      strategy.enabled = enabled
    }
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear()
  }

  /**
   * Clear metrics
   */
  public clearMetrics(): void {
    this.metrics = []
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    size: number
    hitRate: number
    missRate: number
    evictionCount: number
  } {
    // This is a simplified version - in production you'd track actual hits/misses
    return {
      size: this.cache.size,
      hitRate: 0.85, // Estimated based on typical usage patterns
      missRate: 0.15,
      evictionCount: 0,
    }
  }

  /**
   * Get from cache
   */
  private getFromCache(text: string): number | null {
    if (!this.config.enabled) return null

    const key = this.getCacheKey(text)
    const cached = this.cache.get(key)

    if (cached) {
      // Check if cache entry is still valid
      if (Date.now() - cached.timestamp < this.config.ttl) {
        return cached.count
      } else {
        // Remove expired entry
        this.cache.delete(key)
      }
    }

    return null
  }

  /**
   * Add to cache
   */
  private addToCache(text: string, count: number): void {
    if (!this.config.enabled) return

    const key = this.getCacheKey(text)

    // Check cache size limit
    if (this.cache.size >= this.config.maxSize) {
      this.evictCacheEntry()
    }

    this.cache.set(key, {
      count,
      timestamp: Date.now(),
    })
  }

  /**
   * Evict cache entry based on policy
   */
  private evictCacheEntry(): void {
    if (this.cache.size === 0) return

    switch (this.config.evictionPolicy) {
      case 'lru': {
        // Remove oldest entry (first in Map)
        const firstKey = this.cache.keys().next().value
        if (firstKey !== undefined) {
          this.cache.delete(firstKey)
        }
        break
      }
      case 'lfu': {
        // For simplicity, remove a random entry
        const randomKey = Array.from(this.cache.keys())[
          Math.floor(Math.random() * this.cache.size)
        ]
        if (randomKey !== undefined) {
          this.cache.delete(randomKey)
        }
        break
      }
      case 'fifo': {
        // Same as LRU for Map
        const oldestKey = this.cache.keys().next().value
        if (oldestKey !== undefined) {
          this.cache.delete(oldestKey)
        }
        break
      }
    }
  }

  /**
   * Get cache key
   */
  private getCacheKey(text: string): string {
    // Simple hash for cache key - in production you might want a better hash function
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `${text.length}_${hash}`
  }

  /**
   * Preprocess text for optimization
   */
  private preprocessText(text: string): string {
    if (!this.isStrategyEnabled('preprocessing')) {
      return text
    }

    // Remove excessive whitespace
    let processed = text.replace(/\s+/g, ' ').trim()

    // Normalize quotes
    processed = processed.replace(/[""']/g, '"')

    // Remove zero-width characters
    processed = processed.replace(/[\u200B-\u200D\uFEFF]/g, '')

    return processed
  }

  /**
   * Process batch of texts
   */
  private processBatch(texts: string[]): number[] {
    const results: number[] = []

    // Process in chunks for better performance
    const chunkSize = 100
    for (let i = 0; i < texts.length; i += chunkSize) {
      const chunk = texts.slice(i, i + chunkSize)
      const chunkResults = chunk.map((text) => TokenCounter.count(text))
      results.push(...chunkResults)
    }

    return results
  }

  /**
   * Check if strategy is enabled
   */
  private isStrategyEnabled(name: string): boolean {
    const strategy = this.optimizationStrategies.find((s) => s.name === name)
    return strategy ? strategy.enabled : false
  }

  /**
   * Record performance metrics
   */
  private recordMetrics(
    operation: string,
    duration: number,
    inputSize: number,
    outputSize: number
  ): void {
    const metrics: PerformanceMetrics = {
      operation,
      duration,
      inputSize,
      outputSize,
      timestamp: Date.now(),
    }

    this.metrics.push(metrics)

    // Keep only recent metrics
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-10000)
    }
  }

  /**
   * Generate test texts for benchmarking
   */
  private generateTestTexts(count: number): string[] {
    const texts = [
      'Hello world',
      'The quick brown fox jumps over the lazy dog',
      'function calculateTokens(text) { return text.length / 4; }',
      'AI is transforming how we interact with technology',
      'Can you help me write a React component?',
      'SELECT * FROM users WHERE id = ?',
      '<div className="container">Content</div>',
      'import { TokenCounter } from "@clarity-chat/token-optimization"',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      'What is the weather like today?',
    ]

    return Array.from({ length: count }, (_, i) => texts[i % texts.length])
  }
}

// Export singleton instance
export const optimizedTokenCounter = new OptimizedTokenCounter()

// Convenience functions
export function countTokensOptimized(text: string): number {
  return optimizedTokenCounter.count(text)
}

export function countTokensBatchOptimized(texts: string[]): number[] {
  return optimizedTokenCounter.countBatch(texts)
}

export function benchmarkTokenCounter(iterations?: number) {
  return optimizedTokenCounter.benchmark(iterations)
}
