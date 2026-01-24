'use client'

/**
 * @clarity-chat/react - Public API (Legacy)
 *
 * This file defines the intentional public API surface for Clarity Chat.
 * Only exports in this file are considered stable and supported.
 *
 * **RECOMMENDED**: For new projects, use the unified App API instead:
 * ```tsx
 * import { ClarityChatApp, useClarityChatApp } from '@clarity-chat/react'
 *
 * // Basic usage - streaming chat in 3 minutes
 * <ClarityChatApp api="/api/chat" />
 *
 * // With memory enabled (one flag)
 * <ClarityChatApp api="/api/chat" features={{ memory: true }} />
 *
 * // Enterprise preset with all features
 * <ClarityChatApp api="/api/chat" preset="enterprise" />
 * ```
 *
 * For internal utilities, import from '@clarity-chat/react/internal' (not recommended).
 *
 * @packageDocumentation
 */

// ============================================================================
// CORE COMPONENTS (The essentials - what 90% of users need)
// ============================================================================

// Primary drop-in component (Legacy - consider using ClarityChatApp from app-api instead)
export { ClarityChat } from './components/chat/clarity-chat'
export type { ClarityChatProps } from './components/chat/clarity-chat'

// Preset configurations
export { ClarityChatPresets } from './components/chat/clarity-chat-presets'

// Recipe components for common patterns
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

// ============================================================================
// CORE HOOKS (Primary state management)
// ============================================================================

// The main hook - covers 80% of use cases
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './hooks/chat/use-clarity-chat'

// Headless hook - for custom implementations (100% logic, 0% magic)
export {
  useChat as useHeadlessChat,
  type UseChatOptions as UseHeadlessChatOptions,
  type UseChatReturn as UseHeadlessChatReturn,
} from './hooks/chat/use-chat-enhanced'

// Structured output hook
export {
  useClarityObject,
  type UseClarityObjectOptions,
  type UseClarityObjectReturn,
} from './hooks/chat/use-clarity-object'

// Tool integration hook
export {
  useClarityChatWithTools,
  type UseClarityChatWithToolsOptions,
  type UseClarityChatWithToolsReturn,
} from './hooks/chat/use-clarity-chat-with-tools'

// Chat synchronization hook - cross-device sync with conflict resolution
export {
  useChatSync,
  type ChatSyncOptions,
  type ChatSyncReturn,
} from './hooks/chat/use-chat-sync'

// ============================================================================
// AI COMPONENTS (Citations, Suggestions, Markdown, etc.)
// ============================================================================
export {
  Citation,
  type CitationProps,
  type CitationSource,
} from './components/ai/citation'

// SourceCitation - Rich source citation display with multiple variants
export {
  SourceCitation,
  useSourceCitation,
  type SourceCitationProps,
  type SourceCitationVariant,
  type SourceCitationSize,
  type SourceCitationSource,
  type Source,
  type UseSourceCitationOptions,
  type UseSourceCitationReturn,
} from './components/ai/source-citation'

// Primary markdown renderer (unified API with LaTeX, Mermaid, syntax highlighting)
export { EnhancedMarkdownRenderer } from './components/ai/enhanced-markdown-renderer'

// Chain of Thought - AI reasoning visualization
export {
  ChainOfThought,
  useChainOfThought,
  type ChainOfThoughtProps,
  type ChainOfThoughtStep,
  type ChainOfThoughtStepStatus,
  type ChainOfThoughtVariant,
  type UseChainOfThoughtOptions,
  type UseChainOfThoughtReturn,
} from './components/ai/chain-of-thought'

// ThinkingBar - AI processing status indicator
export {
  ThinkingBar,
  useThinkingBar,
  type ThinkingBarProps,
  type ThinkingBarStatus,
  type ThinkingBarVariant,
  type UseThinkingBarOptions,
  type UseThinkingBarReturn,
} from './components/ai/thinking-bar'

