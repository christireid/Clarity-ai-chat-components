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

// Top-Level: Drop-in ready components
export { ClarityChat } from './components/chat/clarity-chat'
export { ClarityChatPresets } from './components/chat/clarity-chat-presets'

// Mid-Level: Composable components
export { ChatWindow } from './components/chat/chat-window'
export { ChatInput } from './components/chat/chat-input'
export { AdvancedChatInput } from './components/input/advanced-chat-input'
export { VirtualizedMessageList as MessageList } from './components/chat/virtualized-message-list'
export { StreamingMessage } from './components/message/streaming-message'
export { ThinkingIndicator } from './components/message/thinking-indicator'

// Low-Level: Primitives
export { Message } from './components/message/message'
export { MessageMetadata } from './components/message/message-metadata'
export {
  MessageMarkdownRenderer,
  useMarkdownComponents,
  useMarkdownPlugins,
  type MessageMarkdownRendererProps,
} from './components/message/index'
export { StreamBlock } from './components/message/stream-block'
export { ToolInvocationCard } from './components/message/tool-invocation-card'
export { ClarityToolResult } from './components/message/clarity-tool-result'
export { CitationCard } from './components/message/citation-card'
export { CopyButton } from './components/message/copy-button'
export { FileUpload } from './components/input/file-upload'

// Tier 2: Composable
// NOTE: These exports are already provided above or not available in current build
// export {
//   ChatWindow,
//   ChatInput,
//   ChatLayout,
//   ChatWithErrorBoundary,
//   VirtualizedMessageList,
//   MessageList,
//   MobileOptimizedMessage,
//   MobileChatWindow,
//   TouchFriendlyButton,
//   useMobileOptimization,
//   OfflineChatSync,
//   useOfflineChat,
// } from './components/chat'

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
} from './utils/message/message-conversion'

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

// NOTE: Commented out due to missing dependencies
// export {
//   useRAGPipeline,
//   type UseRAGPipelineOptions,
//   type UseRAGPipelineReturn,
// } from './hooks/chat/use-rag-pipeline'

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
// NOTE: Commenting out to avoid duplicate exports
// export * from './embeddings'

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

// NOTE: Commented out due to missing dependencies
// export {
//   useAgent,
//   type UseAgentOptions,
//   type UseAgentReturn,
// } from './hooks/chat/use-agent'

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
// NOTE: Commenting out to avoid duplicate exports with hooks/token
// export * from './utils/tokenization'

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

// NOTE: Commenting out to avoid duplicate exports
// export * from './utils/optimization'

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
// export * from './security'

// Compliance & Audit
export * from './audit'
export * from './webhooks'
// NOTE: Safety module has build errors, commenting out
// export * from './safety'

// Enterprise Components
// export * from './components/enterprise'

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
// NOTE: Commenting out to avoid duplicate exports (TokenUsage)
// export * from './adapters'

// Prompt Engineering
// NOTE: Excluded from build
// export * from './prompts'
// export * from './prompt'

// Document Processing
// NOTE: Commenting out to avoid duplicate exports
// export * from './document-loaders'
export * from './reranking'

// Plugin & Extension Systems
// NOTE: Plugins module has build errors, commenting out
// export * from './plugins'
// NOTE: Extensions integrations excluded from build
// export * from './extensions'

// Theme System
// NOTE: Export specific items to avoid duplicates (getContrastRatio, getDarkThemes, getLightThemes)
export {
  ThemeProvider,
  useTheme,
  type ThemeContextValue,
  type ThemeProviderProps,
} from './theme'

// Animation System
// NOTE: Commenting out to avoid duplicate exports (useReducedMotion)
// export * from './animations'

// Accessibility
// NOTE: Commenting out to avoid duplicate exports (useKeyboardNavigation)
// export * from './accessibility'

