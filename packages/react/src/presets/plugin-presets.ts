/**
 * Plugin Presets - Pre-configured plugin sets for different scenarios
 *
 * Provides plugin presets for different use cases: Default (essential plugins),
 * Minimal (lightweight), Extended (full suite), and Developer (development tools).
 *
 * @example
 * ```tsx
 * import { defaultPluginPreset, developerPluginPreset } from './presets'
 *
 * // Use default plugins
 * const app = new App({
 *   plugins: defaultPluginPreset
 * })
 *
 * // Use developer plugins with extras
 * const devApp = new App({
 *   plugins: developerPluginPreset
 * })
 * ```
 */

// ============================================================================
// Types
// ============================================================================

/** Plugin configuration */
export interface PluginConfig {
  /** Plugin identifier */
  id: string
  /** Plugin display name */
  name: string
  /** Plugin description */
  description: string
  /** Whether plugin is enabled */
  enabled: boolean
  /** Plugin version */
  version?: string
  /** Plugin options */
  options?: Record<string, any>
  /** Plugin priority (lower = higher priority) */
  priority?: number
  /** Plugin dependencies */
  dependencies?: string[]
}

/** Complete plugin set */
export interface PluginPreset {
  /** Preset name */
  name: string
  /** Preset description */
  description: string
  /** Array of plugin configurations */
  plugins: PluginConfig[]
  /** Whether to allow additional plugins */
  allowExtensions?: boolean
}

/** Options for creating custom plugin presets */
export interface CreateCustomPluginPresetOptions {
  name: string
  description?: string
  plugins: PluginConfig[]
  allowExtensions?: boolean
}

// ============================================================================
// Core Plugins (Used in All Presets)
// ============================================================================

const corePlugins: PluginConfig[] = [
  {
    id: 'chat-core',
    name: 'Chat Core',
    description: 'Core chat functionality and message handling',
    enabled: true,
    version: '1.0.0',
    priority: 1,
  },
  {
    id: 'message-parser',
    name: 'Message Parser',
    description: 'Parses and formats chat messages',
    enabled: true,
    version: '1.0.0',
    priority: 2,
    dependencies: ['chat-core'],
  },
  {
    id: 'message-storage',
    name: 'Message Storage',
    description: 'Stores and retrieves chat messages',
    enabled: true,
    version: '1.0.0',
    priority: 3,
    dependencies: ['chat-core'],
  },
]

// ============================================================================
// Default Plugin Preset
// ============================================================================

export const defaultPluginPreset: PluginPreset = {
  name: 'Default',
  description: 'Essential plugins for standard chat functionality',
  allowExtensions: true,
  plugins: [
    ...corePlugins,
    {
      id: 'typing-indicator',
      name: 'Typing Indicator',
      description: 'Shows typing status for messages',
      enabled: true,
      version: '1.0.0',
      priority: 4,
      dependencies: ['chat-core'],
    },
    {
      id: 'message-timestamps',
      name: 'Message Timestamps',
      description: 'Adds timestamps to messages',
      enabled: true,
      version: '1.0.0',
      priority: 5,
    },
    {
      id: 'basic-markdown',
      name: 'Basic Markdown',
      description: 'Renders basic markdown in messages',
      enabled: true,
      version: '1.0.0',
      priority: 6,
      dependencies: ['message-parser'],
    },
    {
      id: 'error-handling',
      name: 'Error Handling',
      description: 'Handles and displays errors gracefully',
      enabled: true,
      version: '1.0.0',
      priority: 7,
    },
  ],
}

// ============================================================================
// Minimal Plugin Preset
// ============================================================================

export const minimalPluginPreset: PluginPreset = {
  name: 'Minimal',
  description: 'Lightweight plugin set with just essential features',
  allowExtensions: false,
  plugins: [
    ...corePlugins,
    {
      id: 'basic-markdown',
      name: 'Basic Markdown',
      description: 'Renders basic markdown in messages',
      enabled: true,
      version: '1.0.0',
      priority: 4,
      dependencies: ['message-parser'],
    },
    {
      id: 'error-handling',
      name: 'Error Handling',
      description: 'Handles and displays errors gracefully',
      enabled: true,
      version: '1.0.0',
      priority: 5,
    },
  ],
}

