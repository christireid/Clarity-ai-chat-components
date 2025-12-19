/**
 * Token Optimization Dashboard and Monitoring
 *
 * This module provides comprehensive monitoring and visualization for token optimization:
 * - Real-time token usage tracking
 * - Cost analysis and savings visualization
 * - Performance metrics and optimization effectiveness
 * - Alert system for token budget violations
 * - Historical analytics and trend analysis
 */

import { TokenCounter } from '@clarity-chat/token-optimization'

// Dashboard metrics and visualizations
export interface DashboardMetrics {
  // Token usage metrics
  totalTokensUsed: number
  tokensSaved: number
  compressionRatio: number

  // Cost metrics
  totalCost: number
  costSavings: number
  estimatedMonthlySavings: number

  // Performance metrics
  averageLatency: number
  cacheHitRate: number
  optimizationSuccessRate: number

  // Quality metrics
  averageQualityScore: number
  userSatisfaction: number
  errorRate: number
}

export interface TimeSeriesData {
  timestamp: number
  tokensUsed: number
  tokensSaved: number
  cost: number
  costSavings: number
  compressionRatio: number
  qualityScore: number
  latency: number
}

export interface ModelMetrics {
  modelName: string
  tokensUsed: number
  tokensSaved: number
  cost: number
  costSavings: number
  compressionRatio: number
  qualityScore: number
  usageCount: number
  averageLatency: number
}

export interface AlertConfig {
  type: 'budget' | 'quality' | 'performance' | 'cost'
  threshold: number
  comparison: 'greater' | 'less' | 'equals'
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
}

export interface TokenOptimizationDashboard {
  // Real-time metrics
  getRealTimeMetrics(): DashboardMetrics

  // Historical data
  getHistoricalData(
    timeRange: '1h' | '24h' | '7d' | '30d' | '90d'
  ): TimeSeriesData[]

  // Model-specific metrics
  getModelMetrics(): ModelMetrics[]

  // Cost analysis
  getCostAnalysis(): {
    totalSpent: number
    totalSaved: number
    roi: number
    costPerToken: number
    projectedSavings: number
  }

  // Performance insights
  getPerformanceInsights(): {
    topOptimizations: string[]
    bottlenecks: string[]
    recommendations: string[]
    trends: string[]
  }

  // Alert management
  getAlerts(): Alert[]
  configureAlert(config: AlertConfig): void

  // Export functionality
  exportData(format: 'json' | 'csv' | 'pdf'): Promise<string>
}

export interface Alert {
  id: string
  type: AlertConfig['type']
  message: string
  severity: AlertConfig['severity']
  timestamp: number
  acknowledged: boolean
  value: number
  threshold: number
}

// Real-time token optimization monitor
export class TokenOptimizationMonitor {
  private metrics: DashboardMetrics
  private historicalData: TimeSeriesData[]
  private modelMetrics: Map<string, ModelMetrics>
  private alerts: Alert[]
  private alertConfigs: Map<string, AlertConfig>
  private startTime: number

  constructor() {
    this.metrics = this.initializeMetrics()
    this.historicalData = []
    this.modelMetrics = new Map()
    this.alerts = []
    this.alertConfigs = new Map()
    this.startTime = Date.now()

    this.initializeDefaultAlerts()
  }

  /**
   * Initialize default dashboard metrics
   */
  private initializeMetrics(): DashboardMetrics {
    return {
      totalTokensUsed: 0,
      tokensSaved: 0,
      compressionRatio: 0,
      totalCost: 0,
      costSavings: 0,
      estimatedMonthlySavings: 0,
      averageLatency: 0,
      cacheHitRate: 0,
      optimizationSuccessRate: 0,
      averageQualityScore: 0,
      userSatisfaction: 0,
      errorRate: 0,
    }
  }

