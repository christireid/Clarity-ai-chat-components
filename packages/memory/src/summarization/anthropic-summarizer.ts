/**
 * Anthropic Summarizer
 *
 * Uses Anthropic's Claude API to summarize text
 */

import type { Summarizer } from './summarizer'

export interface AnthropicSummarizerConfig {
  apiKey: string
  model?: string
  temperature?: number
  maxRetries?: number
  /** Maximum concurrent requests for batch operations (default: 3) */
  maxConcurrency?: number
}

/**
 * Anthropic Claude-based text summarizer
 *
 * @example
 * ```typescript
 * const summarizer = new AnthropicSummarizer({
 *   apiKey: process.env.ANTHROPIC_API_KEY,
 *   model: 'claude-3-haiku-20240307',
 * })
 *
 * const summary = await summarizer.summarize(longText, 200)
 * ```
 */
export class AnthropicSummarizer implements Summarizer {
  private apiKey: string
  private model: string
  private temperature: number
  private maxRetries: number
  private maxConcurrency: number

  constructor(config: AnthropicSummarizerConfig) {
    this.apiKey = config.apiKey
    this.model = config.model || 'claude-3-haiku-20240307'
    this.temperature = config.temperature ?? 0.3
    this.maxRetries = config.maxRetries ?? 3
    this.maxConcurrency = config.maxConcurrency ?? 3
  }

  /**
   * Summarize a single text
   */
  async summarize(text: string, maxTokens: number): Promise<string> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: this.model,
            max_tokens: Math.floor(maxTokens * 1.2), // Allow some buffer
            messages: [
              {
                role: 'user',
                content: `Summarize the following text concisely, preserving key facts and information. Target approximately ${maxTokens} tokens.\n\nText to summarize:\n${text}`,
              },
            ],
            temperature: this.temperature,
          }),
        })

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: 'Unknown error' }))

          // Check for retryable errors
          if (
            response.status === 529 ||
            response.status === 503 ||
            response.status === 502
          ) {
            lastError = new Error(
              `Anthropic API temporarily unavailable: ${response.status}`
            )
            // Wait before retry with exponential backoff
            await this.delay(Math.pow(2, attempt) * 1000)
            continue
          }

          throw new Error(
            `Anthropic summarization failed: ${JSON.stringify(error)}`
          )
        }

        const data = await response.json()

        // Validate response structure
        if (!data || typeof data !== 'object') {
          throw new Error(
            `Invalid Anthropic response: expected object, got ${typeof data}`
          )
        }

        if (!Array.isArray(data.content) || data.content.length === 0) {
          throw new Error(
            `Invalid Anthropic response: missing or empty content array. Response: ${JSON.stringify(data).slice(0, 200)}`
          )
        }

        // Extract text from Anthropic's response format
        const content = data.content[0]
        if (
          !content ||
          content.type !== 'text' ||
          typeof content.text !== 'string'
        ) {
          throw new Error(
            `Invalid Anthropic response: expected text content, got ${JSON.stringify(content).slice(0, 200)}`
          )
        }

        return content.text
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry non-retryable errors
        if (
          lastError.message.includes('invalid') ||
          lastError.message.includes('unauthorized')
        ) {
          throw lastError
        }

        // Wait before retry
        if (attempt < this.maxRetries - 1) {
          await this.delay(Math.pow(2, attempt) * 1000)
        }
      }
    }

    throw lastError || new Error('Anthropic summarization failed after retries')
  }

  /**
   * Summarize multiple texts with controlled concurrency
   *
   * Uses parallel processing with configurable concurrency limit to balance
   * throughput and API rate limits.
   */
  async summarizeBatch(texts: string[], maxTokens: number): Promise<string[]> {
    if (texts.length === 0) return []

    // Process in parallel with concurrency limit
    const results: string[] = new Array(texts.length)
    const executing: Set<Promise<void>> = new Set()

    for (let i = 0; i < texts.length; i++) {
      const index = i
      const promise = this.summarize(texts[index]!, maxTokens)
        .then((summary) => {
          results[index] = summary
        })
        .finally(() => {
          executing.delete(promise)
        })

      executing.add(promise)

      // When we hit concurrency limit, wait for one to complete
      if (executing.size >= this.maxConcurrency) {
        await Promise.race(executing)
      }
    }

    // Wait for all remaining
    await Promise.all(executing)

    return results
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
