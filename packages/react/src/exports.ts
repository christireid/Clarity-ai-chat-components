'use client'

/**
 * Structured API Reference - @clarity-chat/react
 *
 * This file documents and exports the public API surface organized by domain.
 * It serves as both documentation and a complete re-export of the library.
 *
 * ## API Architecture
 *
 * The library follows a 3-tier architecture:
 *
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  TIER 1: DROP-IN READY                                          │
 * │  Complete solutions that work out of the box                    │
 * │  <ClarityChat> useClarityChat() <ChatComplete>                 │
 * └─────────────────────────────────────────────────────────────────┘
 *                              ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  TIER 2: COMPOSABLE                                             │
 * │  Building blocks for custom implementations                     │
 * │  <ChatWindow> <ChatInput> useChatEnhanced() useStreamingSSE()  │
 * └─────────────────────────────────────────────────────────────────┘
 *                              ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  TIER 3: PRIMITIVES                                             │
 * │  Low-level utilities, types, and helpers                        │
 * │  convertMessages() createUserMessage() MessageRole             │
 * └─────────────────────────────────────────────────────────────────┘
 * ```
 *
 * ## Import Strategies
 *
 * ```tsx
 * // Full library (everything)
 * import { ClarityChat } from '@clarity-chat/react'
 *
 * // Core only (minimal bundle)
 * import { ClarityChat } from '@clarity-chat/react/core'
 *
 * // Feature-specific (tree-shakeable)
 * import { useStreamingSSE } from '@clarity-chat/react/hooks'
 * import { ChatWindow } from '@clarity-chat/react/components'
 * import { SecurityManager } from '@clarity-chat/react/enterprise'
 * import type { Message } from '@clarity-chat/react/types'
 * ```
 *
 * @packageDocumentation
 */

// =============================================================================
// DOMAIN 1: CHAT UI
// Components for building chat interfaces
// =============================================================================

// Tier 1: Drop-in Ready
export {
  ClarityChat,
  ClarityChatPresets,
  ClarityChatSimple,
  ChatComplete,
  ChatWithMemory,
  ChatWithAnalytics,
  ChatWithPreset,
  type ChatCompleteProps,
  type ChatWithMemoryProps,
  type ChatWithAnalyticsProps,
  type ChatWithPresetProps,
} from './components/chat'

// Tier 2: Composable
export {
  ChatWindow,
  ChatInput,
  ChatLayout,
  ChatWithErrorBoundary,
  VirtualizedMessageList,
  MessageList,
  MobileOptimizedMessage,
  MobileChatWindow,
  TouchFriendlyButton,
  useMobileOptimization,
  OfflineChatSync,
  useOfflineChat,
} from './components/chat'

// =============================================================================
// DOMAIN 2: CHAT STATE
// Hooks for managing chat state and interactions
// =============================================================================

// Tier 1: Drop-in Ready
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
  type ClarityMemoryOptions,
  type ClarityWebSocketOptions,
  type ClarityChatMemoryInfo,
  type ClarityChatErrorInfo,
  type ClarityPromptOptimizationOptions,
  type ClarityChatTokenStats,
} from './hooks/chat/use-clarity-chat'

export {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
} from './hooks/chat/use-chat-unified'

// Tier 2: Composable
export {
  useChat as useChatEnhanced,
  type UseChatOptions as UseChatEnhancedOptions,
  type UseChatReturn as UseChatEnhancedReturn,
  type CoreMessage,
} from './hooks/chat/use-chat-enhanced'

export {
  useChatHandlers,
  type UseChatHandlersOptions,
  type ChatHandlers,
} from './hooks/chat/use-chat-handlers'

export {
  useClarityChatWithTools,
  type UseClarityChatWithToolsOptions,
  type UseClarityChatWithToolsReturn,
  type ExtractedToolResult,
} from './hooks/chat/use-clarity-chat-with-tools'

// Tier 3: Primitives
export {
  convertCoreMessageToMessage,
  convertMessageToCoreMessage,
  convertCoreMessagesToMessages,
  convertMessagesToCoreMessages,
} from './utils/message'

// =============================================================================
// DOMAIN 3: MEMORY & CONTEXT
// Conversation memory and context management
// =============================================================================

// Tier 1: Drop-in Ready
export {
  MemoryProvider,
  type MemoryProviderProps,
} from './memory/memory-provider'

export {
  useMemoryStore,
  type UseMemoryStoreOptions,
  type UseMemoryStoreReturn,
} from './hooks/storage/use-memory-store'

export {
  useRAGPipeline,
  type UseRAGPipelineOptions,
  type UseRAGPipelineReturn,
} from './hooks/chat/use-rag-pipeline'

export {
  useChatHistory,
  type ChatHistoryOptions,
  type UseChatHistoryReturn,
  type ChatMessage as ChatHistoryMessage,
} from './hooks/chat/use-chat-history'

// Tier 2: Composable
export {
  useMemoryContext,
  type UseMemoryContextReturn,
} from './memory/memory-provider'

// Tier 3: Primitives
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

// Vector Stores
export * from './vector-stores'

// Embeddings
export * from './embeddings'

// =============================================================================
// DOMAIN 4: STREAMING & TRANSPORT
// Real-time streaming and transport protocols
// =============================================================================

// Tier 2: Composable
export * from './hooks/streaming'

// Tier 3: Primitives
export type { StreamChunk } from './adapters/types'
export * from './utils/streaming'

// =============================================================================
// DOMAIN 5: TOOLS & AGENTS
// AI agents and tool integrations
// =============================================================================

