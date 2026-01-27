/**
 * Context Manager
 *
 * Advanced conversation context management with:
 * - Intelligent message summarization
 * - Context window optimization
 * - Important context retention
 * - Token budget management
 * - Sliding window compression
 *
 * @version 1.0.0
 * @lastUpdated January 2026
 */

import { estimateTokens } from './tokenUtils'
import type { SessionMessage } from './sessionStore'

/**
 * Context compression strategy
 */
export type CompressionStrategy =
  | 'none' // No compression (within budget)
  | 'sliding-window' // Keep most recent N messages
  | 'summarize-old' // Summarize older messages
  | 'hierarchical' // Multi-level summarization
  | 'aggressive' // Emergency compression

/**
 * Message importance score
 */
export interface MessageImportance {
  score: number // 0-100
  reasons: string[]
  isSystemMessage: boolean
  hasCodeExample: boolean
  hasError: boolean
  isUserPreference: boolean
}

/**
 * Context optimization result
 */
export interface OptimizedContext {
  messages: SessionMessage[]
  summary: string | null
  strategy: CompressionStrategy
  originalTokens: number
  optimizedTokens: number
  compressionRatio: number
  keptMessages: number
  summarizedMessages: number
}

/**
 * Context manager configuration
 */
export interface ContextManagerConfig {
  /** Maximum tokens for conversation history */
  maxContextTokens: number
  /** Reserve tokens for system prompt and response */
  reservedTokens: number
  /** Minimum messages to keep (even if over budget) */
  minMessagesToKeep: number
  /** Number of recent messages to always keep */
  recentMessagesToKeep: number
  /** Enable automatic summarization */
  enableSummarization: boolean
  /** Target compression ratio when summarizing */
  targetCompressionRatio: number
}

/**
 * Default context manager configuration
 */
export const DEFAULT_CONTEXT_CONFIG: ContextManagerConfig = {
  maxContextTokens: 8000, // 8K tokens for context
  reservedTokens: 4000, // 4K for system + response
  minMessagesToKeep: 2, // At least last user message and response
  recentMessagesToKeep: 10, // Keep last 10 messages intact
  enableSummarization: true,
  targetCompressionRatio: 0.3, // Compress to 30% of original
}

/**
 * Context Manager
 *
 * Manages conversation history to stay within token budgets while
 * preserving important context and conversation flow.
 */
export class ContextManager {
  private config: ContextManagerConfig

  constructor(config: Partial<ContextManagerConfig> = {}) {
    this.config = { ...DEFAULT_CONTEXT_CONFIG, ...config }
  }

  /**
   * Optimize conversation context to fit within token budget
   */
  async optimizeContext(
    messages: SessionMessage[],
    modelContextWindow: number = 128000
  ): Promise<OptimizedContext> {
    const originalTokens = this.calculateTotalTokens(messages)
    const availableTokens = modelContextWindow - this.config.reservedTokens
    const targetTokens = Math.min(this.config.maxContextTokens, availableTokens)

    // If within budget, no optimization needed
    if (originalTokens <= targetTokens) {
      return {
        messages,
        summary: null,
        strategy: 'none',
        originalTokens,
        optimizedTokens: originalTokens,
        compressionRatio: 1.0,
        keptMessages: messages.length,
        summarizedMessages: 0,
      }
    }

    // Calculate importance scores
    const importanceScores = messages.map((msg, idx) =>
      this.calculateImportance(msg, idx, messages)
    )

    // Determine compression strategy
    const strategy = this.selectCompressionStrategy(
      originalTokens,
      targetTokens,
      messages.length
    )

    // Apply strategy
    switch (strategy) {
      case 'sliding-window':
        return this.applySlidingWindow(messages, targetTokens, originalTokens)

      case 'summarize-old':
        return await this.summarizeOldMessages(
          messages,
          targetTokens,
          originalTokens,
          importanceScores
        )

      case 'hierarchical':
        return await this.applyHierarchicalSummarization(
          messages,
          targetTokens,
          originalTokens,
          importanceScores
        )

      case 'aggressive':
        return this.applyAggressiveCompression(
          messages,
          targetTokens,
          originalTokens,
          importanceScores
        )

      default:
        return this.applySlidingWindow(messages, targetTokens, originalTokens)
    }
  }

