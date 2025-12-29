/**
 * Chroma Vector Store Implementation
 *
 * Open-source embedding database with excellent developer experience.
 * Perfect for prototyping and can be self-hosted.
 */

import type {
  VectorStore,
  ChromaStoreConfig,
  Vector,
  VectorQuery,
  VectorMatch,
  VectorUpsertOptions,
  VectorStats,
  VectorMetadata,
} from './types'

/**
 * @deprecated Use ChromaStoreConfig from './types' instead. Will be removed in v3.0.
 * @see {@link ChromaStoreConfig} from './types' for the canonical type
 */
export type ChromaConfig = ChromaStoreConfig

/**
 * Default Chroma endpoint - uses environment variable or localhost for development.
 * In production, always set CHROMA_ENDPOINT environment variable.
 */
const getDefaultChromaEndpoint = (): string => {
  // Check for environment variable first (works in Node.js and some bundlers)
  if (typeof process !== 'undefined' && process.env?.CHROMA_ENDPOINT) {
    return process.env.CHROMA_ENDPOINT
  }
  // Fallback to localhost for development
  return 'http://localhost:8000'
}

/**
 * Validates Chroma endpoint configuration and warns about potential issues.
 */
const validateEndpoint = (
  endpoint: string,
  isExplicitConfig: boolean
): void => {
  const isLocalhost =
    endpoint.includes('localhost') || endpoint.includes('127.0.0.1')
  const isProduction =
    typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'

  if (isLocalhost && isProduction && !isExplicitConfig) {
    console.warn(
      '[ChromaVectorStore] Using localhost endpoint in production environment. ' +
        'This will likely fail. Set the CHROMA_ENDPOINT environment variable or ' +
        'pass an explicit endpoint in the config.'
    )
  }

  if (isLocalhost && !isExplicitConfig && typeof window !== 'undefined') {
    console.info(
      '[ChromaVectorStore] Using default localhost:8000 endpoint. ' +
        'For production, configure CHROMA_ENDPOINT or pass endpoint in config.'
    )
  }
}

export class ChromaVectorStore implements VectorStore {
  readonly provider = 'chroma'

  private endpoint: string
  private collectionName: string
  private tenant: string
  private database: string
  private collectionId?: string
  private initialized = false

  constructor(config: ChromaStoreConfig) {
    const isExplicitEndpoint = Boolean(config.endpoint)
    this.endpoint = (config.endpoint || getDefaultChromaEndpoint()).replace(
      /\/$/,
      ''
    )

    // Validate endpoint configuration
    validateEndpoint(this.endpoint, isExplicitEndpoint)

    this.collectionName = config.indexName
    this.tenant = config.tenant || 'default_tenant'
    this.database = config.database || 'default_database'
  }

  async initialize(): Promise<void> {
    // Get or create collection
    const response = await fetch(`${this.endpoint}/api/v1/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.collectionName,
        metadata: {},
        get_or_create: true,
      }),
    })

    if (!response.ok) {
      throw new Error(
        `Failed to initialize Chroma collection: ${await response.text()}`
      )
    }

    const data = await response.json()
    this.collectionId = data.id
    this.initialized = true
  }

  async upsert(
    vectors: Vector[],
    options?: VectorUpsertOptions
  ): Promise<void> {
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
          ids: vectors.map((v) => v.id),
          embeddings: vectors.map((v) => v.values),
          metadatas: vectors.map((v) => v.metadata || {}),
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

    return ids
      .map((id: string, i: number) => {
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
      })
      .filter(Boolean) as VectorMatch[]
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

  async list(
    namespace?: string,
    limit = 100,
    paginationToken?: string
  ): Promise<{
    ids: string[]
    nextToken?: string
  }> {
    if (!this.collectionId) {
      await this.initialize()
    }

    const offset = paginationToken ? parseInt(paginationToken, 10) : 0

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
