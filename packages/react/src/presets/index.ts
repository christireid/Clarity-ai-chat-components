/**
 * ChatComposer Presets - Ready-to-use chat configurations
 *
 * This module provides a collection of pre-configured chat compositions
 * optimized for different use cases and scenarios. Each preset includes
 * features, layout, configuration, and theme settings.
 *
 * @example
 * ```tsx
 * import { minimalPreset, mergePresets, createCustomPreset } from './presets'
 * import { ChatComposer } from './ChatComposer'
 *
 * // Use a preset directly
 * <ChatComposer
 *   layout={minimalPreset.layout}
 *   features={minimalPreset.features}
 * >
 *   <ChatComposer.Messages />
 *   <ChatComposer.Input />
 * </ChatComposer>
 *
 * // Merge multiple presets
 * const customConfig = mergePresets(standardPreset, { features: ['voice'] })
 *
 * // Create a custom preset
 * const myPreset = createCustomPreset({
 *   layout: 'split-panel',
 *   features: ['thinking', 'tools'],
 *   theme: 'dark'
 * })
 * ```
 */

import type { ChatComposerLayout, ChatComposerFeature } from '../components/ai/ChatComposer'

// ============================================================================
// Types
// ============================================================================

/** Partial chat configuration (extends from types in ClarityChatProvider) */
export interface ClarityChatConfig {
  model?: string
  provider?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  streaming?: boolean
}

/** Preset theme */
export type PresetTheme = 'light' | 'dark' | 'system'

/** Base preset structure */
export interface ChatComposerPreset {
  /** Display name for the preset */
  name: string

  /** Description of what the preset is optimized for */
  description: string

  /** Array of enabled features */
  features: ChatComposerFeature[]

  /** Layout mode */
  layout: ChatComposerLayout

  /** Partial chat configuration */
  config: Partial<ClarityChatConfig>

  /** Theme preference */
  theme: PresetTheme

  /** Optional variant */
  variant?: 'default' | 'compact' | 'comfortable'

  /** Optional sidebar settings */
  sidebarSettings?: {
    position?: 'left' | 'right'
    width?: string | number
    defaultOpen?: boolean
    collapsible?: boolean
  }
}

/** Options for creating custom presets */
export interface CreateCustomPresetOptions {
  name?: string
  description?: string
  layout?: ChatComposerLayout
  features?: ChatComposerFeature[]
  config?: Partial<ClarityChatConfig>
  theme?: PresetTheme
  variant?: 'default' | 'compact' | 'comfortable'
  sidebarSettings?: ChatComposerPreset['sidebarSettings']
}

// ============================================================================
// Presets
// ============================================================================

/**
 * Minimal Preset - Basic chat with just messages and input
 *
 * Perfect for embedded use cases or when you want maximum simplicity.
 * No thinking indicators, tools, or suggestions.
 */
export const minimalPreset: ChatComposerPreset = {
  name: 'Minimal',
  description: 'Basic chat with just messages and input',
  layout: 'minimal',
  features: [],
  config: {
    streaming: true,
  },
  theme: 'system',
  variant: 'compact',
}

/**
 * Standard Preset - Messages, input, typing indicator, suggestions
 *
 * Good general-purpose chat interface with streaming support
 * and suggestion chips for user guidance.
 */
export const standardPreset: ChatComposerPreset = {
  name: 'Standard',
  description: 'Messages, input, typing indicator, suggestions',
  layout: 'standard',
  features: ['thinking', 'streaming', 'suggestions'],
  config: {
    streaming: true,
    temperature: 0.7,
  },
  theme: 'system',
  variant: 'default',
}

/**
 * Enterprise Preset - All features for comprehensive chat
 *
 * Full-featured preset with thinking, tools, citations,
 * attachments, voice, welcome screen, and memory support.
 * Best for production applications with advanced requirements.
 */
export const enterprisePreset: ChatComposerPreset = {
  name: 'Enterprise',
  description: 'All features: thinking, tools, citations, attachments, voice, welcome, memory',
  layout: 'split-panel',
  features: ['thinking', 'streaming', 'tools', 'suggestions', 'citations', 'attachments', 'voice', 'welcome'],
  config: {
    streaming: true,
    temperature: 0.7,
    maxTokens: 4096,
  },
  theme: 'system',
  variant: 'comfortable',
  sidebarSettings: {
    position: 'right',
    width: '380px',
    defaultOpen: true,
    collapsible: true,
  },
}

/**
 * Agent Preset - Optimized for agent execution
 *
 * Designed for displaying agent execution plans, tool cards,
 * and approval workflows. Includes thinking and tools features
 * with split-panel layout.
 */
