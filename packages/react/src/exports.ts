/**
 * Structured Exports - Organized by Domain and Layer
 *
 * This file defines the public API surface organized by:
 * 1. Domain (Chat UI, Chat State, Memory, etc.)
 * 2. Layer (Top-level, Mid-level, Low-level)
 *
 * The main index.ts re-exports from here to maintain backward compatibility
 * while providing a clear structure for future development.
 */

// ============================================================================
// DOMAIN 1: CHAT UI
// ============================================================================

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

// ============================================================================
// DOMAIN 2: CHAT STATE
// ============================================================================

// Top-Level: Drop-in ready hooks
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
} from './hooks/use-clarity-chat'

// Mid-Level: Composable hooks
export {
  useChat as useChatEnhanced,
  type UseChatOptions as UseChatEnhancedOptions,
  type UseChatReturn as UseChatEnhancedReturn,
  type CoreMessage,
} from './hooks/use-chat-enhanced'
export {
  useChatHandlers,
  type UseChatHandlersOptions,
  type ChatHandlers,
} from './hooks/use-chat-handlers'
export {
  useClarityChatWithTools,
  type UseClarityChatWithToolsOptions,
  type UseClarityChatWithToolsReturn,
  type ExtractedToolResult,
} from './hooks/use-clarity-chat-with-tools'

// Low-Level: Primitives
export {
  useChat,
  type UseChatOptions as UseChatOptionsLegacy,
  type UseChatReturn as UseChatReturnLegacy,
} from './hooks/use-chat'
export {
  convertCoreMessageToMessage,
  convertMessageToCoreMessage,
  convertCoreMessagesToMessages,
  convertMessagesToCoreMessages,
} from './utils/message/message-conversion'

// ============================================================================
// DOMAIN 3: MEMORY & CONTEXT
// ============================================================================

// Top-Level: Drop-in ready providers
export {
  MemoryProvider,
  type MemoryProviderProps,
} from './memory/memory-provider'

// Mid-Level: Composable hooks
export {
  useMemoryContext,
  type UseMemoryContextReturn,
} from './memory/memory-provider'

// Low-Level: Primitives
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

// ============================================================================
// DOMAIN 4: STREAMING & TRANSPORT
// ============================================================================

// Top-Level: Abstracted via useClarityChat (transport option)

// Mid-Level: Transport hooks
export * from './hooks/use-streaming-sse'
export * from './hooks/use-streaming-websocket'
export * from './hooks/use-streaming'
export * from './hooks/use-streamable-ui'

// Low-Level: Primitives
export type { StreamChunk } from './adapters/types'
export * from './utils/streaming-helpers'
export * from './utils/streamable-value'

// ============================================================================
// DOMAIN 5: TOOLS & AGENTS
// ============================================================================

// Top-Level: Structured output
export {
  useClarityObject,
  type UseClarityObjectOptions,
  type UseClarityObjectReturn,
} from './hooks/use-clarity-object'

// Top-Level: Drop-in ready agent hook
export {
  useAgent,
  type UseAgentOptions,
  type UseAgentReturn,
} from './hooks/use-agent'

// Mid-Level: Tool integration
export * from './agents/tool-ui-registry'
export {
  createAgent,
  type Agent,
  type Tool,
  type AgentExecution,
} from './agents'

// Low-Level: Primitives
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
export * from './utils/tool-result-helpers'

// ============================================================================
// DOMAIN 6: ENTERPRISE INFRASTRUCTURE
// ============================================================================

// Top-Level: Providers
export * from './analytics'
export * from './observability'
export * from './quotas'
export * from './rbac'
export * from './multi-tenancy'
export * from './audit'
export * from './webhooks'

// Mid-Level: Hooks (exported via providers above)

// Low-Level: Services (exported via providers above)

// ============================================================================
// DOMAIN 7: DEVELOPER EXPERIENCE
// ============================================================================

// Top-Level: Presets and config builders
export {
  createBasicChatConfig,
  createMemoryChatConfig,
  createStreamingChatConfig,
  createEnterpriseChatConfig,
  isValidApiEndpoint,
  getApiEndpoint,
} from './utils/clarity-chat-helpers'

