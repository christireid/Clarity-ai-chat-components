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

export {
  MarkdownRendererEnhanced,
  type MarkdownRendererProps,
} from './components/ai/markdown-renderer-enhanced'

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

// Code blocks
export {
  CodeBlock,
  type CodeBlockProps,
  type CodeFontFamily,
} from './components/code/CodeBlock'

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
export { default as MessageList } from './components/chat/virtualized-message-list'
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

export {
  TokenBudgetProvider,
  useTokenBudget,
  type TokenBudgetContextValue,
  type TokenBudgetProviderProps,
} from './context/token-budget-context'

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
export { cn } from './utils/cn'

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
export { ErrorBoundary } from './components/feedback/error-boundary'
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

// Toast notifications
export {
  useToast,
  ToastProvider,
  ToastContainer,
  type ToastContextValue,
  type ToastProviderProps,
  type ToastType,
  type ToastPosition,
  type Toast,
} from './components/ui/toast'

// Sonner-based toast (alternative, more feature-rich)
export {
  ClarityToaster,
  toast,
  type ClarityToasterProps,
  type ToastOptions,
  type PromiseToastOptions,
} from './components/ui/sonner-toast'

// Keyboard shortcuts
export { useKeyboardShortcuts } from './hooks/keyboard/use-keyboard-shortcuts'

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
export {
  useTokenBudgetMonitor,
  type TokenBudgetConfig,
  type TokenBudgetMonitorReturn,
  type TokenUsage,
  type BudgetMessage,
  type TrimResult,
} from './hooks/token/use-token-budget-monitor'

// Streaming
export { useStreaming } from './hooks/streaming/use-streaming'
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

// Accessibility
export { useReducedMotion } from './animations'
export {
  useFocusTrap,
  useFocusRestoration,
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
// ADDITIONAL COMPONENTS (For Reference Documentation Pages)
// ============================================================================

// Message Components (Core)
export { Message } from './components/message/message'
// Note: MessageList is already exported above as the default export from virtualized-message-list
// The simple MessageList from message/message-list is exported as SimpleMessageList
export { MessageList as SimpleMessageList } from './components/message/message-list'
export { default as VirtualizedMessageList } from './components/chat/virtualized-message-list'

// Tool Components
export { ClarityToolResult } from './components/message/clarity-tool-result'
export { ToolInvocationCard } from './components/message/tool-invocation-card'

// Tool UI Registry
export {
  createToolUIRegistry,
  getToolComponent,
  hasToolComponent,
  validateToolRegistry,
  getRegistryStats,
  type ToolComponentProps,
  type ToolComponentRegistry,
} from './agents/tool-ui-registry'

// Agent Components
export {
  AgentRunFeed,
  type AgentRunFeedProps,
  type AgentRunStep,
  type AgentRunStatus,
} from './components/ai/agent-run-feed'

// Advanced Input Components
export { AdvancedChatInput } from './components/input/advanced-chat-input'

// Command Palette
export { CommandPalette, type CommandItem } from './components/navigation/command-palette'
export {
  CommandPaletteEnhanced,
  type CommandAction,
  type CommandPaletteEnhancedProps,
} from './components/navigation/command-palette-enhanced'

// Drag and Drop
export {
  Draggable,
  DropZone,
  useDragDrop,
  type DraggableProps,
  type DropZoneProps,
  type DragInfo,
  type UseDragDropOptions,
} from './components/ui/draggable'

// Token Optimization
export { TokenOptimizationDashboard } from './components/token/token-optimization-dashboard'
export { TokenOptimizationPanel } from './components/token/token-optimization-panel'
export { TokenOptimizationBadge } from './components/token/token-optimization-badge'
export { TokenBudgetBar } from './components/token/token-budget-bar'
export {
  TokenUsageMeter,
  MODEL_PRICING_PRESETS,
  type TokenUsageMeterProps,
} from './components/token/token-usage-meter'
export type {
  TokenUsage as TokenUsageMeterData,
  ModelPricing as TokenUsageMeterPricing,
} from './components/token/token-usage-meter'
export {
  TokenCostPreview,
  useTokenEstimate,
  type TokenCostPreviewProps,
  type UseTokenEstimateOptions,
  type TokenEstimate as TokenCostEstimate,
} from './components/token/TokenCostPreview'

// File Upload
export { FileUpload } from './components/input/file-upload'

// Model Selector
export { ModelSelector } from './components/ai/model-selector'
export type { ModelInfo } from './adapters/types'
// AIToolCall is the OpenAI-style tool call format used by StreamingMessage
// The internal ToolCall from app-api is for tool execution state management
export type { ToolCall as AIToolCall } from './adapters/types'
// Note: Citation is already exported from './components/ai/citation'

// Streaming Text Renderer
export { StreamingTextRenderer } from './components/message/streaming-text-renderer'

// Structured Input Builder
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
} from './components/input/structured-input-builder'
