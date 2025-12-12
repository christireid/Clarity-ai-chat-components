/**
 * React Hooks for License Verification
 *
 * Provides React hooks for checking license status in components.
 *
 * @packageDocumentation
 */

import { useMemo, useState, useEffect, useSyncExternalStore } from 'react'
import { LicenseInfo } from './LicenseInfo'
import { verifyLicense } from './verifyLicense'
import {
  isPlanSufficient,
  hasWarnedRecently,
  markWarningShown,
  isDevelopment,
} from './constants'
import type { LicenseStatus, LicensePlan } from './types'

/**
 * Hook to check if the component has hydrated on the client.
 * Returns false during SSR and on first client render, then true after hydration.
 * Useful for avoiding hydration mismatches with license-dependent rendering.
 *
 * @returns true after hydration, false during SSR
 *
 * @example
 * ```typescript
 * function LicenseGatedContent() {
 *   const isHydrated = useIsHydrated();
 *   const isLicensed = useIsLicensed();
 *
 *   // Avoid hydration mismatch by waiting for hydration
 *   if (!isHydrated) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   return isLicensed ? <ProContent /> : <FreeContent />;
 * }
 * ```
 */
export function useIsHydrated(): boolean {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Subscribe to LicenseInfo changes using the built-in subscription mechanism.
 * This replaces the previous polling approach with event-driven updates.
 */
function subscribe(callback: () => void): () => void {
  return LicenseInfo.subscribe(callback)
}

/**
 * Get the current license key snapshot for useSyncExternalStore.
 */
function getSnapshot(): string {
  return LicenseInfo.getLicenseKey()
}

/**
 * Server snapshot returns empty string (no license on server).
 */
function getServerSnapshot(): string {
  return ''
}

/**
 * Hook to get the current license status.
 * Automatically updates when the license key changes.
 *
 * @returns Current license status
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const status = useLicenseStatus();
 *
 *   if (status.status !== 'Valid') {
 *     return <div>Please purchase a license</div>;
 *   }
 *
 *   return <div>Welcome, {status.payload?.licensee}!</div>;
 * }
 * ```
 */
export function useLicenseStatus(): LicenseStatus {
  const licenseKey = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  return useMemo(() => {
    return verifyLicense(licenseKey)
  }, [licenseKey])
}

/**
 * Hook to check if the current license is valid.
 *
 * @returns true if license is valid
 *
 * @example
 * ```typescript
 * function ProFeature() {
 *   const isLicensed = useIsLicensed();
 *
 *   if (!isLicensed) {
 *     return <UpgradePrompt />;
 *   }
 *
 *   return <ProFeatureContent />;
 * }
 * ```
 */
export function useIsLicensed(): boolean {
  const status = useLicenseStatus()
  return status.status === 'Valid'
}

/**
 * Hook to check if the license meets a required plan level.
 *
 * @param requiredPlan - Minimum required plan
 * @returns true if license meets the required plan level
 *
 * @example
 * ```typescript
 * function EnterpriseFeature() {
 *   const hasEnterprise = useHasPlan('enterprise');
 *
 *   if (!hasEnterprise) {
 *     return <div>Enterprise license required</div>;
 *   }
 *
 *   return <EnterpriseContent />;
 * }
 * ```
 */
export function useHasPlan(requiredPlan: LicensePlan): boolean {
  const status = useLicenseStatus()

  return useMemo(() => {
    if (status.status !== 'Valid' || !status.payload) {
      return false
    }
    return isPlanSufficient(status.payload.plan, requiredPlan)
  }, [status, requiredPlan])
}

/**
 * Hook to get license info for display purposes.
 *
 * @returns Object with licensee and plan info
 *
 * @example
 * ```typescript
 * function LicenseDisplay() {
 *   const { licensee, plan, isValid } = useLicenseInfo();
 *
 *   if (!isValid) {
 *     return <div>Unlicensed</div>;
 *   }
 *
 *   return <div>Licensed to {licensee} ({plan})</div>;
 * }
 * ```
 */
export function useLicenseInfo(): {
  licensee: string | undefined
  plan: LicensePlan | undefined
  isValid: boolean
  status: LicenseStatus
} {
  const status = useLicenseStatus()

  return useMemo(
    () => ({
      licensee: status.payload?.licensee,
      plan: status.payload?.plan,
      isValid: status.status === 'Valid',
      status,
    }),
    [status]
  )
}

/**
 * Hook that throws an error if not licensed.
 * Useful for components that should never render without a license.
 *
 * @param featureName - Name of the feature (for error message)
 * @throws Error if license is invalid
 *
 * @example
 * ```typescript
 * function CriticalProFeature() {
 *   useRequireLicense('CriticalProFeature');
 *
 *   // Only renders if licensed
 *   return <div>Critical feature content</div>;
 * }
 * ```
 */
export function useRequireLicense(featureName = 'This feature'): void {
  const status = useLicenseStatus()

  if (status.status !== 'Valid') {
    throw new Error(
      `${featureName} requires a valid Clarity Chat license. ` +
        `Status: ${status.status}. ${status.reason ?? ''} ` +
        `Purchase at https://claritychat.dev/pricing`
    )
  }
}

/**
 * Hook that logs a console warning for unlicensed usage (development only).
 * Used internally by license-gated components.
 * Only logs once per feature per session (shared with withLicense HOC).
 *
 * @param featureName - Name of the feature requiring license
 * @param requiredPlan - Minimum required plan level (default: 'pro')
 *
 * @example
 * ```typescript
 * function ProFeature() {
 *   useLicenseWarning('ProFeature', 'pro');
 *
 *   // Component continues to render regardless
 *   return <div>Feature content</div>;
 * }
 * ```
 */
export function useLicenseWarning(
  featureName: string,
  requiredPlan: LicensePlan = 'pro'
): void {
  const status = useLicenseStatus()

  useEffect(() => {
    // Use shared warning tracker for deduplication across all license warnings
    const warningKey = `hook:${featureName}`

    if (hasWarnedRecently(warningKey)) return

    const isValid = status.status === 'Valid' || status.status === 'GracePeriod'
    const hasSufficientPlan =
      isValid &&
      status.payload &&
      isPlanSufficient(status.payload.plan, requiredPlan)

    if (!isValid || !hasSufficientPlan) {
      if (isDevelopment()) {
        markWarningShown(warningKey)
        const reason = !isValid
          ? (status.reason ?? 'No valid license')
          : `Requires ${requiredPlan} plan, current: ${status.payload?.plan}`

        console.warn(
          `%c Clarity Chat License Warning %c\n\n` +
            `The "${featureName}" feature requires a ${requiredPlan} license.\n\n` +
            `${reason}\n\n` +
            `Get your license at: https://claritychat.dev/pricing\n\n` +
            `This warning only appears in development mode.`,
          'background: #f59e0b; color: black; font-weight: bold; padding: 4px 8px;',
          ''
        )
      }
    }
  }, [status, featureName, requiredPlan])
}
