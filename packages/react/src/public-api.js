'use client';
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
export { ClarityChat } from './components/chat/clarity-chat';
// Preset configurations
export { ClarityChatPresets } from './components/chat/clarity-chat-presets';
// Recipe components for common patterns
export { ChatComplete, ChatWithMemory, ChatWithAnalytics, ChatWithPreset, } from './components/chat/chat-recipes';
// ============================================================================
// CORE HOOKS (Primary state management)
// ============================================================================
// The main hook - covers 80% of use cases
export { useClarityChat, } from './hooks/chat/use-clarity-chat';
// Headless hook - for custom implementations (100% logic, 0% magic)
export { useChat as useHeadlessChat, } from './hooks/chat/use-chat-enhanced';
// Structured output hook
export { useClarityObject, } from './hooks/chat/use-clarity-object';
// Tool integration hook
export { useClarityChatWithTools, } from './hooks/chat/use-clarity-chat-with-tools';
// ============================================================================
// AI COMPONENTS (Citations, Suggestions, Markdown, etc.)
// ============================================================================
export { Citation, } from './components/ai/citation';
export { MarkdownRendererEnhanced, } from './components/ai/markdown-renderer-enhanced';
export { EnhancedMarkdownRenderer } from './components/ai/enhanced-markdown-renderer';
// Code blocks
export { CodeBlock } from './components/code/CodeBlock';
export { StreamingCodeBlock } from './components/code/StreamingCodeBlock';
export { EnhancedCodeBlock } from './components/ai/enhanced-code-block';
// ============================================================================
// COMPOSABLE UI COMPONENTS (For custom layouts)
// ============================================================================
export { ChatWindow } from './components/chat/chat-window';
export { FloatingChatWidget, } from './components/chat/floating-chat-widget';
export { ChatInput } from './components/chat/chat-input';
export { default as MessageList } from './components/chat/virtualized-message-list';
export { TanStackMessageList, AutoTanStackMessageList, useMessageListScrollControl, useJumpToBottom, } from './components/chat/tanstack-message-list';
export { StreamingMessage } from './components/message/streaming-message';
export { ThinkingIndicator } from './components/message/thinking-indicator';
export { TypingIndicator } from './components/message/typing-indicator';
// FlowToken Integration (optional - requires 'flowtoken' peer dependency)
export { FlowTokenStreamingText, FlowTokenMarkdown, useFlowToken, } from './components/message/flowtoken-adapter';
// Layouts
export { ChatLayout } from './components/chat/chat-layout';
export { ResizableChatLayout, useResizableLayout, ResizeHandle, Panel, PanelGroup, PanelResizeHandle, } from './components/chat/resizable-chat-layout';
// ============================================================================
// MEMORY SYSTEM
// ============================================================================
export { MemoryProvider, useMemoryContext, } from './memory/memory-provider';
// ============================================================================
// TOKEN OPTIMIZATION
// ============================================================================
export { TokenBudgetProvider, useTokenBudget, } from './context/token-budget-context';
// ============================================================================
// THEME SYSTEM
// ============================================================================
export { ThemeProvider, useTheme } from './theme';
// ============================================================================
// LICENSE MANAGEMENT (Re-exported from @clarity-chat/license)
// ============================================================================
export { 
// Core license utilities
LicenseInfo, verifyLicense, isLicenseValid, 
// React hooks
useLicenseStatus, useIsLicensed, useHasPlan, useLicenseInfo, 
// Components
LicenseProvider, LicenseGate, Watermark, 
// HOCs
withLicense, } from '@clarity-chat/license';
// ============================================================================
// UTILITY FUNCTIONS (Commonly needed helpers)
// ============================================================================
// CSS class utility
export { cn } from './utils/cn';
// Message helpers
export { createUserMessage, createAssistantMessage, createSystemMessage, } from './utils/message/chat-helpers';
// Type guards
export { isUserMessage, isAssistantMessage, hasTextContent, extractTextContent, } from './types/clarity-chat-types';
// ============================================================================
// INITIALIZATION (For license setup)
// ============================================================================
export { initializeClarity } from './initialization';
// ============================================================================
// ADDITIONAL UI COMPONENTS (For DocsAssistant and similar use cases)
// ============================================================================
// Error and Feedback
export { ErrorBoundary } from './components/feedback/error-boundary';
export { NetworkStatus } from './components/feedback/network-status';
// Token Management
export { TokenCounter } from './components/token/token-counter';
// Media and Export
export { ExportDialog } from './components/media/export-dialog';
// Search
export { MessageSearch, MessageSearchWithSuspense, } from './components/search/message-search';
// Prompts and Suggestions
export { FollowUpSuggestions } from './components/prompt/follow-up-suggestions';
export { PromptSuggestions } from './components/prompt/prompt-suggestions';
// Message Components
export { CitationCard } from './components/message/citation-card';
// Input Components
export { VoiceInput } from './components/input/voice-input';
// Empty States
export { EmptyChatState } from './components/ui/empty-state';
// ============================================================================
// ADDITIONAL HOOKS (For DocsAssistant and similar use cases)
// ============================================================================
// Toast notifications
export { useToast, ToastProvider, ToastContainer, } from './components/ui/toast';
// Sonner-based toast (alternative, more feature-rich)
export { ClarityToaster, toast, } from './components/ui/sonner-toast';
// Keyboard shortcuts
export { useKeyboardShortcuts } from './hooks/keyboard/use-keyboard-shortcuts';
// Command Palette
export { useCommandPalette } from './hooks/keyboard/use-command-palette';
// Note: useCommandPaletteCommands has a broken import path and is excluded
// Clipboard
export { useClipboard } from './hooks/ui/use-clipboard';
// Local storage
export { useLocalStorage } from './hooks/storage/use-local-storage';
// Resilience
export { useRetryWithBackoff } from './hooks/resilience/use-retry-with-backoff';
// Input (voice, etc.)
export { useVoiceInput } from './hooks/input/use-voice-input';
// Throttle utilities
export { useThrottledCallback } from './hooks/ui/use-throttle';
// Token tracking
export { useTokenTracker } from './hooks/token/use-token-tracker';
// Streaming
export { useStreaming } from './hooks/streaming/use-streaming';
export { useSmoothedText, smoothingPresets, } from './hooks/streaming/use-smoothed-text';
// Accessibility
export { useReducedMotion } from './animations';
export { useFocusTrap, useFocusRestoration, } from './accessibility/focus-management';
// Auto-scroll
export { useAutoScroll, } from './hooks/ui/use-auto-scroll';
// ============================================================================
// ANIMATION UTILITIES (For custom animation implementations)
// ============================================================================
export { createFadeVariant, createSlideVariant, createScaleVariant, createStaggerContainerVariant, createStaggerChildVariant, createInteractionVariant, createPulseAnimation, createShimmerAnimation, createSpinnerAnimation, createDotsAnimation, createBounceAnimation, createShakeAnimation, createSuccessAnimation, createErrorAnimation, mergeTransitions, getDurationInSeconds, getDurationInMs, createTweenTransition, } from './animations/utils';
// ============================================================================
// CHAT PRIMITIVES (Headless, composable building blocks)
// ============================================================================
export { ChatPrimitive, ChatRoot, ChatMessages, ChatMessage, ChatMessageContent, ChatMessageActions, ChatInput as ChatInputPrimitive, ChatCopyButton, ChatRegenerateButton, ChatDeleteButton, ChatEmptyState, ChatLoadingIndicator, } from './primitives/chat';
//# sourceMappingURL=public-api.js.map