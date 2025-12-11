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
