/**
 * Preset Configuration Index
 *
 * Main entry point for preset configurations.
 * Re-exports all presets and provides utilities for managing them.
 *
 * @example
 * ```tsx
 * import {
 *   minimal,
 *   standard,
 *   agent,
 *   embedded,
 *   enterprise,
 *   createPreset,
 *   mergePresets
 * } from './presets'
 *
 * // Use presets
 * const myConfig = standard.createPreset({
 *   theme: { primary: '#0066cc' }
 * })
 *
 * // Merge presets
 * const merged = mergePresets(standard.preset, {
 *   features: { citations: true }
 * })
 * ```
 */

// ============================================================================
// Re-export Minimal Preset
// ============================================================================

export {
  type MinimalProviderConfig,
  type MinimalFeatures,
  type MinimalComponentProps,
  type MinimalTheme,
  type MinimalPreset,
  type CreateMinimalPresetOptions,
  defaultProviderConfig as minimalDefaultProviderConfig,
  defaultFeatures as minimalDefaultFeatures,
  defaultComponentProps as minimalDefaultComponentProps,
  defaultTheme as minimalDefaultTheme,
  minimalPreset,
  createPreset as createMinimalPreset,
  mergePreset as mergeMinimalPreset,
  clonePreset as cloneMinimalPreset,
  getPresetSummary as getMinimalPresetSummary,
  minimal,
} from './minimal'

// ============================================================================
// Re-export Standard Preset
// ============================================================================

export {
  type StandardProviderConfig,
  type StandardFeatures,
  type StandardComponentProps,
  type StandardTheme,
  type StandardPreset,
  type CreateStandardPresetOptions,
  defaultProviderConfig as standardDefaultProviderConfig,
  defaultFeatures as standardDefaultFeatures,
  defaultComponentProps as standardDefaultComponentProps,
  defaultTheme as standardDefaultTheme,
  standardPreset,
  createPreset as createStandardPreset,
  mergePreset as mergeStandardPreset,
  clonePreset as cloneStandardPreset,
  getPresetSummary as getStandardPresetSummary,
  standard,
} from './standard'

// ============================================================================
// Re-export Agent Preset
// ============================================================================

export {
  type AgentProviderConfig,
  type AgentTool,
  type AgentFeatures,
  type AgentComponentProps,
  type AgentTheme,
  type AgentPreset,
  type CreateAgentPresetOptions,
  defaultProviderConfig as agentDefaultProviderConfig,
  defaultFeatures as agentDefaultFeatures,
  defaultComponentProps as agentDefaultComponentProps,
  defaultTheme as agentDefaultTheme,
  agentPreset,
  createPreset as createAgentPreset,
  mergePreset as mergeAgentPreset,
  clonePreset as cloneAgentPreset,
  getPresetSummary as getAgentPresetSummary,
  addTool as addAgentTool,
  agent,
} from './agent'

// ============================================================================
// Re-export Embedded Preset
// ============================================================================

export {
  type EmbeddedProviderConfig,
  type EmbeddedFeatures,
  type EmbeddedComponentProps,
  type EmbeddedTheme,
  type EmbeddedPreset,
  type CreateEmbeddedPresetOptions,
  defaultProviderConfig as embeddedDefaultProviderConfig,
  defaultFeatures as embeddedDefaultFeatures,
  defaultComponentProps as embeddedDefaultComponentProps,
  defaultTheme as embeddedDefaultTheme,
  embeddedPreset,
  createPreset as createEmbeddedPreset,
  mergePreset as mergeEmbeddedPreset,
  clonePreset as cloneEmbeddedPreset,
  getPresetSummary as getEmbeddedPresetSummary,
  setPosition as setEmbeddedPosition,
  setSize as setEmbeddedSize,
  setFloating as setEmbeddedFloating,
  embedded,
} from './embedded'

// ============================================================================
// Re-export Enterprise Preset
// ============================================================================

