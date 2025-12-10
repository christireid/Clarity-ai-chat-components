/**
 * useClarityChat - Top-Level Chat State Hook
 *
 * This file re-exports from the modular use-clarity-chat folder.
 * For implementation details, see ./use-clarity-chat/
 *
 * @module hooks/use-clarity-chat
 */

'use client'

// Re-export everything from the modular folder
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
  type ClarityMemoryOptions,
  type ClarityWebSocketOptions,
  type ClarityPromptOptimizationOptions,
  type ClarityChatMemoryInfo,
  type ClarityChatTokenStats,
  type ClarityChatErrorInfo,
} from './use-clarity-chat/index'
