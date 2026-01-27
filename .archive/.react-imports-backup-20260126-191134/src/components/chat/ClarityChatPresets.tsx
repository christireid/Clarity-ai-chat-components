/**
 * ClarityChatPresets - Top-Level Preset Components
 *
 * Pre-configured chat components for common use cases, making it even easier
 * to get started with Clarity Chat.
 *
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Developer Experience
 *
 * These presets wrap `ClarityChat` with sensible defaults for specific use cases.
 * For more control, use `ClarityChat` directly or compose with mid-level APIs.
 *
 * @example
 * ```tsx
 * // Simple chat
 * <ClarityChatPresets.Simple api="/api/chat" />
 *
 * // Chat with memory
 * <ClarityChatPresets.WithMemory api="/api/chat" memoryStrategy="vector-store" />
 *
 * // Enterprise chat with all features
 * <ClarityChatPresets.Enterprise api="/api/chat" />
 * ```
 */

import type { UseClarityChatOptions } from '../../hooks/chat/use-clarity-chat'
import { ClarityChat, type ClarityChatProps } from './ClarityChat'

/**
 * Preset configurations for common use cases
 *
 * Each preset wraps ClarityChat with sensible defaults for specific use cases.
 * All presets require an `api` prop and accept all other ClarityChat props.
 */
export const ClarityChatPresets = {
  /**
   * Simple chat - minimal configuration
   *
   * @example
   * ```tsx
   * <ClarityChatPresets.Simple api="/api/chat" />
   * ```
   */
  Simple: (props: Omit<ClarityChatProps, 'api'> & { api: string }) => (
    <ClarityChat {...props} />
  ),

  /**
   * Chat with memory - context-aware conversations
   *
   * Enables memory management with configurable strategy.
   *
   * @param props - ClarityChat props with memory-specific additions
   * @param props.api - API endpoint URL (required)
   * @param props.memoryStrategy - Memory strategy: 'sliding-window' (default), 'semantic-chunks', or 'vector-store'
   *
   * @example
   * ```tsx
   * <ClarityChatPresets.WithMemory
   *   api="/api/chat"
   *   memoryStrategy="vector-store"
   * />
   * ```
   */
  WithMemory: (
    props: Omit<ClarityChatProps, 'api' | 'memory'> & {
      api: string
      memoryStrategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
    }
  ) => (
    <ClarityChat
      {...props}
      memory={{
        enabled: true,
        strategy: props.memoryStrategy || 'sliding-window',
        maxTokens: 4000,
      }}
    />
  ),

  /**
   * Enterprise chat - full-featured with all options
   *
   * Includes memory, prompt optimization, header, and message count.
   * Optimized for production enterprise use cases.
   *
   * @param props - ClarityChat props
   * @param props.api - API endpoint URL (required)
   *
   * @example
   * ```tsx
   * <ClarityChatPresets.Enterprise
   *   api="/api/chat"
   *   sessionTitle="Enterprise Assistant"
   * />
   * ```
   */
  Enterprise: (props: Omit<ClarityChatProps, 'api'> & { api: string }) => (
    <ClarityChat
      {...props}
      showHeader
      showMessageCount
      memory={{
        enabled: true,
        strategy: 'vector-store',
        maxTokens: 10000,
      }}
      promptOptimization={{
        enabled: true,
        strategy: 'hybrid',
      }}
    />
  ),

  /**
   * Streaming chat - optimized for real-time updates
   *
   * Configured for optimal streaming performance with SSE (default) or WebSocket.
   *
   * @param props - ClarityChat props with transport option
   * @param props.api - API endpoint URL (required)
   * @param props.useWebSocket - Use WebSocket instead of SSE (default: false)
   *
   * @example
   * ```tsx
   * // SSE (default)
   * <ClarityChatPresets.Streaming api="/api/chat" />
   *
   * // WebSocket
   * <ClarityChatPresets.Streaming api="/api/chat" useWebSocket />
   * ```
   */
  Streaming: (
    props: Omit<ClarityChatProps, 'api' | 'transport'> & {
      api: string
      useWebSocket?: boolean
    }
  ) => (
    <ClarityChat
      {...props}
      transport={props.useWebSocket ? 'websocket' : 'sse'}
    />
  ),
}

/**
 * Type-safe preset configurations
 */
export type ClarityChatPresetConfig = {
  Simple: Omit<ClarityChatProps, 'api'> & { api: string }
  WithMemory: Omit<ClarityChatProps, 'api' | 'memory'> & {
    api: string
    memoryStrategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  }
  Enterprise: Omit<ClarityChatProps, 'api'> & { api: string }
  Streaming: Omit<ClarityChatProps, 'api' | 'transport'> & {
    api: string
    useWebSocket?: boolean
  }
}
