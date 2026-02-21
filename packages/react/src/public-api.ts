'use client'

/**
 * @clarity-chat/react - Core Package (Essential Components)
 *
 * The essential, easy-to-understand library for 90% of use cases.
 * Simple by default, comprehensive when needed.
 *
 * **Core Package** (you're here - essential 15 exports):
 * ```tsx
 * import { ClarityChatApp, useClarityChat } from '@clarity-chat/react'
 *
 * // Streaming chat in 3 minutes
 * export default function ChatPage() {
 *   return <ClarityChatApp api="/api/chat" />
 * }
 * ```
 *
 * **Extended Package** (comprehensive library - all necessary components):
 * ```tsx
 * import { CommandPaletteEnhanced, TokenOptimizationDashboard } from '@clarity-chat/react/extended'
 * ```
 *
 * **Advanced Package** (power users - specialized features):
 * ```tsx
 * import { optimizePrompt, useClarityObject } from '@clarity-chat/react/advanced'
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// CORE API (10-15 exports - what 90% of users need)
// ============================================================================

// 1. Primary Component - Drop-in chat interface
export { ClarityChatApp } from './app-api'
export type { ClarityChatAppProps } from './app-api'

// 2. Primary Hook - Full-featured chat state management
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './hooks/use-clarity-chat'

// 3. Message List - Virtualized, accessible message display
export { VirtualizedMessageList as MessageList } from './components/chat/VirtualizedMessageList'
export type { VirtualizedMessageListProps as MessageListProps } from './components/chat/VirtualizedMessageList'

// 4. Chat Input - Feature-rich input component
export { ChatInput } from './components/chat/ChatInput'
export type { ChatInputProps } from './components/chat/ChatInput'

// 5. Markdown Renderer - Enhanced markdown with syntax highlighting
export { EnhancedMarkdownRenderer as MarkdownRenderer } from './components/ai/EnhancedMarkdownRenderer'
export type { EnhancedMarkdownRendererProps as MarkdownRendererProps } from './components/ai/EnhancedMarkdownRenderer'

// 5.5. Code Block - Syntax highlighted code display
export { CodeBlock } from './components/code/CodeBlock'
export type { CodeBlockProps } from './components/code/CodeBlock'

// 6. Streaming Components - Real-time streaming UI
export { StreamingMessage } from './components/message/StreamingMessage'
export type { StreamingMessageProps } from './components/message/StreamingMessage'
export { StreamStatusProgress as StreamingProgress } from './components/ai/StreamingProgress'
export type { StreamStatusProgressProps as StreamingProgressProps } from './components/ai/StreamingProgress'

// 7. Token Optimization - Usage tracking and cost preview
export { TokenUsageMeter } from './components/token/TokenUsageMeter'
export type { TokenUsageMeterProps } from './components/token/TokenUsageMeter'
export { TokenBudgetBar } from './components/token/TokenBudgetBar'
export type { TokenBudgetBarProps } from './components/token/TokenBudgetBar'
export { useTokenBudget } from './prompt/hooks/use-token-budget'

// 8. Memory Features - Conversation memory and feedback
export { MemoryActivityIndicator } from './components/memory/MemoryActivityIndicator'
export type { MemoryActivityIndicatorProps } from './components/memory/MemoryActivityIndicator'
export { useMemoryFeedback } from './hooks/memory/use-memory-feedback'

// 8.5. Toast/Notification System
export { useToast, type ToastContextValue } from './hooks/ui/use-toast'

// 8.6. Additional Hooks
export {
  useStreaming,
  type UseStreamingOptions,
  type UseStreamingReturn,
} from './hooks/streaming/use-streaming'
export { useThrottledCallback } from './hooks/ui/use-throttle'
export {
  useLocalStorage,
  type UseLocalStorageOptions,
} from './hooks/storage/use-local-storage'
export {
  useAutoScroll,
  type UseAutoScrollOptions,
  type UseAutoScrollReturn,
} from './hooks/ui/use-auto-scroll'
export { useReducedMotion } from './hooks/ui/use-reduced-motion'
export {
  useClipboard,
  type UseClipboardOptions,
  type UseClipboardReturn,
} from './hooks/ui/use-clipboard'

// 8.7. Message Components
export {
  TypingIndicator,
  type TypingIndicatorProps,
  type TypingIndicatorVariant,
} from './components/message/TypingIndicator'
export { CitationCard } from './components/message/CitationCard'
export type { CitationCardProps } from './components/message/CitationCard'

// 8.8. Chat Components
export { ChatWindow } from './components/chat/ChatWindow'
export type { ChatWindowProps } from './components/chat/ChatWindow'
export { FollowUpSuggestions } from './components/chat/FollowUpSuggestions'
export type { FollowUpSuggestionsProps } from './components/chat/FollowUpSuggestions'
export { DefaultEmptyState as EmptyChatState } from './components/chat/EmptyState'
export type { DefaultEmptyStateProps as EmptyChatStateProps } from './components/chat/EmptyState'

// 8.9. UI Components
export { ChatErrorBoundary as ErrorBoundary } from '@clarity-chat/error-handling'
export type { ChatErrorBoundaryProps as ErrorBoundaryProps } from '@clarity-chat/error-handling'

// 8.10. Media Components
export { ExportDialog } from './components/media/ExportDialog'
export type { ExportDialogProps } from './components/media/ExportDialog'

// 8.11. Input Components
export { VoiceInput } from './components/input/VoiceInput'
export type { VoiceInputProps } from './components/input/VoiceInput'
export { AudioRecorder } from './components/input/AudioRecorder'
export type { AudioRecorderProps } from './components/input/AudioRecorder'

// 8.12. Token Components
export { TokenCounter } from './components/token/TokenCounter'
export type { TokenCounterProps } from './components/token/TokenCounter'

// 8.13. Feedback Components
export { NetworkStatus } from './components/feedback/NetworkStatus'
export type { NetworkStatusProps } from './components/feedback/NetworkStatus'

// 8.14. Keyboard Hooks
export {
  useKeyboardShortcuts,
  type KeyboardShortcut,
  type KeyboardShortcutsHelpProps,
} from './hooks/keyboard'

// 8.15. Accessibility Hooks
export {
  useFocusTrap,
  type UseFocusTrapOptions,
} from './hooks/ui/use-focus-trap'
export {
  useFocusRestoration,
  type UseFocusRestorationReturn,
} from './hooks/ui/use-focus-restoration'

// 9. Command Palette - Quick actions and navigation
export { CommandPalette } from './components/navigation/CommandPalette'
export type { CommandPaletteProps } from './components/navigation/CommandPalette'

// 10. Search - Conversation search and filtering
export { SearchFiltersPanel } from './components/search/components/SearchFiltersPanel'
export type { SearchFiltersPanelProps } from './components/search/components/SearchFiltersPanel'
export { MessageSearch } from './components/search/MessageSearch'
export type { MessageSearchProps } from './components/search/MessageSearch'

// 11. Prompts - Prompt library and templates
export { PromptLibrary } from './components/prompt/PromptLibrary'
export type { PromptLibraryProps } from './components/prompt/PromptLibrary'
export { TemplateMarketplace } from './components/prompt/TemplateMarketplace'
export type { TemplateMarketplaceProps } from './components/prompt/TemplateMarketplace'
export {
  PromptSuggestions,
  type PromptSuggestion,
  type PromptSuggestionType,
} from './components/prompt/PromptSuggestions'

// ============================================================================
// CORE TYPES (Essential type definitions from @clarity-chat/types)
// ============================================================================

// Message types - What messages look like
export type {
  Message,
  MessageRole,
  MessageMetadata,
  StreamMessage,
} from '@clarity-chat/types'

// ============================================================================
// UTILITIES (Re-export from primitives)
// ============================================================================

// cn() - Classname merging utility (from primitives package)
export { cn } from '@clarity-chat/primitives'

// ============================================================================
// UNIFIED CONTEXT PROVIDERS
// ============================================================================

// ClarityChatProvider - Unified chat state management
export {
  ClarityChatProvider,
  useClarityChat as useClarityChatContext,
  useIsConnected,
  useChatMessages,
  useChatStreamStatus,
  useChatTools,
  useChatThinking,
  type ClarityChatProviderProps,
  type ClarityChatContextValue,
  type ChatConfig as ClarityChatConfig,
  type ChatMessage as ClarityChatMessage,
  type StreamStatus as ClarityStreamStatus,
  type ThinkingStep as ClarityThinkingStep,
  type ToolExecution as ClarityToolExecution,
  type MessageAttachment as ClarityMessageAttachment,
  type ClarityEventType,
} from './providers/ClarityChatProvider'

// AgentExecutionProvider - Agent execution state management
export {
  AgentExecutionProvider,
  useAgentExecution,
  useIsAgentExecutionConnected,
  useAgentPlan,
  useAgentTools,
  useAgentThinking,
  useAgentStatus,
  type AgentExecutionProviderProps,
  type AgentExecutionContextValue,
  type AgentExecutionState,
  type ExecutionStatus,
  type PlanStep,
  type PlanStepStatus,
  type ToolCall as AgentToolCall,
  type ToolCallStatus,
  type ExecutionError,
  type AgentExecutionEventType,
  type ExecutionSummary,
} from './providers/AgentExecutionProvider'

// ============================================================================
// COMPOSITION COMPONENTS
// ============================================================================

// ChatComposer - Declarative chat layout builder
export {
  ChatComposer,
  useChatComposer,
  useChatComposerBuilder,
  MinimalChat,
  StandardChat,
  AgentChat,
  FullscreenChat,
  type ChatComposerProps,
  type ChatComposerLayout,
  type ChatComposerFeature,
} from './components/ai/ChatComposer'

// MessageRenderer - Plugin-based message rendering
export {
  MessageRenderer,
  defaultPlugins,
  createPlugin,
  extendPlugins,
  type MessageRendererProps,
  type MessagePlugin,
  type PluginMatch,
} from './components/ai/MessageRenderer'

// AgentPanel - Unified agent execution view
export {
  AgentPanel,
  useAgentPanel,
  useConnectedAgentPanel,
  type AgentPanelProps,
  type AgentPanelVariant,
} from './components/ai/AgentPanel'

// ============================================================================
// CONNECTED COMPONENT HOOKS
// ============================================================================

export {
  useConnectedThinkingBar,
  useConnectedStreamProgress,
  useConnectedConversations,
  useConnectedSender,
  useConnectedToolCard,
  useConnectedResponseActions,
  useConnectedWelcome,
  withConnected,
} from './hooks/connected'

// ============================================================================
// SDK BRIDGE HOOKS
// ============================================================================

export {
  useVercelAIBridge,
  useLangChainBridge,
  useAnthropicBridge,
  useGenericBridge,
  type VercelAIBridgeResult,
  type LangChainBridgeResult,
  type AnthropicBridgeResult,
  type BaseBridgeProps,
} from './hooks/bridges'

// ============================================================================
// ADAPTERS
// ============================================================================

export {
  createVercelAIAdapter,
  createBaseClarityChatAdapter,
  withClarityChatEvents,
  type ClarityChatAdapter,
  type ClarityChatAdapterCapabilities,
  type VercelAIAdapterOptions,
} from './adapters'

// ============================================================================
// CORE API COMPLETE
// ============================================================================
// Essential components and hooks for 90% of use cases:
// - Chat: ClarityChatApp, MessageList, ChatInput
// - Streaming: StreamingMessage, StreamingProgress
// - Token Management: TokenUsageMeter, TokenBudgetBar, useTokenBudget
// - Memory: MemoryActivityIndicator, useMemoryFeedback
// - Navigation: CommandPalette
// - Search: SearchFiltersPanel
// - Prompts: PromptLibrary, TemplateMarketplace
// - Rendering: MarkdownRenderer
// - Providers: ClarityChatProvider, AgentExecutionProvider
// - Composition: ChatComposer, MessageRenderer, AgentPanel
// - Adapters: Vercel AI, LangChain, Anthropic bridges
// - Input: VoiceInput, AudioRecorder

/**
 * For advanced features, use subpath imports:
 *
 * @example Token Management
 * ```tsx
 * import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
 * ```
 *
 * @example Memory Features
 * ```tsx
 * import { useMemory } from '@clarity-chat/memory'
 * ```
 *
 * @example Advanced Utilities
 * ```tsx
 * import { formatBytes, retry } from '@clarity-chat/utils'
 * ```
 *
 * @example Error Handling
 * ```tsx
 * import { ErrorBoundary } from '@clarity-chat/error-handling'
 * ```
 */
