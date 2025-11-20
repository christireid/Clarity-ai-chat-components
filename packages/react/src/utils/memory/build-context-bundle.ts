/**
 * buildContextBundle - Low-level utility for building context bundles
 * 
 * Primitive function for constructing context bundles from messages and memories.
 * Used internally by memory system and available for custom implementations.
 */

import type { Message } from '@clarity-chat/types'
import type { MemoryItem } from '@clarity-chat/memory'

/**
 * Context bundle structure
 */
export interface ContextBundle {
  /** Recent messages */
  messages: Message[]
  /** Relevant memories */
  memories: MemoryItem[]
  /** Combined context text */
  text: string
  /** Token count estimate */
  tokenCount: number
}

/**
 * Options for building context bundle
 */
export interface BuildContextBundleOptions {
  /** Maximum tokens */
  maxTokens?: number
  /** Include system messages */
  includeSystem?: boolean
  /** Memory relevance threshold */
  memoryThreshold?: number
}

/**
 * buildContextBundle - Build context bundle from messages and memories
 * 
 * Low-level utility for constructing context bundles. Used by memory system
 * and available for custom context management strategies.
 */
export function buildContextBundle(
  messages: Message[],
  memories: MemoryItem[] = [],
  options: BuildContextBundleOptions = {}
): ContextBundle {
  const {
    maxTokens = 8000,
    includeSystem = true,
    memoryThreshold = 0.7,
  } = options

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    if (!includeSystem && msg.role === 'system') return false
    return true
  })

  // Filter memories by threshold
  const relevantMemories = memories.filter(
    (mem) => (mem.metadata?.['relevance'] || 0) >= memoryThreshold
  )

  // Build combined text
  const messageTexts = filteredMessages.map((msg) => `${msg.role}: ${msg.content}`)
  const memoryTexts = relevantMemories.map((mem) => `Memory: ${mem.content}`)
  const text = [...memoryTexts, ...messageTexts].join('\n\n')

  // Estimate token count (rough: 1 token ≈ 4 chars)
  const tokenCount = Math.ceil(text.length / 4)

  return {
    messages: filteredMessages,
    memories: relevantMemories,
    text,
    tokenCount,
  }
}
