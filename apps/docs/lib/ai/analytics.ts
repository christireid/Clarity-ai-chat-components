/**
 * Analytics Tracking
 *
 * Track usage patterns, costs, performance metrics, and user behavior
 * for the AI Documentation Assistant.
 */

import { Redis } from '@upstash/redis'
import { logger } from '@/lib/logger'

export interface QueryAnalytics {
  id: string
  query: string
  timestamp: string
  responseTime: number // milliseconds
  tokenCount: number
  cost: number // USD
  cached: boolean
  ragUsed: boolean
  sourcesFound: number
  feedbackType?: 'positive' | 'negative'
  isFollowUp: boolean
  topicDetected?: string
  model: string
  sessionId?: string
  userId?: string
}

export interface AnalyticsSummary {
  // Time period
  period: {
    start: string
    end: string
    durationDays: number
  }

  // Query metrics
  queries: {
    total: number
    unique: number
    averagePerDay: number
    averageResponseTime: number
    followUpRate: number
  }

  // Cost metrics
  costs: {
    total: number
    averagePerQuery: number
    estimatedMonthlyCost: number
    cacheSavings: number
  }

  // Cache performance
  cache: {
    hitRate: number
    hits: number
    misses: number
    estimatedSavings: number
  }

  // RAG metrics
  rag: {
    usageRate: number
    averageSourcesReturned: number
    averageRelevanceScore: number
  }

  // Feedback metrics
  feedback: {
    total: number
    positiveRate: number
    positive: number
    negative: number
  }

  // Popular topics
  popularTopics: Array<{
    topic: string
    count: number
    percentage: number
  }>

  // Popular queries
  popularQueries: Array<{
    query: string
    count: number
  }>

  // Model usage
  modelUsage: Record<string, number>
}

export interface AnalyticsStore {
  /** Track a query */
  trackQuery(analytics: Omit<QueryAnalytics, 'id' | 'timestamp'>): Promise<void>

  /** Get analytics summary */
  getSummary(startDate?: Date, endDate?: Date): Promise<AnalyticsSummary>

  /** Get recent queries */
  getRecentQueries(limit?: number): Promise<QueryAnalytics[]>

  /** Get popular topics */
  getPopularTopics(
    limit?: number
  ): Promise<Array<{ topic: string; count: number }>>

  /** Clear old analytics data */
  clearOldData(olderThanDays: number): Promise<void>
}

/**
 * Redis Analytics Store (Production)
 */
