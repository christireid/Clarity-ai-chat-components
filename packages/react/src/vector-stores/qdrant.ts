/**
 * Qdrant Vector Store Implementation
 * 
 * High-performance vector database with excellent filtering capabilities.
 * Can be self-hosted or used via Qdrant Cloud.
 */

import type {
  VectorStore,
  QdrantStoreConfig,
  Vector,
  VectorQuery,
  VectorMatch,
  VectorUpsertOptions,
  VectorStats,
  VectorMetadata,
  VectorFilter,
  VectorFilterValue,
} from './types'

/** @deprecated Use QdrantStoreConfig from './types' instead */
export type QdrantConfig = QdrantStoreConfig

export class QdrantVectorStore implements VectorStore {
  readonly provider = 'qdrant'

  private apiKey?: string
  private endpoint: string
  private collectionName: string
  private _initialized = false

  constructor(config: QdrantStoreConfig) {
    if (!config.endpoint) {
      throw new Error('Qdrant endpoint is required')
    }
    
    this.apiKey = config.apiKey
    this.endpoint = config.endpoint.replace(/\/$/, '')
    this.collectionName = config.collectionName || config.indexName
  }
  
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.apiKey) {
      headers['api-key'] = this.apiKey
    }
    return headers
  }
  
  async initialize(): Promise<void> {
    // Check if collection exists, create if not
    const response = await fetch(
      `${this.endpoint}/collections/${this.collectionName}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    )
    
    if (response.status === 404) {
      // Collection doesn't exist, create it
      const createResponse = await fetch(`${this.endpoint}/collections/${this.collectionName}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          vectors: {
            size: 1536, // Default to OpenAI embedding size
            distance: 'Cosine',
          },
        }),
      })
      
      if (!createResponse.ok) {
        throw new Error(`Failed to create Qdrant collection: ${await createResponse.text()}`)
      }
    } else if (!response.ok) {
      throw new Error(`Failed to verify Qdrant collection: ${await response.text()}`)
    }
    
    this._initialized = true
  }
  
  async upsert(vectors: Vector[], _options?: VectorUpsertOptions): Promise<void> {
    const response = await fetch(
      `${this.endpoint}/collections/${this.collectionName}/points`,
      {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          points: vectors.map(v => ({
            id: v.id,
            vector: v.values,
            payload: v.metadata || {},
          })),
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Qdrant upsert failed: ${error}`)
    }
  }
  
  async query(query: VectorQuery): Promise<VectorMatch[]> {
    if (!query.vector) {
      throw new Error('Vector query is required for Qdrant')
    }
    
    const response = await fetch(
      `${this.endpoint}/collections/${this.collectionName}/points/search`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          vector: query.vector,
          limit: query.topK || 10,
          filter: query.filter ? this.convertFilter(query.filter) : undefined,
          with_payload: query.includeMetadata ?? true,
          with_vector: query.includeValues ?? false,
          score_threshold: query.minScore,
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Qdrant query failed: ${error}`)
    }
    
    const data = await response.json()
    
    return data.result.map((r: any) => ({
      id: r.id,
      score: r.score,
      values: r.vector,
      metadata: r.payload,
    }))
  }
  
  private convertFilter(filter: Record<string, any>): any {
    // Convert simple filter to Qdrant filter format
    const must: any[] = []
    
    for (const [key, value] of Object.entries(filter)) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        must.push({
          key,
          match: { value },
        })
      } else if (Array.isArray(value)) {
        must.push({
          key,
          match: { any: value },
        })
      }
    }
    
    return must.length > 0 ? { must } : undefined
  }
  
  async delete(ids: string[], _namespace?: string): Promise<void> {
    const response = await fetch(
      `${this.endpoint}/collections/${this.collectionName}/points/delete`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          points: ids,
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Qdrant delete failed: ${error}`)
    }
  }
  
  async deleteNamespace(namespace: string): Promise<void> {
    // Qdrant doesn't have native namespace support
    // Delete all points with matching namespace in metadata
    const response = await fetch(
      `${this.endpoint}/collections/${this.collectionName}/points/delete`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          filter: {
            must: [
              {
                key: 'namespace',
                match: { value: namespace },
              },
            ],
          },
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Qdrant deleteNamespace failed: ${error}`)
    }
  }
  
  async getStats(): Promise<VectorStats> {
    const response = await fetch(
      `${this.endpoint}/collections/${this.collectionName}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Qdrant getStats failed: ${error}`)
    }
    
    const data = await response.json()
    
    return {
      totalVectors: data.result.points_count || 0,
      dimension: data.result.config?.params?.vectors?.size || 0,
      status: data.result.status === 'green' ? 'ready' : 'initializing',
    }
  }
  
  async fetch(ids: string[], _namespace?: string): Promise<Vector[]> {
    const response = await fetch(
      `${this.endpoint}/collections/${this.collectionName}/points`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ids,
          with_payload: true,
          with_vector: true,
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Qdrant fetch failed: ${error}`)
    }
    
    const data = await response.json()
    
    return data.result.map((r: any) => ({
      id: r.id,
      values: r.vector,
      metadata: r.payload,
    }))
  }
  
  async list(namespace?: string, limit = 100, paginationToken?: string): Promise<{
    ids: string[]
    nextToken?: string
  }> {
    const offset = paginationToken ? parseInt(paginationToken) : 0
    
    const response = await fetch(
      `${this.endpoint}/collections/${this.collectionName}/points/scroll`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          limit,
          offset,
          with_payload: false,
          with_vector: false,
          filter: namespace ? {
            must: [
              {
                key: 'namespace',
                match: { value: namespace },
              },
            ],
          } : undefined,
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Qdrant list failed: ${error}`)
    }
    
    const data = await response.json()
    
    return {
      ids: data.result.points.map((p: any) => p.id),
      nextToken: data.result.next_page_offset ? String(data.result.next_page_offset) : undefined,
    }
  }
  
  async close(): Promise<void> {
    this._initialized = false
  }
}

