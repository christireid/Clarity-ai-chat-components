'use client'

/**
 * useAgentConfig Hook
 *
 * Manages AI agent configuration including model settings, behavior,
 * capabilities, and persona customization.
 * Inspired by Tambo's agent-configuration pattern for generative UI.
 *
 * Features:
 * - Model configuration (provider, model, parameters)
 * - Behavior settings (tone, verbosity, response style)
 * - Capability toggles (tools, streaming, memory)
 * - Persona/system prompt management
 * - Configuration presets
 * - Runtime configuration updates
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { config, updateConfig, setModel } = useAgentConfig({
 *   model: 'claude-3-opus',
 *   temperature: 0.7,
 * })
 *
 * // Update model parameters
 * updateConfig({ temperature: 0.5, maxTokens: 2000 })
 *
 * // Switch models
 * setModel('gpt-4-turbo')
 * ```
 *
 * @example
 * ```tsx
 * // With provider for app-wide configuration
 * function App() {
 *   return (
 *     <AgentConfigProvider
 *       defaultConfig={{
 *         model: 'claude-3-sonnet',
 *         persona: 'helpful-assistant',
 *       }}
 *     >
 *       <ChatInterface />
 *     </AgentConfigProvider>
 *   )
 * }
 * ```
 */

import * as React from 'react'

// ============================================================================
// Types
// ============================================================================

/** Supported AI providers */
export type AIProvider =
  | 'anthropic'
  | 'openai'
  | 'google'
  | 'cohere'
  | 'mistral'
  | 'custom'

/** Response style options */
export type ResponseStyle =
  | 'concise'
  | 'detailed'
  | 'conversational'
  | 'technical'
  | 'creative'

/** Tone options */
export type AgentTone =
  | 'professional'
  | 'friendly'
  | 'formal'
  | 'casual'
  | 'empathetic'
  | 'neutral'

/** Model parameters */
export interface ModelParameters {
  /** Temperature (0-2, lower = more deterministic) */
  temperature?: number
  /** Top P / nucleus sampling */
  topP?: number
  /** Top K sampling */
  topK?: number
  /** Maximum tokens in response */
  maxTokens?: number
  /** Stop sequences */
  stopSequences?: string[]
  /** Frequency penalty */
  frequencyPenalty?: number
  /** Presence penalty */
  presencePenalty?: number
}

/** Tool/capability configuration */
export interface ToolConfig {
  /** Tool identifier */
  id: string
  /** Whether enabled */
  enabled: boolean
  /** Tool-specific configuration */
  config?: Record<string, unknown>
}

/** Persona/system prompt configuration */
export interface PersonaConfig {
  /** Persona identifier */
  id: string
  /** Display name */
  name: string
  /** System prompt/instructions */
  systemPrompt: string
  /** Persona description */
  description?: string
  /** Avatar/icon URL */
  avatar?: string
  /** Default tone for this persona */
  defaultTone?: AgentTone
  /** Default response style */
  defaultStyle?: ResponseStyle
}

/** Memory/context configuration */
export interface MemoryConfig {
  /** Enable conversation memory */
  enabled: boolean
  /** Maximum messages to remember */
  maxMessages?: number
  /** Maximum tokens in memory */
  maxTokens?: number
  /** Enable long-term memory */
  longTermMemory?: boolean
  /** Memory summarization threshold */
  summarizeAfter?: number
}

/** Safety/guardrail configuration */
export interface SafetyConfig {
  /** Content filtering level */
  contentFilter?: 'strict' | 'moderate' | 'minimal' | 'none'
  /** Block specific topics */
  blockedTopics?: string[]
  /** Required disclaimers */
  disclaimers?: string[]
  /** Enable PII detection */
  piiDetection?: boolean
  /** Maximum response length */
  maxResponseLength?: number
}

