/**
 * Contextual Compression Chain
 *
 * Multi-pass compression pipeline for reducing token usage while
 * preserving semantic meaning.
 */

import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import type { Tokenizer } from './tokenizer'
import { estimateMessageTokens, estimateSingleMessageTokens } from './tokenizer'

/**
 * Compression strategy types
 */
export type CompressionStrategy =
  | 'semantic-grouping'
  | 'tool-condensing'
  | 'intent-summarization'

/**
 * Compression options
 */
export interface CompressionOptions {
  /** Target token budget */
  targetTokens: number
  /** Tokenizer to use */
  tokenizer: Tokenizer
  /** Strategies to apply (in order) */
  strategies?: CompressionStrategy[]
  /** Summarization function */
  summarizeFn?: (messages: CoreMessage[], context?: string) => Promise<string> | string
  /** Minimum messages to keep before summarizing */
  keepRecentMessages?: number
  /** Maximum tokens for tool outputs before condensing */
  maxToolOutputTokens?: number
}

/**
 * Compression result
 */
export interface CompressionResult {
  /** Compressed messages */
  messages: CoreMessage[]
  /** Compression logs */
  logs: CompressionLog[]
  /** Overall compression ratio */
  compressionRatio: number
}

/**
 * Compression log entry
 */
export interface CompressionLog {
  /** Strategy applied */
  strategy: CompressionStrategy
  /** Tokens before */
  tokensBefore: number
  /** Tokens after */
  tokensAfter: number
  /** Description of what was done */
  description: string
}

/**
 * Compress context using multi-pass pipeline
 */
export async function compressContext(
  messages: CoreMessage[],
  options: CompressionOptions
): Promise<CompressionResult> {
  const {
    targetTokens,
    tokenizer,
    strategies = ['semantic-grouping', 'tool-condensing', 'intent-summarization'],
    summarizeFn,
    keepRecentMessages = 3,
    maxToolOutputTokens = 500,
  } = options

  let currentMessages = [...messages]
  const logs: CompressionLog[] = []
  const originalTokens = estimateMessageTokens(messages, tokenizer)

  // Apply each strategy in order until within budget
  for (const strategy of strategies) {
    const currentTokens = estimateMessageTokens(currentMessages, tokenizer)

    if (currentTokens <= targetTokens) {
      break
    }

    const tokensBefore = currentTokens

    switch (strategy) {
      case 'semantic-grouping':
        currentMessages = applySemanticGrouping(currentMessages, tokenizer)
        break

      case 'tool-condensing':
        currentMessages = applyToolCondensing(
          currentMessages,
          tokenizer,
          maxToolOutputTokens
        )
        break

      case 'intent-summarization':
        if (summarizeFn) {
          currentMessages = await applyIntentSummarization(
            currentMessages,
            tokenizer,
            summarizeFn,
            keepRecentMessages
          )
        }
        break
    }

    const tokensAfter = estimateMessageTokens(currentMessages, tokenizer)

    logs.push({
      strategy,
      tokensBefore,
      tokensAfter,
      description: `Reduced ${tokensBefore - tokensAfter} tokens`,
    })
  }

  const finalTokens = estimateMessageTokens(currentMessages, tokenizer)

  return {
    messages: currentMessages,
    logs,
    compressionRatio: originalTokens > 0 ? finalTokens / originalTokens : 1,
  }
}

/**
 * Semantic grouping - cluster consecutive messages by role/topic
 */
function applySemanticGrouping(
  messages: CoreMessage[],
  tokenizer: Tokenizer
): CoreMessage[] {
  if (messages.length < 3) return messages

  const result: CoreMessage[] = []
  let currentGroup: CoreMessage[] = []
  let currentRole: string | null = null

  for (const msg of messages) {
    // System messages are never grouped
    if (msg.role === 'system') {
      if (currentGroup.length > 0) {
        result.push(mergeMessages(currentGroup, tokenizer))
        currentGroup = []
        currentRole = null
      }
      result.push(msg)
      continue
    }

    // Start new group or continue current
    if (msg.role !== currentRole) {
      if (currentGroup.length > 0) {
        result.push(mergeMessages(currentGroup, tokenizer))
      }
      currentGroup = [msg]
      currentRole = msg.role
    } else {
      currentGroup.push(msg)
    }
  }

  // Don't forget last group
  if (currentGroup.length > 0) {
    result.push(mergeMessages(currentGroup, tokenizer))
  }

  return result
}

/**
 * Merge multiple messages into one
 */
function mergeMessages(messages: CoreMessage[], _tokenizer: Tokenizer): CoreMessage {
  if (messages.length === 1) return messages[0]

  const role = messages[0].role
  const contents: string[] = []

  for (const msg of messages) {
    const content =
      typeof msg.content === 'string'
        ? msg.content
        : JSON.stringify(msg.content)
    contents.push(content)
  }

  return {
    role,
    content: contents.join('\n\n'),
  } as CoreMessage
}