// StreamStatusProgress - Comprehensive streaming progress visualization
// Note: Different from ui/progress.tsx's simple StreamingProgress (animated dots)
export {
  StreamStatusProgress,
  StreamStatusProgressWithFields,
  type StreamStatusProgressProps,
  type StreamStatusProgressWithFieldsProps,
  type StreamStatusProgressVariant,
  type StreamStatusProgressSize,
  type StreamStatusProgressColor,
  type StreamStatusTokens,
} from './components/ai/streaming-progress'

// TextShimmer - Animated text placeholder loading indicator
export {
  TextShimmer,
  ParagraphShimmer,
  HeadingShimmer,
  CodeShimmer,
  InlineShimmer,
  TextShimmerGroup,
  useTextShimmer,
  type TextShimmerProps,
  type TextShimmerVariant,
  type TextShimmerSpeed,
  type TextShimmerSize,
  type TextShimmerGroupProps,
  type UseTextShimmerOptions,
  type UseTextShimmerReturn,
} from './components/ai/text-shimmer'

// ToolExecutionCard - Tool call execution status display
export {
  ToolExecutionCard,
  useToolExecution,
  type ToolExecutionCardProps,
  type ToolExecution,
  type ToolExecutionStatus,
  type UseToolExecutionOptions,
  type UseToolExecutionReturn,
} from './components/ai/tool-execution-card'

// Tool UI Registry
export { createToolUIRegistry } from './agents/tool-ui-registry'

// Code blocks
export {
  CodeBlock,
  type CodeBlockProps,
  type CodeFontFamily,
} from './components/code/CodeBlock'

export { InlineCode, type InlineCodeProps } from './components/code/InlineCode'

export { StreamingCodeBlock } from './components/code/StreamingCodeBlock'
export { EnhancedCodeBlock } from './components/ai/enhanced-code-block'

// Code block utilities
export {
  parseCodeBlocks,
  hasCodeBlocks,
  extractCodeBlocks,
  parseLineRanges,
  escapeHtml,
  normalizeLanguage,
  detectLanguage,
  getLanguageDisplayName,
  extractLanguageFromClassName,
  countLines,
  truncateCode,
  COMMON_LANGUAGES,
  LANGUAGE_DISPLAY_NAMES,
  type ParsedCodeBlock,
  type CommonLanguage,
} from './components/code/utils'

// Code themes
export {
  CODE_THEMES,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  type CodeThemeName,
  type CodeThemeDefinition,
} from './components/code/themes'

// ============================================================================
// COMPOSABLE UI COMPONENTS (For custom layouts)
// ============================================================================

export { ChatWindow } from './components/chat/chat-window'
export {
  FloatingChatWidget,
  type FloatingChatWidgetProps,
} from './components/chat/floating-chat-widget'
export { ChatInput } from './components/chat/chat-input'
export {
  OfflineChatSync,
  useOfflineChat,
} from './components/chat/offline-chat-sync'
export {
  ChatSyncStatus,
  type ChatSyncStatusProps,
} from './components/chat/chat-sync-status'
export { VirtualizedMessageList as MessageList } from './components/chat/virtualized-message-list'
export {
  TanStackMessageList,
  AutoTanStackMessageList,
  useMessageListScrollControl,
  useJumpToBottom,
  type TanStackMessageListProps,
  type AutoTanStackMessageListProps,
  type UseMessageListScrollOptions,
  type UseMessageListScrollReturn,
  type UseJumpToBottomReturn,
} from './components/chat/tanstack-message-list'
export { StreamingMessage } from './components/message/streaming-message'
export { ThinkingIndicator } from './components/message/thinking-indicator'
export { TypingIndicator } from './components/message/typing-indicator'
export { ClarityToolResult } from './components/message/clarity-tool-result'

// FlowToken Integration (optional - requires 'flowtoken' peer dependency)
export {
  FlowTokenStreamingText,
  FlowTokenMarkdown,
  useFlowToken,
  type FlowTokenAnimation,
  type FlowTokenStreamingTextProps,
  type FlowTokenMarkdownProps,
  type UseFlowTokenReturn,
} from './components/message/flowtoken-adapter'

