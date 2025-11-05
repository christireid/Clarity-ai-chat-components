/**
 * Chroma Vector Store Implementation
 * 
 * Open-source embedding database with excellent developer experience.
 * Perfect for prototyping and can be self-hosted.
 */

import type {
  VectorStore,
  VectorStoreConfig,
  Vector,
  VectorQuery,
  VectorMatch,
  VectorUpsertOptions,
  VectorStats,
} from './types'

export interface ChromaConfig extends VectorStoreConfig {
  provider: 'chroma'
  endpoint?: string
  tenant?: string
  database?: string
}

export class ChromaVectorStore implements VectorStore {
  readonly provider = 'chroma'
  
  private endpoint: string
  private collectionName: string
  private tenant: string
  private database: string
  private collectionId?: string
  private initialized = false
  
  constructor(config: ChromaConfig) {
    this.endpoint = (config.endpoint || 'http://localhost:8000').replace(/\/$/, '')
    this.collectionName = config.indexName
    this.tenant = config.tenant || 'default_tenant'
    this.database = config.database || 'default_database'
  }
  
  async initialize(): Promise<void> {
    // Get or create collection
    const response = await fetch(
      `${this.endpoint}/api/v1/collections`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.collectionName,
          metadata: {},
          get_or_create: true,
        }),
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to initialize Chroma collection: ${await response.text()}`)
    }
    
    const data = await response.json()
    this.collectionId = data.id
    this.initialized = true
  }
  
  async upsert(vectors: Vector[], options?: VectorUpsertOptions): Promise<void> {
    if (!this.collectionId) {
      await this.initialize()
    }
    
    const response = await fetch(
      `${this.endpoint}/api/v1/collections/${this.collectionId}/upsert`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: vectors.map(v => v.id),
          embeddings: vectors.map(v => v.values),
          metadatas: vectors.map(v => v.metadata || {}),
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Chroma upsert failed: ${error}`)
    }
  }
  
  async query(query: VectorQuery): Promise<VectorMatch[]> {
    if (!this.collectionId) {
      await this.initialize()
    }
    
    if (!query.vector) {
      throw new Error('Vector query is required for Chroma')
    }
    
    const response = await fetch(
      `${this.endpoint}/api/v1/collections/${this.collectionId}/query`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query_embeddings: [query.vector],
          n_results: query.topK || 10,
          where: query.filter,
          include: [
            query.includeMetadata !== false ? 'metadatas' : null,
            query.includeValues ? 'embeddings' : null,
            'distances',
          ].filter(Boolean),
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Chroma query failed: ${error}`)
    }
    
    const data = await response.json()
    
    // Chroma returns arrays for each field
    const ids = data.ids[0] || []
    const distances = data.distances[0] || []
    const metadatas = data.metadatas?.[0] || []
    const embeddings = data.embeddings?.[0] || []
    
    return ids.map((id: string, i: number) => {
      // Convert distance to similarity score (0-1)
      // Chroma uses L2 distance, convert to cosine similarity approximation
      const score = 1 / (1 + distances[i])
      
      if (query.minScore && score < query.minScore) {
        return null
      }
      
      return {
        id,
        score,
        values: embeddings[i],
        metadata: metadatas[i],
      }
    }).filter(Boolean) as VectorMatch[]
  }
  
  async delete(ids: string[], namespace?: string): Promise<void> {
    if (!this.collectionId) {
      await this.initialize()
    }
    
    const response = await fetch(
      `${this.endpoint}/api/v1/collections/${this.collectionId}/delete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids,
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Chroma delete failed: ${error}`)
    }
  }
  
  async deleteNamespace(namespace: string): Promise<void> {
    if (!this.collectionId) {
      await this.initialize()
    }
    
    // Delete all vectors with matching namespace in metadata
    const response = await fetch(
      `${this.endpoint}/api/v1/collections/${this.collectionId}/delete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          where: {
            namespace: { $eq: namespace },
          },
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Chroma deleteNamespace failed: ${error}`)
    }
  }
  
  async getStats(): Promise<VectorStats> {
    if (!this.collectionId) {
      await this.initialize()
    }
    
    const response = await fetch(
      `${this.endpoint}/api/v1/collections/${this.collectionId}/count`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Chroma getStats failed: ${error}`)
    }
    
    const count = await response.json()
    
    return {
      totalVectors: count,
      dimension: 0, // Chroma doesn't expose dimension directly
      status: 'ready',
    }
  }
  
  async fetch(ids: string[], namespace?: string): Promise<Vector[]> {
    if (!this.collectionId) {
      await this.initialize()
    }
    
    const response = await fetch(
      `${this.endpoint}/api/v1/collections/${this.collectionId}/get`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids,
          include: ['metadatas', 'embeddings'],
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Chroma fetch failed: ${error}`)
    }
    
    const data = await response.json()
    
    return data.ids.map((id: string, i: number) => ({
      id,
      values: data.embeddings?.[i] || [],
      metadata: data.metadatas?.[i] || {},
    }))
  }
  
  async list(namespace?: string, limit = 100, paginationToken?: string): Promise<{
    ids: string[]
    nextToken?: string
  }> {
    if (!this.collectionId) {
      await this.initialize()
    }
    
    const offset = paginationToken ? parseInt(paginationToken) : 0
    
    const response = await fetch(
      `${this.endpoint}/api/v1/collections/${this.collectionId}/get`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit,
          offset,
          where: namespace ? { namespace: { $eq: namespace } } : undefined,
          include: [], // Only IDs
        }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Chroma list failed: ${error}`)
    }
    
    const data = await response.json()
    
    return {
      ids: data.ids || [],
      nextToken: data.ids.length === limit ? String(offset + limit) : undefined,
    }
  }
  
  async close(): Promise<void> {
    this.initialized = false
    this.collectionId = undefined
  }
}

