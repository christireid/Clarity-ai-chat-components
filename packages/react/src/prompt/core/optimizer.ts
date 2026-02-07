/**
 * Message Optimization Strategies
 *
 * Strategies for optimizing message arrays to fit within token budgets.
 */

import type { CoreMessage } from '../../internal/hooks/use-chat-enhanced'
import type { Tokenizer, ModelMetadata } from './tokenizer'
import {
  estimateMessageTokens,
  estimateSingleMessageTokens,
  getTokenizerForModel,
} from './tokenizer'

/**
 * Optimization strategy types
 */
export type OptimizationStrategy =
  | 'sliding-window'
  | 'summarize-old'
  | 'drop-low-priority'
  | 'hybrid'

/**
 * Message priority definition
 */
export interface MessagePriority {
  /** Message ID or index */
  messageId: string | number
  /** Priority score (0-10, higher is more important) */
  priority: number
  /** Optional reason for priority */
  reason?: string
}

/**
 * Optimization options
 */
export interface OptimizationOptions {
  /** Target token budget */
  targetTokens: number
  /** Optimization strategy */
  strategy: OptimizationStrategy
  /** Model metadata for accurate token counting */
  modelMetadata?: ModelMetadata | string
  /** Tokenizer to use */
  tokenizer?: Tokenizer
  /** Message priorities */
  priorities?: MessagePriority[]
  /** Summarization function for summarize-old strategy */
  summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string
  /** Number of recent messages to always keep */
  keepRecent?: number
}

/**
 * Optimization result
 */
export interface OptimizationResult {
  /** Optimized messages */
  optimizedMessages: CoreMessage[]
  /** Optimization diagnostics */
  diagnostics: {
    originalTokens: number
    optimizedTokens: number
    messagesRemoved: number
    messagesSummarized: number
    strategy: string
    details: string[]
  }
}

/**
 * Optimize messages to fit within token budget
 */
export async function optimizeMessagesForBudget(
  messages: CoreMessage[],
  options: OptimizationOptions
): Promise<OptimizationResult> {
  const {
    targetTokens,
    strategy,
    modelMetadata,
    tokenizer: customTokenizer,
    priorities = [],
    summarizeFn,
    keepRecent = 2,
  } = options

  // Resolve tokenizer
  const tokenizer =
    customTokenizer ??
    getTokenizerForModel(
      typeof modelMetadata === 'string'
        ? modelMetadata
        : (modelMetadata?.model ?? 'gpt-4')
    )

  const originalTokens = estimateMessageTokens(messages, tokenizer)
  const details: string[] = []

  // If already within budget, return as-is
  if (originalTokens <= targetTokens) {
    return {
      optimizedMessages: messages,
      diagnostics: {
        originalTokens,
        optimizedTokens: originalTokens,
        messagesRemoved: 0,
        messagesSummarized: 0,
        strategy: 'none',
        details: ['Already within budget'],
      },
    }
  }

  let optimizedMessages: CoreMessage[]
  let messagesRemoved = 0
  let messagesSummarized = 0

  switch (strategy) {
    case 'sliding-window':
      ;({ optimizedMessages, messagesRemoved } = applySlidingWindow(
        messages,
        targetTokens,
        tokenizer,
        keepRecent
      ))
      details.push(`Removed ${messagesRemoved} oldest messages`)
      break

    case 'summarize-old':
      if (summarizeFn) {
        ;({ optimizedMessages, messagesSummarized } = await applySummarization(
          messages,
          targetTokens,
          tokenizer,
          summarizeFn,
          keepRecent
        ))
        details.push(`Summarized ${messagesSummarized} messages`)
      } else {
        // Fall back to sliding window if no summarization function
        ;({ optimizedMessages, messagesRemoved } = applySlidingWindow(
          messages,
          targetTokens,
          tokenizer,
          keepRecent
        ))
        details.push('No summarization function provided, used sliding window')
        details.push(`Removed ${messagesRemoved} oldest messages`)
      }
      break

    case 'drop-low-priority':
      ;({ optimizedMessages, messagesRemoved } = applyPriorityDropping(
        messages,
        targetTokens,
        tokenizer,
        priorities,
        keepRecent
      ))
      details.push(`Removed ${messagesRemoved} low-priority messages`)
      break

    case 'hybrid':
    default:
      ;({ optimizedMessages, messagesRemoved, messagesSummarized } =
        await applyHybridStrategy(
          messages,
          targetTokens,
          tokenizer,
          priorities,
          summarizeFn,
          keepRecent
        ))
      if (messagesSummarized > 0) {
        details.push(`Summarized ${messagesSummarized} messages`)
      }
      if (messagesRemoved > 0) {
        details.push(`Removed ${messagesRemoved} messages`)
      }
      break
  }

  const optimizedTokens = estimateMessageTokens(optimizedMessages, tokenizer)

  return {
    optimizedMessages,
    diagnostics: {
      originalTokens,
      optimizedTokens,
      messagesRemoved,
      messagesSummarized,
      strategy,
      details,
    },
  }
}

