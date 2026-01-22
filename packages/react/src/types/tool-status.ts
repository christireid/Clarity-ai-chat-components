/**
 * Unified Tool Status Types
 *
 * Canonical status types that align tool execution lifecycle with UI display states.
 * Provides a single source of truth for tool call status across the entire system.
 *
 * **Alignment**:
 * - Lifecycle status (execution state)
 * - Invocation state (message format)
 * - UI display variant (component rendering)
 *
 * @module types/tool-status
 */

import type { ToolCallStatus } from '../core/tool-lifecycle'
import type { ToolInvocationState } from './tool-invocation'

// =============================================================================
// Status Mapping
// =============================================================================

/**
 * Map lifecycle status to invocation state
 *
 * **Mappings**:
 * - `idle` → (not in message)
 * - `requested` → `call`
 * - `pending_approval` → `call`
 * - `approved` → `call`
 * - `rejected` → `error`
 * - `executing` → `executing`
 * - `completed` → `result`
 * - `failed` → `error`
 * - `timeout` → `error`
 * - `cancelled` → `error`
 * - `cached` → `result`
 */
export function lifecycleToInvocationState(
  status: ToolCallStatus
): ToolInvocationState | null {
  switch (status) {
    case 'idle':
      return null // Not in message
    case 'requested':
    case 'pending_approval':
    case 'approved':
      return 'call'
    case 'executing':
      return 'executing'
    case 'completed':
    case 'cached':
      return 'result'
    case 'rejected':
    case 'failed':
    case 'timeout':
    case 'cancelled':
      return 'error'
  }
}

/**
 * Map invocation state to lifecycle status
 *
 * Note: Invocation state has less granularity, so multiple lifecycle states
 * can map to the same invocation state.
 */
export function invocationToLifecycleStatus(
  state: ToolInvocationState
): ToolCallStatus | ToolCallStatus[] {
  switch (state) {
    case 'partial-call':
      return 'requested'
    case 'call':
      return ['requested', 'pending_approval', 'approved']
    case 'executing':
      return 'executing'
    case 'result':
      return ['completed', 'cached']
    case 'error':
      return ['rejected', 'failed', 'timeout', 'cancelled']
  }
}

// =============================================================================
// UI Display Variants
// =============================================================================

/**
 * UI display variant for tool call status
 *
 * Maps to visual styling and user messaging.
 *
 * **Variants**:
 * - `pending`: Waiting for action (approval, execution queue)
 * - `executing`: Currently running
 * - `success`: Completed successfully
 * - `error`: Failed, rejected, or timed out
 * - `warning`: Cancelled or requires attention
 * - `info`: Cached result
 */
export type ToolStatusVariant =
  | 'pending'
  | 'executing'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'

/**
 * Map lifecycle status to UI variant
 */
export function lifecycleToVariant(status: ToolCallStatus): ToolStatusVariant {
  switch (status) {
    case 'idle':
    case 'requested':
    case 'pending_approval':
    case 'approved':
      return 'pending'
    case 'executing':
      return 'executing'
    case 'completed':
      return 'success'
    case 'failed':
    case 'timeout':
    case 'rejected':
      return 'error'
    case 'cancelled':
      return 'warning'
    case 'cached':
      return 'info'
  }
}

/**
 * Map invocation state to UI variant
 */
export function invocationToVariant(
  state: ToolInvocationState
): ToolStatusVariant {
  switch (state) {
    case 'partial-call':
    case 'call':
      return 'pending'
    case 'executing':
      return 'executing'
    case 'result':
      return 'success'
    case 'error':
      return 'error'
  }
}

// =============================================================================
// Status Labels
// =============================================================================

/**
 * Human-readable status labels
 */
export const LIFECYCLE_STATUS_LABELS: Record<ToolCallStatus, string> = {
  idle: 'Idle',
  requested: 'Requested',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
  executing: 'Executing',
  completed: 'Completed',
  failed: 'Failed',
  timeout: 'Timed Out',
  cancelled: 'Cancelled',
  cached: 'Cached',
}

/**
 * Get human-readable label for lifecycle status
 */
export function getLifecycleStatusLabel(status: ToolCallStatus): string {
  return LIFECYCLE_STATUS_LABELS[status]
}

/**
 * Invocation state labels
 */
export const INVOCATION_STATE_LABELS: Record<ToolInvocationState, string> = {
  'partial-call': 'Receiving',
  call: 'Pending',
  executing: 'Executing',
  result: 'Completed',
  error: 'Error',
}

/**
 * Get human-readable label for invocation state
 */
export function getInvocationStateLabel(state: ToolInvocationState): string {
  return INVOCATION_STATE_LABELS[state]
}

// =============================================================================
// Status Icons
// =============================================================================

/**
 * Icon names for status (emoji or icon library name)
 */
export const LIFECYCLE_STATUS_ICONS: Record<ToolCallStatus, string> = {
  idle: '○',
  requested: '◐',
  pending_approval: '⏸',
  approved: '✓',
  rejected: '✗',
  executing: '◉',
  completed: '✓',
  failed: '✗',
  timeout: '⏱',
  cancelled: '⊘',
  cached: '⚡',
}

/**
 * Get icon for lifecycle status
 */
