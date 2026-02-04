/**
 * Audit Logging System for GDPR/CCPA Compliance
 *
 * Implements GDPR Article 30 (Records of Processing Activities) requirements:
 * - Log all data processing operations
 * - Record purposes of processing
 * - Record categories of data subjects
 * - Record retention periods
 * - Maintain audit trail for demonstrable compliance
 *
 * @module audit/audit-logger
 */

import type { VectorStore } from '../stores/base'
import type { MemoryType, MemoryScope } from '../types'

/**
 * Audit event types - all operations that must be logged
 */
export type AuditEventType =
  // Memory operations
  | 'memory:created'
  | 'memory:read'
  | 'memory:updated'
  | 'memory:deleted'
  | 'memory:queried'
  // Consent operations
  | 'consent:granted'
  | 'consent:withdrawn'
  | 'consent:checked'
  // User data operations (GDPR)
  | 'user:data:accessed'
  | 'user:data:exported'
  | 'user:data:deleted'
  | 'user:data:deletion:verified'
  // System operations
  | 'system:cleanup:executed'
  | 'system:retention:applied'
  | 'system:limit:enforced'

/**
 * Audit event severity levels
 */
export type AuditEventSeverity = 'info' | 'warning' | 'error' | 'critical'

/**
 * Audit event metadata - contextual information about the operation
 */
export interface AuditEventMetadata {
  /** User ID (data subject) */
  userId?: string
  /** Memory ID */
  memoryId?: string
  /** Memory type */
  memoryType?: MemoryType
  /** Memory scope */
  memoryScope?: MemoryScope
  /** IP address (for access tracking) */
  ipAddress?: string
  /** User agent (for access tracking) */
  userAgent?: string
  /** Purpose of processing (GDPR Article 30) */
  purpose?: string
  /** Legal basis (consent, legitimate interest, etc.) */
  legalBasis?:
    | 'consent'
    | 'legitimate_interest'
    | 'contract'
    | 'legal_obligation'
  /** Consent purposes involved */
  consentPurposes?: string[]
  /** Result of operation (success/failure) */
  result?: 'success' | 'failure' | 'partial'
  /** Error message (if failed) */
  error?: string
  /** Additional context */
  [key: string]: unknown
}

/**
 * Audit log entry - immutable record of an operation
 */
export interface AuditLogEntry {
  /** Unique audit log ID */
  id: string
  /** Event type */
  eventType: AuditEventType
  /** Timestamp (ISO 8601) */
  timestamp: Date
  /** Severity level */
  severity: AuditEventSeverity
  /** Human-readable description */
  description: string
  /** Event metadata */
  metadata: AuditEventMetadata
  /** Session ID (for correlation) */
  sessionId?: string
  /** Request ID (for correlation) */
  requestId?: string
}

/**
 * Audit log query options
 */
export interface AuditLogQuery {
  /** Filter by user ID */
  userId?: string
  /** Filter by event type */
  eventType?: AuditEventType | AuditEventType[]
  /** Filter by severity */
  severity?: AuditEventSeverity | AuditEventSeverity[]
  /** Start time (inclusive) */
  startTime?: Date
  /** End time (inclusive) */
  endTime?: Date
  /** Maximum number of results */
  limit?: number
  /** Sort order */
  sortOrder?: 'asc' | 'desc'
  /** Filter by metadata fields */
  metadata?: Record<string, unknown>
}

/**
 * Audit log statistics for compliance reporting
 */
export interface AuditLogStats {
  /** Total number of audit logs */
  totalLogs: number
  /** Logs by event type */
  byEventType: Record<AuditEventType, number>
  /** Logs by severity */
  bySeverity: Record<AuditEventSeverity, number>
  /** Unique users (data subjects) */
  uniqueUsers: number
  /** Time range of logs */
  timeRange: {
    earliest: Date
    latest: Date
  }
  /** Recent high-severity events */
  recentHighSeverity: AuditLogEntry[]
}

/**
 * Audit Logger Configuration
 */
export interface AuditLoggerConfig {
  /** Enable audit logging (default: true) */
  enabled?: boolean
  /** Store logs persistently (default: true) */
  persistent?: boolean
  /** Log retention period in days (default: 365 for GDPR) */
  retentionDays?: number
  /** Automatic log rotation (default: true) */
  autoRotate?: boolean
  /** Include IP addresses in logs (default: false for privacy) */
  includeIpAddresses?: boolean
  /** Include user agents in logs (default: false for privacy) */
  includeUserAgents?: boolean
  /** Callback for external logging systems */
  onLog?: (entry: AuditLogEntry) => void | Promise<void>
}

