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
 * @see DESIGN.md for architecture documentation
 * @see packages/react/src/exports.ts for structured exports by domain
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
export { ClarityChat } from './components/clarity-chat'
export { ClarityChatPresets } from './components/clarity-chat-presets'

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
} from './components/chat-recipes'

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
} from './hooks/use-clarity-chat'

// Structured Output
export {
  useClarityObject,
  type UseClarityObjectOptions,
  type UseClarityObjectReturn,
} from './hooks/use-clarity-object'

// Memory Provider (Top-level)
export {
  MemoryProvider,
  type MemoryProviderProps,
} from './memory/memory-provider'

// ============================================================================
// MID-LEVEL APIs (Composable Building Blocks)
// ============================================================================

// Chat UI Components
export { ChatWindow } from './components/chat-window'
export { ChatInput } from './components/chat-input'
export { AdvancedChatInput } from './components/advanced-chat-input'
export { default as MessageList } from './components/virtualized-message-list'
export { default as VirtualizedMessageList } from './components/virtualized-message-list'
export { StreamingMessage } from './components/streaming-message'
export { ThinkingIndicator } from './components/thinking-indicator'
export {
  TypingIndicator,
  type TypingIndicatorVariant,
} from './components/typing-indicator'

// Chat State Hooks
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

// Memory Hooks
export {
  useMemoryContext,
  type UseMemoryContextReturn,
} from './memory/memory-provider'

// Streaming Hooks
export * from './hooks/use-streaming-sse'
export * from './hooks/use-streaming-websocket'
export * from './hooks/use-streaming'
export * from './hooks/use-streamable-ui'

// Resilience Hooks (AI-Ops)
export {
  useCircuitBreaker,
  CircuitOpenError,
  isCircuitOpenError,
  type UseCircuitBreakerOptions,
  type UseCircuitBreakerReturn,
} from './hooks/use-circuit-breaker'
export {
  useRetryWithBackoff,
  type UseRetryWithBackoffOptions,
  type UseRetryWithBackoffReturn,
} from './hooks/use-retry-with-backoff'
export {
  useRequestDeduplication,
  DebouncedError,
  isDebouncedError,
  createMessageKey,
  type UseRequestDeduplicationOptions,
  type UseRequestDeduplicationReturn,
} from './hooks/use-request-deduplication'

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
} from './utils/message-conversion'

// Unified Chat Hook - Simplified API with sensible defaults
/**
 * useChat - Simplified chat hook with sensible defaults
 *
 * This is the recommended hook for most use cases. It provides:
 * - Automatic message conversion
 * - Optional persistence to localStorage
 * - Auto-scroll support
 * - Full access to underlying useClarityChat via `chat` property
 *
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading, clearMessages } = useChat({
 *   api: '/api/chat',
 *   persistMessages: true,
 * })
 * ```
 */
export {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
} from './hooks/use-chat-unified'

// Legacy Chat Hook (Deprecated - use useChat or useClarityChat instead)
/**
 * @deprecated Use `useChat` or `useClarityChat` instead.
 * This hook is maintained for backward compatibility only and will be removed in v3.0.
 */
export {
  useChat as useChatLegacy,
  type UseChatOptions as UseChatOptionsLegacy,
  type UseChatReturn as UseChatReturnLegacy,
} from './hooks/use-chat'

// Streaming Primitives
export type { StreamChunk } from './adapters/types'
export * from './utils/streaming-helpers'
export * from './utils/streamable-value'

// Message Helpers
export {
  createUserMessage,
  createAssistantMessage,
  createSystemMessage,
  createToolResultMessage,
} from './utils/chat-helpers'

// Configuration Helpers
export {
  createBasicChatConfig,
  createMemoryChatConfig,
  createStreamingChatConfig,
  createEnterpriseChatConfig,
  isValidApiEndpoint,
  getApiEndpoint,
} from './utils/clarity-chat-helpers'

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

// Enhanced Token Optimization Hook
export {
  useTokenOptimizationEnhanced,
  type EnhancedTokenOptimizationOptions,
  type EnhancedOptimizationStats,
  type EnhancedOptimizationResult,
} from './hooks/use-token-optimization-enhanced'

