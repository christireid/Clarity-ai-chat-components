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

  constructor(config: AnthropicSummarizerConfig) {
    this.apiKey = config.apiKey
    this.model = config.model || 'claude-3-haiku-20240307'
    this.temperature = config.temperature ?? 0.3
    this.maxRetries = config.maxRetries ?? 3
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

        // Extract text from Anthropic's response format
        const content = data.content?.[0]
        if (content?.type === 'text') {
          return content.text
        }

        // Fallback to original text if no content
        return text
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
   * Summarize multiple texts
   */
  async summarizeBatch(texts: string[], maxTokens: number): Promise<string[]> {
    // Summarize each text individually
    // Anthropic doesn't have native batch support, so we process sequentially
    // to avoid rate limits
    const results: string[] = []

    for (const text of texts) {
      const summary = await this.summarize(text, maxTokens)
      results.push(summary)
    }

    return results
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
