/**
 * Clarity Chat Helper Utilities
 *
 * Common utilities and helpers for working with Clarity Chat.
 * These make common patterns easier and reduce boilerplate.
 *
 * Note: For message creation helpers, prefer using the ones from './chat-helpers'
 * which provide more options (like custom IDs).
 */

import type { UseClarityChatOptions } from '../hooks/chat/use-clarity-chat'
import type { CoreMessage } from '../hooks/chat/use-chat-enhanced'
import {
  createUserMessage as createUserMessageCanonical,
  createAssistantMessage as createAssistantMessageCanonical,
  createSystemMessage as createSystemMessageCanonical,
} from './chat-helpers'

/**
 * Create a basic chat configuration with sensible defaults
 */
export function createBasicChatConfig(api: string): UseClarityChatOptions {
  return {
    api,
    // Sensible defaults
    streamProtocol: 'sse',
  }
}

/**
 * Create a chat configuration with memory enabled
 */
export function createMemoryChatConfig(
  api: string,
  strategy:
    | 'sliding-window'
    | 'semantic-chunks'
    | 'vector-store' = 'sliding-window',
  maxTokens: number = 4000
): UseClarityChatOptions {
  return {
    api,
    memory: {
      enabled: true,
      strategy,
      maxTokens,
    },
  }
}

/**
 * Create a chat configuration optimized for streaming
 */
export function createStreamingChatConfig(
  api: string,
  useWebSocket: boolean = false
): UseClarityChatOptions {
  return {
    api,
    transport: useWebSocket ? 'websocket' : 'sse',
  }
}

/**
 * Create an enterprise chat configuration with all features
 */
export function createEnterpriseChatConfig(api: string): UseClarityChatOptions {
  return {
    api,
    memory: {
      enabled: true,
      strategy: 'vector-store',
      maxTokens: 10000,
    },
    promptOptimization: {
      enabled: true,
      strategy: 'hybrid',
    },
    transport: 'sse',
  }
}

/**
 * Helper to create a user message
 *
 * @deprecated Use the version from './chat-helpers' instead for consistency.
 * This is kept for backward compatibility only.
 *
 * @example
 * ```tsx
 * import { createUserMessage } from '@clarity-chat/react/utils/chat-helpers'
 * const message = createUserMessage('Hello!', { id: 'msg-1' })
 * ```
 */
export function createUserMessage(content: string): CoreMessage {
  // Re-export from canonical implementation (backward compatibility)
  return createUserMessageCanonical(content)
}

/**
 * Helper to create an assistant message
 *
 * @deprecated Use the version from './chat-helpers' instead for consistency.
 * This is kept for backward compatibility only.
 *
 * @example
 * ```tsx
 * import { createAssistantMessage } from '@clarity-chat/react/utils/chat-helpers'
 * const message = createAssistantMessage('Hi there!', { id: 'msg-2' })
 * ```
 */
export function createAssistantMessage(content: string): CoreMessage {
  // Re-export from canonical implementation (backward compatibility)
  return createAssistantMessageCanonical(content)
}

/**
 * Helper to create a system message
 *
 * @deprecated Use the version from './chat-helpers' instead for consistency.
 * This is kept for backward compatibility only.
 *
 * @example
 * ```tsx
 * import { createSystemMessage } from '@clarity-chat/react/utils/chat-helpers'
 * const message = createSystemMessage('You are a helpful assistant.', { id: 'msg-3' })
 * ```
 */
export function createSystemMessage(content: string): CoreMessage {
  // Re-export from canonical implementation (backward compatibility)
  return createSystemMessageCanonical(content)
}

/**
 * Check if API endpoint is valid
 */
export function isValidApiEndpoint(api: string | undefined): api is string {
  if (!api) return false
  if (typeof api !== 'string') return false
  if (api.trim().length === 0) return false
  return true
}

/**
 * Get default API endpoint from environment or throw helpful error
 */
export function getApiEndpoint(
  api?: string,
  envVar: string = 'CLARITY_CHAT_API'
): string {
  if (api && isValidApiEndpoint(api)) {
    return api
  }

  const envApi = typeof process !== 'undefined' && process.env?.[envVar]
  if (envApi && isValidApiEndpoint(envApi)) {
    return envApi
  }

  throw new Error(
    `Clarity Chat: API endpoint is required. ` +
      `Provide it via the "api" prop or set the ${envVar} environment variable. ` +
      `Example: <ClarityChat api="/api/chat" />`
  )
}