// Token Budget Monitor - Real-time threshold warnings and auto-trimming
export {
  useTokenBudgetMonitor,
  getStatusColor,
  formatTokenUsage,
  createModelBudgetMonitor,
  type TokenBudgetConfig,
  type TokenBudgetMonitorReturn,
  type TokenUsage,
  type TokenUsageStatus,
  type TrimResult,
  type BudgetMessage,
  type BudgetMonitorModel,
} from './hooks/use-token-budget-monitor'

// Token Budget Provider - Context for sharing budget state across components
export {
  TokenBudgetProvider,
  useTokenBudget,
  useTokenBudgetOptional,
  type TokenBudgetContextValue,
  type TokenBudgetProviderProps,
} from './context/token-budget-context'

// KV Cache-Aligned Prompt Builder - Optimizes prompt structure for cache reuse
export {
  buildKVCacheOptimizedPrompt,
  createSegment,
  createSystemSegment,
  createContextSegment,
  createRAGSegment,
  createHistorySegment,
  createUserSegment,
  conversationToSegments,
  validateSegments,
  estimateKVCacheSavings,
  PromptBudgetExceededError,
  type SegmentPriority,
  type SegmentType,
  type PromptSegment,
  type KVCachePromptConfig,
  type FormattedMessage,
  type TrimmedSegmentInfo,
  type BuiltPrompt,
} from './utils/kv-cache-prompt-builder'

// Dynamic Output Token Calculator - Intelligent max_tokens based on context
export {
  calculateDynamicOutputLimit,
  injectBrevityInstruction,
  getPreferenceConfig,
  getTaskTypeConfig,
  detectTaskType,
  createModelOutputConfig,
  getMaxTokens,
  type OutputPreference,
  type TaskType,
  type OutputLimitConfig,
  type OutputLimitResult,
} from './utils/dynamic-output-limit'

// Persistent Semantic Cache - IndexedDB-backed cache with similarity matching
export {
  PersistentSemanticCache,
  createPersistentSemanticCache,
  usePersistentSemanticCacheConfig,
  type SemanticCacheConfig,
  type CachedResponse,
  type SemanticCacheStats,
  type CacheCheckResult,
} from './utils/semantic-cache-persistent'

// Original Token Optimization Hook
export {
  useTokenOptimization,
  type UseTokenOptimizationOptions,
  type UseTokenOptimizationReturn,
  type TokenOptimizationStats,
} from './hooks/use-token-optimization'

// TOON (Token-Oriented Object Notation) - 30-60% savings
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

// Accurate Tokenization
export {
  countTokens,
  countConversationTokens,
  truncateToTokenBudget,
  chunkByTokens,
  getTokenizerStats,
  clearTokenCache,
  type TokenCount,
  type ModelName,
  type TokenizerOptions,
} from './utils/tokenization'

// Model Pricing & Cost Calculation
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

// Prompt Caching - 50-90% savings
export {
  PromptCacheManager,
  createAnthropicCachedMessages,
  estimateCacheSavings,
  type CacheProvider,
  type CacheableContent,
  type CacheStats,
  type PromptCacheOptions,
} from './utils/prompt-caching'

// Prompt Compression - 20-35% savings
export {
  compressPrompt,
  aggressiveCompress,
  conservativeCompress,
  balancedCompress,
  compressConversation,
  type CompressionOptions,
  type CompressionResult,
} from './utils/prompt-compression'

// Smart Caching with Semantic Similarity
export {
  SmartCache,
  SimpleCache,
  type CacheEntry,
  type CacheOptions as SmartCacheOptions,
  type CacheStats as SmartCacheStats,
} from './utils/smart-cache'

// ============================================================================
// ENTERPRISE INFRASTRUCTURE (Top-level Providers)
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

// ✨ ENHANCED (2025): Comprehensive Security System
export * from './security'
export {
  useSecurity,
  useSecurityMonitor,
  useSecureInput,
  useSecureChat,
  useSecurityEvents,
  useSecurityStats,
  useRateLimitStatus,
} from './hooks/use-security'

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

