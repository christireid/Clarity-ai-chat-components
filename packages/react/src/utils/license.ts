/**
 * License Validation Utility
 *
 * Used to validate commercial license keys.
 * Currently a stub for future implementation.
 */

export interface LicenseStatus {
  valid: boolean
  tier: 'free' | 'pro' | 'enterprise' | 'unknown'
  message?: string
}

/**
 * Validate a Clarity Chat license key
 *
 * @param key The license key to validate
 * @returns License status
 */
export function validateLicense(key?: string): LicenseStatus {
  // Development environment is always valid
  if (process.env.NODE_ENV === 'development') {
    return { valid: true, tier: 'enterprise' }
  }

  if (!key) {
    return {
      valid: false,
      tier: 'free',
      message:
        'No license key provided. Please purchase a license for production use.',
    }
  }

  // Simple prefix check for now
  if (key.startsWith('CLARITY_ENT_')) {
    return { valid: true, tier: 'enterprise' }
  }

  if (key.startsWith('CLARITY_PRO_')) {
    return { valid: true, tier: 'pro' }
  }

  return {
    valid: false,
    tier: 'unknown',
    message: 'Invalid license key format.',
  }
}

/**
 * Check license and log warning if invalid (for production)
 */
export function checkLicense(key?: string): void {
  if (process.env.NODE_ENV === 'development') return

  const status = validateLicense(key)

  if (!status.valid) {
    console.warn(
      `%c Clarity Chat License Warning %c ${status.message}`,
      'background: #ef4444; color: white; padding: 2px 4px; border-radius: 2px; font-weight: bold;',
      'color: #ef4444;'
    )
  }
}
