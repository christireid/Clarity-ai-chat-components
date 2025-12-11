/**
 * LicenseProvider Context
 *
 * React Context-based alternative to the static LicenseInfo class.
 * Provides SSR-safe, testable license state management.
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { verifyLicense, shouldShowWatermark } from './verifyLicense'
import { isPlanSufficient } from './constants'
import type { LicenseStatus, LicensePlan } from './types'

/**
 * License context value type
 */
export interface LicenseContextValue {
  /** Current license status */
  status: LicenseStatus
  /** Whether the license is valid */
  isValid: boolean
  /** The licensee name if available */
  licensee: string | undefined
  /** The license plan if available */
  plan: LicensePlan | undefined
  /** Check if license has a specific plan level */
  hasPlan: (requiredPlan: LicensePlan) => boolean
  /** Whether watermark should be shown */
  shouldShowWatermark: boolean
}

/**
 * Props for LicenseProvider component
 */
export interface LicenseProviderProps {
  /** The license key to validate */
  licenseKey: string | null | undefined
  /** Child components */
  children: React.ReactNode
}

/**
 * License context (internal)
 */
const LicenseContext = React.createContext<LicenseContextValue | null>(null)

/**
 * LicenseProvider component
 *
 * Provides license state to child components via React Context.
 * This is an alternative to the static LicenseInfo class and is
 * better suited for SSR and testing scenarios.
 *
 * @example
 * ```tsx
 * // In your app root
 * function App() {
 *   return (
 *     <LicenseProvider licenseKey={process.env.NEXT_PUBLIC_CLARITY_LICENSE_KEY}>
 *       <MyApp />
 *     </LicenseProvider>
 *   );
 * }
 *
 * // In child components
 * function ChildComponent() {
 *   const { isValid, licensee } = useLicenseContext();
 *
 *   if (!isValid) {
 *     return <div>Please purchase a license</div>;
 *   }
 *
 *   return <div>Licensed to {licensee}</div>;
 * }
 * ```
 */
export function LicenseProvider({
  licenseKey,
  children,
}: LicenseProviderProps): React.ReactElement {
  const value = React.useMemo<LicenseContextValue>(() => {
    const status = verifyLicense(licenseKey)
    const isValid = status.status === 'Valid'
    const payload = status.payload

    return {
      status,
      isValid,
      licensee: payload?.licensee,
      plan: payload?.plan,
      hasPlan: (requiredPlan: LicensePlan) => {
        if (!payload) return false
        return isPlanSufficient(payload.plan, requiredPlan)
      },
      // Use proper watermark logic that accounts for GracePeriod
      shouldShowWatermark: shouldShowWatermark(status),
    }
  }, [licenseKey])

  return (
    <LicenseContext.Provider value={value}>{children}</LicenseContext.Provider>
  )
}

/**
 * Hook to access the license context.
 * Throws an error if used outside of LicenseProvider.
 *
 * @returns License context value
 * @throws Error if used outside LicenseProvider
 *
 * @example
 * ```tsx
 * function ProFeature() {
 *   const { isValid, hasPlan } = useLicenseContext();
 *
 *   if (!isValid || !hasPlan('pro')) {
 *     return <UpgradePrompt />;
 *   }
 *
 *   return <ProContent />;
 * }
 * ```
 */
export function useLicenseContext(): LicenseContextValue {
  const context = React.useContext(LicenseContext)

  if (context === null) {
    throw new Error(
      'useLicenseContext must be used within a LicenseProvider. ' +
        'Wrap your component tree with <LicenseProvider licenseKey="...">.'
    )
  }

  return context
}

/**
 * Hook to optionally access the license context.
 * Returns null if used outside of LicenseProvider (doesn't throw).
 *
 * @returns License context value or null
 *
 * @example
 * ```tsx
 * function OptionallyLicensedFeature() {
 *   const license = useLicenseContextOptional();
 *
 *   // Works even without LicenseProvider
 *   if (!license || !license.isValid) {
 *     return <BasicFeature />;
 *   }
 *
 *   return <EnhancedFeature />;
 * }
 * ```
 */
export function useLicenseContextOptional(): LicenseContextValue | null {
  return React.useContext(LicenseContext)
}

/**
 * Display name for React DevTools
 */
LicenseProvider.displayName = 'LicenseProvider'