// ============================================================================
// COMPONENTS (Additional UI Components)
// ============================================================================

// Core Message Components
export { Message } from './components/message'
export { MessageMetadata } from './components/message-metadata'
export { MessageOptimized } from './components/message-optimized'
export { TimeSeparator } from './components/time-separator'
export { StreamBlock } from './components/stream-block'
export { ToolInvocationCard } from './components/tool-invocation-card'
export { ClarityToolResult } from './components/clarity-tool-result'
export { CitationCard } from './components/citation-card'
export { CopyButton } from './components/copy-button'
export { FileUpload } from './components/file-upload'

// ✨ ENHANCED (2025): Secure Message Actions with Security Indicators
export {
  MessageActionsSecure,
  type SecurityInfo,
  type MessageActionsSecureProps,
} from './components/message/message-actions-secure'

// Feature Components
export { ModelSelector } from './components/model-selector'
export { ContextCard } from './components/context-card'
export { ContextManager } from './components/context-manager'
export { ProjectSidebar } from './components/project-sidebar'
export { SettingsPanel } from './components/settings-panel'
export { UsageDashboard } from './components/usage-dashboard'
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
} from './components/link-preview'
export {
  KeyboardHint,
  type KeyboardHintShortcut,
} from './components/keyboard-hint'
export { ThemeSwitcher, type Theme } from './components/theme-switcher'
export { KnowledgeBaseViewer } from './components/knowledge-base-viewer'
export { ExportDialog } from './components/export-dialog'
export { BatchExportDialog } from './components/batch-export-dialog'
export { StreamCancellation } from './components/stream-cancellation'
export {
  MessageSearch,
  MessageSearchWithSuspense,
} from './components/message-search'
export { AdvancedMessageSearch } from './components/advanced-message-search'
export { FollowUpSuggestions } from './components/follow-up-suggestions'
export { PromptSuggestions } from './components/prompt-suggestions'
export { PromptLibrary } from './components/prompt-library'
export {
  PromptSuggestionsEnhanced,
  usePromptSuggestionsEnhanced,
} from './components/prompt-suggestions-enhanced'
export { ConversationSummarizer } from './components/conversation-summarizer'
export { BatteryIndicator } from './components/battery-indicator'
export { PerformanceAnalyticsDashboard } from './components/performance-analytics-dashboard'
export { PerformanceDashboard } from './components/performance-dashboard'
export { SemanticMessageSearch } from './components/advanced-message-search-semantic'
export { ConversationAnalyticsDashboard } from './components/conversation-analytics-dashboard'
export { MessageThreadView, ThreadList } from './components/message-thread-view'
export {
  MentionInput,
  MentionList,
  useMentions,
} from './components/mention-system'
export {
  ConversationSharing,
  ShareAnalyticsDashboard,
  useConversationSharing,
} from './components/conversation-sharing'
export {
  CollaborativeEditor,
  CollaborativeMessageList,
  PresenceIndicator,
  useCollaborativeSession,
} from './components/collaborative-editing'
// Document Integration
export {
  DocumentIntegration,
  useDocumentIntegration,
  type DocumentPlatform,
  type DocumentMetadata,
  type DocumentContent,
  type DocumentExportOptions,
  type DocumentChunk,
} from './components/document-integration'

// Calendar Integration
export {
  CalendarIntegration,
  useCalendarIntegration,
  useAvailabilityCheck,
  type CalendarEvent,
  type ActionItem,
  type AvailabilitySlot,
  type EventAttendee,
  type EventReminder,
  type RecurrenceRule,
} from './components/calendar-integration'

// Email Integration
export {
  EmailIntegration,
  useEmailIntegration,
  type EmailProvider,
  type EmailAccount,
  type EmailThread,
  type EmailMessage,
  type EmailNotification,
  type EmailTemplate,
  type DigestConfig,
  type EmailParticipant,
  type EmailAttachment,
} from './components/email-integration'
export {
  UserInteractionAnalytics,
  useInteractionTracking,
} from './components/user-interaction-analytics'
export {
  ABTestingDashboard,
  useABTesting,
} from './components/ab-testing-dashboard'

