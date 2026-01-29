/**
 * Model Adapter Types
 *
 * Unified interface for AI model providers (OpenAI, Anthropic, Google, etc.)
 * Enables model-agnostic configuration and easy provider switching.
 */

import type { RateLimitInfo } from '../utils/api/rate-limit-headers'
import type { RetryConfig } from './retry'
import type { CircuitBreakerConfig } from './circuit-breaker'

/**
 * Why generation stopped
 */
export type FinishReason =
  | 'stop' // Natural end of response
  | 'length' // Hit max tokens
  | 'tool-calls' // Model wants to call a tool
  | 'content-filter' // Content was filtered
  | 'error' // An error occurred
  | 'unknown' // Unknown reason

export interface ModelConfig {
  /** Provider name */
  provider: 'openai' | 'anthropic' | 'google' | 'custom'
  /** Model identifier (e.g., 'gpt-4-turbo', 'claude-3-opus') */
  model: string
  /** API key for authentication */
  apiKey?: string
  /** Custom API base URL */
  baseURL?: string
  /** Temperature for randomness (0-2) */
  temperature?: number
  /** Maximum tokens to generate */
  maxTokens?: number
  /** Top-p sampling */
  topP?: number
  /** Frequency penalty */
  frequencyPenalty?: number
  /** Presence penalty */
  presencePenalty?: number
  /** Stop sequences */
  stop?: string[]
  /** Tool definitions for function calling */
  tools?: ToolDefinition[]
  /** Request timeout in milliseconds (default: 30000 for chat, 60000 for stream) */
  timeout?: number
  /** AbortSignal for request cancellation */
  signal?: AbortSignal
  /** Streaming options */
  streamOptions?: {
    /** Callback for each token */
    onToken?: (token: string) => void
    /** Callback for tool calls */
    onToolCall?: (tool: ToolCall) => void
    /** Callback for thinking steps */
    onThinking?: (step: string) => void
    /** Callback for citations */
    onCitation?: (citation: Citation) => void
  }
  /** Retry configuration for automatic retry on failures */
  retry?: RetryConfig | false
  /** Enable circuit breaker protection (default: true) */
  circuitBreaker?: boolean | CircuitBreakerConfig
}

export interface ChatMessage {
  /** Message role */
  role: 'system' | 'user' | 'assistant'
  /** Message content (string or structured parts) */
  content: string | ContentPart[]
  /** Tool calls made by assistant */
  toolCalls?: ToolCall[]
  /** Citations/sources */
  citations?: Citation[]
  /** Message name (for function results) */
  name?: string
  /** Why generation stopped (for assistant messages) */
  finishReason?: FinishReason
}

export interface ContentPart {
  /** Content part type */
  type: 'text' | 'image' | 'tool_result'
  /** Text content */
  text?: string
  /** Image URL */
  imageUrl?: string
  /** Tool call ID this result belongs to */
  toolCallId?: string
  /** Tool execution result */
  toolResult?: unknown
}

export interface ToolCall {
  /** Unique tool call ID */
  id: string
  /** Tool call type */
  type: 'function'
  /** Function details */
  function: {
    /** Function name */
    name: string
    /** Function arguments (JSON string) */
    arguments: string
  }
}

/**
 * JSON Schema for function parameters
 */
export interface FunctionParameters {
  /** Parameter type (usually "object") */
  type: 'object' | 'string' | 'number' | 'boolean' | 'array'
  /** Parameter properties */
  properties?: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object'
    description?: string
    enum?: unknown[]
    items?: unknown
    [key: string]: unknown
  }>
  /** Required parameter names */
  required?: string[]
  /** Additional properties allowed */
  additionalProperties?: boolean
  /** Description */
  description?: string
  [key: string]: unknown
}

/**
 * Function tool definition
 */
export interface FunctionDefinition {
  /** Function name */
  name: string
  /** Function description */
  description?: string
  /** Function parameters (JSON Schema) */
  parameters?: FunctionParameters
}

/**
 * Tool definition for function calling
 */
export interface ToolDefinition {
  /** Tool type */
  type: 'function'
  /** Function definition */
  function: FunctionDefinition
}

export interface Citation {
  /** Unique citation ID */
  id: string
  /** Source name/title */
  source: string
  /** Chunk of text cited */
  chunkText: string
  /** Confidence score (0-1) */
  confidence?: number
  /** Additional metadata */
  metadata?: Record<string, unknown>
  /** URL to source */
  url?: string
}

