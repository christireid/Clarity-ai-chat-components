/**
 * License Verification
 *
 * Client-side license key validation for Clarity Chat Pro.
 * No network requests required - validation is done entirely locally.
 *
 * @packageDocumentation
 */

import { base64Decode } from './utils'
import { parseLicenseKey } from './generateLicense'
import type {
  ClarityLicensePayload,
  LicenseStatus,
  LicensePlan,
  VerifyLicenseOptions,
} from './types'

/** Current supported license version */
const CURRENT_VERSION = 1

/** Plan hierarchy for comparison */
const PLAN_HIERARCHY: Record<LicensePlan, number> = {
  community: 0,
  pro: 1,
  enterprise: 2,
}

/**
 * Verify a Clarity Chat license key
 *
 * @param licenseKey - The license key to verify
 * @param options - Verification options
 * @returns License status object
 *
 * @example
 * ```typescript
 * const status = verifyLicense('CC-1-eyJ...-abc123');
 *
 * if (status.status === 'Valid') {
 *   console.log(`Licensed to: ${status.payload?.licensee}`);
 * }
 * ```
 */
export function verifyLicense(
  licenseKey: string | null | undefined,
  options: VerifyLicenseOptions = {}
): LicenseStatus {
  const {
    requiredPlan,
    checkDevExpiry = true,
    environment = getEnvironment(),
  } = options

  // Check for missing key
  if (!licenseKey) {
    return {
      status: 'Missing',
      reason:
        'No license key provided. Purchase at https://claritychat.dev/pricing',
    }
  }

  // Parse the key format
  const parsed = parseLicenseKey(licenseKey)
  if (!parsed) {
    return {
      status: 'Invalid',
      reason: 'Invalid license key format',
    }
  }

  // Verify prefix
  if (parsed.prefix !== 'CC') {
    return {
      status: 'Invalid',
      reason: 'Invalid license key prefix',
    }
  }

  // Verify version is supported
  if (parsed.version > CURRENT_VERSION) {
    return {
      status: 'Invalid',
      reason: `License version ${parsed.version} is not supported. Please update @clarity-chat/license.`,
    }
  }

  // Decode payload
  let payload: ClarityLicensePayload
  try {
    const decoded = base64Decode(parsed.encodedPayload)
    payload = JSON.parse(decoded) as ClarityLicensePayload
  } catch {
    return {
      status: 'Invalid',
      reason: 'Failed to decode license key payload',
    }
  }

  // Validate payload structure
  if (!payload.orderNumber || !payload.licensee || !payload.plan) {
    return {
      status: 'Invalid',
      reason: 'License key payload is missing required fields',
    }
  }

  // Validate plan
  if (!['community', 'pro', 'enterprise'].includes(payload.plan)) {
    return {
      status: 'Invalid',
      reason: `Invalid plan type: ${payload.plan}`,
    }
  }

  // Check expiry
  const now = Math.floor(Date.now() / 1000)
  const isExpired = payload.expiresAt && now > payload.expiresAt

  if (isExpired) {
    // In production, license is perpetual (just can't get updates)
    if (environment === 'production') {
      // Still valid for production use
      return {
        status: 'Valid',
        payload,
        reason: 'License expired for updates but valid for production use',
      }
    }

    // In development, show warning
    if (checkDevExpiry) {
      return {
        status: 'ExpiredForDevelopment',
        payload,
        reason:
          'License expired. Renew at https://claritychat.dev/account for continued updates.',
      }
    }
  }

  // Check required plan level
  if (requiredPlan) {
    const actualLevel = PLAN_HIERARCHY[payload.plan]
    const requiredLevel = PLAN_HIERARCHY[requiredPlan]

    if (actualLevel < requiredLevel) {
      return {
        status: 'PlanMismatch',
        payload,
        reason: `This feature requires ${requiredPlan} plan. Current plan: ${payload.plan}`,
      }
    }
  }

  // All checks passed
  return {
    status: 'Valid',
    payload,
  }
}

/**
 * Quick check if a license key is valid
 *
 * @param licenseKey - The license key to check
 * @returns true if license is valid
 */
export function isLicenseValid(licenseKey: string | null | undefined): boolean {
  const status = verifyLicense(licenseKey)
  return status.status === 'Valid'
}

/**
 * Check if watermark should be displayed
 *
 * @param status - License status object
 * @returns true if watermark should be shown
 */
export function shouldShowWatermark(status: LicenseStatus): boolean {
  return status.status !== 'Valid'
}

/**
 * Get a user-friendly message for a license status
 *
 * @param status - License status object
 * @returns User-friendly status message
 */
export function getLicenseMessage(status: LicenseStatus): string {
  switch (status.status) {
    case 'Valid':
      return `Licensed to ${status.payload?.licensee}`
    case 'Missing':
      return 'Clarity Chat Pro - Unlicensed'
    case 'Invalid':
      return 'Invalid license key'
    case 'Expired':
      return 'License expired'
    case 'ExpiredForDevelopment':
      return 'License expired for development'
    case 'PlanMismatch':
      return `Upgrade required: ${status.reason}`
    case 'OutOfScope':
      return 'License out of scope'
    default:
      return 'Unknown license status'
  }
}

/**
 * Get the current environment
 */
function getEnvironment(): 'development' | 'production' | 'test' {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV as 'development' | 'production' | 'test'
  }
  return 'production'
}
