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
  const random = nanoid(16).toUpperCase()
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

  const tierPrefix = parts[0]
  const typePrefix = parts[1]

  const tier = parseTierPrefix(tierPrefix, parts[1])
  const type = parseTypePrefix(typePrefix)

  return {
    tier,
    type,
    valid: tier !== null && type !== null,
  }
}

function parseTierPrefix(prefix1: string, prefix2: string): LicenseTier | null {
  const combined = `${prefix1}-${prefix2}`

  switch (combined) {
    case 'FREE-ANN':
    case 'FREE-LTD':
      return 'free'
    case 'PRO-IND':
      return 'pro-individual'
    case 'PRO-TEAM':
      return 'pro-team'
    case 'ENT-ANN':
    case 'ENT-LTD':
      return 'enterprise'
    default:
      return null
  }
}

function parseTypePrefix(prefix: string): LicenseType | null {
  switch (prefix) {
    case 'ANN':
    case 'IND': // For PRO-IND
    case 'TEAM': // For PRO-TEAM
      return 'annual'
    case 'LTD':
      return 'lifetime'
    default:
      return null
  }
}