// A/B Testing Sub-Components (modular building blocks)
export {
  ExperimentCard,
  ExperimentList,
  VariantCard,
  WinnerBanner,
  useStatisticalSignificance,
  normalCDF,
  type ExperimentCardProps,
  type ExperimentListProps,
  type VariantCardProps,
  type WinnerBannerProps,
  type SignificanceResult,
} from './components/ab-testing'

export {
  MobileOptimizedMessage,
  MobileChatWindow,
  TouchFriendlyButton,
  useMobileOptimization,
} from './components/mobile-chat-optimized'
export { OfflineChatSync, useOfflineChat } from './components/offline-chat-sync'
export { EnhancedMarkdownRenderer } from './components/enhanced-markdown-renderer'
export { EnhancedCodeBlock } from './components/enhanced-code-block'

// World-Class Code Display Components
export {
  // Main Components
  CodeBlock,
  StreamingCodeBlock,
  InlineCode,
  // Sub-components
  LineNumbers,
  CodeBlockHeader,
  CodeBlockCopyButton,
  // Themes
  CODE_THEMES,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  getDarkThemes,
  getLightThemes,
  getThemeDefinition,
  isValidTheme,
  // Utilities
  parseLineRanges,
  normalizeLanguage,
  detectLanguage,
  getLanguageDisplayName,
  COMMON_LANGUAGES,
  LANGUAGE_DISPLAY_NAMES,
  // Types
  type CodeBlockProps,
  type StreamingCodeBlockProps,
  type InlineCodeProps,
  type LineNumbersProps,
  type CodeBlockHeaderProps,
  type CodeBlockCopyButtonProps,
  type CodeThemeDefinition,
  type CodeThemeName,
  type CodeFontFamily,
  type CommonLanguage,
} from './components/code'

export { StreamingTextRenderer } from './components/streaming-text-renderer'
export { PersonaPanel } from './components/persona-panel'
export { ConversationTimeline } from './components/conversation-timeline'
export { MemoryInspector } from './components/memory-inspector'
export { SafetyStatusCard } from './components/safety-status-card'
export { AuditLogViewer } from './components/audit-log-viewer'
export { DocumentViewer } from './components/document-viewer'
export { ResponseQualityMeter } from './components/response-quality-meter'
export { MultiModalPreview } from './components/multi-modal-preview'
export { AgentRunFeed } from './components/agent-run-feed'
export { SessionSummaryCard } from './components/session-summary-card'
export { WorkflowSuggestionList } from './components/workflow-suggestion-list'
// Note: AIOps and Enterprise components are exported individually via their respective directories
export { AnalyticsDashboard } from './components/analytics-dashboard'

// AIOps Components
export * from './components/ai-ops'

// Enterprise Components
export * from './components/enterprise'

// Error Handling Components
export { ErrorBoundary } from './components/error-boundary'
export * from './components/error-boundary-enhanced'
export { RetryButton, type RetryErrorType } from './components/retry-button'
export {
  ErrorMessage,
  type ErrorDetails,
  type ErrorSeverity,
} from './components/error-message'
export { NetworkStatus } from './components/network-status'

// Error Reporting System
export * from './error'

// Token Management Components
export { TokenCounter } from './components/token-counter'
export {
  TokenUsageMeter,
  MODEL_PRICING_PRESETS,
  type TokenUsage as TokenUsageMeterData,
  type ModelPricing as TokenUsageMeterPricing,
  type TokenUsageMeterProps,
} from './components/token-usage-meter'
export { TokenOptimizationPanel } from './components/token-optimization-panel'
export { TokenOptimizationBadge } from './components/token-optimization-badge'
export { TokenOptimizationDashboard } from './components/token-optimization-dashboard'

// Token Cost Preview - Real-time cost estimation display
export {
  TokenCostPreview,
  useTokenEstimate,
  type TokenCostPreviewProps,
  type UseTokenEstimateOptions,
  type TokenEstimate,
} from './components/TokenCostPreview'