// Layouts
export { ChatLayout, type ChatLayoutProps } from './components/chat/chat-layout'
export {
  ResizableChatLayout,
  useResizableLayout,
  ResizeHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
  type ResizableChatLayoutProps,
  type ResizeHandleProps,
  type ImperativePanelHandle,
} from './components/chat/resizable-chat-layout'

// ============================================================================
// MEMORY SYSTEM
// ============================================================================

export {
  MemoryProvider,
  useMemoryContext,
  type MemoryProviderProps,
  type UseMemoryContextReturn,
} from './memory/memory-provider'

// ============================================================================
// TOKEN OPTIMIZATION
// ============================================================================

// Core token optimization types from token-optimization package
// Note: TokenEstimate is exported from component below, not from token-optimization
export type {
  TokenUsage,
  ModelPricing,
  TokenBudgetUsage,
} from '@clarity-chat/token-optimization'

export {
  TokenBudgetProvider,
  useTokenBudget,
  type TokenBudgetContextValue,
  type TokenBudgetProviderProps,
} from './context/token-budget-context'

// Token optimization hooks (from @clarity-chat/token-optimization)
export {
  useTokenCount,
  useTieredCache,
  useModelRouter as useTokenModelRouter,
  useOptimizationPipeline,
  useTokenOptimization,
  type ModelId,
  type KnownModelId,
  type TokenModelConfig,
  type PricingProvider,
  type CostCalculation,
  type SemanticCacheConfig,
  type CacheMetadata,
} from '@clarity-chat/token-optimization'

// ============================================================================
// THEME SYSTEM
// ============================================================================

export { ThemeProvider, useTheme, type ThemeProviderProps } from './theme'

// ============================================================================
// LICENSE MANAGEMENT (Re-exported from @clarity-chat/license)
// ============================================================================

export {
  // Core license utilities
  LicenseInfo,
  verifyLicense,
  isLicenseValid,
  // React hooks
  useLicenseStatus,
  useIsLicensed,
  useHasPlan,
  useLicenseInfo,
  // Components
  LicenseProvider,
  LicenseGate,
  Watermark,
  // HOCs
  withLicense,
} from '@clarity-chat/license'

// License types are available from @clarity-chat/license directly
// Consumers should import types as: import type { LicensePlan } from '@clarity-chat/license'

// ============================================================================
// ESSENTIAL TYPES
// ============================================================================

// Message types - MessageContent and MessageRole are generic types that need CoreMessage
export type { MessageContent, MessageRole } from './types/chat-types'

// Core message type from the source
export type { CoreMessage } from './hooks/chat/use-chat-enhanced'

export type {
  // Configuration types
  ClarityChatWithMemoryConfig,
  ClarityChatWithoutMemoryConfig,
  MemoryStrategy,
  TransportType,
} from './types/clarity-chat-types'

// ============================================================================
// UTILITY FUNCTIONS (Commonly needed helpers)
// ============================================================================

// CSS class utility
// Re-export cn from primitives for backward compatibility
export { cn } from '@clarity-chat/primitives'

// Message helpers
export {
  createUserMessage,
  createAssistantMessage,
  createSystemMessage,
} from './utils/message/chat-helpers'

// Type guards
export {
  isUserMessage,
  isAssistantMessage,
  hasTextContent,
  extractTextContent,
} from './types/clarity-chat-types'

// ============================================================================
// INITIALIZATION (For license setup)
// ============================================================================

export { initializeClarity } from './initialization'
export type { InitializeClarityOptions } from './initialization'

// ============================================================================
// ADDITIONAL UI COMPONENTS (For DocsAssistant and similar use cases)
// ============================================================================

// Error and Feedback
export { NetworkStatus } from './components/feedback/network-status'