// ============================================================================
// Extended Plugin Preset
// ============================================================================

export const extendedPluginPreset: PluginPreset = {
  name: 'Extended',
  description: 'Full-featured plugin set with all available features',
  allowExtensions: true,
  plugins: [
    ...corePlugins,
    {
      id: 'typing-indicator',
      name: 'Typing Indicator',
      description: 'Shows typing status for messages',
      enabled: true,
      version: '1.0.0',
      priority: 4,
      dependencies: ['chat-core'],
    },
    {
      id: 'message-timestamps',
      name: 'Message Timestamps',
      description: 'Adds timestamps to messages',
      enabled: true,
      version: '1.0.0',
      priority: 5,
    },
    {
      id: 'full-markdown',
      name: 'Full Markdown',
      description: 'Complete markdown rendering with syntax highlighting',
      enabled: true,
      version: '2.0.0',
      priority: 6,
      dependencies: ['message-parser'],
      options: {
        enableCodeHighlighting: true,
        enableTables: true,
        enableTaskLists: true,
      },
    },
    {
      id: 'code-block-renderer',
      name: 'Code Block Renderer',
      description: 'Renders code blocks with syntax highlighting',
      enabled: true,
      version: '1.1.0',
      priority: 7,
      dependencies: ['full-markdown'],
      options: {
        theme: 'default',
        showLineNumbers: true,
        copyButton: true,
      },
    },
    {
      id: 'emoji-support',
      name: 'Emoji Support',
      description: 'Supports emoji rendering and emoji picker',
      enabled: true,
      version: '1.0.0',
      priority: 8,
    },
    {
      id: 'message-reactions',
      name: 'Message Reactions',
      description: 'Allows adding emoji reactions to messages',
      enabled: true,
      version: '1.0.0',
      priority: 9,
      dependencies: ['emoji-support'],
    },
    {
      id: 'message-search',
      name: 'Message Search',
      description: 'Provides full-text search across messages',
      enabled: true,
      version: '1.0.0',
      priority: 10,
      dependencies: ['message-storage'],
      options: {
        indexing: true,
        highlightResults: true,
      },
    },
    {
      id: 'user-mentions',
      name: 'User Mentions',
      description: 'Supports @mentions and user tagging',
      enabled: true,
      version: '1.0.0',
      priority: 11,
      options: {
        enableNotifications: true,
      },
    },
    {
      id: 'url-preview',
      name: 'URL Preview',
      description: 'Shows preview for URLs in messages',
      enabled: true,
      version: '1.0.0',
      priority: 12,
      options: {
        fetchMetadata: true,
        imagePreview: true,
      },
    },
    {
      id: 'file-attachment',
      name: 'File Attachment',
      description: 'Supports file uploads and sharing',
      enabled: true,
      version: '1.0.0',
      priority: 13,
      options: {
        maxFileSize: 10485760, // 10MB
        allowedTypes: ['*'],
      },
    },
    {
      id: 'message-edit',
      name: 'Message Edit',
      description: 'Allows editing previously sent messages',
      enabled: true,
      version: '1.0.0',
      priority: 14,
      dependencies: ['message-storage'],
    },
    {
      id: 'message-delete',
      name: 'Message Delete',
      description: 'Allows deleting messages with soft-delete',
      enabled: true,
      version: '1.0.0',
      priority: 15,
      dependencies: ['message-storage'],
    },
    {
      id: 'thread-support',
      name: 'Thread Support',
      description: 'Enables message threading and conversations',
      enabled: true,
      version: '1.0.0',
      priority: 16,
      dependencies: ['message-storage'],
    },
    {
      id: 'typing-animation',
      name: 'Typing Animation',
      description: 'Adds smooth typing animation to messages',
      enabled: true,
      version: '1.0.0',
      priority: 17,
    },
    {
      id: 'error-handling',
      name: 'Error Handling',
      description: 'Comprehensive error handling and reporting',
      enabled: true,
      version: '1.0.0',
      priority: 18,
      options: {
        logErrors: true,
        showErrorBoundary: true,
      },
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Tracks user interactions and chat metrics',
      enabled: true,
      version: '1.0.0',
      priority: 19,
      options: {
        trackEvents: true,
        trackPerformance: true,
      },
    },
  ],
}

