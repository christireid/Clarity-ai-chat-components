'use client'

/**
 * @clarity-chat/react - Main Entry Point
 *
 * This package provides a layered architecture for building AI chat applications:
 *
 * - Top-Level APIs: Drop-in ready components and hooks (ClarityChat, useClarityChat)
 * - Mid-Level APIs: Composable building blocks (ChatWindow, useChatEnhanced)
 * - Low-Level Primitives: Utilities and internal APIs (normalizeMessages, etc.)
 *
 * Components are organized into domain-specific modules for better discoverability:
 * - components/chat/        Core chat components
 * - components/message/     Message display components
 * - components/input/       Input components
 * - components/dashboards/  Analytics dashboards
 * - components/token/       Token management
 * - components/navigation/  Keyboard navigation
 * - And more...
 *
 * @see DESIGN.md for architecture documentation
 *
 * Quick Start:
 * ```tsx
 * import { ClarityChat } from '@clarity-chat/react'
 * <ClarityChat api="/api/chat" />
 * ```
 */

// ============================================================================
// TOP-LEVEL APIs (Drop-in Ready)
// ============================================================================

// Chat UI - Drop-in components
export { ClarityChat } from './components/chat/clarity-chat'
export { ClarityChatPresets } from './components/chat/clarity-chat-presets'

// Chat Recipes - Pre-built combinations for common patterns
export {
  ChatComplete,
  ChatWithMemory,
  ChatWithAnalytics,
  ChatWithPreset,
  type ChatCompleteProps,
  type ChatWithMemoryProps,
  type ChatWithAnalyticsProps,
  type ChatWithPresetProps,
} from './components/chat/chat-recipes'

// Chat State - Primary hook
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

// Structured Output
export {
  useClarityObject,
  type UseClarityObjectOptions,
  type UseClarityObjectReturn,
} from './hooks/chat/use-clarity-object'

// Memory Provider (Top-level)
export {
  MemoryProvider,
  type MemoryProviderProps,
} from './memory/memory-provider'

// ============================================================================
// MID-LEVEL APIs (Composable Building Blocks)
// ============================================================================

// Chat UI Components
export { ChatWindow } from './components/chat/chat-window'
export { ChatInput } from './components/chat/chat-input'
export { AdvancedChatInput } from './components/input/advanced-chat-input'
export { default as MessageList } from './components/chat/virtualized-message-list'
export { default as VirtualizedMessageList } from './components/chat/virtualized-message-list'
export { StreamingMessage } from './components/message/streaming-message'
export { ThinkingIndicator } from './components/message/thinking-indicator'
export {
  TypingIndicator,
  type TypingIndicatorVariant,
} from './components/message/typing-indicator'

// Chat State Hooks
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

// Memory Hooks
export {
  useMemoryContext,
  type UseMemoryContextReturn,
} from './memory/memory-provider'

// Streaming Hooks
export * from './hooks/streaming'

// Resilience Hooks (AI-Ops)
export * from './hooks/resilience'

// Tools & Agents
export * from './agents/tool-ui-registry'
export {
  createAgent,
  type Agent,
  type Tool,
  type AgentExecution,
} from './agents'

// ============================================================================
// LOW-LEVEL PRIMITIVES (Utilities & Internal APIs)
// ============================================================================

// Message Conversion
export {
  convertCoreMessageToMessage,
  convertMessageToCoreMessage,
  convertCoreMessagesToMessages,
  convertMessagesToCoreMessages,
} from './utils/message'

// Unified Chat Hook
export {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
} from './hooks/chat/use-chat-unified'

// Legacy Chat Hook (Deprecated)
export {
  useChat as useChatLegacy,
  type UseChatOptions as UseChatOptionsLegacy,
  type UseChatReturn as UseChatReturnLegacy,
} from './hooks/chat/use-chat'

// Streaming Primitives
export type { StreamChunk } from './adapters/types'
export * from './utils/streaming'

