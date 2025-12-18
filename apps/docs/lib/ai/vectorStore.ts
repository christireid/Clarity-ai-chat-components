import { logger } from '@clarity-chat/utils/logger';
/**
 * Vector Store
 *
 * Handles storing and retrieving document embeddings for semantic search.
 * Supports both Pinecone (production) and local storage (development).
 */

import { Pinecone } from '@pinecone-database/pinecone'
import fs from 'fs/promises'
import path from 'path'
import { cosineSimilarity } from './embeddings'

export interface DocChunk {
  id: string
  title: string
  content: string
  url: string
  category: 'component' | 'hook' | 'guide' | 'cookbook' | 'example' | 'concept'
  embedding: number[]
  metadata: {
    lastUpdated: string
    tags: string[]
    section?: string
    headings?: string[]
  }
}

export interface SearchResult {
  id: string
  title: string
  content: string
  url: string
  category: string
  score: number
  metadata: DocChunk['metadata']
}

export interface VectorStore {
  /** Initialize the vector store */
  initialize(): Promise<void>

  /** Store a single document chunk */
  upsert(chunk: DocChunk): Promise<void>

  /** Store multiple document chunks in batch */
  upsertBatch(chunks: DocChunk[]): Promise<void>

  /** Search for similar documents */
  search(embedding: number[], topK?: number): Promise<SearchResult[]>

  /** Delete a document chunk */
  delete(id: string): Promise<void>

  /** Delete all documents */
  clear(): Promise<void>

  /** Get statistics about the store */
  getStats(): Promise<{ count: number; dimensions: number }>
}

/**
 * Pinecone Vector Store (Production)
 */
export class PineconeVectorStore implements VectorStore {
  private client: Pinecone | null = null
  private indexName: string
  private namespace: string

  constructor(namespace = 'default') {
    this.indexName = process.env.PINECONE_INDEX_NAME || 'clarity-docs'
    this.namespace = namespace
  }

  private getClient(): Pinecone {
    if (!this.client) {
      const apiKey = process.env.PINECONE_API_KEY

      if (!apiKey) {
        throw new Error(
          'PINECONE_API_KEY environment variable is not set. ' +
          'Please add it to your .env.local file or use LocalVectorStore for development.'
        )
      }

      this.client = new Pinecone({ apiKey })
    }

    return this.client
  }

  async initialize(): Promise<void> {
    const client = this.getClient()

    try {
      // Check if index exists
      const indexes = await client.listIndexes()
      const indexExists = indexes.indexes?.some(index => index.name === this.indexName)

      if (!indexExists) {
        logger.debug(`Creating Pinecone index: ${this.indexName}`)

        await client.createIndex({
          name: this.indexName,
          dimension: 1536, // text-embedding-3-small default
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: process.env.PINECONE_ENVIRONMENT || 'us-east-1',
            },
          },
        })

        // Wait for index to be ready
        logger.debug('Waiting for index to be ready...')
        await new Promise(resolve => setTimeout(resolve, 10000))
      }

