'use client'

/**
 * INTERNAL REFERENCE FILE - NOT A PUBLIC ENTRY POINT
 *
 * This file is used internally for:
 * - Demo/docs site components
 * - Testing utilities
 * - Build verification
 *
 * DO NOT IMPORT FROM THIS FILE DIRECTLY.
 *
 * For the public API, use:
 * - `@clarity-chat/react` (main entry, recommended)
 * - `@clarity-chat/react/core` (minimal bundle)
 * - `@clarity-chat/react/internal` (advanced/internal APIs)
 *
 * @internal
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
export {
  VirtualizedMessageList as MessageList,
  VirtualizedMessageList,
} from './components/chat/virtualized-message-list'
export { ChatLayout } from './components/chat/chat-layout'
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

// Compliance & Audit
export * from './audit'
export * from './webhooks'

// =============================================================================
// DOMAIN 9: DEVELOPER EXPERIENCE
// Configuration helpers and utilities
// =============================================================================

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

// Document Processing
export * from './reranking'

// Theme System
export {
  ThemeProvider,
  useTheme,
  type ThemeContextValue,
  type ThemeProviderProps,
} from './theme'

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

// Context Components
export * from './components/context'

// Code Components
export * from './components/code'

// A/B Testing Components
export * from './components/ab-testing'

// Pro Components
export * from './components/pro'

// Input Components (VoiceInput, etc.)
export * from './components/input'

// Search Components (MessageSearch, etc.)
export * from './components/search'

// Accessibility utilities (useFocusTrap, useFocusRestoration, etc.)
export * from './accessibility'

// Animations - re-export all except useReducedMotion (already exported from accessibility)
export {
  // Constants
  ANIMATION_DURATION,
  DURATION_CSS,
  DURATION_SECONDS,
  TAILWIND_DURATION,
  ANIMATION_EASING,
  EASING_FRAMER,
  TAILWIND_EASING,
  STAGGER_TIMING,
  ANIMATION_DELAY,
  DELAY_CSS,
  DELAY_SECONDS,
  TAILWIND_DELAY,
  INTERACTION_VARIANTS,
  INTERACTION_VARIANTS_REDUCED,
  ANIMATION_TIMINGS,
  UI_FEEDBACK_DELAYS,
  ANIMATION_PRESETS,
  ANIMATION_PRESETS_REDUCED,
  ANIMATION_Z_INDEX,
  CSS_VARS,
  // Utility functions
  generateCSSVars,
  getPreset,
  getInteractionVariant,
  getTransition,
  getTailwindTransition,
  getEasing,
  getCSSEasing,
  getFramerEasing,
  duration,
  delay,
  ease,
  createFadeVariant,
  createSlideVariant,
  createScaleVariant,
  createStaggerContainerVariant,
  createStaggerChildVariant,
  createInteractionVariant,
  createPulseAnimation,
  createShimmerAnimation,
  createSpinnerAnimation,
  createDotsAnimation,
  createBounceAnimation,
  createShakeAnimation,
  createSuccessAnimation,
  createErrorAnimation,
  mergeTransitions,
  getDurationInSeconds,
  getDurationInMs,
  createTweenTransition,
  // Types
  type AnimationDuration,
  type AnimationEasing,
  type AnimationDelay,
  type StaggerTiming,
  type AnimationPreset,
  type InteractionVariant,
  type DurationKey,
  type FramerEasing,
} from './animations'

// Prompt Components and Types
export * from './components/prompt'

// =============================================================================
// HOOKS (All hook domains)
// =============================================================================

// UI Hooks (excluding useReducedMotion which is exported from accessibility)
export * from './hooks/ui/use-auto-scroll'
export * from './hooks/ui/use-clipboard'
export * from './hooks/ui/use-debounce'
export * from './hooks/ui/use-throttle'
export * from './hooks/ui/use-toggle'
export * from './hooks/ui/use-previous'
export * from './hooks/ui/use-mounted'
export * from './hooks/ui/use-is-mounted'
export {
  useMergedRef,
  mergeRefs,
  useMergedRefWithCleanup,
  assignRef,
  type ReactRef,
} from './hooks/ui/use-merged-ref'
export * from './hooks/ui/use-window-size'
export * from './hooks/ui/use-intersection-observer'
export * from './hooks/ui/use-event-listener'
export * from './hooks/ui/use-media-query'
// Note: use-reduced-motion is excluded as it's already exported from accessibility
export {
  useAnimatedValue,
  AnimatedNumber,
  useValueChange,
  FlashingValue,
  type UseAnimatedValueOptions,
  type AnimatedValueResult,
  type AnimatedNumberProps,
  type FlashingValueProps,
} from './hooks/ui/use-animated-value'
export * from './hooks/ui/use-safe-timeout'

// Keyboard Hooks (excluding useKeyboardNavigation which is exported from accessibility)
export {
  KeyboardNavigationProvider,
  useKeyboardShortcut,
  useVimNavigation,
  useFocusScope,
  useKeyboardHintsOnModifier,
  useIsMac,
  formatShortcutDisplay,
  defaultChatShortcuts,
  type KeyboardShortcutConfig,
  type ShortcutConflict,
  type KeyboardNavigationState,
  type KeyboardNavigationProviderProps,
  type UseVimNavigationOptions,
  useKeyboardShortcuts,
  useShortcutDisplay,
  useScopedKeyboardShortcuts,
  useFocusedKeyboardShortcuts,
  KeyboardShortcutsHelp,
  type KeyboardShortcut,
  type KeyboardShortcutsHelpProps,
  type ScopedKeyboardShortcutsOptions,
  useChatKeyboardNavigation,
  useFocusInputShortcut,
  useEscapeToClose,
  useQuickActions,
  type ChatKeyboardNavigationOptions,
  type ChatKeyboardNavigationReturn,
  type QuickAction,
} from './hooks/keyboard'
export * from './hooks/keyboard/use-command-palette'

// Storage Hooks
export * from './hooks/storage'

// Theme Hooks
export * from './hooks/theme'

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

// Security utilities
export { SecurityManager, securityManager } from './utils/security'

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

// Tabs components
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'

// Console Alert Handler
export {
  ConsoleAlertHandler,
  useConsoleAlerts,
  type ConsoleAlert,
  type ConsoleAlertHandlerProps,
} from './components/feedback/console-alert-handler'

// UI Primitives
export * from './components/ui/skeleton'
export * from './components/ui/animated-dots'
export * from './components/ui/animated-list'
export * from './components/ui/toast'
export * from './components/ui/progress'
export * from './components/ui/feedback-animation'
export * from './components/ui/interactive-card'