export class RedisAnalyticsStore implements AnalyticsStore {
  private redis: Redis
  private prefix: string

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set'
      )
    }

    this.redis = new Redis({ url, token })
    this.prefix = process.env.ANALYTICS_PREFIX || 'clarity-docs-analytics'
  }

  private getQueryKey(id: string): string {
    return `${this.prefix}:query:${id}`
  }

  private getQueryListKey(): string {
    return `${this.prefix}:queries`
  }

  private getTopicsKey(): string {
    return `${this.prefix}:topics`
  }

  private getMetricsKey(): string {
    return `${this.prefix}:metrics`
  }

  async trackQuery(
    analytics: Omit<QueryAnalytics, 'id' | 'timestamp'>
  ): Promise<void> {
    const id = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timestamp = new Date().toISOString()

    const fullAnalytics: QueryAnalytics = {
      ...analytics,
      id,
      timestamp,
    }

    // Store individual query
    await this.redis.set(
      this.getQueryKey(id),
      fullAnalytics,
      { ex: 30 * 24 * 60 * 60 } // 30 days retention
    )

    // Add to sorted set (by timestamp)
    await this.redis.zadd(this.getQueryListKey(), {
      score: Date.now(),
      member: id,
    })

    // Track topic if present
    if (analytics.topicDetected) {
      await this.redis.zincrby(this.getTopicsKey(), 1, analytics.topicDetected)
    }

    // Update aggregate metrics
    const metrics = {
      totalQueries: await this.redis.hincrby(
        this.getMetricsKey(),
        'totalQueries',
        1
      ),
      totalCost: await this.redis.hincrbyfloat(
        this.getMetricsKey(),
        'totalCost',
        analytics.cost
      ),
      totalTokens: await this.redis.hincrby(
        this.getMetricsKey(),
        'totalTokens',
        analytics.tokenCount
      ),
      totalResponseTime: await this.redis.hincrby(
        this.getMetricsKey(),
        'totalResponseTime',
        analytics.responseTime
      ),
    }

    if (analytics.cached) {
      await this.redis.hincrby(this.getMetricsKey(), 'cacheHits', 1)
    } else {
      await this.redis.hincrby(this.getMetricsKey(), 'cacheMisses', 1)
    }

    if (analytics.ragUsed) {
      await this.redis.hincrby(this.getMetricsKey(), 'ragQueries', 1)
      await this.redis.hincrby(
        this.getMetricsKey(),
        'totalSources',
        analytics.sourcesFound
      )
    }

    if (analytics.isFollowUp) {
      await this.redis.hincrby(this.getMetricsKey(), 'followUps', 1)
    }

    logger.debug(
      `📊 Analytics tracked: ${analytics.query.substring(0, 50)}... (${analytics.responseTime}ms, $${analytics.cost.toFixed(4)})`
    )
  }

  async getSummary(
    startDate?: Date,
    endDate?: Date
  ): Promise<AnalyticsSummary> {
    const end = endDate || new Date()
    const start = startDate || new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000) // Default: 7 days

    const durationDays = Math.ceil(
      (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
    )

    // Get aggregate metrics
    const metrics = await this.redis.hgetall(this.getMetricsKey())

    const totalQueries = parseInt((metrics?.totalQueries as string) || '0')
    const totalCost = parseFloat((metrics?.totalCost as string) || '0')
    const totalTokens = parseInt((metrics?.totalTokens as string) || '0')
    const totalResponseTime = parseInt(
      (metrics?.totalResponseTime as string) || '0'
    )
    const cacheHits = parseInt((metrics?.cacheHits as string) || '0')
    const cacheMisses = parseInt((metrics?.cacheMisses as string) || '0')
    const ragQueries = parseInt((metrics?.ragQueries as string) || '0')
    const totalSources = parseInt((metrics?.totalSources as string) || '0')
    const followUps = parseInt((metrics?.followUps as string) || '0')

    // Calculate cache hit rate
    const cacheTotal = cacheHits + cacheMisses
    const cacheHitRate = cacheTotal > 0 ? (cacheHits / cacheTotal) * 100 : 0
    const cacheSavings = cacheHits * 0.0015 // Estimated $0.0015 per cached query

    // Get popular topics
    // @ts-expect-error - zrevrange exists in Redis but not in type definitions
    const topics = await this.redis.zrevrange(this.getTopicsKey(), 0, 9, {
      withScores: true,
    })
    const popularTopics = []
    for (let i = 0; i < topics.length; i += 2) {
      const topic = topics[i] as string
      const count = topics[i + 1] as number
      popularTopics.push({
        topic,
        count,
        percentage: totalQueries > 0 ? (count / totalQueries) * 100 : 0,
      })
    }

    // Get recent queries for analysis
    // @ts-expect-error - zrevrange exists in Redis but not in type definitions
    const recentIds = await this.redis.zrevrange(this.getQueryListKey(), 0, 99)
    const queries: QueryAnalytics[] = []

    for (const id of recentIds) {
      const query = await this.redis.get(this.getQueryKey(id as string))
      if (query) {
        queries.push(query as QueryAnalytics)
      }
    }

    // Calculate popular queries
    const queryCount = new Map<string, number>()
    queries.forEach((q) => {
      const normalized = q.query.toLowerCase().trim()
      queryCount.set(normalized, (queryCount.get(normalized) || 0) + 1)
    })

    const popularQueries = Array.from(queryCount.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calculate feedback metrics
    const positiveCount = queries.filter(
      (q) => q.feedbackType === 'positive'
    ).length
    const negativeCount = queries.filter(
      (q) => q.feedbackType === 'negative'
    ).length
    const feedbackTotal = positiveCount + negativeCount
    const positiveRate =
      feedbackTotal > 0 ? (positiveCount / feedbackTotal) * 100 : 0

    // Calculate model usage
    const modelUsage: Record<string, number> = {}
    queries.forEach((q) => {
      modelUsage[q.model] = (modelUsage[q.model] || 0) + 1
    })

    return {
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        durationDays,
      },
      queries: {
        total: totalQueries,
        unique: queryCount.size,
        averagePerDay: totalQueries / durationDays,
        averageResponseTime:
          totalQueries > 0 ? totalResponseTime / totalQueries : 0,
        followUpRate: totalQueries > 0 ? (followUps / totalQueries) * 100 : 0,
      },
      costs: {
        total: totalCost,
        averagePerQuery: totalQueries > 0 ? totalCost / totalQueries : 0,
        estimatedMonthlyCost: (totalCost / durationDays) * 30,
        cacheSavings,
      },
      cache: {
        hitRate: cacheHitRate,
        hits: cacheHits,
        misses: cacheMisses,
        estimatedSavings: cacheSavings,
      },
      rag: {
        usageRate: totalQueries > 0 ? (ragQueries / totalQueries) * 100 : 0,
        averageSourcesReturned: ragQueries > 0 ? totalSources / ragQueries : 0,
        averageRelevanceScore: 0.85, // TODO: Calculate from actual scores
      },
      feedback: {
        total: feedbackTotal,
        positiveRate,
        positive: positiveCount,
        negative: negativeCount,
      },
      popularTopics,
      popularQueries,
      modelUsage,
    }
  }

  async getRecentQueries(limit = 50): Promise<QueryAnalytics[]> {
    // @ts-expect-error - zrevrange exists in Redis but not in type definitions
    const recentIds = await this.redis.zrevrange(
      this.getQueryListKey(),
      0,
      limit - 1
    )
    const queries: QueryAnalytics[] = []

    for (const id of recentIds) {
      const query = await this.redis.get(this.getQueryKey(id as string))
      if (query) {
        queries.push(query as QueryAnalytics)
      }
    }

    return queries
  }

  async getPopularTopics(
    limit = 10
  ): Promise<Array<{ topic: string; count: number }>> {
    // @ts-expect-error - zrevrange exists in Redis but not in type definitions
    const topics = await this.redis.zrevrange(
      this.getTopicsKey(),
      0,
      limit - 1,
      { withScores: true }
    )
    const result = []

    for (let i = 0; i < topics.length; i += 2) {
      result.push({
        topic: topics[i] as string,
        count: topics[i + 1] as number,
      })
    }

    return result
  }

  async clearOldData(olderThanDays: number): Promise<void> {
    const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000

    // Remove old queries from sorted set
    await this.redis.zremrangebyscore(this.getQueryListKey(), 0, cutoff)

    logger.debug(`🗑️  Cleared analytics data older than ${olderThanDays} days`)
  }
}

