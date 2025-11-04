/**
 * OpenAI Embeddings Provider
 * 
 * High-quality embeddings with excellent semantic understanding.
 * text-embedding-3-small and text-embedding-3-large are recommended.
 */

import type {
  EmbeddingProvider,
  EmbeddingConfig,
  EmbeddingRequest,
  EmbeddingResponse,
  EmbeddingModel,
} from './types'

export const OPENAI_EMBEDDING_MODELS: EmbeddingModel[] = [
  {
    id: 'text-embedding-3-small',
    name: 'Text Embedding 3 Small',
    dimension: 1536,
    maxTokens: 8191,
    costPer1M: 0.02,
    performance: 'fast',
    useCase: 'General purpose, cost-effective',
  },
  {
    id: 'text-embedding-3-large',
    name: 'Text Embedding 3 Large',
    dimension: 3072,
    maxTokens: 8191,
    costPer1M: 0.13,
    performance: 'quality',
    useCase: 'Maximum quality, complex tasks',
  },
  {
    id: 'text-embedding-ada-002',
    name: 'Ada v2 (Legacy)',
    dimension: 1536,
    maxTokens: 8191,
    costPer1M: 0.10,
    performance: 'balanced',
    useCase: 'Legacy applications',
  },
]

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'openai'
  readonly defaultModel = 'text-embedding-3-small'
  readonly models = OPENAI_EMBEDDING_MODELS
  
  private apiKey: string
  private endpoint: string
  private batchSize: number
  
  constructor(config: EmbeddingConfig) {
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required')
    }
    
    this.apiKey = config.apiKey
    this.endpoint = config.endpoint || 'https://api.openai.com/v1'
    this.batchSize = config.batchSize || 100
  }
  
  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const model = request.model || this.defaultModel
    const input = Array.isArray(request.input) ? request.input : [request.input]
    
    const response = await fetch(`${this.endpoint}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input,
        model,
        encoding_format: request.encodingFormat || 'float',
        dimensions: request.dimensions,
        user: request.user,
      }),
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI embedding failed: ${error}`)
    }
    
    const data = await response.json()
    
    return {
      embeddings: data.data.map((item: any) => item.embedding),
      model: data.model,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        totalTokens: data.usage.total_tokens,
      },
      dimension: data.data[0].embedding.length,
    }
  }
  
  async embedText(text: string, model?: string): Promise<number[]> {
    const response = await this.embed({
      input: text,
      model,
    })
    return response.embeddings[0]
  }
  
  async embedBatch(texts: string[], model?: string): Promise<number[][]> {
    // Process in batches
    const allEmbeddings: number[][] = []
    
    for (let i = 0; i < texts.length; i += this.batchSize) {
      const batch = texts.slice(i, i + this.batchSize)
      const response = await this.embed({
        input: batch,
        model,
      })
      allEmbeddings.push(...response.embeddings)
    }
    
    return allEmbeddings
  }
  
  getDimension(model?: string): number {
    const modelId = model || this.defaultModel
    const modelInfo = this.models.find(m => m.id === modelId)
    return modelInfo?.dimension || 1536
  }
}

