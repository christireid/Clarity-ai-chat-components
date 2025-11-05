/**
 * Memory Buffering & Summarization Utilities
 * 
 * Implements intelligent memory compression and buffering to prevent context overflow
 * while preserving essential information through hierarchical summarization.
 */

import type { MemoryItem, MemoryBufferConfig, MemoryType } from './types'

export interface BufferedMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  tokens?: number
}

export interface CompressedHistory {
  summary: string
  timestampRange: { start: Date; end: Date }
  messageCount: number
  topics: string[]
  tokens: number
}

/**
 * Memory Buffer Manager
 * 
 * Manages conversation history with intelligent compression and summarization
 */
export class MemoryBuffer {
  private buffer: BufferedMessage[] = []
  private compressedHistory: CompressedHistory[] = []
  private config: MemoryBufferConfig

  constructor(config: Partial<MemoryBufferConfig> = {}) {
    this.config = {
      bufferSize: config.bufferSize ?? 10,
      summaryThreshold: config.summaryThreshold ?? 20,
      compressionRatio: config.compressionRatio ?? 8,
      minTokensToCompress: config.minTokensToCompress ?? 2000,
    }
  }

  /**
   * Add a message to the buffer
   */
  addMessage(message: BufferedMessage): void {
    this.buffer.push(message)

    // Trigger compression when threshold is reached
    if (this.buffer.length >= this.config.summaryThreshold) {
      this.compressAndArchive()
    }
  }

  /**
   * Compress messages and archive them
   */
  private compressAndArchive(): void {
    const messagesToCompress = this.buffer.slice(0, Math.floor(this.buffer.length / 2))
    
    if (messagesToCompress.length === 0) return

    // Create hierarchical summary
    const summary = this.createHierarchicalSummary(messagesToCompress)
    const tokens = this.estimateTokens(summary)

    // Store compressed version
    this.compressedHistory.push({
      summary,
      timestampRange: {
        start: messagesToCompress[0].timestamp,
        end: messagesToCompress[messagesToCompress.length - 1].timestamp,
      },
      messageCount: messagesToCompress.length,
      topics: this.extractTopics(messagesToCompress),
      tokens,
    })

    // Remove compressed messages from buffer
    this.buffer = this.buffer.slice(messagesToCompress.length)
  }

  /**
   * Create hierarchical summary using progressive summarization
   */
  private createHierarchicalSummary(messages: BufferedMessage[]): string {
    if (messages.length <= 5) {
      return this.simpleSummary(messages)
    }

    // Chunk and summarize recursively
    const chunkSize = 5
    const chunks: BufferedMessage[][] = []
    
    for (let i = 0; i < messages.length; i += chunkSize) {
      chunks.push(messages.slice(i, i + chunkSize))
    }

    const chunkSummaries = chunks.map((chunk) => this.simpleSummary(chunk))
    
    // Summarize the summaries
    const summaryMessages: BufferedMessage[] = chunkSummaries.map((summary, idx) => ({
      role: 'system' as const,
      content: summary,
      timestamp: new Date(),
    }))

    return this.simpleSummary(summaryMessages)
  }

  /**
   * Create a simple summary of messages
   */
  private simpleSummary(messages: BufferedMessage[]): string {
    if (messages.length === 0) return ''

    const userMessages = messages.filter((m) => m.role === 'user')
    const assistantMessages = messages.filter((m) => m.role === 'assistant')

    const parts: string[] = []

    if (userMessages.length > 0) {
      const userTopics = userMessages
        .map((m) => this.extractKeyPoints(m.content))
        .filter((p) => p.length > 0)
        .join('; ')
      
      if (userTopics) {
        parts.push(`User discussed: ${userTopics}`)
      }
    }

    if (assistantMessages.length > 0) {
      const assistantKeyPoints = assistantMessages
        .map((m) => this.extractKeyPoints(m.content))
        .filter((p) => p.length > 0)
        .join('; ')
      
      if (assistantKeyPoints) {
        parts.push(`Assistant provided: ${assistantKeyPoints}`)
      }
    }

    return parts.join('. ') || 'Conversation exchange occurred.'
  }

