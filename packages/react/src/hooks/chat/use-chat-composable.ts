/**
 * Composable Chat Hooks - Easy way to combine multiple features
 *
 * These hooks make it easy to compose multiple features together
 * without boilerplate.
 */

'use client'

import * as React from 'react'
import {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
} from './use-chat-unified'
import { useClarityChat, type UseClarityChatOptions } from './use-clarity-chat'

/**
 * Composable chat features
 */
export interface ChatFeatures {
  /** Enable memory */
  memory?: {
    enabled: boolean
    strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
    maxTokens?: number
  }
  /** Enable persistence */
  persistence?: {
    enabled: boolean
    storageKey?: string
  }
  /** Enable analytics */
  analytics?: {
    onMessageSent?: (content: string) => void
    onMessageReceived?: (messageId: string) => void
    onError?: (error: Error) => void
  }
  /** Enable error recovery */
  errorRecovery?: {
    enabled: boolean
    maxRetries?: number
  }
}

/**
 * useChatComposable - Composable chat hook with feature flags
 *
 * Easily combine multiple features with a simple configuration object.
 *
 * @example
 * ```tsx
 * const chat = useChatComposable({
 *   api: '/api/chat',
 *   features: {
 *     memory: { enabled: true, strategy: 'vector-store' },
 *     persistence: { enabled: true, storageKey: 'my-chat' },
 *     analytics: {
 *       onMessageSent: (content) => track('message_sent'),
 *     },
 *   },
 * })
 * ```
 */
/**
 * @deprecated Use `useClarityChat` instead. This hook will be removed in v2.0.
 */
export function useChatComposable(
  options: UseChatOptions & {
    features?: ChatFeatures
  }
): UseChatReturn {
  // Deprecation warning
  if (process.env['NODE_ENV'] === 'development') {
    console.warn(
      '[Clarity Chat] useChatComposable is deprecated. Use useClarityChat with its built-in ' +
        'memory and transport options instead. See: https://clarity-chat.dev/docs/hooks/use-clarity-chat'
    )
  }

  const { features, ...chatOptions } = options

  // Build options with features applied
  const finalOptions: UseChatOptions = {
    ...chatOptions,
    persistMessages: features?.persistence?.enabled ?? false,
    storageKey: features?.persistence?.storageKey ?? 'clarity-chat',
  }

  // Add memory if enabled
  if (features?.memory?.enabled) {
    finalOptions.memory = {
      enabled: true,
      strategy: features.memory.strategy ?? 'vector-store',
      maxTokens: features.memory.maxTokens,
    }
  }

  const chat = useChat(finalOptions)

  // Handle analytics
  React.useEffect(() => {
    if (features?.analytics?.onMessageSent) {
      // Note: This is a simplified implementation
      // For full analytics, you'd need to wrap the sendMessage function
    }
  }, [features?.analytics])

  return chat
}

/**
 * useChatWithFeatures - Type-safe feature composition
 *
 * Compose features with full type safety and autocomplete.
 *
 * @example
 * ```tsx
 * const chat = useChatWithFeatures({
 *   api: '/api/chat',
 *   memory: { strategy: 'vector-store' },
 *   persistence: { storageKey: 'my-chat' },
 * })
 * ```
 */
export function useChatWithFeatures(
  options: UseChatOptions & {
    memory?: {
      strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
      maxTokens?: number
    }
    persistence?: {
      storageKey?: string
    }
  }
): UseChatReturn {
  return useChatComposable({
    ...options,
    features: {
      memory: options.memory ? { enabled: true, ...options.memory } : undefined,
      persistence: options.persistence
        ? { enabled: true, ...options.persistence }
        : undefined,
    },
  })
}

/**
 * Hook builder pattern - Chain features together
 */
export class ChatHookBuilder {
  private options: UseChatOptions = {}
  private features: ChatFeatures = {}

  constructor(api: string) {
    this.options.api = api
  }

  withMemory(
    strategy:
      | 'sliding-window'
      | 'semantic-chunks'
      | 'vector-store' = 'vector-store',
    maxTokens?: number
  ) {
    this.features.memory = { enabled: true, strategy, maxTokens }
    return this
  }

  withPersistence(storageKey: string = 'clarity-chat') {
    this.features.persistence = { enabled: true, storageKey }
    return this
  }

  withAnalytics(callbacks: ChatFeatures['analytics']) {
    this.features.analytics = callbacks
    return this
  }

  withErrorRecovery(maxRetries: number = 3) {
    this.features.errorRecovery = { enabled: true, maxRetries }
    return this
  }

  build(): UseChatReturn {
    return useChatComposable({
      ...this.options,
      features: this.features,
    })
  }
}

/**
 * Create a chat hook builder
 *
 * @example
 * ```tsx
 * const chat = createChatHook('/api/chat')
 *   .withMemory('vector-store')
 *   .withPersistence('my-chat')
 *   .withAnalytics({ onMessageSent: track })
 *   .build()
 * ```
 */
export function createChatHook(api: string) {
  return new ChatHookBuilder(api)
}