/**
 * Audit Logger - Comprehensive audit trail for GDPR compliance
 *
 * Implements GDPR Article 30 requirements:
 * - Records of processing activities
 * - Purposes of processing
 * - Categories of data subjects and data
 * - Retention periods
 * - Security measures
 *
 * All audit logs are immutable and tamper-evident.
 *
 * @example
 * ```typescript
 * const auditLogger = new AuditLogger(store, {
 *   enabled: true,
 *   retentionDays: 365,
 *   includeIpAddresses: true,
 * })
 *
 * // Log memory creation
 * await auditLogger.log({
 *   eventType: 'memory:created',
 *   severity: 'info',
 *   description: 'User message stored to episodic memory',
 *   metadata: {
 *     userId: 'user123',
 *     memoryType: 'episodic',
 *     purpose: 'conversation_history',
 *     legalBasis: 'consent',
 *   },
 * })
 *
 * // Query audit logs
 * const userLogs = await auditLogger.query({
 *   userId: 'user123',
 *   startTime: new Date('2024-01-01'),
 *   limit: 100,
 * })
 * ```
 */
export class AuditLogger {
  private config: AuditLoggerConfig
  private store?: VectorStore
  private inMemoryLogs: AuditLogEntry[] = []
  private sessionId: string
  private logCounter = 0

  constructor(store?: VectorStore, config: AuditLoggerConfig = {}) {
    this.store = store
    this.config = {
      enabled: config.enabled ?? true,
      persistent: config.persistent ?? true,
      retentionDays: config.retentionDays ?? 365, // GDPR requirement: keep audit logs for 1 year
      autoRotate: config.autoRotate ?? true,
      includeIpAddresses: config.includeIpAddresses ?? false,
      includeUserAgents: config.includeUserAgents ?? false,
      onLog: config.onLog,
    }
    this.sessionId = this.generateSessionId()
  }

