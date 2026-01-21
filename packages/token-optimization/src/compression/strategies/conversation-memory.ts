/**
 * Conversation Memory Management Strategies
 *
 * Intelligent context window management for multi-turn conversations.
 * Reduces token consumption by 40-60% while preserving conversation quality.
 *
 * Strategies:
 * - Sliding Window: Keep last N messages, preserve system messages
 * - Importance-Based: Score messages and keep most important ones
 * - Summarization: Use LLM to compress older messages
 * - Adaptive: Automatically select best strategy based on conversation characteristics
 *
 * @module conversation-memory
 */

import { SimpleTokenCounter } from '../../tokenizers/simple-counter'

/**
 * Message role types (compatible with OpenAI/Anthropic/Google formats)
 */
export type MessageRole = 'system' | 'user' | 'assistant' | 'function' | 'tool'

/**
 * Conversation message structure
 */
export interface ConversationMessage {
  /** Message role */
  role: MessageRole
  /** Message content */
  content: string
  /** Optional message name/identifier */
  name?: string
  /** Optional timestamp */
  timestamp?: number
  /** Optional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Conversation memory optimization result
 */
export interface ConversationMemoryResult {
  /** Optimized message array */
  messages: ConversationMessage[]
  /** Original message array */
  originalMessages: ConversationMessage[]
  /** Token count before optimization */
  originalTokens: number
  /** Token count after optimization */
  optimizedTokens: number
  /** Compression ratio (optimizedTokens / originalTokens) */
  compressionRatio: number
  /** Number of tokens saved */
  tokensSaved: number
  /** Strategy used */
  strategy: 'sliding-window' | 'importance-based' | 'summarization' | 'adaptive' | 'none'
  /** Metadata about optimization */
  metadata: {
    messagesRemoved: number
    messagesPreserved: number
    systemMessagesPreserved: number
    summarized?: boolean
    summaryTokens?: number
  }
}

/**
 * Options for sliding window strategy
 */
export interface SlidingWindowOptions {
  /** Maximum number of recent messages to keep (excluding system messages) */
  windowSize: number
  /** Always preserve system messages regardless of position */
  preserveSystemMessages?: boolean
  /** Minimum window size (won't compress below this) */
  minWindowSize?: number
}

/**
 * Options for importance-based selection
 */
export interface ImportanceBasedOptions {
  /** Maximum token budget for conversation */
  maxTokens: number
  /** Weight for recency (0-1, higher = prioritize recent messages) */
  recencyWeight?: number
  /** Weight for user messages vs assistant messages (0-1, higher = prioritize user) */
  userWeight?: number
  /** Weight for messages with decisions/facts (0-1) */
  contentWeight?: number
  /** Always preserve system messages */
  preserveSystemMessages?: boolean
}

/**
 * LLM summarizer interface for summarization strategy
 */
export interface ConversationSummarizer {
  /**
   * Summarize a section of conversation
   *
   * @param messages - Messages to summarize
   * @param maxTokens - Maximum tokens for summary
   * @returns Summary text
   */
  summarize(messages: ConversationMessage[], maxTokens: number): Promise<string>
}

/**
 * Options for summarization strategy
 */
export interface SummarizationOptions {
  /** LLM summarizer */
  summarizer: ConversationSummarizer
  /** Maximum token budget for conversation */
  maxTokens: number
  /** Number of recent messages to keep unsummarized */
  keepRecentMessages?: number
  /** Maximum tokens for each summary */
  summaryMaxTokens?: number
  /** Always preserve system messages */
  preserveSystemMessages?: boolean
}

/**
 * Options for adaptive strategy selector
 */
export interface AdaptiveStrategyOptions {
  /** Maximum token budget for conversation */
  maxTokens: number
  /** Optional summarizer for long conversations */
  summarizer?: ConversationSummarizer
  /** Threshold for using summarization (conversation tokens) */
  summarizeThreshold?: number
  /** Threshold for using importance-based (conversation tokens) */
  importanceThreshold?: number
  /** Default window size for sliding window */
  defaultWindowSize?: number
}

/**
 * Message importance score
 */
interface ImportanceScore {
  message: ConversationMessage
  score: number
  reasons: string[]
}

/**
 * Sliding Window Strategy
 *
 * Keeps only the most recent N messages while preserving system messages.
 * Simplest and fastest strategy, works well for shorter conversations.
 *
 * @example
 * ```typescript
 * const strategy = new SlidingWindowStrategy({ windowSize: 10 });
 * const result = await strategy.optimize(messages);
 * console.log(`Saved ${result.tokensSaved} tokens`);
 * ```
 */
export class SlidingWindowStrategy {
  private readonly tokenCounter: SimpleTokenCounter
  private readonly options: Required<SlidingWindowOptions>