  /**
   * Initialize default alert configurations
   */
  private initializeDefaultAlerts(): void {
    const defaultAlerts: AlertConfig[] = [
      {
        type: 'budget',
        threshold: 1000000, // 1M tokens
        comparison: 'greater',
        message: 'Daily token budget exceeded',
        severity: 'high',
        enabled: true,
      },
      {
        type: 'quality',
        threshold: 0.7,
        comparison: 'less',
        message: 'Quality score below acceptable threshold',
        severity: 'medium',
        enabled: true,
      },
      {
        type: 'performance',
        threshold: 1000, // 1 second
        comparison: 'greater',
        message: 'Processing latency exceeds 1 second',
        severity: 'medium',
        enabled: true,
      },
      {
        type: 'cost',
        threshold: 100, // $100
        comparison: 'greater',
        message: 'Daily cost exceeds $100',
        severity: 'high',
        enabled: true,
      },
    ]

    defaultAlerts.forEach((alert) => {
      this.configureAlert(alert)
    })
  }

  /**
   * Record token usage event
   */
  async recordTokenUsage(
    originalText: string,
    optimizedText: string,
    modelName: string,
    strategy: string,
    qualityScore: number,
    latency: number
  ): Promise<void> {
    const originalTokens = await TokenCounter.count(originalText)
    const optimizedTokens = await TokenCounter.count(optimizedText)
    const tokensSaved = originalTokens - optimizedTokens
    const compressionRatio = optimizedTokens / originalTokens

    // Update metrics
    this.updateMetrics(tokensSaved, compressionRatio, qualityScore, latency)

    // Update model-specific metrics
    this.updateModelMetrics(
      modelName,
      originalTokens,
      optimizedTokens,
      compressionRatio,
      qualityScore,
      latency
    )

    // Record historical data
    this.recordHistoricalData(
      originalTokens,
      optimizedTokens,
      compressionRatio,
      qualityScore,
      latency
    )

    // Check for alerts
    this.checkAlerts({
      tokensSaved,
      compressionRatio,
      qualityScore,
      latency,
      modelName,
    })
  }

  /**
   * Update dashboard metrics
   */
  private updateMetrics(
    tokensSaved: number,
    compressionRatio: number,
    qualityScore: number,
    latency: number
  ): void {
    this.metrics.totalTokensUsed += tokensSaved
    this.metrics.tokensSaved += tokensSaved
    this.metrics.compressionRatio =
      (this.metrics.compressionRatio + compressionRatio) / 2
    this.metrics.averageQualityScore =
      (this.metrics.averageQualityScore + qualityScore) / 2
    this.metrics.averageLatency = (this.metrics.averageLatency + latency) / 2

    // Update success rate
    const successRate = qualityScore > 0.7 ? 1 : 0
    this.metrics.optimizationSuccessRate =
      (this.metrics.optimizationSuccessRate + successRate) / 2
  }

  /**
   * Update model-specific metrics
   */
  private updateModelMetrics(
    modelName: string,
    originalTokens: number,
    optimizedTokens: number,
    compressionRatio: number,
    qualityScore: number,
    latency: number
  ): void {
    let modelMetric = this.modelMetrics.get(modelName)

    if (!modelMetric) {
      modelMetric = {
        modelName,
        tokensUsed: 0,
        tokensSaved: 0,
        cost: 0,
        costSavings: 0,
        compressionRatio: 0,
        qualityScore: 0,
        usageCount: 0,
        averageLatency: 0,
      }
    }

    modelMetric.tokensUsed += originalTokens
    modelMetric.tokensSaved += originalTokens - optimizedTokens
    modelMetric.compressionRatio =
      (modelMetric.compressionRatio + compressionRatio) / 2
    modelMetric.qualityScore = (modelMetric.qualityScore + qualityScore) / 2
    modelMetric.usageCount++
    modelMetric.averageLatency = (modelMetric.averageLatency + latency) / 2

    this.modelMetrics.set(modelName, modelMetric)
  }

  /**
   * Record historical time series data
   */
  private recordHistoricalData(
    originalTokens: number,
    optimizedTokens: number,
    compressionRatio: number,
    qualityScore: number,
    latency: number
  ): void {
    const dataPoint: TimeSeriesData = {
      timestamp: Date.now(),
      tokensUsed: originalTokens,
      tokensSaved: originalTokens - optimizedTokens,
      cost: originalTokens * 0.001, // Simplified cost calculation
      costSavings: (originalTokens - optimizedTokens) * 0.001,
      compressionRatio,
      qualityScore,
      latency,
    }

    this.historicalData.push(dataPoint)

    // Keep only last 90 days of data
    const cutoffTime = Date.now() - 90 * 24 * 60 * 60 * 1000
    this.historicalData = this.historicalData.filter(
      (d) => d.timestamp > cutoffTime
    )
  }