/**
 * Sliding window strategy - remove oldest messages first
 */
function applySlidingWindow(
  messages: CoreMessage[],
  targetTokens: number,
  tokenizer: Tokenizer,
  keepRecent: number
): { optimizedMessages: CoreMessage[]; messagesRemoved: number } {
  const result: CoreMessage[] = []
  let currentTokens = 0
  let messagesRemoved = 0

  // Always keep system messages and recent messages
  const systemMessages = messages.filter((m) => m.role === 'system')
  const nonSystemMessages = messages.filter((m) => m.role !== 'system')

  // Calculate tokens for system messages
  for (const msg of systemMessages) {
    currentTokens += estimateSingleMessageTokens(msg, tokenizer)
  }

  // Reserve space for recent messages
  const recentMessages = nonSystemMessages.slice(-keepRecent)
  let recentTokens = 0
  for (const msg of recentMessages) {
    recentTokens += estimateSingleMessageTokens(msg, tokenizer)
  }

  const availableForOlder = targetTokens - currentTokens - recentTokens

  // Add older messages from newest to oldest until budget exhausted
  const olderMessages = nonSystemMessages.slice(0, -keepRecent)
  const includedOlder: CoreMessage[] = []

  for (let i = olderMessages.length - 1; i >= 0; i--) {
    const msg = olderMessages[i]
    const msgTokens = estimateSingleMessageTokens(msg, tokenizer)

    if (currentTokens + msgTokens <= availableForOlder) {
      includedOlder.unshift(msg)
      currentTokens += msgTokens
    } else {
      messagesRemoved++
    }
  }

  // Combine: system + included older + recent
  result.push(...systemMessages, ...includedOlder, ...recentMessages)

  return { optimizedMessages: result, messagesRemoved }
}

/**
 * Summarization strategy - summarize older messages
 */
async function applySummarization(
  messages: CoreMessage[],
  targetTokens: number,
  tokenizer: Tokenizer,
  summarizeFn: (messages: CoreMessage[]) => Promise<string> | string,
  keepRecent: number
): Promise<{ optimizedMessages: CoreMessage[]; messagesSummarized: number }> {
  const systemMessages = messages.filter((m) => m.role === 'system')
  const nonSystemMessages = messages.filter((m) => m.role !== 'system')

  // Keep recent messages
  const recentMessages = nonSystemMessages.slice(-keepRecent)
  const olderMessages = nonSystemMessages.slice(0, -keepRecent)

  if (olderMessages.length === 0) {
    return {
      optimizedMessages: [...systemMessages, ...recentMessages],
      messagesSummarized: 0,
    }
  }

  // Summarize older messages
  const summary = await summarizeFn(olderMessages)
  const summaryMessage: CoreMessage = {
    role: 'system',
    content: `Previous conversation summary:\n${summary}`,
  } as CoreMessage

  const result = [...systemMessages, summaryMessage, ...recentMessages]

  return {
    optimizedMessages: result,
    messagesSummarized: olderMessages.length,
  }
}

/**
 * Priority-based dropping strategy
 */
