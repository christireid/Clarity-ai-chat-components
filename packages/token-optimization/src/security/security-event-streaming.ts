/**
 * Security Event Streaming System
 * Real-time streaming of security events for monitoring and analysis
 */

import { EventEmitter } from 'events'
import type { SecurityEvent } from './token-security'

export interface SecurityStreamEvent extends SecurityEvent {
  id: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  category:
    | 'threat_detected'
    | 'rate_limited'
    | 'quarantined'
    | 'compliance_violation'
    | 'system_error'
  metadata?: Record<string, any>
}

export interface StreamSubscriber {
  id: string
  name: string
  callback: (event: SecurityStreamEvent) => void | Promise<void>
  filter?: {
    severity?: ('low' | 'medium' | 'high' | 'critical')[]
    category?: string[]
    userId?: string[]
  }
}

export interface StreamMetrics {
  totalEvents: number
  eventsPerSecond: number
  eventsPerMinute: number
  eventsPerHour: number
  subscribers: number
  queueSize: number
  lastEvent: Date | null
}

export class SecurityEventStreamer extends EventEmitter {
  private subscribers: Map<string, StreamSubscriber> = new Map()
  private eventQueue: SecurityStreamEvent[] = []
  private metrics: StreamMetrics = {
    totalEvents: 0,
    eventsPerSecond: 0,
    eventsPerMinute: 0,
    eventsPerHour: 0,
    subscribers: 0,
    queueSize: 0,
    lastEvent: null,
  }

  private metricsInterval: NodeJS.Timeout | null = null
  private readonly MAX_QUEUE_SIZE = 10000
  private readonly BATCH_SIZE = 100

  constructor() {
    super()
    this.startMetricsCollection()
  }

  // Stream security events to subscribers
  async streamEvent(event: SecurityStreamEvent): Promise<void> {
    // Add to queue for processing
    this.eventQueue.push(event)

    // Trim queue if it gets too large (prevent memory issues)
    if (this.eventQueue.length > this.MAX_QUEUE_SIZE) {
      this.eventQueue = this.eventQueue.slice(-this.MAX_QUEUE_SIZE)
    }

    // Update metrics
    this.updateMetrics(event)

    // Notify subscribers
    await this.notifySubscribers(event)

    // Emit for external listeners
    this.emit('security_event', event)
  }

  // Subscribe to security events
  subscribe(subscriber: StreamSubscriber): void {
    this.subscribers.set(subscriber.id, subscriber)
    this.metrics.subscribers = this.subscribers.size

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[SECURITY STREAM] New subscriber: ${subscriber.name} (${subscriber.id})`
      )
    }
  }

  // Unsubscribe from security events
  unsubscribe(subscriberId: string): void {
    const subscriber = this.subscribers.get(subscriberId)
    if (subscriber) {
      this.subscribers.delete(subscriberId)
      this.metrics.subscribers = this.subscribers.size

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[SECURITY STREAM] Unsubscribed: ${subscriber.name} (${subscriberId})`
        )
      }
    }
  }

  // Process event queue in batches
  async processEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0) return

    const eventsToProcess = this.eventQueue.splice(0, this.BATCH_SIZE)

    for (const event of eventsToProcess) {
      await this.notifySubscribers(event)
    }

    this.metrics.queueSize = this.eventQueue.length
  }

  private async notifySubscribers(event: SecurityStreamEvent): Promise<void> {
    const notifications: Promise<void>[] = []

    for (const subscriber of this.subscribers.values()) {
      if (this.shouldNotifySubscriber(subscriber, event)) {
        try {
          notifications.push(Promise.resolve(subscriber.callback(event)))
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            if (process.env.NODE_ENV === 'development') {
              console.error(
                `[SECURITY STREAM] Error notifying subscriber ${subscriber.id}:`,
                error
              )
            }
          }
        }
      }
    }

    // Wait for all notifications to complete
    try {
      await Promise.allSettled(notifications)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SECURITY STREAM] Error in batch notification:', error)
      }
    }
  }

  private shouldNotifySubscriber(
    subscriber: StreamSubscriber,
    event: SecurityStreamEvent
  ): boolean {
    if (!subscriber.filter) return true

    // Check severity filter
    if (
      subscriber.filter.severity &&
      !subscriber.filter.severity.includes(event.severity)
    ) {
      return false
    }

    // Check category filter
    if (
      subscriber.filter.category &&
      !subscriber.filter.category.includes(event.category)
    ) {
      return false
    }

    // Check userId filter
    if (
      subscriber.filter.userId &&
      !subscriber.filter.userId.includes(event.userId || '')
    ) {
      return false
    }

    return true
  }

  private updateMetrics(_event: SecurityStreamEvent): void {
    this.metrics.totalEvents++
    this.metrics.lastEvent = new Date()
    this.metrics.queueSize = this.eventQueue.length
  }

  private startMetricsCollection(): void {
    // Calculate rates every 10 seconds
    this.metricsInterval = setInterval(() => {
      this.calculateRates()
    }, 10000)
  }

  private calculateRates(): void {
    const now = Date.now()
    const oneSecondAgo = now - 1000
    const oneMinuteAgo = now - 60000
    const oneHourAgo = now - 3600000

    const recentEvents = this.eventQueue.filter(
      (e) => e.timestamp.getTime() > oneSecondAgo
    )
    const recentMinuteEvents = this.eventQueue.filter(
      (e) => e.timestamp.getTime() > oneMinuteAgo
    )
    const recentHourEvents = this.eventQueue.filter(
      (e) => e.timestamp.getTime() > oneHourAgo
    )

    this.metrics.eventsPerSecond = recentEvents.length
    this.metrics.eventsPerMinute = recentMinuteEvents.length
    this.metrics.eventsPerHour = recentHourEvents.length
  }

  getMetrics(): StreamMetrics {
    return { ...this.metrics }
  }

  getSubscribers(): StreamSubscriber[] {
    return Array.from(this.subscribers.values())
  }

  getQueueSize(): number {
    return this.eventQueue.length
  }

  shutdown(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval)
      this.metricsInterval = null
    }

    this.subscribers.clear()
    this.eventQueue = []
    this.removeAllListeners()

    if (process.env.NODE_ENV === 'development') {
      console.log('[SECURITY STREAM] Event streamer shutdown complete')
    }
  }
}

