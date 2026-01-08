/**
 * ClarityTokens Core
 *
 * Core types, pipeline, and utilities for the ClarityTokens library.
 */

// Types
export type {
  // Request/Response
  Role,
  ChatMessage,
  Provider,
  LLMRequest,
  LLMResponse,
  TokenUsage,
  CacheInfo,
  // Middleware
  Middleware,
  NamedMiddleware,
  // Tokenizer
  TokenizerEncoding,
  TokenCounter,
  // Cache & Storage
  CacheStore,
  VectorIndex,
  // Retrieval
  RetrievedChunk,
  Retriever,
  // Adapter
  ProviderAdapter,
  AdapterConfig,
  // Telemetry
  TelemetryEventType,
  TelemetryEvent,
  TelemetryHandler,
} from './types'

// Errors
export {
  TokenizerUnavailableError,
  BudgetExceededError,
  SummarizationFailedError,
  CompressionFailedError,
  CacheCorruptError,
  EmbeddingFailedError,
  VectorIndexError,
  RetrieverError,
  ContextInjectionError,
  ThrottleQueueFullError,
  PricingMissingError,
  InvalidRouteError,
  ProviderError,
} from './types'

// Pipeline
export {
  createPipeline,
  createNamedPipeline,
  // Built-in middlewares
  requestIdMiddleware,
  tokenCountMiddleware,
  budgetGuardMiddleware,
  exactCacheMiddleware,
  semanticCacheMiddleware,
  costTrackingMiddleware,
  compressionMiddleware,
  retrievalMiddleware,
  routingMiddleware,
  // Telemetry utilities
  composeTelemetry,
  consoleLogger,
  noopTelemetry,
} from './pipeline'
