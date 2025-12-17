/**
 * Security Observability Dashboard
 * 
 * Real-time monitoring and visualization of security events
 * Provides insights into threats, performance, and system health
 */

import { EventEmitter } from 'events'
import type { SecurityEvent } from './token-security'

export interface DashboardMetrics {
  totalRequests: number
  blockedRequests: number
  threatsDetected: number
  averageResponseTime: number
  currentRiskLevel: 'low' | 'medium' | 'high'
  activeUsers: number
  quarantineQueueSize: number
  auditLogSize: number
  complianceScore: number
}

export interface SecurityMetrics {
  timestamp: Date
  eventType: string
  riskLevel: 'low' | 'medium' | 'high'
  userId?: string
  sessionId?: string
  processingTime: number
  threatTypes: string[]
  complianceChecks: string[]
}

export interface DashboardConfig {
  enabled: boolean
  updateInterval: number // milliseconds
  retentionPeriod: number // milliseconds
  maxDataPoints: number
  enableRealTimeAlerts: boolean
  alertThresholds: {
    highRiskEvents: number
    responseTime: number
    errorRate: number
  }
}

/**
 * Real-time security observability dashboard
 */
export class SecurityDashboard extends EventEmitter {
  private metrics: DashboardMetrics
  private metricsHistory: SecurityMetrics[] = []
  private updateTimer: NodeJS.Timeout | null = null
  private startTime: Date
  private config: DashboardConfig
  
  constructor(config: Partial<DashboardConfig> = {}) {
    super()
    
    this.config = {
      enabled: config.enabled ?? true,
      updateInterval: config.updateInterval ?? 5000, // 5 seconds
      retentionPeriod: config.retentionPeriod ?? 3600000, // 1 hour
      maxDataPoints: config.maxDataPoints ?? 1000,
      enableRealTimeAlerts: config.enableRealTimeAlerts ?? true,
      alertThresholds: {
        highRiskEvents: config.alertThresholds?.highRiskEvents ?? 10,
        responseTime: config.alertThresholds?.responseTime ?? 1000, // 1 second
        errorRate: config.alertThresholds?.errorRate ?? 0.05 // 5%
      }
    }
    
    this.startTime = new Date()
    this.metrics = this.getInitialMetrics()
    
    if (this.config.enabled) {
      this.startMonitoring()
    }
  }

  /**
   * Record a security event and update metrics
   */
  recordEvent(event: SecurityEvent, processingTime: number): void {
    if (!this.config.enabled) return

    // Update basic metrics
    this.metrics.totalRequests++
    
    if (event.riskLevel === 'high') {
      this.metrics.blockedRequests++
      this.metrics.threatsDetected++
      this.metrics.currentRiskLevel = 'high'
    } else if (event.riskLevel === 'medium' && this.metrics.currentRiskLevel !== 'high') {
      this.metrics.currentRiskLevel = 'medium'
    }

    // Update response time (moving average)
    const currentAvg = this.metrics.averageResponseTime
    const newAvg = (currentAvg * (this.metrics.totalRequests - 1) + processingTime) / this.metrics.totalRequests
    this.metrics.averageResponseTime = newAvg

    // Add to history
    const securityMetric: SecurityMetrics = {
      timestamp: new Date(),
      eventType: event.type,
      riskLevel: event.riskLevel,
      userId: event.userId,
      sessionId: event.sessionId,
      processingTime,
      threatTypes: event.checks,
      complianceChecks: event.checks
    }

    this.metricsHistory.push(securityMetric)
    
    // Check for alerts
    if (this.config.enableRealTimeAlerts) {
      this.checkForAlerts(securityMetric)
    }

    // Clean up old data
    this.cleanupOldData()

    // Emit event for real-time updates
    this.emit('metricUpdate', this.metrics)
    this.emit('securityEvent', securityMetric)
  }

  /**
   * Update dashboard metrics
   */
  updateMetrics(newMetrics: Partial<DashboardMetrics>): void {
    if (!this.config.enabled) return

    this.metrics = {
      ...this.metrics,
      ...newMetrics
    }

    this.emit('metricUpdate', this.metrics)
  }

  /**
   * Get current dashboard state
   */
  getDashboardState(): {
    metrics: DashboardMetrics
    history: SecurityMetrics[]
    uptime: number
    config: DashboardConfig
  } {
    return {
      metrics: { ...this.metrics },
      history: [...this.metricsHistory],
      uptime: Date.now() - this.startTime.getTime(),
      config: { ...this.config }
    }
  }