export {
  type EnterpriseProviderConfig,
  type EnterpriseSecurityConfig,
  type EnterpriseAuditConfig,
  type EnterpriseComplianceConfig,
  type EnterpriseFeatures,
  type EnterpriseComponentProps,
  type EnterpriseTheme,
  type EnterprisePreset,
  type CreateEnterprisePresetOptions,
  type SSOProvider,
  type AuditLevel,
  type ComplianceStandard,
  defaultProviderConfig as enterpriseDefaultProviderConfig,
  defaultSecurityConfig as enterpriseDefaultSecurityConfig,
  defaultAuditConfig as enterpriseDefaultAuditConfig,
  defaultComplianceConfig as enterpriseDefaultComplianceConfig,
  defaultFeatures as enterpriseDefaultFeatures,
  defaultComponentProps as enterpriseDefaultComponentProps,
  defaultTheme as enterpriseDefaultTheme,
  enterprisePreset,
  createPreset as createEnterprisePreset,
  mergePreset as mergeEnterprisePreset,
  clonePreset as cloneEnterprisePreset,
  getPresetSummary as getEnterprisePresetSummary,
  enableSSO as enableEnterpriseSSO,
  setComplianceStandards,
  setAuditLevel,
  enterprise,
} from './enterprise'

// ============================================================================
// Union Types
// ============================================================================

import type { MinimalPreset } from './minimal'
import type { StandardPreset } from './standard'
import type { AgentPreset } from './agent'
import type { EmbeddedPreset } from './embedded'
import type { EnterprisePreset } from './enterprise'

/** All available preset types */
export type AnyPreset = MinimalPreset | StandardPreset | AgentPreset | EmbeddedPreset | EnterprisePreset

/** Preset names */
export type PresetName = 'minimal' | 'standard' | 'agent' | 'embedded' | 'enterprise'

// ============================================================================
// Preset Registry
// ============================================================================

/**
 * Registry of all available presets
 */
export const PRESETS_REGISTRY = {
  minimal: () => ({ ...minimalPreset }),
  standard: () => ({ ...standardPreset }),
  agent: () => ({ ...agentPreset }),
  embedded: () => ({ ...embeddedPreset }),
  enterprise: () => ({ ...enterprisePreset }),
} as const

/**
 * Get a preset by name
 *
 * @param name - Preset name
 * @returns The preset, or undefined if not found
 *
 * @example
 * ```tsx
 * const preset = getPreset('standard')
 * if (preset) {
 *   // Use preset
 * }
 * ```
 */
export function getPreset(name: PresetName): AnyPreset | undefined {
  const factory = PRESETS_REGISTRY[name]
  return factory ? factory() : undefined
}

/**
 * Get preset by name with type safety
 *
 * @param name - Preset name
 * @returns The preset
 * @throws Error if preset not found
 *
 * @example
 * ```tsx
 * const preset = requirePreset('enterprise')
 * ```
 */
export function requirePreset(name: PresetName): AnyPreset {
  const preset = getPreset(name)
  if (!preset) {
    throw new Error(`Preset '${name}' not found. Available: ${Object.keys(PRESETS_REGISTRY).join(', ')}`)
  }
  return preset
}

/**
 * List all available preset names
 *
 * @returns Array of preset names
 */
export function listPresets(): PresetName[] {
  return Object.keys(PRESETS_REGISTRY) as PresetName[]
}

/**
 * Check if a preset name exists
 *
 * @param name - Preset name to check
 * @returns true if preset exists
 */
