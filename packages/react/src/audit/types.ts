/**
 * Audit Logging Types
 *
 * Track all actions for compliance, security, and debugging.
 * Bring your own storage (database, file, cloud service).
 */

export interface AuditEvent {
  /** Event ID */
  id: string
  /** Event type/action */
  action: string
  /** User who performed action */
  userId?: string
  /** Session ID */
  sessionId?: string
  /** Tenant ID (for multi-tenancy) */
  tenantId?: string
  /** Resource affected */
  resource?: {
    type: string
    id: string
  }
  /** Event data */
  data: Record<string, any>
  /** Timestamp */
  timestamp: number
  /** IP address */
  ipAddress?: string
  /** User agent */
  userAgent?: string
  /** Result of action */
  result: 'success' | 'failure' | 'partial'
  /** Error message if failed */
  error?: string
  /** Metadata */
  metadata?: Record<string, any>
}

export interface AuditQuery {
  /** Filter by user */
  userId?: string
  /** Filter by action */
  action?: string
  /** Filter by resource type */
  resourceType?: string
  /** Filter by result */
  result?: 'success' | 'failure' | 'partial'
  /** Start time */
  startTime?: number
  /** End time */
  endTime?: number
  /** Limit results */
  limit?: number
  /** Offset for pagination */
  offset?: number
}

export interface AuditStorage {
  /**
   * Store an audit event
   */
  store(event: AuditEvent): Promise<void>

  /**
   * Query audit events
   */
  query(query: AuditQuery): Promise<AuditEvent[]>

  /**
   * Get event by ID
   */
  get(id: string): Promise<AuditEvent | null>

  /**
   * Delete old events (for retention policies)
   */
  deleteOlderThan(timestamp: number): Promise<number>
}

export interface AuditConfig {
  /** Storage backend */
  storage: AuditStorage
  /** Auto-capture user agent */
  captureUserAgent?: boolean
  /** Auto-capture IP address */
  captureIpAddress?: boolean
  /** Retention period in days */
  retentionDays?: number
  /** Sensitive fields to redact */
  redactFields?: string[]
}

