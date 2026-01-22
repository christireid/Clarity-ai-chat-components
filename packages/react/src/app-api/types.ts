'use client'

import type { ReactNode } from 'react'
import type { Message } from '@clarity-chat/types'

// =============================================================================
// Feature Flags
// =============================================================================

/**
 * Feature flags to enable/disable advanced capabilities
 * Each flag toggles a feature with sensible defaults
 */
export interface ClarityFeatureFlags {
  /** Enable memory system for conversation persistence and context injection */
  memory?: boolean
  /** Enable token optimization with automatic budget management */
  tokenOptimization?: boolean
  /** Enable tool calling with registry pattern */
  tools?: boolean
  /** Enable RAG (Retrieval Augmented Generation) for document-based responses */
  rag?: boolean
  /** Enable safety features including PII redaction and prompt injection detection */
  safety?: boolean
  /** Enable observability and analytics */
  observability?: boolean
  /** Enable streaming responses */
  streaming?: boolean
  /** Enable error recovery and retry logic */
  errorRecovery?: boolean
}

// =============================================================================
// Presets
// =============================================================================

/**
 * Predefined configuration presets for common use cases
 */
export type ClarityAppPreset =
  | 'simple' // Streaming + retries + accessible UI, minimal extras
  | 'pro' // Adds token stats, basic optimization, basic safety
  | 'memory' // Adds memory with sliding-window defaults
  | 'rag' // Adds sources + chunking + retrieval defaults
  | 'tools' // Tool calling with registry pattern
  | 'enterprise' // Full features: Memory + Token Optimization + Safety + Observability

// =============================================================================
// Configuration Blocks
// =============================================================================

/**
 * Memory configuration options
 */
export interface MemoryConfig {
  /** Memory strategy to use */
  strategy?: 'sliding-window' | 'vector-store' | 'hybrid'
  /** Maximum tokens to allocate for memory context */
  maxTokens?: number
  /** Maximum number of messages to retain */
  limit?: number
  /** Memory scopes for multi-tenant scenarios */
  scopes?: string[]
  /** Storage adapter type */
  storage?: 'indexeddb' | 'file' | 'memory' | 'custom'
  /** Custom storage adapter (when storage='custom') */
  customStorage?: unknown
  /** Auto-switch threshold: switch to vector store when message count exceeds this */
  vectorSwitchThreshold?: number
  /** Retry policies for storage operations */
  retryPolicy?: {
    maxRetries?: number
    backoffMs?: number
  }
}

/**
 * Token optimization configuration
 */
export interface TokenOptimizationConfig {
  /** Model identifier for token counting */
  model?: string
  /** Token budget for requests */
  budget?: number
  /** Quality threshold for optimization (0-1) */
  qualityThreshold?: number
  /** Enable response caching */
  caching?: boolean
  /** Cache TTL in milliseconds */
  cacheTtlMs?: number
  /** Compression strategy */
  compression?: 'none' | 'basic' | 'aggressive'
  /** Show token stats in UI */
  showStats?: boolean
}

/**
 * Tool calling configuration
 */
export interface ToolsConfig {
  /** Tool registry with definitions */
  registry?: ToolDefinition[]
  /** Default UI renderer for tool results */
  defaultRenderer?: 'json' | 'card' | 'custom'
  /** Custom tool result renderer */
  customRenderer?: React.ComponentType<{ result: unknown; toolName: string }>
  /** Auto-approve safe tool calls */
  autoApprove?: boolean
  /**
   * Approval mode for tool execution.
   * - auto: Automatically approve all tools (use with caution)
   * - manual: Require approval for tools marked requiresApproval
   * - allowlist: Only approve tools in allowedTools list
   * - blocklist: Approve all except tools in blockedTools list
   * @default 'manual' for risky tools
   */
  approvalMode?: 'auto' | 'manual' | 'allowlist' | 'blocklist'
  /** Tool names that are always approved (for allowlist mode) */
  allowedTools?: string[]
  /** Tool names that are always blocked (for blocklist mode) */
  blockedTools?: string[]
  /** Auto-approve tools with these risk levels */
  autoApproveRiskLevels?: Array<'safe' | 'low' | 'medium' | 'high'>
  /** Custom approval handler for interactive approval UI */
  approvalHandler?: (call: ToolCall) => Promise<boolean>
  /** Timeout for tool execution (ms) */
  timeoutMs?: number
}

