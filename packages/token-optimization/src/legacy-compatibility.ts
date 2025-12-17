/**
 * Legacy Compatibility Layer
 * 
 * Provides backward-compatible classes that match the old memory package API
 * while internally using the new optimized implementations
 */

import { AccurateTokenCounter } from './tokenizers/accurate-counter'

/**
 * Legacy TokenCounter - maintains backward compatibility
 */
export class TokenCounter {
  private static counter: AccurateTokenCounter

  private static getCounter(): AccurateTokenCounter {
    if (!this.counter) {
      this.counter = new AccurateTokenCounter({ model: 'gpt-4' })
    }
    return this.counter
  }

  /**
   * Count tokens in text - uses approximation for backward compatibility
   */
  static count(text: string): number {
    // For backward compatibility, use character-based approximation
    // Approximate 4 characters per token, rounded up
    return Math.ceil(text.length / 4)
  }

  /**
   * Count tokens in multiple texts
   */
  static countBatch(texts: string[]): number {
    return texts.reduce((sum, text) => sum + this.count(text), 0)
  }

  /**
   * Truncate text to fit token budget
   */
  static truncate(text: string, maxTokens: number): string {
    return this.getCounter().truncate(text, maxTokens)
  }

  /**
   * Split text into sentences
   */
  static splitSentences(text: string): string[] {
    // Simple sentence splitting - enhanced version available in new package
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }
}

/**
 * Legacy TokenBudgetManager - maintains backward compatibility
 */
export class TokenBudgetManager {
  private config: any // TokenOptimizationConfig from memory package
  private allocation: any // TokenAllocation from memory package

  constructor(config: any) {
    this.config = config
    this.allocation = this.calculateBudgets(config.maxContextWindow)
  }

  /**
   * Calculate token budgets based on allocation percentages
   */
  private calculateBudgets(maxTokens: number): any {
    return this.calculateBudgetsFromAllocation(maxTokens, this.config.allocation)
  }

  /**
   * Get current token allocation
   */
  getAllocation(): any {
    return { ...this.allocation }
  }

  /**
   * Dynamically adjust allocation based on context
   */
  adjustAllocation(context: any): any {
    if (!this.config.dynamicAllocation) {
      return this.allocation
    }

    const adjusted = { ...this.config.allocation }

    // Increase recent context for high conversation activity
    if (context.conversationActivity === 'high') {
      adjusted.recentContext += 0.10
      adjusted.episodicMemory -= 0.05
      adjusted.semanticMemory -= 0.05
    }

    // Increase semantic memory for rich preferences
    if (context.preferenceRichness === 'high') {
      adjusted.semanticMemory += 0.10
      adjusted.episodicMemory -= 0.10
    }

    // Increase system prompt for complex tasks
    if (context.taskComplexity === 'high') {
      adjusted.systemPrompt += 0.05
      adjusted.recentContext -= 0.05
    }

    return this.calculateBudgetsFromAllocation(
      this.config.maxContextWindow,
      adjusted
    )
  }

  /**
   * Calculate token budgets from allocation percentages
   */
  private calculateBudgetsFromAllocation(
    maxTokens: number,
    alloc: any
  ): any {
    return {
      systemPrompt: Math.floor(maxTokens * alloc.systemPrompt),
      userPreferences: Math.floor(maxTokens * alloc.userPreferences),
      recentContext: Math.floor(maxTokens * alloc.recentContext),
      semanticMemory: Math.floor(maxTokens * alloc.semanticMemory),
      episodicMemory: Math.floor(maxTokens * alloc.episodicMemory),
      responseReserve: Math.floor(maxTokens * alloc.responseReserve),
    }
  }

  /**
   * Optimize memory items to fit token budget
   */
  optimizeMemories(
    memories: any[],
    budget: number,
    priorities: Record<string, number> = {}
  ): any[] {
    // Sort by priority and relevance
    const sorted = [...memories].sort((a, b) => {
      const priorityWeight = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
      }
      
      const scoreA = priorityWeight[a.priority as keyof typeof priorityWeight] * a.confidence * (priorities[a.id] || 1)
      const scoreB = priorityWeight[b.priority as keyof typeof priorityWeight] * b.confidence * (priorities[b.id] || 1)
      
      return scoreB - scoreA
    })