  /**
   * Calculate importance score for a message
   */
  private calculateImportance(
    message: SessionMessage,
    index: number,
    allMessages: SessionMessage[]
  ): MessageImportance {
    let score = 0
    const reasons: string[] = []

    // System messages are critical
    const isSystemMessage = message.role === 'system'
    if (isSystemMessage) {
      score += 100
      reasons.push('System message')
    }

    // Recent messages are more important (recency bias)
    const recencyScore = (index / allMessages.length) * 30
    score += recencyScore
    if (recencyScore > 20) {
      reasons.push('Recent message')
    }

    // Messages with code examples are valuable
    const hasCodeExample =
      message.content.includes('```') || message.content.includes('<code>')
    if (hasCodeExample) {
      score += 25
      reasons.push('Contains code example')
    }

    // Error messages are important for context
    const hasError =
      message.content.toLowerCase().includes('error') ||
      message.content.toLowerCase().includes('warning') ||
      message.metadata?.hasError === true
    if (hasError) {
      score += 20
      reasons.push('Contains error information')
    }

    // User preferences/configuration are critical
    const isUserPreference =
      message.content.toLowerCase().includes('prefer') ||
      message.content.toLowerCase().includes('setting') ||
      message.metadata?.isPreference === true
    if (isUserPreference) {
      score += 30
      reasons.push('User preference')
    }

    // Messages with citations/sources are valuable
    const hasSources = message.metadata?.sources && message.metadata.sources.length > 0
    if (hasSources) {
      score += 15
      reasons.push('Contains source citations')
    }

    // Longer, detailed responses are more valuable
    const lengthScore = Math.min((message.content.length / 1000) * 10, 15)
    score += lengthScore

    // First message in conversation has context
    if (index <= 1) {
      score += 15
      reasons.push('Early conversation context')
    }

    return {
      score,
      reasons,
      isSystemMessage,
      hasCodeExample,
      hasError,
      isUserPreference,
    }
  }

  /**
   * Select optimal compression strategy
   */
  private selectCompressionStrategy(
    currentTokens: number,
    targetTokens: number,
    messageCount: number
  ): CompressionStrategy {
    const overageRatio = currentTokens / targetTokens

    // Severe overage (>3x budget)
    if (overageRatio > 3) {
      return 'aggressive'
    }

    // Moderate overage (2-3x budget)
    if (overageRatio > 2) {
      return 'hierarchical'
    }

    // Small overage with many messages
    if (overageRatio > 1.5 && messageCount > 20) {
      return 'summarize-old'
    }

    // Small overage or few messages
    return 'sliding-window'
  }

  /**
   * Apply sliding window - keep most recent messages
   */
  private applySlidingWindow(
    messages: SessionMessage[],
    targetTokens: number,
    originalTokens: number
  ): OptimizedContext {
    const systemMessages = messages.filter((m) => m.role === 'system')
    const conversationMessages = messages.filter((m) => m.role !== 'system')

    // Always keep system messages
    let currentTokens = this.calculateTotalTokens(systemMessages)
    const keptMessages: SessionMessage[] = [...systemMessages]

    // Add messages from most recent backward until we hit budget
    for (let i = conversationMessages.length - 1; i >= 0; i--) {
      const msg = conversationMessages[i]
      const msgTokens = estimateTokens(msg.content)

      if (currentTokens + msgTokens <= targetTokens) {
        keptMessages.unshift(msg)
        currentTokens += msgTokens
      } else {
        break
      }
    }

    // Sort back to chronological order (system messages first)
    const sortedMessages = [
      ...keptMessages.filter((m) => m.role === 'system'),
      ...keptMessages.filter((m) => m.role !== 'system'),
    ]

    return {
      messages: sortedMessages,
      summary: null,
      strategy: 'sliding-window',
      originalTokens,
      optimizedTokens: currentTokens,
      compressionRatio: currentTokens / originalTokens,
      keptMessages: sortedMessages.length,
      summarizedMessages: messages.length - sortedMessages.length,
    }
  }