/**
 * Local Analytics Store (Development)
 */
export class LocalAnalyticsStore implements AnalyticsStore {
  private queries: QueryAnalytics[] = []
  private metrics = {
    totalQueries: 0,
    totalCost: 0,
    totalTokens: 0,
    totalResponseTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
    ragQueries: 0,
    totalSources: 0,
    followUps: 0,
  }

  async trackQuery(
    analytics: Omit<QueryAnalytics, 'id' | 'timestamp'>
  ): Promise<void> {
    const id = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timestamp = new Date().toISOString()

    const fullAnalytics: QueryAnalytics = {
      ...analytics,
      id,
      timestamp,
    }

    this.queries.push(fullAnalytics)

    // Update metrics
    this.metrics.totalQueries++
    this.metrics.totalCost += analytics.cost
    this.metrics.totalTokens += analytics.tokenCount
    this.metrics.totalResponseTime += analytics.responseTime

    if (analytics.cached) {
      this.metrics.cacheHits++
    } else {
      this.metrics.cacheMisses++
    }

    if (analytics.ragUsed) {
      this.metrics.ragQueries++
      this.metrics.totalSources += analytics.sourcesFound
    }

    if (analytics.isFollowUp) {
      this.metrics.followUps++
    }

    logger.debug(
      `📊 Analytics tracked (local): ${analytics.query.substring(0, 50)}...`
    )
  }