// Additional Components (organized by feature)
export { ModelSelector } from './components/ai/model-selector'
export { ContextCard } from './components/context/context-card'
export { ContextManager } from './components/context/context-manager'
export { ProjectSidebar } from './components/context/project-sidebar'
export { PromptLibrary } from './components/prompt/prompt-library'
export { SettingsPanel } from './components/context/settings-panel'
export { UsageDashboard } from './components/dashboards/usage-dashboard'
export {
  // Components
  LinkPreview,
  LinkPreviewSkeleton,
  LinkPreviewError,
  LinkPreviewCompact,
  InlineLink,
  SmartLinkPreview,
  RichEmbed,
  // Hook
  useLinkPreview,
  // Utilities
  isValidUrl,
  sanitizeUrl,
  detectEmbedType,
  createMetadataFetcher,
  createFallbackMetadata,
  // Types
  type LinkMetadata,
  type LinkPreviewProps,
  type LinkPreviewVariant,
  type LinkPreviewSkeletonProps,
  type LinkPreviewErrorProps,
  type LinkPreviewCompactProps,
  type InlineLinkProps,
  type SmartLinkPreviewProps,
  type UseLinkPreviewOptions,
  type UseLinkPreviewReturn,
  type MetadataFetcherConfig,
  type EmbedType,
} from './components/ui/link-preview'
export { KnowledgeBaseViewer } from './components/ai/knowledge-base-viewer'
export { ExportDialog } from './components/media/export-dialog'
export { BatchExportDialog } from './components/media/batch-export-dialog'
export { StreamCancellation } from './components/message/stream-cancellation'
export {
  MessageSearch,
  MessageSearchWithSuspense,
  highlightSearchMatch,
} from './components/search/message-search'
export {
  AdvancedMessageSearch,
  type SearchFilters,
  type SavedSearch,
  type SortOption,
  type FilterPreset,
} from './components/search/advanced-message-search'
export {
  SemanticMessageSearch,
  type SemanticSearchConfig,
  type SemanticSearchResult,
  type EmbeddingProvider,
} from './components/search/advanced-message-search-semantic'
export { FollowUpSuggestions } from './components/prompt/follow-up-suggestions'
export { PromptSuggestions } from './components/prompt/prompt-suggestions'
export { EnhancedMarkdownRenderer } from './components/ai/enhanced-markdown-renderer'
export { EnhancedCodeBlock } from './components/ai/enhanced-code-block'
export { StreamingTextRenderer } from './components/message/streaming-text-renderer'
export { PersonaPanel } from './components/ai/persona-panel'
export { ConversationTimeline } from './components/conversation/conversation-timeline'
export { MemoryInspector } from './components/context/memory-inspector'
export { SafetyStatusCard } from './components/ai/safety-status-card'
export { AuditLogViewer } from './components/ai/audit-log-viewer'
export { DocumentViewer } from './components/media/document-viewer'
export { ResponseQualityMeter } from './components/dashboards/response-quality-meter'
export { MultiModalPreview } from './components/media/multi-modal-preview'
export { AgentRunFeed } from './components/ai/agent-run-feed'
export { SessionSummaryCard } from './components/ai/session-summary-card'
export { WorkflowSuggestionList } from './components/ai/workflow-suggestion-list'
// AI-Ops components (exported from directory)
export * from './components/ai-ops'
// Enterprise components (exported from directory)
// export * from './components/enterprise'
export { AnalyticsDashboard } from './components/dashboards/analytics-dashboard'

// Error Handling Components
export { ErrorBoundary } from './components/feedback/error-boundary'
export { RetryButton } from './components/feedback/retry-button'
export { NetworkStatus } from './components/feedback/network-status'

// Token Management Components
export { TokenCounter } from './components/token/token-counter'
export { TokenOptimizationPanel } from './components/token/token-optimization-panel'
export { TokenOptimizationBadge } from './components/token/token-optimization-badge'
export {
  TokenBudgetBar,
  TokenBudgetIndicator,
} from './components/token/token-budget-bar'

// Context & Conversation Management
export { ContextVisualizer } from './components/context/context-visualizer'
export { ConversationList } from './components/conversation/conversation-list'
export { ConversationBranchVisualizer } from './components/conversation/conversation-branch-visualizer'

// Markdown & Rendering
export { MarkdownRendererEnhanced } from './components/ai/markdown-renderer-enhanced'

// Search Components
// NOTE: Excluded from build
// export * from './components/search'

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
// NOTE: Excluded from build
// export * from './components/prompt'

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
// NOTE: Commenting out to avoid duplicate exports (useIntersectionObserver)
// export * from './hooks/performance'

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
// export * from './hooks/security'

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

// Helper hooks (legacy, consider deprecating)
// NOTE: Module not available in current build
// export {
//   useClarityChatWithWindow,
//   useClarityChatWithAnalytics,
//   useClarityChatWithPersistence,
//   useClarityChatWithDebounce,
//   useClarityChatWithAutoSave,
// } from './hooks/use-clarity-chat-helpers'

// Testing utilities (for test files only)
export {
  createMockUseClarityChat,
  createTestMessages,
  createTestUserMessage,
  createTestAssistantMessage,
  waitForChatUpdate,
  simulateStreamingResponse,
  createMockFetch,
  createMockStreamingResponse,
  assertMessageStructure,
  assertChatState,
} from './test-utils/use-clarity-chat-test-utils'

// UI Primitives
export * from './components/ui/skeleton'
export * from './components/ui/animated-dots'
export * from './components/ui/animated-list'
export * from './components/ui/toast'
export * from './components/ui/progress'
export * from './components/ui/feedback-animation'
export * from './components/ui/interactive-card'
