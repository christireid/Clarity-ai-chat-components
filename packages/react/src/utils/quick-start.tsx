/**
 * Quick Start Helpers - Ultra-Simple APIs
 *
 * These functions provide the absolute simplest way to get started with Clarity Chat.
 * They return JSX elements directly, making them perfect for rapid prototyping.
 *
 * @module utils/quick-start
 */

import * as React from 'react'
import { ClarityChat } from '../components/chat/ClarityChat'
import { ClarityChatPresets } from '../components/chat/ClarityChatPresets'

/**
 * Create a basic chat component - the simplest possible API
 *
 * @param api - API endpoint URL
 * @param options - Optional configuration
 * @returns JSX.Element ready to render
 *
 * @example
 * ```tsx
 * import { chat } from '@clarity-chat/react'
 *
 * function App() {
 *   return chat('/api/chat')
 * }
 * ```
 */
export function chat(
  api: string,
  options?: {
    memory?: boolean
    streaming?: boolean
    enterprise?: boolean
  }
): React.ReactElement {
  if (options?.enterprise) {
    return <ClarityChatPresets.Enterprise api={api} />
  }

  if (options?.memory) {
    return <ClarityChatPresets.WithMemory api={api} />
  }

  if (options?.streaming) {
    return <ClarityChatPresets.Streaming api={api} />
  }

  return <ClarityChat api={api} />
}

/**
 * Create a chat with memory
 *
 * @param api - API endpoint URL
 * @param strategy - Memory strategy (default: 'sliding-window')
 * @returns JSX.Element with memory enabled
 *
 * @example
 * ```tsx
 * import { chatWithMemory } from '@clarity-chat/react'
 *
 * function App() {
 *   return chatWithMemory('/api/chat', 'vector-store')
 * }
 * ```
 */
export function chatWithMemory(
  api: string,
  strategy:
    | 'sliding-window'
    | 'semantic-chunks'
    | 'vector-store' = 'sliding-window'
): React.ReactElement {
  return <ClarityChatPresets.WithMemory api={api} memoryStrategy={strategy} />
}

/**
 * Create an enterprise chat with all features
 *
 * @param api - API endpoint URL
 * @param title - Optional custom title
 * @returns JSX.Element with enterprise features
 *
 * @example
 * ```tsx
 * import { enterpriseChat } from '@clarity-chat/react'
 *
 * function App() {
 *   return enterpriseChat('/api/chat', 'My AI Assistant')
 * }
 * ```
 */
export function enterpriseChat(
  api: string,
  title?: string
): React.ReactElement {
  return <ClarityChatPresets.Enterprise api={api} sessionTitle={title} />
}

/**
 * Create a streaming chat optimized for real-time updates
 *
 * @param api - API endpoint URL
 * @param useWebSocket - Use WebSocket instead of SSE
 * @returns JSX.Element optimized for streaming
 *
 * @example
 * ```tsx
 * import { streamingChat } from '@clarity-chat/react'
 *
 * function App() {
 *   return streamingChat('/api/chat', true) // WebSocket
 * }
 * ```
 */
export function streamingChat(
  api: string,
  useWebSocket: boolean = false
): React.ReactElement {
  return <ClarityChatPresets.Streaming api={api} useWebSocket={useWebSocket} />
}

/**
 * Create a custom chat with builder pattern
 *
 * @returns A fluent API for building custom chat configurations
 *
 * @example
 * ```tsx
 * import { ChatBuilder } from '@clarity-chat/react'
 *
 * function App() {
 *   return ChatBuilder.create('/api/chat')
 *     .withMemory('vector-store')
 *     .withHeader('My Chat')
 *     .withStreaming()
 *     .build()
 * }
 * ```
 */
export class ChatBuilder {
  private config: any = {}

  private constructor(private api: string) {}

  static create(api: string): ChatBuilder {
    return new ChatBuilder(api)
  }

  withMemory(
    strategy:
      | 'sliding-window'
      | 'semantic-chunks'
      | 'vector-store' = 'sliding-window'
  ): ChatBuilder {
    this.config.memory = { enabled: true, strategy }
    return this
  }

  withHeader(title?: string): ChatBuilder {
    this.config.header = { show: true, title }
    return this
  }

  withStreaming(useWebSocket: boolean = false): ChatBuilder {
    this.config.transport = useWebSocket ? 'websocket' : 'sse'
    return this
  }

  withRateLimiting(enabled: boolean = true): ChatBuilder {
    this.config.rateLimiting = { enabled }
    return this
  }

  withPrompts(starterPrompts?: string[]): ChatBuilder {
    this.config.prompts = {
      starterPrompts: starterPrompts?.map((text) => ({ text })),
    }
    return this
  }

  build(): React.ReactElement {
    return <ClarityChat api={this.api} {...this.config} />
  }
}

/**
 * Type-safe configuration presets for common use cases
 */
export const ChatPresets = {
  /** Minimal chat for prototyping */
  Minimal: (api: string) => chat(api),

  /** Chat with memory for context-aware conversations */
  WithMemory: (api: string) => chat(api, { memory: true }),

  /** Streaming chat for real-time updates */
  Streaming: (api: string) => chat(api, { streaming: true }),

  /** Enterprise-ready chat with all features */
  Enterprise: (api: string) => chat(api, { enterprise: true }),

  /** Chat optimized for customer support */
  Support: (api: string) => (
    <ClarityChat
      api={api}
      sessionTitle="Support Assistant"
      header={{ show: true, title: 'Support Assistant' }}
      memory={{ enabled: true, strategy: 'sliding-window' }}
      prompts={{
        starterPrompts: [
          { text: 'How can I help you today?', category: 'support' },
          { text: 'I need help with...', category: 'support' },
        ],
      }}
    />
  ),

  /** Chat optimized for technical questions */
  Technical: (api: string) => (
    <ClarityChat
      api={api}
      sessionTitle="Technical Assistant"
      header={{ show: true, title: 'Technical Assistant' }}
      memory={{ enabled: true, strategy: 'vector-store' }}
      promptOptimization={{ enabled: true, strategy: 'hybrid' }}
      prompts={{
        starterPrompts: [
          { text: 'Explain how to...', category: 'technical' },
          { text: 'Debug this error...', category: 'technical' },
          { text: 'Best practices for...', category: 'technical' },
        ],
      }}
    />
  ),
} as const
