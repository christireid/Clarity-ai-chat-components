/**
 * Model Adapters
 *
 * Export all model adapters and utilities
 */

// Types - explicit exports for better tree-shaking
export type {
  ModelConfig,
  ChatMessage,
  ContentPart,
  ToolCall,
  Citation,
  StreamChunk,
  TokenUsage,
  ModelAdapter,
  ModelInfo,
  // Formalized adapter types (assistant-ui pattern)
  AdapterCapabilities,
  FinishReason,
  TypedStreamChunk,
  StreamingCallbacks,
  AdapterResponse,
  ValidationResult,
  FormalizedModelAdapter,
  AdapterRegistry,
} from './types'

// Error types and classes
export {
  AdapterErrorCode,
  AdapterError,
  AuthenticationError,
  APIKeyMissingError,
  RateLimitError,
  InvalidRequestError,
  ServerError,
  NetworkError,
  TimeoutError,
  ContentFilterError,
  parseHttpError,
  parseNetworkError,
  isAdapterError,
  isRetryableError,
  getErrorRetryDelay,
} from './errors'

// retry.ts removed — use utils/resilience/retry-with-backoff instead

// Circuit breaker types and utilities
export {
  CircuitState,
  CircuitBreakerError,
  CircuitBreaker,
  CircuitBreakerRegistry,
  globalCircuitBreakerRegistry,
} from './circuit-breaker'

export type {
  CircuitBreakerConfig,
  CircuitBreakerStats,
} from './circuit-breaker'

// Logging types and utilities
export {
  LogLevel,
  Logger,
  ConsoleLogTransport,
  JSONLogTransport,
  BufferedLogTransport,
  globalLogger,
  createCorrelationId,
  logAdapterRequest,
  logAdapterResponse,
  logAdapterError,
} from './logging'

export type {
  LogEntry,
  LogTransport,
  LoggerConfig,
} from './logging'

// Monitoring types and utilities
export {
  HealthMonitor,
  HealthMonitorRegistry,
  globalHealthMonitorRegistry,
} from './monitoring'

export type {
  LatencyPercentiles,
  ErrorStats,
  ProviderHealthMetrics,
  HealthThresholds,
} from './monitoring'

// Telemetry types and utilities
export {
  TelemetryEventType,
  TelemetryManager,
  globalTelemetry,
  exportPrometheusMetrics,
  exportPrometheusText,
  createSpan,
  endSpan,
  exportSpan,
} from './telemetry'

export type {
  TelemetryEvent,
  TelemetryHook,
  TelemetryConfig,
  PrometheusMetrics,
  Span,
} from './telemetry'

// Runtime functions and type guards
export {
  createAdapterRegistry,
  collectStreamText,
  isTextDelta,
  isToolCallDelta,
  isToolCallComplete,
  isFinishChunk,
  isErrorChunk,
} from './types'

// OpenAI adapter
export { openAIAdapter, openAIModels } from './openai'

// Anthropic adapter
export { anthropicAdapter, anthropicModels } from './anthropic'

// Google adapter
export { googleAdapter, googleModels } from './google'

// Export combined model list
import { openAIAdapter, openAIModels } from './openai'
import { anthropicAdapter, anthropicModels } from './anthropic'
import { googleAdapter, googleModels } from './google'

export const allModels = [...openAIModels, ...anthropicModels, ...googleModels]

// Helper to get adapter by provider name
import type { ModelAdapter } from './types'

export function getAdapter(provider: string): ModelAdapter {
  switch (provider) {
    case 'openai':
      return openAIAdapter
    case 'anthropic':
      return anthropicAdapter
    case 'google':
      return googleAdapter
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

// =============================================================================
// Clarity-Chat Adapter Types and Utilities
// =============================================================================

export type {
  // Chat adapter types
  ChatMessageAttachment,
  ClarityChatMessage,
  ClarityChatStreamChunk,
  ClarityChatStreamStatus,
  ClarityChatToolExecution,
  ClarityChatStreamableResponse,
  ClarityChatAdapter,
  ClarityChatAdapterCapabilities,
  ClarityChatAdapterFactoryOptions,
  ClarityChatAdapterEventType,
  ClarityChatAdapterEvent,
  ClarityChatAdapterWithEvents,
} from './types'

export {
  createBaseClarityChatAdapter,
  withClarityChatEvents,
} from './types'

// Vercel AI adapter
export {
  createVercelAIAdapter,
  useVercelAIBridge,
} from './vercel-ai'

export type {
  VercelAIAdapterOptions,
  VercelAIBridgeResult,
} from './vercel-ai'

// LangChain adapter
export {
  createLangChainAdapter,
  useLangChainAdapter,
  useLangChainBridge,
} from './langchain'

export type {
  LangChainMessage,
  LangChainHumanMessage,
  LangChainAIMessage,
  LangChainToolMessage,
  LangChainSystemMessage,
  LangChainToolCall,
  LangChainModel,
  LangChainStreamChunk,
  LangChainRunnable,
  LangChainStreamEvent,
  LangChainAdapterOptions,
  LangChainBridgeResult,
  UseLangChainAdapterResult,
} from './langchain'