/**
 * Tool condensing - compress verbose tool outputs
 */
function applyToolCondensing(
  messages: CoreMessage[],
  tokenizer: Tokenizer,
  maxToolOutputTokens: number
): CoreMessage[] {
  return messages.map((msg) => {
    // Look for tool results in content
    if (msg.role === 'assistant' || msg.role === 'tool') {
      const tokens = estimateSingleMessageTokens(msg, tokenizer)

      if (tokens > maxToolOutputTokens) {
        // Condense the content
        const content =
          typeof msg.content === 'string'
            ? msg.content
            : JSON.stringify(msg.content)

        // Try to extract key information
        const condensed = condenseToolOutput(content, maxToolOutputTokens)

        return {
          ...msg,
          content: condensed,
        }
      }
    }

    return msg
  })
}

/**
 * Condense a tool output to fit token budget
 */
function condenseToolOutput(content: string, maxTokens: number): string {
  const charLimit = maxTokens * 4 // Approximate chars per token

  if (content.length <= charLimit) return content

  // Try to parse as JSON and extract key fields
  try {
    const parsed = JSON.parse(content)

    if (Array.isArray(parsed)) {
      // For arrays, take first and last items with count
      const count = parsed.length
      if (count > 3) {
        const condensedArray = [
          parsed[0],
          `... ${count - 2} more items ...`,
          parsed[count - 1],
        ]
        const result = JSON.stringify(condensedArray, null, 0)
        if (result.length <= charLimit) return result
      }
    }

    if (typeof parsed === 'object' && parsed !== null) {
      // For objects, keep most important keys
      const keys = Object.keys(parsed)
      const importantKeys = ['id', 'name', 'title', 'status', 'result', 'error', 'message']
      const keptKeys = keys.filter(
        (k) => importantKeys.includes(k.toLowerCase()) || keys.indexOf(k) < 5
      )

      const condensedObj: Record<string, unknown> = {}
      for (const key of keptKeys) {
        condensedObj[key] = parsed[key]
      }

      if (keys.length > keptKeys.length) {
        condensedObj['_note'] = `${keys.length - keptKeys.length} fields omitted`
      }

      const result = JSON.stringify(condensedObj, null, 0)
      if (result.length <= charLimit) return result
    }
  } catch {
    // Not JSON, fall through to text truncation
  }

  // Fall back to simple truncation with ellipsis
  return content.slice(0, charLimit - 20) + '\n... [truncated]'
}

/**
 * Intent-preserving summarization
 */
async function applyIntentSummarization(
  messages: CoreMessage[],
  tokenizer: Tokenizer,
  summarizeFn: (messages: CoreMessage[], context?: string) => Promise<string> | string,
  keepRecentMessages: number
): Promise<CoreMessage[]> {
  if (messages.length <= keepRecentMessages + 1) {
    return messages
  }

  // Separate system, old, and recent messages
  const systemMessages = messages.filter((m) => m.role === 'system')
  const nonSystemMessages = messages.filter((m) => m.role !== 'system')

  if (nonSystemMessages.length <= keepRecentMessages) {
    return messages
  }

  const recentMessages = nonSystemMessages.slice(-keepRecentMessages)
  const olderMessages = nonSystemMessages.slice(0, -keepRecentMessages)

  // Summarize older messages
  const summary = await summarizeFn(olderMessages)

  const summaryMessage: CoreMessage = {
    role: 'system',
    content: `[Conversation history summary]\n${summary}`,
  } as CoreMessage

  return [...systemMessages, summaryMessage, ...recentMessages]
}

/**
 * Extract key points from messages for summarization
 */
export function extractKeyPoints(messages: CoreMessage[]): string[] {
  const keyPoints: string[] = []

  for (const msg of messages) {
    const content =
      typeof msg.content === 'string'
        ? msg.content
        : JSON.stringify(msg.content)

    // Extract questions
    const questions = content.match(/[^.!?]*\?/g)
    if (questions) {
      keyPoints.push(...questions.map((q) => `Q: ${q.trim()}`))
    }

    // Extract statements with key indicators
    const keyIndicators = [
      /I need|I want|please|help me/i,
      /the result is|the answer is|in summary/i,
      /error:|warning:|important:/i,
    ]

    for (const indicator of keyIndicators) {
      const sentences = content.split(/[.!]/)
      for (const sentence of sentences) {
        if (indicator.test(sentence) && sentence.length > 20) {
          keyPoints.push(sentence.trim())
        }
      }
    }
  }

  return [...new Set(keyPoints)].slice(0, 10) // Dedupe and limit
}
