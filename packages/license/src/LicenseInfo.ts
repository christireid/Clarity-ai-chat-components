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
import { isPlanSufficient } from './constants'
import type { LicenseStatus, LicensePlan } from './types'

/** Internal storage for the license key */
let _licenseKey = ''

/** Cached license status (invalidated when key changes) */
let _cachedStatus: LicenseStatus | null = null

/** Listeners for license key changes */
const _listeners: Set<() => void> = new Set()

/**
 * Check if we're in development mode
 */
function isDevelopment(): boolean {
  return (
    typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'
  )
}

/**
 * Notify all listeners of license key change.
 * Errors are caught and logged in development mode.
 */
function notifyListeners(): void {
  _listeners.forEach((listener) => {
    try {
      listener()
    } catch (error) {
      // Log errors in development mode to help debugging
      if (isDevelopment()) {
        logger.error(
          '[Clarity Chat License] Error in subscription callback:',
          error
        )
      }
    }
  })
}

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
 *   logger.debug('Licensed to:', LicenseInfo.getLicensee());
 * }
 * ```
 */
export const LicenseInfo = {
  /**
   * Set the license key for the application.
   * Should be called once at app initialization.
   * Notifies all subscribers of the change.
   *
   * @param key - The license key string
   */
  setLicenseKey(key: string): void {
    const changed = _licenseKey !== key
    _licenseKey = key
    _cachedStatus = null // Invalidate cache
    if (changed) {
      notifyListeners()
    }
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
   * Notifies all subscribers of the change.
   */
  clearLicenseKey(): void {
    const changed = _licenseKey !== ''
    _licenseKey = ''
    _cachedStatus = null
    if (changed) {
      notifyListeners()
    }
  },

  /**
   * Subscribe to license key changes.
   * Returns an unsubscribe function.
   *
   * @param callback - Function to call when license key changes
   * @returns Unsubscribe function
   *
   * @example
   * ```typescript
   * const unsubscribe = LicenseInfo.subscribe(() => {
   *   logger.debug('License changed:', LicenseInfo.isValid());
   * });
   *
   * // Later, to stop listening:
   * unsubscribe();
   * ```
   */
  subscribe(callback: () => void): () => void {
    _listeners.add(callback)
    return () => {
      _listeners.delete(callback)
    }
  },

  /**
   * Get the number of active subscribers.
   * Useful for debugging.
   */
  getSubscriberCount(): number {
    return _listeners.size
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
    const payload = this.getStatus().payload
    if (!payload) return false
    return isPlanSufficient(payload.plan, requiredPlan)
  },
}

/**
 * Type alias for the LicenseInfo object
 */
export type LicenseInfoType = typeof LicenseInfo
