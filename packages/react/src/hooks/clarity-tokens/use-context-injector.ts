'use client'

import * as React from 'react'

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Find the last index of an element matching a predicate (ES5 compatible)
 */
function findLastIndex<T>(arr: T[], predicate: (item: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return i
    }
  }
  return -1
}

// =============================================================================
// Types
// =============================================================================

export interface RetrievedChunk {
  id?: string
  text: string
  score: number
  source?: string
  metadata?: Record<string, unknown>
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool' | 'function'
  content: string
  name?: string
  metadata?: Record<string, unknown>
}

export type ContextPlacement =
  | 'system'
  | 'beforeLastUser'
  | 'afterSystem'
  | 'custom'

export interface UseContextInjectorConfig {
  /** Template function for formatting chunks */
  template?: (chunks: RetrievedChunk[]) => string
  /** Where to inject context */
  placement?: ContextPlacement
  /** Maximum tokens for injected context */
  maxContextTokens?: number
  /** Token counter function */
  countTokens?: (text: string) => number
  /** Header for injected context */
  contextHeader?: string
  /** Footer for injected context */
  contextFooter?: string
  /** Custom injection function for 'custom' placement */
  customInject?: (messages: ChatMessage[], context: string) => ChatMessage[]
  /** Include source references */
  includeSourceReferences?: boolean
  /** Maximum chunks to inject */
  maxChunks?: number
}

export interface InjectionResult {
  messages: ChatMessage[]
  injectedTokens: number
  chunksUsed: number
  truncated: boolean
}

export interface UseContextInjectorReturn {
  /** Inject context into messages */
  inject: (messages: ChatMessage[], chunks: RetrievedChunk[]) => ChatMessage[]
  /** Inject with full metadata */
  injectWithMetadata: (
    messages: ChatMessage[],
    chunks: RetrievedChunk[]
  ) => InjectionResult
  /** Format chunks using template */
  formatChunks: (chunks: RetrievedChunk[]) => string
  /** Current configuration */
  config: UseContextInjectorConfig
  /** Update configuration */
  updateConfig: (config: Partial<UseContextInjectorConfig>) => void
}

// =============================================================================
// Error Classes
// =============================================================================

export class ContextInjectionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContextInjectionError'
  }
}

// =============================================================================
// Default Templates
// =============================================================================

const DEFAULT_HEADER = 'Relevant context information:'
const DEFAULT_FOOTER = 'Use the above context to inform your response.'

