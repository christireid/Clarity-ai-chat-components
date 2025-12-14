/**
 * Clarity Chat - Main Entry Point
 *
 * Organized by domain with clear layering:
 * - Top-level: Drop-in ready APIs
 * - Mid-level: Composable building blocks
 * - Low-level: Primitives and utilities
 *
 * All exports maintain backward compatibility.
 */

// ============================================================================
// DOMAIN EXPORTS (Organized by Domain)
// ============================================================================

// Chat UI Domain (most common)
export * from './exports/chat-ui'

// Memory & Context Domain
export * from './exports/memory-context'

// AI Infrastructure Domain
export * from './exports/ai-infrastructure'

// Enterprise Platform Domain
export * from './exports/enterprise-platform'

// Analytics & Observability Domain
export * from './exports/analytics-observability'

// Developer Experience Domain
export * from './exports/developer-experience'

// ============================================================================
// CROSS-DOMAIN / SHARED EXPORTS
// ============================================================================

// UI Primitives (used across domains)
export * from './components/message-metadata'
export * from './components/model-selector'
export * from './components/streaming-message'
export * from './components/stream-block'
export * from './components/tool-invocation-card'
export * from './components/clarity-tool-result'
export * from './components/citation-card'
export * from './components/thinking-indicator'
export * from './components/copy-button'
export * from './components/file-upload'
export * from './components/context-card'
export * from './components/context-manager'
export * from './components/project-sidebar'
export * from './components/prompt-library'
export * from './components/settings-panel'
export * from './components/usage-dashboard'
export * from './components/link-preview'
export * from './components/knowledge-base-viewer'
export * from './components/export-dialog'
export * from './components/batch-export-dialog'
export * from './components/stream-cancellation'
export * from './components/message-search'
export * from './components/advanced-message-search'
export * from './components/follow-up-suggestions'
export * from './components/prompt-suggestions'
export * from './components/enhanced-markdown-renderer'
export * from './components/enhanced-code-block'
export * from './components/streaming-text-renderer'
export * from './components/persona-panel'
export * from './components/conversation-timeline'
export * from './components/memory-inspector'
export * from './components/safety-status-card'
export * from './components/audit-log-viewer'
export * from './components/document-viewer'
export * from './components/response-quality-meter'
export * from './components/multi-modal-preview'
export * from './components/agent-run-feed'
export * from './components/session-summary-card'
export * from './components/workflow-suggestion-list'
export * from './components/ai-ops'
export * from './components/enterprise'
export * from './components/analytics-dashboard'
export * from './components/error-boundary'
export * from './components/retry-button'
export * from './components/network-status'
export * from './components/token-counter'
export * from './components/token-optimization-panel'
export * from './components/token-optimization-badge'
export * from './components/context-visualizer'
export * from './components/conversation-list'
export * from './components/conversation-branch-visualizer'
export * from './components/markdown-renderer-enhanced'
export * from './components/skeleton'
export * from './components/animated-list'
export * from './components/toast'
export * from './components/progress'
export {
  FeedbackAnimation as FeedbackAnimationOverlay,
  type FeedbackAnimationProps,
  type FeedbackType,
  SuccessCheckmark,
  ErrorShake,
  PulseAttention,
  RippleEffect,
  ConfettiEffect,
  GlowEffect,
  BounceIn,
  SlideNotification,
} from './components/feedback-animation'
export * from './components/interactive-card'
export * from './components/message-optimized'
export * from './components/error-boundary-enhanced'
export * from './components/empty-state'
export * from './components/icons'
export * from './components/theme-selector'
export * from './components/theme-preview'
export * from './components/performance-dashboard'
export * from './components/voice-input'
export * from './components/command-palette'
export * from './components/keyboard-hint'
export * from './components/draggable'
export * from './components/context-menu'
export * from './components/theme-switcher'
export * from './components/token-optimization-dashboard'

// Utility Hooks (used across domains)
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
export * from './hooks/use-deferred-search'
export * from './hooks/use-voice-input'
export * from './hooks/use-mobile-keyboard'
export * from './hooks/use-smart-cache'
export * from './hooks/use-model-router'
export * from './hooks/use-smart-throttle'

// Utilities (selective exports to avoid conflicts with domain exports)
// Note: Most utilities are available via domain exports
export { cn } from './utils/cn'
export { compressPrompt } from './utils/prompt-compression'
export * from './utils/mobile'
export * from './utils/rate-limiting'
export * from './utils/hybrid-search'

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

export {
  isMemoryEnabled,
  isUserMessage,
  isAssistantMessage,
  hasTextContent,
  extractTextContent,
  createUserMessage,
  createAssistantMessage,
  createSystemMessage,
} from './types/clarity-chat-types'

// Tool result types
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

export {
  groupToolResultsByToolName,
  groupToolResultsByMessage,
  getLatestToolResult,
  getToolResultsForTool,
  hasToolBeenCalled,
  getUniqueToolNames,
  countToolCallsByTool,
  filterToolResultsByMessage,
  hasToolError,
  getToolError,
  parseToolArguments,
  formatToolCall,
  getToolResultSummary,
} from './utils/tool-result-helpers'

// Testing utilities
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

// Object hook
export {
  useClarityObject,
  type UseClarityObjectOptions,
  type UseClarityObjectReturn,
} from './hooks/use-clarity-object'

// Theme System
export * from './theme'

// Animation System
export * from './animations'

// Accessibility System
export * from './accessibility'

// AI Provider (selective exports to avoid conflicts with Suggestion from developer-experience)
export {
  AIProvider,
  useAI,
  useSuggestions,
  useModeration,
  useSentimentAnalysis,
  useAutoComplete,
  createQuickReplyProvider,
  createCommandProvider,
  createCompletionProvider,
  createContextAwareProvider,
  createProfanityFilter,
  createPIIDetector,
  createSimpleSentimentAnalyzer,
  combineModerationProviders,
  type AIConfig,
  type SuggestionType,
  type SuggestionContext,
  type SuggestionProvider,
  type ModerationResult,
  type ModerationContext,
  type ModerationProvider,
  type SentimentResult,
  type SentimentAnalyzer,
  // Note: Suggestion type is intentionally omitted to avoid conflict with templates
} from './ai'