export function getLifecycleStatusIcon(status: ToolCallStatus): string {
  return LIFECYCLE_STATUS_ICONS[status]
}

/**
 * Invocation state icons
 */
export const INVOCATION_STATE_ICONS: Record<ToolInvocationState, string> = {
  'partial-call': '◐',
  call: '○',
  executing: '◉',
  result: '✓',
  error: '✗',
}

/**
 * Get icon for invocation state
 */
export function getInvocationStateIcon(state: ToolInvocationState): string {
  return INVOCATION_STATE_ICONS[state]
}

// =============================================================================
// Status Colors (Tailwind-compatible)
// =============================================================================

/**
 * Tailwind color classes for status variants
 */
export const VARIANT_COLORS: Record<
  ToolStatusVariant,
  {
    bg: string
    text: string
    border: string
    icon: string
  }
> = {
  pending: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-900 dark:text-yellow-100',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  executing: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-900 dark:text-blue-100',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-900 dark:text-green-100',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-900 dark:text-red-100',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
  },
  warning: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    text: 'text-orange-900 dark:text-orange-100',
    border: 'border-orange-200 dark:border-orange-800',
    icon: 'text-orange-600 dark:text-orange-400',
  },
  info: {
    bg: 'bg-cyan-50 dark:bg-cyan-950',
    text: 'text-cyan-900 dark:text-cyan-100',
    border: 'border-cyan-200 dark:border-cyan-800',
    icon: 'text-cyan-600 dark:text-cyan-400',
  },
}

/**
 * Get color classes for variant
 */
export function getVariantColors(variant: ToolStatusVariant) {
  return VARIANT_COLORS[variant]
}

// =============================================================================
// Status Predicates
// =============================================================================

/**
 * Check if status indicates completion (success or failure)
 */
export function isTerminalStatus(status: ToolCallStatus): boolean {
  return (
    status === 'completed' ||
    status === 'failed' ||
    status === 'timeout' ||
    status === 'rejected' ||
    status === 'cancelled' ||
    status === 'cached'
  )
}

/**
 * Check if status indicates active execution
 */
export function isActiveStatus(status: ToolCallStatus): boolean {
  return status === 'executing'
}

/**
 * Check if status indicates waiting
 */
export function isPendingStatus(status: ToolCallStatus): boolean {
  return (
    status === 'requested' ||
    status === 'pending_approval' ||
    status === 'approved'
  )
}

/**
 * Check if status is successful
 */
export function isSuccessStatus(status: ToolCallStatus): boolean {
  return status === 'completed' || status === 'cached'
}

/**
 * Check if status is an error
 */
export function isErrorStatus(status: ToolCallStatus): boolean {
  return status === 'failed' || status === 'timeout' || status === 'rejected'
}

// =============================================================================
// Unified Status Helper
// =============================================================================

/**
 * Unified status information
 */
export interface UnifiedToolStatus {
  /** Lifecycle status */
  lifecycle: ToolCallStatus

  /** Invocation state (for messages) */
  invocation: ToolInvocationState | null

  /** UI variant */
  variant: ToolStatusVariant

  /** Human-readable label */
  label: string

  /** Icon */
  icon: string

  /** Color classes */
  colors: {
    bg: string
    text: string
    border: string
    icon: string
  }

  /** Status predicates */
  is: {
    terminal: boolean
    active: boolean
    pending: boolean
    success: boolean
    error: boolean
  }
}

/**
 * Get unified status information from lifecycle status
 */
export function getUnifiedStatus(status: ToolCallStatus): UnifiedToolStatus {
  const invocation = lifecycleToInvocationState(status)
  const variant = lifecycleToVariant(status)

  return {
    lifecycle: status,
    invocation,
    variant,
    label: getLifecycleStatusLabel(status),
    icon: getLifecycleStatusIcon(status),
    colors: getVariantColors(variant),
    is: {
      terminal: isTerminalStatus(status),
      active: isActiveStatus(status),
      pending: isPendingStatus(status),
      success: isSuccessStatus(status),
      error: isErrorStatus(status),
    },
  }
}

/**
 * Get unified status information from invocation state
 */
export function getUnifiedStatusFromInvocation(
  state: ToolInvocationState
): Omit<UnifiedToolStatus, 'lifecycle'> & {
  lifecycle: ToolCallStatus | ToolCallStatus[]
} {
  const lifecycle = invocationToLifecycleStatus(state)
  const variant = invocationToVariant(state)

  // Use first lifecycle status for other properties
  const primaryLifecycle = Array.isArray(lifecycle) ? lifecycle[0] : lifecycle

  return {
    lifecycle,
    invocation: state,
    variant,
    label: getInvocationStateLabel(state),
    icon: getInvocationStateIcon(state),
    colors: getVariantColors(variant),
    is: {
      terminal: isTerminalStatus(primaryLifecycle),
      active: isActiveStatus(primaryLifecycle),
      pending: isPendingStatus(primaryLifecycle),
      success: isSuccessStatus(primaryLifecycle),
      error: isErrorStatus(primaryLifecycle),
    },
  }
}

// =============================================================================
// Exports
// =============================================================================

// Note: All functions and types are already exported inline above
// Re-exporting them here causes "Cannot redeclare exported variable" errors
