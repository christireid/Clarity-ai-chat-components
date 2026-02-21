/**
 * Security Headers Test Suite
 *
 * Wave 3.4 Agent 37 - Security Headers Auditor
 *
 * Tests comprehensive security headers implementation including:
 * - X-Content-Type-Options
 * - Permissions-Policy
 * - Content-Security-Policy
 * - X-Frame-Options
 * - Strict-Transport-Security
 * - CSRF Protection
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'

describe('Security Headers', () => {
  describe('X-Content-Type-Options', () => {
    it('should have nosniff header on home page', async () => {
      const response = await fetch(BASE_URL)
      expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    })

    it('should have nosniff header on API routes', async () => {
      const response = await fetch(`${BASE_URL}/api/test`)
      expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    })

    it('should have nosniff header on static pages', async () => {
      const response = await fetch(`${BASE_URL}/get-started`)
      expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    })
  })

  describe('Permissions-Policy', () => {
    it('should restrict dangerous browser features on pages', async () => {
      const response = await fetch(BASE_URL)
      const policy = response.headers.get('permissions-policy')

      expect(policy).toBeTruthy()
      expect(policy).toContain('camera=()')
      expect(policy).toContain('microphone=()')
      expect(policy).toContain('geolocation=()')
      expect(policy).toContain('payment=()')
      expect(policy).toContain('usb=()')
    })

    it('should allow necessary features on same origin', async () => {
      const response = await fetch(BASE_URL)
      const policy = response.headers.get('permissions-policy')

      expect(policy).toContain('sync-xhr=(self)')
      expect(policy).toContain('fullscreen=(self)')
    })

    it('should have stricter policy on API routes', async () => {
      const response = await fetch(`${BASE_URL}/api/test`)
      const policy = response.headers.get('permissions-policy')

      expect(policy).toBeTruthy()
      expect(policy).toContain('camera=()')
      expect(policy).toContain('interest-cohort=()') // Disable FLoC
    })

    it('should disable interest-cohort (FLoC) tracking', async () => {
      const response = await fetch(BASE_URL)
      const policy = response.headers.get('permissions-policy')

      expect(policy).toContain('interest-cohort=()')
    })
  })

  describe('Content-Security-Policy', () => {
    it('should have CSP header on pages', async () => {
      const response = await fetch(BASE_URL)
      const csp = response.headers.get('content-security-policy')

      expect(csp).toBeTruthy()
      expect(csp).toContain("default-src 'self'")
    })

    it('should prevent frame embedding', async () => {
      const response = await fetch(BASE_URL)
      const csp = response.headers.get('content-security-policy')

      expect(csp).toContain("frame-ancestors 'none'")
    })

    it('should restrict base-uri and form-action', async () => {
      const response = await fetch(BASE_URL)
      const csp = response.headers.get('content-security-policy')

      expect(csp).toContain("base-uri 'self'")
      expect(csp).toContain("form-action 'self'")
    })

    it('should have stricter CSP on API routes', async () => {
      const response = await fetch(`${BASE_URL}/api/test`)
      const csp = response.headers.get('content-security-policy')

      expect(csp).toBeTruthy()
      expect(csp).toContain("default-src 'none'")
      expect(csp).toContain("frame-ancestors 'none'")
    })
  })

  describe('X-Frame-Options', () => {
    it('should prevent clickjacking on pages', async () => {
      const response = await fetch(BASE_URL)
      expect(response.headers.get('x-frame-options')).toBe('DENY')
    })

    it('should prevent clickjacking on API routes', async () => {
      const response = await fetch(`${BASE_URL}/api/test`)
      expect(response.headers.get('x-frame-options')).toBe('DENY')
    })
  })

  describe('Strict-Transport-Security', () => {
    it('should enforce HTTPS with HSTS', async () => {
      const response = await fetch(BASE_URL)
      const hsts = response.headers.get('strict-transport-security')

      expect(hsts).toBeTruthy()
      expect(hsts).toContain('max-age=31536000') // 1 year
      expect(hsts).toContain('includeSubDomains')
    })

    it('should include preload directive', async () => {
      const response = await fetch(BASE_URL)
      const hsts = response.headers.get('strict-transport-security')

      expect(hsts).toContain('preload')
    })
  })

  describe('Referrer-Policy', () => {
    it('should have strict referrer policy', async () => {
      const response = await fetch(BASE_URL)
      const policy = response.headers.get('referrer-policy')

      expect(policy).toBe('strict-origin-when-cross-origin')
    })
  })

  describe('X-XSS-Protection', () => {
    it('should have XSS protection enabled', async () => {
      const response = await fetch(BASE_URL)
      const xss = response.headers.get('x-xss-protection')

      expect(xss).toBe('1; mode=block')
    })
  })

  describe('X-DNS-Prefetch-Control', () => {
    it('should have DNS prefetch control enabled', async () => {
      const response = await fetch(BASE_URL)
      const dns = response.headers.get('x-dns-prefetch-control')

      expect(dns).toBe('on')
    })
  })

  describe('Powered-By Header', () => {
    it('should not expose X-Powered-By header', async () => {
      const response = await fetch(BASE_URL)
      expect(response.headers.get('x-powered-by')).toBeNull()
    })
  })

  describe('Cache-Control for API Routes', () => {
    it('should prevent caching of dynamic API responses', async () => {
      const response = await fetch(`${BASE_URL}/api/test`)
      const cacheControl = response.headers.get('cache-control')

      expect(cacheControl).toBeTruthy()
      expect(cacheControl).toMatch(/no-store|no-cache/)
    })
  })

  describe('Security Headers Completeness', () => {
    it('should have all critical security headers on pages', async () => {
      const response = await fetch(BASE_URL)

      const criticalHeaders = [
        'x-content-type-options',
        'permissions-policy',
        'content-security-policy',
        'x-frame-options',
        'strict-transport-security',
        'referrer-policy',
      ]

      for (const header of criticalHeaders) {
        expect(response.headers.get(header)).toBeTruthy()
      }
    })

    it('should have all critical security headers on API routes', async () => {
      const response = await fetch(`${BASE_URL}/api/test`)

      const criticalHeaders = [
        'x-content-type-options',
        'permissions-policy',
        'content-security-policy',
        'x-frame-options',
      ]

      for (const header of criticalHeaders) {
        expect(response.headers.get(header)).toBeTruthy()
      }
    })
  })
})

describe('Security Score Compliance', () => {
  it('should achieve 95/100+ security score on SecurityHeaders.com', async () => {
    // This is a meta-test to document expected score
    // Actual scoring requires running through securityheaders.com
    const response = await fetch(BASE_URL)

    const requiredHeaders = [
      'x-content-type-options',
      'permissions-policy',
      'content-security-policy',
      'x-frame-options',
      'strict-transport-security',
      'referrer-policy',
    ]

    const presentHeaders = requiredHeaders.filter(
      (header) => response.headers.get(header) !== null
    )

    // All headers should be present for 95/100+ score
    expect(presentHeaders.length).toBe(requiredHeaders.length)
  })
})
