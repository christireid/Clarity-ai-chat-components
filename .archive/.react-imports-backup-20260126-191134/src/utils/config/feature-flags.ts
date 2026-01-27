/**
 * Feature Flags for Optional Peer Dependencies
 *
 * Allows users to explicitly opt-out of features to save bundle size,
 * even when peer dependencies are installed.
 *
 * Set these environment variables to disable features:
 * - CLARITY_DISABLE_SYNTAX_HIGHLIGHTING - Disable Shiki syntax highlighting
 * - CLARITY_DISABLE_MARKDOWN - Disable react-markdown rendering
 * - CLARITY_DISABLE_EXPORTS - Disable JSZip batch exports
 *
 * @example
 * ```bash
 * # In .env or .env.local
 * CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=true
 * CLARITY_DISABLE_MARKDOWN=true
 * CLARITY_DISABLE_EXPORTS=true
 * ```
 *
 * @example
 * ```ts
 * // In your code
 * import { isFeatureEnabled } from '@clarity-chat/react/config'
 *
 * if (isFeatureEnabled('syntax-highlighting')) {
 *   // Use CodeBlock with Shiki
 * } else {
 *   // Use basic code display
 * }
 * ```
 */

import { isBrowser } from '@clarity-chat/utils/env'

/**
 * Available feature flags
 */
export type FeatureFlag =
  | 'syntax-highlighting' // Shiki syntax highlighting
  | 'markdown' // react-markdown rendering
  | 'batch-exports' // JSZip batch exports

/**
 * Environment variable names for each feature flag
 */
const FEATURE_FLAG_ENV_VARS: Record<FeatureFlag, string> = {
  'syntax-highlighting': 'CLARITY_DISABLE_SYNTAX_HIGHLIGHTING',
  markdown: 'CLARITY_DISABLE_MARKDOWN',
  'batch-exports': 'CLARITY_DISABLE_EXPORTS',
}

/**
 * Peer dependencies required for each feature
 */
const FEATURE_DEPENDENCIES: Record<FeatureFlag, string[]> = {
  'syntax-highlighting': ['shiki'],
  markdown: ['react-markdown', 'remark-gfm'],
  'batch-exports': ['jszip'],
}

/**
 * Safely get environment variable value
 */
function getEnvVar(key: string): string | undefined {
  if (isBrowser()) {
    // In browser, check for Next.js public env vars or window.__ENV__
    if (typeof window !== 'undefined') {
      const envKey = `NEXT_PUBLIC_${key}`
      return (
        (window as any)[envKey] ||
        (window as any).__ENV__?.[key] ||
        (window as any).__ENV__?.[envKey] ||
        undefined
      )
    }
    return undefined
  }
  return typeof process !== 'undefined' ? process.env?.[key] : undefined
}

/**
 * Check if an environment variable is set to a truthy value
 */
function isEnvVarEnabled(key: string): boolean {
  const value = getEnvVar(key)
  return value === 'true' || value === '1' || value === 'yes'
}

/**
 * Cache for feature flag states to avoid repeated checks
 */
const featureFlagCache = new Map<FeatureFlag, boolean>()

/**
 * Check if a feature is explicitly disabled via environment variable
 *
 * @param feature - The feature to check
 * @returns true if the feature is disabled, false otherwise
 */
export function isFeatureDisabled(feature: FeatureFlag): boolean {
  const envVar = FEATURE_FLAG_ENV_VARS[feature]
  return isEnvVarEnabled(envVar)
}

/**
 * Check if a feature is enabled (not explicitly disabled)
 *
 * @param feature - The feature to check
 * @returns true if the feature is enabled, false if disabled
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  // Check cache first
  if (featureFlagCache.has(feature)) {
    return featureFlagCache.get(feature)!
  }

  // Check if explicitly disabled via env var
  const disabled = isFeatureDisabled(feature)
  const enabled = !disabled

  // Cache the result
  featureFlagCache.set(feature, enabled)

  return enabled
}

/**
 * Check if a peer dependency is available
 *
 * @param packageName - The package to check
 * @returns true if the package can be imported, false otherwise
 */
export function isPeerDependencyAvailable(packageName: string): boolean {
  try {
    // Try to require the package
    require.resolve(packageName)
    return true
  } catch {
    return false
  }
}

/**
 * Check if a feature is both enabled (not disabled) AND has required dependencies
 *
 * @param feature - The feature to check
 * @returns true if feature is enabled and dependencies are available
 */
export function isFeatureAvailable(feature: FeatureFlag): boolean {
  // First check if explicitly disabled
  if (!isFeatureEnabled(feature)) {
    return false
  }

  // Then check if required dependencies are available
  const dependencies = FEATURE_DEPENDENCIES[feature]
  return dependencies.every((dep) => isPeerDependencyAvailable(dep))
}