// Mid-Level: Helpers
export {
  createUserMessage,
  createAssistantMessage,
  createSystemMessage,
  createToolResultMessage,
} from './utils/chat-helpers'

// Low-Level: Utilities
export {
  isMemoryEnabled,
  isUserMessage,
  isAssistantMessage,
  hasTextContent,
  extractTextContent,
} from './types/clarity-chat-types'

// ============================================================================
// ADDITIONAL EXPORTS (Backward Compatibility)
// ============================================================================

// Model Adapters
export * from './adapters'

// Prompt Templates
export * from './prompts'
export * from './prompt'

// Document Loaders
export * from './document-loaders'

// AI Safety
export * from './safety'

// Reranking
export * from './reranking'

// Plugin Architecture
export * from './plugins'

// Theme System
export * from './theme'

// Animation System
export * from './animations'

// Accessibility
export * from './accessibility'

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
export * from './components/enterprise'
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

// Chat History with Undo/Redo
export {
  useChatHistory,
  type ChatMessage as ChatHistoryMessage,
  type ChatHistoryOptions,
  type UseChatHistoryReturn,
} from './hooks/use-chat-history'

// Integrations (Sentry, Analytics) - explicitly named to avoid conflicts
export {
  initSentry,
  captureAIError,
  addChatBreadcrumb,
  useSentryChat,
  withSentryErrorBoundary,
  startAITransaction,
  type SentryOptions,
  type SentryScope,
  type SentryBreadcrumb,
} from './integrations/sentry'
export {
  AnalyticsProvider as IntegrationsAnalyticsProvider,
  useAnalytics as useIntegrationsAnalytics,
  useChatAnalytics,
  useWebVitals,
  type PostHogConfig,
  type VercelAnalyticsConfig,
  type AnalyticsProviderProps as IntegrationsAnalyticsProviderProps,
  type AnalyticsContextValue as IntegrationsAnalyticsContextValue,
  type ChatAnalyticsEvent,
  type ChatEventProperties,
} from './integrations/analytics'

// Additional Hooks
export * from './hooks/use-completion'
export * from './hooks/use-assistant'
export * from './hooks/use-auto-scroll'
export * from './hooks/use-clipboard'
export * from './hooks/use-debounce'
export * from './hooks/use-throttle'
export * from './hooks/use-event-listener'
export * from './hooks/use-intersection-observer'
export * from './hooks/use-local-storage'
export * from './hooks/use-indexed-db'
export * from './hooks/use-media-query'
export * from './hooks/use-mounted'
export * from './hooks/use-previous'
export * from './hooks/use-toggle'
export * from './hooks/use-window-size'
export * from './hooks/use-error-recovery'
export * from './hooks/use-token-tracker'
export * from './hooks/use-token-optimization'
export * from './hooks/use-message-operations'
export * from './hooks/use-message-history'
export * from './hooks/use-realistic-typing'
export * from './hooks/use-command-palette-commands'
export * from './hooks/use-optimistic-message'
export * from './hooks/use-performance'
export * from './hooks/use-deferred-search'
export * from './hooks/use-voice-input'
export * from './hooks/use-model-router'
export * from './hooks/use-smart-throttle'
export * from './hooks/use-smart-cache'
export * from './hooks/use-character-counter'
export * from './hooks/use-submit-button-state'
export * from './hooks/use-mobile-keyboard'
export { useDesignTokens } from './hooks/use-design-tokens'
export * from './hooks/use-theme-analytics'
export {
  useBatteryAware,
  withBatteryOptimizations,
  type BatteryStatus,
  type BatteryAwareConfig,
  type OptimizationRecommendations,
} from './hooks/use-battery-aware'

// Additional Utilities
// Note: Specific utils are exported above. Commenting out barrel export to avoid duplicates.
// export * from './utils'

// Additional Types
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
export {
  useClarityChatWithWindow,
  useClarityChatWithAnalytics,
  useClarityChatWithPersistence,
  useClarityChatWithDebounce,
  useClarityChatWithAutoSave,
} from './hooks/use-clarity-chat-helpers'

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
