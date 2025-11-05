/**
 * Token-Optimized Context Manager
 * 
 * Intelligently manages context window allocation and optimization
 * with dynamic token budgeting and compression strategies.
 */

import type { ContextMessage } from '../context-window'

export interface TokenAllocation {
  systemPrompt: number
  userPreferences: number
  recentContext: number
  semanticMemory: number
  episodicMemory: number
}

export interface ContextAnalysis {
  conversationActivity: 'low' | 'medium' | 'high'
  preferenceRichness: 'low' | 'medium' | 'high'
  taskComplexity: 'low' | 'medium' | 'high'
  conversationLength: number
}

export interface OptimizedContextResult {
  context: string
  totalTokens: number
  allocation: TokenAllocation
  compressionRatio?: number
  components: {
    system: string
    preferences: string
    recent: string
    semantic: string
    episodic: string
  }
}

/**
 * Token-Optimized Context Manager
 * 
 * Manages context window with intelligent token allocation and compression
 */
export class TokenOptimizedContextManager {
  private contextLimit: number
  private reservedTokens: number
  private availableTokens: number
  private allocation: Record<keyof TokenAllocation, number>
  private countTokens: (text: string) => number

  constructor(
    modelContextLimit: number = 128000,
    reservedTokens: number = 4000,
    countTokens: (text: string) => number
  ) {
    this.contextLimit = modelContextLimit
    this.reservedTokens = reservedTokens
    this.availableTokens = modelContextLimit - reservedTokens
    this.countTokens = countTokens

    // Default token allocation strategy
    this.allocation = {
      systemPrompt: 0.15, // 15% for system instructions
      userPreferences: 0.10, // 10% for user context
      recentContext: 0.40, // 40% for immediate conversation
      semanticMemory: 0.25, // 25% for relevant memories
      episodicMemory: 0.10, // 10% for historical context
    }
  }

  /**
   * Optimize context with intelligent allocation and compression
   */
  optimizeContext(
    systemPrompt: string,
    userPreferences: string,
    recentMessages: ContextMessage[],
    semanticMemories: string[],
    episodicMemories: string[],
    analysis?: ContextAnalysis
  ): OptimizedContextResult {
    // Adjust allocation based on context analysis
    const adjustedAllocation = analysis
      ? this.dynamicAllocationAdjustment(analysis)
      : this.allocation

    // Calculate token budgets
    const budgets: TokenAllocation = {
      systemPrompt: Math.floor(this.availableTokens * adjustedAllocation.systemPrompt),
      userPreferences: Math.floor(this.availableTokens * adjustedAllocation.userPreferences),
      recentContext: Math.floor(this.availableTokens * adjustedAllocation.recentContext),
      semanticMemory: Math.floor(this.availableTokens * adjustedAllocation.semanticMemory),
      episodicMemory: Math.floor(this.availableTokens * adjustedAllocation.episodicMemory),
    }

    // Optimize each component
    const optimized = {
      system: this.truncateToBudget(systemPrompt, budgets.systemPrompt),
      preferences: this.smartTruncate(userPreferences, budgets.userPreferences, 0.8),
      recent: this.compressConversation(recentMessages, budgets.recentContext),
      semantic: this.selectTopMemories(semanticMemories, budgets.semanticMemory),
      episodic: this.compressEpisodicMemories(episodicMemories, budgets.episodicMemory),
    }

    // Combine components
    const context = this.combineComponents(optimized)

    const totalTokens = this.countTokens(context)

    // Calculate compression ratio if applicable
    const originalSize = this.countTokens(
      systemPrompt +
        userPreferences +
        recentMessages.map((m) => m.content).join('\n') +
        semanticMemories.join('\n') +
        episodicMemories.join('\n')
    )
    const compressionRatio = originalSize > 0 ? originalSize / totalTokens : 1

    return {
      context,
      totalTokens,
      allocation: budgets,
      compressionRatio: compressionRatio > 1 ? compressionRatio : undefined,
      components: optimized,
    }
  }