// Pre-built subscribers for common use cases
export class SecurityStreamSubscribers {
  // Console logger subscriber
  static consoleLogger(): StreamSubscriber {
    return {
      id: 'console-logger',
      name: 'Console Logger',
      callback: async (event: SecurityStreamEvent) => {
        const logMessage = `[SECURITY EVENT] ${event.severity.toUpperCase()} - ${event.category}: ${event.type}`

        switch (event.severity) {
          case 'critical':
            if (process.env.NODE_ENV === 'development') {
              console.error(logMessage, event)
            }
            break
          case 'high':
            if (process.env.NODE_ENV === 'development') {
              console.warn(logMessage, event)
            }
            break
          default:
            if (process.env.NODE_ENV === 'development') {
              console.log(logMessage, event)
            }
        }
      },
    }
  }

  // Alert system subscriber
  static alertSystem(
    alertCallback: (event: SecurityStreamEvent) => Promise<void>
  ): StreamSubscriber {
    return {
      id: 'alert-system',
      name: 'Alert System',
      filter: {
        severity: ['high', 'critical'],
      },
      callback: alertCallback,
    }
  }

  // Audit logger subscriber
  static auditLogger(
    logCallback: (event: SecurityStreamEvent) => Promise<void>
  ): StreamSubscriber {
    return {
      id: 'audit-logger',
      name: 'Audit Logger',
      callback: logCallback,
    }
  }

  // Metrics collector subscriber
  static metricsCollector(
    metricsCallback: (event: SecurityStreamEvent) => Promise<void>
  ): StreamSubscriber {
    return {
      id: 'metrics-collector',
      name: 'Metrics Collector',
      callback: metricsCallback,
    }
  }

  // Compliance monitor subscriber
  static complianceMonitor(
    complianceCallback: (event: SecurityStreamEvent) => Promise<void>
  ): StreamSubscriber {
    return {
      id: 'compliance-monitor',
      name: 'Compliance Monitor',
      filter: {
        category: ['compliance_violation'],
      },
      callback: complianceCallback,
    }
  }
}

/**
 * Create a new security event streamer instance.
 *
 * Factory function that initializes a SecurityEventStreamer with
 * metrics collection and event processing capabilities.
 *
 * @returns A new SecurityEventStreamer instance ready for subscriptions
 *
 * @example
 * ```typescript
 * const streamer = createSecurityEventStreamer()
 * streamer.subscribe(SecurityStreamSubscribers.consoleLogger())
 * await streamer.streamEvent(event)
 * ```
 */
export function createSecurityEventStreamer(): SecurityEventStreamer {
  return new SecurityEventStreamer()
}

/**
 * Convert a basic SecurityEvent into a streaming-compatible event.
 *
 * Enriches a security event with streaming metadata including unique ID,
 * timestamp, severity level, and category classification.
 *
 * @param originalEvent - The original SecurityEvent to transform
 * @param category - Event category for filtering and routing
 * @param severity - Severity level for prioritization
 * @returns A SecurityStreamEvent ready for streaming
 *
 * @example
 * ```typescript
 * const streamEvent = createStreamingSecurityEvent(
 *   securityEvent,
 *   'threat_detected',
 *   'high'
 * )
 * await streamer.streamEvent(streamEvent)
 * ```
 */
export function createStreamingSecurityEvent(
  originalEvent: SecurityEvent,
  category: SecurityStreamEvent['category'],
  severity: SecurityStreamEvent['severity']
): SecurityStreamEvent {
  return {
    ...originalEvent,
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    severity,
    category,
    metadata: {
      originalLength: originalEvent.originalLength,
      processedLength: originalEvent.processedLength,
      checks: originalEvent.checks,
    },
  }
}
