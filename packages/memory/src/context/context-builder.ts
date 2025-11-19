/**
 * Context Builder
 * 
 * Builds optimized context bundles for LLMs
 */

import type {
  ContextBundle,
  ContextOptions,
  Memory,
  TokenBreakdown,
} from '../types'
import type { StorageAdapter } from '../stores/storage-adapter'
import type { EmbeddingProvider } from '../embeddings/embedding-provider'
import { TokenBudgetManager } from './token-budget'
import { countTokens } from '../utils/token-counter'

export class ContextBuilder {
  private budgetManager: TokenBudgetManager
  private storage: StorageAdapter
  private embeddingProvider?: EmbeddingProvider

  constructor(
    budgetManager: TokenBudgetManager,
    storage: StorageAdapter,
    embeddingProvider?: EmbeddingProvider
  ) {
    this.budgetManager = budgetManager
    this.storage = storage
    this.embeddingProvider = embeddingProvider
  }

  /**
   * Build optimized context bundle for LLM
   * 
   * Gathers and optimizes context components within token budget:
   * - User preferences (profile memories)
   * - Recent context (session memories)
   * - Semantic memories (relevant long-term memories)
   * - Episodic memories (recent events)
   * - Summary (compressed long-term context)
   * 
   * @param options - Context building options
   * @returns Optimized context bundle with token breakdown
   * 
   * @example
   * ```typescript
   * const bundle = await contextBuilder.build({
   *   maxTokens: 4096,
   *   includePreferences: true,
   *   includeRecent: true,
   * })
   * ```
   */
  async build(options?: ContextOptions): Promise<ContextBundle> {
    const maxTokens = options?.maxTokens || 4096
    const allocation = this.budgetManager.getAllocation({ maxTokens })

    // Gather context components
    const userPreferences = options?.includePreferences !== false
      ? await this.getUserPreferences(
          options?.userId,
          allocation.userPreferences
        )
      : ''
    const recentContext = options?.includeRecent !== false
      ? await this.getRecentContext(
          options?.sessionId,
          allocation.recentContext
        )
      : ''
    const semanticMemories = await this.getSemanticMemories(
      options?.userId,
      allocation.semanticMemories,
      options?.minRelevance
    )
    const episodicMemories = await this.getEpisodicMemories(
      options?.sessionId,
      allocation.episodicMemories
    )

    // Build summary if enabled
    const summary = options?.includeSummary
      ? await this.buildSummary([...semanticMemories, ...episodicMemories], allocation.summary)
      : ''

    // Calculate actual token usage
    const tokenBreakdown: TokenBreakdown = {
      systemPrompt: this.countTokens(''),
      userPreferences: this.countTokens(userPreferences),
      recentContext: this.countTokens(recentContext),
      semanticMemories: semanticMemories.reduce((sum, m) => sum + this.countTokens(m.content), 0),
      episodicMemories: episodicMemories.reduce((sum, m) => sum + this.countTokens(m.content), 0),
      summary: this.countTokens(summary),
      total: 0,
    }
    tokenBreakdown.total =
      tokenBreakdown.systemPrompt +
      tokenBreakdown.userPreferences +
      tokenBreakdown.recentContext +
      tokenBreakdown.semanticMemories +
      tokenBreakdown.episodicMemories +
      tokenBreakdown.summary

    // Format context
    const formatted = this.formatContext({
      userPreferences,
      recentContext,
      semanticMemories,
      episodicMemories,
      summary,
    })

    return {
      systemPrompt: '',
      userPreferences,
      recentContext,
      semanticMemories,
      episodicMemories,
      summary,
      tokenBreakdown,
      metadata: {
        compressionRatio: 0,
        memoriesRetrieved: semanticMemories.length + episodicMemories.length,
        memoriesFiltered: 0,
        memoriesCompressed: 0,
        strategiesUsed: [],
      },
      formatted,
    }
  }

  private async getUserPreferences(
    userId?: string,
    tokenBudget?: number
  ): Promise<string> {
    if (!userId || !tokenBudget) return ''

    const preferences = await this.storage.query({
      type: 'profile',
      scope: 'user',
      userId,
    })

    // Filter and format preferences
    const formatted = preferences
      .slice(0, 5) // Limit to top 5
      .map(m => `- ${m.content}`)
      .join('\n')

    return this.trimToTokens(formatted, tokenBudget)
  }

  private async getRecentContext(
    sessionId?: string,
    tokenBudget?: number
  ): Promise<string> {
    if (!sessionId || !tokenBudget) return ''

    const recent = await this.storage.query({
      scope: 'session',
      sessionId,
    })

    // Sort by timestamp, get most recent
    const sorted = recent
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)

    const formatted = sorted.map(m => m.content).join('\n\n')
    return this.trimToTokens(formatted, tokenBudget)
  }

  private async getSemanticMemories(
    userId?: string,
    tokenBudget?: number,
    minRelevance?: number
  ): Promise<Memory[]> {
    const memories = await this.storage.query({
      type: 'semantic',
      userId,
    })

    // Filter by relevance if provided
    const filtered = minRelevance
      ? memories.filter(m => m.importance >= minRelevance)
      : memories

    // Sort by importance
    const sorted = filtered.sort((a, b) => b.importance - a.importance)

    // Select memories within token budget
    const selected: Memory[] = []
    let usedTokens = 0

    for (const memory of sorted) {
      const tokens = this.countTokens(memory.content)
      if (usedTokens + tokens <= tokenBudget || 0) {
        selected.push(memory)
        usedTokens += tokens
      } else {
        break
      }
    }

    return selected
  }

  private async getEpisodicMemories(
    sessionId?: string,
    tokenBudget?: number
  ): Promise<Memory[]> {
    const memories = await this.storage.query({
      type: 'episodic',
      sessionId,
    })

    // Sort by timestamp (most recent first)
    const sorted = memories.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )

    // Select memories within token budget
    const selected: Memory[] = []
    let usedTokens = 0

    for (const memory of sorted) {
      const tokens = this.countTokens(memory.content)
      if (usedTokens + tokens <= tokenBudget || 0) {
        selected.push(memory)
        usedTokens += tokens
      } else {
        break
      }
    }

    return selected
  }

  private async buildSummary(
    memories: Memory[],
    tokenBudget: number
  ): Promise<string> {
    if (memories.length === 0) return ''

    // Simple summarization: concatenate and trim
    const content = memories.map(m => m.content).join('\n\n')
    return this.trimToTokens(content, tokenBudget)
  }

  private formatContext(context: {
    userPreferences: string
    recentContext: string
    semanticMemories: Memory[]
    episodicMemories: Memory[]
    summary: string
  }): string {
    const parts: string[] = []

    if (context.userPreferences) {
      parts.push('## User Preferences\n' + context.userPreferences)
    }

    if (context.recentContext) {
      parts.push('## Recent Context\n' + context.recentContext)
    }

    if (context.semanticMemories.length > 0) {
      parts.push(
        '## Semantic Memories\n' +
          context.semanticMemories.map(m => `- ${m.content}`).join('\n')
      )
    }

    if (context.episodicMemories.length > 0) {
      parts.push(
        '## Episodic Memories\n' +
          context.episodicMemories.map(m => `- ${m.content}`).join('\n')
      )
    }

    if (context.summary) {
      parts.push('## Summary\n' + context.summary)
    }

    return parts.join('\n\n')
  }

  private countTokens(text: string): number {
    return countTokens(text)
  }

  private trimToTokens(text: string, maxTokens: number): string {
    const maxChars = maxTokens * 4
    if (text.length <= maxChars) return text
    return text.slice(0, maxChars).trim() + '...'
  }
}
