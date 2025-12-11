/**
 * Clarity Chat License Types
 * @packageDocumentation
 */

/**
 * License plan types
 */
export type LicensePlan = 'community' | 'pro' | 'enterprise'

/**
 * License scope types
 */
export type LicenseScope = 'individual' | 'team' | 'organization'

/**
 * The decoded payload from a Clarity Chat license key
 */
export interface ClarityLicensePayload {
  /** Unique order number (e.g., 'CC-123456') */
  orderNumber: string

  /** Name of the licensee (company or individual) */
  licensee: string

  /** Contact email address */
  email: string

  /** License plan type */
  plan: LicensePlan

  /** License scope */
  scope: LicenseScope

  /** Unix timestamp when license was issued */
  issuedAt: number

  /** Unix timestamp when license expires (for updates/support) */
  expiresAt: number

  /** Maximum number of developers (for team/org licenses) */
  maxDevelopers?: number

  /** Optional domain restrictions */
  domains?: string[]

  /** License format version */
  version: number
}

/**
 * License validation status codes
 */
export type LicenseStatusCode =
  | 'Valid'
  | 'Invalid'
  | 'Missing'
  | 'Expired'
  | 'ExpiredForDevelopment'
  | 'PlanMismatch'
  | 'OutOfScope'

/**
 * Result of license verification
 */
export interface LicenseStatus {
  /** Status code indicating validation result */
  status: LicenseStatusCode

  /** Human-readable reason for the status */
  reason?: string

  /** Decoded license payload (if successfully parsed) */
  payload?: ClarityLicensePayload
}

/**
 * Options for license verification
 */
export interface VerifyLicenseOptions {
  /** Package name being verified (for plan checks) */
  packageName?: string

  /** Required plan level */
  requiredPlan?: LicensePlan

  /** Whether to check expiry for development mode */
  checkDevExpiry?: boolean

  /** Current environment (defaults to process.env.NODE_ENV) */
  environment?: 'development' | 'production' | 'test'
}

/**
 * Options for generating a license key
 */
export interface GenerateLicenseOptions {
  /** Order number to embed in license */
  orderNumber: string

  /** Licensee name */
  licensee: string

  /** Contact email */
  email: string

  /** License plan */
  plan: LicensePlan

  /** License scope */
  scope: LicenseScope

  /** License duration in days (default: 365) */
  durationDays?: number

  /** Maximum developers (for team/org) */
  maxDevelopers?: number

  /** Domain restrictions */
  domains?: string[]
}

/**
 * License info storage interface
 */
export interface LicenseInfoStore {
  /** Set the license key */
  setLicenseKey(key: string): void

  /** Get the current license key */
  getLicenseKey(): string

  /** Clear the license key */
  clearLicenseKey(): void

  /** Get the current license status */
  getStatus(): LicenseStatus
}
