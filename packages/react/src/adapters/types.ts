/**
 * Model Adapter Types
 *
 * Unified interface for AI model providers (OpenAI, Anthropic, Google, etc.)
 * Enables model-agnostic configuration and easy provider switching.
 */

import type { RateLimitInfo } from '../utils/api/rate-limit-headers'

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
 * Why generation stopped
 */
export type FinishReason =
  | 'stop' // Natural end of response
  | 'length' // Hit max tokens
  | 'tool-calls' // Model wants to call a tool
  | 'content-filter' // Content was filtered
  | 'error' // An error occurred
  | 'unknown' // Unknown reason

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
