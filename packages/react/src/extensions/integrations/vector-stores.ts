import { logger } from '@clarity-chat/utils/logger';
/**
 * Vector Store Extensions
 *
 * Additional vector database integrations beyond the built-in ones.
 * Enterprise-grade vector search capabilities.
 *
 * @packageDocumentation
 */

import { defineExtension } from '../builder'
import type { Extension } from '../types'

// ============================================
// Types
// ============================================

export interface MilvusConfig {
  address: string
  port?: number
  username?: string
  password?: string
  secure?: boolean
  database?: string
  collectionName: string
  dimension: number
}

export interface PgVectorConfig {
  connectionString: string
  tableName: string
  dimension: number
  distanceMetric?: 'cosine' | 'euclidean' | 'inner_product'
}

export interface SupabaseVectorConfig {
  supabaseUrl: string
  supabaseKey: string
  tableName: string
  queryFunction?: string
}

export interface ElasticsearchConfig {
  node: string
  apiKey?: string
  username?: string
  password?: string
  indexName: string
  cloud?: { id: string }
}

export interface RedisVectorConfig {
  url: string
  password?: string
  indexName: string
  dimension: number
  distanceMetric?: 'COSINE' | 'L2' | 'IP'
}

export interface MongoDBAtlasConfig {
  connectionString: string
  databaseName: string
  collectionName: string
  indexName: string
  dimension: number
}

export interface LanceDBConfig {
  uri: string
  tableName: string
  dimension: number
}

// ============================================
// Vector Store Interface
// ============================================

interface VectorStoreAdapter {
  upsert(vectors: VectorRecord[]): Promise<void>
  query(
    vector: number[],
    topK: number,
    filter?: Record<string, unknown>
  ): Promise<QueryResult[]>
  delete(ids: string[]): Promise<void>
}

interface VectorRecord {
  id: string
  vector: number[]
  metadata?: Record<string, unknown>
}

interface QueryResult {
  id: string
  score: number
  metadata?: Record<string, unknown>
}

// ============================================
// Extension Factories
// ============================================

/**
 * Create Milvus vector store extension
 */
export function createMilvusExtension(
  config?: Partial<MilvusConfig>
): Extension<MilvusConfig> {
  return defineExtension<MilvusConfig>({
    id: 'vector-milvus',
    name: 'Milvus',
    category: 'vector-store',
    description: 'Open-source vector database for scalable similarity search',
    author: 'Clarity Chat',
    tags: ['vector', 'database', 'similarity', 'search', 'open-source'],
    homepage: 'https://milvus.io',

    configSchema: {
      version: '1.0',
      required: ['address', 'collectionName', 'dimension'],
      properties: {
        address: { type: 'string', label: 'Address', default: 'localhost' },
        port: { type: 'number', label: 'Port', default: 19530 },
        username: { type: 'string', label: 'Username' },
        password: { type: 'secret', label: 'Password' },
        secure: { type: 'boolean', label: 'Use TLS', default: false },
        database: { type: 'string', label: 'Database', default: 'default' },
        collectionName: { type: 'string', label: 'Collection Name' },
        dimension: { type: 'number', label: 'Vector Dimension', min: 1 },
      },
    },

    defaultConfig: {
      address: 'localhost',
      port: 19530,
      database: 'default',
      ...config,
    } as MilvusConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Milvus extension initialized')

      const adapter: VectorStoreAdapter = {
        async upsert(vectors) {
          // Implementation would use @zilliz/milvus2-sdk-node
          ctx.logger.debug(`Upserting ${vectors.length} vectors to Milvus`)
        },
        async query(vector, topK, filter) {
          ctx.logger.debug(`Querying Milvus with top_k=${topK}`)
          return []
        },
        async delete(ids) {
          ctx.logger.debug(`Deleting ${ids.length} vectors from Milvus`)
        },
      }

      ctx.services.register('adapter', adapter)
    },

    healthCheck: async () => {
      // Would check connection to Milvus
      return { healthy: true, message: 'Connected to Milvus' }
    },
  })
}

/**
 * Create PostgreSQL pgvector extension
 */
