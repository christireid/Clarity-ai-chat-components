/**
 * Tool Execution Lifecycle Manager
 *
 * Manages the lifecycle of tool invocations with explicit states, events, and transitions.
 * Provides a predictable, debuggable flow for tool execution from request to completion.
 *
 * **Lifecycle Flow**:
 * ```
 * requested → pending_approval → approved → executing → completed
 *                              ↓                       ↓
 *                           rejected                 failed
 *                                                      ↓
 *                                                   timeout
 * ```
 *
 * **Events**:
 * - All state transitions emit events
 * - Events can be subscribed to for monitoring, logging, UI updates
 * - Events include full context for debugging
 *
 * @module core/tool-lifecycle
 */

import type {
  ToolDefinition,
  ToolExecutionContext,
  ToolArguments,
  ToolResult,
} from '../types/tool-definition'
import { generateToolCallId } from '../utils/id-generator'

// =============================================================================
// Lifecycle Status
// =============================================================================

/**
 * Tool call lifecycle status
 *
 * **States**:
 * - `idle`: No active tool call
 * - `requested`: LLM requested tool call, not yet processed
 * - `pending_approval`: Awaiting user approval (if requiresApproval: true)
 * - `approved`: User approved, ready to execute
 * - `rejected`: User rejected tool call
 * - `executing`: Tool is currently executing
 * - `completed`: Tool execution completed successfully
 * - `failed`: Tool execution failed with error
 * - `timeout`: Tool execution exceeded timeout
 * - `cancelled`: Tool execution was cancelled
 * - `cached`: Result retrieved from cache (no execution)
 */
export type ToolCallStatus =
  | 'idle'
  | 'requested'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'timeout'
  | 'cancelled'
  | 'cached'

/**
 * Valid state transitions
 */
const VALID_TRANSITIONS: Record<ToolCallStatus, ToolCallStatus[]> = {
  idle: ['requested'],
  requested: ['pending_approval', 'approved', 'executing', 'cached'],
  pending_approval: ['approved', 'rejected', 'cancelled', 'failed'],
  approved: ['executing', 'cached', 'cancelled'],
  rejected: ['idle'], // Can request again
  executing: ['completed', 'failed', 'timeout', 'cancelled', 'cached'],
  completed: ['idle'], // Can request again
  failed: ['idle'], // Can retry
  timeout: ['idle'], // Can retry
  cancelled: ['idle'], // Can retry
  cached: ['idle'], // Can request again
}

/**
 * Check if state transition is valid
 */
export function isValidTransition(
  from: ToolCallStatus,
  to: ToolCallStatus
): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}

// =============================================================================
// Tool Call Record
// =============================================================================

/**
 * Complete tool call record with lifecycle state
 */
export interface ToolCallRecord {
  /** Unique call ID */
  id: string

  /** Tool name */
  toolName: string

  /** Tool arguments */
  args: ToolArguments

  /** Current status */
  status: ToolCallStatus

  /** Execution context */
  context: ToolExecutionContext

  /** Timestamps */
  timestamps: {
    requested?: number
    approved?: number
    rejected?: number
    executionStarted?: number
    executionEnded?: number
  }

  /** Execution result (if completed) */
  result?: ToolResult

  /** Error (if failed) */
  error?: {
    message: string
    code?: string
    details?: unknown
  }

  /** Rejection reason (if rejected) */
  rejectionReason?: string

  /** Progress (0-100, for long-running tools) */
  progress?: number

  /** Status message */
  statusMessage?: string

  /** Whether result came from cache */
  cached?: boolean

  /** Execution duration in milliseconds */
  duration?: number

  /** Number of retry attempts */
  retryCount?: number
}

// =============================================================================
// Lifecycle Events
// =============================================================================

/**
 * Base lifecycle event
 */
interface BaseLifecycleEvent {
  /** Event type */
  type: string

  /** Tool call record */
  call: ToolCallRecord

  /** Event timestamp */
  timestamp: number
}

/**
 * Tool requested event
 */