// Token Management
export { TokenCounter } from './components/token/token-counter'

// Media and Export
export { ExportDialog } from './components/media/export-dialog'

// Search
export {
  MessageSearch,
  MessageSearchWithSuspense,
} from './components/search/message-search'
// SemanticMessageSearch is already exported via 'export * from ./components/search' in internal.ts
export { AdvancedMessageSearch } from './components/search/advanced-message-search'

// Prompts and Suggestions
export { FollowUpSuggestions } from './components/prompt/follow-up-suggestions'
export { PromptSuggestions } from './components/prompt/prompt-suggestions'
export type { PromptSuggestion } from './components/prompt/prompt-suggestions'

// Prompt Container and Suggestion Cards
export {
  PromptContainer,
  useFileAttachments,
} from './components/prompt/prompt-container'
export type {
  PromptContainerProps,
  SuggestionCategory,
  FileAttachment,
} from './components/prompt/prompt-container'

export {
  SuggestionCards,
  useSuggestionCards,
} from './components/prompt/suggestion-cards'
export type {
  SuggestionCardsProps,
  SuggestionCard,
  CategoryFilter,
} from './components/prompt/suggestion-cards'

// Message Components
export { CitationCard } from './components/message/citation-card'

// Input Components
export { VoiceInput } from './components/input/voice-input'

// Empty States
export { EmptyChatState } from './components/ui/empty-state'

// ============================================================================
// ADDITIONAL HOOKS (For DocsAssistant and similar use cases)
// ============================================================================

// Toast notifications (Sonner-based - modern, feature-rich)
export {
  ClarityToaster,
  toast,
  type ClarityToasterProps,
  type ToastOptions,
  type PromiseToastOptions,
} from './components/ui/sonner-toast'

// Keyboard shortcuts
export { useKeyboardShortcuts } from './hooks/keyboard/use-keyboard-shortcuts'

// Quick Start Helpers - Ultra-simple APIs
export {
  chat,
  chatWithMemory,
  enterpriseChat,
  streamingChat,
  ChatBuilder,
  ChatPresets,
} from './utils/quick-start'

// Development Helpers - DX utilities
export {
  validateSetup,
  ConfigPresets,
  createConfig,
  devLog,
  QuickStartTemplates,
  showQuickStart,
  DevPerformanceMonitor,
} from './utils/dev-helpers'

// Setup Wizard - Interactive configuration
export { SetupWizard, QuickSetup, interactiveSetup } from './utils/setup-wizard'

// Lazy Loading - Performance optimizations
export {
  createLazyComponent,
  createLazyComponentWithBoundary,
  preloadComponent,
  loadWhen,
  FeatureFlags,
  loadFeature,
  LazyComponents,
  LazyLoadPerformanceMonitor,
} from './utils/lazy-loading'

// Migration Helpers - Smooth API transitions
// Note: Some migration helpers were planned but not implemented
// MigrationPresets is available from './utils/migration-helpers'

// IntelliSense Helpers - Enhanced TypeScript DX
export type {
  ChatApiConfig,
  ChatPreset,
  MemoryConfigHelper,
  StreamingConfigHelper,
  RateLimitConfigHelper,
  HeaderConfigHelper,
  MessageActionsConfigHelper,
  PromptsConfigHelper,
  ErrorHandlingConfigHelper,
  ChatErrorType,
  ErrorHandlingConfigHelper as ErrorConfigHelper,
} from './types/intellisense-helpers'

// Component Composition - Easy component building
export {
  composeComponents,
  withProps,
  conditional,
  Compositions,
  createGridLayout,
  FlexLayouts,
  composeHooks,
  transformProps,
  withDefaults,
  withVariants,
  createContextProvider,
} from './utils/component-composition'

// Theme Helpers - Re-exported from './theme' (see line 308)
// Note: Additional theme utilities can be added via './utils/theme-helpers' if implemented