function applyPriorityDropping(
  messages: CoreMessage[],
  targetTokens: number,
  tokenizer: Tokenizer,
  priorities: MessagePriority[],
  keepRecent: number
): { optimizedMessages: CoreMessage[]; messagesRemoved: number } {
  // Create priority map
  const priorityMap = new Map<string | number, number>()
  for (const p of priorities) {
    priorityMap.set(p.messageId, p.priority)
  }

  // Assign default priorities
  const messagesWithPriority = messages.map((msg, index) => ({
    message: msg,
    index,
    priority: priorityMap.get(index) ?? priorityMap.get(msg.id ?? '') ?? 5,
    tokens: estimateSingleMessageTokens(msg, tokenizer),
  }))

  // Protect recent messages and system messages
  const recentIndices = new Set(
    messages.slice(-keepRecent).map((_, i) => messages.length - keepRecent + i)
  )

  // Sort by priority (lower priority = drop first), but never drop system or recent
  const sortedMessages = [...messagesWithPriority].sort((a, b) => {
    const aProtected = a.message.role === 'system' || recentIndices.has(a.index)
    const bProtected = b.message.role === 'system' || recentIndices.has(b.index)

    if (aProtected && !bProtected) return -1
    if (!aProtected && bProtected) return 1

    return b.priority - a.priority // Higher priority first
  })

  // Take messages until budget is reached
  const result: CoreMessage[] = []
  let currentTokens = 0
  let messagesRemoved = 0

  for (const { message, tokens } of sortedMessages) {
    if (currentTokens + tokens <= targetTokens) {
      result.push(message)
      currentTokens += tokens
    } else {
      messagesRemoved++
    }
  }

  // Restore original order
  const originalOrder = new Map(messages.map((m, i) => [m, i]))
  result.sort(
    (a, b) => (originalOrder.get(a) ?? 0) - (originalOrder.get(b) ?? 0)
  )

  return { optimizedMessages: result, messagesRemoved }
}

/**
 * Hybrid strategy - combine multiple approaches
 */
async function applyHybridStrategy(
  messages: CoreMessage[],
  targetTokens: number,
  tokenizer: Tokenizer,
  priorities: MessagePriority[],
  summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string,
  keepRecent: number = 2
): Promise<{
  optimizedMessages: CoreMessage[]
  messagesRemoved: number
  messagesSummarized: number
}> {
  const originalTokens = estimateMessageTokens(messages, tokenizer)
  const overBudgetRatio = originalTokens / targetTokens

  let result: CoreMessage[] = messages
  let messagesRemoved = 0
  let messagesSummarized = 0

  // Step 1: If significantly over budget (>1.5x), try summarization first
  if (overBudgetRatio > 1.5 && summarizeFn) {
    const summarizationResult = await applySummarization(
      result,
      targetTokens,
      tokenizer,
      summarizeFn,
      keepRecent
    )
    result = summarizationResult.optimizedMessages
    messagesSummarized = summarizationResult.messagesSummarized

    const newTokens = estimateMessageTokens(result, tokenizer)
    if (newTokens <= targetTokens) {
      return { optimizedMessages: result, messagesRemoved, messagesSummarized }
    }
  }

  // Step 2: Apply priority dropping if still over budget
  const currentTokens = estimateMessageTokens(result, tokenizer)
  if (currentTokens > targetTokens && priorities.length > 0) {
    const priorityResult = applyPriorityDropping(
      result,
      targetTokens,
      tokenizer,
      priorities,
      keepRecent
    )
    result = priorityResult.optimizedMessages
    messagesRemoved += priorityResult.messagesRemoved

    const newTokens = estimateMessageTokens(result, tokenizer)
    if (newTokens <= targetTokens) {
      return { optimizedMessages: result, messagesRemoved, messagesSummarized }
    }
  }

  // Step 3: Apply sliding window as final fallback
  const finalTokens = estimateMessageTokens(result, tokenizer)
  if (finalTokens > targetTokens) {
    const windowResult = applySlidingWindow(
      result,
      targetTokens,
      tokenizer,
      keepRecent
    )
    result = windowResult.optimizedMessages
    messagesRemoved += windowResult.messagesRemoved
  }

  return { optimizedMessages: result, messagesRemoved, messagesSummarized }
}

/**
 * Summarize message history for compression
 * Creates a simple extractive summary
 */
export function summarizeHistoryForCompression(
  messages: CoreMessage[],
  maxLength: number = 500
): string {
  if (messages.length === 0) return ''

  const summaryParts: string[] = []
  let currentLength = 0

  for (const msg of messages) {
    const content =
      typeof msg.content === 'string'
        ? msg.content
        : JSON.stringify(msg.content)

    // Take first sentence or first 100 chars
    const preview = content.split(/[.!?]/)[0]?.slice(0, 100) ?? ''
    const part = `${msg.role}: ${preview}`

    if (currentLength + part.length > maxLength) break

    summaryParts.push(part)
    currentLength += part.length + 2
  }

  return summaryParts.join('\n')
}