// ============================================================================
// Developer Plugin Preset
// ============================================================================

export const developerPluginPreset: PluginPreset = {
  name: 'Developer',
  description: 'Comprehensive plugin set with development and debugging tools',
  allowExtensions: true,
  plugins: [
    ...extendedPluginPreset.plugins,
    {
      id: 'debug-console',
      name: 'Debug Console',
      description: 'In-browser debug console for troubleshooting',
      enabled: true,
      version: '1.0.0',
      priority: 20,
      options: {
        enableLogging: true,
        persistLogs: true,
      },
    },
    {
      id: 'performance-monitor',
      name: 'Performance Monitor',
      description: 'Monitors chat performance metrics',
      enabled: true,
      version: '1.0.0',
      priority: 21,
      options: {
        trackFrameRate: true,
        trackMemory: true,
        trackNetworkTime: true,
      },
    },
    {
      id: 'state-inspector',
      name: 'State Inspector',
      description: 'Inspects and visualizes application state',
      enabled: true,
      version: '1.0.0',
      priority: 22,
      options: {
        enableDevtools: true,
      },
    },
    {
      id: 'network-inspector',
      name: 'Network Inspector',
      description: 'Monitors and logs network requests',
      enabled: true,
      version: '1.0.0',
      priority: 23,
      options: {
        captureRequests: true,
        captureResponses: true,
      },
    },
    {
      id: 'theme-debugger',
      name: 'Theme Debugger',
      description: 'Helps debug theme and styling issues',
      enabled: true,
      version: '1.0.0',
      priority: 24,
      options: {
        showColorPicker: true,
        showThemeVariables: true,
      },
    },
    {
      id: 'accessibility-checker',
      name: 'Accessibility Checker',
      description: 'Checks and reports accessibility issues',
      enabled: true,
      version: '1.0.0',
      priority: 25,
      options: {
        checkContrast: true,
        checkAriaLabels: true,
      },
    },
    {
      id: 'error-boundary-debug',
      name: 'Error Boundary Debug',
      description: 'Enhanced error tracking and debugging',
      enabled: true,
      version: '1.0.0',
      priority: 26,
      dependencies: ['error-handling'],
      options: {
        captureStackTraces: true,
        recordSessions: true,
      },
    },
  ],
}

// ============================================================================
// Plugin Preset Map
// ============================================================================

export const PLUGIN_PRESETS = {
  default: defaultPluginPreset,
  minimal: minimalPluginPreset,
  extended: extendedPluginPreset,
  developer: developerPluginPreset,
} as const

export type PluginPresetName = keyof typeof PLUGIN_PRESETS

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get a plugin preset by name
 */
export function getPluginPreset(name: PluginPresetName): PluginPreset | undefined {
  return PLUGIN_PRESETS[name]
}

/**
 * List all available plugin preset names
 */
export function listPluginPresets(): PluginPresetName[] {
  return Object.keys(PLUGIN_PRESETS) as PluginPresetName[]
}

/**
 * Enable a plugin in a preset by ID
 */
export function enablePlugin(preset: PluginPreset, pluginId: string): PluginPreset {
  return {
    ...preset,
    plugins: preset.plugins.map((p) => (p.id === pluginId ? { ...p, enabled: true } : p)),
  }
}

