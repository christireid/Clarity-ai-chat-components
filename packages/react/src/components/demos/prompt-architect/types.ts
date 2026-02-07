/**
 * Prompt Architect Studio - Type Definitions
 *
 * Core types for the prompt engineering IDE demo.
 *
 * @packageDocumentation
 */

import type { CoreMessage } from '../../../internal/hooks/use-chat-enhanced'

// =============================================================================
// VARIABLE TYPES
// =============================================================================

/**
 * Inferred field type based on variable name patterns
 */
export type InferredFieldType = 'text' | 'textarea' | 'number' | 'toggle'

/**
 * A variable extracted from a prompt template
 */
export interface ExtractedVariable {
  /** Variable name as it appears in template (e.g., "user_name") */
  name: string
  /** Human-readable display name (e.g., "User Name") */
  displayName: string
  /** Inferred input type based on name patterns */
  inferredType: InferredFieldType
  /** Position of first occurrence in template */
  firstOccurrence: number
  /** Number of times this variable appears */
  occurrenceCount: number
}

/**
 * Result of variable extraction from a template
 */
export interface VariableExtractionResult {
  /** Extracted variables in order of first occurrence */
  variables: ExtractedVariable[]
  /** Total number of variable placeholders found */
  totalPlaceholders: number
  /** Whether the template has any unmatched braces */
  hasUnmatchedBraces: boolean
  /** Warning messages for potential issues */
  warnings: string[]
}

// =============================================================================
// VERSION TYPES
// =============================================================================

/**
 * A saved version of prompts for history/versioning
 */
export interface PromptVersion {
  /** Unique version identifier */
  id: string
  /** Display name (e.g., "V1 (Grumpy)", "V2 (Helpful)") */
  name: string
  /** System prompt content */
  systemPrompt: string
  /** User prompt template */
  userPromptTemplate: string
  /** Variable values at time of save */
  variableValues: Record<string, string>
  /** When this version was created */
  createdAt: Date
  /** Optional description */
  description?: string
}

// =============================================================================
// PREVIEW TYPES
// =============================================================================

/**
 * Message in the preview chat pane
 */
export interface PreviewMessage {
  /** Unique message identifier */
  id: string
  /** Message role */
  role: 'system' | 'user' | 'assistant'
  /** Message content */
  content: string
  /** Whether this shows compiled (true) or template (false) version */
  isCompiled: boolean
  /** Timestamp */
  timestamp: Date
}

/**
 * Debug view display mode
 */
export type DebugViewMode = 'template' | 'compiled' | 'raw'

// =============================================================================
// STRUCTURED OUTPUT TYPES
// =============================================================================

/**
 * Schema for structured LLM responses when JSON mode is enabled
 */
export interface StructuredLLMResponse {
  /** Reasoning process or chain-of-thought */
  thinking?: string
  /** Primary result or answer */
  result: string | Record<string, unknown> | unknown[]
  /** Confidence score from 0 to 1 */
  confidence?: number
  /** Optional metadata about the response */
  metadata?: {
    model?: string
    tokensUsed?: number
    processingTimeMs?: number
    /** Allow additional properties for extensibility */
    [key: string]: unknown
  }
}

/**
 * Result of parsing structured output
 */
export interface StructuredOutputParseResult {
  /** Whether parsing succeeded */
  success: boolean
  /** Parsed data if successful */
  data?: StructuredLLMResponse
  /** Error message if failed */
  error?: string
  /** Raw JSON string that was parsed */
  rawJson?: string
}

// =============================================================================
// TOKEN STATS TYPES
// =============================================================================

/**
 * Token statistics for the current prompt configuration
 */
export interface TokenStats {
  /** Tokens in the system prompt */
  systemPromptTokens: number
  /** Tokens in the compiled user prompt */
  userPromptTokens: number
  /** Tokens in variable values */
  variableTokens: number
  /** Total token count */
  totalTokens: number
  /** Maximum tokens for selected model */
  maxTokens: number
  /** Utilization percentage (0-100) */
  utilizationPercent: number
  /** Estimated cost in USD for input tokens */
  estimatedInputCost: number
  /** Estimated cost in USD for output tokens (assumes max output) */
  estimatedOutputCost: number
  /** Total estimated cost */
  estimatedTotalCost: number
}

// =============================================================================
// PRESET TYPES
// =============================================================================

/**
 * A pre-configured prompt template
 */
export interface PromptPreset {
  /** Unique preset identifier */
  id: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** Icon (emoji or icon name) */
  icon: string
  /** Category for grouping */
  category: 'development' | 'writing' | 'data' | 'analysis' | 'custom'
  /** System prompt template */
  systemPrompt: string
  /** User prompt template */
  userPromptTemplate: string
  /** Default variable values */
  defaultVariables: Record<string, string>
  /** Tags for searching */
  tags: string[]
}