/**
 * Get the list of missing dependencies for a feature
 *
 * @param feature - The feature to check
 * @returns Array of missing package names
 */
export function getMissingDependencies(feature: FeatureFlag): string[] {
  const dependencies = FEATURE_DEPENDENCIES[feature]
  return dependencies.filter((dep) => !isPeerDependencyAvailable(dep))
}

/**
 * Get a user-friendly message about why a feature is unavailable
 *
 * @param feature - The feature to check
 * @returns A message explaining the feature's status
 */
export function getFeatureStatusMessage(feature: FeatureFlag): string {
  if (isFeatureDisabled(feature)) {
    const envVar = FEATURE_FLAG_ENV_VARS[feature]
    return `Feature disabled via ${envVar} environment variable`
  }

  const missingDeps = getMissingDependencies(feature)
  if (missingDeps.length > 0) {
    return `Missing dependencies: ${missingDeps.join(', ')}`
  }

  return 'Feature available'
}

/**
 * Clear the feature flag cache (useful for testing)
 * @internal
 */
export function clearFeatureFlagCache(): void {
  featureFlagCache.clear()
}

/**
 * Get a summary of all feature flags and their states
 *
 * @returns Object with feature states
 */
export function getFeatureFlagSummary(): Record<
  FeatureFlag,
  {
    enabled: boolean
    available: boolean
    disabled: boolean
    missingDependencies: string[]
    status: string
  }
> {
  const features: FeatureFlag[] = [
    'syntax-highlighting',
    'markdown',
    'batch-exports',
  ]

  return features.reduce(
    (acc, feature) => {
      acc[feature] = {
        enabled: isFeatureEnabled(feature),
        available: isFeatureAvailable(feature),
        disabled: isFeatureDisabled(feature),
        missingDependencies: getMissingDependencies(feature),
        status: getFeatureStatusMessage(feature),
      }
      return acc
    },
    {} as Record<
      FeatureFlag,
      {
        enabled: boolean
        available: boolean
        disabled: boolean
        missingDependencies: string[]
        status: string
      }
    >
  )
}

/**
 * Log feature flag status to console (useful for debugging)
 *
 * @param onlyUnavailable - Only log unavailable features
 */
export function logFeatureFlagStatus(onlyUnavailable: boolean = false): void {
  const summary = getFeatureFlagSummary()

  console.log('=== Clarity Chat Feature Flags ===')

  Object.entries(summary).forEach(([feature, status]) => {
    if (onlyUnavailable && status.available) {
      return
    }

    const icon = status.available ? '✅' : status.disabled ? '🚫' : '❌'
    console.log(
      `${icon} ${feature}: ${status.enabled ? 'enabled' : 'disabled'} - ${status.status}`
    )
  })

  console.log('=================================')
}

/**
 * Runtime configuration for feature flags
 * Can be set programmatically to override environment variables
 */
export interface FeatureFlagConfig {
  /** Disable syntax highlighting (overrides env var) */
  disableSyntaxHighlighting?: boolean
  /** Disable markdown rendering (overrides env var) */
  disableMarkdown?: boolean
  /** Disable batch exports (overrides env var) */
  disableBatchExports?: boolean
}

let runtimeConfig: FeatureFlagConfig = {}

/**
 * Set feature flags programmatically at runtime
 *
 * @param config - Feature flag configuration
 *
 * @example
 * ```ts
 * // Disable syntax highlighting at runtime
 * setFeatureFlags({
 *   disableSyntaxHighlighting: true
 * })
 * ```
 */
export function setFeatureFlags(config: FeatureFlagConfig): void {
  runtimeConfig = { ...config }
  // Clear cache when runtime config changes
  clearFeatureFlagCache()
}

/**
 * Get the runtime configuration
 *
 * @returns Current runtime configuration
 */
export function getRuntimeConfig(): Readonly<FeatureFlagConfig> {
  return { ...runtimeConfig }
}

/**
 * Check if a feature is disabled via runtime config
 *
 * @param feature - The feature to check
 * @returns true if disabled via runtime config
 */
function isFeatureDisabledByRuntime(feature: FeatureFlag): boolean {
  switch (feature) {
    case 'syntax-highlighting':
      return runtimeConfig.disableSyntaxHighlighting === true
    case 'markdown':
      return runtimeConfig.disableMarkdown === true
    case 'batch-exports':
      return runtimeConfig.disableBatchExports === true
    default:
      return false
  }
}

/**
 * Enhanced version of isFeatureEnabled that checks both env vars and runtime config
 *
 * @param feature - The feature to check
 * @returns true if the feature is enabled
 */
export function isFeatureEnabledWithRuntime(feature: FeatureFlag): boolean {
  // Runtime config takes precedence
  if (isFeatureDisabledByRuntime(feature)) {
    return false
  }

  // Then check env vars
  return isFeatureEnabled(feature)
}

// Re-export for convenience
export { type FeatureFlag as Feature }
