/**
 * Sliding Context Window Manager with RAG Integration
 *
 * Dynamically manages conversation history by maintaining a fixed-size buffer
 * while using semantic search (RAG) to retrieve relevant historical context.
 */

import type {
  MemoryItem,
  MemoryRetrievalOptions,
  OptimizedContext,
  MemoryLayer,
} from './types'
import type { ContextMessage } from '../context-window'
import type { VectorStoreAdapter } from './vector-store-adapter'

export interface MemoryVectorStore {
  similaritySearch(
    query: string,
    userId: string,
    options?: {
      k?: number
      minScore?: number
      filter?: Record<string, any>
    }
  ): Promise<MemoryItem[]>

  storeMemory(memory: MemoryItem): Promise<void>

  deleteMemory(memoryId: string): Promise<void>
}

/**
 * Adapter to convert VectorStoreAdapter to VectorStore interface
 */
export class VectorStoreAdapterWrapper implements MemoryVectorStore {
  constructor(private adapter: VectorStoreAdapter) {}

  async similaritySearch(
    query: string,
    userId: string,
    options?: {
      k?: number
      minScore?: number
      filter?: Record<string, any>
    }
  ): Promise<MemoryItem[]> {
    const queryEmbedding = await this.adapter.createEmbedding(query)
    return this.adapter.similaritySearch(queryEmbedding, {
      userId,
      k: options?.k,
      minScore: options?.minScore,
      filter: options?.filter,
    })
  }

  async storeMemory(memory: MemoryItem): Promise<void> {
    const embedding =
      memory.embedding || (await this.adapter.createEmbedding(memory.value))
    await this.adapter.storeMemory(memory, embedding)
  }

  async deleteMemory(memoryId: string): Promise<void> {
    await this.adapter.deleteMemory(memoryId)
  }
}

export interface SlidingContextConfig {
  maxTokens: number
  contextRatio?: number // Ratio of maxTokens to use for context (default 0.7)
  immediateWindowSize?: number // Number of recent messages to always keep
  vectorStore?: MemoryVectorStore
  countTokens: (text: string) => number
}

/**
 * Sliding Context Manager with RAG Integration
 */
export class SlidingContextManager {
  private config: Required<
    Pick<
      SlidingContextConfig,
      'maxTokens' | 'contextRatio' | 'immediateWindowSize' | 'countTokens'
    >
  > & {
    vectorStore?: MemoryVectorStore
  }
  private historyBuffer: ContextMessage[] = []
  private readonly maxBufferSize: number

  constructor(config: SlidingContextConfig) {
    this.config = {
      maxTokens: config.maxTokens,
      contextRatio: config.contextRatio ?? 0.7,
      immediateWindowSize: config.immediateWindowSize ?? 10,
      countTokens: config.countTokens,
      vectorStore: config.vectorStore,
    }
    this.maxBufferSize = Math.max(50, config.immediateWindowSize ?? 10) * 2
  }

  /**
   * Add message to history buffer
   */
  addMessage(message: ContextMessage): void {
    this.historyBuffer.push(message)

    // Maintain buffer size
    if (this.historyBuffer.length > this.maxBufferSize) {
      this.historyBuffer = this.historyBuffer.slice(-this.maxBufferSize)
    }
  }

  /**
   * Get optimized context for a query
   */
  async getContext(
    userId: string,
    currentMessage: string,
    options?: {
      includeSystemMessage?: boolean
      systemMessage?: string
    }
  ): Promise<OptimizedContext> {
    // Get immediate context from sliding window
    const immediateContext = this.getImmediateContext()

    // Retrieve relevant historical context using semantic search
    let historicalContext: MemoryItem[] = []

    if (this.config.vectorStore) {
      try {
        historicalContext = await this.config.vectorStore.similaritySearch(
          currentMessage,
          userId,
          {
            k: 3,
            minScore: 0.7,
          }
        )
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Vector store retrieval failed:', error)
        }
        // Fallback to empty historical context
      }
    }