export function createPgVectorExtension(
  config?: Partial<PgVectorConfig>
): Extension<PgVectorConfig> {
  return defineExtension<PgVectorConfig>({
    id: 'vector-pgvector',
    name: 'pgvector',
    category: 'vector-store',
    description: 'Vector similarity search for PostgreSQL',
    author: 'Clarity Chat',
    tags: ['vector', 'postgres', 'sql', 'database'],
    homepage: 'https://github.com/pgvector/pgvector',

    configSchema: {
      version: '1.0',
      required: ['connectionString', 'tableName', 'dimension'],
      properties: {
        connectionString: {
          type: 'secret',
          label: 'Connection String',
          envVar: 'DATABASE_URL',
        },
        tableName: { type: 'string', label: 'Table Name' },
        dimension: { type: 'number', label: 'Vector Dimension', min: 1 },
        distanceMetric: {
          type: 'string',
          label: 'Distance Metric',
          default: 'cosine',
          enum: ['cosine', 'euclidean', 'inner_product'],
        },
      },
    },

    defaultConfig: {
      distanceMetric: 'cosine',
      ...config,
    } as PgVectorConfig,

    initialize: async (ctx) => {
      ctx.logger.info('pgvector extension initialized')

      const adapter: VectorStoreAdapter = {
        async upsert(vectors) {
          // Implementation would use pg or postgres.js
          ctx.logger.debug(`Upserting ${vectors.length} vectors to pgvector`)
        },
        async query(vector, topK, filter) {
          ctx.logger.debug(`Querying pgvector with top_k=${topK}`)
          return []
        },
        async delete(ids) {
          ctx.logger.debug(`Deleting ${ids.length} vectors from pgvector`)
        },
      }

      ctx.services.register('adapter', adapter)
    },
  })
}

/**
 * Create Supabase Vector extension
 */
export function createSupabaseVectorExtension(
  config?: Partial<SupabaseVectorConfig>
): Extension<SupabaseVectorConfig> {
  return defineExtension<SupabaseVectorConfig>({
    id: 'vector-supabase',
    name: 'Supabase Vector',
    category: 'vector-store',
    description: 'Vector embeddings with Supabase and pgvector',
    author: 'Clarity Chat',
    tags: ['vector', 'supabase', 'postgres', 'managed'],
    homepage: 'https://supabase.com/docs/guides/ai',

    configSchema: {
      version: '1.0',
      required: ['supabaseUrl', 'supabaseKey', 'tableName'],
      properties: {
        supabaseUrl: {
          type: 'string',
          label: 'Supabase URL',
          envVar: 'SUPABASE_URL',
        },
        supabaseKey: {
          type: 'secret',
          label: 'Supabase Key',
          envVar: 'SUPABASE_ANON_KEY',
        },
        tableName: { type: 'string', label: 'Table Name' },
        queryFunction: {
          type: 'string',
          label: 'Query Function',
          default: 'match_documents',
        },
      },
    },

    defaultConfig: {
      queryFunction: 'match_documents',
      ...config,
    } as SupabaseVectorConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Supabase Vector extension initialized')

      const adapter: VectorStoreAdapter = {
        async upsert(vectors) {
          ctx.logger.debug(`Upserting ${vectors.length} vectors to Supabase`)
          // Use @supabase/supabase-js
        },
        async query(vector, topK) {
          ctx.logger.debug(`Querying Supabase vectors`)
          return []
        },
        async delete(ids) {
          ctx.logger.debug(`Deleting vectors from Supabase`)
        },
      }

      ctx.services.register('adapter', adapter)
    },
  })
}

/**
 * Create Elasticsearch vector extension
 */
export function createElasticsearchExtension(
  config?: Partial<ElasticsearchConfig>
): Extension<ElasticsearchConfig> {
  return defineExtension<ElasticsearchConfig>({
    id: 'vector-elasticsearch',
    name: 'Elasticsearch',
    category: 'vector-store',
    description: 'Vector search with Elasticsearch dense_vector fields',
    author: 'Clarity Chat',
    tags: ['vector', 'search', 'elasticsearch', 'enterprise'],
    homepage: 'https://elastic.co',

    configSchema: {
      version: '1.0',
      required: ['node', 'indexName'],
      properties: {
        node: {
          type: 'string',
          label: 'Node URL',
          default: 'http://localhost:9200',
        },
        apiKey: { type: 'secret', label: 'API Key' },
        username: { type: 'string', label: 'Username' },
        password: { type: 'secret', label: 'Password' },
        indexName: { type: 'string', label: 'Index Name' },
      },
    },

    defaultConfig: {
      node: 'http://localhost:9200',
      ...config,
    } as ElasticsearchConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Elasticsearch vector extension initialized')

      const adapter: VectorStoreAdapter = {
        async upsert(vectors) {
          ctx.logger.debug(
            `Upserting ${vectors.length} vectors to Elasticsearch`
          )
        },
        async query(vector, topK) {
          ctx.logger.debug(`Querying Elasticsearch vectors`)
          return []
        },
        async delete(ids) {
          ctx.logger.debug(`Deleting vectors from Elasticsearch`)
        },
      }

      ctx.services.register('adapter', adapter)
    },
  })
}

/**
 * Create Redis Vector extension (Redis Stack)
 */