  /**
   * Summarize old messages while keeping recent ones intact
   */
  private async summarizeOldMessages(
    messages: SessionMessage[],
    targetTokens: number,
    originalTokens: number,
    importanceScores: MessageImportance[]
  ): Promise<OptimizedContext> {
    const recentCount = this.config.recentMessagesToKeep
    const recentMessages = messages.slice(-recentCount)
    const oldMessages = messages.slice(0, -recentCount)

    // Calculate tokens for recent messages
    const recentTokens = this.calculateTotalTokens(recentMessages)

    // If recent messages already exceed budget, fall back to sliding window
    if (recentTokens >= targetTokens) {
      return this.applySlidingWindow(messages, targetTokens, originalTokens)
    }

    // Create summary of old messages
    const summary = this.createMessageSummary(oldMessages)
    const summaryTokens = estimateTokens(summary)

    // Create summary message
    const summaryMessage: SessionMessage = {
      role: 'system',
      content: summary,
      timestamp: oldMessages[0]?.timestamp || new Date().toISOString(),
      metadata: {
        isSummary: true,
        summarizedMessageCount: oldMessages.length,
      },
    }

    const optimizedMessages = [summaryMessage, ...recentMessages]
    const optimizedTokens = summaryTokens + recentTokens

    return {
      messages: optimizedMessages,
      summary,
      strategy: 'summarize-old',
      originalTokens,
      optimizedTokens,
      compressionRatio: optimizedTokens / originalTokens,
      keptMessages: recentMessages.length + 1, // +1 for summary
      summarizedMessages: oldMessages.length,
    }
  }

  /**
   * Apply hierarchical summarization (multi-level)
   */
  private async applyHierarchicalSummarization(
    messages: SessionMessage[],
    targetTokens: number,
    originalTokens: number,
    importanceScores: MessageImportance[]
  ): Promise<OptimizedContext> {
    // Split into chunks and summarize each chunk
    const chunkSize = 10
    const chunks: SessionMessage[][] = []

    for (let i = 0; i < messages.length - this.config.recentMessagesToKeep; i += chunkSize) {
      chunks.push(messages.slice(i, i + chunkSize))
    }

    // Summarize each chunk
    const chunkSummaries = chunks.map((chunk) => this.createMessageSummary(chunk))

    // Create hierarchical summary
    const hierarchicalSummary = this.createHierarchicalSummary(chunkSummaries)

    // Keep recent messages
    const recentMessages = messages.slice(-this.config.recentMessagesToKeep)

    const summaryMessage: SessionMessage = {
      role: 'system',
      content: hierarchicalSummary,
      timestamp: messages[0]?.timestamp || new Date().toISOString(),
      metadata: {
        isSummary: true,
        isHierarchical: true,
        summarizedMessageCount: messages.length - recentMessages.length,
        chunkCount: chunks.length,
      },
    }

    const optimizedMessages = [summaryMessage, ...recentMessages]
    const optimizedTokens = this.calculateTotalTokens(optimizedMessages)

    return {
      messages: optimizedMessages,
      summary: hierarchicalSummary,
      strategy: 'hierarchical',
      originalTokens,
      optimizedTokens,
      compressionRatio: optimizedTokens / originalTokens,
      keptMessages: optimizedMessages.length,
      summarizedMessages: messages.length - recentMessages.length,
    }
  }