export interface StreamChunk {
  /** Chunk type */
  type: 'token' | 'tool_call' | 'thinking' | 'citation' | 'done' | 'error'
  /** Text content */
  content?: string
  /** Tool call data */
  toolCall?: ToolCall
  /** Thinking step description */
  thinkingStep?: string
  /** Citation data */
  citation?: Citation
  /** Token usage stats */
  usage?: TokenUsage
  /** Why generation stopped (on done) */
  finishReason?: FinishReason
  /** Error message */
  error?: string
  /** Rate limit info (on error) */
  rateLimitInfo?: RateLimitInfo
}

// Re-export RateLimitInfo for consumers
export type { RateLimitInfo }

export interface TokenUsage {
  /** Tokens in prompt */
  promptTokens: number
  /** Tokens in completion */
  completionTokens: number
  /** Total tokens used */
  totalTokens: number
  /** Estimated cost in USD */
  estimatedCost?: number
}

export interface ModelAdapter {
  /** Adapter name */
  name: string

  /**
   * Send a chat completion request (non-streaming)
   */
  chat(messages: ChatMessage[], config: ModelConfig): Promise<ChatMessage>

  /**
   * Stream a chat completion response
   */
  stream(
    messages: ChatMessage[],
    config: ModelConfig
  ): AsyncGenerator<StreamChunk, void, unknown>

  /**
   * Estimate cost for token usage
   */
  estimateCost(usage: TokenUsage, model: string): number
}

export interface ModelInfo {
  /** Model ID */
  id: string
  /** Display name */
  name: string
  /** Provider */
  provider: 'openai' | 'anthropic' | 'google'
  /** Speed rating */
  speed: 'fast' | 'medium' | 'slow'
  /** Cost rating */
  cost: 'low' | 'medium' | 'high'
  /** Quality rating */
  quality: 'good' | 'excellent' | 'best'
  /** Context window size */
  contextWindow: number
  /** Description */
  description?: string
  /** Supports streaming */
  streaming?: boolean
  /** Supports tool/function calling */
  toolCalling?: boolean
  /** Supports vision/images */
  vision?: boolean
}

// =============================================================================
// Formalized Adapter Interface (assistant-ui pattern)
// =============================================================================

/**
 * Adapter capabilities for runtime feature detection.
 * Use this to check what features are available before using them.
 *
 * @example
 * ```tsx
 * // Check before using a feature
 * if (adapter.capabilities.supportsStreaming) {
 *   for await (const chunk of adapter.stream(request)) {
 *     // Handle streaming
 *   }
 * }
 * ```
 */
export interface AdapterCapabilities {
  /** Whether streaming is supported */
  supportsStreaming: boolean
  /** Whether tool/function calling is supported */
  supportsTools: boolean
  /** Whether image inputs are supported */
  supportsImages: boolean
  /** Whether file inputs are supported */
  supportsFiles: boolean
  /** Whether system messages are supported */
  supportsSystemMessage: boolean
  /** Whether multiple system messages are supported */
  supportsMultipleSystemMessages: boolean
  /** Maximum context window in tokens */
  maxContextTokens?: number
  /** Maximum output tokens */
  maxOutputTokens?: number
  /** List of supported model IDs */
  supportedModels?: string[]
}

/**
 * Typed streaming chunk events
 */
export type TypedStreamChunk =
  | { type: 'text-delta'; text: string }
  | {
      type: 'tool-call-delta'
      toolCallId: string
      toolName: string
      argsText: string
    }
  | {
      type: 'tool-call-complete'
      toolCallId: string
      toolName: string
      args: Record<string, unknown>
    }
  | {
      type: 'metadata'
      usage?: TokenUsage
      model?: string
      finishReason?: FinishReason
    }
  | { type: 'finish'; finishReason: FinishReason }
  | { type: 'error'; error: Error }

/**
 * Streaming callbacks for real-time updates
 */
export interface StreamingCallbacks {
  /** Called on each stream chunk */
  onChunk?: (chunk: TypedStreamChunk) => void
  /** Convenience callback for text only */
  onText?: (text: string) => void
  /** Called when a tool call starts */
  onToolCallStart?: (info: { id: string; name: string }) => void
  /** Called when a tool call completes */
  onToolCallComplete?: (call: ToolCall) => void
  /** Called when streaming finishes */
  onFinish?: (response: AdapterResponse) => void
  /** Called on error */
  onError?: (error: Error) => void
}

