/**
 * Chat Hooks
 *
 * Three primary hooks for chat functionality:
 * - `useClarityChat` - Main hook for chat with messages, streaming, memory
 * - `useClarityObject` - Structured output generation
 * - `useClarityChatWithTools` - Chat with tool/function calling
 */
// ============================================================================
// PRIMARY HOOKS (Recommended)
// ============================================================================
export { useClarityChat, } from './use-clarity-chat';
export { useClarityObject, } from './use-clarity-object';
export { useClarityChatWithTools, } from './use-clarity-chat-with-tools';
// ============================================================================
// UTILITY HOOKS
// ============================================================================
export { useChatHandlers, } from './use-chat-handlers';
export * from './use-chat-history';
export * from './use-completion';
export * from './use-assistant';
// ============================================================================
// CORE TYPES
// ============================================================================
export {} from './use-chat-enhanced';
// ============================================================================
// DEPRECATED HOOKS (Will be removed in v2.0)
// Use useClarityChat instead
// ============================================================================
/** @deprecated Use useClarityChat instead */
export { useChat as useChatEnhanced, } from './use-chat-enhanced';
/** @deprecated Use useClarityChat instead */
export { useChat, } from './use-chat-unified';
/** @deprecated Use useClarityChat instead */
export { useChat as useChatLegacy, } from './use-chat';
/** @deprecated Use useClarityChat instead. ChatWindow accepts CoreMessage[] directly. */
export * from './use-chat-simple';
/** @deprecated Use useClarityChat with primitives instead */
export * from './use-chat-composable';
//# sourceMappingURL=index.js.map