// =============================================================================
// MAIN STATE TYPES
// =============================================================================

/**
 * Main state for Prompt Architect Studio
 */
export interface PromptArchitectState {
  // Editor state
  /** Current system prompt template */
  systemPrompt: string
  /** Current user prompt template */
  userPromptTemplate: string

  // Variables
  /** Variables extracted from both templates */
  extractedVariables: ExtractedVariable[]
  /** Current variable values (user inputs) */
  variableValues: Record<string, string>

  // Versioning
  /** Saved prompt versions */
  versions: PromptVersion[]
  /** Currently active version ID (null if unsaved) */
  activeVersionId: string | null

  // Preview state
  /** Messages in the preview pane */
  previewMessages: PreviewMessage[]
  /** Whether currently streaming a response */
  isStreaming: boolean
  /** Content being streamed */
  streamingContent: string
  /** Error from last run */
  lastError: string | null

  // UI state
  /** Debug view mode */
  debugViewMode: DebugViewMode
  /** Whether debug view is visible */
  showDebugView: boolean
  /** Whether structured JSON output mode is enabled */
  structuredOutputMode: boolean
  /** Selected model identifier */
  selectedModel: string

  // Token stats
  /** Current token statistics */
  tokenStats: TokenStats

  // Persistence
  /** When state was last saved to storage */
  lastSavedAt: Date | null
  /** Whether there are unsaved changes */
  isDirty: boolean
}

// =============================================================================
// ACTION TYPES
// =============================================================================

/**
 * Actions for the prompt architect reducer
 */
export type PromptArchitectAction =
  | { type: 'SET_SYSTEM_PROMPT'; payload: string }
  | { type: 'SET_USER_PROMPT_TEMPLATE'; payload: string }
  | { type: 'SET_VARIABLE_VALUE'; payload: { name: string; value: string } }
  | { type: 'SET_ALL_VARIABLES'; payload: Record<string, string> }
  | { type: 'UPDATE_EXTRACTED_VARIABLES'; payload: ExtractedVariable[] }
  | { type: 'LOAD_VERSION'; payload: string }
  | { type: 'SAVE_VERSION'; payload: { name: string; description?: string } }
  | { type: 'DELETE_VERSION'; payload: string }
  | { type: 'LOAD_PRESET'; payload: PromptPreset }
  | { type: 'ADD_PREVIEW_MESSAGE'; payload: PreviewMessage }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'UPDATE_STREAMING_CONTENT'; payload: string }
  | { type: 'APPEND_STREAMING_CONTENT'; payload: string }
  | { type: 'FINISH_STREAMING'; payload?: { error?: string } }
  | { type: 'CLEAR_PREVIEW' }
  | { type: 'SET_DEBUG_VIEW_MODE'; payload: DebugViewMode }
  | { type: 'TOGGLE_DEBUG_VIEW' }
  | { type: 'TOGGLE_STRUCTURED_OUTPUT' }
  | { type: 'SET_MODEL'; payload: string }
  | { type: 'UPDATE_TOKEN_STATS'; payload: TokenStats }
  | { type: 'MARK_SAVED' }
  | { type: 'MARK_DIRTY' }
  | { type: 'HYDRATE_FROM_STORAGE'; payload: Partial<PromptArchitectState> }
  | { type: 'RESET' }

// =============================================================================
// HOOK OPTIONS & RETURN TYPES
// =============================================================================

/**
 * Options for usePromptArchitect hook
 */
export interface UsePromptArchitectOptions {
  /** Initial system prompt */
  initialSystemPrompt?: string
  /** Initial user prompt template */
  initialUserPrompt?: string
  /** Enable auto-save to localStorage */
  autoSave?: boolean
  /** localStorage key for persistence */
  storageKey?: string
  /** Auto-save debounce delay in ms */
  autoSaveDelay?: number
  /** Selected model for token estimation */
  defaultModel?: string
  /** Maximum tokens for the model */
  maxTokens?: number
  /** API endpoint for running prompts */
  apiEndpoint?: string
  /** Callback when prompt is run */
  onRun?: (messages: CoreMessage[]) => Promise<void>
}

/**
 * Return type for usePromptArchitect hook
 */
export interface UsePromptArchitectReturn {
  // State
  state: PromptArchitectState

  // Computed values
  /** System prompt with variables compiled */
  compiledSystemPrompt: string
  /** User prompt with variables compiled */
  compiledUserPrompt: string
  /** Messages array ready for API */
  messagesArray: CoreMessage[]
  /** Whether all required variables have values */
  hasAllRequiredVariables: boolean
  /** Variables that are missing values */
  missingVariables: string[]

