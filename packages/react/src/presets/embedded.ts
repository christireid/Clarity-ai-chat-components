/**
 * Embedded Preset - Lightweight widget configuration
 *
 * Compact preset for embedding chat widgets in other applications.
 * Minimal UI overhead with essential features.
 *
 * @example
 * ```tsx
 * import { embeddedPreset, createPreset } from './presets'
 *
 * // Use embedded preset for widget integration
 * <ChatWidget {...embeddedPreset.config} />
 *
 * // Create custom embedded-based preset
 * const customEmbedded = createPreset({
 *   theme: { primary: '#0066cc' }
 * })
 * ```
 */

import type { ReactNode } from 'react'

// ============================================================================
// Types
// ============================================================================

export interface EmbeddedProviderConfig {
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

export interface EmbeddedFeatures {
  /** Display typing indicator */
  typingIndicator: boolean
  /** Enable suggestion chips */
  suggestions: boolean
  /** Auto-scroll to latest message */
  autoScroll: boolean
  /** Enable markdown rendering */
  markdown: boolean
  /** Copy button on messages */
  copyButton: boolean
  /** Show compact message time indicators */
  compactTime: boolean
}

export interface EmbeddedComponentProps {
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
  /** Position widget (bottom-right, bottom-left, etc.) */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
  /** Widget is floating/popover */
  floating: boolean
  /** Show minimize button */
  showMinimize: boolean
  /** Initial minimized state */
  minimized: boolean
}

export interface EmbeddedTheme {
  /** Primary brand color */
  primary: string
  /** Background color */
  background: string
  /** Surface/card color */
  surface: string
  /** Text color */
  text: string
  /** Text secondary color */
  textSecondary: string
  /** Border color */
  border: string
  /** Border radius */
  borderRadius: string
  /** Font family */
  fontFamily: string
  /** Font size */
  fontSize: string
  /** Box shadow */
  boxShadow: string
  /** Widget max width */
  maxWidth: string | number
  /** Widget border width */
  borderWidth: string | number
}

// ============================================================================
// Default Provider Configuration
// ============================================================================

/**
 * Default provider configuration for embedded preset
 */
export const defaultProviderConfig: EmbeddedProviderConfig = {
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
 * Default features for embedded preset
 */
export const defaultFeatures: EmbeddedFeatures = {
  typingIndicator: true,
  suggestions: true,
  autoScroll: true,
  markdown: true,
  copyButton: false,
  compactTime: true,
}

// ============================================================================
// Default Component Props
// ============================================================================

/**
 * Default component props for embedded preset
 */
export const defaultComponentProps: EmbeddedComponentProps = {
  height: '500px',
  width: '380px',
  showHeader: true,
  showInput: true,
  position: 'bottom-right',
  floating: true,
  showMinimize: true,
  minimized: false,
}

// ============================================================================
// Default Theme Overrides
// ============================================================================

/**
 * Default theme overrides for embedded preset
 */
export const defaultTheme: EmbeddedTheme = {
  primary: '#0066cc',
  background: '#ffffff',
  surface: '#f9f9f9',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e0e0e0',
  borderRadius: '12px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '13px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  maxWidth: '400px',
  borderWidth: '1px',
}

// ============================================================================
// Preset Interface
// ============================================================================

export interface EmbeddedPreset {
  name: string
  description: string
  provider: EmbeddedProviderConfig
  features: EmbeddedFeatures
  componentProps: EmbeddedComponentProps
  theme: EmbeddedTheme
}

// ============================================================================
// Main Preset Export
// ============================================================================

/**
 * Embedded widget preset
 *
 * Compact configuration optimized for:
 * - Embedding in external websites
 * - Widget/iframe integration
 * - Minimal resource footprint
 * - Clean, minimal UI
 */
export const embeddedPreset: EmbeddedPreset = {
  name: 'Embedded',
  description: 'Lightweight widget preset for embedding in other applications',
  provider: defaultProviderConfig,
  features: defaultFeatures,
  componentProps: defaultComponentProps,
  theme: defaultTheme,
}

// ============================================================================
// Factory Function
// ============================================================================

export interface CreateEmbeddedPresetOptions {
  provider?: Partial<EmbeddedProviderConfig>
  features?: Partial<EmbeddedFeatures>
  componentProps?: Partial<EmbeddedComponentProps>
  theme?: Partial<EmbeddedTheme>
}

/**
 * Create a custom embedded preset with optional overrides
 *
 * @param options - Configuration options
 * @returns Custom embedded preset
 *
 * @example
 * ```tsx
 * const customEmbedded = createPreset({
 *   theme: { primary: '#ff6b35', maxWidth: '350px' },
 *   componentProps: { position: 'bottom-left' }
 * })
 * ```
 */
export function createPreset(options: CreateEmbeddedPresetOptions = {}): EmbeddedPreset {
  return {
    name: 'Embedded (Custom)',
    description: 'Customized embedded widget interface',
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
 * Merge embedded preset with another configuration
 *
 * @param overrides - Properties to override
 * @returns Merged preset
 */
export function mergePreset(overrides: CreateEmbeddedPresetOptions): EmbeddedPreset {
  return createPreset(overrides)
}

/**
 * Clone the embedded preset
 *
 * @returns Cloned preset
 */
export function clonePreset(): EmbeddedPreset {
  return {
    ...embeddedPreset,
    provider: { ...embeddedPreset.provider },
    features: { ...embeddedPreset.features },
    componentProps: { ...embeddedPreset.componentProps },
    theme: { ...embeddedPreset.theme },
  }
}

/**
 * Get preset summary
 *
 * @returns Summary string
 */
export function getPresetSummary(): string {
  return `${embeddedPreset.name}: ${embeddedPreset.description}`
}

/**
 * Configure widget position
 *
 * @param position - Widget position
 * @returns Updated preset
 */
export function setPosition(
  position: EmbeddedComponentProps['position']
): EmbeddedPreset {
  const updated = clonePreset()
  updated.componentProps.position = position
  return updated
}

/**
 * Configure widget size
 *
 * @param width - Widget width
 * @param height - Widget height
 * @returns Updated preset
 */
export function setSize(width: string | number, height: string | number): EmbeddedPreset {
  const updated = clonePreset()
  updated.componentProps.width = width
  updated.componentProps.height = height
  return updated
}

/**
 * Configure floating behavior
 *
 * @param floating - Enable floating mode
 * @param minimizable - Allow minimization
 * @returns Updated preset
 */
export function setFloating(floating: boolean, minimizable?: boolean): EmbeddedPreset {
  const updated = clonePreset()
  updated.componentProps.floating = floating
  if (minimizable !== undefined) {
    updated.componentProps.showMinimize = minimizable
  }
  return updated
}

/**
 * Export all utilities as object
 */
export const embedded = {
  preset: embeddedPreset,
  defaultProviderConfig,
  defaultFeatures,
  defaultComponentProps,
  defaultTheme,
  createPreset,
  mergePreset,
  clonePreset,
  getPresetSummary,
  setPosition,
  setSize,
  setFloating,
}