/**
 * Tool definition for the registry
 */
export interface ToolDefinition {
  /** Unique tool name */
  name: string
  /** Human-readable description */
  description: string
  /** JSON Schema or Zod schema for parameters */
  parameters: Record<string, unknown>
  /** Execution handler */
  execute: (params: unknown) => Promise<unknown>
  /** Optional custom UI renderer */
  renderer?: React.ComponentType<{ result: unknown }>
  /**
   * Whether this tool is deterministic (same inputs always produce same outputs).
   * Non-deterministic tools (e.g., get_current_time, generate_uuid, random) will not be cached.
   * @default true
   */
  deterministic?: boolean
  /**
   * Risk level of this tool (affects approval requirements).
   * - safe: No side effects, read-only operations (e.g., get_current_time, calculate)
   * - low: Limited side effects, local operations (e.g., read file)
   * - medium: Network access, external APIs (e.g., fetch_url)
   * - high: Code execution, system commands (e.g., execute_code, system_command)
   * @default 'safe'
   */
  riskLevel?: 'safe' | 'low' | 'medium' | 'high'
  /**
   * Capabilities required by this tool.
   * Used for capability-based access control.
   * @default []
   */
  capabilities?: Array<
    | 'read:filesystem'
    | 'write:filesystem'
    | 'network:outbound'
    | 'network:inbound'
    | 'code:execute'
    | 'system:command'
    | 'data:sensitive'
    | 'user:impersonate'
  >
  /**
   * Whether this tool requires explicit user approval before execution.
   * If not specified, determined by riskLevel and approval configuration.
   */
  requiresApproval?: boolean
}

/**
 * Audit log entry for tool execution
 */
export interface ToolAuditLog {
  /** Timestamp of the tool call */
  timestamp: number
  /** Name of the tool that was called */
  toolName: string
  /** Unique identifier for this tool call */
  callId: string
  /** Risk level of the tool */
  riskLevel: 'safe' | 'low' | 'medium' | 'high'
  /** Capabilities required by the tool */
  capabilities: Array<
    | 'read:filesystem'
    | 'write:filesystem'
    | 'network:outbound'
    | 'network:inbound'
    | 'code:execute'
    | 'system:command'
    | 'data:sensitive'
    | 'user:impersonate'
  >
  /** Sanitized parameters (sensitive data removed) */
  parameters: Record<string, unknown>
  /** Whether the tool execution was approved */
  approved: boolean
  /** How the approval was granted */
  approvedBy?: 'user' | 'auto' | 'allowlist'
  /** Execution status */
  executionStatus: 'success' | 'failure' | 'timeout' | 'denied'
  /** Execution time in milliseconds */
  executionTimeMs?: number
  /** Error message if execution failed */
  error?: string
}

/**
 * RAG (Retrieval Augmented Generation) configuration
 */
export interface RAGConfig {
  /** Document sources */
  sources?: RAGSource[]
  /** Chunking configuration */
  chunking?: {
    strategy?: 'fixed' | 'sentence' | 'paragraph' | 'balanced'
    maxTokens?: number
    overlap?: number
  }
  /** Embedding model to use */
  embeddingModel?: string
  /** Number of chunks to retrieve */
  topK?: number
  /** Minimum similarity threshold */
  similarityThreshold?: number
  /** Enable source citations */
  showCitations?: boolean
}

/**
 * RAG source types
 */
export type RAGSource =
  | { type: 'text'; content: string; metadata?: Record<string, unknown> }
  | { type: 'url'; url: string; metadata?: Record<string, unknown> }
  | { type: 'file'; file: File; metadata?: Record<string, unknown> }
  | {
      type: 'chunks'
      chunks: Array<{ content: string; metadata?: Record<string, unknown> }>
    }

/**
 * Safety configuration
 */