    // Greedy selection within budget
    const selected: any[] = []
    let usedTokens = 0

    for (const memory of sorted) {
      if (usedTokens + memory.tokens <= budget) {
        selected.push(memory)
        usedTokens += memory.tokens
      } else if (selected.length === 0) {
        // Must include at least one, truncate if needed
        const truncated = {
          ...memory,
          content: TokenCounter.truncate(memory.content, budget),
          tokens: budget,
        }
        selected.push(truncated)
        break
      }
    }

    return selected
  }

  /**
   * Get remaining budget
   */
  getRemainingBudget(used: number): number {
    return Math.max(0, this.config.maxContextWindow - used)
  }

  /**
   * Check if budget is exceeded
   */
  isBudgetExceeded(used: number): boolean {
    return used > this.config.maxContextWindow
  }

  /**
   * Calculate optimal distribution across memory types
   */
  distributeTokens(_totalMemories: number, _byType: Record<string, number>): Record<string, number> {
    const distribution: Record<string, number> = {}
    
    // Base allocation
    distribution['episodic'] = this.allocation.episodicMemory
    distribution['semantic'] = this.allocation.semanticMemory
    distribution['shortTerm'] = this.allocation.recentContext
    distribution['procedural'] = Math.floor(this.allocation.semanticMemory * 0.2)

    return distribution
  }
}

/**
 * Legacy MemoryCompressor - maintains backward compatibility
 */
export class MemoryCompressor {

  /**
   * Compress conversation history
   */
  compressConversation(messages: string[], budget: number): any {
    const original = messages.join('\n')
    const originalTokens = TokenCounter.count(original)

    if (originalTokens <= budget) {
      return {
        original,
        compressed: original,
        originalTokens,
        compressedTokens: originalTokens,
        compressionRatio: 1.0,
        method: 'selective',
      }
    }

    // Progressive compression strategies
    let compressed: string
    let method: any

    if (originalTokens > budget * 2) {
      // Aggressive: Use summarization approach
      compressed = this.summarizeConversation(messages, budget)
      method = 'summarization'
    } else {
      // Conservative: Selective truncation
      compressed = this.selectiveTruncation(messages, budget)
      method = 'truncation'
    }

    const compressedTokens = TokenCounter.count(compressed)

    return {
      original,
      compressed,
      originalTokens,
      compressedTokens,
      compressionRatio: originalTokens / compressedTokens,
      method,
    }
  }

  /**
   * Selective truncation keeping first and last messages
   */
  private selectiveTruncation(messages: string[], budget: number): string {
    if (messages.length <= 4) {
      return TokenCounter.truncate(messages.join('\n'), budget)
    }

    // Keep first 2 and last 2 messages
    const essential = [...messages.slice(0, 2), ...messages.slice(-2)]
    const essentialText = essential.join('\n')
    const essentialTokens = TokenCounter.count(essentialText)

    if (essentialTokens >= budget) {
      return TokenCounter.truncate(essentialText, budget)
    }

    // Add middle messages that fit
    const remainingBudget = budget - essentialTokens
    const middleMessages = messages.slice(2, -2)
    const selected: string[] = []
    let usedTokens = 0

    // Start from most recent
    for (let i = middleMessages.length - 1; i >= 0; i--) {
      const msg = middleMessages[i]
      if (!msg) continue
      const tokens = TokenCounter.count(msg)
      
      if (usedTokens + tokens <= remainingBudget) {
        selected.unshift(msg)
        usedTokens += tokens
      } else {
        break
      }
    }

    // Combine with gap indicator if needed
    const omittedCount = middleMessages.length - selected.length
    const parts = [
      ...messages.slice(0, 2),
      ...(omittedCount > 0 ? [`\n[... ${omittedCount} messages omitted ...]\n`] : []),
      ...selected,
      ...messages.slice(-2),
    ]

    return parts.join('\n')
  }