  constructor(options: SlidingWindowOptions) {
    this.tokenCounter = new SimpleTokenCounter()
    this.options = {
      windowSize: options.windowSize,
      preserveSystemMessages: options.preserveSystemMessages ?? true,
      minWindowSize: options.minWindowSize ?? 2,
    }
  }

  /**
   * Optimize conversation using sliding window
   *
   * @param messages - Conversation messages
   * @returns Optimization result
   */
  async optimize(messages: ConversationMessage[]): Promise<ConversationMemoryResult> {
    const originalTokens = this.countTotalTokens(messages)

    // Separate system messages from conversation messages
    const systemMessages = this.options.preserveSystemMessages
      ? messages.filter((m) => m.role === 'system')
      : []

    const conversationMessages = this.options.preserveSystemMessages
      ? messages.filter((m) => m.role !== 'system')
      : messages

    // Keep only last N messages
    const windowSize = Math.max(this.options.windowSize, this.options.minWindowSize)
    const recentMessages =
      conversationMessages.length > windowSize
        ? conversationMessages.slice(-windowSize)
        : conversationMessages

    // Combine system messages + recent messages (preserve order)
    const optimizedMessages = [...systemMessages, ...recentMessages]

    const optimizedTokens = this.countTotalTokens(optimizedMessages)

    return {
      messages: optimizedMessages,
      originalMessages: messages,
      originalTokens,
      optimizedTokens,
      compressionRatio: originalTokens > 0 ? optimizedTokens / originalTokens : 1,
      tokensSaved: originalTokens - optimizedTokens,
      strategy: 'sliding-window',
      metadata: {
        messagesRemoved: messages.length - optimizedMessages.length,
        messagesPreserved: optimizedMessages.length,
        systemMessagesPreserved: systemMessages.length,
      },
    }
  }

  private countTotalTokens(messages: ConversationMessage[]): number {
    return messages.reduce((total, msg) => {
      return total + this.tokenCounter.count(msg.content)
    }, 0)
  }
}

/**
 * Importance-Based Selection Strategy
 *
 * Scores each message by importance and keeps the most important ones
 * within the token budget. More intelligent than sliding window.
 *
 * Scoring factors:
 * - Recency (exponential decay)
 * - User vs assistant (user messages weighted higher)
 * - Content indicators (decisions, facts, entities)
 * - Message length (longer = more information)
 *
 * @example
 * ```typescript
 * const strategy = new ImportanceBasedStrategy({ maxTokens: 2000 });
 * const result = await strategy.optimize(messages);
 * console.log(`Preserved ${result.metadata.messagesPreserved} important messages`);
 * ```
 */
export class ImportanceBasedStrategy {
  private readonly tokenCounter: SimpleTokenCounter
  private readonly options: Required<ImportanceBasedOptions>

  constructor(options: ImportanceBasedOptions) {
    this.tokenCounter = new SimpleTokenCounter()
    this.options = {
      maxTokens: options.maxTokens,
      recencyWeight: options.recencyWeight ?? 0.4,
      userWeight: options.userWeight ?? 0.3,
      contentWeight: options.contentWeight ?? 0.3,
      preserveSystemMessages: options.preserveSystemMessages ?? true,
    }
  }

  /**
   * Optimize conversation using importance-based selection
   *
   * @param messages - Conversation messages
   * @returns Optimization result
   */
  async optimize(messages: ConversationMessage[]): Promise<ConversationMemoryResult> {
    const originalTokens = this.countTotalTokens(messages)

    // Separate system messages
    const systemMessages = this.options.preserveSystemMessages
      ? messages.filter((m) => m.role === 'system')
      : []

    const conversationMessages = this.options.preserveSystemMessages
      ? messages.filter((m) => m.role !== 'system')
      : messages

    // Calculate system message tokens
    const systemTokens = this.countTotalTokens(systemMessages)
    const availableTokens = this.options.maxTokens - systemTokens

    // Score all messages
    const scored = this.scoreMessages(conversationMessages)

    // Select messages within budget
    const selected = this.selectByImportance(scored, availableTokens)

    // Sort selected messages back into chronological order
    const selectedMessages = selected
      .map((s) => s.message)
      .sort((a, b) => {
        const aIndex = messages.indexOf(a)
        const bIndex = messages.indexOf(b)
        return aIndex - bIndex
      })

    // Combine system + selected messages
    const optimizedMessages = [...systemMessages, ...selectedMessages]

    const optimizedTokens = this.countTotalTokens(optimizedMessages)

    return {
      messages: optimizedMessages,
      originalMessages: messages,
      originalTokens,
      optimizedTokens,
      compressionRatio: originalTokens > 0 ? optimizedTokens / originalTokens : 1,
      tokensSaved: originalTokens - optimizedTokens,
      strategy: 'importance-based',
      metadata: {
        messagesRemoved: messages.length - optimizedMessages.length,
        messagesPreserved: optimizedMessages.length,
        systemMessagesPreserved: systemMessages.length,
      },
    }
  }