export const agentPreset: ChatComposerPreset = {
  name: 'Agent',
  description: 'Optimized for agent execution with plan display, tool cards, approvals',
  layout: 'split-panel',
  features: ['thinking', 'tools', 'suggestions', 'streaming'],
  config: {
    streaming: true,
    temperature: 0.3,
    maxTokens: 8000,
  },
  theme: 'system',
  variant: 'default',
  sidebarSettings: {
    position: 'right',
    width: '360px',
    defaultOpen: true,
    collapsible: true,
  },
}

/**
 * Embedded Preset - Lightweight for embedding in other apps
 *
 * Minimal footprint preset for embedding in existing applications.
 * Compact layout with essential features only.
 */
export const embeddedPreset: ChatComposerPreset = {
  name: 'Embedded',
  description: 'Lightweight for embedding in other apps',
  layout: 'embedded',
  features: ['suggestions'],
  config: {
    streaming: true,
  },
  theme: 'system',
  variant: 'compact',
}

/**
 * Customer Support Preset - Chat for support use cases
 *
 * Optimized for customer support scenarios with suggested replies,
 * attachments support, and a welcoming interface.
 */
export const customerSupportPreset: ChatComposerPreset = {
  name: 'Customer Support',
  description: 'Chat for support use cases with suggested replies',
  layout: 'standard',
  features: ['thinking', 'suggestions', 'attachments', 'welcome', 'streaming'],
  config: {
    streaming: true,
    temperature: 0.6,
    systemPrompt: 'You are a helpful customer support agent. Provide clear, concise answers.',
  },
  theme: 'light',
  variant: 'comfortable',
}

/**
 * Developer Preset - Code-focused chat
 *
 * Designed for code-related conversations with enhanced code blocks,
 * thinking support, and tools for code execution and file operations.
 */
export const developerPreset: ChatComposerPreset = {
  name: 'Developer',
  description: 'Code-focused with enhanced code blocks, file tree support',
  layout: 'split-panel',
  features: ['thinking', 'tools', 'attachments', 'suggestions', 'streaming'],
  config: {
    streaming: true,
    temperature: 0.2,
    maxTokens: 8192,
    systemPrompt: 'You are an expert software developer. Provide detailed code solutions.',
  },
  theme: 'dark',
  variant: 'default',
  sidebarSettings: {
    position: 'right',
    width: '340px',
    defaultOpen: true,
    collapsible: true,
  },
}

/**
 * Fullscreen Preset - Takes full viewport
 *
 * Maximized layout for dedicated chat applications with
 * all features enabled and full-screen real estate.
 */
export const fullscreenPreset: ChatComposerPreset = {
  name: 'Fullscreen',
  description: 'Full-featured chat taking entire viewport',
  layout: 'fullscreen',
  features: ['thinking', 'streaming', 'tools', 'suggestions', 'citations', 'attachments', 'welcome'],
  config: {
    streaming: true,
    temperature: 0.7,
    maxTokens: 4096,
  },
  theme: 'system',
  variant: 'default',
  sidebarSettings: {
    position: 'left',
    width: '300px',
    defaultOpen: true,
    collapsible: true,
  },
}

// ============================================================================
// Preset Map
// ============================================================================

/** Map of all available presets */
export const PRESETS = {
  minimal: minimalPreset,
  standard: standardPreset,
  enterprise: enterprisePreset,
  agent: agentPreset,
  embedded: embeddedPreset,
  customerSupport: customerSupportPreset,
  developer: developerPreset,
  fullscreen: fullscreenPreset,
} as const

/** Type for available preset names */
export type PresetName = keyof typeof PRESETS

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Merge multiple presets into a single configuration
 *
 * Later presets override earlier ones. Features and config are deeply merged.
 *
 * @param presets - Presets to merge (in order of priority)
 * @returns Merged preset
 *
 * @example
 * ```tsx
 * const merged = mergePresets(standardPreset, {
 *   features: ['voice'],
 *   layout: 'split-panel'
 * })
 * ```
 */