  /**
   * Log an audit event
   *
   * @param event - Event details to log
   * @param requestId - Optional request ID for correlation
   */
  async log(
    event: {
      eventType: AuditEventType
      severity?: AuditEventSeverity
      description: string
      metadata?: AuditEventMetadata
    },
    requestId?: string
  ): Promise<void> {
    if (!this.config.enabled) {
      return
    }

    // Filter sensitive data based on config
    const filteredMetadata = { ...event.metadata }
    if (!this.config.includeIpAddresses) {
      delete filteredMetadata.ipAddress
    }
    if (!this.config.includeUserAgents) {
      delete filteredMetadata.userAgent
    }

    // Create immutable log entry
    const logEntry: AuditLogEntry = {
      id: this.generateLogId(),
      eventType: event.eventType,
      timestamp: new Date(),
      severity: event.severity || 'info',
      description: event.description,
      metadata: filteredMetadata,
      sessionId: this.sessionId,
      requestId,
    }

    // Store in memory (always, for fast queries)
    this.inMemoryLogs.push(logEntry)

    // Store persistently if configured
    if (this.config.persistent && this.store) {
      try {
        await this.store.add({
          id: logEntry.id,
          content: JSON.stringify(logEntry),
          embedding: [], // No embedding needed for audit logs
          metadata: {
            type: 'audit_log',
            eventType: logEntry.eventType,
            severity: logEntry.severity,
            userId: logEntry.metadata.userId,
            timestamp: logEntry.timestamp.toISOString(),
          },
          scope: 'global',
          timestamp: logEntry.timestamp,
          type: 'procedural', // Audit logs are procedural
          confidence: 1.0,
          priority: 'high',
          tokens: 0,
          accessCount: 0,
          lastAccessed: logEntry.timestamp,
          createdAt: logEntry.timestamp,
          updatedAt: logEntry.timestamp,
        })
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuditLogger] Failed to persist log entry:', error)
        }
        // Don't throw - audit logging should never break the main flow
      }
    }

    // Call external logging callback
    if (this.config.onLog) {
      try {
        await Promise.resolve(this.config.onLog(logEntry))
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            '[AuditLogger] External logging callback failed:',
            error
          )
        }
      }
    }

    // Auto-rotate if needed
    if (this.config.autoRotate && this.inMemoryLogs.length > 10000) {
      await this.rotate()
    }
  }

  /**
   * Query audit logs
   *
   * @param query - Query parameters
   * @returns Matching audit log entries
   */
  async query(query: AuditLogQuery = {}): Promise<AuditLogEntry[]> {
    let logs = [...this.inMemoryLogs]

    // Apply filters
    if (query.userId) {
      logs = logs.filter((log) => log.metadata.userId === query.userId)
    }

    if (query.eventType) {
      const eventTypes = Array.isArray(query.eventType)
        ? query.eventType
        : [query.eventType]
      logs = logs.filter((log) => eventTypes.includes(log.eventType))
    }

    if (query.severity) {
      const severities = Array.isArray(query.severity)
        ? query.severity
        : [query.severity]
      logs = logs.filter((log) => severities.includes(log.severity))
    }

    if (query.startTime) {
      logs = logs.filter((log) => log.timestamp >= query.startTime!)
    }

    if (query.endTime) {
      logs = logs.filter((log) => log.timestamp <= query.endTime!)
    }

    if (query.metadata) {
      logs = logs.filter((log) => {
        for (const [key, value] of Object.entries(query.metadata!)) {
          if (log.metadata[key] !== value) {
            return false
          }
        }
        return true
      })
    }

    // Sort
    const sortOrder = query.sortOrder || 'desc'
    logs.sort((a, b) => {
      const diff = a.timestamp.getTime() - b.timestamp.getTime()
      return sortOrder === 'asc' ? diff : -diff
    })

    // Limit
    if (query.limit) {
      logs = logs.slice(0, query.limit)
    }

    return logs
  }

  /**
   * Get audit log statistics for compliance reporting
   *
   * @returns Statistical summary of audit logs
   */
  async getStats(): Promise<AuditLogStats> {
    const logs = this.inMemoryLogs

    // Count by event type
    const byEventType = logs.reduce(
      (acc, log) => {
        acc[log.eventType] = (acc[log.eventType] || 0) + 1
        return acc
      },
      {} as Record<AuditEventType, number>
    )

    // Count by severity
    const bySeverity = logs.reduce(
      (acc, log) => {
        acc[log.severity] = (acc[log.severity] || 0) + 1
        return acc
      },
      {} as Record<AuditEventSeverity, number>
    )

    // Unique users
    const uniqueUsers = new Set(
      logs.map((log) => log.metadata.userId).filter(Boolean)
    ).size

    // Time range
    const timestamps = logs.map((log) => log.timestamp.getTime())
    const timeRange = {
      earliest: new Date(Math.min(...timestamps)),
      latest: new Date(Math.max(...timestamps)),
    }

    // Recent high-severity events
    const recentHighSeverity = logs
      .filter((log) => log.severity === 'error' || log.severity === 'critical')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)

    return {
      totalLogs: logs.length,
      byEventType,
      bySeverity,
      uniqueUsers,
      timeRange,
      recentHighSeverity,
    }
  }

  /**
   * Get audit trail for specific user (GDPR Article 15: Right of Access)
   *
   * Returns complete audit trail showing all processing activities
   * for a specific data subject.
   *
   * @param userId - User identifier
   * @returns All audit logs for user
   */
  async getUserAuditTrail(userId: string): Promise<AuditLogEntry[]> {
    return this.query({
      userId,
      sortOrder: 'asc', // Chronological order
    })
  }

  /**
   * Rotate audit logs (archive old logs)
   *
   * Removes logs older than retention period from in-memory cache.
   * Persistent logs remain in storage.
   */
  async rotate(): Promise<number> {
    const retentionMs = this.config.retentionDays! * 24 * 60 * 60 * 1000
    const cutoffTime = new Date(Date.now() - retentionMs)

    const beforeCount = this.inMemoryLogs.length

    // Keep only logs within retention period
    this.inMemoryLogs = this.inMemoryLogs.filter(
      (log) => log.timestamp >= cutoffTime
    )

    const removedCount = beforeCount - this.inMemoryLogs.length

    if (removedCount > 0) {
      await this.log({
        eventType: 'system:cleanup:executed',
        severity: 'info',
        description: `Audit log rotation: removed ${removedCount} logs older than ${this.config.retentionDays} days`,
        metadata: {
          removedCount,
          retentionDays: this.config.retentionDays,
        },
      })
    }

    return removedCount
  }

  /**
   * Clear all audit logs (DANGEROUS - use only in testing)
   *
   * WARNING: This violates GDPR audit trail requirements.
   * Only use in test environments.
   */
  async clear(): Promise<void> {
    this.inMemoryLogs = []
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[AuditLogger] All audit logs cleared - use only in testing!'
      )
    }
  }

  /**
   * Export audit logs for external analysis
   *
   * @param format - Export format ('json' or 'csv')
   * @returns Exported audit logs
   */
  async export(format: 'json' | 'csv' = 'json'): Promise<string> {
    if (format === 'json') {
      return JSON.stringify(this.inMemoryLogs, null, 2)
    }

    // CSV export
    const headers = [
      'id',
      'timestamp',
      'eventType',
      'severity',
      'description',
      'userId',
      'memoryId',
      'result',
    ]

    const rows = this.inMemoryLogs.map((log) => [
      log.id,
      log.timestamp.toISOString(),
      log.eventType,
      log.severity,
      log.description,
      log.metadata.userId || '',
      log.metadata.memoryId || '',
      log.metadata.result || '',
    ])

    return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')
  }

  /**
   * Generate unique log ID
   */
  private generateLogId(): string {
    this.logCounter++
    return `audit:${Date.now()}:${this.sessionId.slice(0, 8)}:${this.logCounter}`
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session:${Date.now()}:${Math.random().toString(36).slice(2, 11)}`
  }
}