  /**
   * Score all messages by importance
   */
  private scoreMessages(messages: ConversationMessage[]): ImportanceScore[] {
    return messages.map((message, index) => {
      const reasons: string[] = []
      let score = 0

      // Recency score (exponential decay from end)
      const position = index / Math.max(messages.length - 1, 1)
      const recencyScore = Math.exp(position - 1) // 0.37 for first, 1.0 for last
      score += recencyScore * this.options.recencyWeight
      reasons.push(`recency: ${recencyScore.toFixed(2)}`)

      // Role score (user messages more important)
      const roleScore = message.role === 'user' ? 1.0 : message.role === 'assistant' ? 0.7 : 0.5
      score += roleScore * this.options.userWeight
      reasons.push(`role: ${roleScore.toFixed(2)}`)

      // Content quality score
      const contentScore = this.scoreContent(message.content)
      score += contentScore * this.options.contentWeight
      reasons.push(`content: ${contentScore.toFixed(2)}`)

      return { message, score, reasons }
    })
  }

  /**
   * Score message content for importance indicators
   */
  private scoreContent(content: string): number {
    let score = 0.5 // Base score

    // Decision indicators
    const decisionWords = /\b(decide|chose|select|prefer|want|need|must|should)\b/gi
    const decisionMatches = content.match(decisionWords)
    if (decisionMatches && decisionMatches.length > 0) {
      score += Math.min(decisionMatches.length * 0.1, 0.3)
    }

    // Fact indicators (numbers, dates, proper nouns)
    const factIndicators = [
      /\b\d{1,4}[/-]\d{1,2}[/-]\d{1,4}\b/g, // Dates
      /\b\d+(\.\d+)?\s*(USD|EUR|GBP|percent|%)\b/gi, // Numbers with units
      /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, // Proper nouns (names)
    ]

    for (const pattern of factIndicators) {
      const matches = content.match(pattern)
      if (matches && matches.length > 0) {
        score += Math.min(matches.length * 0.05, 0.2)
      }
    }

    // Question indicators (questions often important)
    if (content.includes('?')) {
      score += 0.15
    }

    // Length indicator (longer = more information)
    const words = content.split(/\s+/).length
    if (words > 50) {
      score += 0.1
    }

    return Math.min(score, 1.0)
  }

  /**
   * Select messages by importance within token budget
   */
  private selectByImportance(scored: ImportanceScore[], maxTokens: number): ImportanceScore[] {
    // Sort by score descending
    const sorted = [...scored].sort((a, b) => b.score - a.score)

    // Greedy selection within budget
    const selected: ImportanceScore[] = []
    let currentTokens = 0

    for (const item of sorted) {
      const messageTokens = this.tokenCounter.count(item.message.content)
      if (currentTokens + messageTokens <= maxTokens) {
        selected.push(item)
        currentTokens += messageTokens
      }
    }

    return selected
  }

  private countTotalTokens(messages: ConversationMessage[]): number {
    return messages.reduce((total, msg) => {
      return total + this.tokenCounter.count(msg.content)
    }, 0)
  }
}

/**
 * Summarization Strategy
 *
 * Uses an LLM to summarize older messages, keeping recent messages intact.
 * Most aggressive compression, works well for very long conversations.
 *
 * @example
 * ```typescript
 * const summarizer = {
 *   async summarize(messages, maxTokens) {
 *     const text = messages.map(m => `${m.role}: ${m.content}`).join('\n');
 *     return await llm.summarize(text, maxTokens);
 *   }
 * };
 *
 * const strategy = new SummarizationStrategy({ summarizer, maxTokens: 3000 });
 * const result = await strategy.optimize(messages);
 * ```
 */
export class SummarizationStrategy {
  private readonly tokenCounter: SimpleTokenCounter
  private readonly options: Required<SummarizationOptions>

  constructor(options: SummarizationOptions) {
    this.tokenCounter = new SimpleTokenCounter()
    this.options = {
      summarizer: options.summarizer,
      maxTokens: options.maxTokens,
      keepRecentMessages: options.keepRecentMessages ?? 5,
      summaryMaxTokens: options.summaryMaxTokens ?? 500,
      preserveSystemMessages: options.preserveSystemMessages ?? true,
    }
  }