  /**
   * Apply aggressive compression for severe token overages
   */
  private applyAggressiveCompression(
    messages: SessionMessage[],
    targetTokens: number,
    originalTokens: number,
    importanceScores: MessageImportance[]
  ): OptimizedContext {
    // Keep only the most important messages
    const scored = messages.map((msg, idx) => ({
      message: msg,
      importance: importanceScores[idx],
      index: idx,
    }))

    // Sort by importance
    scored.sort((a, b) => b.importance.score - a.importance.score)

    // Keep messages until we hit budget
    let currentTokens = 0
    const keptMessages: SessionMessage[] = []

    for (const item of scored) {
      const msgTokens = estimateTokens(item.message.content)

      if (currentTokens + msgTokens <= targetTokens) {
        keptMessages.push(item.message)
        currentTokens += msgTokens
      } else if (keptMessages.length < this.config.minMessagesToKeep) {
        // Force keep minimum messages even if over budget
        keptMessages.push(item.message)
        currentTokens += msgTokens
      }
    }

    // Sort back to chronological order
    keptMessages.sort((a, b) => {
      const aIdx = messages.indexOf(a)
      const bIdx = messages.indexOf(b)
      return aIdx - bIdx
    })

    // Create summary of dropped messages
    const droppedMessages = messages.filter((m) => !keptMessages.includes(m))
    const summary =
      droppedMessages.length > 0
        ? `[Compressed context: ${droppedMessages.length} earlier messages summarized to save tokens]`
        : null

    return {
      messages: keptMessages,
      summary,
      strategy: 'aggressive',
      originalTokens,
      optimizedTokens: currentTokens,
      compressionRatio: currentTokens / originalTokens,
      keptMessages: keptMessages.length,
      summarizedMessages: droppedMessages.length,
    }
  }

  /**
   * Create a summary of messages
   */
  private createMessageSummary(messages: SessionMessage[]): string {
    if (messages.length === 0) return ''

    const userMessages = messages.filter((m) => m.role === 'user')
    const assistantMessages = messages.filter((m) => m.role === 'assistant')

    const topics = this.extractTopics(messages)
    const codeExamples = messages.filter((m) => m.content.includes('```')).length
    const errors = messages.filter(
      (m) =>
        m.content.toLowerCase().includes('error') ||
        m.metadata?.hasError === true
    ).length

    const summary = `<conversation_summary>
Earlier conversation (${messages.length} messages):

**Topics Discussed:**
${topics.map((t) => `- ${t}`).join('\n')}

**Key Points:**
- ${userMessages.length} user questions
- ${assistantMessages.length} assistant responses
${codeExamples > 0 ? `- ${codeExamples} code examples shared` : ''}
${errors > 0 ? `- ${errors} errors discussed` : ''}

**Context:** This summary represents earlier conversation that has been compressed to save tokens. Recent messages remain intact below.
</conversation_summary>`

    return summary
  }

  /**
   * Create hierarchical summary from chunk summaries
   */
  private createHierarchicalSummary(chunkSummaries: string[]): string {
    const combinedTopics = new Set<string>()

    // Extract topics from all chunk summaries
    for (const summary of chunkSummaries) {
      const topicMatch = summary.match(/\*\*Topics Discussed:\*\*\n([\s\S]*?)\n\n/)
      if (topicMatch) {
        const topics = topicMatch[1].split('\n').filter((t) => t.trim())
        topics.forEach((t) => combinedTopics.add(t.trim()))
      }
    }

    return `<hierarchical_summary>
Full Conversation Summary (Multi-level Compression):

**Overall Topics:**
${Array.from(combinedTopics).join('\n')}

**Conversation Phases:**
${chunkSummaries.map((s, idx) => `Phase ${idx + 1}: ${this.extractPhaseDescription(s)}`).join('\n')}

**Note:** This is a compressed view of the entire conversation history. Recent messages are preserved in full below.
</hierarchical_summary>`
  }

  /**
   * Extract phase description from chunk summary
   */
  private extractPhaseDescription(summary: string): string {
    const topicMatch = summary.match(/\*\*Topics Discussed:\*\*\n([\s\S]*?)\n\n/)
    if (topicMatch) {
      const topics = topicMatch[1]
        .split('\n')
        .filter((t) => t.trim())
        .map((t) => t.replace(/^- /, ''))
      return topics[0] || 'General discussion'
    }
    return 'General discussion'
  }

