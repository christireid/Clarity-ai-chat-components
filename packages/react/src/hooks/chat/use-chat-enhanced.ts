/**
 * useChatEnhanced - Mid-Level Enhanced Chat Hook
 *
 * @internal
 * This hook is now internal only. External consumers should use `useClarityChat`.
 *
 * This file re-exports from the internal location for backward compatibility.
 * All imports should be migrated to use `useClarityChat` instead.
 *
 * @deprecated Import from '@clarity-chat/react' using `useClarityChat` instead.
 */

// Re-export everything from the internal location for backward compatibility
export {
  useChat,
  useChatEnhanced,
  type CoreMessage,
  type CoreMessageContent,
  type UseChatOptions,
  type UseChatReturn,
  type MessageRole,
} from '../../internal/hooks/use-chat-enhanced'