export function mergePresets(
  ...presets: (ChatComposerPreset | Partial<ChatComposerPreset>)[]
): ChatComposerPreset {
  if (presets.length === 0) {
    return minimalPreset
  }

  return presets.reduce((acc, preset) => {
    if (!preset) return acc

    // Merge features (union, deduped)
    const mergedFeatures = Array.from(
      new Set([...(acc.features || []), ...(preset.features || [])])
    ) as ChatComposerFeature[]

    // Merge config (shallow merge)
    const mergedConfig = {
      ...acc.config,
      ...preset.config,
    }

    // Merge sidebar settings (shallow merge)
    const mergedSidebarSettings = preset.sidebarSettings
      ? {
          ...acc.sidebarSettings,
          ...preset.sidebarSettings,
        }
      : acc.sidebarSettings

    return {
      name: preset.name || acc.name,
      description: preset.description || acc.description,
      layout: preset.layout || acc.layout,
      features: mergedFeatures,
      config: mergedConfig,
      theme: preset.theme || acc.theme,
      variant: preset.variant || acc.variant,
      sidebarSettings: mergedSidebarSettings,
    }
  })
}

/**
 * Create a custom preset from scratch or based on an existing one
 *
 * @param options - Custom preset options
 * @param basePreset - Optional base preset to extend from
 * @returns Custom preset
 *
 * @example
 * ```tsx
 * // Create from scratch
 * const myPreset = createCustomPreset({
 *   name: 'My Chat',
 *   layout: 'standard',
 *   features: ['thinking', 'suggestions']
 * })
 *
 * // Extend existing preset
 * const extendedPreset = createCustomPreset(
 *   { features: ['voice'] },
 *   enterprisePreset
 * )
 * ```
 */
export function createCustomPreset(
  options: CreateCustomPresetOptions,
  basePreset: ChatComposerPreset = minimalPreset
): ChatComposerPreset {
  return {
    name: options.name || basePreset.name || 'Custom',
    description: options.description || basePreset.description || 'Custom preset',
    layout: options.layout || basePreset.layout || 'standard',
    features: options.features || basePreset.features || [],
    config: {
      ...basePreset.config,
      ...options.config,
    },
    theme: options.theme || basePreset.theme || 'system',
    variant: options.variant || basePreset.variant,
    sidebarSettings: options.sidebarSettings || basePreset.sidebarSettings,
  }
}

/**
 * Get a preset by name
 *
 * @param name - Preset name
 * @returns The preset, or undefined if not found
 *
 * @example
 * ```tsx
 * const preset = getPreset('enterprise')
 * if (preset) {
 *   // Use preset
 * }
 * ```
 */
export function getPreset(name: PresetName): ChatComposerPreset | undefined {
  return PRESETS[name]
}

/**
 * List all available preset names
 *
 * @returns Array of preset names
 *
 * @example
 * ```tsx
 * const names = listPresets()
 * console.log(names) // ['minimal', 'standard', 'enterprise', ...]
 * ```
 */
export function listPresets(): PresetName[] {
  return Object.keys(PRESETS) as PresetName[]
}

/**
 * Get a preset by name with type safety
 *
 * @param name - Preset name
 * @returns The preset
 * @throws Error if preset not found
 *
 * @example
 * ```tsx
 * const preset = requirePreset('enterprise')
 * <ChatComposer layout={preset.layout} features={preset.features} />
 * ```
 */
export function requirePreset(name: PresetName): ChatComposerPreset {
  const preset = getPreset(name)
  if (!preset) {
    throw new Error(`Preset '${name}' not found. Available presets: ${listPresets().join(', ')}`)
  }
  return preset
}

/**
 * Validate that a preset has required features
 *
 * @param preset - Preset to validate
 * @param requiredFeatures - Features that must be enabled
 * @returns true if preset has all required features
 *
 * @example
 * ```tsx
 * if (validatePresetFeatures(customPreset, ['tools', 'thinking'])) {
 *   // Preset supports agent execution
 * }
 * ```
 */
export function validatePresetFeatures(
  preset: ChatComposerPreset,
  requiredFeatures: ChatComposerFeature[]
): boolean {
  const featureSet = new Set(preset.features)
  return requiredFeatures.every((feature) => featureSet.has(feature))
}

/**
 * Get features that are missing from a preset
 *
 * @param preset - Preset to check
 * @param requiredFeatures - Features being checked
 * @returns Array of missing features
 *
 * @example
 * ```tsx
 * const missing = getMissingFeatures(myPreset, ['voice', 'attachments'])
 * if (missing.length > 0) {
 *   console.warn(`Missing features: ${missing.join(', ')}`)
 * }
 * ```
 */
export function getMissingFeatures(
  preset: ChatComposerPreset,
  requiredFeatures: ChatComposerFeature[]
): ChatComposerFeature[] {
  const featureSet = new Set(preset.features)
  return requiredFeatures.filter((feature) => !featureSet.has(feature))
}