  /**
   * Check for alert conditions
   */
  private checkAlerts(metrics: {
    tokensSaved: number
    compressionRatio: number
    qualityScore: number
    latency: number
    modelName: string
  }): void {
    for (const [id, config] of this.alertConfigs) {
      if (!config.enabled) continue

      let triggered = false
      let value = 0

      switch (config.type) {
        case 'budget':
          value = this.metrics.totalTokensUsed
          triggered =
            config.comparison === 'greater'
              ? value > config.threshold
              : value < config.threshold
          break
        case 'quality':
          value = metrics.qualityScore
          triggered =
            config.comparison === 'less'
              ? value < config.threshold
              : value > config.threshold
          break
        case 'performance':
          value = metrics.latency
          triggered =
            config.comparison === 'greater'
              ? value > config.threshold
              : value < config.threshold
          break
        case 'cost':
          value = this.metrics.totalCost
          triggered =
            config.comparison === 'greater'
              ? value > config.threshold
              : value < config.threshold
          break
      }

      if (triggered) {
        this.createAlert(id, config, value)
      }
    }
  }

  /**
   * Create alert
   */
  private createAlert(id: string, config: AlertConfig, value: number): void {
    const alert: Alert = {
      id: `${id}-${Date.now()}`,
      type: config.type,
      message: config.message,
      severity: config.severity,
      timestamp: Date.now(),
      acknowledged: false,
      value,
      threshold: config.threshold,
    }

    this.alerts.push(alert)

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100)
    }
  }

  /**
   * Configure alert
   */
  configureAlert(config: AlertConfig): void {
    const id = `${config.type}-${config.threshold}`
    this.alertConfigs.set(id, config)
  }

  /**
   * Get real-time dashboard metrics
   */
  getRealTimeMetrics(): DashboardMetrics {
    // Calculate derived metrics
    const uptime = Date.now() - this.startTime
    const dailyRate =
      this.metrics.tokensSaved / (uptime / (24 * 60 * 60 * 1000))
    this.metrics.estimatedMonthlySavings = dailyRate * 30

    return { ...this.metrics }
  }

  /**
   * Get historical data for specified time range
   */
  getHistoricalData(
    timeRange: '1h' | '24h' | '7d' | '30d' | '90d'
  ): TimeSeriesData[] {
    const now = Date.now()
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
    }

    const cutoff = now - ranges[timeRange]
    return this.historicalData.filter((d) => d.timestamp > cutoff)
  }

  /**
   * Get model-specific metrics
   */
  getModelMetrics(): ModelMetrics[] {
    return Array.from(this.modelMetrics.values()).sort(
      (a, b) => b.usageCount - a.usageCount
    )
  }

  /**
   * Get cost analysis
   */
  getCostAnalysis(): {
    totalSpent: number
    totalSaved: number
    roi: number
    costPerToken: number
    projectedSavings: number
  } {
    const totalSpent = this.metrics.totalCost
    const totalSaved = this.metrics.costSavings
    const roi = totalSaved > 0 ? (totalSaved / totalSpent) * 100 : 0
    const costPerToken = totalSpent / this.metrics.totalTokensUsed
    const projectedSavings = this.metrics.estimatedMonthlySavings

    return {
      totalSpent,
      totalSaved,
      roi,
      costPerToken,
      projectedSavings,
    }
  }

  /**
   * Get performance insights
   */
  getPerformanceInsights(): {
    topOptimizations: string[]
    bottlenecks: string[]
    recommendations: string[]
    trends: string[]
  } {
    const insights = {
      topOptimizations: this.getTopOptimizations(),
      bottlenecks: this.identifyBottlenecks(),
      recommendations: this.generateRecommendations(),
      trends: this.analyzeTrends(),
    }

    return insights
  }

  /**
   * Get alerts
   */
  getAlerts(): Alert[] {
    return this.alerts.filter((alert) => !alert.acknowledged)
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
    }
  }

  /**
   * Export data in specified format
   */
  async exportData(format: 'json' | 'csv' | 'pdf'): Promise<string> {
    const data = {
      metrics: this.getRealTimeMetrics(),
      historicalData: this.getHistoricalData('30d'),
      modelMetrics: this.getModelMetrics(),
      costAnalysis: this.getCostAnalysis(),
      insights: this.getPerformanceInsights(),
      alerts: this.alerts,
    }

    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2)
      case 'csv':
        return this.convertToCSV(data)
      case 'pdf':
        return await this.generatePDFReport(data)
      default:
        return JSON.stringify(data, null, 2)
    }
  }

  /**
   * Get top optimizations
   */
  private getTopOptimizations(): string[] {
    const optimizations: string[] = []

    if (this.metrics.compressionRatio < 0.7) {
      optimizations.push('High compression ratio achieved (>30% reduction)')
    }

    if (this.metrics.cacheHitRate > 0.8) {
      optimizations.push('Excellent cache hit rate (>80%)')
    }

    if (this.metrics.optimizationSuccessRate > 0.9) {
      optimizations.push('High optimization success rate (>90%)')
    }

    if (this.metrics.averageQualityScore > 0.85) {
      optimizations.push('High quality retention (>85%)')
    }

    return optimizations
  }

  /**
   * Identify bottlenecks
   */
  private identifyBottlenecks(): string[] {
    const bottlenecks: string[] = []

    if (this.metrics.averageLatency > 500) {
      bottlenecks.push('High processing latency (>500ms)')
    }

    if (this.metrics.cacheHitRate < 0.5) {
      bottlenecks.push('Low cache hit rate (<50%)')
    }

    if (this.metrics.errorRate > 0.05) {
      bottlenecks.push('High error rate (>5%)')
    }

    if (this.metrics.averageQualityScore < 0.7) {
      bottlenecks.push('Low quality scores (<70%)')
    }

    return bottlenecks
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = []

    if (this.metrics.cacheHitRate < 0.7) {
      recommendations.push('Improve caching strategy to increase hit rate')
    }

    if (this.metrics.averageLatency > 300) {
      recommendations.push('Optimize processing pipeline to reduce latency')
    }

    if (this.metrics.averageQualityScore < 0.8) {
      recommendations.push('Adjust compression parameters to improve quality')
    }

    if (this.modelMetrics.size > 5) {
      recommendations.push(
        'Consider consolidating to fewer models for better optimization'
      )
    }

    return recommendations
  }

  /**
   * Analyze trends
   */
  private analyzeTrends(): string[] {
    const trends: string[] = []
    const recentData = this.getHistoricalData('7d')

    if (recentData.length < 2) return trends

    const first = recentData[0]
    const last = recentData[recentData.length - 1]

    if (last.compressionRatio < first.compressionRatio) {
      trends.push('Improving compression ratios over time')
    }

    if (last.qualityScore > first.qualityScore) {
      trends.push('Improving quality scores over time')
    }

    if (last.latency < first.latency) {
      trends.push('Decreasing processing latency over time')
    }

    return trends
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: any): string {
    // Simplified CSV conversion
    const csvRows: string[] = []

    // Add headers
    csvRows.push(
      'timestamp,tokens_used,tokens_saved,compression_ratio,quality_score,latency'
    )

    // Add data rows
    data.historicalData.forEach((row: TimeSeriesData) => {
      csvRows.push(
        `${row.timestamp},${row.tokensUsed},${row.tokensSaved},${row.compressionRatio},${row.qualityScore},${row.latency}`
      )
    })

    return csvRows.join('\n')
  }

  /**
   * Generate PDF report
   */
  private async generatePDFReport(data: any): Promise<string> {
    // Simplified PDF generation - in production, use a proper PDF library
    const report = `
TOKEN OPTIMIZATION REPORT
Generated: ${new Date().toISOString()}

SUMMARY METRICS:
- Total Tokens Used: ${data.metrics.totalTokensUsed}
- Tokens Saved: ${data.metrics.tokensSaved}
- Compression Ratio: ${data.metrics.compressionRatio}
- Cost Savings: $${data.costAnalysis.totalSaved}

PERFORMANCE INSIGHTS:
${data.insights.topOptimizations.map((opt: string) => `- ${opt}`).join('\n')}

RECOMMENDATIONS:
${data.insights.recommendations.map((rec: string) => `- ${rec}`).join('\n')}
    `

    return report
  }
}