/**
 * Disable a plugin in a preset by ID
 */
export function disablePlugin(preset: PluginPreset, pluginId: string): PluginPreset {
  return {
    ...preset,
    plugins: preset.plugins.map((p) => (p.id === pluginId ? { ...p, enabled: false } : p)),
  }
}

/**
 * Add a plugin to a preset
 */
export function addPlugin(preset: PluginPreset, plugin: PluginConfig): PluginPreset {
  return {
    ...preset,
    plugins: [...preset.plugins, plugin],
  }
}

/**
 * Remove a plugin from a preset by ID
 */
export function removePlugin(preset: PluginPreset, pluginId: string): PluginPreset {
  return {
    ...preset,
    plugins: preset.plugins.filter((p) => p.id !== pluginId),
  }
}

/**
 * Get a specific plugin from a preset
 */
export function getPlugin(preset: PluginPreset, pluginId: string): PluginConfig | undefined {
  return preset.plugins.find((p) => p.id === pluginId)
}

/**
 * Update plugin options in a preset
 */
export function updatePluginOptions(
  preset: PluginPreset,
  pluginId: string,
  options: Record<string, any>
): PluginPreset {
  return {
    ...preset,
    plugins: preset.plugins.map((p) =>
      p.id === pluginId
        ? {
            ...p,
            options: {
              ...p.options,
              ...options,
            },
          }
        : p
    ),
  }
}

/**
 * Merge multiple plugin presets
 */
export function mergePluginPresets(...presets: PluginPreset[]): PluginPreset {
  if (presets.length === 0) {
    return defaultPluginPreset
  }

  const mergedPlugins: Map<string, PluginConfig> = new Map()

  for (const preset of presets) {
    for (const plugin of preset.plugins) {
      mergedPlugins.set(plugin.id, plugin)
    }
  }

  return {
    name: 'Merged',
    description: 'Merged plugin preset',
    allowExtensions: presets[presets.length - 1]?.allowExtensions ?? true,
    plugins: Array.from(mergedPlugins.values()).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)),
  }
}

/**
 * Clone a plugin preset with optional modifications
 */
export function clonePluginPreset(
  preset: PluginPreset,
  overrides: Partial<PluginPreset> = {}
): PluginPreset {
  return {
    name: overrides.name ?? preset.name,
    description: overrides.description ?? preset.description,
    allowExtensions: overrides.allowExtensions ?? preset.allowExtensions,
    plugins: overrides.plugins ? [...overrides.plugins] : [...preset.plugins],
  }
}

/**
 * Create a custom plugin preset
 */
export function createCustomPluginPreset(options: CreateCustomPluginPresetOptions): PluginPreset {
  return {
    name: options.name,
    description: options.description || 'Custom plugin preset',
    allowExtensions: options.allowExtensions ?? true,
    plugins: options.plugins,
  }
}

/**
 * Get all enabled plugins in a preset
 */
export function getEnabledPlugins(preset: PluginPreset): PluginConfig[] {
  return preset.plugins.filter((p) => p.enabled)
}

/**
 * Get all disabled plugins in a preset
 */
export function getDisabledPlugins(preset: PluginPreset): PluginConfig[] {
  return preset.plugins.filter((p) => !p.enabled)
}

/**
 * Check if a plugin preset has all dependencies satisfied
 */
export function validatePluginDependencies(preset: PluginPreset): boolean {
  const enabledIds = new Set(getEnabledPlugins(preset).map((p) => p.id))

  for (const plugin of preset.plugins) {
    if (plugin.enabled && plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!enabledIds.has(dep)) {
          return false
        }
      }
    }
  }

  return true
}

/**
 * Get a summary of a plugin preset
 */
export function getPluginPresetSummary(preset: PluginPreset): string {
  const enabledCount = getEnabledPlugins(preset).length
  const totalCount = preset.plugins.length
  return `${preset.name}: ${enabledCount}/${totalCount} plugins enabled`
}
