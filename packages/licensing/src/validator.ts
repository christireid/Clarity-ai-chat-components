import type { LicenseKey, LicenseValidationResult, LicenseConfig, LicenseTier, LicenseType } from './types'
import { parseLicenseKey } from './generator'

/**
 * Validate a license key
 */
export async function validateLicense(
  key: string,
  config?: LicenseConfig
): Promise<LicenseValidationResult> {
  const validatedAt = new Date()

  // Development mode - always valid
  if (config?.devMode) {
    return {
      valid: true,
      validatedAt,
      license: createMockLicense(key),
    }
  }

  // Parse key format
  const parsed = parseLicenseKey(key)
  if (!parsed.valid || !parsed.tier || !parsed.type) {
    return {
      valid: false,
      error: 'Invalid license key format',
      validatedAt,
    }
  }

  // For now, implement local validation
  // In production, this would call API endpoint
  if (config?.validationEndpoint) {
    return await validateWithAPI(key, config.validationEndpoint)
  }

  // Local validation (offline mode)
  return validateLocally(key, parsed.tier, parsed.type, validatedAt)
}

/**
 * Validate with API endpoint
 */
async function validateWithAPI(
  key: string,
  endpoint: string
): Promise<LicenseValidationResult> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ licenseKey: key }),
    })

    if (!response.ok) {
      return {
        valid: false,
        error: 'License validation failed',
        validatedAt: new Date(),
      }
    }

    const data = await response.json()
    return {
      valid: data.valid,
      license: data.license,
      error: data.error,
      validatedAt: new Date(),
      daysUntilExpiration: data.daysUntilExpiration,
    }
  } catch {
    return {
      valid: false,
      error: 'Network error during validation',
      validatedAt: new Date(),
    }
  }
}

/**
 * Validate locally (offline mode)
 * Note: This is basic validation. Production should use API + signature verification
 */
function validateLocally(
  key: string,
  tier: string,
  type: string,
  validatedAt: Date
): LicenseValidationResult {
  // Basic format validation
  if (key.length < 20) {
    return {
      valid: false,
      error: 'Invalid key length',
      validatedAt,
    }
  }

  // For offline mode, we can't verify expiration or status
  // This would require a database lookup in production
  return {
    valid: true,
    validatedAt,
    license: {
      key,
      tier: tier as LicenseTier,
      type: type as LicenseType,
      email: '',
      seats: tier === 'pro-team' ? 5 : tier === 'enterprise' ? 10 : 1,
      issuedAt: new Date(),
      expiresAt: type === 'lifetime' ? null : addDays(new Date(), 365),
      status: 'active',
    },
  }
}

/**
 * Check if license is expired
 */
export function isLicenseExpired(license: LicenseKey): boolean {
  if (license.type === 'lifetime') {
    return false
  }

  if (!license.expiresAt) {
    return false
  }

  return new Date() > license.expiresAt
}

/**
 * Get days until expiration
 */
export function getDaysUntilExpiration(license: LicenseKey): number | null {
  if (license.type === 'lifetime' || !license.expiresAt) {
    return null
  }

  const now = new Date()
  const expiration = license.expiresAt
  const diffTime = expiration.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * Create mock license for development
 */
function createMockLicense(key: string): LicenseKey {
  return {
    key,
    tier: 'enterprise',
    type: 'lifetime',
    email: 'dev@example.com',
    company: 'Development Mode',
    seats: 999,
    issuedAt: new Date(),
    expiresAt: null,
    status: 'active',
    metadata: {
      devMode: true,
    },
  }
}

/**
 * Add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Verify license signature (for production use)
 * This would verify the license key was signed by your private key
 */
export async function verifyLicenseSignature(
  _key: string,
  _signature: string,
  _publicKey: string
): Promise<boolean> {
  // TODO: Implement RSA signature verification
  // For now, return true in development
  if (process.env['NODE_ENV'] === 'development') {
    return true
  }

  // In production, use crypto to verify:
  // 1. Parse public key
  // 2. Verify signature against license key
  // 3. Return verification result
  
  return false
}