  /**
   * Summarize conversation (placeholder for actual LLM summarization)
   */
  private summarizeConversation(messages: string[], budget: number): string {
    // In production, this would call an LLM to generate a summary
    // For now, use extractive summarization
    
    const sentences = messages.flatMap(msg => TokenCounter.splitSentences(msg))
    const targetCount = Math.min(sentences.length, Math.floor(budget / 20)) // ~20 tokens per sentence
    
    // Simple extractive: take first, last, and evenly distributed sentences
    const step = Math.max(1, Math.floor(sentences.length / targetCount))
    const selected: string[] = []
    
    for (let i = 0; i < sentences.length && selected.length < targetCount; i += step) {
      const sentence = sentences[i]
      if (sentence) {
        selected.push(sentence)
      }
    }
    
    // Always include first and last
    const firstSentence = sentences[0]
    const lastSentence = sentences[sentences.length - 1]
    if (firstSentence && !selected.includes(firstSentence)) {
      selected.unshift(firstSentence)
    }
    if (lastSentence && !selected.includes(lastSentence)) {
      selected.push(lastSentence)
    }
    
    return selected.join('. ') + '.'
  }

  /**
   * Compress memory item
   */
  compressMemory(memory: any, targetRatio: number = 0.5): any {
    const original = memory.content
    const originalTokens = memory.tokens
    const targetTokens = Math.floor(originalTokens * targetRatio)

    const compressed = TokenCounter.truncate(original, targetTokens)
    const compressedTokens = TokenCounter.count(compressed)

    return {
      original,
      compressed,
      originalTokens,
      compressedTokens,
      compressionRatio: originalTokens / compressedTokens,
      method: 'semantic',
    }
  }
}

/**
 * Legacy SemanticChunker - maintains backward compatibility
 */
export class SemanticChunker {
  private chunkSize: number

  constructor(chunkSize: number = 200, _overlap: number = 50) {
    this.chunkSize = chunkSize
    // overlap parameter reserved for future semantic overlap calculation
  }

  /**
   * Split conversation into semantically coherent chunks
   */
  chunkConversation(conversation: string): any[] {
    const sentences = TokenCounter.splitSentences(conversation)
    const chunks: any[] = []
    
    let currentChunk: string[] = []
    let currentTokens = 0
    let chunkIndex = 0

    for (const sentence of sentences) {
      const sentenceTokens = TokenCounter.count(sentence)

      // Check if adding this sentence exceeds chunk size
      if (currentTokens + sentenceTokens > this.chunkSize && currentChunk.length > 0) {
        // Finalize current chunk
        const chunkText = currentChunk.join('. ') + '.'
        chunks.push({
          id: `chunk-${chunkIndex}`,
          text: chunkText,
          tokens: currentTokens,
          embedding: [], // To be filled by embedding service
          chunkIndex,
        })
        
        chunkIndex++

        // Start new chunk with overlap
        const overlapSentences = currentChunk.slice(-Math.ceil(currentChunk.length * 0.2))
        currentChunk = [...overlapSentences, sentence]
        currentTokens = TokenCounter.countBatch(currentChunk)
      } else {
        currentChunk.push(sentence)
        currentTokens += sentenceTokens
      }
    }

    // Add final chunk
    if (currentChunk.length > 0) {
      const chunkText = currentChunk.join('. ') + '.'
      chunks.push({
        id: `chunk-${chunkIndex}`,
        text: chunkText,
        tokens: currentTokens,
        embedding: [],
        chunkIndex,
      })
    }

    return chunks
  }

