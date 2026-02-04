/**
 * Minimal Preset - Lightweight chat configuration
 *
 * Perfect for embedded use cases or when you want maximum simplicity.
 * Includes only essential messaging functionality with basic styling.
 *
 * @example
 * ```tsx
 * import { minimalPreset, createPreset } from './presets'
 *
 * // Use minimal preset directly
 * <ChatComposer {...minimalPreset.config} />
 *
 * // Create custom minimal-based preset
 * const customMinimal = createPreset('minimal', {
 *   theme: { primary: '#0066cc' }
 * })
 * ```
 */

import type { ReactNode } from 'react'

// ============================================================================
// Types
// ============================================================================

export interface MinimalProviderConfig {
  /** Model identifier */
  model: string
  /** Provider name */
  provider: string
  /** Temperature for generation */
  temperature: number
  /** Enable streaming responses */
  streaming: boolean
  /** API key for authentication */
  apiKey?: string
  /** Base URL for API requests */
  apiBase?: string
  /** Request timeout in milliseconds */
  timeout?: number
}

export interface MinimalFeatures {
  /** Display typing indicator */
  typingIndicator: boolean
  /** Show message timestamps */
  timestamps: boolean
  /** Auto-scroll to latest message */
  autoScroll: boolean
  /** Enable markdown rendering */
  markdown: boolean
}

export interface MinimalComponentProps {
  /** Container class name */
  className?: string
  /** Custom header content */
  header?: ReactNode
  /** Custom footer content */
  footer?: ReactNode
  /** Container height */
  height?: string | number
  /** Container width */
  width?: string | number
  /** Show header */
  showHeader: boolean
  /** Show input area */
  showInput: boolean
}

export interface MinimalTheme {
  /** Primary brand color */
  primary: string
  /** Background color */
  background: string
  /** Text color */
  text: string
  /** Border color */
  border: string
  /** Border radius */
  borderRadius: string
  /** Font family */
  fontFamily: string
  /** Font size */
  fontSize: string
}

// ============================================================================
// Default Provider Configuration
// ============================================================================

/**
 * Default provider configuration for minimal preset
 */
export const defaultProviderConfig: MinimalProviderConfig = {
  model: 'claude-opus-4.5',
  provider: 'anthropic',
  temperature: 0.7,
  streaming: true,
  timeout: 30000,
}

// ============================================================================
// Default Features
// ============================================================================

/**
 * Default features for minimal preset
 */
export const defaultFeatures: MinimalFeatures = {
  typingIndicator: true,
  timestamps: false,
  autoScroll: true,
  markdown: true,
}

// ============================================================================
// Default Component Props
// ============================================================================

/**
 * Default component props for minimal preset
 */
export const defaultComponentProps: MinimalComponentProps = {
  height: '500px',
  width: '100%',
  showHeader: false,
  showInput: true,
}

// ============================================================================
// Default Theme Overrides
// ============================================================================

/**
 * Default theme overrides for minimal preset
 */
export const defaultTheme: MinimalTheme = {
  primary: '#0066cc',
  background: '#ffffff',
  text: '#000000',
  border: '#e5e5e5',
  borderRadius: '8px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',
}

// ============================================================================
// Preset Interface
// ============================================================================

export interface MinimalPreset {
  name: string
  description: string
  provider: MinimalProviderConfig
  features: MinimalFeatures
  componentProps: MinimalComponentProps
  theme: MinimalTheme
}

// ============================================================================
// Main Preset Export
// ============================================================================

/**
 * Minimal chat preset
 *
 * Ultra-lightweight configuration optimized for:
 * - Embedded widgets
 * - Simple messaging interfaces
 * - Minimal resource usage
 * - Quick integration
 */
export const minimalPreset: MinimalPreset = {
  name: 'Minimal',
  description: 'Ultra-lightweight chat interface with essential messaging only',
  provider: defaultProviderConfig,
  features: defaultFeatures,
  componentProps: defaultComponentProps,
  theme: defaultTheme,
}

// ============================================================================
// Factory Function
// ============================================================================

export interface CreateMinimalPresetOptions {
  provider?: Partial<MinimalProviderConfig>
  features?: Partial<MinimalFeatures>
  componentProps?: Partial<MinimalComponentProps>
  theme?: Partial<MinimalTheme>
}

/**
 * Create a custom minimal preset with optional overrides
 *
 * @param options - Configuration options
 * @returns Custom minimal preset
 *
 * @example
 * ```tsx
 * const customMinimal = createPreset({
 *   theme: { primary: '#ff6b35' },
 *   features: { timestamps: true }
 * })
 * ```
 */
export function createPreset(options: CreateMinimalPresetOptions = {}): MinimalPreset {
  return {
    name: 'Minimal (Custom)',
    description: 'Customized minimal chat interface',
    provider: {
      ...defaultProviderConfig,
      ...options.provider,
    },
    features: {
      ...defaultFeatures,
      ...options.features,
    },
    componentProps: {
      ...defaultComponentProps,
      ...options.componentProps,
    },
    theme: {
      ...defaultTheme,
      ...options.theme,
    },
  }
}

/**
 * Merge minimal preset with another configuration
 *
 * @param overrides - Properties to override
 * @returns Merged preset
 */
export function mergePreset(overrides: CreateMinimalPresetOptions): MinimalPreset {
  return createPreset(overrides)
}

/**
 * Clone the minimal preset
 *
 * @returns Cloned preset
 */
export function clonePreset(): MinimalPreset {
  return {
    ...minimalPreset,
    provider: { ...minimalPreset.provider },
    features: { ...minimalPreset.features },
    componentProps: { ...minimalPreset.componentProps },
    theme: { ...minimalPreset.theme },
  }
}

/**
 * Get preset summary
 *
 * @returns Summary string
 */
export function getPresetSummary(): string {
  return `${minimalPreset.name}: ${minimalPreset.description}`
}

/**
 * Export all utilities as object
 */
export const minimal = {
  preset: minimalPreset,
  defaultProviderConfig,
  defaultFeatures,
  defaultComponentProps,
  defaultTheme,
  createPreset,
  mergePreset,
  clonePreset,
  getPresetSummary,
}
