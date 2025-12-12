/**
 * License System Integration Tests
 *
 * Tests the full license lifecycle: generate → verify → gate → watermark
 * across package boundaries.
 */

import * as React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import { LicenseInfo } from '../LicenseInfo'
import { generateLicenseKey, parseLicenseKey } from '../generateLicense'
import { verifyLicense, isLicenseValid } from '../verifyLicense'
import { LicenseGate } from '../withLicense'
import { withLicense, createLicenseWrapper } from '../withLicense'
import { WatermarkOverlay } from '../Watermark'
import { LicenseProvider, useLicenseContext } from '../LicenseProvider'
import {
  useLicenseStatus,
  useIsLicensed,
  useHasPlan,
  useLicenseWarning,
} from '../hooks'
import { clearWarnings, isPlanSufficient } from '../constants'

const TEST_SECRET = 'integration-test-secret-key'

describe('License System Integration', () => {
  beforeEach(() => {
    LicenseInfo.clearLicenseKey()
    clearWarnings()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Full Lifecycle: Generate → Verify → Gate → Clear', () => {
    it('should complete full license lifecycle', async () => {
      // 1. Generate a license key
      const licenseKey = generateLicenseKey(
        {
          orderNumber: 'CC-INT-001',
          licensee: 'Integration Test Corp',
          email: 'test@integration.com',
          plan: 'pro',
          scope: 'team',
          durationDays: 365,
          maxDevelopers: 10,
        },
        TEST_SECRET
      )

      expect(licenseKey).toMatch(/^CC-1-.+-[a-z0-9]+$/)

      // 2. Parse and verify the key
      const parsed = parseLicenseKey(licenseKey)
      expect(parsed).not.toBeNull()
      expect(parsed?.version).toBe(1)

      const verification = verifyLicense(licenseKey)
      expect(verification.status).toBe('Valid')
      expect(verification.payload?.licensee).toBe('Integration Test Corp')
      expect(verification.payload?.plan).toBe('pro')
      expect(verification.payload?.maxDevelopers).toBe(10)

      // 3. Set the license and verify components work
      LicenseInfo.setLicenseKey(licenseKey)
      expect(LicenseInfo.isValid()).toBe(true)
      expect(LicenseInfo.getLicensee()).toBe('Integration Test Corp')

      // 4. Render gated component
      const { rerender } = render(
        <LicenseGate requiredPlan="pro">
          <div data-testid="pro-content">Pro Feature Unlocked!</div>
        </LicenseGate>
      )

      await waitFor(() => {
        expect(screen.getByTestId('pro-content')).toBeInTheDocument()
      })

      // 5. Clear the license and verify gate blocks
      act(() => {
        LicenseInfo.clearLicenseKey()
      })

      rerender(
        <LicenseGate
          requiredPlan="pro"
          fallback={<div data-testid="fallback">Please upgrade</div>}
        >
          <div data-testid="pro-content">Pro Feature Unlocked!</div>
        </LicenseGate>
      )

      await waitFor(() => {
        expect(screen.queryByTestId('pro-content')).not.toBeInTheDocument()
        expect(screen.getByTestId('fallback')).toBeInTheDocument()
      })
    })

    it('should handle plan hierarchy correctly', () => {
      // Test plan sufficiency
      expect(isPlanSufficient('enterprise', 'community')).toBe(true)
      expect(isPlanSufficient('enterprise', 'pro')).toBe(true)
      expect(isPlanSufficient('enterprise', 'enterprise')).toBe(true)

      expect(isPlanSufficient('pro', 'community')).toBe(true)
      expect(isPlanSufficient('pro', 'pro')).toBe(true)
      expect(isPlanSufficient('pro', 'enterprise')).toBe(false)

      expect(isPlanSufficient('community', 'community')).toBe(true)
      expect(isPlanSufficient('community', 'pro')).toBe(false)
      expect(isPlanSufficient('community', 'enterprise')).toBe(false)
    })
  })

  describe('Cross-Component Communication', () => {
    it('should sync license state across LicenseInfo and LicenseProvider', async () => {
      const licenseKey = generateLicenseKey(
        {
          orderNumber: 'CC-SYNC-001',
          licensee: 'Sync Test',
          email: 'sync@test.com',
          plan: 'enterprise',
          scope: 'organization',
          durationDays: 365,
        },
        TEST_SECRET
      )

      // Consumer component using context
      function ContextConsumer() {
        const { isValid, licensee, plan, hasPlan } = useLicenseContext()
        return (
          <div>
            <span data-testid="ctx-valid">{isValid ? 'yes' : 'no'}</span>
            <span data-testid="ctx-licensee">{licensee ?? 'none'}</span>
            <span data-testid="ctx-plan">{plan ?? 'none'}</span>
            <span data-testid="ctx-has-pro">
              {hasPlan('pro') ? 'yes' : 'no'}
            </span>
          </div>
        )
      }

      // Consumer component using hooks
      function HookConsumer() {
        const status = useLicenseStatus()
        const isLicensed = useIsLicensed()
        const hasPro = useHasPlan('pro')
        return (
          <div>
            <span data-testid="hook-status">{status.status}</span>
            <span data-testid="hook-licensed">{isLicensed ? 'yes' : 'no'}</span>
            <span data-testid="hook-has-pro">{hasPro ? 'yes' : 'no'}</span>
          </div>
        )
      }

      // First, set via LicenseInfo
      LicenseInfo.setLicenseKey(licenseKey)

      // Render with both patterns
      render(
        <>
          <LicenseProvider licenseKey={licenseKey}>
            <ContextConsumer />
          </LicenseProvider>
          <HookConsumer />
        </>
      )

      // Both should show valid
      expect(screen.getByTestId('ctx-valid')).toHaveTextContent('yes')
      expect(screen.getByTestId('ctx-licensee')).toHaveTextContent('Sync Test')
      expect(screen.getByTestId('ctx-plan')).toHaveTextContent('enterprise')
      expect(screen.getByTestId('ctx-has-pro')).toHaveTextContent('yes')

      expect(screen.getByTestId('hook-status')).toHaveTextContent('Valid')
      expect(screen.getByTestId('hook-licensed')).toHaveTextContent('yes')
      expect(screen.getByTestId('hook-has-pro')).toHaveTextContent('yes')
    })
  })

  describe('Watermark Integration', () => {
    it('should show watermark for unlicensed components', () => {
      function TestComponent() {
        return <div data-testid="content">Test Content</div>
      }

      const LicensedTestComponent = withLicense(TestComponent, {
        componentName: 'TestComponent',
        requiredPlan: 'pro',
        showWatermark: true,
        showConsoleWarning: false,
      })

      render(<LicensedTestComponent />)

      // Content should render
      expect(screen.getByTestId('content')).toBeInTheDocument()
      // Watermark should appear
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should hide watermark for properly licensed components', () => {
      const licenseKey = generateLicenseKey(
        {
          orderNumber: 'CC-WM-001',
          licensee: 'Watermark Test',
          email: 'wm@test.com',
          plan: 'pro',
          scope: 'individual',
          durationDays: 365,
        },
        TEST_SECRET
      )

      LicenseInfo.setLicenseKey(licenseKey)

      function TestComponent() {
        return <div data-testid="content">Test Content</div>
      }

      const LicensedTestComponent = withLicense(TestComponent, {
        componentName: 'TestComponent',
        requiredPlan: 'pro',
        showWatermark: true,
        showConsoleWarning: false,
      })

      render(<LicensedTestComponent />)

      // Content should render
      expect(screen.getByTestId('content')).toBeInTheDocument()
      // Watermark should NOT appear
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('Warning Deduplication', () => {
    it('should only warn once per feature across multiple renders', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      function TestFeature() {
        useLicenseWarning('SharedFeature', 'pro')
        return <div>Feature</div>
      }

      // First render
      const { rerender, unmount } = render(<TestFeature />)
      expect(console.warn).toHaveBeenCalledTimes(1)

      // Re-render same component
      rerender(<TestFeature />)
      expect(console.warn).toHaveBeenCalledTimes(1)

      // Unmount and remount
      unmount()
      render(<TestFeature />)
      // Should still be 1 due to shared warning tracker
      expect(console.warn).toHaveBeenCalledTimes(1)

      process.env.NODE_ENV = originalEnv
    })

    it('should warn separately for different features', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      function FeatureA() {
        useLicenseWarning('FeatureA', 'pro')
        return <div>A</div>
      }

      function FeatureB() {
        useLicenseWarning('FeatureB', 'pro')
        return <div>B</div>
      }

      render(
        <>
          <FeatureA />
          <FeatureB />
        </>
      )

      // Should warn for each unique feature
      expect(console.warn).toHaveBeenCalledTimes(2)

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('createLicenseWrapper Factory', () => {
    it('should create consistent wrappers', () => {
      const createProComponent = createLicenseWrapper({
        requiredPlan: 'pro',
        showWatermark: true,
        showConsoleWarning: false,
      })

      function ComponentA() {
        return <div data-testid="a">A</div>
      }

      function ComponentB() {
        return <div data-testid="b">B</div>
      }

      const ProA = createProComponent(ComponentA, 'ComponentA')
      const ProB = createProComponent(ComponentB, 'ComponentB')

      render(
        <>
          <ProA />
          <ProB />
        </>
      )

      // Both should render with watermarks
      expect(screen.getByTestId('a')).toBeInTheDocument()
      expect(screen.getByTestId('b')).toBeInTheDocument()
      expect(screen.getAllByRole('status')).toHaveLength(2)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid license keys gracefully', () => {
      const result = verifyLicense('invalid-key-format')
      expect(result.status).toBe('Invalid')
      expect(result.reason).toBeDefined()
    })

    it('should handle null/undefined license keys', () => {
      expect(verifyLicense(null).status).toBe('Missing')
      expect(verifyLicense(undefined).status).toBe('Missing')
      expect(verifyLicense('').status).toBe('Missing')
    })

    it('should handle corrupted base64 in license key', () => {
      const result = verifyLicense('CC-1-!!!invalid-base64!!-checksum')
      expect(result.status).toBe('Invalid')
    })
  })

  describe('Grace Period Support', () => {
    it('should handle expired licenses with grace period', () => {
      // Generate an expired license
      const expiredKey = generateLicenseKey(
        {
          orderNumber: 'CC-EXP-001',
          licensee: 'Expired Test',
          email: 'expired@test.com',
          plan: 'pro',
          scope: 'individual',
          durationDays: -30, // 30 days ago
        },
        TEST_SECRET
      )

      const result = verifyLicense(expiredKey)
      // Expired licenses should be one of these statuses:
      // - 'GracePeriod' if within grace period
      // - 'Expired' if outside grace period
      // - 'ExpiredForDevelopment' in development mode
      expect(['GracePeriod', 'Expired', 'ExpiredForDevelopment']).toContain(
        result.status
      )
      expect(result.payload).toBeDefined()
    })
  })
})