export interface ToolRequestedEvent extends BaseLifecycleEvent {
  type: 'tool_requested'
  call: ToolCallRecord & { status: 'requested' }
}

/**
 * Tool pending approval event
 */
export interface ToolPendingApprovalEvent extends BaseLifecycleEvent {
  type: 'tool_pending_approval'
  call: ToolCallRecord & { status: 'pending_approval' }
  /** Tool definition for approval decision */
  toolDefinition: ToolDefinition
}

/**
 * Tool approved event
 */
export interface ToolApprovedEvent extends BaseLifecycleEvent {
  type: 'tool_approved'
  call: ToolCallRecord & { status: 'approved' }
  /** Who approved (user ID, auto, etc.) */
  approvedBy?: string
}

/**
 * Tool rejected event
 */
export interface ToolRejectedEvent extends BaseLifecycleEvent {
  type: 'tool_rejected'
  call: ToolCallRecord & { status: 'rejected' }
  /** Rejection reason */
  reason: string
  /** Who rejected */
  rejectedBy?: string
}

/**
 * Tool executing event
 */
export interface ToolExecutingEvent extends BaseLifecycleEvent {
  type: 'tool_executing'
  call: ToolCallRecord & { status: 'executing' }
}

/**
 * Tool progress event (for long-running tools)
 */
export interface ToolProgressEvent extends BaseLifecycleEvent {
  type: 'tool_progress'
  call: ToolCallRecord & { status: 'executing' }
  /** Progress percentage (0-100) */
  progress: number
  /** Optional status message */
  message?: string
}

/**
 * Tool completed event
 */
export interface ToolCompletedEvent extends BaseLifecycleEvent {
  type: 'tool_completed'
  call: ToolCallRecord & { status: 'completed' }
  /** Execution result */
  result: ToolResult
  /** Execution duration */
  duration: number
}

/**
 * Tool failed event
 */
export interface ToolFailedEvent extends BaseLifecycleEvent {
  type: 'tool_failed'
  call: ToolCallRecord & { status: 'failed' }
  /** Error that caused failure */
  error: Error
  /** Error code */
  errorCode?: string
}

/**
 * Tool timeout event
 */
export interface ToolTimeoutEvent extends BaseLifecycleEvent {
  type: 'tool_timeout'
  call: ToolCallRecord & { status: 'timeout' }
  /** Timeout duration */
  timeoutMs: number
}

/**
 * Tool cancelled event
 */
export interface ToolCancelledEvent extends BaseLifecycleEvent {
  type: 'tool_cancelled'
  call: ToolCallRecord & { status: 'cancelled' }
  /** Cancellation reason */
  reason?: string
}

/**
 * Tool cached event
 */
export interface ToolCachedEvent extends BaseLifecycleEvent {
  type: 'tool_cached'
  call: ToolCallRecord & { status: 'cached' }
  /** Cached result */
  result: ToolResult
}

/**
 * All lifecycle events (discriminated union)
 */
export type ToolLifecycleEvent =
  | ToolRequestedEvent
  | ToolPendingApprovalEvent
  | ToolApprovedEvent
  | ToolRejectedEvent
  | ToolExecutingEvent
  | ToolProgressEvent
  | ToolCompletedEvent
  | ToolFailedEvent
  | ToolTimeoutEvent
  | ToolCancelledEvent
  | ToolCachedEvent

// =============================================================================
// Event Listener Types
// =============================================================================

/**
 * Event listener function
 */
export type ToolLifecycleListener<
  E extends ToolLifecycleEvent = ToolLifecycleEvent,
> = (event: E) => void | Promise<void>

/**
 * Event listener map
 */
