/**
 * Configuration Utilities
 *
 * Utilities for configuration building and validation.
 */

export * from './chat-config-builder'

export {
  validateAIProvider,
  validateVectorStore,
  validateClarityChatConfig,
  shouldUseMockMode,
  getConfigSummary,
  type EnvValidationResult,
  type EnvValidationOptions,
} from './env-validation'

export * from './runtime-validation'

export {
  isFeatureEnabled,
  isFeatureDisabled,
  isFeatureAvailable,
  isPeerDependencyAvailable,
  getMissingDependencies,
  getFeatureStatusMessage,
  setFeatureFlags,
  getRuntimeConfig,
  getFeatureFlagSummary,
  logFeatureFlagStatus,
  clearFeatureFlagCache,
  type FeatureFlag,
  type Feature,
  type FeatureFlagConfig,
} from './feature-flags'
