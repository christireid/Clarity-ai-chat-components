/**
 * Comprehensive Quality Metrics for Prompt Engineering
 *
 * Tracks and analyzes:
 * 1. Answer quality (accuracy, completeness, clarity)
 * 2. Code example quality
 * 3. Explanation effectiveness
 * 4. Citation accuracy
 * 5. User satisfaction
 * 6. Performance metrics (latency, tokens)
 *
 * Provides actionable insights for prompt optimization.
 */

import type { QueryComplexity } from '../query-complexity-classifier'
import type { ValidationResult } from './response-validation'
import type { EnhancedClassification } from './enhanced-complexity-classifier'

export interface QualityMetrics {
  queryId: string
  timestamp: number
  query: string
  response: string

  // Classification
  classification: EnhancedClassification

  // Validation results
  validation: ValidationResult

  // Performance metrics
  performance: PerformanceMetrics

  // User feedback (optional)
  feedback?: UserFeedback

  // Computed quality scores
  scores: QualityScores
}

export interface PerformanceMetrics {
  responseTimeMs: number
  promptTokens: number
  completionTokens: number
  totalTokens: number
  model: string
  temperature: number
  cacheHit: boolean
}

export interface UserFeedback {
  rating: 1 | 2 | 3 | 4 | 5 // 1-5 stars
  helpful: boolean
  comment?: string
  reportedIssues?: FeedbackIssue[]
  timestamp: number
}

export interface FeedbackIssue {
  type: 'incorrect' | 'incomplete' | 'unclear' | 'outdated' | 'other'
  description: string
}

export interface QualityScores {
  overall: number // 0-100
  accuracy: number // 0-100
  completeness: number // 0-100
  clarity: number // 0-100
  codeQuality: number // 0-100
  efficiency: number // 0-100 (tokens per quality unit)
  userSatisfaction?: number // 0-100 (if feedback available)
}

export interface AggregateMetrics {
  period: string
  totalQueries: number

  // Quality trends
  averageScores: QualityScores
  scoresByComplexity: Record<QueryComplexity, QualityScores>

  // Performance trends
  averageResponseTime: number
  averageTokensUsed: number
  cacheHitRate: number

  // User satisfaction
  feedbackCount: number
  averageRating?: number
  helpfulRate?: number
  commonIssues: Array<{ type: string; count: number }>

  // Validation trends
  validationPassRate: number
  commonValidationIssues: Array<{ category: string; count: number }>

  // Model performance
  modelBreakdown: Record<
    string,
    {
      queries: number
      avgScore: number
      avgResponseTime: number
      avgTokens: number
    }
  >
}

/**
 * Calculate comprehensive quality scores
 */
export function calculateQualityScores(
  validation: ValidationResult,
  performance: PerformanceMetrics,
  feedback?: UserFeedback
): QualityScores {
  // Validation score (0-100)
  const validationScore = validation.score * 100

  // Accuracy score based on validation and citations
  const citationIssues = validation.issues.filter(
    (i) => i.category === 'citation_accuracy'
  ).length
  const technicalIssues = validation.issues.filter(
    (i) => i.category === 'technical_accuracy'
  ).length
  const accuracy = Math.max(
    0,
    100 - citationIssues * 10 - technicalIssues * 15
  )

  // Completeness score from validation checks
  const completenessChecks = validation.passed.filter((c) =>
    c.name.includes('complete') ||
    c.name.includes('example') ||
    c.name.includes('explanation')
  )
  const totalCompletenessWeight = completenessChecks.reduce(
    (sum, c) => sum + c.weight,
    0
  )
  const completeness = totalCompletenessWeight > 0
    ? (totalCompletenessWeight / completenessChecks.length) * 100
    : validationScore

  // Clarity score from explanation checks
  const clarityChecks = validation.passed.filter(
    (c) =>
      c.name.includes('explanation') ||
      c.name.includes('structure') ||
      c.name.includes('why')
  )
  const totalClarityWeight = clarityChecks.reduce((sum, c) => sum + c.weight, 0)
  const clarity = totalClarityWeight > 0
    ? (totalClarityWeight / clarityChecks.length) * 100
    : validationScore

  // Code quality score from code checks
  const codeChecks = validation.passed.filter((c) =>
    c.name.includes('code') ||
    c.name.includes('import') ||
    c.name.includes('type')
  )
  let codeQuality = 100
  if (codeChecks.length > 0) {
    const totalCodeWeight = codeChecks.reduce((sum, c) => sum + c.weight, 0)
    codeQuality = (totalCodeWeight / codeChecks.length) * 100
  }

  // Efficiency score (quality per token)
  // Higher is better: high quality with fewer tokens
  const qualityPerToken = validationScore / Math.max(performance.totalTokens, 1)
  const efficiency = Math.min(100, qualityPerToken * 10000) // Normalize to 0-100

  // User satisfaction (if feedback available)
  const userSatisfaction = feedback
    ? (feedback.rating / 5) * 100
    : undefined

  // Overall score: weighted average
  const overall =
    (accuracy * 0.25 +
      completeness * 0.25 +
      clarity * 0.2 +
      codeQuality * 0.15 +
      efficiency * 0.15) *
    (userSatisfaction ? (userSatisfaction / 100) : 1)

  return {
    overall: Math.round(overall),
    accuracy: Math.round(accuracy),
    completeness: Math.round(completeness),
    clarity: Math.round(clarity),
    codeQuality: Math.round(codeQuality),
    efficiency: Math.round(efficiency),
    userSatisfaction: userSatisfaction
      ? Math.round(userSatisfaction)
      : undefined,
  }
}