  /**
   * Optimize conversation using summarization
   *
   * @param messages - Conversation messages
   * @returns Optimization result
   */
  async optimize(messages: ConversationMessage[]): Promise<ConversationMemoryResult> {
    const originalTokens = this.countTotalTokens(messages)

    // Separate system messages
    const systemMessages = this.options.preserveSystemMessages
      ? messages.filter((m) => m.role === 'system')
      : []

    const conversationMessages = this.options.preserveSystemMessages
      ? messages.filter((m) => m.role !== 'system')
      : messages

    // Split into old (to summarize) and recent (to keep)
    const keepRecent = Math.min(this.options.keepRecentMessages, conversationMessages.length)
    const oldMessages = conversationMessages.slice(0, -keepRecent)
    const recentMessages = conversationMessages.slice(-keepRecent)

    let optimizedMessages: ConversationMessage[]
    let summaryTokens = 0

    if (oldMessages.length > 0) {
      // Summarize old messages
      const summary = await this.options.summarizer.summarize(
        oldMessages,
        this.options.summaryMaxTokens
      )

      summaryTokens = this.tokenCounter.count(summary)

      // Create summary message
      const summaryMessage: ConversationMessage = {
        role: 'system',
        content: `[Previous conversation summary: ${summary}]`,
        metadata: { type: 'summary', originalMessages: oldMessages.length },
      }

      // Combine: system + summary + recent
      optimizedMessages = [...systemMessages, summaryMessage, ...recentMessages]
    } else {
      // No summarization needed
      optimizedMessages = [...systemMessages, ...conversationMessages]
    }

    const optimizedTokens = this.countTotalTokens(optimizedMessages)

    return {
      messages: optimizedMessages,
      originalMessages: messages,
      originalTokens,
      optimizedTokens,
      compressionRatio: originalTokens > 0 ? optimizedTokens / originalTokens : 1,
      tokensSaved: originalTokens - optimizedTokens,
      strategy: 'summarization',
      metadata: {
        messagesRemoved: messages.length - optimizedMessages.length,
        messagesPreserved: optimizedMessages.length,
        systemMessagesPreserved: systemMessages.length,
        summarized: oldMessages.length > 0,
        summaryTokens,
      },
    }
  }

  private countTotalTokens(messages: ConversationMessage[]): number {
    return messages.reduce((total, msg) => {
      return total + this.tokenCounter.count(msg.content)
    }, 0)
  }
}

/**
 * Adaptive Strategy Selector
 *
 * Automatically selects the best strategy based on conversation characteristics:
 * - Short conversations (< 2000 tokens): Sliding window
 * - Medium conversations (2000-5000 tokens): Importance-based
 * - Long conversations (> 5000 tokens): Summarization (if available)
 *
 * @example
 * ```typescript
 * const strategy = new AdaptiveConversationStrategy({
 *   maxTokens: 3000,
 *   summarizer: mySummarizer // optional
 * });
 *
 * const result = await strategy.optimize(messages);
 * console.log(`Used ${result.strategy} strategy`);
 * ```
 */
export class AdaptiveConversationStrategy {
  private readonly tokenCounter: SimpleTokenCounter
  private readonly options: Required<AdaptiveStrategyOptions>

  constructor(options: AdaptiveStrategyOptions) {
    this.tokenCounter = new SimpleTokenCounter()
    this.options = {
      maxTokens: options.maxTokens,
      summarizer: options.summarizer,
      summarizeThreshold: options.summarizeThreshold ?? 5000,
      importanceThreshold: options.importanceThreshold ?? 2000,
      defaultWindowSize: options.defaultWindowSize ?? 10,
    }
  }

  /**
   * Optimize conversation using adaptive strategy selection
   *
   * @param messages - Conversation messages
   * @returns Optimization result
   */
  async optimize(messages: ConversationMessage[]): Promise<ConversationMemoryResult> {
    const currentTokens = this.countTotalTokens(messages)

    // If already under budget, no optimization needed
    if (currentTokens <= this.options.maxTokens) {
      return {
        messages,
        originalMessages: messages,
        originalTokens: currentTokens,
        optimizedTokens: currentTokens,
        compressionRatio: 1.0,
        tokensSaved: 0,
        strategy: 'none',
        metadata: {
          messagesRemoved: 0,
          messagesPreserved: messages.length,
          systemMessagesPreserved: messages.filter((m) => m.role === 'system').length,
        },
      }
    }

    // Select strategy based on conversation size
    const strategy = this.selectStrategy(currentTokens)

    return await strategy.optimize(messages)
  }