/**
 * Complete response from adapter
 */
export interface AdapterResponse {
  /** Generated text */
  text: string
  /** Tool calls made */
  toolCalls: ToolCall[]
  /** Token usage */
  usage?: TokenUsage
  /** Why generation stopped */
  finishReason: FinishReason
  /** Model that generated response */
  model: string
  /** Response latency in ms */
  latencyMs: number
}

/**
 * Request validation result
 */
export interface ValidationResult {
  /** Whether the request is valid */
  valid: boolean
  /** Validation errors */
  errors?: Array<{ code: string; message: string; path?: string }>
  /** Validation warnings */
  warnings?: Array<{ code: string; message: string; path?: string }>
}

/**
 * Formalized Model Adapter Interface
 *
 * Following the assistant-ui pattern, this interface enables:
 * - Runtime capability detection
 * - Hot-swapping providers
 * - Type-safe streaming
 * - Request validation
 *
 * @example
 * ```tsx
 * // Create adapter
 * const adapter = createOpenAIAdapter({ endpoint: '/api/chat' })
 *
 * // Check capabilities
 * if (adapter.capabilities.supportsStreaming) {
 *   for await (const chunk of adapter.stream(messages, config)) {
 *     if (chunk.type === 'text-delta') {
 *       console.log(chunk.text)
 *     }
 *   }
 * }
 *
 * // Hot-swap at runtime
 * const anthropic = createAnthropicAdapter({ endpoint: '/api/anthropic' })
 * chatProvider.setAdapter(anthropic)
 * ```
 */
export interface FormalizedModelAdapter {
  /** Provider identifier */
  readonly provider: string

  /** Runtime capabilities */
  readonly capabilities: AdapterCapabilities

  /**
   * Generate a response (non-streaming)
   */
  generate(
    messages: ChatMessage[],
    config: ModelConfig
  ): Promise<AdapterResponse>

  /**
   * Stream a response
   * @throws Error if capabilities.supportsStreaming is false
   */
  stream?(
    messages: ChatMessage[],
    config: ModelConfig,
    callbacks?: StreamingCallbacks
  ): AsyncIterable<TypedStreamChunk>

  /**
   * Abort any in-progress request
   */
  abort?(): void

  /**
   * Count tokens for messages
   */
  countTokens?(messages: ChatMessage[], model: string): Promise<number>

  /**
   * Validate a request before sending
   */
  validate?(messages: ChatMessage[], config: ModelConfig): ValidationResult
}

// =============================================================================
// Type Guards for Stream Chunks
// =============================================================================

export function isTextDelta(
  chunk: TypedStreamChunk
): chunk is { type: 'text-delta'; text: string } {
  return chunk.type === 'text-delta'
}

export function isToolCallDelta(
  chunk: TypedStreamChunk
): chunk is {
  type: 'tool-call-delta'
  toolCallId: string
  toolName: string
  argsText: string
} {
  return chunk.type === 'tool-call-delta'
}

export function isToolCallComplete(
  chunk: TypedStreamChunk
): chunk is {
  type: 'tool-call-complete'
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
} {
  return chunk.type === 'tool-call-complete'
}

export function isFinishChunk(
  chunk: TypedStreamChunk
): chunk is { type: 'finish'; finishReason: FinishReason } {
  return chunk.type === 'finish'
}

export function isErrorChunk(
  chunk: TypedStreamChunk
): chunk is { type: 'error'; error: Error } {
  return chunk.type === 'error'
}

// =============================================================================
// Adapter Registry for Runtime Provider Switching
// =============================================================================

/**
 * Registry of available adapters
 */
export interface AdapterRegistry {
  /** Get adapter by provider name */
  get(provider: string): FormalizedModelAdapter | undefined
  /** Register an adapter */
  register(provider: string, adapter: FormalizedModelAdapter): void
  /** List registered providers */
  providers(): string[]
  /** Check if provider is registered */
  has(provider: string): boolean
}

/**
 * Create an adapter registry for dynamic provider management
 */