/** Full agent configuration */
export interface AgentConfig {
  /** AI provider */
  provider?: AIProvider
  /** Model identifier */
  model?: string
  /** Model parameters */
  parameters?: ModelParameters
  /** Response style */
  responseStyle?: ResponseStyle
  /** Agent tone */
  tone?: AgentTone
  /** Active persona */
  persona?: PersonaConfig | string
  /** Available personas */
  personas?: PersonaConfig[]
  /** Tool configurations */
  tools?: ToolConfig[]
  /** Memory configuration */
  memory?: MemoryConfig
  /** Safety configuration */
  safety?: SafetyConfig
  /** Enable streaming responses */
  streaming?: boolean
  /** Custom system prompt (overrides persona) */
  systemPrompt?: string
  /** Additional custom configuration */
  custom?: Record<string, unknown>
}

/** Configuration preset */
export interface ConfigPreset {
  /** Preset identifier */
  id: string
  /** Display name */
  name: string
  /** Description */
  description?: string
  /** Preset configuration */
  config: Partial<AgentConfig>
}

/** Hook options */
export interface UseAgentConfigOptions {
  /** Initial configuration */
  initialConfig?: Partial<AgentConfig>
  /** Available presets */
  presets?: ConfigPreset[]
  /** Storage key for persistence */
  storageKey?: string
  /** Enable persistence */
  persist?: boolean
  /** Callback when config changes */
  onChange?: (config: AgentConfig, changes: Partial<AgentConfig>) => void
  /** Validate configuration changes */
  validate?: (config: AgentConfig) => boolean | string
}

/** Hook return type */
export interface UseAgentConfigReturn {
  /** Current configuration */
  config: AgentConfig
  /** Update configuration (partial) */
  updateConfig: (updates: Partial<AgentConfig>) => void
  /** Reset to initial/default configuration */
  resetConfig: () => void
  /** Set model */
  setModel: (model: string, provider?: AIProvider) => void
  /** Set model parameters */
  setParameters: (params: Partial<ModelParameters>) => void
  /** Set persona by ID or config */
  setPersona: (persona: string | PersonaConfig) => void
  /** Set tone */
  setTone: (tone: AgentTone) => void
  /** Set response style */
  setResponseStyle: (style: ResponseStyle) => void
  /** Enable/disable tool */
  setToolEnabled: (toolId: string, enabled: boolean) => void
  /** Configure tool */
  configureTools: (tools: ToolConfig[]) => void
  /** Set system prompt */
  setSystemPrompt: (prompt: string) => void
  /** Apply preset */
  applyPreset: (presetId: string) => void
  /** Available presets */
  presets: ConfigPreset[]
  /** Get effective system prompt (from persona or custom) */
  getEffectiveSystemPrompt: () => string
  /** Export configuration as JSON */
  exportConfig: () => string
  /** Import configuration from JSON */
  importConfig: (json: string) => boolean
  /** Validation errors (if any) */
  validationError: string | null
}

