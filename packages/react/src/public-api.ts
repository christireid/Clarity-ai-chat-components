'use client'

/**
 * @clarity-chat/react - Public API
 *
 * This file defines the intentional public API surface for Clarity Chat.
 * Only exports in this file are considered stable and supported.
 *
 * For internal utilities, import from '@clarity-chat/react/internal' (not recommended).
 *
 * @packageDocumentation
 */

// ============================================================================
// CORE COMPONENTS (The essentials - what 90% of users need)
// ============================================================================

// Primary drop-in component
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

export {
  MarkdownRendererEnhanced,
  type MarkdownRendererProps,
} from './components/ai/markdown-renderer-enhanced'

export { EnhancedMarkdownRenderer } from './components/ai/enhanced-markdown-renderer'

// Code blocks
export { CodeBlock, type CodeBlockProps } from './components/code/CodeBlock'

export { StreamingCodeBlock } from './components/code/StreamingCodeBlock'
export { EnhancedCodeBlock } from './components/ai/enhanced-code-block'

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
export { StreamingMessage } from './components/message/streaming-message'
export { ThinkingIndicator } from './components/message/thinking-indicator'
export { TypingIndicator } from './components/message/typing-indicator'

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

// Streaming
export { useStreaming } from './hooks/streaming/use-streaming'
export {
  useSmoothedText,
  smoothingPresets,
  type UseSmoothedTextOptions,
  type UseSmoothedTextReturn,
} from './hooks/streaming/use-smoothed-text'

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