// Advanced analytics and insights
export class TokenOptimizationAnalytics {
  private monitor: TokenOptimizationMonitor
  private historicalData: TimeSeriesData[]

  constructor(monitor: TokenOptimizationMonitor) {
    this.monitor = monitor
    this.historicalData = []
  }

  /**
   * Analyze optimization effectiveness
   */
  analyzeEffectiveness(): {
    effectiveness: number
    trends: string[]
    recommendations: string[]
    benchmarkComparison: number
  } {
    const metrics = this.monitor.getRealTimeMetrics()
    const insights = this.monitor.getPerformanceInsights()

    // Calculate effectiveness score
    const effectiveness = this.calculateEffectivenessScore(metrics)

    return {
      effectiveness,
      trends: insights.trends,
      recommendations: insights.recommendations,
      benchmarkComparison: this.compareToBenchmark(metrics),
    }
  }

  /**
   * Predict future token usage
   */
  predictUsage(days: number): {
    predictedTokens: number
    confidence: number
    factors: string[]
  } {
    const historicalData = this.monitor.getHistoricalData('30d')

    if (historicalData.length < 7) {
      return {
        predictedTokens: 0,
        confidence: 0,
        factors: ['Insufficient historical data'],
      }
    }

    // Simple linear prediction
    const recentUsage = historicalData.slice(-7)
    const avgDailyUsage =
      recentUsage.reduce((sum, d) => sum + d.tokensUsed, 0) / recentUsage.length
    const predictedTokens = avgDailyUsage * days

    return {
      predictedTokens,
      confidence: 0.7, // Simplified confidence calculation
      factors: ['Historical usage patterns', 'Seasonal trends', 'Growth rate'],
    }
  }

