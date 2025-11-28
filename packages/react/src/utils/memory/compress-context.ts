/**
 * compressContext - Low-level utility for compressing context
 *
 * Primitive function for compressing context to fit within token limits.
 * Used internally by memory system and available for custom implementations.
 */

import type { Message } from '@clarity-chat/types'
import { estimateTokens as estimateTokensFromText } from '../tokenization/estimator'

/**
 * Options for compressing context
 */
export interface CompressContextOptions {
  /** Target token count */
  targetTokens: number
  /** Strategy for compression */
  strategy?: 'truncate' | 'summarize' | 'priority'
  /** Messages to always keep */
  keepRecent?: number
}

/**
 * compressContext - Compress context to fit token limit
 * 
 * Low-level utility for compressing message context. Used by memory system
 * and available for custom context management strategies.
 */
export function compressContext(
  messages: Message[],
  options: CompressContextOptions
): Message[] {
  const {
    targetTokens,
    strategy = 'truncate',
    keepRecent = 2,
  } = options

  // Always keep recent messages
  const recentMessages = messages.slice(-keepRecent)
  const olderMessages = messages.slice(0, -keepRecent)

  if (strategy === 'truncate') {
    // Simple truncation: remove oldest messages until under limit
    let compressed = [...olderMessages, ...recentMessages]
    let tokenCount = estimateTokens(compressed)

    while (tokenCount > targetTokens && compressed.length > keepRecent) {
      compressed = compressed.slice(1)
      tokenCount = estimateTokens(compressed)
    }

    return compressed
  }

  // Other strategies would go here
  return messages
}

/**
 * Estimate token count for messages using centralized estimator
 */
function estimateTokens(messages: Message[]): number {
  const text = messages.map((m) => m.content).join(' ')
  return estimateTokensFromText(text)
}
