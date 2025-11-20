/**
 * Context Window Management Utilities
 *
 * Flexible utilities for managing context window limits and token budgets.
 * Works with any tokenizer or estimation function.
 */

export interface ContextMessage {
  role: 'system' | 'user' | 'assistant' | 'function'
  content: string
  name?: string
}

export interface ContextWindowOptions {
  /** Maximum context window size in tokens */
  maxTokens: number
  /** Reserved tokens for response */
  reservedTokens?: number
  /** Token counter function */
  countTokens: (text: string) => number
  /** Keep system message */
  keepSystemMessage?: boolean
  /** Minimum messages to keep */
  minMessages?: number
}

export interface TruncationStrategy {
  /** Strategy name */
  name: string
  /** Truncate messages */
  truncate(
    messages: ContextMessage[],
    options: ContextWindowOptions
  ): ContextMessage[] | Promise<ContextMessage[]>
}

/**
 * Simple FIFO truncation - removes oldest messages
 */
export class FIFOTruncation implements TruncationStrategy {
  name = 'fifo'

  truncate(
    messages: ContextMessage[],
    options: ContextWindowOptions
  ): ContextMessage[] {
    const maxTokens = options.maxTokens - (options.reservedTokens ?? 0)
    const minMessages = options.minMessages ?? 2
    const result: ContextMessage[] = []

    // Always keep system message if present and requested
    const systemMessage = messages.find((m) => m.role === 'system')
    if (systemMessage && options.keepSystemMessage !== false) {
      result.push(systemMessage)
    }

    // Get non-system messages
    const otherMessages = messages.filter((m) => m.role !== 'system')

    // Add from newest first
    let currentTokens = systemMessage
      ? options.countTokens(systemMessage.content)
      : 0

    for (let i = otherMessages.length - 1; i >= 0; i--) {
      const message = otherMessages[i]
      if (!message) continue
      const messageTokens = options.countTokens(message.content)

      if (currentTokens + messageTokens <= maxTokens) {
        result.unshift(message)
        currentTokens += messageTokens
      } else if (result.length < minMessages) {
        // Keep minimum messages even if over limit
        result.unshift(message)
        currentTokens += messageTokens
      } else {
        break
      }
    }

    // Put system message back at start
    if (systemMessage && options.keepSystemMessage !== false) {
      return [systemMessage, ...result.filter((m) => m.role !== 'system')]
    }

    return result
  }
}

/**
 * Sliding window truncation - keeps most recent N messages
 */
export class SlidingWindowTruncation implements TruncationStrategy {
  name = 'sliding-window'

  constructor(private windowSize: number = 10) {}

  truncate(
    messages: ContextMessage[],
    options: ContextWindowOptions
  ): ContextMessage[] {
    const systemMessage = messages.find((m) => m.role === 'system')
    const otherMessages = messages.filter((m) => m.role !== 'system')

    const kept = otherMessages.slice(-this.windowSize)

    if (systemMessage && options.keepSystemMessage !== false) {
      return [systemMessage, ...kept]
    }

    return kept
  }
}

/**
 * Smart truncation - preserves conversation structure
 * Keeps pairs of user/assistant messages together
 */
export class SmartTruncation implements TruncationStrategy {
  name = 'smart'

