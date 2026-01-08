import { jsx as _jsx } from "react/jsx-runtime";
/**
 * LicenseProvider Context
 *
 * React Context-based alternative to the static LicenseInfo class.
 * Provides SSR-safe, testable license state management.
 *
 * @packageDocumentation
 */
import * as React from 'react';
import { verifyLicense, shouldShowWatermark } from './verifyLicense';
import { isPlanSufficient } from './constants';
/**
 * License context (internal)
 */
const LicenseContext = React.createContext(null);
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
export function LicenseProvider({ licenseKey, children, }) {
    const value = React.useMemo(() => {
        const status = verifyLicense(licenseKey);
        const isValid = status.status === 'Valid';
        const payload = status.payload;
        return {
            status,
            isValid,
            licensee: payload?.licensee,
            plan: payload?.plan,
            hasPlan: (requiredPlan) => {
                if (!payload)
                    return false;
                return isPlanSufficient(payload.plan, requiredPlan);
            },
            // Use proper watermark logic that accounts for GracePeriod
            shouldShowWatermark: shouldShowWatermark(status),
        };
    }, [licenseKey]);
    return (_jsx(LicenseContext.Provider, { value: value, children: children }));
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
export function useLicenseContext() {
    const context = React.useContext(LicenseContext);
    if (context === null) {
        throw new Error('useLicenseContext must be used within a LicenseProvider. ' +
            'Wrap your component tree with <LicenseProvider licenseKey="...">.');
    }
    return context;
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
export function useLicenseContextOptional() {
    return React.useContext(LicenseContext);
}
/**
 * Display name for React DevTools
 */
LicenseProvider.displayName = 'LicenseProvider';
//# sourceMappingURL=LicenseProvider.js.map