export interface ToolLifecycleListeners {
  tool_requested?: ToolLifecycleListener<ToolRequestedEvent>[]
  tool_pending_approval?: ToolLifecycleListener<ToolPendingApprovalEvent>[]
  tool_approved?: ToolLifecycleListener<ToolApprovedEvent>[]
  tool_rejected?: ToolLifecycleListener<ToolRejectedEvent>[]
  tool_executing?: ToolLifecycleListener<ToolExecutingEvent>[]
  tool_progress?: ToolLifecycleListener<ToolProgressEvent>[]
  tool_completed?: ToolLifecycleListener<ToolCompletedEvent>[]
  tool_failed?: ToolLifecycleListener<ToolFailedEvent>[]
  tool_timeout?: ToolLifecycleListener<ToolTimeoutEvent>[]
  tool_cancelled?: ToolLifecycleListener<ToolCancelledEvent>[]
  tool_cached?: ToolLifecycleListener<ToolCachedEvent>[]
  all?: ToolLifecycleListener<ToolLifecycleEvent>[]
}

// =============================================================================
// Audit Logging
// =============================================================================

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  /** Sequential entry ID */
  entryId: string

  /** Event that was logged */
  event: ToolLifecycleEvent

  /** When the entry was logged */
  loggedAt: number

  /** Session/user context */
  context?: {
    sessionId?: string
    userId?: string
    environment?: string
  }
}

/**
 * Audit log configuration
 */
export interface AuditLogConfig {
  /** Enable audit logging */
  enabled?: boolean

  /** Maximum audit log entries to keep in memory (default: 1000) */
  maxEntries?: number

  /** Include sensitive data in audit logs (default: false) */
  includeSensitiveData?: boolean

  /** Custom audit log persister */
  persister?: AuditLogPersister
}

/**
 * Interface for custom audit log persistence
 */
export interface AuditLogPersister {
  /** Persist an audit log entry */
  persist(entry: AuditLogEntry): Promise<void> | void

  /** Retrieve audit log entries */
  retrieve?(filter?: AuditLogFilter): Promise<AuditLogEntry[]> | AuditLogEntry[]
}

/**
 * Audit log filter
 */
export interface AuditLogFilter {
  toolName?: string
  status?: ToolCallStatus
  startTime?: number
  endTime?: number
  sessionId?: string
  userId?: string
}

// =============================================================================
// Lifecycle Manager
// =============================================================================

/**
 * Tool lifecycle manager
 *
 * Manages state transitions, events, and audit logging for tool executions.
 *
 * @example
 * ```typescript
 * const lifecycle = new ToolLifecycleManager({
 *   auditLog: {
 *     enabled: true,
 *     maxEntries: 1000,
 *     includeSensitiveData: false
 *   }
 * })
 *
 * // Subscribe to events
 * lifecycle.on('tool_requested', (event) => {
 *   console.log(`Tool requested: ${event.call.toolName}`)
 * })
 *
 * lifecycle.on('tool_completed', (event) => {
 *   console.log(`Tool completed: ${event.call.toolName}`, event.result)
 * })
 *
 * // Create tool call
 * const call = lifecycle.createToolCall('get_weather', { location: 'SF' })
 *
 * // Transition through lifecycle
 * lifecycle.markPendingApproval(call.id, toolDefinition)
 * lifecycle.approve(call.id)
 * lifecycle.markExecuting(call.id)
 * lifecycle.complete(call.id, weatherData)
 *
 * // Retrieve audit logs
 * const logs = lifecycle.getAuditLogs({ toolName: 'get_weather' })
 * ```
 */
export class ToolLifecycleManager {
  private calls = new Map<string, ToolCallRecord>()
  private listeners: ToolLifecycleListeners = {}
  private auditLog: AuditLogEntry[] = []
  private auditLogConfig: Required<Omit<AuditLogConfig, 'persister'>> & {
    persister?: AuditLogPersister
  }
  private nextEntryId = 1

  constructor(config?: { auditLog?: AuditLogConfig }) {
    this.auditLogConfig = {
      enabled: config?.auditLog?.enabled ?? false,
      maxEntries: config?.auditLog?.maxEntries ?? 1000,
      includeSensitiveData: config?.auditLog?.includeSensitiveData ?? false,
      persister: config?.auditLog?.persister,
    }
  }