// Dashboard Utilities
export {
  DashboardErrorBoundary,
  useDashboardErrorHandler,
  type DashboardErrorBoundaryProps,
} from './components/dashboard-error-boundary'
export {
  DashboardProgress,
  CircularProgress,
  type DashboardProgressProps,
  type CircularProgressProps,
} from './components/dashboard-progress'
export {
  AnalyticsDashboardSkeleton,
  UsageDashboardSkeleton,
  TokenOptimizationDashboardSkeleton,
  PerformanceDashboardSkeleton,
  DashboardEmptyState,
  MetricCardSkeleton,
  ProgressWidgetSkeleton,
  ListItemSkeleton,
  ChartSkeleton,
  DashboardStateTransition,
  useLoadingAnnouncement,
  LoadingAnnouncer,
  type DashboardSkeletonProps,
  type DashboardEmptyStateProps,
  type DashboardStateTransitionProps,
  type LoadingAnnouncerProps,
} from './components/dashboard-skeleton'

// Dashboard Data Fetching
export {
  useDashboardData,
  useSimpleDashboardData,
  type DashboardDataState,
  type DashboardDataActions,
  type UseDashboardDataOptions,
} from './hooks/use-dashboard-data'

// Dashboard Composer (Multi-source Data)
export {
  useDashboardComposer,
  createDataSource,
  type DataSourceConfig,
  type DataSourceState,
  type DashboardComposerState,
  type DashboardComposerActions,
  type UseDashboardComposerOptions,
} from './hooks/use-dashboard-composer'

// Dashboard Performance Monitoring
export {
  useDashboardPerformance,
  DashboardPerformanceProvider,
  usePerformanceContext,
  type DashboardPerformanceMetrics,
  type UseDashboardPerformanceOptions,
  type UseDashboardPerformanceReturn,
  type PerformanceContextValue,
} from './hooks/use-dashboard-performance.js'

// Keyboard Shortcuts
export {
  useKeyboardShortcuts,
  useShortcutDisplay,
  useScopedKeyboardShortcuts,
  useFocusedKeyboardShortcuts,
  KeyboardShortcutsHelp,
  type KeyboardShortcut,
  type KeyboardShortcutsHelpProps,
  type ScopedKeyboardShortcutsOptions,
} from './hooks/use-keyboard-shortcuts'
export {
  KeyboardShortcutHint,
  useKeyboardShortcutHint,
  InlineShortcutHint,
  type KeyboardShortcutHintProps,
  type InlineShortcutHintProps,
} from './components/keyboard-shortcut-hint'

// ============================================================================
// ENHANCED KEYBOARD NAVIGATION (2025)
// ============================================================================

// Enhanced Keyboard Navigation System
export {
  // Provider
  KeyboardNavigationProvider,
  // Core Hooks
  useKeyboardNavigation,
  useKeyboardShortcut,
  useVimNavigation,
  useFocusScope,
  useKeyboardHintsOnModifier,
  // Utilities
  formatShortcutDisplay,
  // Default Shortcuts
  defaultChatShortcuts,
  // Types
  type KeyboardShortcutConfig,
  type ShortcutConflict,
  type KeyboardNavigationState,
  type KeyboardNavigationProviderProps,
  type UseVimNavigationOptions,
} from './hooks/use-keyboard-navigation'

// Chat-Specific Keyboard Navigation
export {
  useChatKeyboardNavigation,
  useFocusInputShortcut,
  useEscapeToClose,
  useQuickActions,
  type ChatKeyboardNavigationOptions,
  type ChatKeyboardNavigationReturn,
  type QuickAction,
} from './hooks/use-chat-keyboard-navigation'

// Skip Links & Landmarks
export {
  SkipLinks,
  Landmark,
  useSkipLinkTarget,
  type SkipLink,
  type SkipLinksProps,
  type LandmarkProps,
} from './components/skip-links'

// Focus Indicator
export {
  FocusIndicator,
  FocusRing,
  FocusVisible,
  useKeyboardNavigating,
  type FocusIndicatorProps,
  type FocusRingProps,
  type FocusVisibleProps,
} from './components/focus-indicator'