// Accessibility Helpers - Enhanced A11y support
// Core accessibility utilities from @clarity-chat/error-handling
export {
  useFocusManagement,
  useScreenReaderAnnounce,
  useHighContrastMode,
  useReducedMotion,
  useColorContrast,
} from '@clarity-chat/error-handling'

// Streaming-specific accessibility utilities
export {
  useDebouncedStreamingAnnouncements,
  useStreamingFocusPreservation,
} from './utils/accessibility-streaming'

// Testing Helpers - Comprehensive testing toolkit
export {
  mockChatAPI,
  MockWebSocket,
  MockLocalStorage,
  createMockFetch,
  renderChatWithDefaults,
  createTestMessages,
  createMockChatState,
  createMockClarityChatHook,
  asyncTestUtils,
  domTestUtils,
  a11yTestUtils,
  performanceTestUtils,
  e2eTestUtils,
  testConfigs,
  TestWrapper,
  createTestComponent,
  testDataFactories,
  chatAssertions,
  vi,
} from './utils/testing-helpers'
export type { Mock } from './utils/testing-helpers'

// Migration Helpers - Easy migration from other libraries
export {
  VercelAdapter,
  OpenAIAdapter,
  ChatbotKitAdapter,
  CustomAdapter,
  MigrationTracker,
  MigrationAnalyzer,
  // MigrationPresets, // Exported from ./utils/migration-helpers.tsx above
  generateMigrationReport,
  migrateQuick,
} from './utils/migration-helpers'

// Command Palette
export { useCommandPalette } from './hooks/keyboard/use-command-palette'
// Note: useCommandPaletteCommands has a broken import path and is excluded

// Clipboard
export { useClipboard } from './hooks/ui/use-clipboard'

// Local storage
export { useLocalStorage } from './hooks/storage/use-local-storage'

// Resilience
export { useRetryWithBackoff } from './hooks/resilience/use-retry-with-backoff'

// Input (voice, etc.)
export { useVoiceInput } from './hooks/input/use-voice-input'

// Throttle utilities
export { useThrottledCallback } from './hooks/ui/use-throttle'

// Token tracking
export { useTokenTracker } from './hooks/token/use-token-tracker'

// Streaming hooks are exported below
export {
  useSmoothedText,
  smoothingPresets,
  type UseSmoothedTextOptions,
  type UseSmoothedTextReturn,
} from './hooks/streaming/use-smoothed-text'

// Stream Status Tracking (inspired by Tambo's useTamboStreamStatus pattern)
export {
  useStreamStatus,
  useSimpleStreamStatus,
  type UseStreamStatusOptions,
  type UseStreamStatusReturn,
  type StreamStatusReturn,
  type StreamingState,
  type FieldStreamStatus,
  type FieldStatus,
  type TokenStats as StreamTokenStats,
  type TimeStats as StreamTimeStats,
} from './hooks/streaming/use-stream-status'

// Accessibility - focus management utilities
export {
  useFocusTrap,
  useFocusRestoration,
  getFocusableElements,
} from './accessibility/focus-management'

// Auto-scroll
export {
  useAutoScroll,
  type UseAutoScrollOptions,
  type UseAutoScrollReturn,
} from './hooks/ui/use-auto-scroll'

// ============================================================================
// ANIMATION UTILITIES (For custom animation implementations)
// ============================================================================

export {
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
} from './animations/utils'

// ============================================================================
// CHAT PRIMITIVES (Headless, composable building blocks)
// ============================================================================

export {
  ChatPrimitive,
  ChatRoot,
  ChatMessages,
  ChatMessage,
  ChatMessageContent,
  ChatMessageActions,
  ChatInput as ChatInputPrimitive,
  ChatCopyButton,
  ChatRegenerateButton,
  ChatDeleteButton,
  ChatEmptyState,
  ChatLoadingIndicator,
  type ChatRootProps,
  type ChatMessagesProps,
  type ChatMessageProps,
  type ChatMessageContentProps,
  type ChatMessageActionsProps,
  type ChatInputProps as ChatInputPrimitiveProps,
  type ChatCopyButtonProps,
  type ChatRegenerateButtonProps,
  type ChatDeleteButtonProps,
  type ChatEmptyStateProps,
  type ChatLoadingIndicatorProps,
} from './primitives/chat'