  /**
   * Get real-time statistics
   */
  getRealTimeStats(): {
    requestsPerSecond: number
    threatsPerSecond: number
    averageRiskScore: number
    topThreatTypes: Array<{ type: string; count: number }>
    activeSessions: Set<string>
    performanceMetrics: {
      p50: number
      p95: number
      p99: number
    }
  } {
    const now = new Date()
    const lastMinute = new Date(now.getTime() - 60000)
    
    const recentEvents = this.metricsHistory.filter(
      event => event.timestamp > lastMinute
    )

    const requestsPerSecond = recentEvents.length / 60
    const threatsPerSecond = recentEvents.filter(e => e.riskLevel === 'high').length / 60
    
    const riskScores = this.metricsHistory.map(e => {
      switch (e.riskLevel) {
        case 'high': return 3
        case 'medium': return 2
        case 'low': return 1
        default: return 1
      }
    })
    const averageRiskScore = riskScores.length > 0 ? riskScores.reduce((a, b) => a + b, 0) / riskScores.length : 1

    // Top threat types
    const threatTypeCounts = new Map<string, number>()
    recentEvents.forEach(event => {
      event.threatTypes.forEach(type => {
        threatTypeCounts.set(type, (threatTypeCounts.get(type) || 0) + 1)
      })
    })
    const topThreatTypes = Array.from(threatTypeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Active sessions
    const activeSessions = new Set(recentEvents.map(e => e.sessionId).filter((id): id is string => !!id))

    // Performance percentiles
    const responseTimes = recentEvents.map(e => e.processingTime).sort((a, b) => a - b)
    const p50 = this.getPercentile(responseTimes, 0.5)
    const p95 = this.getPercentile(responseTimes, 0.95)
    const p99 = this.getPercentile(responseTimes, 0.99)

    return {
      requestsPerSecond,
      threatsPerSecond,
      averageRiskScore,
      topThreatTypes,
      activeSessions,
      performanceMetrics: { p50, p95, p99 }
    }
  }

  /**
   * Generate dashboard report
   */
  generateReport(): {
    summary: string
    recommendations: string[]
    alerts: string[]
    metrics: DashboardMetrics
    trends: {
      riskLevel: 'improving' | 'stable' | 'declining'
      performance: 'improving' | 'stable' | 'declining'
      threatLevel: 'increasing' | 'stable' | 'decreasing'
    }
  } {
    const stats = this.getRealTimeStats()
    const alerts: string[] = []
    const recommendations: string[] = []

    // Check for high response times
    if (stats.performanceMetrics.p95 > this.config.alertThresholds.responseTime) {
      alerts.push('High response times detected')
      recommendations.push('Optimize security processing pipeline')
    }

    // Check for high threat rate
    if (stats.threatsPerSecond > this.config.alertThresholds.highRiskEvents / 60) {
      alerts.push('High threat detection rate')
      recommendations.push('Review security rules and patterns')
    }

    // Check for system health
    if (this.metrics.currentRiskLevel === 'high') {
      alerts.push('System currently at high risk level')
      recommendations.push('Implement additional security measures')
    }

    // Generate trends
    const trends = this.calculateTrends()

    // Generate summary
    const summary = `Security Dashboard Report: ${this.metrics.totalRequests} requests processed, ${this.metrics.threatsDetected} threats detected, average response time ${this.metrics.averageResponseTime.toFixed(2)}ms`

    return {
      summary,
      recommendations: [
        ...recommendations,
        'Monitor system performance regularly',
        'Keep security rules updated',
        'Review quarantine queue periodically'
      ],
      alerts,
      metrics: this.metrics,
      trends
    }
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer)
      this.updateTimer = null
    }
    