  /**
   * Extract key points from content (simplified - would use NLP in production)
   */
  private extractKeyPoints(content: string): string {
    // Simple extraction: first sentence or key phrases
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 10)
    if (sentences.length === 0) return ''
    
    // Return first meaningful sentence, truncated
    const firstSentence = sentences[0].trim()
    return firstSentence.length > 100 
      ? firstSentence.substring(0, 100) + '...'
      : firstSentence
  }

  /**
   * Extract topics from messages
   */
  private extractTopics(messages: BufferedMessage[]): string[] {
    const allText = messages.map((m) => m.content).join(' ')
    const words = allText.toLowerCase().split(/\s+/)
    
    // Simple keyword extraction (would use NLP in production)
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were'])
    const wordFreq = new Map<string, number>()
    
    words.forEach((word) => {
      const cleaned = word.replace(/[^\w]/g, '')
      if (cleaned.length > 4 && !commonWords.has(cleaned)) {
        wordFreq.set(cleaned, (wordFreq.get(cleaned) || 0) + 1)
      }
    })

    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)
  }

  /**
   * Get time range for messages
   */
  private getTimeRange(messages: BufferedMessage[]): { start: Date; end: Date } {
    if (messages.length === 0) {
      const now = new Date()
      return { start: now, end: now }
    }
    
    return {
      start: messages[0].timestamp,
      end: messages[messages.length - 1].timestamp,
    }
  }

  /**
   * Get optimized context within token budget
   */
  getContext(maxTokens: number = 2000): {
    messages: BufferedMessage[]
    summaries: CompressedHistory[]
    totalTokens: number
  } {
    const contextParts: BufferedMessage[] = []
    let tokenCount = 0
    const maxImmediateTokens = Math.floor(maxTokens * 0.6) // 60% for immediate context

    // Include recent messages first (highest priority)
    for (let i = this.buffer.length - 1; i >= 0; i--) {
      const message = this.buffer[i]
      const messageTokens = message.tokens || this.estimateTokens(message.content)
      
      if (tokenCount + messageTokens > maxImmediateTokens) {
        break
      }
      
      contextParts.unshift(message)
      tokenCount += messageTokens
    }

    // Add compressed history if space allows
    const remainingTokens = maxTokens - tokenCount
    const includedSummaries: CompressedHistory[] = []
    
    for (let i = this.compressedHistory.length - 1; i >= 0; i--) {
      const summary = this.compressedHistory[i]
      
      if (summary.tokens <= remainingTokens) {
        includedSummaries.unshift(summary)
        tokenCount += summary.tokens
      } else {
        break
      }
    }

    return {
      messages: contextParts,
      summaries: includedSummaries,
      totalTokens: tokenCount,
    }
  }

  /**
   * Estimate tokens (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4)
  }

  /**
   * Clear buffer
   */
  clear(): void {
    this.buffer = []
    this.compressedHistory = []
  }

  /**
   * Get buffer statistics
   */
  getStats(): {
    bufferSize: number
    compressedCount: number
    totalMessages: number
    estimatedTokens: number
  } {
    const bufferTokens = this.buffer.reduce(
      (sum, msg) => sum + (msg.tokens || this.estimateTokens(msg.content)),
      0
    )
    const compressedTokens = this.compressedHistory.reduce(
      (sum, s) => sum + s.tokens,
      0
    )

    return {
      bufferSize: this.buffer.length,
      compressedCount: this.compressedHistory.length,
      totalMessages: this.buffer.length + this.compressedHistory.reduce((sum, s) => sum + s.messageCount, 0),
      estimatedTokens: bufferTokens + compressedTokens,
    }
  }
}