export interface SafetyConfig {
  /** Safety level preset */
  level?: 'minimal' | 'standard' | 'strict'
  /** Enable PII detection and redaction */
  piiRedaction?: boolean
  /** Enable prompt injection detection */
  promptInjectionDetection?: boolean
  /** Enable content moderation */
  contentModeration?: boolean
  /** Custom safety policy */
  customPolicy?: (input: string) => { allowed: boolean; reason?: string }
  /** Enable audit logging */
  auditLog?: boolean
}

/**
 * Observability configuration
 */
export interface ObservabilityConfig {
  /** Enable metrics collection */
  metrics?: boolean
  /** Enable tracing */
  tracing?: boolean
  /** Enable logging */
  logging?: boolean
  /** Log level */
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
  /** Custom event handler */
  onEvent?: (event: ClarityEvent) => void
}

/**
 * UI configuration for customization
 */
export interface UIConfig {
  /** Theme preset */
  theme?: 'light' | 'dark' | 'system' | 'custom'
  /** Custom theme values */
  customTheme?: Record<string, string>
  /** Component overrides */
  components?: {
    MessageRenderer?: React.ComponentType<{ message: Message }>
    InputRenderer?: React.ComponentType<{ onSubmit: (text: string) => void }>
    Header?: React.ComponentType<{ title?: string }>
    EmptyState?: React.ComponentType
    LoadingIndicator?: React.ComponentType
    ErrorDisplay?: React.ComponentType<{ error: Error; retry?: () => void }>
  }
  /** Layout variant */
  layout?: 'default' | 'minimal' | 'sidebar' | 'fullscreen'
  /** Show typing indicator */
  showTypingIndicator?: boolean
  /** Enable message animations */
  animations?: boolean
}

// =============================================================================
// Main Configuration
// =============================================================================

/**
 * Complete configuration object for ClarityChatApp
 * All advanced configuration lives under this single object
 */
export interface ClarityAppConfig {
  /** Memory system configuration */
  memory?: MemoryConfig
  /** Token optimization configuration */
  tokenOptimization?: TokenOptimizationConfig
  /** Tool calling configuration */
  tools?: ToolsConfig
  /** RAG configuration */
  rag?: RAGConfig
  /** Safety configuration */
  safety?: SafetyConfig
  /** Observability configuration */
  observability?: ObservabilityConfig
  /** UI customization */
  ui?: UIConfig
  /** Error recovery configuration */
  errorRecovery?: {
    maxRetries?: number
    retryDelayMs?: number
    exponentialBackoff?: boolean
  }
  /** Streaming configuration */
  streaming?: {
    enabled?: boolean
    chunkDelayMs?: number
  }
}

/**
 * Fully resolved configuration with all defaults applied
 */
export interface ClarityResolvedConfig {
  features: Required<ClarityFeatureFlags>
  memory: Required<MemoryConfig>
  tokenOptimization: Required<TokenOptimizationConfig>
  tools: Required<Omit<ToolsConfig, 'registry' | 'customRenderer'>> & {
    registry: ToolDefinition[]
    customRenderer?: React.ComponentType<{ result: unknown; toolName: string }>
  }
  rag: Required<Omit<RAGConfig, 'sources'>> & { sources: RAGSource[] }
  safety: Required<Omit<SafetyConfig, 'customPolicy'>> & {
    customPolicy?: (input: string) => { allowed: boolean; reason?: string }
  }
  observability: Required<Omit<ObservabilityConfig, 'onEvent'>> & {
    onEvent?: (event: ClarityEvent) => void
  }
  ui: Required<Omit<UIConfig, 'components' | 'customTheme'>> & {
    components?: UIConfig['components']
    customTheme?: Record<string, string>
  }
  errorRecovery: Required<NonNullable<ClarityAppConfig['errorRecovery']>>
  streaming: Required<NonNullable<ClarityAppConfig['streaming']>>
}

// =============================================================================
// Events and Metadata
// =============================================================================

/**
 * Event types emitted by ClarityChatApp
 */
export interface ClarityEvent {
  type:
    | 'message:sent'
    | 'message:received'
    | 'message:error'
    | 'memory:injected'
    | 'memory:stored'
    | 'token:counted'
    | 'token:optimized'
    | 'tool:called'
    | 'tool:result'
    | 'rag:retrieved'
    | 'safety:checked'
    | 'safety:blocked'
  timestamp: number
  data: Record<string, unknown>
}