  /**
   * Create a new tool call
   */
  createToolCall(
    toolName: string,
    args: ToolArguments,
    context?: Partial<ToolExecutionContext>
  ): ToolCallRecord {
    const id = context?.callId ?? generateToolCallId('call')
    const now = Date.now()

    const call: ToolCallRecord = {
      id,
      toolName,
      args,
      status: 'requested',
      context: {
        callId: id,
        startedAt: now,
        ...context,
      },
      timestamps: {
        requested: now,
      },
    }

    this.calls.set(id, call)
    this.emit({
      type: 'tool_requested',
      call: call as ToolCallRecord & { status: 'requested' },
      timestamp: now,
    })

    return call
  }

  /**
   * Mark tool as pending approval
   */
  markPendingApproval(callId: string, toolDefinition: ToolDefinition): void {
    const call = this.getCall(callId)
    this.transition(call, 'pending_approval')

    this.emit({
      type: 'tool_pending_approval',
      call: call as ToolCallRecord & { status: 'pending_approval' },
      toolDefinition,
      timestamp: Date.now(),
    })
  }

  /**
   * Approve tool execution
   */
  approve(callId: string, approvedBy?: string): void {
    const call = this.getCall(callId)
    this.transition(call, 'approved')
    call.timestamps.approved = Date.now()

    this.emit({
      type: 'tool_approved',
      call: call as ToolCallRecord & { status: 'approved' },
      approvedBy,
      timestamp: Date.now(),
    })
  }

  /**
   * Reject tool execution
   */
  reject(callId: string, reason: string, rejectedBy?: string): void {
    const call = this.getCall(callId)
    this.transition(call, 'rejected')
    call.timestamps.rejected = Date.now()
    call.rejectionReason = reason

    this.emit({
      type: 'tool_rejected',
      call: call as ToolCallRecord & { status: 'rejected' },
      reason,
      rejectedBy,
      timestamp: Date.now(),
    })
  }

  /**
   * Mark tool as executing
   */
  markExecuting(callId: string): void {
    const call = this.getCall(callId)
    this.transition(call, 'executing')
    call.timestamps.executionStarted = Date.now()

    this.emit({
      type: 'tool_executing',
      call: call as ToolCallRecord & { status: 'executing' },
      timestamp: Date.now(),
    })
  }

  /**
   * Update tool progress
   */
  updateProgress(callId: string, progress: number, message?: string): void {
    const call = this.getCall(callId)
    if (call.status !== 'executing') {
      throw new Error(`Cannot update progress for tool in ${call.status} state`)
    }

    call.progress = Math.max(0, Math.min(100, progress))
    call.statusMessage = message

    this.emit({
      type: 'tool_progress',
      call: call as ToolCallRecord & { status: 'executing' },
      progress: call.progress,
      message,
      timestamp: Date.now(),
    })
  }

  /**
   * Complete tool execution
   */
  complete(callId: string, result: ToolResult, cached = false): void {
    const call = this.getCall(callId)
    const now = Date.now()

    this.transition(call, cached ? 'cached' : 'completed')
    call.timestamps.executionEnded = now
    call.result = result
    call.cached = cached

    if (call.timestamps.executionStarted) {
      call.duration = now - call.timestamps.executionStarted
    }

    if (cached) {
      this.emit({
        type: 'tool_cached',
        call: call as ToolCallRecord & { status: 'cached' },
        result,
        timestamp: now,
      })
    } else {
      this.emit({
        type: 'tool_completed',
        call: call as ToolCallRecord & { status: 'completed' },
        result,
        duration: call.duration ?? 0,
        timestamp: now,
      })
    }
  }

  /**
   * Fail tool execution
   */
  fail(callId: string, error: Error, errorCode?: string): void {
    const call = this.getCall(callId)
    const now = Date.now()

    this.transition(call, 'failed')
    call.timestamps.executionEnded = now
    call.error = {
      message: error.message,
      code: errorCode,
      details: error,
    }

    if (call.timestamps.executionStarted) {
      call.duration = now - call.timestamps.executionStarted
    }

    this.emit({
      type: 'tool_failed',
      call: call as ToolCallRecord & { status: 'failed' },
      error,
      errorCode,
      timestamp: now,
    })
  }