  // Editor actions
  setSystemPrompt: (value: string) => void
  setUserPromptTemplate: (value: string) => void

  // Variable actions
  setVariableValue: (name: string, value: string) => void
  setAllVariables: (values: Record<string, string>) => void
  clearVariables: () => void

  // Version actions
  saveVersion: (name: string, description?: string) => void
  loadVersion: (id: string) => void
  deleteVersion: (id: string) => void

  // Preset actions
  loadPreset: (preset: PromptPreset) => void

  // UI actions
  toggleDebugView: () => void
  setDebugViewMode: (mode: DebugViewMode) => void
  toggleStructuredOutput: () => void
  setModel: (model: string) => void

  // Preview actions
  runPrompt: () => Promise<void>
  clearPreview: () => void

  // Persistence
  saveToStorage: () => void
  loadFromStorage: () => boolean
  reset: () => void
}

// =============================================================================
// MODEL CONFIGURATION
// =============================================================================

/**
 * Configuration for a supported model
 */
export interface ModelConfig {
  /** Model identifier */
  id: string
  /** Display name */
  name: string
  /** Provider (openai, anthropic, etc.) */
  provider: 'openai' | 'anthropic' | 'google' | 'other'
  /** Maximum context tokens */
  maxTokens: number
  /** Maximum output tokens */
  maxOutputTokens: number
  /** Whether model supports structured output natively */
  supportsStructuredOutput: boolean
  /** Cost per 1M input tokens in USD */
  inputCostPer1M: number
  /** Cost per 1M output tokens in USD */
  outputCostPer1M: number
}

/**
 * Available model configurations with pricing (as of Dec 2024)
 * Prices are per 1M tokens in USD
 */
export const MODEL_CONFIGS: ModelConfig[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    maxTokens: 128000,
    maxOutputTokens: 16384,
    supportsStructuredOutput: true,
    inputCostPer1M: 2.5,
    outputCostPer1M: 10,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    maxTokens: 128000,
    maxOutputTokens: 16384,
    supportsStructuredOutput: true,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    maxTokens: 128000,
    maxOutputTokens: 4096,
    supportsStructuredOutput: true,
    inputCostPer1M: 10,
    outputCostPer1M: 30,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    maxTokens: 200000,
    maxOutputTokens: 8192,
    supportsStructuredOutput: false,
    inputCostPer1M: 3,
    outputCostPer1M: 15,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    maxTokens: 200000,
    maxOutputTokens: 4096,
    supportsStructuredOutput: false,
    inputCostPer1M: 15,
    outputCostPer1M: 75,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    maxTokens: 1000000,
    maxOutputTokens: 8192,
    supportsStructuredOutput: true,
    inputCostPer1M: 1.25,
    outputCostPer1M: 5,
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    maxTokens: 1000000,
    maxOutputTokens: 8192,
    supportsStructuredOutput: true,
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.3,
  },
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    maxTokens: 1000000,
    maxOutputTokens: 8192,
    supportsStructuredOutput: true,
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.3,
  },
]

/**
 * Get model config by ID
 */
export function getModelConfig(modelId: string): ModelConfig | undefined {
  return MODEL_CONFIGS.find((m) => m.id === modelId)
}

/**
 * Get default model config
 */
export function getDefaultModelConfig(): ModelConfig {
  return MODEL_CONFIGS[0]
}

/**
 * Calculate estimated cost for a given number of tokens
 *
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Estimated number of output tokens (default: model max / 4)
 * @param modelId - Model identifier
 * @returns Object with input, output, and total costs in USD
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  modelId: string
): { inputCost: number; outputCost: number; totalCost: number } {
  const model = getModelConfig(modelId)
  if (!model) {
    return { inputCost: 0, outputCost: 0, totalCost: 0 }
  }

  // Cost per token = cost per 1M / 1,000,000
  const inputCost = (inputTokens * model.inputCostPer1M) / 1_000_000
  const outputCost = (outputTokens * model.outputCostPer1M) / 1_000_000
  const totalCost = inputCost + outputCost

  return { inputCost, outputCost, totalCost }
}

/**
 * Format cost as a display string
 *
 * @param cost - Cost in USD
 * @returns Formatted string like "$0.0012" or "<$0.0001"
 */
export function formatCost(cost: number): string {
  if (cost === 0) return '$0.00'
  if (cost < 0.0001) return '<$0.0001'
  if (cost < 0.01) return `$${cost.toFixed(4)}`
  if (cost < 1) return `$${cost.toFixed(3)}`
  return `$${cost.toFixed(2)}`
}
