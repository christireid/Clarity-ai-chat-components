'use client'

/**
 * @clarity-chat/react/extended - Complete Component Library
 *
 * The comprehensive, well-designed library with all necessary components.
 * Everything you need for a complete AI chat experience, nothing you don't.
 *
 * @example
 * ```tsx
 * import { TokenOptimizationDashboard, CommandPaletteEnhanced } from '@clarity-chat/react/extended'
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// CHAT COMPONENTS
// ============================================================================

export { ClarityChatApp } from './app-api'
export type { ClarityChatAppProps } from './app-api'

export {
  ClarityChat,
  type ClarityChatProps,
} from './components/chat/ClarityChat'

export {
  ClarityChatSimple,
  type ClarityChatSimpleProps,
} from './components/chat/ClarityChatSimple'

export { ChatWindow, type ChatWindowProps } from './components/chat/ChatWindow'
export { ChatInput, type ChatInputProps } from './components/chat/ChatInput'
export {
  MobileChatWindow,
  type MobileChatWindowProps,
} from './components/chat/MobileChatOptimized'

export {
  ChatWithErrorBoundary,
  type ChatWithErrorBoundaryProps,
} from './components/chat/ChatWithErrorBoundary'

// ============================================================================
// MESSAGE COMPONENTS
// ============================================================================

export {
  MessageList,
  type MessageListProps,
} from './components/message/MessageList'
export {
  VirtualizedMessageList,
  type VirtualizedMessageListProps,
} from './components/chat/VirtualizedMessageList'
export {
  StreamingMessage,
  type StreamingMessageProps,
} from './components/message/StreamingMessage'
export {
  MessageThreadView,
  type MessageThreadViewProps,
} from './components/message/MessageThreadView'

// ============================================================================
// INPUT COMPONENTS
// ============================================================================

export {
  AdvancedChatInput,
  type AdvancedChatInputProps,
} from './components/input/AdvancedChatInput'
export { VoiceInput, type VoiceInputProps } from './components/input/VoiceInput'
export { FileUpload, type FileUploadProps } from './components/input/FileUpload'
export {
  MentionSystem,
  type MentionSystemProps,
} from './components/input/MentionSystem'
export {
  StructuredInputBuilder,
  type StructuredInputBuilderProps,
} from './components/input/StructuredInputBuilder'
export {
  OutputPreferenceSelector,
  type OutputPreferenceSelectorProps,
} from './components/input/OutputPreferenceSelector'

// ============================================================================
// RENDERING COMPONENTS
// ============================================================================

export {
  EnhancedMarkdownRenderer as MarkdownRenderer,
  type EnhancedMarkdownRendererProps as MarkdownRendererProps,
} from './components/ai/EnhancedMarkdownRenderer'

// ============================================================================
// STREAMING COMPONENTS
// ============================================================================

export {
  StreamStatusProgress as StreamingProgress,
  type StreamStatusProgressProps as StreamingProgressProps,
} from './components/ai/StreamingProgress'
export {
  StreamingCodeBlock,
  type StreamingCodeBlockProps,
} from './components/code/StreamingCodeBlock'
export {
  StreamingTextRenderer,
  type StreamingTextRendererProps,
} from './components/message/StreamingTextRenderer'

// ============================================================================
// TOKEN OPTIMIZATION COMPONENTS
// ============================================================================

export {
  TokenUsageMeter,
  type TokenUsageMeterProps,
} from './components/token/TokenUsageMeter'
export {
  TokenBudgetBar,
  type TokenBudgetBarProps,
} from './components/token/TokenBudgetBar'
export {
  TokenOptimizationPanel,
  type TokenOptimizationPanelProps,
} from './components/token/TokenOptimizationPanel'
export {
  TokenOptimizationDashboard,
  type TokenOptimizationDashboardProps,
} from './components/token/TokenOptimizationDashboard'
export {
  TokenCostPreview,
  type TokenCostPreviewProps,
} from './components/token/TokenCostPreview'
export {
  TokenCounter,
  type TokenCounterProps,
} from './components/token/TokenCounter'
export {
  TokenOptimizationBadge,
  type TokenOptimizationBadgeProps,
} from './components/token/TokenOptimizationBadge'

// ============================================================================
// MEMORY COMPONENTS
// ============================================================================

export {
  MemoryActivityIndicator,
  type MemoryActivityIndicatorProps,
} from './components/memory/MemoryActivityIndicator'
export {
  MemoryInspector,
  type MemoryInspectorProps,
} from './components/context/MemoryInspector'

// ============================================================================
// NAVIGATION & COMMAND COMPONENTS
// ============================================================================

export {
  CommandPalette,
  type CommandPaletteProps,
} from './components/navigation/CommandPalette'
export {
  CommandPaletteEnhanced,
  type CommandPaletteEnhancedProps,
} from './components/navigation/CommandPaletteEnhanced'

// ============================================================================
// SEARCH COMPONENTS
// ============================================================================

export {
  MessageSearch,
  type MessageSearchProps,
} from './components/search/MessageSearch'
export {
  AdvancedMessageSearch,
  type AdvancedMessageSearchProps,
} from './components/search/AdvancedMessageSearch'
export {
  AdvancedMessageSearchSemantic,
  type AdvancedMessageSearchSemanticProps,
} from './components/search/AdvancedMessageSearchSemantic'
export {
  SemanticMessageSearch,
  type SemanticMessageSearchProps,
} from './components/search/semantic/SemanticMessageSearch'
export {
  SearchFiltersPanel,
  type SearchFiltersPanelProps,
} from './components/search/components/SearchFiltersPanel'
export {
  SearchResultsSummary,
  type SearchResultsSummaryProps,
} from './components/search/components/SearchResultsSummary'
export {
  SavedSearchesPanel,
  type SavedSearchesPanelProps,
} from './components/search/components/SavedSearchesPanel'

// ============================================================================
// PROMPT COMPONENTS
// ============================================================================

export {
  PromptLibrary,
  type PromptLibraryProps,
} from './components/prompt/PromptLibrary'
export {
  TemplateMarketplace,
  type TemplateMarketplaceProps,
} from './components/prompt/TemplateMarketplace'
export {
  PromptVariablesEditor,
  type PromptVariablesEditorProps,
} from './components/prompt/PromptVariablesEditor'

// ============================================================================
// CONVERSATION COMPONENTS
// ============================================================================

export {
  ConversationTimeline,
  type ConversationTimelineProps,
} from './components/conversation/ConversationTimeline'
export {
  ConversationList,
  type ConversationListProps,
} from './components/conversation/ConversationList'

// ============================================================================
// THEME COMPONENTS
// ============================================================================

export {
  ThemeSwitcher,
  type ThemeSwitcherProps,
  useSimpleTheme,
} from './components/theme-components/ThemeSwitcher'
export {
  ThemeSelector,
  type ThemeSelectorProps,
} from './components/theme-components/ThemeSelector'
export {
  ThemeCustomizer,
  type ThemeCustomizerProps,
} from './components/theme-components/ThemeCustomizer'
export {
  ThemePreview,
  type ThemePreviewProps,
} from './components/theme-components/ThemePreview'

// ============================================================================
// HOOKS
// ============================================================================

// Core Chat Hooks
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './hooks/use-clarity-chat'

// Advanced Chat Hooks
export {
  useClarityChatWithTools,
  type UseClarityChatWithToolsOptions,
  type UseClarityChatWithToolsReturn,
} from './hooks/chat/use-clarity-chat-with-tools'

export {
  useClarityObject,
  type UseClarityObjectOptions,
  type UseClarityObjectReturn,
} from './hooks/chat/use-clarity-object'

// Token Management Hooks
export { useTokenBudget } from './prompt/hooks/use-token-budget'
export { usePromptRecipe } from './prompt/hooks/use-prompt-recipe'

// Memory Hooks
export { useMemoryFeedback } from './hooks/memory/use-memory-feedback'

// UI Hooks
export { useReducedMotion } from './hooks/ui/use-reduced-motion'

// ============================================================================
// UTILITIES
// ============================================================================

// Prompt Building
export { buildModelPrompt } from './prompt/core/builder'
export { optimizePrompt } from './prompt/core/engine/prompt-optimizer'

// Tool Execution
export {
  executeWithRetry,
  executeWithFallback,
  executeWithTimeout,
  executeWithLogging,
  executeWithAll,
} from './utils/tool-execution'

// Message Conversion
export {
  convertCoreMessagesToMessages,
  convertMessagesToCoreMessages,
} from './utils/message/message-conversion'

// Memory
export {
  createMemoryStore,
  type CreateMemoryStoreOptions,
  type MemoryStore,
} from './memory/create-memory-store'

// Classname Utility
export { cn } from '@clarity-chat/primitives'

// ============================================================================
// TYPES
// ============================================================================

// Message Types
export type {
  Message,
  MessageRole,
  MessageMetadata,
  StreamMessage,
} from '@clarity-chat/types'

// Prompt Types
export type { PromptRecipe } from './prompt/core/recipe'
export type { TokenBudgetConfig } from './utils/tokenization/token-budget-validator'