export function presetExists(name: string): name is PresetName {
  return name in PRESETS_REGISTRY
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Merge two presets, with the second one overriding the first
 *
 * @param base - Base preset
 * @param overrides - Override properties
 * @returns Merged preset
 *
 * @example
 * ```tsx
 * const merged = mergePresets(standardPreset, {
 *   features: { thinking: false }
 * })
 * ```
 */
export function mergePresets(
  base: AnyPreset,
  overrides: Partial<AnyPreset>
): AnyPreset {
  return {
    ...base,
    ...overrides,
    provider: {
      ...base.provider,
      ...(overrides.provider || {}),
    },
    features: {
      ...base.features,
      ...(overrides.features || {}),
    },
    componentProps: {
      ...base.componentProps,
      ...(overrides.componentProps || {}),
    },
    theme: {
      ...base.theme,
      ...(overrides.theme || {}),
    },
    // Handle enterprise-specific configs
    ...(('security' in base || 'security' in overrides) && {
      security: {
        ...((base as EnterprisePreset).security || {}),
        ...((overrides as Partial<EnterprisePreset>).security || {}),
      },
      audit: {
        ...((base as EnterprisePreset).audit || {}),
        ...((overrides as Partial<EnterprisePreset>).audit || {}),
      },
      compliance: {
        ...((base as EnterprisePreset).compliance || {}),
        ...((overrides as Partial<EnterprisePreset>).compliance || {}),
      },
    }),
  } as AnyPreset
}

/**
 * Clone a preset with optional overrides
 *
 * @param preset - Preset to clone
 * @param overrides - Properties to override
 * @returns Cloned preset
 *
 * @example
 * ```tsx
 * const darkVersion = clonePreset(standardPreset, {
 *   theme: { primary: '#000000' }
 * })
 * ```
 */
export function clonePreset(
  preset: AnyPreset,
  overrides: Partial<AnyPreset> = {}
): AnyPreset {
  return mergePresets(
    JSON.parse(JSON.stringify(preset)) as AnyPreset,
    overrides
  )
}

/**
 * Get a summary of a preset
 *
 * @param preset - Preset to summarize
 * @returns Summary string
 *
 * @example
 * ```tsx
 * console.log(getPresetSummary(enterprisePreset))
 * // "Enterprise: Full-featured enterprise preset..."
 * ```
 */
export function getPresetSummary(preset: AnyPreset): string {
  return `${preset.name}: ${preset.description}`
}

/**
 * Validate preset structure
 *
 * @param preset - Preset to validate
 * @returns true if valid
 *
 * @example
 * ```tsx
 * if (validatePreset(myPreset)) {
 *   // Safe to use
 * }
 * ```
 */
export function validatePreset(preset: any): preset is AnyPreset {
  return (
    preset &&
    typeof preset === 'object' &&
    typeof preset.name === 'string' &&
    typeof preset.description === 'string' &&
    preset.provider &&
    preset.features &&
    preset.componentProps &&
    preset.theme
  )
}

/**
 * Get preset features as array
 *
 * @param preset - Preset
 * @returns Array of enabled feature names
 */
export function getEnabledFeatures(preset: AnyPreset): string[] {
  return Object.entries(preset.features)
    .filter(([, enabled]) => enabled === true)
    .map(([name]) => name)
}

/**
 * Check if preset has required features
 *
 * @param preset - Preset
 * @param requiredFeatures - Features to check
 * @returns true if all required features are enabled
 */
export function hasRequiredFeatures(
  preset: AnyPreset,
  requiredFeatures: string[]
): boolean {
  const features = preset.features as Record<string, boolean>
  return requiredFeatures.every((f) => features[f] === true)
}

/**
 * Get missing features from a preset
 *
 * @param preset - Preset
 * @param requiredFeatures - Features being checked
 * @returns Array of missing feature names
 */
export function getMissingFeatures(
  preset: AnyPreset,
  requiredFeatures: string[]
): string[] {
  const features = preset.features as Record<string, boolean>
  return requiredFeatures.filter((f) => features[f] !== true)
}

/**
 * Export common presets for convenience
 */
export {
  minimalPreset,
  standardPreset,
  agentPreset,
  embeddedPreset,
  enterprisePreset,
}

/**
 * Re-export all preset modules
 */
export * from './minimal'
export * from './standard'
export * from './agent'
export * from './embedded'
export * from './enterprise'