export function createAdapterRegistry(): AdapterRegistry {
  const adapters = new Map<string, FormalizedModelAdapter>()

  return {
    get: (provider) => adapters.get(provider),
    register: (provider, adapter) => adapters.set(provider, adapter),
    providers: () => Array.from(adapters.keys()),
    has: (provider) => adapters.has(provider),
  }
}

/**
 * Collect all text from a typed stream
 */
export async function collectStreamText(
  stream: AsyncIterable<TypedStreamChunk>
): Promise<string> {
  let text = ''
  for await (const chunk of stream) {
    if (isTextDelta(chunk)) {
      text += chunk.text
    }
  }
  return text
}

// =============================================================================
// Chat Adapter Types for ClarityChatProvider Integration
// =============================================================================

/**
 * Message attachment for chat messages
 * Consistent with ClarityChatProvider attachment types
 */
export interface ChatMessageAttachment {
  id: string
  type: 'image' | 'file' | 'audio' | 'video' | 'code'
  name: string
  url?: string
  data?: string
  mimeType?: string
  size?: number
  metadata?: Record<string, unknown>
}

/**
 * Extended chat message with all clarity-chat features
 * Adds attachments and thinking to base ChatMessage
 */
export interface ClarityChatMessage extends ChatMessage {
  /** Unique message ID */
  id: string
  /** Creation timestamp */
  createdAt: Date
  /** Message attachments */
  attachments?: ChatMessageAttachment[]
  /** Thinking steps (for extended thinking) */
  thinkingSteps?: Array<{
    id: string
    content: string
    status: 'pending' | 'active' | 'complete'
  }>
  /** Whether message is still streaming */
  isStreaming?: boolean
}

/**
 * Stream chunk for clarity-chat streaming
 * Extends base StreamChunk with thinking support
 */
export interface ClarityChatStreamChunk extends StreamChunk {
  /** Message ID this chunk belongs to */
  messageId?: string
  /** Thinking step content */
  thinking?: {
    id: string
    content: string
    status: 'active' | 'complete'
  }
}

/**
 * Stream status for clarity-chat
 */
export interface ClarityChatStreamStatus {
  isStreaming: boolean
  phase: 'idle' | 'connecting' | 'receiving' | 'complete' | 'error'
  progress: number
  tokensUsed: number
  tokensTotal?: number
  startedAt: Date | null
  estimatedCompletion: Date | null
}

/**
 * Tool execution for clarity-chat
 */
export interface ClarityChatToolExecution {
  id: string
  name: string
  description?: string
  input: Record<string, unknown>
  output?: unknown
  status: 'pending' | 'waiting_approval' | 'approved' | 'rejected' | 'executing' | 'complete' | 'error'
  requiresApproval: boolean
  approvalReason?: string
  startedAt?: Date
  completedAt?: Date
  error?: string
}

/**
 * Streamable response for clarity-chat
 */
export interface ClarityChatStreamableResponse {
  /** Async iterator for streaming */
  stream: () => AsyncIterable<ClarityChatStreamChunk>
  /** Promise that resolves when complete */
  promise: Promise<ClarityChatMessage>
  /** Abort the stream */
  abort: () => void
  /** Message ID */
  messageId: string
}

/**
 * Chat adapter for ClarityChatProvider
 * Integrates with external AI SDKs (Vercel AI, LangChain, etc.)
 */
export interface ClarityChatAdapter {
  /** Adapter name */
  name: string

  /** Send a message (non-streaming) */
  sendMessage: (
    message: string,
    attachments?: ChatMessageAttachment[],
    config?: ModelConfig
  ) => Promise<ClarityChatMessage>

  /** Stream a message */
  streamMessage: (
    message: string,
    attachments?: ChatMessageAttachment[],
    config?: ModelConfig
  ) => ClarityChatStreamableResponse

  /** Stop current generation */
  stopGeneration: () => void

  /** Regenerate a message */
  regenerate?: (messageId: string) => ClarityChatStreamableResponse

  /** Handle tool call */
  handleToolCall?: (tool: ClarityChatToolExecution) => Promise<unknown>

  /** Approve tool execution */
  approveTool?: (toolId: string) => Promise<void>

  /** Reject tool execution */
  rejectTool?: (toolId: string, reason?: string) => Promise<void>

  /** Map external messages to ClarityChatMessage */
  mapMessages: (externalMessages: unknown[]) => ClarityChatMessage[]

  /** Map external stream status */
  mapStreamStatus: (externalStatus: unknown) => ClarityChatStreamStatus