  truncate(
    messages: ContextMessage[],
    options: ContextWindowOptions
  ): ContextMessage[] {
    const maxTokens = options.maxTokens - (options.reservedTokens ?? 0)
    const result: ContextMessage[] = []

    const systemMessage = messages.find((m) => m.role === 'system')
    let currentTokens = systemMessage
      ? options.countTokens(systemMessage.content)
      : 0

    if (systemMessage && options.keepSystemMessage !== false) {
      result.push(systemMessage)
    }

    // Group messages into turns (user + assistant pairs)
    const turns: ContextMessage[][] = []
    let currentTurn: ContextMessage[] = []

    for (const message of messages) {
      if (message.role === 'system') continue

      if (message.role === 'user') {
        if (currentTurn.length > 0) {
          turns.push(currentTurn)
        }
        currentTurn = [message]
      } else {
        currentTurn.push(message)
      }
    }

    if (currentTurn.length > 0) {
      turns.push(currentTurn)
    }

    // Add turns from newest, keeping pairs together
    for (let i = turns.length - 1; i >= 0; i--) {
      const turn = turns[i]
      if (!turn) continue
      const turnTokens = turn.reduce(
        (sum, msg) => sum + options.countTokens(msg.content),
        0
      )

      if (currentTokens + turnTokens <= maxTokens) {
        result.unshift(...turn)
        currentTokens += turnTokens
      } else {
        break
      }
    }

    if (systemMessage && options.keepSystemMessage !== false) {
      return [systemMessage, ...result.filter((m) => m.role !== 'system')]
    }

    return result
  }
}

/**
 * Summarization truncation - summarizes old messages
 * Note: Requires a summarization function
 */
export class SummarizationTruncation implements TruncationStrategy {
  name = 'summarization'

  constructor(
    private summarize: (messages: ContextMessage[]) => Promise<string>,
    private summarizeAfter: number = 10
  ) {}

  async truncate(
    messages: ContextMessage[],
    options: ContextWindowOptions
  ): Promise<ContextMessage[]> {
    if (messages.length <= this.summarizeAfter) {
      return messages
    }

    const systemMessage = messages.find((m) => m.role === 'system')
    const otherMessages = messages.filter((m) => m.role !== 'system')

    // Keep recent messages
    const recentMessages = otherMessages.slice(-this.summarizeAfter)

    // Summarize old messages
    const oldMessages = otherMessages.slice(0, -this.summarizeAfter)
    const summary = await this.summarize(oldMessages)

    const summaryMessage: ContextMessage = {
      role: 'system',
      content: `Previous conversation summary: ${summary}`,
    }

    if (systemMessage && options.keepSystemMessage !== false) {
      return [systemMessage, summaryMessage, ...recentMessages]
    }

    return [summaryMessage, ...recentMessages]
  }
}

/**
 * Context window manager
 */
export class ContextWindowManager {
  private strategy: TruncationStrategy
  private options: ContextWindowOptions

  constructor(
    strategy: TruncationStrategy | 'fifo' | 'smart' | 'sliding-window',
    options: ContextWindowOptions
  ) {
    if (typeof strategy === 'string') {
      switch (strategy) {
        case 'fifo':
          this.strategy = new FIFOTruncation()
          break
        case 'smart':
          this.strategy = new SmartTruncation()
          break
        case 'sliding-window':
          this.strategy = new SlidingWindowTruncation()
          break
        default:
          this.strategy = new FIFOTruncation()
      }
    } else {
      this.strategy = strategy
    }

    this.options = options
  }

  /**
   * Truncate messages to fit within context window
   */
  truncate(
    messages: ContextMessage[]
  ): ContextMessage[] | Promise<ContextMessage[]> {
    return this.strategy.truncate(messages, this.options)
  }

  /**
   * Check if messages fit within context window
   */
  fitsInWindow(messages: ContextMessage[]): boolean {
    const totalTokens = messages.reduce(
      (sum, msg) => sum + this.options.countTokens(msg.content),
      0
    )
    const maxTokens =
      this.options.maxTokens - (this.options.reservedTokens ?? 0)
    return totalTokens <= maxTokens
  }

  /**
   * Get total token count for messages
   */
  countTokens(messages: ContextMessage[]): number {
    return messages.reduce(
      (sum, msg) => sum + this.options.countTokens(msg.content),
      0
    )
  }

  /**
   * Get remaining tokens in window
   */
  getRemainingTokens(messages: ContextMessage[]): number {
    const used = this.countTokens(messages)
    const maxTokens =
      this.options.maxTokens - (this.options.reservedTokens ?? 0)
    return Math.max(0, maxTokens - used)
  }
}

/**
 * Simple token estimation (rough, use proper tokenizer in production)
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4)
}
