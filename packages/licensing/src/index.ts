// Types
export * from './types'

// License generation
export * from './generator'

// License validation
export * from './validator'

// Feature management
export * from './features'

// Re-export key functions
export { generateLicenseKey, parseLicenseKey } from './generator'
export { validateLicense, isLicenseExpired, getDaysUntilExpiration } from './validator'
export {
  getLicenseFeatures,
  hasFeature,
  isComponentAvailable,
  isThemeAvailable,
  isAIProviderAvailable,
  getTierDisplayName,
  getUpgradePath,
  getUpgradeDiscount,
} from './features'