function defaultTemplate(
  chunks: RetrievedChunk[],
  includeSource: boolean
): string {
  return chunks
    .map((chunk, i) => {
      const source =
        includeSource && chunk.source ? ` [Source: ${chunk.source}]` : ''
      return `[${i + 1}]${source}\n${chunk.text}`
    })
    .join('\n\n')
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useContextInjector - Injects retrieved context into chat messages
 *
 * Formats retrieved chunks using a configurable template and injects them
 * into the message list at the specified placement position.
 *
 * @example
 * ```tsx
 * const injector = useContextInjector({
 *   placement: 'system',
 *   maxContextTokens: 2000,
 *   includeSourceReferences: true
 * })
 *
 * // After retrieving context
 * const chunks = await vectorSearch.search(userQuery)
 *
 * // Inject into messages
 * const augmentedMessages = injector.inject(messages, chunks)
 *
 * // Send to LLM
 * await sendToLLM(augmentedMessages)
 * ```
 */
export function useContextInjector(
  initialConfig: UseContextInjectorConfig = {}
): UseContextInjectorReturn {
  const [config, setConfig] = React.useState<UseContextInjectorConfig>({
    placement: 'system',
    contextHeader: DEFAULT_HEADER,
    contextFooter: DEFAULT_FOOTER,
    includeSourceReferences: true,
    maxChunks: 5,
    ...initialConfig,
  })

  /**
   * Format chunks using template
   */
  const formatChunks = React.useCallback(
    (chunks: RetrievedChunk[]): string => {
      // Limit chunks
      const limitedChunks = chunks.slice(0, config.maxChunks)

      // Use custom template if provided
      if (config.template) {
        return config.template(limitedChunks)
      }

      // Use default template
      const formatted = defaultTemplate(
        limitedChunks,
        config.includeSourceReferences ?? true
      )

      // Add header and footer
      const parts: string[] = []
      if (config.contextHeader) parts.push(config.contextHeader)
      parts.push(formatted)
      if (config.contextFooter) parts.push(config.contextFooter)

      return parts.join('\n\n')
    },
    [config]
  )

  /**
   * Truncate context to fit token limit
   */
  const truncateContext = React.useCallback(
    (
      context: string,
      maxTokens: number
    ): { text: string; truncated: boolean } => {
      if (!config.countTokens || !maxTokens) {
        return { text: context, truncated: false }
      }

      const currentTokens = config.countTokens(context)
      if (currentTokens <= maxTokens) {
        return { text: context, truncated: false }
      }

      // Simple truncation: cut at approximate position
      const ratio = maxTokens / currentTokens
      const cutIndex = Math.floor(context.length * ratio * 0.9) // Leave some margin

      // Try to cut at sentence boundary
      const truncated = context.slice(0, cutIndex)
      const lastPeriod = Math.max(
        truncated.lastIndexOf('.'),
        truncated.lastIndexOf('\n'),
        truncated.lastIndexOf('!')
      )

      if (lastPeriod > cutIndex * 0.5) {
        return {
          text: truncated.slice(0, lastPeriod + 1) + '\n[Context truncated]',
          truncated: true,
        }
      }

      return { text: truncated + '... [Context truncated]', truncated: true }
    },
    [config]
  )

  /**
   * Inject with full metadata
   */
  const injectWithMetadata = React.useCallback(
    (messages: ChatMessage[], chunks: RetrievedChunk[]): InjectionResult => {
      if (chunks.length === 0) {
        return {
          messages,
          injectedTokens: 0,
          chunksUsed: 0,
          truncated: false,
        }
      }

      // Format and truncate context
      const formattedContext = formatChunks(chunks)
      const { text: finalContext, truncated } = truncateContext(
        formattedContext,
        config.maxContextTokens ?? Infinity
      )

      const injectedTokens =
        config.countTokens?.(finalContext) ?? Math.ceil(finalContext.length / 4)

      // Create context message
      const contextMessage: ChatMessage = {
        role: 'system',
        content: finalContext,
        metadata: {
          type: 'injected-context',
          chunksUsed: Math.min(
            chunks.length,
            config.maxChunks ?? chunks.length
          ),
          truncated,
        },
      }

      // Inject based on placement
      let newMessages: ChatMessage[]

      switch (config.placement) {
        case 'system': {
          // Prepend as system message
          const systemMessages = messages.filter((m) => m.role === 'system')
          const otherMessages = messages.filter((m) => m.role !== 'system')
          newMessages = [...systemMessages, contextMessage, ...otherMessages]
          break
        }

        case 'afterSystem': {
          // Insert after existing system messages
          const lastSystemIndex = findLastIndex(
            messages,
            (m) => m.role === 'system'
          )
          if (lastSystemIndex === -1) {
            newMessages = [contextMessage, ...messages]
          } else {
            newMessages = [
              ...messages.slice(0, lastSystemIndex + 1),
              contextMessage,
              ...messages.slice(lastSystemIndex + 1),
            ]
          }
          break
        }

        case 'beforeLastUser': {
          // Insert before the last user message
          const lastUserIndex = findLastIndex(
            messages,
            (m) => m.role === 'user'
          )
          if (lastUserIndex === -1) {
            newMessages = [...messages, contextMessage]
          } else {
            newMessages = [
              ...messages.slice(0, lastUserIndex),
              contextMessage,
              ...messages.slice(lastUserIndex),
            ]
          }
          break
        }

        case 'custom': {
          if (!config.customInject) {
            throw new ContextInjectionError(
              "Custom placement requires 'customInject' function in config"
            )
          }
          newMessages = config.customInject(messages, finalContext)
          break
        }

        default:
          throw new ContextInjectionError(
            `Unknown placement: ${config.placement}`
          )
      }

      return {
        messages: newMessages,
        injectedTokens,
        chunksUsed: Math.min(chunks.length, config.maxChunks ?? chunks.length),
        truncated,
      }
    },
    [formatChunks, truncateContext, config]
  )

  /**
   * Inject context into messages (simplified)
   */
  const inject = React.useCallback(
    (messages: ChatMessage[], chunks: RetrievedChunk[]): ChatMessage[] => {
      return injectWithMetadata(messages, chunks).messages
    },
    [injectWithMetadata]
  )

  /**
   * Update configuration
   */
  const updateConfig = React.useCallback(
    (newConfig: Partial<UseContextInjectorConfig>) => {
      setConfig((prev) => ({ ...prev, ...newConfig }))
    },
    []
  )

  return {
    inject,
    injectWithMetadata,
    formatChunks,
    config,
    updateConfig,
  }
}