// Keyboard Shortcuts Modal
export {
  KeyboardShortcutsModal,
  type ShortcutItem,
  type KeyboardShortcutsModalProps,
} from './components/keyboard-shortcuts-modal'

// Keyboard Hints Overlay
export {
  KeyboardHintsOverlay,
  ContextualKeyboardHints,
  WithShortcut,
  useKeyboardHintsOverlay,
  type KeyboardHint,
  type KeyboardHintsOverlayProps,
  type ContextualKeyboardHintsProps,
  type WithShortcutProps,
} from './components/keyboard-hints-overlay'

// Enhanced Command Palette
export {
  CommandPaletteEnhanced,
  type CommandAction,
  type CommandPaletteEnhancedProps,
} from './components/command-palette-enhanced'

// Keyboard Navigation Demo
export { KeyboardNavigationDemo } from './components/keyboard-navigation-demo'

// Animated Values (Real-time Update Animations)
export {
  useAnimatedValue,
  AnimatedNumber,
  useValueChange,
  FlashingValue,
  type UseAnimatedValueOptions,
  type AnimatedValueResult,
  type AnimatedNumberProps,
  type FlashingValueProps,
} from './hooks/use-animated-value'

export {
  HistoryManager,
  HistoryMessageRow,
  TokenUsageBar,
  HistoryToolbar,
  type HistoryMessage,
  type HistoryManagerProps,
} from './components/history-manager'
export {
  OutputPreferenceSelector,
  UncontrolledOutputPreferenceSelector,
  useOutputPreference,
  type OutputPreferenceValue,
  type OutputPreferenceSelectorProps,
  type UncontrolledOutputPreferenceSelectorProps,
  type UncontrolledOutputPreferenceSelectorRef,
} from './components/output-preference-selector'
export {
  StructuredInputBuilder,
  useStructuredInput,
  PRESET_FIELDS,
  type StructuredInputField,
  type StructuredInputResult,
  type StructuredInputBuilderProps,
  type FieldPriority,
  type FieldSection,
  type FieldType,
  type SelectOption,
  type TokenBreakdown,
} from './components/structured-input-builder'

// Context & Conversation Management
export { ContextVisualizer } from './components/context-visualizer'
export { ConversationList } from './components/conversation-list'
export { ConversationBranchVisualizer } from './components/conversation-branch-visualizer'

// Markdown & Rendering
export { MarkdownRendererEnhanced } from './components/markdown-renderer-enhanced'

// UI Primitives
export * from './components/skeleton'
export * from './components/animated-list'
export * from './components/toast'
export * from './components/progress'
export * from './components/feedback-animation'
export * from './components/interactive-card'

// Interactive Components
export { CommandPalette, type CommandItem } from './components/command-palette'
export { ContextMenu } from './components/context-menu'
export { Draggable, DropZone } from './components/draggable'
export { VoiceInput, InlineVoiceInput } from './components/voice-input'

// Empty States
export {
  EmptyState,
  EmptyChatState,
  NoSearchResultsState,
  NoConversationsState,
  ErrorState,
  SuccessState,
} from './components/empty-state'

// Theme Components
export { ThemePreview } from './components/theme-preview'
export {
  ThemeSelector,
  ThemeSelectorDropdown,
} from './components/theme-selector'
export {
  ThemeContrastChecker,
  type ThemeContrastCheckerProps,
} from './components/theme-contrast-checker'
export {
  ThemePreviewThumbnail,
  ThemePreviewGrid,
  type ThemePreviewThumbnailProps,
  type ThemePreviewGridProps,
} from './components/theme-preview-thumbnail'

// ============================================================================
// ADDITIONAL HOOKS (Utility & Feature Hooks)
// ============================================================================