  /**
   * Extract main topics from messages
   */
  private extractTopics(messages: SessionMessage[]): string[] {
    const topics = new Set<string>()
    const commonWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'is',
      'are',
      'was',
      'were',
      'how',
      'what',
      'when',
      'where',
      'why',
      'can',
      'could',
      'would',
      'should',
    ])

    // Extract key phrases from user messages
    const userMessages = messages.filter((m) => m.role === 'user')

    for (const msg of userMessages) {
      // Extract code-related topics
      if (msg.content.includes('component')) topics.add('Component usage')
      if (msg.content.includes('hook')) topics.add('Hook implementation')
      if (msg.content.includes('error')) topics.add('Error troubleshooting')
      if (msg.content.includes('performance')) topics.add('Performance optimization')
      if (msg.content.includes('style') || msg.content.includes('css'))
        topics.add('Styling')
      if (msg.content.includes('token')) topics.add('Token management')
      if (msg.content.includes('chat')) topics.add('Chat functionality')

      // Extract capitalized terms (likely proper nouns/concepts)
      const capitalizedWords = msg.content.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b/g)
      if (capitalizedWords) {
        capitalizedWords
          .filter((w) => w.length > 3 && !commonWords.has(w.toLowerCase()))
          .forEach((w) => topics.add(w))
      }
    }

    // Limit to top 5 topics
    return Array.from(topics).slice(0, 5)
  }

  /**
   * Calculate total tokens for messages
   */
  private calculateTotalTokens(messages: SessionMessage[]): number {
    return messages.reduce((total, msg) => total + estimateTokens(msg.content), 0)
  }

  /**
   * Extract key information that must be preserved
   */
  public extractKeyContext(messages: SessionMessage[]): {
    systemPrompt: string | null
    userPreferences: Record<string, unknown>
    errorContext: string[]
    codeExamples: string[]
  } {
    const systemMessage = messages.find((m) => m.role === 'system')
    const userPreferences: Record<string, unknown> = {}
    const errorContext: string[] = []
    const codeExamples: string[] = []

    for (const msg of messages) {
      // Extract user preferences
      if (msg.metadata?.isPreference) {
        userPreferences[msg.timestamp] = msg.content
      }

      // Extract error context
      if (msg.metadata?.hasError || msg.content.toLowerCase().includes('error')) {
        errorContext.push(msg.content.slice(0, 200)) // Keep first 200 chars
      }

      // Extract code examples
      const codeBlocks = msg.content.match(/```[\s\S]*?```/g)
      if (codeBlocks) {
        codeExamples.push(...codeBlocks.slice(0, 2)) // Keep first 2 code blocks
      }
    }

    return {
      systemPrompt: systemMessage?.content || null,
      userPreferences,
      errorContext: errorContext.slice(-3), // Keep last 3 errors
      codeExamples: codeExamples.slice(-3), // Keep last 3 code examples
    }
  }
}

/**
 * Create default context manager instance
 */
export function createContextManager(
  config?: Partial<ContextManagerConfig>
): ContextManager {
  return new ContextManager(config)
}

/**
 * Quick helper to optimize messages for a specific model
 */
export async function optimizeMessagesForModel(
  messages: SessionMessage[],
  modelName: string
): Promise<OptimizedContext> {
  // Model context windows
  const contextWindows: Record<string, number> = {
    'gpt-4-turbo': 128000,
    'gpt-4': 8192,
    'gpt-3.5-turbo': 16385,
    'claude-3-5-sonnet-20241022': 200000,
    'claude-3-haiku-20240307': 200000,
    'gemini-1.5-pro': 1000000,
    'gemini-1.5-flash': 1000000,
  }

  const contextWindow = contextWindows[modelName] || 128000

  const manager = createContextManager()
  return manager.optimizeContext(messages, contextWindow)
}