// ============================================================================
// UNIFIED APP API (Modern, feature-complete)
// ============================================================================

export {
  ClarityChatApp,
  useClarityChatApp,
  type ClarityChatAppProps,
  type UseClarityChatAppReturn,
} from './app-api'

// ============================================================================
// TOKEN OPTIMIZATION COMPONENTS (Advanced Analytics)
// ============================================================================

export { TokenOptimizationPanel } from './components/token/TokenOptimizationPanel'
export { TokenOptimizationBadge } from './components/token/TokenOptimizationBadge'
export { TokenOptimizationDashboard } from './components/token/TokenOptimizationDashboard'
export {
  AdaptiveTokenOptimizer as TokenOptimizer,
  adaptiveOptimizer,
} from './utils/tokenization/adaptive-optimizer'
export {
  TokenCostPreview,
  useTokenEstimate,
  type TokenCostPreviewProps,
  type UseTokenEstimateOptions,
  type TokenEstimate,
} from './components/token/TokenCostPreview'
export {
  TokenUsageMeter,
  MODEL_PRICING_PRESETS,
  // TokenUsage and ModelPricing types are exported above from @clarity-chat/token-optimization
  type TokenUsageMeterProps,
} from './components/token/token-usage-meter'
export {
  TokenBudgetBar,
  TokenBudgetIndicator,
} from './components/token/token-budget-bar'

// ============================================================================
// DASHBOARD & ANALYTICS COMPONENTS
// ============================================================================

export { AnalyticsDashboard } from './components/dashboards/analytics-dashboard'
export { PerformanceDashboard } from './components/dashboards/performance-dashboard'
export { ResponseQualityMeter } from './components/dashboards/response-quality-meter'
export { UsageDashboard } from './components/dashboards/usage-dashboard'
export { ABTestingDashboard } from './components/dashboards/ab-testing-dashboard'
export { ConversationAnalyticsDashboard } from './components/dashboards/conversation-analytics-dashboard'

// ============================================================================
// MESSAGE COMPONENTS (Advanced Features)
// ============================================================================

export { Message } from './components/message/message'
export { MessageMetadata } from './components/message/message-metadata'
export { StreamBlock } from './components/message/stream-block'
export { StreamCancellation } from './components/message/stream-cancellation'
export { StreamingTextRenderer } from './components/message/streaming-text-renderer'
export { MessageList as MessageListComponent } from './components/message/message-list'
export { ToolInvocationCard } from './components/message/tool-invocation-card'
export { MessageOptimized } from './components/message/message-optimized'

// ============================================================================
// CONTEXT & MEMORY COMPONENTS
// ============================================================================

export { ContextManager } from './components/context/context-manager'
export { ContextCard } from './components/context/context-card'
export { ContextVisualizer } from './components/context/context-visualizer'
export { MemoryInspector } from './components/context/memory-inspector'
export { ProjectSidebar } from './components/context/project-sidebar'
export { SettingsPanel } from './components/context/settings-panel'

// ============================================================================
// ADVANCED AI COMPONENTS
// ============================================================================

export { PersonaPanel } from './components/ai/persona-panel'
export { AgentRunFeed } from './components/ai/agent-run-feed'
export { SessionSummaryCard } from './components/ai/session-summary-card'
export { WorkflowSuggestionList } from './components/ai/workflow-suggestion-list'
export { SafetyStatusCard } from './components/ai/safety-status-card'
export { KnowledgeBaseViewer } from './components/ai/knowledge-base-viewer'
export { AuditLogViewer } from './components/ai/audit-log-viewer'
export { PromptLibrary } from './components/prompt/prompt-library'
export { ModelSelector } from './components/ai/model-selector'
export { createAgent } from './agents'

