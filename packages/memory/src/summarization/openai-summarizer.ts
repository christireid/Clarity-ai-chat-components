/**
 * OpenAI Summarizer
 * 
 * Uses OpenAI API to summarize text
 */

import type { Summarizer } from './summarizer'

export interface OpenAISummarizerConfig {
  apiKey: string
  model?: string
  temperature?: number
}

export class OpenAISummarizer implements Summarizer {
  private apiKey: string
  private model: string
  private temperature: number

  constructor(config: OpenAISummarizerConfig) {
    this.apiKey = config.apiKey
    this.model = config.model || 'gpt-4o-mini'
    this.temperature = config.temperature ?? 0.3
  }

  async summarize(text: string, maxTokens: number): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `Summarize the following text concisely, preserving key facts and information. Target approximately ${maxTokens} tokens.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: this.temperature,
        max_tokens: Math.floor(maxTokens * 1.2), // Allow some buffer
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(`OpenAI summarization failed: ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || text
  }

  async summarizeBatch(texts: string[], maxTokens: number): Promise<string[]> {
    // Summarize each text individually
    // In production, could batch multiple texts in a single request
    return Promise.all(texts.map(text => this.summarize(text, maxTokens)))
  }
}