  /**
   * Calculate effectiveness score
   */
  private calculateEffectivenessScore(metrics: DashboardMetrics): number {
    const factors = {
      compression: Math.max(0, 1 - metrics.compressionRatio),
      quality: metrics.averageQualityScore,
      success: metrics.optimizationSuccessRate,
      latency: Math.max(0, 1 - metrics.averageLatency / 1000),
    }

    const weights = {
      compression: 0.3,
      quality: 0.3,
      success: 0.2,
      latency: 0.2,
    }

    return (
      factors.compression * weights.compression +
      factors.quality * weights.quality +
      factors.success * weights.success +
      factors.latency * weights.latency
    )
  }

  /**
   * Compare to industry benchmark
   */
  private compareToBenchmark(metrics: DashboardMetrics): number {
    // Industry benchmark values
    const benchmark = {
      compressionRatio: 0.7,
      qualityScore: 0.85,
      successRate: 0.9,
      latency: 200,
    }

    const current = {
      compressionRatio: metrics.compressionRatio,
      qualityScore: metrics.averageQualityScore,
      successRate: metrics.optimizationSuccessRate,
      latency: metrics.averageLatency,
    }

    // Calculate comparison score
    const compressionComparison =
      current.compressionRatio < benchmark.compressionRatio ? 1.2 : 0.8
    const qualityComparison =
      current.qualityScore > benchmark.qualityScore ? 1.1 : 0.9
    const successComparison =
      current.successRate > benchmark.successRate ? 1.05 : 0.95
    const latencyComparison = current.latency < benchmark.latency ? 1.1 : 0.9

    return (
      compressionComparison *
      qualityComparison *
      successComparison *
      latencyComparison
    )
  }
}

// Convenience functions
export function createTokenMonitor(): TokenOptimizationMonitor {
  return new TokenOptimizationMonitor()
}

export function createTokenAnalytics(
  monitor: TokenOptimizationMonitor
): TokenOptimizationAnalytics {
  return new TokenOptimizationAnalytics(monitor)
}

export async function recordTokenUsage(
  monitor: TokenOptimizationMonitor,
  originalText: string,
  optimizedText: string,
  modelName: string,
  strategy: string,
  qualityScore: number,
  latency: number
): Promise<void> {
  return monitor.recordTokenUsage(
    originalText,
    optimizedText,
    modelName,
    strategy,
    qualityScore,
    latency
  )
}
