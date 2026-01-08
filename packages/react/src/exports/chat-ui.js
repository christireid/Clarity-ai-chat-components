/**
 * Chat UI Domain Exports
 *
 * Top-level: Drop-in components
 * Mid-level: Composable building blocks
 * Low-level: Primitives and utilities
 */
// ============================================================================
// TOP-LEVEL: Drop-in Components
// ============================================================================
// Main drop-in component
export { ClarityChat } from '../components/clarity-chat';
// Recipe components (pre-built combinations)
export { ChatWithMemory, ChatWithAnalytics, ChatWithPreset, ChatWithPersistence, ChatWithErrorHandling, ChatComplete, } from '../components/chat-recipes';
// Error boundary wrapper
export { ChatWithErrorBoundary, } from '../components/chat-with-error-boundary';
// ============================================================================
// MID-LEVEL: Composable Building Blocks
// ============================================================================
// Simplified unified hook
export { useChat, } from '../hooks/use-chat-unified';
// Main chat hook
export { useClarityChat, } from '../hooks/use-clarity-chat';
// Composable hooks
export { useChatComposable, useChatWithFeatures, createChatHook, ChatHookBuilder, } from '../hooks/use-chat-composable';
// Chat window component
export { ChatWindow, } from '../components/chat/chat-window';
// Message components
export { Message } from '../components/message';
export { MessageList } from '../components/message-list';
export { VirtualizedMessageList } from '../components/virtualized-message-list';
// Input components
export { ChatInput } from '../components/chat-input';
export { AdvancedChatInput, } from '../components/advanced-chat-input';
// ============================================================================
// LOW-LEVEL: Primitives and Utilities
// ============================================================================
// Legacy chat hook (for backward compatibility)
// Note: This is the original useChat from use-chat.ts
export { useChat as useChatLegacy, } from '../hooks/use-chat';
// Enhanced chat hook (internal use, but exported for advanced users)
// Note: This is useChat from use-chat-enhanced.ts
export { useChat as useChatEnhanced, } from '../hooks/chat/use-chat-enhanced';
// Message conversion utilities
export { convertCoreMessageToMessage, convertMessageToCoreMessage, convertCoreMessagesToMessages, convertMessagesToCoreMessages, 
// Deprecated but kept for backward compatibility
coreMessagesToMessages, coreMessageToMessage, } from '../utils/message/message-conversion';
// Helper hooks
export { useClarityChatWithWindow, useClarityChatWithAnalytics, useClarityChatWithPersistence, useClarityChatWithDebounce, useClarityChatWithAutoSave, } from '../hooks/use-clarity-chat-helpers';
// Tool integration
export { useClarityChatWithTools, } from '../hooks/use-clarity-chat-with-tools';
//# sourceMappingURL=chat-ui.js.map