// ============================================================================
// ADVANCED INPUT COMPONENTS
// ============================================================================

export { AdvancedChatInput } from './components/input/advanced-chat-input'
export { FileUpload } from './components/input/file-upload'
export { InlineVoiceInput } from './components/input/voice-input'
export { StructuredInputBuilder } from './components/input/structured-input-builder'
export {
  DocumentIntegration,
  useDocumentIntegration,
} from './components/media/document-integration'

// ============================================================================
// CONVERSATION & NAVIGATION
// ============================================================================

export { ConversationList } from './components/conversation/conversation-list'
export { ConversationTimeline } from './components/conversation/conversation-timeline'
export { ConversationBranchVisualizer } from './components/conversation/conversation-branch-visualizer'
export { ContextMenu } from './components/navigation'
export { CommandPalette } from './components/navigation/command-palette'
export {
  CollaborativeEditor,
  useCollaborativeSession,
} from './components/ai/collaborative-editing'

// ============================================================================
// MEDIA & DOCUMENTS
// ============================================================================

export { DocumentViewer } from './components/media/document-viewer'
export { MultiModalPreview } from './components/media/multi-modal-preview'
export { BatchExportDialog } from './components/media/batch-export-dialog'

// ============================================================================
// FEEDBACK & RETRY COMPONENTS
// ============================================================================

export { RetryButton } from './components/feedback/retry-button'
export {
  ConsoleAlertHandler,
  useConsoleAlerts,
  type ConsoleAlert,
  type ConsoleAlertHandlerProps,
} from './components/feedback/console-alert-handler'

// ============================================================================
// UI PRIMITIVES (Tabs and Layout)
// ============================================================================

export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
export { Progress } from './components/ui/progress'
export { Draggable, DropZone } from './components/ui/draggable'

// ============================================================================
// ADVANCED HOOKS (Additional commonly-used hooks)
// ============================================================================

// Chat hooks (advanced)
export { useAssistant } from './hooks/chat/use-assistant'
export { useCompletion } from './hooks/chat/use-completion'
// Note: useTyping hook was removed - use useRealisticTyping instead
export { useRealisticTyping } from './hooks/input/use-realistic-typing'

// Streaming hooks
export { useStreamingSSE } from './hooks/streaming/use-streaming-sse'
export { useStreamingWebSocket } from './hooks/streaming/use-streaming-websocket'
export { useStreamableUI } from './hooks/streaming/use-streamable-ui'
export { useStreaming } from './hooks/streaming/use-streaming'
export { useStreamingChat } from './hooks/streaming/use-streaming-chat'

// Utility hooks
export { useDebounce } from './hooks/ui/use-debounce'
export { useWindowSize } from './hooks/ui/use-window-size'
export { usePrevious } from './hooks/ui/use-previous'

// Message operations
export { useMessageOperations } from './hooks/message/use-message-operations'

// Token hooks
export { useTokenBudgetMonitor } from './hooks/token/use-token-budget-monitor'

// Storage hooks
export { useIndexedDB } from './hooks/storage/use-indexed-db'

// Performance hooks
export { useSmartCache } from './hooks/performance/use-smart-cache'

// Context hooks
export { useContextMonitor } from './hooks/context/use-context-monitor'

// Keyboard navigation
export { useKeyboardNavigation } from './hooks/keyboard/use-keyboard-navigation'

// Security - see comprehensive exports below (around line 1038)

// Memory & Storage utilities
export { createMemoryStore } from './memory/create-memory-store'

// Engine creators
export { createRAGEngine } from './app-api/rag-engine'
export { createToolsEngine } from './app-api/tools-engine'

// ============================================================================
// AI OPERATIONS COMPONENTS (Prompt Testing & Safety)
// ============================================================================

// AI Operations - Prompt testing and safety review tools
export {
  PromptTestHarness,
  EvaluationDashboard,
  SafetyReviewConsole,
} from './components/ai-ops'

