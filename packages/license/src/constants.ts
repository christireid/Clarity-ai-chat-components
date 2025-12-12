/**
 * License Constants
 *
 * Shared constants for license validation and plan comparison.
 *
 * @packageDocumentation
 */

import type { LicensePlan } from './types'

/**
 * Plan hierarchy for comparison operations.
 * Higher values indicate more permissive plans.
 *
 * @internal
 */
export const PLAN_HIERARCHY: Record<LicensePlan, number> = {
  community: 0,
  pro: 1,
  enterprise: 2,
} as const

/**
 * Check if an actual plan meets a required plan level.
 *
 * @param actualPlan - The plan to check
 * @param requiredPlan - The minimum required plan level
 * @returns true if actualPlan meets or exceeds requiredPlan
 *
 * @example
 * ```typescript
 * isPlanSufficient('pro', 'community') // true
 * isPlanSufficient('pro', 'pro') // true
 * isPlanSufficient('pro', 'enterprise') // false
 * ```
 */
export function isPlanSufficient(
  actualPlan: LicensePlan,
  requiredPlan: LicensePlan
): boolean {
  return PLAN_HIERARCHY[actualPlan] >= PLAN_HIERARCHY[requiredPlan]
}

// ============================================================================
// Shared Warning Deduplication System
// ============================================================================

/**
 * Track warned components/features with timestamps for TTL-based cleanup.
 * Shared between withLicense HOC and useLicenseWarning hook.
 * @internal
 */
const warnedKeys = new Map<string, number>()

/** Maximum age for warned entries (1 hour) */
const WARNING_TTL_MS = 60 * 60 * 1000

/**
 * Check if we're in development mode.
 * Uses a more robust check that works in various bundler configurations.
 * @internal
 */
export function isDevelopment(): boolean {
  // Check for explicit NODE_ENV
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV === 'development'
  }
  // Fallback: check for common development indicators
  if (typeof window !== 'undefined') {
    // @ts-expect-error - __DEV__ is set by some bundlers
    return window.__DEV__ === true
  }
  return false
}

/**
 * Check if a warning has been shown recently for a given key.
 * Automatically cleans up old entries to prevent memory leaks.
 *
 * @param key - Unique identifier for the warning (component name or feature)
 * @returns true if warning was shown within TTL window
 * @internal
 */
export function hasWarnedRecently(key: string): boolean {
  const now = Date.now()

  // Clean up old entries (older than TTL)
  for (const [name, timestamp] of warnedKeys.entries()) {
    if (now - timestamp > WARNING_TTL_MS) {
      warnedKeys.delete(name)
    }
  }

  return warnedKeys.has(key)
}

/**
 * Mark a key as having shown a warning.
 *
 * @param key - Unique identifier for the warning
 * @internal
 */
export function markWarningShown(key: string): void {
  warnedKeys.set(key, Date.now())
}

/**
 * Clear all warning records (useful for testing).
 * @internal
 */
export function clearWarnings(): void {
  warnedKeys.clear()
}
