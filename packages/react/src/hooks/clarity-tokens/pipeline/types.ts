/**
 * Core types for the ClarityTokens middleware pipeline
 *
 * These types define the foundation for provider-agnostic LLM request/response
 * handling and composable middleware patterns.
 */

// =============================================================================
// Core Request/Response Types
// =============================================================================

export type Role = 'system' | 'user' | 'assistant' | 'tool' | 'function'

/**
 * @deprecated Use `ChatMessage` from `@clarity-chat/types` instead.
 * Kept for backwards compatibility; structurally compatible with the canonical type.
 */
export interface ChatMessage {
  role: Role
  content: string
  name?: string
  toolCallId?: string
  metadata?: Record<string, unknown>
}

export type Provider = 'openai' | 'anthropic' | 'custom'

export interface LLMRequest {
  /** Unique request identifier */
  id: string
  /** Target provider */
  provider: Provider
  /** Model identifier */
  model: string
  /** Chat messages */
  messages: ChatMessage[]
  /** Sampling temperature */
  temperature?: number
  /** Maximum output tokens */
  maxOutputTokens?: number
  /** Request metadata */
  metadata?: Record<string, unknown>
  /** Timestamp when request was created */
  createdAt?: Date
}

export interface TokenUsage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  cachedTokens?: number
}

export interface CacheInfo {
  kind: 'exact' | 'semantic'
  key: string
  similarity?: number
  hitAt?: Date
}

export interface LLMResponse {
  /** Request ID (correlates to LLMRequest) */
  id: string
  /** Provider that handled the request */
  provider: string
  /** Model that generated the response */
  model: string
  /** Generated text response */
  text: string
  /** Token usage statistics */
  usage?: TokenUsage
  /** Cache hit information */
  cached?: CacheInfo
  /** Response latency in milliseconds */
  latencyMs?: number
  /** Response metadata */
  metadata?: Record<string, unknown>
  /** Timestamp when response was received */
  receivedAt?: Date
}

// =============================================================================
// Middleware Types
// =============================================================================

/**
 * Middleware function type for the LLM pipeline.
 * Middleware can inspect/modify requests, short-circuit with cached responses,
 * and post-process responses.
 */
export type Middleware = (
  req: LLMRequest,
  next: (req: LLMRequest) => Promise<LLMResponse>
) => Promise<LLMResponse>

/**
 * Named middleware with metadata for debugging
 */
export interface NamedMiddleware {
  name: string
  middleware: Middleware
  priority?: number
  enabled?: boolean
}

// =============================================================================
// Tokenizer Types
// =============================================================================

export type TokenizerEncoding =
  | 'cl100k_base'
  | 'o200k_base'
  | 'p50k_base'
  | 'custom'

export interface TokenCounter {
  encoding: TokenizerEncoding
  count: (text: string) => number
  encode?: (text: string) => number[]
  decode?: (tokens: number[]) => string
}

// =============================================================================
// Cache Types
// =============================================================================

export interface CacheStore {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string, ttlMs?: number) => Promise<void>
  del?: (key: string) => Promise<void>
  clear?: () => Promise<void>
}

export interface VectorIndex {
  query: (
    embedding: number[],
    k: number
  ) => Promise<Array<{ id: string; score: number }>>
  upsert: (item: {
    id: string
    embedding: number[]
    metadata: Record<string, unknown>
  }) => Promise<void>
  get: (id: string) => Promise<{ metadata: Record<string, unknown> } | null>
  delete?: (id: string) => Promise<void>
}

// =============================================================================
// Retrieval Types
// =============================================================================

export interface RetrievedChunk {
  id: string
  text: string
  score: number
  source?: string
  metadata?: Record<string, unknown>
}

export interface Retriever {
  query: (embedding: number[], k: number) => Promise<RetrievedChunk[]>
}

// =============================================================================
// Provider Adapter Types
// =============================================================================

export type ProviderAdapter = (req: LLMRequest) => Promise<LLMResponse>

export interface AdapterConfig {
  /** API endpoint (proxy URL recommended for browser) */
  endpoint: string
  /** Custom headers */
  headers?: Record<string, string>
  /** Enable streaming */
  stream?: boolean
  /** Request timeout in ms */
  timeoutMs?: number
  /** Retry configuration */
  retry?: {
    maxRetries: number
    initialDelayMs: number
    maxDelayMs: number
  }
}

// =============================================================================
// Telemetry Types
// =============================================================================

export type TelemetryEventType =
  | 'TOKEN_COUNTED'
  | 'BUDGET_GUARD_APPLIED'
  | 'CACHE_HIT'
  | 'CACHE_MISS'
  | 'RETRIEVAL_PERFORMED'
  | 'CONTEXT_INJECTED'
  | 'COMPRESSED'
  | 'ROUTED'
  | 'COST_UPDATED'
  | 'THROTTLED'
  | 'SUMMARY_UPDATED'
  | 'REQUEST_STARTED'
  | 'REQUEST_COMPLETED'
  | 'REQUEST_FAILED'

export interface TelemetryEvent {
  type: TelemetryEventType
  timestamp: Date
  requestId?: string
  data: Record<string, unknown>
}

export type TelemetryHandler = (event: TelemetryEvent) => void

// =============================================================================
// Error Types
// =============================================================================

export class TokenizerUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TokenizerUnavailableError'
  }
}

export class BudgetExceededError extends Error {
  currentTokens: number
  maxTokens: number

  constructor(currentTokens: number, maxTokens: number) {
    super(
      `Budget exceeded: ${currentTokens} tokens exceeds limit of ${maxTokens}`
    )
    this.name = 'BudgetExceededError'
    this.currentTokens = currentTokens
    this.maxTokens = maxTokens
  }
}

export class SummarizationFailedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SummarizationFailedError'
  }
}

export class CompressionFailedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CompressionFailedError'
  }
}

export class CacheCorruptError extends Error {
  key: string

  constructor(key: string, message: string) {
    super(message)
    this.name = 'CacheCorruptError'
    this.key = key
  }
}

export class EmbeddingFailedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmbeddingFailedError'
  }
}

export class VectorIndexError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VectorIndexError'
  }
}

export class RetrieverError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RetrieverError'
  }
}

export class ContextInjectionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContextInjectionError'
  }
}

export class ThrottleQueueFullError extends Error {
  queueSize: number

  constructor(queueSize: number) {
    super(`Throttle queue full: ${queueSize} items queued`)
    this.name = 'ThrottleQueueFullError'
    this.queueSize = queueSize
  }
}

export class PricingMissingError extends Error {
  model: string

  constructor(model: string) {
    super(`Pricing not found for model: ${model}`)
    this.name = 'PricingMissingError'
    this.model = model
  }
}

export class InvalidRouteError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidRouteError'
  }
}

export class ProviderError extends Error {
  provider: string
  statusCode?: number

  constructor(provider: string, message: string, statusCode?: number) {
    super(message)
    this.name = 'ProviderError'
    this.provider = provider
    this.statusCode = statusCode
  }
}