// Enterprise Components
export { SeatInviteDialog } from './components/enterprise/SeatInviteDialog'
export { SSOConfigWizard } from './components/enterprise/SSOConfigWizard'

// ============================================================================
// UTILITIES (Performance & Accessibility Testing)
// ============================================================================

// Performance monitoring (React hooks)
export {
  usePerformanceTracking,
  usePerformanceMonitoring,
  useRenderOptimization,
  use60FPSAnimation,
  withComponentPerformanceTracking,
  createProfilerCallback,
  animationFrame,
  AnimationFrame,
  FPSOptimizer,
  type UsePerformanceTrackingOptions,
  type UsePerformanceMonitoringOptions,
} from './hooks/performance/usePerformanceMonitoring'

// Performance monitoring (utilities - re-exported from @clarity-chat/utils)
export {
  UnifiedPerformanceMonitor as PerformanceMonitor,
  performanceMonitor,
  memoryManager,
  type PerformanceMetrics,
  type FPSMetrics,
  type OperationTiming,
  measurePerformance,
  measurePerformanceAsync,
  getPerformanceMetrics,
  getPerformanceSummary,
  formatPerformanceMetrics,
} from '@clarity-chat/utils'

// Accessibility testing
export {
  testAccessibility,
  assertNoAccessibilityViolations,
  assertWCAG2_1AACompliance,
  checkColorContrast,
  logAccessibilityViolations,
  generateAccessibilityReportHTML,
  useAccessibilityTesting,
  withAccessibilityTesting,
  type AccessibilityViolation,
  type AccessibilityReport,
  type AccessibilityTestOptions,
} from './utils/accessibility-testing'

// Visual regression testing
export {
  VisualRegressionTester,
  STANDARD_VIEWPORTS,
  STANDARD_THEMES,
  createVisualTestParameters,
  configureChromaticStory,
  generateScreenshotName,
  prepareForVisualTesting,
  generateVisualRegressionReportHTML,
  exportVisualTestResults,
  type VisualTestOptions,
  type VisualTestResult,
  type VisualRegressionReport,
} from './utils/visual-regression'

// Security utilities
export {
  sanitizeHTML,
  sanitizeMarkdown,
  sanitizeUserInput,
  detectXSSPatterns,
  generateCSPHeader,
  validateCSPDirectives,
  generateSecurityHeaders,
  auditComponentSecurity,
  createSecureContentWrapper,
  useSecureContent,
  useCSP,
  securityMonitor,
  DEFAULT_SECURITY_CONFIG,
  type SecurityConfig,
  type SanitizationOptions,
  type SecurityHeaders,
  type SecurityAuditResult,
} from './utils/security-helpers'

// Error boundaries
export {
  ContentErrorBoundary,
  InlineContentErrorBoundary,
  MediaErrorBoundary,
  AsyncContentErrorBoundary,
  BaseErrorBoundary,
  ContentErrorFallback,
  InlineErrorFallback,
  EmptyStateErrorFallback,
  ResilientErrorBoundary,
  ReportableErrorBoundary,
  withErrorBoundary,
  useErrorHandler,
  useAsyncErrorHandler,
  errorReporter,
  type ErrorBoundaryProps,
  type ErrorFallbackProps,
  type ErrorReport,
} from './components/ui/error-boundary'

// Analytics and usage tracking
export {
  analyticsManager,
  AnalyticsProvider,
  useAnalytics,
  useAnalyticsContext,
  useRenderPerformance,
  useInteractionTracking,
  useInteractionLatency,
  createEventHandler,
  // measurePerformance removed - use the one from @clarity-chat/utils
  batchAnalyticsEvents,
  type AnalyticsEvent,
  type ComponentUsageEvent,
  type PerformanceEvent,
  type ErrorEvent,
  type UserJourneyEvent,
  type AnalyticsConfig,
  type AnalyticsProviderProps,
} from './utils/analytics'