  /** Map external tool calls */
  mapToolCalls?: (externalToolCalls: unknown[]) => ClarityChatToolExecution[]

  /** Get adapter capabilities */
  capabilities: ClarityChatAdapterCapabilities

  /** Cleanup resources */
  dispose?: () => void
}

/**
 * Capabilities for clarity-chat adapters
 */
export interface ClarityChatAdapterCapabilities {
  /** Supports streaming */
  streaming: boolean
  /** Supports tool calling */
  tools: boolean
  /** Supports extended thinking */
  thinking: boolean
  /** Supports attachments */
  attachments: boolean
  /** Supports message regeneration */
  regeneration: boolean
  /** Supports conversation history */
  history: boolean
  /** Supports multiple models */
  multiModel: boolean
  /** Supports tool approval workflow */
  toolApproval: boolean
}

/**
 * Adapter factory options for clarity-chat
 */
export interface ClarityChatAdapterFactoryOptions<TExternal = unknown> {
  /** External SDK instance or hooks */
  sdk: TExternal
  /** Adapter configuration */
  config?: ModelConfig
  /** Custom message mapper */
  messageMapper?: (external: unknown) => ClarityChatMessage
  /** Custom stream status mapper */
  statusMapper?: (external: unknown) => ClarityChatStreamStatus
  /** Error handler */
  onError?: (error: Error) => void
}

/**
 * Create a base clarity-chat adapter with defaults
 */
export function createBaseClarityChatAdapter(name: string): ClarityChatAdapter {
  return {
    name,
    sendMessage: async () => {
      throw new Error(`${name}: sendMessage not implemented`)
    },
    streamMessage: () => {
      throw new Error(`${name}: streamMessage not implemented`)
    },
    stopGeneration: () => {
      // No-op by default
    },
    mapMessages: () => [],
    mapStreamStatus: () => ({
      isStreaming: false,
      phase: 'idle',
      progress: 0,
      tokensUsed: 0,
      startedAt: null,
      estimatedCompletion: null,
    }),
    capabilities: {
      streaming: false,
      tools: false,
      thinking: false,
      attachments: false,
      regeneration: false,
      history: false,
      multiModel: false,
      toolApproval: false,
    },
  }
}

/**
 * Event types for clarity-chat adapters
 * Consistent with ClarityChatProvider events
 */
export type ClarityChatAdapterEventType =
  | 'message:sent'
  | 'message:received'
  | 'message:error'
  | 'stream:start'
  | 'stream:chunk'
  | 'stream:complete'
  | 'stream:error'
  | 'tool:started'
  | 'tool:completed'
  | 'tool:error'
  | 'tool:approval:requested'
  | 'tool:approved'
  | 'tool:rejected'
  | 'thinking:started'
  | 'thinking:step'
  | 'thinking:completed'

/**
 * Event for clarity-chat adapters
 */
export interface ClarityChatAdapterEvent {
  type: ClarityChatAdapterEventType
  payload?: unknown
  timestamp: Date
}

/**
 * Clarity-chat adapter with event support
 */
export interface ClarityChatAdapterWithEvents extends ClarityChatAdapter {
  /** Subscribe to events */
  on: (type: ClarityChatAdapterEventType, handler: (event: ClarityChatAdapterEvent) => void) => () => void
  /** Emit an event */
  emit: (type: ClarityChatAdapterEventType, payload?: unknown) => void
}

/**
 * Add event support to a clarity-chat adapter
 */
export function withClarityChatEvents(adapter: ClarityChatAdapter): ClarityChatAdapterWithEvents {
  const handlers = new Map<ClarityChatAdapterEventType, Set<(event: ClarityChatAdapterEvent) => void>>()

  const on = (type: ClarityChatAdapterEventType, handler: (event: ClarityChatAdapterEvent) => void): (() => void) => {
    if (!handlers.has(type)) {
      handlers.set(type, new Set())
    }
    handlers.get(type)!.add(handler)
    return () => handlers.get(type)?.delete(handler)
  }

  const emit = (type: ClarityChatAdapterEventType, payload?: unknown) => {
    const event: ClarityChatAdapterEvent = { type, payload, timestamp: new Date() }
    handlers.get(type)?.forEach((handler) => handler(event))
  }

  return {
    ...adapter,
    on,
    emit,
  }
}
