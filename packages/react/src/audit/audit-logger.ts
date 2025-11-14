/**
 * Audit Logger
 *
 * Simple, flexible audit logging for compliance and security.
 */

import type { AuditEvent, AuditConfig, AuditStorage, AuditQuery } from './types'

export class AuditLogger {
  private config: Required<AuditConfig>

  constructor(config: AuditConfig) {
    this.config = {
      captureUserAgent: config.captureUserAgent ?? true,
      captureIpAddress: config.captureIpAddress ?? true,
      retentionDays: config.retentionDays ?? 90,
      redactFields: config.redactFields ?? [],
      ...config,
    }
  }

  /**
   * Log an audit event
   */
  async log(
    action: string,
    data: Record<string, any>,
    options?: {
      userId?: string
      sessionId?: string
      tenantId?: string
      resource?: { type: string; id: string }
      result?: 'success' | 'failure' | 'partial'
      error?: string
    }
  ): Promise<AuditEvent> {
    const event: AuditEvent = {
      id: this.generateId(),
      action,
      userId: options?.userId,
      sessionId: options?.sessionId,
      tenantId: options?.tenantId,
      resource: options?.resource,
      data: this.redactSensitiveData(data),
      timestamp: Date.now(),
      result: options?.result || 'success',
      error: options?.error,
    }

    // Capture additional context
    if (this.config.captureUserAgent && typeof navigator !== 'undefined') {
      event.userAgent = navigator.userAgent
    }

    await this.config.storage.store(event)

    return event
  }

  /**
   * Query audit logs
   */
  async query(query: AuditQuery): Promise<AuditEvent[]> {
    return await this.config.storage.query(query)
  }

  /**
   * Get event by ID
   */
  async getEvent(id: string): Promise<AuditEvent | null> {
    return await this.config.storage.get(id)
  }

  /**
   * Clean up old events based on retention policy
   */
  async cleanup(): Promise<number> {
    const retentionMs = this.config.retentionDays * 24 * 60 * 60 * 1000
    const cutoff = Date.now() - retentionMs

    return await this.config.storage.deleteOlderThan(cutoff)
  }

  /**
   * Redact sensitive fields from data
   */
  private redactSensitiveData(data: Record<string, any>): Record<string, any> {
    if (this.config.redactFields.length === 0) {
      return data
    }

    const redacted = { ...data }

    for (const field of this.config.redactFields) {
      if (field in redacted) {
        redacted[field] = '[REDACTED]'
      }
    }

    return redacted
  }

  private generateId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }
}

/**
 * Memory Audit Storage (for development/testing)
 */
export class MemoryAuditStorage implements AuditStorage {
  private events: AuditEvent[] = []

  async store(event: AuditEvent): Promise<void> {
    this.events.push(event)
  }

  async query(query: AuditQuery): Promise<AuditEvent[]> {
    let results = [...this.events]

    if (query.userId) {
      results = results.filter((e) => e.userId === query.userId)
    }

    if (query.action) {
      results = results.filter((e) => e.action === query.action)
    }

    if (query.resourceType) {
      results = results.filter((e) => e.resource?.type === query.resourceType)
    }

    if (query.result) {
      results = results.filter((e) => e.result === query.result)
    }

    if (query.startTime) {
      results = results.filter((e) => e.timestamp >= query.startTime!)
    }

    if (query.endTime) {
      results = results.filter((e) => e.timestamp <= query.endTime!)
    }

    // Sort by timestamp (newest first)
    results.sort((a, b) => b.timestamp - a.timestamp)

    // Pagination
    const offset = query.offset || 0
    const limit = query.limit || 100

    return results.slice(offset, offset + limit)
  }

  async get(id: string): Promise<AuditEvent | null> {
    return this.events.find((e) => e.id === id) || null
  }

  async deleteOlderThan(timestamp: number): Promise<number> {
    const before = this.events.length
    this.events = this.events.filter((e) => e.timestamp >= timestamp)
    return before - this.events.length
  }

  /**
   * Get all events (for testing)
   */
  getAll(): AuditEvent[] {
    return [...this.events]
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events = []
  }
}

