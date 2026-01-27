/**
 * @clarity-chat/react/types - TypeScript Type Definitions
 *
 * This entry point exports all TypeScript types from the library.
 * Use this for type-only imports that won't increase your bundle size.
 *
 * @example
 * ```tsx
 * import type {
 *   Message,
 *   MessageRole,
 *   UseClarityChatOptions,
 *   ClarityChatProps
 * } from '@clarity-chat/react/types'
 * ```
 *
 * @packageDocumentation
 */

// =============================================================================
// CORE CHAT TYPES
// =============================================================================

export type { Message, MessageRole } from '@clarity-chat/types'

export type {
  MessageContent,
  ClarityChatWithMemoryConfig,
  ClarityChatWithoutMemoryConfig,
  ClarityChatWithMemoryReturn,
  ClarityChatWithoutMemoryReturn,
  MemoryStrategy,
  TransportType,
  MessageWithMetadata,
  ChatStateSnapshot,
  ChatEventType,
  ChatEvent,
  ChatEventHandler,
  ChatAnalyticsConfig,
  ChatPerformanceMetrics,
} from './types/clarity-chat-types'

export * from './types/chat-types'

// =============================================================================
// HOOK TYPES
// =============================================================================

export type {
  UseClarityChatOptions,
  UseClarityChatReturn,
  ClarityMemoryOptions,
  ClarityWebSocketOptions,
  ClarityChatMemoryInfo,
  ClarityChatErrorInfo,
  ClarityPromptOptimizationOptions,
  ClarityChatTokenStats,
} from './hooks/chat/use-clarity-chat'

// UseChatOptions and UseChatReturn were removed in v2.0
// Use UseClarityChatOptions and UseClarityChatReturn instead

export type {
  UseClarityObjectOptions,
  UseClarityObjectReturn,
} from './hooks/chat/use-clarity-object'

export type {
  UseChatOptions as UseChatEnhancedOptions,
  UseChatReturn as UseChatEnhancedReturn,
  CoreMessage,
} from './hooks/chat/use-chat-enhanced'

export type {
  UseChatHandlersOptions,
  ChatHandlers,
} from './hooks/chat/use-chat-handlers'

export type {
  UseClarityChatWithToolsOptions,
  UseClarityChatWithToolsReturn,
  ExtractedToolResult,
} from './hooks/chat/use-clarity-chat-with-tools'

export type {
  UseMemoryStoreOptions,
  UseMemoryStoreReturn,
} from './hooks/storage/use-memory-store'

export type {
  ChatHistoryOptions,
  UseChatHistoryReturn,
  ChatMessage as ChatHistoryMessage,
} from './hooks/chat/use-chat-history'

// =============================================================================
// STREAMING TYPES
// =============================================================================

export type { StreamChunk } from './adapters/types'

// =============================================================================
// RESILIENCE TYPES
// =============================================================================

export type {
  UseCircuitBreakerOptions,
  UseCircuitBreakerReturn,
} from './hooks/resilience/use-circuit-breaker'

export type {
  UseRetryWithBackoffOptions,
  UseRetryWithBackoffReturn,
} from './hooks/resilience/use-retry-with-backoff'

export type {
  UseRequestDeduplicationOptions,
  UseRequestDeduplicationReturn,
} from './hooks/resilience/use-request-deduplication'

// =============================================================================
// TOKEN OPTIMIZATION TYPES
// =============================================================================

export type {
  TokenBudgetContextValue,
  TokenBudgetProviderProps,
} from './context/token-budget-context'

export type {
  ToonOptions,
  ToonFormat,
  ToonMetadata,
  ToonStats,
  ToonOptimizationResult,
  AutoToonOptions,
} from './utils/toon'

export type {
  ModelPricing,
  CostCalculation,
} from './utils/tokenization/model-pricing'

export type {
  CacheProvider,
  CacheableContent,
  CacheStats,
  PromptCacheOptions,
} from './utils/prompt-caching'

// =============================================================================
// TOOL RESULT TYPES
// =============================================================================

export type {
  WeatherToolResult,
  SearchToolResult,
  CalculatorToolResult,
  DatabaseQueryToolResult,
  APICallToolResult,
  CodeExecutionToolResult,
  PriceComparisonToolResult,
  ReviewSummaryToolResult,
  FAQSearchToolResult,
  FileReadToolResult,
  GenericToolResult,
} from './types/tool-result-types'

// =============================================================================
// AGENT TYPES
// =============================================================================

export type { Agent, Tool, AgentExecution } from './agents'

// =============================================================================
// MEMORY TYPES
// =============================================================================

export type {
  MemoryProviderProps,
  UseMemoryContextReturn,
} from './memory/memory-provider'

export type {
  MemoryItem,
  MemoryQuery,
  MemorySearchResult,
  MemoryServiceConfig,
  MemoryType,
  MemoryScope,
  MemoryPriority,
  MemoryStats,
} from '@clarity-chat/memory'

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export type { ClarityChatProps } from './components/chat/ClarityChat'
export type { ClarityChatSimpleProps } from './components/chat/ClarityChatSimple'
export type { ChatWindowProps } from './components/chat/ChatWindow'
export type { TypingIndicatorVariant } from './components/message/TypingIndicator'

export type {
  ChatCompleteProps,
  ChatWithMemoryProps,
  ChatWithAnalyticsProps,
  ChatWithPresetProps,
} from './components/chat/ChatRecipes'

// =============================================================================
// LICENSE TYPES
// =============================================================================

export type {
  LicensePlan,
  LicenseScope,
  LicenseStatus,
  LicenseStatusCode,
  ClarityLicensePayload,
  WithLicenseOptions,
  WithLicenseStatusProps,
  WatermarkProps,
  WatermarkOverlayProps,
  LicenseGateProps,
  LicenseContextValue,
  LicenseProviderProps,
} from '@clarity-chat/license'