/** Provider props */
export interface AgentConfigProviderProps {
  children: React.ReactNode
  /** Default configuration */
  defaultConfig?: Partial<AgentConfig>
  /** Available presets */
  presets?: ConfigPreset[]
  /** Storage key for persistence */
  storageKey?: string
  /** Enable persistence */
  persist?: boolean
  /** Callback when config changes */
  onConfigChange?: (config: AgentConfig) => void
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_CONFIG: AgentConfig = {
  provider: 'anthropic',
  model: 'claude-3-sonnet',
  parameters: {
    temperature: 0.7,
    maxTokens: 4096,
  },
  responseStyle: 'conversational',
  tone: 'friendly',
  streaming: true,
  memory: {
    enabled: true,
    maxMessages: 50,
  },
  safety: {
    contentFilter: 'moderate',
  },
}

const DEFAULT_PRESETS: ConfigPreset[] = [
  {
    id: 'creative',
    name: 'Creative Writing',
    description: 'Optimized for creative and imaginative responses',
    config: {
      parameters: { temperature: 1.0, topP: 0.95 },
      responseStyle: 'creative',
      tone: 'friendly',
    },
  },
  {
    id: 'precise',
    name: 'Precise & Technical',
    description: 'Optimized for accurate, technical responses',
    config: {
      parameters: { temperature: 0.3, topP: 0.8 },
      responseStyle: 'technical',
      tone: 'professional',
    },
  },
  {
    id: 'concise',
    name: 'Concise Answers',
    description: 'Short, to-the-point responses',
    config: {
      parameters: { temperature: 0.5, maxTokens: 500 },
      responseStyle: 'concise',
      tone: 'neutral',
    },
  },
  {
    id: 'detailed',
    name: 'Detailed Explanations',
    description: 'Comprehensive, in-depth responses',
    config: {
      parameters: { temperature: 0.7, maxTokens: 8192 },
      responseStyle: 'detailed',
      tone: 'professional',
    },
  },
]

// ============================================================================
// Context
// ============================================================================

const AgentConfigContext = React.createContext<UseAgentConfigReturn | null>(null)

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for managing agent configuration
 */
export function useAgentConfig(
  options: UseAgentConfigOptions = {}
): UseAgentConfigReturn {
  const {
    initialConfig = {},
    presets = DEFAULT_PRESETS,
    storageKey = 'agent-config',
    persist = true,
    onChange,
    validate,
  } = options

  const [config, setConfig] = React.useState<AgentConfig>(() => ({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  }))
  const [validationError, setValidationError] = React.useState<string | null>(null)

  // Load from storage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && persist && storageKey) {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          setConfig((prev) => ({ ...prev, ...parsed }))
        }
      } catch (e) {
        console.warn('Failed to load agent config:', e)
      }
    }
  }, [persist, storageKey])

  // Save to storage
  const saveToStorage = React.useCallback(
    (newConfig: AgentConfig) => {
      if (typeof window !== 'undefined' && persist && storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(newConfig))
        } catch (e) {
          console.warn('Failed to save agent config:', e)
        }
      }
    },
    [persist, storageKey]
  )

  const updateConfig = React.useCallback(
    (updates: Partial<AgentConfig>) => {
      setConfig((prev) => {
        const newConfig = { ...prev, ...updates }

        // Validate if validator provided
        if (validate) {
          const result = validate(newConfig)
          if (result !== true) {
            setValidationError(typeof result === 'string' ? result : 'Invalid configuration')
            return prev
          }
        }

        setValidationError(null)
        saveToStorage(newConfig)
        onChange?.(newConfig, updates)
        return newConfig
      })
    },
    [validate, saveToStorage, onChange]
  )

  const resetConfig = React.useCallback(() => {
    const newConfig = { ...DEFAULT_CONFIG, ...initialConfig }
    setConfig(newConfig)
    setValidationError(null)
    saveToStorage(newConfig)
    onChange?.(newConfig, newConfig)
  }, [initialConfig, saveToStorage, onChange])

  const setModel = React.useCallback(
    (model: string, provider?: AIProvider) => {
      updateConfig({ model, ...(provider && { provider }) })
    },
    [updateConfig]
  )

  const setParameters = React.useCallback(
    (params: Partial<ModelParameters>) => {
      updateConfig({
        parameters: { ...config.parameters, ...params },
      })
    },
    [config.parameters, updateConfig]
  )

  const setPersona = React.useCallback(
    (persona: string | PersonaConfig) => {
      if (typeof persona === 'string') {
        // Find persona by ID
        const found = config.personas?.find((p) => p.id === persona)
        if (found) {
          updateConfig({ persona: found })
        }
      } else {
        updateConfig({ persona })
      }
    },
    [config.personas, updateConfig]
  )

  const setTone = React.useCallback(
    (tone: AgentTone) => {
      updateConfig({ tone })
    },
    [updateConfig]
  )

  const setResponseStyle = React.useCallback(
    (responseStyle: ResponseStyle) => {
      updateConfig({ responseStyle })
    },
    [updateConfig]
  )

  const setToolEnabled = React.useCallback(
    (toolId: string, enabled: boolean) => {
      const tools = config.tools?.map((t) =>
        t.id === toolId ? { ...t, enabled } : t
      ) || []
      updateConfig({ tools })
    },
    [config.tools, updateConfig]
  )

  const configureTools = React.useCallback(
    (tools: ToolConfig[]) => {
      updateConfig({ tools })
    },
    [updateConfig]
  )

  const setSystemPrompt = React.useCallback(
    (systemPrompt: string) => {
      updateConfig({ systemPrompt })
    },
    [updateConfig]
  )

  const applyPreset = React.useCallback(
    (presetId: string) => {
      const preset = presets.find((p) => p.id === presetId)
      if (preset) {
        updateConfig(preset.config)
      }
    },
    [presets, updateConfig]
  )

  const getEffectiveSystemPrompt = React.useCallback((): string => {
    // Custom system prompt takes precedence
    if (config.systemPrompt) {
      return config.systemPrompt
    }

    // Then persona system prompt
    if (config.persona) {
      if (typeof config.persona === 'object' && config.persona.systemPrompt) {
        return config.persona.systemPrompt
      }
    }

    // Default empty
    return ''
  }, [config.systemPrompt, config.persona])

  const exportConfig = React.useCallback((): string => {
    return JSON.stringify(config, null, 2)
  }, [config])

  const importConfig = React.useCallback(
    (json: string): boolean => {
      try {
        const parsed = JSON.parse(json)

        // Validate if validator provided
        if (validate) {
          const merged = { ...config, ...parsed }
          const result = validate(merged)
          if (result !== true) {
            setValidationError(typeof result === 'string' ? result : 'Invalid configuration')
            return false
          }
        }

        updateConfig(parsed)
        return true
      } catch (e) {
        setValidationError('Invalid JSON')
        return false
      }
    },
    [config, validate, updateConfig]
  )

  return {
    config,
    updateConfig,
    resetConfig,
    setModel,
    setParameters,
    setPersona,
    setTone,
    setResponseStyle,
    setToolEnabled,
    configureTools,
    setSystemPrompt,
    applyPreset,
    presets,
    getEffectiveSystemPrompt,
    exportConfig,
    importConfig,
    validationError,
  }
}

