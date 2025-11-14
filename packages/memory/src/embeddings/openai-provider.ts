/**
 * OpenAI Embedding Provider
 */

import type { EmbeddingProvider } from './embedding-provider'

export interface OpenAIProviderConfig {
  apiKey: string
  model?: string
  dimensions?: number
}

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  private apiKey: string
  private model: string
  public dimensions: number

  constructor(config: OpenAIProviderConfig) {
    this.apiKey = config.apiKey
    this.model = config.model || 'text-embedding-3-small'
    this.dimensions = config.dimensions || 1536
  }

  async embed(text: string): Promise<number[]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        input: text,
        dimensions: this.dimensions,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(`OpenAI embedding failed: ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    return data.data[0]?.embedding || []
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        input: texts,
        dimensions: this.dimensions,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(`OpenAI batch embedding failed: ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    return data.data.map((item: any) => item.embedding)
  }
}
