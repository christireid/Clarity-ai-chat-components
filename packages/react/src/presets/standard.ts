/**
 * Standard Preset - Feature-complete chat configuration
 *
 * General-purpose chat interface with essential features like streaming,
 * thinking indicators, and suggestions. Perfect for most applications.
 *
 * @example
 * ```tsx
 * import { standardPreset, createPreset } from './presets'
 *
 * // Use standard preset directly
 * <ChatComposer {...standardPreset.config} />
 *
 * // Create custom standard-based preset
 * const customStandard = createPreset('standard', {
 *   theme: { primary: '#0066cc' }
 * })
 * ```
 */

import type { ReactNode } from 'react'

// ============================================================================
// Types
// ============================================================================

export interface StandardProviderConfig {
  /** Model identifier */
  model: string
  /** Provider name */
  provider: string
  /** Temperature for generation (0-1) */
  temperature: number
  /** Maximum tokens in response */
  maxTokens: number
  /** Enable streaming responses */
  streaming: boolean
  /** System prompt template */
  systemPrompt?: string
  /** API key for authentication */
  apiKey?: string
  /** Base URL for API requests */
  apiBase?: string
  /** Request timeout in milliseconds */
  timeout?: number
  /** Retry attempts on failure */
  retryAttempts?: number
}

export interface StandardFeatures {
  /** Display thinking process indicator */
  thinking: boolean
  /** Show message citations */
  citations: boolean
  /** Enable suggestion chips */
  suggestions: boolean
  /** Typing indicator animation */
  typingIndicator: boolean
  /** Show message timestamps */
  timestamps: boolean
  /** Auto-scroll to latest message */
  autoScroll: boolean
  /** Enable markdown rendering */
  markdown: boolean
  /** Copy button on messages */
  copyButton: boolean
  /** Like/dislike reactions */
  messageReactions: boolean
}

export interface StandardComponentProps {
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
  /** Show sidebar */
  showSidebar: boolean
  /** Sidebar width */
  sidebarWidth: string | number
  /** Maximum message length */
  maxMessageLength: number
  /** Placeholder text */
  placeholder: string
}

export interface StandardTheme {
  /** Primary brand color */
  primary: string
  /** Secondary accent color */
  secondary: string
  /** Background color */
  background: string
  /** Surface/card color */
  surface: string
  /** Text primary color */
  text: string
  /** Text secondary color */
  textSecondary: string
  /** Border color */
  border: string
  /** Success color */
  success: string
  /** Warning color */
  warning: string
  /** Error color */
  error: string
  /** Border radius */
  borderRadius: string
  /** Font family */
  fontFamily: string
  /** Base font size */
  fontSize: string
}

// ============================================================================
// Default Provider Configuration
// ============================================================================

/**
 * Default provider configuration for standard preset
 */
export const defaultProviderConfig: StandardProviderConfig = {
  model: 'claude-opus-4.5',
  provider: 'anthropic',
  temperature: 0.7,
  maxTokens: 4096,
  streaming: true,
  timeout: 30000,
  retryAttempts: 2,
}

// ============================================================================
// Default Features
// ============================================================================

/**
 * Default features for standard preset
 */
export const defaultFeatures: StandardFeatures = {
  thinking: true,
  citations: false,
  suggestions: true,
  typingIndicator: true,
  timestamps: true,
  autoScroll: true,
  markdown: true,
  copyButton: true,
  messageReactions: true,
}

// ============================================================================
// Default Component Props
// ============================================================================

/**
 * Default component props for standard preset
 */
export const defaultComponentProps: StandardComponentProps = {
  height: '600px',
  width: '100%',
  showHeader: true,
  showInput: true,
  showSidebar: false,
  sidebarWidth: '300px',
  maxMessageLength: 2000,
  placeholder: 'Type your message here...',
}

// ============================================================================
// Default Theme Overrides
// ============================================================================

/**
 * Default theme overrides for standard preset
 */
export const defaultTheme: StandardTheme = {
  primary: '#0066cc',
  secondary: '#00cc99',
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e5e5e5',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  borderRadius: '8px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',
}

// ============================================================================
// Preset Interface
// ============================================================================

export interface StandardPreset {
  name: string
  description: string
  provider: StandardProviderConfig
  features: StandardFeatures
  componentProps: StandardComponentProps
  theme: StandardTheme
}

// ============================================================================
// Main Preset Export
// ============================================================================

/**
 * Standard chat preset
 *
 * Feature-complete configuration optimized for:
 * - General-purpose chat applications
 * - Streaming responses with thinking indicators
 * - User suggestion and feedback
 * - Professional appearance
 */
export const standardPreset: StandardPreset = {
  name: 'Standard',
  description: 'Feature-complete chat interface with thinking, suggestions, and streaming',
  provider: defaultProviderConfig,
  features: defaultFeatures,
  componentProps: defaultComponentProps,
  theme: defaultTheme,
}

// ============================================================================
// Factory Function
// ============================================================================

export interface CreateStandardPresetOptions {
  provider?: Partial<StandardProviderConfig>
  features?: Partial<StandardFeatures>
  componentProps?: Partial<StandardComponentProps>
  theme?: Partial<StandardTheme>
}

/**
 * Create a custom standard preset with optional overrides
 *
 * @param options - Configuration options
 * @returns Custom standard preset
 *
 * @example
 * ```tsx
 * const customStandard = createPreset({
 *   theme: { primary: '#ff6b35' },
 *   features: { citations: true },
 *   provider: { model: 'gpt-4' }
 * })
 * ```
 */
export function createPreset(options: CreateStandardPresetOptions = {}): StandardPreset {
  return {
    name: 'Standard (Custom)',
    description: 'Customized standard chat interface',
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
 * Merge standard preset with another configuration
 *
 * @param overrides - Properties to override
 * @returns Merged preset
 */
export function mergePreset(overrides: CreateStandardPresetOptions): StandardPreset {
  return createPreset(overrides)
}

/**
 * Clone the standard preset
 *
 * @returns Cloned preset
 */
export function clonePreset(): StandardPreset {
  return {
    ...standardPreset,
    provider: { ...standardPreset.provider },
    features: { ...standardPreset.features },
    componentProps: { ...standardPreset.componentProps },
    theme: { ...standardPreset.theme },
  }
}

/**
 * Get preset summary
 *
 * @returns Summary string
 */
export function getPresetSummary(): string {
  const enabledFeatures = Object.entries(defaultFeatures)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(', ')

  return `${standardPreset.name}: ${standardPreset.description} (${enabledFeatures})`
}

/**
 * Export all utilities as object
 */
export const standard = {
  preset: standardPreset,
  defaultProviderConfig,
  defaultFeatures,
  defaultComponentProps,
  defaultTheme,
  createPreset,
  mergePreset,
  clonePreset,
  getPresetSummary,
}