  /**
   * Retrieve optimal chunks within budget
   */
  retrieveOptimalChunks(
    chunks: any[],
    budget: number,
    relevanceScores?: Map<string, number>
  ): any[] {
    // Sort by relevance if provided
    const sorted = relevanceScores
      ? [...chunks].sort((a, b) => {
          const scoreA = relevanceScores.get(a.id) || 0
          const scoreB = relevanceScores.get(b.id) || 0
          return scoreB - scoreA
        })
      : chunks

    // Greedy selection within budget
    const selected: any[] = []
    let usedTokens = 0

    for (const chunk of sorted) {
      if (usedTokens + chunk.tokens <= budget) {
        selected.push(chunk)
        usedTokens += chunk.tokens
      } else if (selected.length === 0) {
        // Must include at least one chunk
        const truncated = {
          ...chunk,
          text: TokenCounter.truncate(chunk.text, budget),
          tokens: budget,
        }
        selected.push(truncated)
        break
      }
    }

    return selected
  }

  /**
   * Extract topic from chunk
   */
  extractTopic(chunk: any): string {
    // Simple topic extraction - in production use NLP
    const words = chunk.text.toLowerCase().split(/\s+/)
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'])
    const keywords = words.filter((w: string) => w.length > 3 && !commonWords.has(w))
    
    // Return most frequent word
    const frequency: Record<string, number> = {}
    for (const word of keywords) {
      frequency[word] = (frequency[word] || 0) + 1
    }
    
    const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] || 'general'
  }
}

/**
 * Legacy ContextOptimizer - maintains backward compatibility
 */
export class ContextOptimizer {
  private budgetManager: TokenBudgetManager
  private compressor: MemoryCompressor
  private chunker: SemanticChunker

  constructor(config: any) {
    this.budgetManager = new TokenBudgetManager(config)
    this.compressor = new MemoryCompressor()
    this.chunker = new SemanticChunker(
      config.chunkSize || 200,
      config.chunkOverlap || 50
    )
  }

  /**
   * Optimize entire context for LLM
   */
  optimizeContext(options: {
    systemPrompt: string
    userPreferences: Record<string, any>
    recentMessages: string[]
    semanticMemories: any[]
    episodicMemories: any[]
    context?: any
  }): {
    optimized: {
      systemPrompt: string
      userPreferences: string
      recentContext: string
      semanticMemory: string
      episodicMemory: string
    }
    stats: {
      totalTokens: number
      allocation: any
      compressionRatio: number
    }
  } {
    const allocation = options.context
      ? this.budgetManager.adjustAllocation(options.context)
      : this.budgetManager.getAllocation()

    // Optimize each component
    const systemPrompt = TokenCounter.truncate(options.systemPrompt, allocation.systemPrompt)
    
    const userPreferences = this.compressor.compressConversation(
      [JSON.stringify(options.userPreferences)],
      allocation.userPreferences
    )

    const recentContext = this.compressor.compressConversation(
      options.recentMessages,
      allocation.recentContext
    )

    const optimizedSemantic = this.budgetManager.optimizeMemories(
      options.semanticMemories,
      allocation.semanticMemory
    )

    const optimizedEpisodic = this.budgetManager.optimizeMemories(
      options.episodicMemories,
      allocation.episodicMemory
    )

    const semanticMemory = optimizedSemantic.map(m => m.content).join('\n')
    const episodicMemory = optimizedEpisodic.map(m => m.content).join('\n')

    const totalTokens = 
      TokenCounter.count(systemPrompt) +
      userPreferences.compressedTokens +
      recentContext.compressedTokens +
      TokenCounter.count(semanticMemory) +
      TokenCounter.count(episodicMemory)

    return {
      optimized: {
        systemPrompt,
        userPreferences: userPreferences.compressed,
        recentContext: recentContext.compressed,
        semanticMemory,
        episodicMemory,
      },
      stats: {
        totalTokens,
        allocation,
        compressionRatio: (
          (userPreferences.compressionRatio + recentContext.compressionRatio) / 2
        ),
      },
    }
  }

  /**
   * Get budget manager
   */
  getBudgetManager(): TokenBudgetManager {
    return this.budgetManager
  }

  /**
   * Get compressor
   */
  getCompressor(): MemoryCompressor {
    return this.compressor
  }

  /**
   * Get chunker
   */
  getChunker(): SemanticChunker {
    return this.chunker
  }
}