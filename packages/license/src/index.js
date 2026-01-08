/**
 * @clarity-chat/license
 *
 * License validation for Clarity Chat Pro components.
 *
 * @packageDocumentation
 */
// Core exports
export { LicenseInfo } from './LicenseInfo';
// Verification
export { verifyLicense, isLicenseValid, shouldShowWatermark, getLicenseMessage, } from './verifyLicense';
// Generation (server-side)
export { generateLicenseKey, parseLicenseKey, verifyLicenseChecksum, generateLicenseKeyBatch, } from './generateLicense';
// React hooks
export { useLicenseStatus, useIsLicensed, useHasPlan, useLicenseInfo, useRequireLicense, useIsHydrated, useLicenseWarning, } from './hooks';
// React Context (alternative to static LicenseInfo)
export { LicenseProvider, useLicenseContext, useLicenseContextOptional, } from './LicenseProvider';
// Components
export { Watermark, WatermarkOverlay, LicenseStatusAnnouncer, } from './Watermark';
// UI Components (status display, warnings, prompts)
export { LicenseLoadingSkeleton, LicenseStatusBadge, LicenseExpiryWarning, LicenseUpgradePrompt, } from './LicenseUI';
// HOCs and Gate Components
export { withLicense, withLicenseStatus, createLicenseWrapper, LicenseGate, } from './withLicense';
// Utilities (for advanced use cases)
export { base64Encode, base64Decode, simpleChecksum } from './utils';
// Constants (for advanced use cases)
export { PLAN_HIERARCHY, isPlanSufficient, clearWarnings, isDevelopment, getWarningCount, } from './constants';
//# sourceMappingURL=index.js.map