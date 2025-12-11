/**
 * LicenseInfo Static Class
 *
 * Global storage for the Clarity Chat license key.
 * Call `LicenseInfo.setLicenseKey()` once at app startup.
 *
 * @packageDocumentation
 */

import {
  verifyLicense,
  shouldShowWatermark as checkWatermark,
} from './verifyLicense'
import type { LicenseStatus, LicensePlan } from './types'

/** Internal storage for the license key */
let _licenseKey = ''

/** Cached license status (invalidated when key changes) */
let _cachedStatus: LicenseStatus | null = null

/**
 * Static class for managing the Clarity Chat license.
 *
 * @example
 * ```typescript
 * // In your app entry point (e.g., _app.tsx or layout.tsx)
 * import { LicenseInfo } from '@clarity-chat/license';
 *
 * LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_CLARITY_LICENSE_KEY!);
 *
 * // Later, check license status
 * if (LicenseInfo.isValid()) {
 *   console.log('Licensed to:', LicenseInfo.getLicensee());
 * }
 * ```
 */
export const LicenseInfo = {
  /**
   * Set the license key for the application.
   * Should be called once at app initialization.
   *
   * @param key - The license key string
   */
  setLicenseKey(key: string): void {
    _licenseKey = key
    _cachedStatus = null // Invalidate cache
  },

  /**
   * Get the current license key.
   *
   * @returns The current license key or empty string if not set
   */
  getLicenseKey(): string {
    return _licenseKey
  },

  /**
   * Clear the current license key.
   * This will reset to the unlicensed state.
   */
  clearLicenseKey(): void {
    _licenseKey = ''
    _cachedStatus = null
  },

  /**
   * Get the current license status.
   * Results are cached until the license key changes.
   */
  getStatus(): LicenseStatus {
    if (_cachedStatus === null) {
      _cachedStatus = verifyLicense(_licenseKey)
    }
    return _cachedStatus
  },

  /**
   * Check if the current license is valid.
   * Convenience method for `getStatus().status === 'Valid'`.
   */
  isValid(): boolean {
    return this.getStatus().status === 'Valid'
  },

  /**
   * Check if watermark should be displayed.
   * Returns true if license is missing, invalid, or expired for development.
   */
  shouldShowWatermark(): boolean {
    return checkWatermark(this.getStatus())
  },

  /**
   * Get the licensee name if available.
   * Returns undefined if license is invalid or not set.
   */
  getLicensee(): string | undefined {
    return this.getStatus().payload?.licensee
  },

  /**
   * Get the license plan type.
   * Returns undefined if license is invalid or not set.
   */
  getPlan(): LicensePlan | undefined {
    return this.getStatus().payload?.plan
  },

  /**
   * Check if the license covers a specific plan level.
   *
   * @param requiredPlan - Minimum required plan level
   */
  hasPlan(requiredPlan: LicensePlan): boolean {
    const planHierarchy: Record<LicensePlan, number> = {
      community: 0,
      pro: 1,
      enterprise: 2,
    }
    const payload = this.getStatus().payload

    if (!payload) return false

    const actualLevel = planHierarchy[payload.plan]
    const requiredLevel = planHierarchy[requiredPlan]

    return actualLevel >= requiredLevel
  },
}

/**
 * Type alias for the LicenseInfo object
 */
export type LicenseInfoType = typeof LicenseInfo
