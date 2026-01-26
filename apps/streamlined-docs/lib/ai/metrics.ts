/**
 * Prompt Metrics Logger
 *
 * Tracks and analyzes prompt performance metrics including:
 * - Query complexity and response quality
 * - Citation coverage and grounding confidence
 * - Hallucination detection results
 * - Response times and token usage
 */

import type { QueryComplexity } from './complexity'

export interface PromptMetrics {
  queryId: string
  timestamp: number
  query: string
  complexity: QueryComplexity
  promptTokens: number
  completionTokens: number
  totalTokens: number
  groundingConfidence: number
  citationCount: number
  hallucinationIssues: number
  responseTime: number
  regenerated: boolean
  userFeedback?: 'positive' | 'negative' | null
}

export interface MetricsStats {
  totalQueries: number
  avgGroundingConfidence: number
  avgCitationCount: number
  avgResponseTime: number
  hallucinationRate: number
  regenerationRate: number
  complexityBreakdown: Record<QueryComplexity, number>
  avgTokensPerComplexity: Record<QueryComplexity, number>
  positiveeFeedbackRate: number
}

/**
 * Logger for tracking prompt metrics and performance
 */
export class PromptMetricsLogger {
  private metrics: PromptMetrics[] = []
  private maxStoredMetrics = 1000 // Keep last 1000 metrics in memory

  /**
   * Log a prompt execution metric
   */
  log(metric: PromptMetrics): void {
    this.metrics.push(metric)

    // Keep only recent metrics to prevent memory bloat
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics = this.metrics.slice(-this.maxStoredMetrics)
    }

    // Log to analytics service (if available)
    this.logToAnalytics(metric)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[PromptMetrics]', {
        query: metric.query.substring(0, 50) + '...',
        complexity: metric.complexity,
        confidence: metric.groundingConfidence.toFixed(2),
        citations: metric.citationCount,
        hallucinations: metric.hallucinationIssues,
        responseTime: `${metric.responseTime}ms`,
      })
    }
  }

  /**
   * Get aggregate statistics
   */
  getStats(): MetricsStats {
    if (this.metrics.length === 0) {
      return this.getEmptyStats()
    }

    const complexityBreakdown: Record<QueryComplexity, number> = {
      simple: 0,
      moderate: 0,
      complex: 0,
    }

    const tokensByComplexity: Record<QueryComplexity, number[]> = {
      simple: [],
      moderate: [],
      complex: [],
    }

    for (const metric of this.metrics) {
      complexityBreakdown[metric.complexity]++
      tokensByComplexity[metric.complexity].push(metric.totalTokens)
    }

    const avgTokensPerComplexity: Record<QueryComplexity, number> = {
      simple: this.avg(tokensByComplexity.simple),
      moderate: this.avg(tokensByComplexity.moderate),
      complex: this.avg(tokensByComplexity.complex),
    }

    const feedbackMetrics = this.metrics.filter((m) => m.userFeedback !== null)
    const positiveFeedback = feedbackMetrics.filter(
      (m) => m.userFeedback === 'positive'
    )

    return {
      totalQueries: this.metrics.length,
      avgGroundingConfidence: this.avg(
        this.metrics.map((m) => m.groundingConfidence)
      ),
      avgCitationCount: this.avg(this.metrics.map((m) => m.citationCount)),
      avgResponseTime: this.avg(this.metrics.map((m) => m.responseTime)),
      hallucinationRate:
        this.metrics.filter((m) => m.hallucinationIssues > 0).length /
        this.metrics.length,
      regenerationRate:
        this.metrics.filter((m) => m.regenerated).length / this.metrics.length,
      complexityBreakdown,
      avgTokensPerComplexity,
      positiveeFeedbackRate:
        feedbackMetrics.length > 0
          ? positiveFeedback.length / feedbackMetrics.length
          : 0,
    }
  }

  /**
   * Get metrics for a specific time range
   */
  getMetricsInRange(startTime: number, endTime: number): PromptMetrics[] {
    return this.metrics.filter(
      (m) => m.timestamp >= startTime && m.timestamp <= endTime
    )
  }

  /**
   * Get metrics by complexity level
   */
  getMetricsByComplexity(complexity: QueryComplexity): PromptMetrics[] {
    return this.metrics.filter((m) => m.complexity === complexity)
  }

  /**
   * Get metrics with hallucination issues
   */
  getHallucinatedResponses(): PromptMetrics[] {
    return this.metrics.filter((m) => m.hallucinationIssues > 0)
  }

  /**
   * Get low-confidence responses
   */
  getLowConfidenceResponses(threshold = 0.7): PromptMetrics[] {
    return this.metrics.filter((m) => m.groundingConfidence < threshold)
  }

  /**
   * Export metrics as JSON for analysis
   */
  exportMetrics(): string {
    return JSON.stringify(
      {
        metrics: this.metrics,
        stats: this.getStats(),
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    )
  }

  /**
   * Clear all stored metrics
   */
  clear(): void {
    this.metrics = []
  }

  /**
   * Calculate average of array of numbers
   */
  private avg(numbers: number[]): number {
    if (numbers.length === 0) return 0
    return numbers.reduce((a, b) => a + b, 0) / numbers.length
  }

  /**
   * Get empty stats object
   */
  private getEmptyStats(): MetricsStats {
    return {
      totalQueries: 0,
      avgGroundingConfidence: 0,
      avgCitationCount: 0,
      avgResponseTime: 0,
      hallucinationRate: 0,
      regenerationRate: 0,
      complexityBreakdown: {
        simple: 0,
        moderate: 0,
        complex: 0,
      },
      avgTokensPerComplexity: {
        simple: 0,
        moderate: 0,
        complex: 0,
      },
      positiveeFeedbackRate: 0,
    }
  }

  /**
   * Log to external analytics service (Google Analytics, PostHog, etc.)
   */
  private logToAnalytics(metric: PromptMetrics): void {
    // Only log in browser environment
    if (typeof window === 'undefined') return

    // Google Analytics (if available)
    if ('gtag' in window && typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('event', 'prompt_metric', {
        event_category: 'AI',
        event_label: metric.complexity,
        grounding_confidence: Math.round(metric.groundingConfidence * 100),
        citation_count: metric.citationCount,
        hallucination_issues: metric.hallucinationIssues,
        response_time: metric.responseTime,
        regenerated: metric.regenerated,
      })
    }

    // PostHog (if available)
    if (
      'posthog' in window &&
      typeof (window as any).posthog?.capture === 'function'
    ) {
      ;(window as any).posthog.capture('prompt_executed', {
        complexity: metric.complexity,
        groundingConfidence: metric.groundingConfidence,
        citationCount: metric.citationCount,
        hallucinationIssues: metric.hallucinationIssues,
        responseTime: metric.responseTime,
        totalTokens: metric.totalTokens,
        regenerated: metric.regenerated,
      })
    }
  }
}

// Singleton instance for app-wide metrics tracking
export const metricsLogger = new PromptMetricsLogger()

/**
 * Hook to access metrics logger in React components
 */
export function usePromptMetrics() {
  return {
    log: metricsLogger.log.bind(metricsLogger),
    getStats: metricsLogger.getStats.bind(metricsLogger),
    exportMetrics: metricsLogger.exportMetrics.bind(metricsLogger),
  }
}
