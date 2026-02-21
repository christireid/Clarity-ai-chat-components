/**
 * Prompt Metrics Logger
 *
 * Tracks performance and quality metrics for advanced prompting techniques
 */

import type { QueryComplexity } from './query-complexity-classifier'

export interface PromptMetrics {
  queryId: string
  timestamp: number
  complexity: QueryComplexity
  promptTokens: number
  completionTokens: number
  groundingConfidence: number
  citationCount: number
  hallucinationIssues: number
  responseTime: number
  technique: 'simple' | 'cot' | 'citation' | 'strict'
}

export interface MetricsStats {
  totalQueries: number
  avgGroundingConfidence: number
  avgCitationCount: number
  avgResponseTime: number
  hallucinationRate: number
  complexityDistribution: Record<QueryComplexity, number>
  techniqueDistribution: Record<string, number>
}

/**
 * Prompt Metrics Logger
 *
 * Singleton logger for tracking prompting performance
 */
export class PromptMetricsLogger {
  private metrics: PromptMetrics[] = []
  private readonly maxMetrics = 1000 // Keep last 1000 queries

  /**
   * Log a prompt metric
   */
  log(metric: PromptMetrics): void {
    this.metrics.push(metric)

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Prompt Metrics]', {
        complexity: metric.complexity,
        confidence: `${(metric.groundingConfidence * 100).toFixed(0)}%`,
        citations: metric.citationCount,
        responseTime: `${metric.responseTime}ms`,
      })
    }

    // Log to analytics service if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'prompt_metric', {
        complexity: metric.complexity,
        grounding_confidence: metric.groundingConfidence,
        response_time: metric.responseTime,
        citation_count: metric.citationCount,
        hallucination_issues: metric.hallucinationIssues,
      })
    }
  }

  /**
   * Get statistics for all logged metrics
   */
  getStats(): MetricsStats {
    if (this.metrics.length === 0) {
      return {
        totalQueries: 0,
        avgGroundingConfidence: 0,
        avgCitationCount: 0,
        avgResponseTime: 0,
        hallucinationRate: 0,
        complexityDistribution: {
          simple: 0,
          moderate: 0,
          complex: 0,
        },
        techniqueDistribution: {},
      }
    }

    const complexityDist: Record<string, number> = {}
    const techniqueDist: Record<string, number> = {}

    for (const metric of this.metrics) {
      complexityDist[metric.complexity] = (complexityDist[metric.complexity] || 0) + 1
      techniqueDist[metric.technique] = (techniqueDist[metric.technique] || 0) + 1
    }

    return {
      totalQueries: this.metrics.length,
      avgGroundingConfidence: this.avg(this.metrics.map((m) => m.groundingConfidence)),
      avgCitationCount: this.avg(this.metrics.map((m) => m.citationCount)),
      avgResponseTime: this.avg(this.metrics.map((m) => m.responseTime)),
      hallucinationRate:
        this.metrics.filter((m) => m.hallucinationIssues > 0).length / this.metrics.length,
      complexityDistribution: complexityDist as Record<QueryComplexity, number>,
      techniqueDistribution: techniqueDist,
    }
  }

  /**
   * Get recent metrics (last N)
   */
  getRecent(count: number = 10): PromptMetrics[] {
    return this.metrics.slice(-count)
  }

  /**
   * Get metrics for specific complexity level
   */
  getByComplexity(complexity: QueryComplexity): PromptMetrics[] {
    return this.metrics.filter((m) => m.complexity === complexity)
  }

  /**
   * Get metrics with high hallucination risk
   */
  getHighRisk(): PromptMetrics[] {
    return this.metrics.filter(
      (m) => m.groundingConfidence < 0.7 || m.hallucinationIssues > 0
    )
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = []
  }

  /**
   * Calculate average of numbers
   */
  private avg(numbers: number[]): number {
    if (numbers.length === 0) return 0
    return numbers.reduce((a, b) => a + b, 0) / numbers.length
  }

  /**
   * Export metrics as JSON
   */
  export(): string {
    return JSON.stringify(
      {
        stats: this.getStats(),
        recentMetrics: this.getRecent(50),
      },
      null,
      2
    )
  }
}

// Singleton instance
export const metricsLogger = new PromptMetricsLogger()

/**
 * React hook for accessing metrics in components
 */
export function usePromptMetrics() {
  return {
    getStats: () => metricsLogger.getStats(),
    getRecent: (count?: number) => metricsLogger.getRecent(count),
    getHighRisk: () => metricsLogger.getHighRisk(),
  }
}