export * from './hooks/use-completion'
export * from './hooks/use-assistant'
export * from './hooks/use-auto-scroll'
export * from './hooks/use-safe-timeout'
export * from './hooks/use-clipboard'
export * from './hooks/use-debounce'
export * from './hooks/use-throttle'
export * from './hooks/use-event-listener'
export * from './hooks/use-intersection-observer'
export * from './hooks/use-local-storage'
export * from './hooks/use-indexed-db'
export * from './hooks/use-media-query'
export * from './hooks/use-reduced-motion'
export * from './hooks/use-theme-shortcuts'
export * from './hooks/use-theme-colors'
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
export * from './hooks/use-command-palette'
export * from './hooks/use-optimistic-message'
export * from './hooks/use-performance'
export * from './hooks/use-battery-aware'
export * from './hooks/use-deferred-search'
export * from './hooks/use-voice-input'
export * from './hooks/use-model-router'
export * from './hooks/use-smart-throttle'
export * from './hooks/use-smart-cache'
// Note: use-context-monitor has formatTokenCount and getUtilizationColor which conflict with ./prompt exports
// Export specific items to avoid conflicts
export {
  useContextMonitor,
  createContextMonitorIntegration,
  type ContextBreakdown,
  type ContextEfficiency,
  type ContextUtilization,
  type WarningLevel,
  type WarningType,
  type ContextWarning,
  type OptimizationRecommendation,
  type ContextMessage as ContextMonitorMessage,
  type UseContextMonitorOptions,
} from './hooks/use-context-monitor'
// Re-export context-monitor specific utilities with different names to avoid conflicts
export {
  getUtilizationColor as getContextUtilizationColor,
  formatTokenCount as formatContextTokenCount,
} from './hooks/use-context-monitor'
export * from './hooks/use-character-counter'
export * from './hooks/use-submit-button-state'
export * from './hooks/use-mobile-keyboard'
// React 19 Ref Utilities
export {
  useMergedRef,
  mergeRefs,
  useMergedRefWithCleanup,
  assignRef,
  type ReactRef,
} from './hooks/use-merged-ref'
// Note: DesignTokens type is exported from './theme', only export the hook here
export { useDesignTokens } from './hooks/use-design-tokens'

// ============================================================================
// TEMPLATES (Pre-built Chat Templates)
// ============================================================================

export * from './templates'

// Helper hooks (internal - use top-level APIs instead)
// These are implementation details and should not be used directly.
// Use `useClarityChat` or `ClarityChat` component instead.
// @internal
// export {
//   useClarityChatWithWindow,
//   useClarityChatWithAnalytics,
//   useClarityChatWithPersistence,
//   useClarityChatWithDebounce,
//   useClarityChatWithAutoSave,
// } from './hooks/use-clarity-chat-helpers'

// ============================================================================
// UTILITIES & TYPES
// ============================================================================

// Selective utils exports to avoid conflicts with adapters (ModelConfig)
export { cn } from './utils/cn'
// compressPrompt is already exported above
export * from './utils/mobile'
export * from './utils/rate-limiting'
export * from './utils/hybrid-search'
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
// Note: getLatestToolResult is already exported from './utils', export other helpers explicitly
export {
  groupToolResultsByToolName,
  groupToolResultsByMessage,
  getToolResultsForTool,
  hasToolBeenCalled,
  getUniqueToolNames,
  countToolCallsByTool,
  filterToolResultsByMessage,
  hasToolError,
  getToolError,
} from './utils/tool-result-helpers'

// ============================================================================
// LICENSE MANAGEMENT
// ============================================================================

// License exports for convenience (re-exported from @clarity-chat/license)
export {
  // Core
  LicenseInfo,
  verifyLicense,
  isLicenseValid,
  // Hooks
  useLicenseStatus,
  useIsLicensed,
  useHasPlan,
  useLicenseInfo,
  useLicenseWarning,
  useIsHydrated,
  // Context
  LicenseProvider,
  useLicenseContext,
  useLicenseContextOptional,
  // Components
  Watermark,
  WatermarkOverlay,
  LicenseGate,
  // HOCs
  withLicense,
  withLicenseStatus,
  createLicenseWrapper,
  // Utilities
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

// Pro Component Utilities
export { createProComponent, createEnterpriseComponent } from './components/pro'

// ============================================================================
// TESTING UTILITIES
// ============================================================================
// Testing utilities are available via a separate subpath export:
// import { renderWithProviders, createDeferred, captureRejection } from '@clarity-chat/react/test-utils'
//
// This keeps the main bundle lean while making test helpers available for consumers.
