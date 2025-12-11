/**
 * @clarity-chat/license
 *
 * License validation for Clarity Chat Pro components.
 *
 * @packageDocumentation
 */

// Core exports
export { LicenseInfo } from './LicenseInfo'
export type { LicenseInfoType } from './LicenseInfo'

// Verification
export {
  verifyLicense,
  isLicenseValid,
  shouldShowWatermark,
  getLicenseMessage,
} from './verifyLicense'

// Generation (server-side)
export {
  generateLicenseKey,
  parseLicenseKey,
  verifyLicenseChecksum,
  generateLicenseKeyBatch,
} from './generateLicense'

// React hooks
export {
  useLicenseStatus,
  useIsLicensed,
  useHasPlan,
  useLicenseInfo,
  useRequireLicense,
} from './hooks'

// React Context (alternative to static LicenseInfo)
export {
  LicenseProvider,
  useLicenseContext,
  useLicenseContextOptional,
} from './LicenseProvider'
export type {
  LicenseContextValue,
  LicenseProviderProps,
} from './LicenseProvider'

// Components
export { Watermark, WatermarkOverlay } from './Watermark'
export type {
  WatermarkProps,
  WatermarkOverlayProps,
  WatermarkPosition,
} from './Watermark'

// HOCs
export {
  withLicense,
  withLicenseStatus,
  createLicenseWrapper,
} from './withLicense'
export type { WithLicenseOptions, WithLicenseStatusProps } from './withLicense'

// Types
export type {
  LicensePlan,
  LicenseScope,
  ClarityLicensePayload,
  LicenseStatusCode,
  LicenseStatus,
  VerifyLicenseOptions,
  GenerateLicenseOptions,
  LicenseInfoStore,
} from './types'

// Utilities (for advanced use cases)
export { base64Encode, base64Decode, simpleChecksum } from './utils'

// Constants (for advanced use cases)
export { PLAN_HIERARCHY, isPlanSufficient } from './constants'