// Tier 1: Drop-in Ready
export {
  useClarityObject,
  type UseClarityObjectOptions,
  type UseClarityObjectReturn,
} from './hooks/chat/use-clarity-object'

export {
  useAgent,
  type UseAgentOptions,
  type UseAgentReturn,
} from './hooks/chat/use-agent'

// Tier 2: Composable
export * from './agents/tool-ui-registry'
export {
  createAgent,
  type Agent,
  type Tool,
  type AgentExecution,
} from './agents'

// Tier 3: Primitives
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

export {
  isWeatherToolResult,
  isSearchToolResult,
  isCalculatorToolResult,
  getToolName,
  parseToolArguments as parseToolArgumentsType,
  validateToolResult,
} from './types/tool-result-types'

export * from './utils/tools'

// =============================================================================
// DOMAIN 6: TOKEN OPTIMIZATION
// Tools for reducing token usage and costs
// =============================================================================

// Tier 1: Drop-in Ready
export {
  TokenBudgetProvider,
  useTokenBudget,
  useTokenBudgetOptional,
  type TokenBudgetContextValue,
  type TokenBudgetProviderProps,
} from './context/token-budget-context'

// Tier 2: Composable
export * from './hooks/token'

// Tier 3: Primitives
export * from './utils/tokenization'

export {
  calculateCost,
  calculateCacheSavings,
  estimateConversationCost,
  compareModelCosts,
  recommendModel,
  MODEL_PRICING,
  type ModelPricing,
  type CostCalculation,
} from './utils/tokenization/model-pricing'

export * from './utils/optimization'

export {
  jsonToToon,
  toonToJson,
  autoOptimize,
  formatForLLM,
  parseFlexible,
  estimateToonSavings,
  isSuitableForToon,
  type ToonOptions,
  type ToonFormat,
  type ToonMetadata,
  type ToonStats,
  type ToonOptimizationResult,
  type AutoToonOptions,
} from './utils/toon'

// =============================================================================
// DOMAIN 7: RESILIENCE & AI-OPS
// Production reliability patterns
// =============================================================================

// Tier 2: Composable
export * from './hooks/resilience'

// AI-Ops Components
export * from './components/ai-ops'

// =============================================================================
// DOMAIN 8: ENTERPRISE INFRASTRUCTURE
// Enterprise-grade features for production
// =============================================================================

// Analytics & Observability
export * from './analytics'
export * from './observability'

// Access Control & Security
export * from './quotas'
export * from './rbac'
export * from './multi-tenancy'
export * from './security'

// Compliance & Audit
export * from './audit'
export * from './webhooks'
export * from './safety'

// Enterprise Components
export * from './components/enterprise'

// =============================================================================
// DOMAIN 9: DEVELOPER EXPERIENCE
// Configuration helpers and utilities
// =============================================================================

// Tier 1: Drop-in Ready
export {
  createBasicChatConfig,
  createMemoryChatConfig,
  createStreamingChatConfig,
  createEnterpriseChatConfig,
  isValidApiEndpoint,
  getApiEndpoint,
} from './utils/message/clarity-chat-helpers'

// Tier 2: Composable
export {
  createUserMessage,
  createAssistantMessage,
  createSystemMessage,
  createToolResultMessage,
} from './utils/message/chat-helpers'

// Tier 3: Primitives
export {
  isMemoryEnabled,
  isUserMessage,
  isAssistantMessage,
  hasTextContent,
  extractTextContent,
} from './types/clarity-chat-types'

// =============================================================================
// DOMAIN 10: ADDITIONAL FEATURES
// Supporting systems and utilities
// =============================================================================

// Model Adapters
export * from './adapters'

// Prompt Engineering
export * from './prompts'
export * from './prompt'

// Document Processing
export * from './document-loaders'
export * from './reranking'

// Plugin & Extension Systems
export * from './plugins'
export * from './extensions'

// Theme System
export * from './theme'

// Animation System
export * from './animations'

// Accessibility
export * from './accessibility'

// Templates
export * from './templates'

// Error Handling
export * from './error'

// =============================================================================
// COMPONENTS (All component domains)
// =============================================================================

// Message Components
export * from './components/message'

// Input Components
export * from './components/input'

// Search Components
export * from './components/search'

// Dashboard Components
export * from './components/dashboards'

// Token Components
export * from './components/token'

// Theme UI Components
export * from './components/theme-components'

// Navigation Components
export * from './components/navigation'

// Conversation Components
export * from './components/conversation'

// Feedback Components
export * from './components/feedback'

// Media Components
export * from './components/media'

// UI Primitives
export * from './components/ui'

// AI Components
export * from './components/ai'

// Prompt Components
export * from './components/prompt'

// Context Components
export * from './components/context'

// Code Components
export * from './components/code'

// A/B Testing Components
export * from './components/ab-testing'

// Pro Components
export * from './components/pro'

// =============================================================================
// HOOKS (All hook domains)
// =============================================================================

// UI Hooks
export * from './hooks/ui'

// Keyboard Hooks
export * from './hooks/keyboard'

// Storage Hooks
export * from './hooks/storage'

// Theme Hooks
export * from './hooks/theme'

// Performance Hooks
export * from './hooks/performance'

// Dashboard Hooks
export * from './hooks/dashboard'

// Input Hooks
export * from './hooks/input'

// Context Hooks
export * from './hooks/context'

// Model Hooks
export * from './hooks/model'

// Message Hooks
export * from './hooks/message'

// Security Hooks
export * from './hooks/security'

// =============================================================================
// TYPES
// TypeScript type definitions
// =============================================================================

export * from './types/chat-types'

export type {
  MessageContent,
  MessageRole,
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