      logger.debug(`Pinecone index ready: ${this.indexName}`)
    } catch (error) {
      logger.error('Error initializing Pinecone:', error)
      throw error
    }
  }

  async upsert(chunk: DocChunk): Promise<void> {
    const client = this.getClient()
    const index = client.index(this.indexName)

    await index.namespace(this.namespace).upsert([
      {
        id: chunk.id,
        values: chunk.embedding,
        metadata: {
          title: chunk.title,
          content: chunk.content,
          url: chunk.url,
          category: chunk.category,
          lastUpdated: chunk.metadata.lastUpdated,
          tags: chunk.metadata.tags.join(','),
          section: chunk.metadata.section || '',
          headings: chunk.metadata.headings?.join(',') || '',
        },
      },
    ])
  }

  async upsertBatch(chunks: DocChunk[]): Promise<void> {
    const client = this.getClient()
    const index = client.index(this.indexName)

    // Pinecone batch limit is 100 vectors
    const batchSize = 100

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)

      await index.namespace(this.namespace).upsert(
        batch.map((chunk) => ({
          id: chunk.id,
          values: chunk.embedding,
          metadata: {
            title: chunk.title,
            content: chunk.content,
            url: chunk.url,
            category: chunk.category,
            lastUpdated: chunk.metadata.lastUpdated,
            tags: chunk.metadata.tags.join(','),
            section: chunk.metadata.section || '',
            headings: chunk.metadata.headings?.join(',') || '',
          },
        }))
      )

      logger.debug(`Uploaded batch ${i / batchSize + 1} (${batch.length} chunks)`)
    }
  }

  async search(embedding: number[], topK = 5): Promise<SearchResult[]> {
    const client = this.getClient()
    const index = client.index(this.indexName)

    const results = await index.namespace(this.namespace).query({
      vector: embedding,
      topK,
      includeMetadata: true,
    })

    return results.matches.map((match) => ({
      id: match.id,
      title: (match.metadata?.title as string) || '',
      content: (match.metadata?.content as string) || '',
      url: (match.metadata?.url as string) || '',
      category: (match.metadata?.category as string) || '',
      score: match.score || 0,
      metadata: {
        lastUpdated: (match.metadata?.lastUpdated as string) || '',
        tags: ((match.metadata?.tags as string) || '').split(',').filter(Boolean),
        section: (match.metadata?.section as string) || undefined,
        headings: ((match.metadata?.headings as string) || '')
          .split(',')
          .filter(Boolean),
      },
    }))
  }

  async delete(id: string): Promise<void> {
    const client = this.getClient()
    const index = client.index(this.indexName)

    await index.namespace(this.namespace).deleteOne(id)
  }

  async clear(): Promise<void> {
    const client = this.getClient()
    const index = client.index(this.indexName)

    await index.namespace(this.namespace).deleteAll()
  }

  async getStats(): Promise<{ count: number; dimensions: number }> {
    const client = this.getClient()
    const index = client.index(this.indexName)

    const stats = await index.describeIndexStats()

    return {
      count: stats.namespaces?.[this.namespace]?.recordCount || 0,
      dimensions: stats.dimension || 1536,
    }
  }
}

/**
 * Local Vector Store (Development)
 * Stores embeddings in a JSON file for development without Pinecone
 */
export class LocalVectorStore implements VectorStore {
  private filePath: string
  private chunks: Map<string, DocChunk> = new Map()

  constructor(filePath = '.vector-store.json') {
    this.filePath = path.resolve(process.cwd(), filePath)
  }

  async initialize(): Promise<void> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8')
      const parsed = JSON.parse(data)
      this.chunks = new Map(Object.entries(parsed))
      logger.debug(`Loaded ${this.chunks.size} chunks from ${this.filePath}`)
    } catch (error) {
      // File doesn't exist yet, start with empty store
      logger.debug('Initializing new local vector store')
      this.chunks = new Map()
    }
  }

  private async persist(): Promise<void> {
    const data = Object.fromEntries(this.chunks)
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8')
  }

  async upsert(chunk: DocChunk): Promise<void> {
    this.chunks.set(chunk.id, chunk)
    await this.persist()
  }

  async upsertBatch(chunks: DocChunk[]): Promise<void> {
    for (const chunk of chunks) {
      this.chunks.set(chunk.id, chunk)
    }
    await this.persist()
    logger.debug(`Stored ${chunks.length} chunks locally`)
  }

  async search(embedding: number[], topK = 5): Promise<SearchResult[]> {
    const results: SearchResult[] = []

    // Calculate similarity for all chunks
    for (const [id, chunk] of this.chunks) {
      const score = cosineSimilarity(embedding, chunk.embedding)
      results.push({
        id,
        title: chunk.title,
        content: chunk.content,
        url: chunk.url,
        category: chunk.category,
        score,
        metadata: chunk.metadata,
      })
    }

    // Sort by score (descending) and take top K
    return results.sort((a, b) => b.score - a.score).slice(0, topK)
  }

  async delete(id: string): Promise<void> {
    this.chunks.delete(id)
    await this.persist()
  }

  async clear(): Promise<void> {
    this.chunks.clear()
    await this.persist()
  }

  async getStats(): Promise<{ count: number; dimensions: number }> {
    const firstChunk = this.chunks.values().next().value
    return {
      count: this.chunks.size,
      dimensions: firstChunk?.embedding.length || 1536,
    }
  }
}

/**
 * Get the appropriate vector store based on environment
 */
export function getVectorStore(): VectorStore {
  const usePinecone = process.env.PINECONE_API_KEY && process.env.NODE_ENV === 'production'

  if (usePinecone) {
    logger.debug('Using Pinecone vector store')
    return new PineconeVectorStore()
  } else {
    logger.debug('Using local vector store (development mode)')
    return new LocalVectorStore()
  }
}