/**
 * Token statistics exposed by the unified hook
 */
export interface TokenStats {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  utilization: number
  budgetRemaining: number
  estimatedCost?: number
}

/**
 * Memory statistics exposed by the unified hook
 */
export interface MemoryStats {
  enabled: boolean
  hits: number
  itemsInjected: number
  totalItems: number
  lastQueryLatencyMs?: number
  storeLatencyMs?: number
}

/**
 * RAG statistics exposed by the unified hook
 */
export interface RAGStats {
  enabled: boolean
  sources: number
  chunksRetrieved: number
  queryLatencyMs?: number
}

/**
 * Safety statistics exposed by the unified hook
 */
export interface SafetyStats {
  enabled: boolean
  riskLevel: 'none' | 'low' | 'medium' | 'high'
  redactions: number
  blockedRequests: number
}

/**
 * Tool statistics exposed by the unified hook
 */
export interface ToolStats {
  enabled: boolean
  callsTotal: number
  callsPending: number
  lastResult?: unknown
}

/**
 * Combined metadata exposed by useClarityChatApp
 */
export interface ClarityMeta {
  token: TokenStats
  memory: MemoryStats
  rag: RAGStats
  safety: SafetyStats
  tools: ToolStats
}

// =============================================================================
// Component Props
// =============================================================================

/**
 * Props for the ClarityChatApp component
 */
export interface ClarityChatAppProps {
  /** API endpoint for chat requests */
  api: string
  /** Configuration preset */
  preset?: ClarityAppPreset
  /** Feature flags to enable/disable */
  features?: ClarityFeatureFlags
  /** Detailed configuration overrides */
  config?: ClarityAppConfig
  /** Initial messages */
  initialMessages?: Message[]
  /** System prompt */
  systemPrompt?: string
  /** Model to use */
  model?: string
  /** RAG sources (shorthand for config.rag.sources) */
  sources?: RAGSource[]
  /** Event handler for instrumentation */
  onEvent?: (event: ClarityEvent) => void
  /** Error handler */
  onError?: (error: Error) => void
  /** Message sent handler */
  onMessageSent?: (message: Message) => void
  /** Message received handler */
  onMessageReceived?: (message: Message) => void
  /** Custom header content */
  header?: ReactNode
  /** Custom footer content */
  footer?: ReactNode
  /** Additional CSS class */
  className?: string
  /** Children for composition */
  children?: ReactNode
}

/**
 * Props for the useClarityChatApp hook
 */
export interface UseClarityChatAppOptions {
  /** API endpoint for chat requests */
  api: string
  /** Configuration preset */
  preset?: ClarityAppPreset
  /** Feature flags to enable/disable */
  features?: ClarityFeatureFlags
  /** Detailed configuration overrides */
  config?: ClarityAppConfig
  /** Initial messages */
  initialMessages?: Message[]
  /** System prompt */
  systemPrompt?: string
  /** Model to use */
  model?: string
  /** RAG sources */
  sources?: RAGSource[]
  /** Event handler for instrumentation */
  onEvent?: (event: ClarityEvent) => void
}

/**
 * Return type for useClarityChatApp hook
 */
export interface UseClarityChatAppReturn {
  /** Current messages */
  messages: Message[]
  /** Append a new message */
  append: (
    message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'> & {
      chatId?: string
      status?: Message['status']
    }
  ) => Promise<void>
  /** Send a user message */
  send: (content: string) => Promise<void>
  /** Whether a request is in progress */
  isLoading: boolean
  /** Current error if any */
  error: Error | null
  /** Stop the current streaming response */
  stop: () => void
  /** Retry the last failed request */
  retry: () => Promise<void>
  /** Clear all messages */
  clear: () => void
  /** Set messages directly */
  setMessages: (messages: Message[]) => void
  /** Enriched metadata from all systems */
  meta: ClarityMeta
  /** Resolved configuration */
  config: ClarityResolvedConfig
  /** Input value for controlled input */
  input: string
  /** Set input value */
  setInput: (value: string) => void
  /** Handle input change */
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  /** Handle form submit */
  handleSubmit: (e?: React.FormEvent) => void
}