// ============================================================================
// Provider Component
// ============================================================================

/**
 * Provider for app-wide agent configuration
 */
export function AgentConfigProvider({
  children,
  defaultConfig = {},
  presets = DEFAULT_PRESETS,
  storageKey = 'agent-config',
  persist = true,
  onConfigChange,
}: AgentConfigProviderProps) {
  const configValue = useAgentConfig({
    initialConfig: defaultConfig,
    presets,
    storageKey,
    persist,
    onChange: (config) => {
      onConfigChange?.(config)
    },
  })

  return (
    <AgentConfigContext.Provider value={configValue}>
      {children}
    </AgentConfigContext.Provider>
  )
}

/**
 * Hook to access the agent configuration from provider
 */
export function useAgentConfigProvider(): UseAgentConfigReturn {
  const context = React.useContext(AgentConfigContext)
  if (!context) {
    throw new Error('useAgentConfigProvider must be used within AgentConfigProvider')
  }
  return context
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a persona configuration
 */
export function createPersona(config: Omit<PersonaConfig, 'id'> & { id?: string }): PersonaConfig {
  return {
    id: config.id || `persona-${Date.now()}`,
    ...config,
  }
}

/**
 * Create a tool configuration
 */
export function createToolConfig(
  id: string,
  enabled = true,
  config?: Record<string, unknown>
): ToolConfig {
  return { id, enabled, config }
}

/**
 * Merge configurations with proper deep merge
 */
export function mergeConfigs(
  base: AgentConfig,
  ...overrides: Partial<AgentConfig>[]
): AgentConfig {
  let result = { ...base }

  for (const override of overrides) {
    result = {
      ...result,
      ...override,
      parameters: {
        ...result.parameters,
        ...override.parameters,
      },
      memory: {
        ...result.memory,
        ...override.memory,
      },
      safety: {
        ...result.safety,
        ...override.safety,
      },
    }
  }

  return result
}

export default useAgentConfig