/**
 * Clone a preset with optional overrides
 *
 * Creates a deep copy of a preset with selective property overrides.
 *
 * @param preset - Preset to clone
 * @param overrides - Properties to override
 * @returns Cloned preset
 *
 * @example
 * ```tsx
 * const darkVersion = clonePreset(standardPreset, { theme: 'dark' })
 * const voiceEnabled = clonePreset(minimalPreset, {
 *   features: ['voice']
 * })
 * ```
 */
export function clonePreset(
  preset: ChatComposerPreset,
  overrides: Partial<ChatComposerPreset> = {}
): ChatComposerPreset {
  return {
    name: overrides.name ?? preset.name,
    description: overrides.description ?? preset.description,
    layout: overrides.layout ?? preset.layout,
    features: overrides.features ?? [...preset.features],
    config: {
      ...preset.config,
      ...(overrides.config ?? {}),
    },
    theme: overrides.theme ?? preset.theme,
    variant: overrides.variant ?? preset.variant,
    sidebarSettings: overrides.sidebarSettings ?? { ...preset.sidebarSettings },
  }
}

/**
 * Get a summary of a preset configuration
 *
 * @param preset - Preset to summarize
 * @returns Summary string
 *
 * @example
 * ```tsx
 * console.log(getPresetSummary(enterprisePreset))
 * // "Enterprise preset (split-panel): thinking, tools, citations, attachments, voice, welcome"
 * ```
 */
export function getPresetSummary(preset: ChatComposerPreset): string {
  const featureList = preset.features.length > 0 ? preset.features.join(', ') : 'none'
  return `${preset.name} (${preset.layout}): ${featureList}`
}

// ============================================================================
// Exports
// ============================================================================

/** Export all preset names as union type */
export type * from '../components/ai/ChatComposer'

/**
 * Re-export ChatComposer types for convenience
 */
export type {
  ChatComposerLayout,
  ChatComposerFeature,
  ChatComposerContextValue,
  ChatComposerProps,
} from '../components/ai/ChatComposer'

/**
 * Re-export Theme Presets
 */
export {
  lightThemePreset,
  darkThemePreset,
  systemThemePreset,
  customThemePreset,
  THEME_PRESETS,
  getThemePreset,
  listThemePresets,
  createCustomThemePreset,
  mergeThemePresets,
  cloneThemePreset,
  generateThemeCssVariables,
} from './theme-presets'

export type {
  ThemePalette,
  ThemeTypography,
  ThemeSpacing,
  ThemeBorderRadius,
  ThemeShadows,
  ThemeComponents,
  ThemePreset,
  CreateCustomThemePresetOptions,
  ThemePresetName,
} from './theme-presets'

/**
 * Re-export Plugin Presets
 */
export {
  defaultPluginPreset,
  minimalPluginPreset,
  extendedPluginPreset,
  developerPluginPreset,
  PLUGIN_PRESETS,
  getPluginPreset,
  listPluginPresets,
  enablePlugin,
  disablePlugin,
  addPlugin,
  removePlugin,
  getPlugin,
  updatePluginOptions,
  mergePluginPresets,
  clonePluginPreset,
  createCustomPluginPreset,
  getEnabledPlugins,
  getDisabledPlugins,
  validatePluginDependencies,
  getPluginPresetSummary,
} from './plugin-presets'

export type {
  PluginConfig,
  PluginPreset,
  CreateCustomPluginPresetOptions,
  PluginPresetName,
} from './plugin-presets'

/**
 * Re-export Feature Presets
 */
export {
  basicFeaturePreset,
  standardFeaturePreset,
  advancedFeaturePreset,
  enterpriseFeaturePreset,
  FEATURE_PRESETS,
  getFeaturePreset,
  listFeaturePresets,
  enableFeature,
  disableFeature,
  addFeature,
  removeFeature,
  getFeature,
  updateFeatureOptions,
  getEnabledFeatures,
  getDisabledFeatures,
  getFeaturesByCategory,
  mergeFeaturePresets,
  cloneFeaturePreset,
  createCustomFeaturePreset,
  getFeaturePresetSummary,
  requiresBackendSupport,
  getBackendRequiredFeatures,
} from './feature-presets'

export type {
  FeatureConfig,
  FeaturePreset,
  CreateCustomFeaturePresetOptions,
  FeaturePresetName,
} from './feature-presets'

/**
 * Re-export Chat Presets
 */
export {
  chatPresets,
  hookPresets,
  applyChatPreset,
  applyHookPreset,
} from './chat-presets'

export type {
  ChatPreset,
  HookPreset,
} from './chat-presets'