  /**
   * Compress conversation to fit budget
   */
  private compressConversation(messages: ContextMessage[], budget: number): string {
    const totalTokens = messages.reduce((sum, msg) => sum + this.countTokens(msg.content), 0)

    if (totalTokens <= budget) {
      return messages.map((m) => `${m.role}: ${m.content}`).join('\n')
    }

    // Progressive compression strategies
    if (totalTokens > budget * 2) {
      // Aggressive: Use summarization
      return this.summarizeConversation(messages, budget)
    } else {
      // Conservative: Selective truncation
      return this.selectiveTruncation(messages, budget)
    }
  }

  /**
   * Selective truncation - remove middle messages while preserving flow
   */
  private selectiveTruncation(messages: ContextMessage[], budget: number): string {
    if (messages.length <= 4) {
      const text = messages.map((m) => `${m.role}: ${m.content}`).join('\n')
      return this.truncateToBudget(text, budget)
    }

    // Always keep first 2 and last 2 messages
    const essential = messages.slice(0, 2).concat(messages.slice(-2))
    const essentialText = essential.map((m) => `${m.role}: ${m.content}`).join('\n')
    const essentialTokens = this.countTokens(essentialText)

    if (essentialTokens >= budget) {
      return this.truncateToBudget(essentialText, budget)
    }

    // Add middle messages that fit
    let remainingBudget = budget - essentialTokens
    const middle = messages.slice(2, -2)
    const selected: ContextMessage[] = []

    for (let i = middle.length - 1; i >= 0; i--) {
      const msg = middle[i]
      const msgTokens = this.countTokens(msg.content)
      if (msgTokens <= remainingBudget) {
        selected.unshift(msg)
        remainingBudget -= msgTokens
      } else {
        break
      }
    }

    // Combine with gap indicator if needed
    const parts: string[] = []
    parts.push(essential.slice(0, 2).map((m) => `${m.role}: ${m.content}`).join('\n'))

    if (selected.length < middle.length) {
      parts.push(`[... ${middle.length - selected.length} messages omitted ...]`)
    }

    if (selected.length > 0) {
      parts.push(selected.map((m) => `${m.role}: ${m.content}`).join('\n'))
    }

    parts.push(essential.slice(-2).map((m) => `${m.role}: ${m.content}`).join('\n'))

    return parts.join('\n')
  }

  /**
   * Summarize conversation (simplified - use LLM in production)
   */
  private summarizeConversation(messages: ContextMessage[], budget: number): string {
    // Extract key points
    const userMessages = messages.filter((m) => m.role === 'user')
    const assistantMessages = messages.filter((m) => m.role === 'assistant')

    const summaryParts: string[] = []

    if (userMessages.length > 0) {
      const userTopics = userMessages
        .map((m) => this.extractKeyPoints(m.content))
        .filter((p) => p.length > 0)
        .slice(0, 3)
        .join('; ')

      if (userTopics) {
        summaryParts.push(`User discussed: ${userTopics}`)
      }
    }

    if (assistantMessages.length > 0) {
      const assistantPoints = assistantMessages
        .map((m) => this.extractKeyPoints(m.content))
        .filter((p) => p.length > 0)
        .slice(0, 3)
        .join('; ')

      if (assistantPoints) {
        summaryParts.push(`Assistant provided: ${assistantPoints}`)
      }
    }

    const summary = summaryParts.join('. ') || 'Previous conversation occurred.'
    return this.truncateToBudget(summary, budget)
  }

  /**
   * Extract key points from text
   */
  private extractKeyPoints(text: string): string {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10)
    if (sentences.length === 0) return ''

