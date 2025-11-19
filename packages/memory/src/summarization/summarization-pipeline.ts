/**
 * Summarization Pipeline
 * 
 * Handles automatic summarization of memories
 */

import type { Memory, SummarizationConfig } from '../types'
import type { Summarizer } from './summarizer'
import { OpenAISummarizer } from './openai-summarizer'

export class SummarizationPipeline {
  private config: SummarizationConfig
  private summarizer?: Summarizer
  private intervalId?: NodeJS.Timeout

  constructor(config: SummarizationConfig) {
    this.config = config
    
    if (config.enabled) {
      this.summarizer = this.createSummarizer()
    }
  }

  /**
   * Summarize a single memory
   */
  async summarize(memory: Memory): Promise<string> {
    if (!this.summarizer) {
      throw new Error('Summarizer not configured')
    }

    const maxTokens = this.config.maxTokens || Math.floor(this.countTokens(memory.content) * 0.5)
    return this.summarizer.summarize(memory.content, maxTokens)
  }

  /**
   * Summarize multiple memories
   */
  async summarizeBatch(memories: Memory[]): Promise<Map<string, string>> {
    if (!this.summarizer) {
      throw new Error('Summarizer not configured')
    }

    const texts = memories.map(m => m.content)
    const maxTokens = this.config.maxTokens || 200
    
    const summaries = await this.summarizer.summarizeBatch(texts, maxTokens)
    
    const result = new Map<string, string>()
    memories.forEach((memory, index) => {
      result.set(memory.id, summaries[index] || memory.content)
    })

    return result
  }

  /**
   * Start automatic summarization
   */
  start(callback: (memoryId: string, summary: string) => Promise<void>): void {
    if (!this.config.enabled || !this.intervalId) {
      this.intervalId = setInterval(async () => {
        // This would be called periodically to summarize old memories
        // Implementation depends on storage integration
      }, this.config.interval)
    }
  }

  /**
   * Stop automatic summarization
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
  }

  private createSummarizer(): Summarizer {
    switch (this.config.provider) {
      case 'openai':
        if (!process.env.OPENAI_API_KEY) {
          throw new Error('OpenAI API key required for summarization')
        }
        return new OpenAISummarizer({
          apiKey: process.env.OPENAI_API_KEY,
          model: this.config.model,
        })
      case 'anthropic':
        // TODO: Implement Anthropic summarizer
        throw new Error('Anthropic summarizer not yet implemented')
      case 'local':
        // TODO: Implement local summarizer
        throw new Error('Local summarizer not yet implemented')
      default:
        throw new Error(`Unknown summarizer provider: ${this.config.provider}`)
    }
  }

  private countTokens(text: string): number {
    return countTokens(text)
  }
}