  /**
   * Timeout tool execution
   */
  timeout(callId: string, timeoutMs: number): void {
    const call = this.getCall(callId)
    const now = Date.now()

    this.transition(call, 'timeout')
    call.timestamps.executionEnded = now

    if (call.timestamps.executionStarted) {
      call.duration = now - call.timestamps.executionStarted
    }

    this.emit({
      type: 'tool_timeout',
      call: call as ToolCallRecord & { status: 'timeout' },
      timeoutMs,
      timestamp: now,
    })
  }

  /**
   * Cancel tool execution
   */
  cancel(callId: string, reason?: string): void {
    const call = this.getCall(callId)
    const now = Date.now()

    this.transition(call, 'cancelled')
    call.timestamps.executionEnded = now

    if (call.timestamps.executionStarted) {
      call.duration = now - call.timestamps.executionStarted
    }

    this.emit({
      type: 'tool_cancelled',
      call: call as ToolCallRecord & { status: 'cancelled' },
      reason,
      timestamp: now,
    })
  }

  /**
   * Get tool call by ID
   */
  getCall(callId: string): ToolCallRecord {
    const call = this.calls.get(callId)
    if (!call) {
      throw new Error(`Tool call not found: ${callId}`)
    }
    return call
  }

  /**
   * Get all tool calls
   */
  getAllCalls(): ToolCallRecord[] {
    return Array.from(this.calls.values())
  }

  /**
   * Get calls by status
   */
  getCallsByStatus(status: ToolCallStatus): ToolCallRecord[] {
    return this.getAllCalls().filter((call) => call.status === status)
  }