// Message Helpers
export {
  createUserMessage,
  createAssistantMessage,
  createSystemMessage,
  createToolResultMessage,
} from './utils/message/chat-helpers'

// Configuration Helpers
export {
  createBasicChatConfig,
  createMemoryChatConfig,
  createStreamingChatConfig,
  createEnterpriseChatConfig,
  isValidApiEndpoint,
  getApiEndpoint,
} from './utils/message/clarity-chat-helpers'

// Type Utilities
export {
  isMemoryEnabled,
  isUserMessage,
  isAssistantMessage,
  hasTextContent,
  extractTextContent,
} from './types/clarity-chat-types'

// ============================================================================
// TOKEN OPTIMIZATION (Enhanced 2025)
// ============================================================================

// Token Hooks
export * from './hooks/token'

// Token Budget Provider
export {
  TokenBudgetProvider,
  useTokenBudget,
  useTokenBudgetOptional,
  type TokenBudgetContextValue,
  type TokenBudgetProviderProps,
} from './context/token-budget-context'

// Token Optimization Utilities
export * from './utils/optimization'

// Tokenization
export * from './utils/tokenization'

// Model Pricing & Cost
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

// Prompt Caching
export {
  PromptCacheManager,
  createAnthropicCachedMessages,
  estimateCacheSavings,
  type CacheProvider,
  type CacheableContent,
  type CacheStats,
  type PromptCacheOptions,
} from './utils/prompt-caching'

// TOON
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

// ============================================================================
// ENTERPRISE INFRASTRUCTURE
// ============================================================================

export * from './analytics'
export * from './observability'
export * from './quotas'
export * from './rbac'
export * from './multi-tenancy'
export * from './audit'
export * from './webhooks'

// ============================================================================
// ADDITIONAL EXPORTS (Organized by Feature Area)
// ============================================================================

// Model Adapters
export * from './adapters'

// Vector Stores & Embeddings
export * from './vector-stores'
export * from './embeddings'

// Prompt System
export * from './prompts'
export * from './prompt'

// Document Loaders
export * from './document-loaders'

// AI Safety
export * from './safety'

// Security System
export * from './security'
export * from './hooks/security'

// Reranking
export * from './reranking'

// Plugin Architecture
export * from './plugins'

// Extension System
export * from './extensions'

// Theme System
export * from './theme'

// Animation System
export * from './animations'

// Accessibility
export * from './accessibility'

// ============================================================================
// COMPONENTS (Organized by Domain)
// ============================================================================

// Message Components
export * from './components/message'

// Chat Components
export * from './components/chat'

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

// AIOps Components
export * from './components/ai-ops'

// Enterprise Components
export * from './components/enterprise'

// A/B Testing Components
export * from './components/ab-testing'

// Pro Components
export * from './components/pro'

// Error Reporting System
export * from './error'

// ============================================================================
// HOOKS (Organized by Domain)
// ============================================================================

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

// ============================================================================
// TEMPLATES
// ============================================================================

export * from './templates'

// ============================================================================
// UTILITIES & TYPES
// ============================================================================

// Core utilities
export { cn } from './utils/cn'
export * from './utils/mobile'
export * from './utils/search'
export * from './utils/api'
export * from './utils/resilience'
export * from './utils/config'
export * from './utils/security'
export * from './utils/tools'

// Types
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

// Tool Result Types
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

// ============================================================================
// LICENSE MANAGEMENT
// ============================================================================

export {
  LicenseInfo,
  verifyLicense,
  isLicenseValid,
  useLicenseStatus,
  useIsLicensed,
  useHasPlan,
  useLicenseInfo,
  useLicenseWarning,
  useIsHydrated,
  LicenseProvider,
  useLicenseContext,
  useLicenseContextOptional,
  Watermark,
  WatermarkOverlay,
  LicenseGate,
  withLicense,
  withLicenseStatus,
  createLicenseWrapper,
  clearWarnings,
  isDevelopment,
} from '@clarity-chat/license'

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