    this.config.enabled = false
    this.emit('stopped')
  }

  /**
   * Start monitoring
   */
  private startMonitoring(): void {
    this.updateTimer = setInterval(() => {
      this.updateDashboard()
    }, this.config.updateInterval)

    this.emit('started')
  }

  /**
   * Update dashboard metrics
   */
  private updateDashboard(): void {
    // Update queue sizes
    this.metrics.quarantineQueueSize = Math.floor(Math.random() * 10) // Simulated
    this.metrics.auditLogSize = this.metricsHistory.length

    // Update active users
    const recentEvents = this.metricsHistory.filter(
      event => Date.now() - event.timestamp.getTime() < 300000 // Last 5 minutes
    )
    this.metrics.activeUsers = new Set(recentEvents.map(e => e.userId).filter(Boolean)).size

    // Update compliance score
    this.metrics.complianceScore = this.calculateComplianceScore()

    this.emit('dashboardUpdate', this.metrics)
  }

  /**
   * Check for real-time alerts
   */
  private checkForAlerts(metric: SecurityMetrics): void {
    if (metric.riskLevel === 'high' && metric.processingTime > this.config.alertThresholds.responseTime) {
      this.emit('securityAlert', {
        type: 'high_risk_slow_response',
        message: `High-risk event with slow response time: ${metric.processingTime}ms`,
        metric
      })
    }

    if (metric.processingTime > this.config.alertThresholds.responseTime * 2) {
      this.emit('performanceAlert', {
        type: 'slow_response',
        message: `Very slow response time detected: ${metric.processingTime}ms`,
        metric
      })
    }
  }

  /**
   * Clean up old data
   */
  private cleanupOldData(): void {
    const cutoff = new Date(Date.now() - this.config.retentionPeriod)
    this.metricsHistory = this.metricsHistory.filter(
      event => event.timestamp > cutoff
    )

    // Limit data points
    if (this.metricsHistory.length > this.config.maxDataPoints) {
      this.metricsHistory = this.metricsHistory.slice(-this.config.maxDataPoints)
    }
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(): number {
    // Simple compliance calculation based on recent events
    const recentEvents = this.metricsHistory.slice(-100)
    if (recentEvents.length === 0) return 1.0

    const compliantEvents = recentEvents.filter(e => 
      e.complianceChecks.length > 0 && e.riskLevel !== 'high'
    ).length

    return compliantEvents / recentEvents.length
  }

  /**
   * Calculate trends
   */
  private calculateTrends(): {
    riskLevel: 'improving' | 'stable' | 'declining'
    performance: 'improving' | 'stable' | 'declining'
    threatLevel: 'increasing' | 'stable' | 'decreasing'
  } {
    const recent = this.metricsHistory.slice(-50)
    const older = this.metricsHistory.slice(-100, -50)

    if (recent.length === 0 || older.length === 0) {
      return {
        riskLevel: 'stable',
        performance: 'stable',
        threatLevel: 'stable'
      }
    }

    const recentHighRisk = recent.filter(e => e.riskLevel === 'high').length
    const olderHighRisk = older.filter(e => e.riskLevel === 'high').length

    const recentAvgResponseTime = recent.reduce((sum, e) => sum + e.processingTime, 0) / recent.length
    const olderAvgResponseTime = older.reduce((sum, e) => sum + e.processingTime, 0) / older.length

    const recentThreats = recent.filter(e => e.riskLevel === 'high').length
    const olderThreats = older.filter(e => e.riskLevel === 'high').length

    return {
      riskLevel: recentHighRisk < olderHighRisk ? 'improving' : recentHighRisk > olderHighRisk ? 'declining' : 'stable',
      performance: recentAvgResponseTime < olderAvgResponseTime ? 'improving' : recentAvgResponseTime > olderAvgResponseTime ? 'declining' : 'stable',
      threatLevel: recentThreats < olderThreats ? 'decreasing' : recentThreats > olderThreats ? 'increasing' : 'stable'
    }
  }

  /**
   * Get percentile from sorted array
   */
  private getPercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0
    
    const index = Math.ceil(sortedArray.length * percentile) - 1
    return sortedArray[Math.max(0, Math.min(index, sortedArray.length - 1))]
  }

  /**
   * Get initial metrics
   */
  private getInitialMetrics(): DashboardMetrics {
    return {
      totalRequests: 0,
      blockedRequests: 0,
      threatsDetected: 0,
      averageResponseTime: 0,
      currentRiskLevel: 'low',
      activeUsers: 0,
      quarantineQueueSize: 0,
      auditLogSize: 0,
      complianceScore: 1.0
    }
  }
}

/**
 * Factory function to create security dashboard
 */
export function createSecurityDashboard(config: Partial<DashboardConfig> = {}): SecurityDashboard {
  const fullConfig: DashboardConfig = {
    enabled: config.enabled ?? true,
    updateInterval: config.updateInterval ?? 5000,
    retentionPeriod: config.retentionPeriod ?? 3600000,
    maxDataPoints: config.maxDataPoints ?? 1000,
    enableRealTimeAlerts: config.enableRealTimeAlerts ?? true,
    alertThresholds: {
      highRiskEvents: config.alertThresholds?.highRiskEvents ?? 10,
      responseTime: config.alertThresholds?.responseTime ?? 1000,
      errorRate: config.alertThresholds?.errorRate ?? 0.05
    }
  }

  return new SecurityDashboard(fullConfig)
}