  /**
   * Subscribe to lifecycle events
   */
  on<E extends ToolLifecycleEvent>(
    event: E['type'] | 'all',
    listener: ToolLifecycleListener<E>
  ): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]!.push(listener as any)

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners[event]
      if (listeners) {
        const index = listeners.indexOf(listener as any)
        if (index !== -1) {
          listeners.splice(index, 1)
        }
      }
    }
  }

  /**
   * Emit lifecycle event
   */
  private emit(event: ToolLifecycleEvent): void {
    // Log to audit log if enabled
    if (this.auditLogConfig.enabled) {
      this.logToAudit(event)
    }

    // Emit to specific event listeners
    const specificListeners = this.listeners[event.type]
    if (specificListeners) {
      for (const listener of specificListeners) {
        try {
          listener(event as any)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              `Error in lifecycle listener for ${event.type}:`,
              error
            )
          }
        }
      }
    }

    // Emit to 'all' listeners
    const allListeners = this.listeners.all
    if (allListeners) {
      for (const listener of allListeners) {
        try {
          listener(event)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error(`Error in lifecycle listener for 'all':`, error)
          }
        }
      }
    }
  }

  /**
   * Log event to audit log
   */
  private logToAudit(event: ToolLifecycleEvent): void {
    const entry: AuditLogEntry = {
      entryId: `audit_${this.nextEntryId++}`,
      event: this.sanitizeEventForAudit(event),
      loggedAt: Date.now(),
      context: {
        sessionId: event.call.context.sessionId,
        userId: event.call.context.userId,
      },
    }

    // Add to in-memory log
    this.auditLog.push(entry)

    // Trim if exceeds max entries (keep most recent)
    if (this.auditLog.length > this.auditLogConfig.maxEntries) {
      this.auditLog = this.auditLog.slice(-this.auditLogConfig.maxEntries)
    }

    // Persist if persister is configured
    if (this.auditLogConfig.persister) {
      try {
        this.auditLogConfig.persister.persist(entry)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error persisting audit log entry:', error)
        }
      }
    }
  }

  /**
   * Sanitize event for audit logging (remove sensitive data if configured)
   */
  private sanitizeEventForAudit(event: ToolLifecycleEvent): ToolLifecycleEvent {
    if (this.auditLogConfig.includeSensitiveData) {
      return event
    }

    // Create a sanitized copy
    const sanitized = JSON.parse(JSON.stringify(event))

    // Redact sensitive fields in args if they exist
    if (sanitized.call?.args) {
      const sensitiveKeys = [
        'password',
        'token',
        'apiKey',
        'secret',
        'credential',
      ]
      for (const key of Object.keys(sanitized.call.args)) {
        if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
          sanitized.call.args[key] = '[REDACTED]'
        }
      }
    }

    return sanitized
  }

  /**
   * Transition call to new status
   */
  private transition(call: ToolCallRecord, newStatus: ToolCallStatus): void {
    if (!isValidTransition(call.status, newStatus)) {
      throw new Error(
        `Invalid state transition: ${call.status} → ${newStatus} for tool ${call.toolName}`
      )
    }
    call.status = newStatus
  }

  /**
   * Get audit logs with optional filtering
   */
  getAuditLogs(filter?: AuditLogFilter): AuditLogEntry[] {
    if (!this.auditLogConfig.enabled) {
      return []
    }

    let logs = [...this.auditLog]

    if (filter) {
      logs = logs.filter((entry) => {
        const call = entry.event.call

        if (filter.toolName && call.toolName !== filter.toolName) {
          return false
        }

        if (filter.status && call.status !== filter.status) {
          return false
        }

        if (filter.startTime && entry.loggedAt < filter.startTime) {
          return false
        }

        if (filter.endTime && entry.loggedAt > filter.endTime) {
          return false
        }

        if (filter.sessionId && entry.context?.sessionId !== filter.sessionId) {
          return false
        }

        if (filter.userId && entry.context?.userId !== filter.userId) {
          return false
        }

        return true
      })
    }

    return logs
  }

  /**
   * Get audit log statistics
   */
  getAuditStats(): {
    enabled: boolean
    totalEntries: number
    byEventType: Record<string, number>
    byToolName: Record<string, number>
    byStatus: Record<string, number>
  } {
    if (!this.auditLogConfig.enabled) {
      return {
        enabled: false,
        totalEntries: 0,
        byEventType: {},
        byToolName: {},
        byStatus: {},
      }
    }

    const byEventType: Record<string, number> = {}
    const byToolName: Record<string, number> = {}
    const byStatus: Record<string, number> = {}

    for (const entry of this.auditLog) {
      byEventType[entry.event.type] = (byEventType[entry.event.type] || 0) + 1
      byToolName[entry.event.call.toolName] =
        (byToolName[entry.event.call.toolName] || 0) + 1
      byStatus[entry.event.call.status] =
        (byStatus[entry.event.call.status] || 0) + 1
    }

    return {
      enabled: true,
      totalEntries: this.auditLog.length,
      byEventType,
      byToolName,
      byStatus,
    }
  }

  /**
   * Export audit logs to JSON
   */
  exportAuditLogs(filter?: AuditLogFilter): string {
    const logs = this.getAuditLogs(filter)
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        totalEntries: logs.length,
        entries: logs,
      },
      null,
      2
    )
  }

  /**
   * Clear audit logs
   */
  clearAuditLogs(): void {
    this.auditLog = []
    this.nextEntryId = 1
  }

  /**
   * Clear all calls (for testing)
   */
  clear(): void {
    this.calls.clear()
  }

  /**
   * Remove call from tracking
   */
  removeCall(callId: string): boolean {
    return this.calls.delete(callId)
  }
}

// =============================================================================
// Singleton Instance (Optional)
// =============================================================================

/**
 * Global lifecycle manager instance
 * Optional: use this for simple use cases, or create your own instance for isolation
 */
export const globalToolLifecycle = new ToolLifecycleManager()

// =============================================================================
// Exports (already exported inline above)
// =============================================================================
// All exports are handled inline throughout the file