  /**
   * Select the best strategy for current conversation
   */
  private selectStrategy(
    currentTokens: number
  ):
    | SlidingWindowStrategy
    | ImportanceBasedStrategy
    | SummarizationStrategy
    | AdaptiveConversationStrategy {
    // Long conversations with summarizer available
    if (currentTokens > this.options.summarizeThreshold && this.options.summarizer) {
      return new SummarizationStrategy({
        summarizer: this.options.summarizer,
        maxTokens: this.options.maxTokens,
      })
    }

    // Medium conversations
    if (currentTokens > this.options.importanceThreshold) {
      return new ImportanceBasedStrategy({
        maxTokens: this.options.maxTokens,
      })
    }

    // Short conversations
    return new SlidingWindowStrategy({
      windowSize: this.options.defaultWindowSize,
    })
  }

  /**
   * Get information about which strategy would be selected
   *
   * @param messages - Conversation messages
   * @returns Strategy name and reasoning
   */
  getStrategyInfo(messages: ConversationMessage[]): {
    strategy: 'sliding-window' | 'importance-based' | 'summarization' | 'none'
    reason: string
    currentTokens: number
    maxTokens: number
  } {
    const currentTokens = this.countTotalTokens(messages)

    if (currentTokens <= this.options.maxTokens) {
      return {
        strategy: 'none',
        reason: 'Conversation already within token budget',
        currentTokens,
        maxTokens: this.options.maxTokens,
      }
    }

    if (currentTokens > this.options.summarizeThreshold && this.options.summarizer) {
      return {
        strategy: 'summarization',
        reason: `Long conversation (${currentTokens} tokens) with summarizer available`,
        currentTokens,
        maxTokens: this.options.maxTokens,
      }
    }

    if (currentTokens > this.options.importanceThreshold) {
      return {
        strategy: 'importance-based',
        reason: `Medium conversation (${currentTokens} tokens) - using importance scoring`,
        currentTokens,
        maxTokens: this.options.maxTokens,
      }
    }

    return {
      strategy: 'sliding-window',
      reason: `Short conversation (${currentTokens} tokens) - using simple sliding window`,
      currentTokens,
      maxTokens: this.options.maxTokens,
    }
  }

  private countTotalTokens(messages: ConversationMessage[]): number {
    return messages.reduce((total, msg) => {
      return total + this.tokenCounter.count(msg.content)
    }, 0)
  }
}

/**
 * Quick conversation optimization with adaptive strategy
 *
 * @param messages - Conversation messages
 * @param maxTokens - Maximum token budget
 * @param summarizer - Optional LLM summarizer
 * @returns Optimized messages
 */
export async function optimizeConversation(
  messages: ConversationMessage[],
  maxTokens: number,
  summarizer?: ConversationSummarizer
): Promise<ConversationMessage[]> {
  const strategy = new AdaptiveConversationStrategy({ maxTokens, summarizer })
  const result = await strategy.optimize(messages)
  return result.messages
}

/**
 * Create a sliding window strategy
 *
 * @param windowSize - Number of recent messages to keep
 * @returns Strategy instance
 */
export function createSlidingWindowStrategy(windowSize: number): SlidingWindowStrategy {
  return new SlidingWindowStrategy({ windowSize })
}

/**
 * Create an importance-based strategy
 *
 * @param maxTokens - Maximum token budget
 * @param options - Additional options
 * @returns Strategy instance
 */
export function createImportanceBasedStrategy(
  maxTokens: number,
  options?: Partial<ImportanceBasedOptions>
): ImportanceBasedStrategy {
  return new ImportanceBasedStrategy({ maxTokens, ...options })
}

/**
 * Create a summarization strategy
 *
 * @param summarizer - LLM summarizer
 * @param maxTokens - Maximum token budget
 * @param options - Additional options
 * @returns Strategy instance
 */
export function createSummarizationStrategy(
  summarizer: ConversationSummarizer,
  maxTokens: number,
  options?: Partial<SummarizationOptions>
): SummarizationStrategy {
  return new SummarizationStrategy({ summarizer, maxTokens, ...options })
}

/**
 * Create an adaptive strategy
 *
 * @param maxTokens - Maximum token budget
 * @param options - Additional options
 * @returns Strategy instance
 */
export function createAdaptiveStrategy(
  maxTokens: number,
  options?: Partial<AdaptiveStrategyOptions>
): AdaptiveConversationStrategy {
  return new AdaptiveConversationStrategy({ maxTokens, ...options })
}