/**
 * Metrics tracker for quality analysis
 */
export class QualityMetricsTracker {
  private metrics: QualityMetrics[] = []
  private maxStoredMetrics = 10000

  /**
   * Log a query and its metrics
   */
  log(metrics: QualityMetrics): void {
    this.metrics.push(metrics)

    // Keep only recent metrics
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics = this.metrics.slice(-this.maxStoredMetrics)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(metrics)
    }

    // Log to external analytics
    this.logToAnalytics(metrics)
  }

  /**
   * Get aggregate metrics for a time period
   */
  getAggregateMetrics(periodDays: number = 7): AggregateMetrics {
    const cutoffTime = Date.now() - periodDays * 24 * 60 * 60 * 1000
    const periodMetrics = this.metrics.filter((m) => m.timestamp >= cutoffTime)

    if (periodMetrics.length === 0) {
      return this.getEmptyAggregateMetrics(`Last ${periodDays} days`)
    }

    // Average scores
    const averageScores = this.calculateAverageScores(periodMetrics)

    // Scores by complexity
    const scoresByComplexity = {
      simple: this.calculateAverageScores(
        periodMetrics.filter(
          (m) => m.classification.complexity === 'simple'
        )
      ),
      moderate: this.calculateAverageScores(
        periodMetrics.filter(
          (m) => m.classification.complexity === 'moderate'
        )
      ),
      complex: this.calculateAverageScores(
        periodMetrics.filter(
          (m) => m.classification.complexity === 'complex'
        )
      ),
    }

    // Performance averages
    const averageResponseTime =
      periodMetrics.reduce((sum, m) => sum + m.performance.responseTimeMs, 0) /
      periodMetrics.length

    const averageTokensUsed =
      periodMetrics.reduce((sum, m) => sum + m.performance.totalTokens, 0) /
      periodMetrics.length

    const cacheHits = periodMetrics.filter((m) => m.performance.cacheHit).length
    const cacheHitRate = cacheHits / periodMetrics.length

    // User satisfaction
    const withFeedback = periodMetrics.filter((m) => m.feedback)
    const feedbackCount = withFeedback.length
    const averageRating = feedbackCount > 0
      ? withFeedback.reduce((sum, m) => sum + (m.feedback?.rating || 0), 0) /
        feedbackCount
      : undefined

    const helpfulCount = withFeedback.filter((m) => m.feedback?.helpful).length
    const helpfulRate = feedbackCount > 0
      ? helpfulCount / feedbackCount
      : undefined

    // Common issues from feedback
    const issueTypes: Record<string, number> = {}
    withFeedback.forEach((m) => {
      m.feedback?.reportedIssues?.forEach((issue) => {
        issueTypes[issue.type] = (issueTypes[issue.type] || 0) + 1
      })
    })
    const commonIssues = Object.entries(issueTypes)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Validation trends
    const validationPasses = periodMetrics.filter((m) => m.validation.valid).length
    const validationPassRate = validationPasses / periodMetrics.length

    // Common validation issues
    const validationIssueCategories: Record<string, number> = {}
    periodMetrics.forEach((m) => {
      m.validation.issues.forEach((issue) => {
        validationIssueCategories[issue.category] =
          (validationIssueCategories[issue.category] || 0) + 1
      })
    })
    const commonValidationIssues = Object.entries(validationIssueCategories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Model breakdown
    const modelBreakdown: AggregateMetrics['modelBreakdown'] = {}
    periodMetrics.forEach((m) => {
      const model = m.performance.model
      if (!modelBreakdown[model]) {
        modelBreakdown[model] = {
          queries: 0,
          avgScore: 0,
          avgResponseTime: 0,
          avgTokens: 0,
        }
      }
      modelBreakdown[model].queries++
      modelBreakdown[model].avgScore += m.scores.overall
      modelBreakdown[model].avgResponseTime += m.performance.responseTimeMs
      modelBreakdown[model].avgTokens += m.performance.totalTokens
    })

    // Calculate averages for each model
    Object.keys(modelBreakdown).forEach((model) => {
      const data = modelBreakdown[model]
      data.avgScore /= data.queries
      data.avgResponseTime /= data.queries
      data.avgTokens /= data.queries
    })

    return {
      period: `Last ${periodDays} days`,
      totalQueries: periodMetrics.length,
      averageScores,
      scoresByComplexity,
      averageResponseTime,
      averageTokensUsed,
      cacheHitRate,
      feedbackCount,
      averageRating,
      helpfulRate,
      commonIssues,
      validationPassRate,
      commonValidationIssues,
      modelBreakdown,
    }
  }

  /**
   * Get metrics for specific query characteristics
   */
  getMetricsByComplexity(complexity: QueryComplexity): QualityMetrics[] {
    return this.metrics.filter(
      (m) => m.classification.complexity === complexity
    )
  }

  /**
   * Get low-performing queries for analysis
   */
  getLowPerformingQueries(threshold: number = 70): QualityMetrics[] {
    return this.metrics
      .filter((m) => m.scores.overall < threshold)
      .sort((a, b) => a.scores.overall - b.scores.overall)
  }

  /**
   * Get queries with negative feedback
   */
  getQueriesWithNegativeFeedback(): QualityMetrics[] {
    return this.metrics.filter(
      (m) =>
        m.feedback &&
        (m.feedback.rating <= 2 || m.feedback.helpful === false)
    )
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(periodDays?: number): string {
    const metricsToExport = periodDays
      ? this.metrics.filter(
          (m) =>
            m.timestamp >= Date.now() - periodDays * 24 * 60 * 60 * 1000
        )
      : this.metrics

    return JSON.stringify(
      {
        metrics: metricsToExport,
        aggregate: this.getAggregateMetrics(periodDays),
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    )
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = []
  }

  /**
   * Calculate average scores
   */
  private calculateAverageScores(metrics: QualityMetrics[]): QualityScores {
    if (metrics.length === 0) {
      return {
        overall: 0,
        accuracy: 0,
        completeness: 0,
        clarity: 0,
        codeQuality: 0,
        efficiency: 0,
      }
    }

    const sum = metrics.reduce(
      (acc, m) => ({
        overall: acc.overall + m.scores.overall,
        accuracy: acc.accuracy + m.scores.accuracy,
        completeness: acc.completeness + m.scores.completeness,
        clarity: acc.clarity + m.scores.clarity,
        codeQuality: acc.codeQuality + m.scores.codeQuality,
        efficiency: acc.efficiency + m.scores.efficiency,
        userSatisfaction:
          acc.userSatisfaction +
          (m.scores.userSatisfaction || 0),
      }),
      {
        overall: 0,
        accuracy: 0,
        completeness: 0,
        clarity: 0,
        codeQuality: 0,
        efficiency: 0,
        userSatisfaction: 0,
      }
    )

    const withFeedback = metrics.filter((m) => m.scores.userSatisfaction).length

    return {
      overall: Math.round(sum.overall / metrics.length),
      accuracy: Math.round(sum.accuracy / metrics.length),
      completeness: Math.round(sum.completeness / metrics.length),
      clarity: Math.round(sum.clarity / metrics.length),
      codeQuality: Math.round(sum.codeQuality / metrics.length),
      efficiency: Math.round(sum.efficiency / metrics.length),
      userSatisfaction: withFeedback > 0
        ? Math.round(sum.userSatisfaction / withFeedback)
        : undefined,
    }
  }

  /**
   * Get empty aggregate metrics
   */
  private getEmptyAggregateMetrics(period: string): AggregateMetrics {
    const emptyScores: QualityScores = {
      overall: 0,
      accuracy: 0,
      completeness: 0,
      clarity: 0,
      codeQuality: 0,
      efficiency: 0,
    }

    return {
      period,
      totalQueries: 0,
      averageScores: emptyScores,
      scoresByComplexity: {
        simple: emptyScores,
        moderate: emptyScores,
        complex: emptyScores,
      },
      averageResponseTime: 0,
      averageTokensUsed: 0,
      cacheHitRate: 0,
      feedbackCount: 0,
      commonIssues: [],
      validationPassRate: 0,
      commonValidationIssues: [],
      modelBreakdown: {},
    }
  }

  /**
   * Log to console (development only)
   */
  private logToConsole(metrics: QualityMetrics): void {
    console.log('[QualityMetrics]', {
      query: metrics.query.substring(0, 50) + '...',
      complexity: metrics.classification.complexity,
      overallScore: metrics.scores.overall,
      validation: metrics.validation.valid ? '✅' : '❌',
      responseTime: `${metrics.performance.responseTimeMs}ms`,
      tokens: metrics.performance.totalTokens,
    })
  }

  /**
   * Log to external analytics
   */
  private logToAnalytics(metrics: QualityMetrics): void {
    // Only in browser environment
    if (typeof window === 'undefined') return

    // Google Analytics
    if ('gtag' in window && typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('event', 'ai_quality_metric', {
        event_category: 'AI_Quality',
        complexity: metrics.classification.complexity,
        overall_score: metrics.scores.overall,
        validation_passed: metrics.validation.valid,
        response_time: metrics.performance.responseTimeMs,
        tokens: metrics.performance.totalTokens,
        cache_hit: metrics.performance.cacheHit,
      })
    }

    // PostHog
    if ('posthog' in window && typeof (window as any).posthog?.capture === 'function') {
      ;(window as any).posthog.capture('ai_response_quality', {
        ...metrics.scores,
        complexity: metrics.classification.complexity,
        validationPassed: metrics.validation.valid,
        responseTime: metrics.performance.responseTimeMs,
        tokens: metrics.performance.totalTokens,
      })
    }
  }
}

// Singleton instance
export const qualityMetricsTracker = new QualityMetricsTracker()

/**
 * Format aggregate metrics report
 */
export function formatAggregateMetricsReport(
  metrics: AggregateMetrics
): string {
  let report = `# Quality Metrics Report\n\n`
  report += `**Period**: ${metrics.period}\n`
  report += `**Total Queries**: ${metrics.totalQueries}\n\n`

  report += `## Overall Scores\n\n`
  report += `| Metric | Score |\n`
  report += `|--------|-------|\n`
  report += `| Overall | ${metrics.averageScores.overall}/100 |\n`
  report += `| Accuracy | ${metrics.averageScores.accuracy}/100 |\n`
  report += `| Completeness | ${metrics.averageScores.completeness}/100 |\n`
  report += `| Clarity | ${metrics.averageScores.clarity}/100 |\n`
  report += `| Code Quality | ${metrics.averageScores.codeQuality}/100 |\n`
  report += `| Efficiency | ${metrics.averageScores.efficiency}/100 |\n`

  if (metrics.averageScores.userSatisfaction) {
    report += `| User Satisfaction | ${metrics.averageScores.userSatisfaction}/100 |\n`
  }

  report += `\n## Performance\n\n`
  report += `- Average Response Time: ${Math.round(metrics.averageResponseTime)}ms\n`
  report += `- Average Tokens Used: ${Math.round(metrics.averageTokensUsed)}\n`
  report += `- Cache Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(1)}%\n`
  report += `- Validation Pass Rate: ${(metrics.validationPassRate * 100).toFixed(1)}%\n`

  if (metrics.feedbackCount > 0) {
    report += `\n## User Feedback\n\n`
    report += `- Total Feedback: ${metrics.feedbackCount}\n`
    if (metrics.averageRating) {
      report += `- Average Rating: ${metrics.averageRating.toFixed(1)}/5 ⭐\n`
    }
    if (metrics.helpfulRate) {
      report += `- Helpful Rate: ${(metrics.helpfulRate * 100).toFixed(1)}%\n`
    }

    if (metrics.commonIssues.length > 0) {
      report += `\n### Common Issues\n\n`
      metrics.commonIssues.forEach((issue) => {
        report += `- ${issue.type}: ${issue.count} reports\n`
      })
    }
  }

  report += `\n## Scores by Complexity\n\n`
  ;(['simple', 'moderate', 'complex'] as const).forEach((complexity) => {
    const scores = metrics.scoresByComplexity[complexity]
    report += `### ${complexity.toUpperCase()}\n`
    report += `- Overall: ${scores.overall}/100\n`
    report += `- Accuracy: ${scores.accuracy}/100\n`
    report += `- Completeness: ${scores.completeness}/100\n`
    report += `\n`
  })

  if (metrics.commonValidationIssues.length > 0) {
    report += `## Common Validation Issues\n\n`
    metrics.commonValidationIssues.forEach((issue) => {
      report += `- ${issue.category}: ${issue.count} occurrences\n`
    })
  }

  report += `\n## Model Performance\n\n`
  Object.entries(metrics.modelBreakdown).forEach(([model, data]) => {
    report += `### ${model}\n`
    report += `- Queries: ${data.queries}\n`
    report += `- Avg Score: ${Math.round(data.avgScore)}/100\n`
    report += `- Avg Response Time: ${Math.round(data.avgResponseTime)}ms\n`
    report += `- Avg Tokens: ${Math.round(data.avgTokens)}\n`
    report += `\n`
  })

  return report
}
