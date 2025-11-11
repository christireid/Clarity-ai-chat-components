import { nanoid } from 'nanoid'
import type { LicenseKey, LicenseTier, LicenseType } from './types'

/**
 * Generate a license key
 */
export function generateLicenseKey(options: {
  tier: LicenseTier
  type: LicenseType
  email: string
  company?: string
  seats?: number
  expirationMonths?: number
}): LicenseKey {
  const {
    tier,
    type,
    email,
    company,
    seats = tier === 'pro-team' ? 5 : tier === 'enterprise' ? 10 : 1,
    expirationMonths = 12,
  } = options

  // Generate unique license key
  // Format: TIER-TYPE-RANDOM
  // Example: PRO-IND-ABC123DEF456GHI789
  const tierPrefix = getTierPrefix(tier)
  const typePrefix = type === 'annual' ? 'ANN' : 'LTD'
  // Generate an uppercase alphanumeric id of length 16
  const random = generateAlphaNumericId(16)
  const key = `${tierPrefix}-${typePrefix}-${random}`

  const issuedAt = new Date()
  const expiresAt = type === 'lifetime' ? null : addMonths(issuedAt, expirationMonths)

  return {
    key,
    tier,
    type,
    email,
    company,
    seats,
    issuedAt,
    expiresAt,
    status: 'active',
  }
}

/**
 * Get tier prefix for license key
 */
function getTierPrefix(tier: LicenseTier): string {
  switch (tier) {
    case 'free':
      return 'FREE'
    case 'pro-individual':
      return 'PRO-IND'
    case 'pro-team':
      return 'PRO-TEAM'
    case 'enterprise':
      return 'ENT'
    default:
      return 'UNKNOWN'
  }
}

/**
 * Add months to a date
 */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * Generate an uppercase alphanumeric ID of a given length
 * Avoids relying on customAlphabet to prevent bundling issues
 */
function generateAlphaNumericId(length: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  // Use nanoid for randomness source, map to alphabet to enforce charset
  // Generate slightly more than needed to reduce modulo bias
  while (id.length < length) {
    const chunk = nanoid(length)
    for (let i = 0; i < chunk.length && id.length < length; i++) {
      const code = chunk.charCodeAt(i)
      // Map to 0..35 range using a simple hash
      const idx = (code + i) % alphabet.length
      id += alphabet[idx]
    }
  }
  return id
}

/**
 * Parse license key to extract tier and type
 */
export function parseLicenseKey(key: string): {
  tier: LicenseTier | null
  type: LicenseType | null
  valid: boolean
} {
  const parts = key.split('-')

  if (parts.length < 3) {
    return { tier: null, type: null, valid: false }
  }

  // Handle different tier formats:
  // - PRO-IND-ANN-RANDOM (pro-individual)
  // - PRO-TEAM-ANN-RANDOM (pro-team)
  // - ENT-ANN-RANDOM (enterprise)
  // - FREE-ANN-RANDOM (free)
  
  let tier: LicenseTier | null = null
  let type: LicenseType | null = null

  if (parts[0] === 'PRO' && parts[1] === 'IND') {
    // PRO-IND-ANN-RANDOM or PRO-IND-LTD-RANDOM
    tier = 'pro-individual'
    type = parts[2] ? parseTypePrefix(parts[2]) : null
  } else if (parts[0] === 'PRO' && parts[1] === 'TEAM') {
    // PRO-TEAM-ANN-RANDOM or PRO-TEAM-LTD-RANDOM
    tier = 'pro-team'
    type = parts[2] ? parseTypePrefix(parts[2]) : null
  } else if (parts[0] === 'ENT') {
    // ENT-ANN-RANDOM or ENT-LTD-RANDOM
    tier = 'enterprise'
    type = parts[1] ? parseTypePrefix(parts[1]) : null
  } else if (parts[0] === 'FREE') {
    // FREE-ANN-RANDOM or FREE-LTD-RANDOM
    tier = 'free'
    type = parts[1] ? parseTypePrefix(parts[1]) : null
  }

  return {
    tier,
    type,
    valid: tier !== null && type !== null,
  }
}

// Removed unused parseTierPrefix helper

function parseTypePrefix(prefix: string): LicenseType | null {
  switch (prefix) {
    case 'ANN':
      return 'annual'
    case 'LTD':
      return 'lifetime'
    default:
      return null
  }
}