    const firstSentence = sentences[0].trim()
    return firstSentence.length > 100 ? firstSentence.substring(0, 100) + '...' : firstSentence
  }

  /**
   * Select top memories by importance/relevance
   */
  private selectTopMemories(memories: string[], budget: number): string {
    if (memories.length === 0) return ''

    // Sort by length (proxy for importance) and select
    const sorted = [...memories].sort((a, b) => b.length - a.length)
    const selected: string[] = []
    let usedTokens = 0

    for (const memory of sorted) {
      const tokens = this.countTokens(memory)
      if (usedTokens + tokens <= budget) {
        selected.push(memory)
        usedTokens += tokens
      } else {
        break
      }
    }

    return selected.join('\n')
  }

  /**
   * Compress episodic memories
   */
  private compressEpisodicMemories(memories: string[], budget: number): string {
    if (memories.length === 0) return ''

    // More aggressive compression for episodic
    const compressed = memories.map((m) => this.extractKeyPoints(m)).filter((m) => m.length > 0)

    const result: string[] = []
    let usedTokens = 0

    for (const mem of compressed) {
      const tokens = this.countTokens(mem)
      if (usedTokens + tokens <= budget) {
        result.push(mem)
        usedTokens += tokens
      } else {
        break
      }
    }

    return result.length > 0 ? `Historical context:\n${result.join('\n')}` : ''
  }

  /**
   * Smart truncate with compression ratio
   */
  private smartTruncate(text: string, budget: number, compressionRatio: number = 0.8): string {
    const targetTokens = Math.floor(budget * compressionRatio)
    return this.truncateToBudget(text, targetTokens)
  }

  /**
   * Truncate text to fit token budget
   */
  private truncateToBudget(text: string, budget: number): string {
    const tokens = this.countTokens(text)
    if (tokens <= budget) return text

    // Rough estimate: tokens ≈ chars / 4
    const maxChars = budget * 4
    return text.substring(0, Math.max(0, maxChars - 3)) + '...'
  }

  /**
   * Combine components into final context
   */
  private combineComponents(components: {
    system: string
    preferences: string
    recent: string
    semantic: string
    episodic: string
  }): string {
    const parts: string[] = []

    if (components.system) {
      parts.push(`System: ${components.system}`)
    }

    if (components.preferences) {
      parts.push(`User Preferences:\n${components.preferences}`)
    }

    if (components.recent) {
      parts.push(`Recent Conversation:\n${components.recent}`)
    }

    if (components.semantic) {
      parts.push(`Relevant Memories:\n${components.semantic}`)
    }

    if (components.episodic) {
      parts.push(components.episodic)
    }

    return parts.join('\n\n')
  }

  /**
   * Dynamically adjust token allocation based on context analysis
   */
  private dynamicAllocationAdjustment(analysis: ContextAnalysis): Record<keyof TokenAllocation, number> {
    const adjusted = { ...this.allocation }

    // Increase recent context if active conversation
    if (analysis.conversationActivity === 'high') {
      adjusted.recentContext += 0.10
      adjusted.episodicMemory -= 0.05
      adjusted.semanticMemory -= 0.05
    }

    // Increase semantic memory if user has rich preferences
    if (analysis.preferenceRichness === 'high') {
      adjusted.semanticMemory += 0.10
      adjusted.episodicMemory -= 0.10
    }

    // Increase system prompt allocation for complex tasks
    if (analysis.taskComplexity === 'high') {
      adjusted.systemPrompt += 0.05
      adjusted.recentContext -= 0.05
    }

    // Normalize to ensure sum ≈ 1.0
    const sum = Object.values(adjusted).reduce((a, b) => a + b, 0)
    if (sum !== 1.0) {
      Object.keys(adjusted).forEach((key) => {
        adjusted[key as keyof TokenAllocation] /= sum
      })
    }

    return adjusted
  }

  /**
   * Analyze context to inform allocation decisions
   */
  analyzeContext(
    recentMessages: ContextMessage[],
    userPreferences: string,
    semanticMemories: string[]
  ): ContextAnalysis {
    return {
      conversationActivity:
        recentMessages.length > 20 ? 'high' : recentMessages.length > 10 ? 'medium' : 'low',
      preferenceRichness:
        this.countTokens(userPreferences) > 500 ? 'high' : this.countTokens(userPreferences) > 200 ? 'medium' : 'low',
      taskComplexity:
        recentMessages.some((m) => this.countTokens(m.content) > 500) ? 'high' : 'medium',
      conversationLength: recentMessages.length,
    }
  }
}
