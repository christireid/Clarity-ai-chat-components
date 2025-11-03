import { describe, it, expect } from 'vitest'
import { generateLicenseKey, parseLicenseKey } from '../generator'

describe('License Key Generator', () => {
  describe('generateLicenseKey', () => {
    it('should generate Pro Individual license key', () => {
      const license = generateLicenseKey({
        tier: 'pro-individual',
        type: 'annual',
        email: 'test@example.com',
      })

      expect(license.key).toMatch(/^PRO-IND-ANN-[A-Z0-9]{16}$/)
      expect(license.tier).toBe('pro-individual')
      expect(license.type).toBe('annual')
      expect(license.email).toBe('test@example.com')
      expect(license.seats).toBe(1)
      expect(license.status).toBe('active')
    })

    it('should generate Pro Team license key', () => {
      const license = generateLicenseKey({
        tier: 'pro-team',
        type: 'annual',
        email: 'team@example.com',
      })

      expect(license.key).toMatch(/^PRO-TEAM-ANN-[A-Z0-9]{16}$/)
      expect(license.tier).toBe('pro-team')
      expect(license.seats).toBe(5)
    })

    it('should generate Enterprise license key', () => {
      const license = generateLicenseKey({
        tier: 'enterprise',
        type: 'annual',
        email: 'enterprise@example.com',
        company: 'Acme Corp',
        seats: 50,
      })

      expect(license.key).toMatch(/^ENT-ANN-[A-Z0-9]{16}$/)
      expect(license.tier).toBe('enterprise')
      expect(license.company).toBe('Acme Corp')
      expect(license.seats).toBe(50)
    })

    it('should generate lifetime license key', () => {
      const license = generateLicenseKey({
        tier: 'pro-individual',
        type: 'lifetime',
        email: 'lifetime@example.com',
      })

      expect(license.key).toMatch(/^PRO-IND-LTD-[A-Z0-9]{16}$/)
      expect(license.type).toBe('lifetime')
      expect(license.expiresAt).toBeNull()
    })

    it('should set expiration date for annual licenses', () => {
      const license = generateLicenseKey({
        tier: 'pro-individual',
        type: 'annual',
        email: 'test@example.com',
        expirationMonths: 12,
      })

      expect(license.expiresAt).not.toBeNull()
      if (license.expiresAt) {
        const monthsDiff =
          (license.expiresAt.getTime() - license.issuedAt.getTime()) /
          (1000 * 60 * 60 * 24 * 30)
        expect(monthsDiff).toBeGreaterThanOrEqual(11)
        expect(monthsDiff).toBeLessThanOrEqual(13)
      }
    })

    it('should generate unique keys', () => {
      const license1 = generateLicenseKey({
        tier: 'pro-individual',
        type: 'annual',
        email: 'test@example.com',
      })

      const license2 = generateLicenseKey({
        tier: 'pro-individual',
        type: 'annual',
        email: 'test@example.com',
      })

      expect(license1.key).not.toBe(license2.key)
    })
  })

  describe('parseLicenseKey', () => {
    it('should parse Pro Individual key correctly', () => {
      const result = parseLicenseKey('PRO-IND-ANN-ABC123DEF456GHI789')

      expect(result.valid).toBe(true)
      expect(result.tier).toBe('pro-individual')
      expect(result.type).toBe('annual')
    })

    it('should parse Pro Team key correctly', () => {
      const result = parseLicenseKey('PRO-TEAM-ANN-ABC123DEF456GHI789')

      expect(result.valid).toBe(true)
      expect(result.tier).toBe('pro-team')
      expect(result.type).toBe('annual')
    })

    it('should parse Enterprise key correctly', () => {
      const result = parseLicenseKey('ENT-ANN-ABC123DEF456GHI789')

      expect(result.valid).toBe(true)
      expect(result.tier).toBe('enterprise')
      expect(result.type).toBe('annual')
    })

    it('should parse lifetime key correctly', () => {
      const result = parseLicenseKey('PRO-IND-LTD-ABC123DEF456GHI789')

      expect(result.valid).toBe(true)
      expect(result.tier).toBe('pro-individual')
      expect(result.type).toBe('lifetime')
    })

    it('should reject invalid key format', () => {
      const result = parseLicenseKey('INVALID-KEY')

      expect(result.valid).toBe(false)
      expect(result.tier).toBeNull()
      expect(result.type).toBeNull()
    })

    it('should reject empty key', () => {
      const result = parseLicenseKey('')

      expect(result.valid).toBe(false)
    })
  })
})