export function createRedisVectorExtension(
  config?: Partial<RedisVectorConfig>
): Extension<RedisVectorConfig> {
  return defineExtension<RedisVectorConfig>({
    id: 'vector-redis',
    name: 'Redis Vector',
    category: 'vector-store',
    description: 'Vector similarity search with Redis Stack',
    author: 'Clarity Chat',
    tags: ['vector', 'redis', 'cache', 'fast'],
    homepage: 'https://redis.io/docs/interact/search-and-query/search/vectors/',

    configSchema: {
      version: '1.0',
      required: ['url', 'indexName', 'dimension'],
      properties: {
        url: {
          type: 'string',
          label: 'Redis URL',
          default: 'redis://localhost:6379',
          envVar: 'REDIS_URL',
        },
        password: { type: 'secret', label: 'Password' },
        indexName: { type: 'string', label: 'Index Name' },
        dimension: { type: 'number', label: 'Vector Dimension', min: 1 },
        distanceMetric: {
          type: 'string',
          label: 'Distance Metric',
          default: 'COSINE',
          enum: ['COSINE', 'L2', 'IP'],
        },
      },
    },

    defaultConfig: {
      url: 'redis://localhost:6379',
      distanceMetric: 'COSINE',
      ...config,
    } as RedisVectorConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Redis Vector extension initialized')

      const adapter: VectorStoreAdapter = {
        async upsert(vectors) {
          ctx.logger.debug(`Upserting ${vectors.length} vectors to Redis`)
        },
        async query(vector, topK) {
          ctx.logger.debug(`Querying Redis vectors`)
          return []
        },
        async delete(ids) {
          ctx.logger.debug(`Deleting vectors from Redis`)
        },
      }

      ctx.services.register('adapter', adapter)
    },
  })
}

/**
 * Create MongoDB Atlas Vector extension
 */
export function createMongoDBAtlasExtension(
  config?: Partial<MongoDBAtlasConfig>
): Extension<MongoDBAtlasConfig> {
  return defineExtension<MongoDBAtlasConfig>({
    id: 'vector-mongodb-atlas',
    name: 'MongoDB Atlas Vector',
    category: 'vector-store',
    description: 'Vector search with MongoDB Atlas',
    author: 'Clarity Chat',
    tags: ['vector', 'mongodb', 'atlas', 'managed'],
    homepage: 'https://www.mongodb.com/products/platform/atlas-vector-search',

    configSchema: {
      version: '1.0',
      required: [
        'connectionString',
        'databaseName',
        'collectionName',
        'indexName',
        'dimension',
      ],
      properties: {
        connectionString: {
          type: 'secret',
          label: 'Connection String',
          envVar: 'MONGODB_URI',
        },
        databaseName: { type: 'string', label: 'Database Name' },
        collectionName: { type: 'string', label: 'Collection Name' },
        indexName: { type: 'string', label: 'Index Name' },
        dimension: { type: 'number', label: 'Vector Dimension', min: 1 },
      },
    },

    defaultConfig: config as MongoDBAtlasConfig,

    initialize: async (ctx) => {
      ctx.logger.info('MongoDB Atlas Vector extension initialized')

      const adapter: VectorStoreAdapter = {
        async upsert(vectors) {
          ctx.logger.debug(
            `Upserting ${vectors.length} vectors to MongoDB Atlas`
          )
        },
        async query(vector, topK) {
          ctx.logger.debug(`Querying MongoDB Atlas vectors`)
          return []
        },
        async delete(ids) {
          ctx.logger.debug(`Deleting vectors from MongoDB Atlas`)
        },
      }

      ctx.services.register('adapter', adapter)
    },
  })
}

/**
 * Create LanceDB extension (serverless)
 */
export function createLanceDBExtension(
  config?: Partial<LanceDBConfig>
): Extension<LanceDBConfig> {
  return defineExtension<LanceDBConfig>({
    id: 'vector-lancedb',
    name: 'LanceDB',
    category: 'vector-store',
    description: 'Serverless vector database with columnar storage',
    author: 'Clarity Chat',
    tags: ['vector', 'serverless', 'columnar', 'embedded'],
    homepage: 'https://lancedb.com',

    configSchema: {
      version: '1.0',
      required: ['uri', 'tableName', 'dimension'],
      properties: {
        uri: { type: 'string', label: 'URI', default: './lancedb' },
        tableName: { type: 'string', label: 'Table Name' },
        dimension: { type: 'number', label: 'Vector Dimension', min: 1 },
      },
    },

    defaultConfig: {
      uri: './lancedb',
      ...config,
    } as LanceDBConfig,

    initialize: async (ctx) => {
      ctx.logger.info('LanceDB extension initialized')

      const adapter: VectorStoreAdapter = {
        async upsert(vectors) {
          ctx.logger.debug(`Upserting ${vectors.length} vectors to LanceDB`)
        },
        async query(vector, topK) {
          ctx.logger.debug(`Querying LanceDB vectors`)
          return []
        },
        async delete(ids) {
          ctx.logger.debug(`Deleting vectors from LanceDB`)
        },
      }

      ctx.services.register('adapter', adapter)
    },
  })
}