  async getSummary(
    startDate?: Date,
    endDate?: Date
  ): Promise<AnalyticsSummary> {
    const end = endDate || new Date()
    const start = startDate || new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Filter queries by date range
    const filteredQueries = this.queries.filter((q) => {
      const qDate = new Date(q.timestamp)
      return qDate >= start && qDate <= end
    })

    const durationDays = Math.ceil(
      (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
    )

    // Calculate metrics (same logic as Redis store)
    const totalQueries = this.metrics.totalQueries
    const cacheTotal = this.metrics.cacheHits + this.metrics.cacheMisses
    const cacheHitRate =
      cacheTotal > 0 ? (this.metrics.cacheHits / cacheTotal) * 100 : 0

    // Get popular topics
    const topicCount = new Map<string, number>()
    filteredQueries.forEach((q) => {
      if (q.topicDetected) {
        topicCount.set(
          q.topicDetected,
          (topicCount.get(q.topicDetected) || 0) + 1
        )
      }
    })

    const popularTopics = Array.from(topicCount.entries())
      .map(([topic, count]) => ({
        topic,
        count,
        percentage: totalQueries > 0 ? (count / totalQueries) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Get popular queries
    const queryCount = new Map<string, number>()
    filteredQueries.forEach((q) => {
      const normalized = q.query.toLowerCase().trim()
      queryCount.set(normalized, (queryCount.get(normalized) || 0) + 1)
    })

    const popularQueries = Array.from(queryCount.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Feedback metrics
    const positiveCount = filteredQueries.filter(
      (q) => q.feedbackType === 'positive'
    ).length
    const negativeCount = filteredQueries.filter(
      (q) => q.feedbackType === 'negative'
    ).length
    const feedbackTotal = positiveCount + negativeCount

    // Model usage
    const modelUsage: Record<string, number> = {}
    filteredQueries.forEach((q) => {
      modelUsage[q.model] = (modelUsage[q.model] || 0) + 1
    })

    return {
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        durationDays,
      },
      queries: {
        total: totalQueries,
        unique: queryCount.size,
        averagePerDay: totalQueries / durationDays,
        averageResponseTime:
          totalQueries > 0 ? this.metrics.totalResponseTime / totalQueries : 0,
        followUpRate:
          totalQueries > 0 ? (this.metrics.followUps / totalQueries) * 100 : 0,
      },
      costs: {
        total: this.metrics.totalCost,
        averagePerQuery:
          totalQueries > 0 ? this.metrics.totalCost / totalQueries : 0,
        estimatedMonthlyCost: (this.metrics.totalCost / durationDays) * 30,
        cacheSavings: this.metrics.cacheHits * 0.0015,
      },
      cache: {
        hitRate: cacheHitRate,
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses,
        estimatedSavings: this.metrics.cacheHits * 0.0015,
      },
      rag: {
        usageRate:
          totalQueries > 0 ? (this.metrics.ragQueries / totalQueries) * 100 : 0,
        averageSourcesReturned:
          this.metrics.ragQueries > 0
            ? this.metrics.totalSources / this.metrics.ragQueries
            : 0,
        averageRelevanceScore: 0.85,
      },
      feedback: {
        total: feedbackTotal,
        positiveRate:
          feedbackTotal > 0 ? (positiveCount / feedbackTotal) * 100 : 0,
        positive: positiveCount,
        negative: negativeCount,
      },
      popularTopics,
      popularQueries,
      modelUsage,
    }
  }

  async getRecentQueries(limit = 50): Promise<QueryAnalytics[]> {
    return this.queries.slice(-limit).reverse()
  }

  async getPopularTopics(
    limit = 10
  ): Promise<Array<{ topic: string; count: number }>> {
    const topicCount = new Map<string, number>()
    this.queries.forEach((q) => {
      if (q.topicDetected) {
        topicCount.set(
          q.topicDetected,
          (topicCount.get(q.topicDetected) || 0) + 1
        )
      }
    })

    return Array.from(topicCount.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  async clearOldData(olderThanDays: number): Promise<void> {
    const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000)
    this.queries = this.queries.filter((q) => new Date(q.timestamp) > cutoff)
  }
}

/**
 * Get the appropriate analytics store based on environment
 */
export function getAnalyticsStore(): AnalyticsStore {
  const useRedis =
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.NODE_ENV === 'production'

  if (useRedis) {
    logger.debug('Using Redis analytics store (Upstash)')
    return new RedisAnalyticsStore()
  } else {
    logger.debug('Using local analytics store (development mode)')
    return new LocalAnalyticsStore()
  }
}