    // Combine and optimize token usage
    return this.optimizeContext(immediateContext, historicalContext, options)
  }

  /**
   * Get immediate context from sliding window
   */
  private getImmediateContext(): ContextMessage[] {
    // Keep most recent messages up to immediateWindowSize
    const recentCount = Math.min(
      this.config.immediateWindowSize,
      this.historyBuffer.length
    )
    return this.historyBuffer.slice(-recentCount)
  }

  /**
   * Optimize context to fit within token budget
   */
  private optimizeContext(
    immediate: ContextMessage[],
    historical: MemoryItem[],
    options?: {
      includeSystemMessage?: boolean
      systemMessage?: string
    }
  ): OptimizedContext {
    const contextTokens = Math.floor(
      this.config.maxTokens * this.config.contextRatio
    )
    const layersUsed: MemoryLayer[] = ['real-time']

    const result: ContextMessage[] = []
    let currentTokens = 0

    // Add system message if provided
    if (options?.includeSystemMessage && options?.systemMessage) {
      const systemTokens = this.config.countTokens(options.systemMessage)
      if (systemTokens <= contextTokens) {
        result.push({
          role: 'system',
          content: options.systemMessage,
        })
        currentTokens += systemTokens
      }
    }

    // Add immediate context (highest priority)
    const immediateTokens = immediate.reduce(
      (sum, msg) => sum + this.config.countTokens(msg.content),
      0
    )

    if (currentTokens + immediateTokens <= contextTokens * 0.6) {
      // Fits within 60% budget, add all immediate context
      result.push(...immediate)
      currentTokens += immediateTokens
    } else {
      // Compress immediate context
      const compressed = this.compressMessages(
        immediate,
        Math.floor(contextTokens * 0.6) - currentTokens
      )
      result.push(...compressed)
      currentTokens += compressed.reduce(
        (sum, msg) => sum + this.config.countTokens(msg.content),
        0
      )
    }

    // Add historical context if space allows
    const remainingTokens = contextTokens - currentTokens
    if (remainingTokens > 0 && historical.length > 0) {
      const historicalContext = this.selectHistoricalContext(
        historical,
        remainingTokens
      )

      // Convert memory items to context messages
      historicalContext.forEach((memory) => {
        result.push({
          role: 'system',
          content: `[Memory: ${memory.label}] ${memory.value}`,
        })
        currentTokens += this.config.countTokens(memory.value)

        // Track layers used
        if (!layersUsed.includes(memory.layer)) {
          layersUsed.push(memory.layer)
        }
      })
    }

    return {
      messages: result.filter((m) => m.role !== 'function') as Array<{
        role: 'user' | 'assistant' | 'system'
        content: string
      }>,
      totalTokens: currentTokens,
      compressionRatio:
        immediate.length > 0 ? result.length / immediate.length : undefined,
      layersUsed,
      retrievedMemories: historical,
    }
  }

  /**
   * Compress messages to fit token budget
   */
  private compressMessages(
    messages: ContextMessage[],
    maxTokens: number
  ): ContextMessage[] {
    if (messages.length === 0) return []

    // Strategy: Keep most recent messages, summarize older ones
    const kept: ContextMessage[] = []
    let tokens = 0

    // Keep messages from newest, fitting as many as possible
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i]
      if (!msg) continue

      const msgTokens = this.config.countTokens(msg.content)

      if (tokens + msgTokens <= maxTokens) {
        kept.unshift(msg)
        tokens += msgTokens
      } else {
        break
      }
    }

    // If we have remaining tokens and messages, create a summary
    const remainingTokens = maxTokens - tokens
    if (remainingTokens > 50 && kept.length < messages.length) {
      const summarized = messages.slice(0, messages.length - kept.length)
      const summary = this.createSummary(summarized, remainingTokens)

      if (summary) {
        kept.unshift({
          role: 'system',
          content: `Previous conversation summary: ${summary}`,
        })
      }
    }

    return kept
  }

  /**
   * Create summary of messages
   */
  private createSummary(
    messages: ContextMessage[],
    maxTokens: number
  ): string | null {
    if (messages.length === 0) return null

    const content = messages.map((m) => `${m.role}: ${m.content}`).join('\n')

    // Simple summarization: extract key sentences
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 20)

    if (sentences.length === 0) return null

    // Keep first and last sentences, plus key middle ones
    const keySentences: string[] = []

    if (sentences.length > 0 && sentences[0]) {
      keySentences.push(sentences[0])
    }

    if (sentences.length > 1 && sentences[sentences.length - 1]) {
      keySentences.push(sentences[sentences.length - 1])
    }

    // Add middle sentences if space allows
    const middleStart = Math.floor(sentences.length / 3)
    const middleEnd = Math.floor((sentences.length * 2) / 3)

    for (let i = middleStart; i < middleEnd && i < sentences.length; i++) {
      const sentence = sentences[i]
      if (!sentence) continue

      const sentenceTokens = this.config.countTokens(sentence)
      const currentTokens = keySentences.reduce(
        (sum, s) => sum + this.config.countTokens(s),
        0
      )

      if (currentTokens + sentenceTokens <= maxTokens) {
        keySentences.push(sentence)
      } else {
        break
      }
    }

    return keySentences.join('. ').substring(0, maxTokens * 4) // Rough char limit
  }

  /**
   * Select historical context that fits within token budget
   */
  private selectHistoricalContext(
    memories: MemoryItem[],
    maxTokens: number
  ): MemoryItem[] {
    const selected: MemoryItem[] = []
    let tokens = 0

    // Sort by importance score and recency
    const sorted = [...memories].sort((a, b) => {
      const importanceDiff = (b.importanceScore ?? 0) - (a.importanceScore ?? 0)
      if (Math.abs(importanceDiff) > 0.1) return importanceDiff

      return b.lastUpdated.getTime() - a.lastUpdated.getTime()
    })

    for (const memory of sorted) {
      const memoryTokens =
        memory.tokens || this.config.countTokens(memory.value)

      if (tokens + memoryTokens <= maxTokens) {
        selected.push(memory)
        tokens += memoryTokens
      } else {
        break
      }
    }

    return selected
  }

  /**
   * Clear history buffer
   */
  clear(): void {
    this.historyBuffer = []
  }

  /**
   * Get current buffer statistics
   */
  getStats(): {
    bufferSize: number
    estimatedTokens: number
    oldestMessage?: Date
    newestMessage?: Date
  } {
    const tokens = this.historyBuffer.reduce(
      (sum, msg) => sum + this.config.countTokens(msg.content),
      0
    )

    return {
      bufferSize: this.historyBuffer.length,
      estimatedTokens: tokens,
      oldestMessage: this.historyBuffer.length > 0 ? new Date() : undefined,
      newestMessage: this.historyBuffer.length > 0 ? new Date() : undefined,
    }
  }
}
