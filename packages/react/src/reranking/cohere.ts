/**
 * Cohere Rerank Integration
 *
 * Production-grade reranking using Cohere's Rerank API.
 * Significantly improves retrieval quality through cross-encoder models.
 *
 * Cohere Rerank uses cross-encoder models that consider query-document pairs
 * jointly, providing much higher accuracy than bi-encoder retrieval alone.
 *
 * @example
 * ```tsx
 * const reranker = new CohereReranker({
 *   apiKey: process.env.COHERE_API_KEY,
 *   model: 'rerank-english-v3.0'
 * })
 *
 * const reranked = await reranker.rerank({
 *   query: 'What is machine learning?',
 *   documents: searchResults,
 *   topK: 5
 * })
 * ```
 */

import type {
  Reranker,
  RerankRequest,
  RerankResponse,
  RerankResult,
} from './types'

export interface CohereRerankerConfig {
  /** Cohere API key */
  apiKey: string
  /** Model to use for reranking */
  model?:
    | 'rerank-english-v3.0'
    | 'rerank-multilingual-v3.0'
    | 'rerank-english-v2.0'
  /** API endpoint (defaults to Cohere's production endpoint) */
  endpoint?: string
  /** Maximum retries on failure */
  maxRetries?: number
  /** Timeout in milliseconds */
  timeout?: number
}

export interface CohereRerankOptions {
  /** Return documents with reranking */
  returnDocuments?: boolean
  /** Maximum number of chunks per document (for long documents) */
  maxChunksPerDoc?: number
}

export class CohereReranker implements Reranker {
  readonly name = 'cohere'

  private apiKey: string
  private model: string
  private endpoint: string
  private maxRetries: number
  private timeout: number

  constructor(config: CohereRerankerConfig) {
    if (!config.apiKey) {
      throw new Error('Cohere API key is required')
    }

    this.apiKey = config.apiKey
    this.model = config.model || 'rerank-english-v3.0'
    this.endpoint = config.endpoint || 'https://api.cohere.ai/v1'
    this.maxRetries = config.maxRetries || 3
    this.timeout = config.timeout || 30000 // 30 seconds
  }

  async rerank(
    request: RerankRequest,
    options?: CohereRerankOptions
  ): Promise<RerankResponse> {
    try {
      // Prepare documents for Cohere API
      const documents = request.documents.map((doc) => ({
        text: doc.content,
      }))

      const cohereRequest = {
        model: this.model,
        query: request.query,
        documents,
        top_n: request.topK || documents.length,
        return_documents: options?.returnDocuments ?? false,
        max_chunks_per_doc: options?.maxChunksPerDoc,
      }

      // Call Cohere API with retries
      const response = await this.callCohereAPI(cohereRequest)

      // Transform Cohere response to our format
      const results: RerankResult[] = response.results.map((result: any) => {
        const originalDoc = request.documents[result.index]
        return {
          id: originalDoc?.id || `doc-${result.index}`,
          originalScore: originalDoc?.score || 0,
          rerankScore: result.relevance_score,
          content: originalDoc?.content || '',
          metadata: originalDoc?.metadata,
          rank: result.index,
        }
      })

      // Sort by rerank score (Cohere returns in relevance order already)
      const sortedResults = results
        .sort((a, b) => b.rerankScore - a.rerankScore)
        .map((result, index) => ({
          ...result,
          rank: index,
        }))

      return {
        results: sortedResults,
        model: this.model,
        metadata: {
          cohereRequestId: response.id,
          billedUnits: response.meta?.billed_units,
        },
      }
    } catch (error) {
      // Fallback to original order if reranking fails
      if (process.env.NODE_ENV === 'development') {
        console.error('Cohere reranking failed:', error)
      }

      return {
        results: request.documents.map((doc, index) => ({
          id: doc.id,
          originalScore: doc.score || 0,
          rerankScore: doc.score || 0,
          content: doc.content,
          metadata: doc.metadata,
          rank: index,
        })),
        model: this.model,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Call Cohere API with retry logic
   */
  private async callCohereAPI(request: any, attempt: number = 1): Promise<any> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.endpoint}/rerank`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorBody = await response.text()
        let errorMessage = `Cohere API error (${response.status}): ${response.statusText}`

        try {
          const errorJson = JSON.parse(errorBody)
          errorMessage = errorJson.message || errorMessage
        } catch {
          // Use default error message
        }

        // Check if we should retry
        if (this.shouldRetry(response.status) && attempt < this.maxRetries) {
          const delay = this.calculateRetryDelay(attempt)
          await this.sleep(delay)
          return this.callCohereAPI(request, attempt + 1)
        }

        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)

      // Retry on network errors
      if (
        error instanceof Error &&
        error.name === 'AbortError' &&
        attempt < this.maxRetries
      ) {
        const delay = this.calculateRetryDelay(attempt)
        await this.sleep(delay)
        return this.callCohereAPI(request, attempt + 1)
      }

      throw error
    }
  }

  /**
   * Determine if error is retryable
   */
  private shouldRetry(statusCode: number): boolean {
    // Retry on:
    // - 429 (Too Many Requests)
    // - 500-599 (Server errors)
    return statusCode === 429 || (statusCode >= 500 && statusCode < 600)
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, ...
    const baseDelay = 1000
    const maxDelay = 10000 // Max 10 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay)

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.3 * delay
    return delay + jitter
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Get available models
   */
  static getModels(): Array<{
    id: string
    name: string
    description: string
    languages: string[]
    maxTokens: number
  }> {
    return [
      {
        id: 'rerank-english-v3.0',
        name: 'Rerank English v3.0',
        description: 'Latest English reranking model with best accuracy',
        languages: ['en'],
        maxTokens: 4096,
      },
      {
        id: 'rerank-multilingual-v3.0',
        name: 'Rerank Multilingual v3.0',
        description: 'Multilingual reranking supporting 100+ languages',
        languages: ['multi'],
        maxTokens: 4096,
      },
      {
        id: 'rerank-english-v2.0',
        name: 'Rerank English v2.0',
        description: 'Previous generation English model',
        languages: ['en'],
        maxTokens: 2048,
      },
    ]
  }

  /**
   * Estimate cost for reranking
   * Based on Cohere's pricing (as of 2024)
   */
  static estimateCost(searchCount: number): {
    searches: number
    costUSD: number
    costPer1000: number
  } {
    // Cohere Rerank pricing: $2.00 per 1000 searches
    const costPer1000 = 2.0
    const costUSD = (searchCount / 1000) * costPer1000

    return {
      searches: searchCount,
      costUSD,
      costPer1000,
    }
  }
}

/**
 * Usage Notes:
 *
 * 1. Get API Key:
 *    - Sign up at https://cohere.ai
 *    - Get API key from dashboard
 *
 * 2. Model Selection:
 *    - rerank-english-v3.0: Best for English content
 *    - rerank-multilingual-v3.0: For non-English or mixed language content
 *    - rerank-english-v2.0: Legacy model
 *
 * 3. Performance:
 *    - Latency: ~200-500ms for 10-50 documents
 *    - Can handle up to 1000 documents per request
 *    - Recommended: Rerank top 50-100 results from initial retrieval
 *
 * 4. Cost Optimization:
 *    - Use for final top-K selection only
 *    - Filter to 50-100 candidates before reranking
 *    - Cache reranking results for repeated queries
 *    - Cost: $2 per 1000 rerank requests
 *
 * 5. Quality Improvements:
 *    - Typically +10-30% accuracy vs. embedding-only retrieval
 *    - Best for: Question answering, semantic search, similarity ranking
 *    - Understands: Negation, nuance, context, intent
 */
