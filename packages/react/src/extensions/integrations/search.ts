import { logger } from '@clarity-chat/utils/logger';
/**
 * Search Provider Extensions
 *
 * Full-text search integrations for chat history and knowledge bases.
 * Enables powerful search across conversations and documents.
 *
 * @packageDocumentation
 */

import { defineExtension } from '../builder'
import type { Extension } from '../types'

// ============================================
// Types
// ============================================

export interface AlgoliaConfig {
  appId: string
  apiKey: string
  searchOnlyApiKey?: string
  indexName: string
}

export interface TypesenseConfig {
  apiKey: string
  nodes: Array<{
    host: string
    port: number
    protocol: 'http' | 'https'
  }>
  collectionName: string
  connectionTimeoutSeconds?: number
}

export interface MeilisearchConfig {
  host: string
  apiKey?: string
  indexName: string
}

export interface ElasticSearchConfig {
  node: string
  apiKey?: string
  username?: string
  password?: string
  indexName: string
  cloudId?: string
}

export interface OramaConfig {
  schema: Record<
    string,
    'string' | 'number' | 'boolean' | 'string[]' | 'number[]'
  >
  defaultLanguage?: string
}

// ============================================
// Search Interface
// ============================================

interface SearchAdapter {
  index(documents: SearchDocument[]): Promise<void>
  search(query: string, options?: SearchOptions): Promise<SearchResult>
  delete(ids: string[]): Promise<void>
  update(documents: SearchDocument[]): Promise<void>
}

interface SearchDocument {
  id: string
  [key: string]: unknown
}

interface SearchOptions {
  filters?: Record<string, unknown>
  limit?: number
  offset?: number
  facets?: string[]
  highlightFields?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface SearchResult {
  hits: SearchHit[]
  totalHits: number
  page: number
  totalPages: number
  facets?: Record<string, FacetValue[]>
  processingTimeMs: number
}

interface SearchHit {
  id: string
  score: number
  document: Record<string, unknown>
  highlights?: Record<string, string>
}

interface FacetValue {
  value: string
  count: number
}

// ============================================
// Extension Factories
// ============================================

/**
 * Create Algolia extension
 */
export function createAlgoliaExtension(
  config?: Partial<AlgoliaConfig>
): Extension<AlgoliaConfig> {
  return defineExtension<AlgoliaConfig>({
    id: 'search-algolia',
    name: 'Algolia',
    category: 'search',
    description: 'AI-powered search and discovery platform',
    author: 'Clarity Chat',
    tags: ['search', 'full-text', 'instant', 'ai'],
    homepage: 'https://algolia.com',

    configSchema: {
      version: '1.0',
      required: ['appId', 'apiKey', 'indexName'],
      properties: {
        appId: {
          type: 'string',
          label: 'Application ID',
          envVar: 'ALGOLIA_APP_ID',
        },
        apiKey: {
          type: 'secret',
          label: 'Admin API Key',
          envVar: 'ALGOLIA_ADMIN_KEY',
        },
        searchOnlyApiKey: {
          type: 'string',
          label: 'Search-Only API Key',
          envVar: 'ALGOLIA_SEARCH_KEY',
        },
        indexName: { type: 'string', label: 'Index Name' },
      },
    },

    defaultConfig: config as AlgoliaConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Algolia extension initialized')

      // Would use algoliasearch
      const adapter: SearchAdapter = {
        async index(documents) {
          ctx.logger.debug(`Indexing ${documents.length} documents to Algolia`)
          const response = await fetch(
            `https://${ctx.config.appId}-dsn.algolia.net/1/indexes/${ctx.config.indexName}/batch`,
            {
              method: 'POST',
              headers: {
                'X-Algolia-Application-Id': ctx.config.appId,
                'X-Algolia-API-Key': ctx.config.apiKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                requests: documents.map((doc) => ({
                  action: 'addObject',
                  body: { objectID: doc.id, ...doc },
                })),
              }),
            }
          )
          if (!response.ok) {
            throw new Error(`Algolia indexing failed: ${response.status}`)
          }
        },

        async search(query, options = {}) {
          ctx.logger.debug(`Searching Algolia for: ${query}`)
          const response = await fetch(
            `https://${ctx.config.appId}-dsn.algolia.net/1/indexes/${ctx.config.indexName}/query`,
            {
              method: 'POST',
              headers: {
                'X-Algolia-Application-Id': ctx.config.appId,
                'X-Algolia-API-Key':
                  ctx.config.searchOnlyApiKey || ctx.config.apiKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query,
                hitsPerPage: options.limit || 20,
                page: options.offset
                  ? Math.floor(options.offset / (options.limit || 20))
                  : 0,
                facets: options.facets,
                attributesToHighlight: options.highlightFields,
              }),
            }
          )

          const data = await response.json()
          return {
            hits: data.hits.map((hit: Record<string, unknown>) => ({
              id: hit.objectID as string,
              score: 1,
              document: hit,
              highlights: hit._highlightResult as
                | Record<string, string>
                | undefined,
            })),
            totalHits: data.nbHits,
            page: data.page,
            totalPages: data.nbPages,
            facets: data.facets,
            processingTimeMs: data.processingTimeMS,
          }
        },

        async delete(ids) {
          ctx.logger.debug(`Deleting ${ids.length} documents from Algolia`)
        },

        async update(documents) {
          await this.index(documents)
        },
      }

      ctx.services.register('search', adapter)
    },

    healthCheck: async (ctx) => {
      try {
        const response = await fetch(
          `https://${ctx.config.appId}-dsn.algolia.net/1/indexes/${ctx.config.indexName}/settings`,
          {
            headers: {
              'X-Algolia-Application-Id': ctx.config.appId,
              'X-Algolia-API-Key': ctx.config.apiKey,
            },
          }
        )
        return {
          healthy: response.ok,
          message: response.ok ? 'Connected' : 'Connection failed',
        }
      } catch (error) {
        return { healthy: false, message: String(error) }
      }
    },
  })
}

/**
 * Create Typesense extension
 */
export function createTypesenseExtension(
  config?: Partial<TypesenseConfig>
): Extension<TypesenseConfig> {
  return defineExtension<TypesenseConfig>({
    id: 'search-typesense',
    name: 'Typesense',
    category: 'search',
    description: 'Lightning-fast, typo-tolerant search engine',
    author: 'Clarity Chat',
    tags: ['search', 'full-text', 'fast', 'open-source'],
    homepage: 'https://typesense.org',

    configSchema: {
      version: '1.0',
      required: ['apiKey', 'nodes', 'collectionName'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'TYPESENSE_API_KEY',
        },
        collectionName: { type: 'string', label: 'Collection Name' },
        connectionTimeoutSeconds: {
          type: 'number',
          label: 'Connection Timeout (s)',
          default: 5,
        },
      },
    },

    defaultConfig: {
      nodes: [{ host: 'localhost', port: 8108, protocol: 'http' }],
      connectionTimeoutSeconds: 5,
      ...config,
    } as TypesenseConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Typesense extension initialized')

      // Would use typesense
      const adapter: SearchAdapter = {
        async index(documents) {
          ctx.logger.debug(
            `Indexing ${documents.length} documents to Typesense`
          )
        },

        async search(query, options = {}) {
          ctx.logger.debug(`Searching Typesense for: ${query}`)
          const node = ctx.config.nodes[0]
          const response = await fetch(
            `${node.protocol}://${node.host}:${node.port}/collections/${ctx.config.collectionName}/documents/search?q=${encodeURIComponent(query)}&query_by=*`,
            {
              headers: {
                'X-TYPESENSE-API-KEY': ctx.config.apiKey,
              },
            }
          )
          const data = await response.json()
          return {
            hits: (data.hits || []).map(
              (hit: { document: Record<string, unknown> }) => ({
                id: hit.document.id as string,
                score: 1,
                document: hit.document,
              })
            ),
            totalHits: data.found || 0,
            page: data.page || 0,
            totalPages: Math.ceil((data.found || 0) / (options.limit || 10)),
            processingTimeMs: data.search_time_ms || 0,
          }
        },

        async delete(ids) {
          ctx.logger.debug(`Deleting ${ids.length} documents from Typesense`)
        },

        async update(documents) {
          await this.index(documents)
        },
      }

      ctx.services.register('search', adapter)
    },
  })
}

/**
 * Create Meilisearch extension
 */
export function createMeilisearchExtension(
  config?: Partial<MeilisearchConfig>
): Extension<MeilisearchConfig> {
  return defineExtension<MeilisearchConfig>({
    id: 'search-meilisearch',
    name: 'Meilisearch',
    category: 'search',
    description: 'Lightning-fast search engine with great defaults',
    author: 'Clarity Chat',
    tags: ['search', 'full-text', 'rust', 'open-source'],
    homepage: 'https://meilisearch.com',

    configSchema: {
      version: '1.0',
      required: ['host', 'indexName'],
      properties: {
        host: {
          type: 'string',
          label: 'Host',
          default: 'http://localhost:7700',
          envVar: 'MEILISEARCH_HOST',
        },
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'MEILISEARCH_API_KEY',
        },
        indexName: { type: 'string', label: 'Index Name' },
      },
    },

    defaultConfig: {
      host: 'http://localhost:7700',
      ...config,
    } as MeilisearchConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Meilisearch extension initialized')

      // Would use meilisearch
      const adapter: SearchAdapter = {
        async index(documents) {
          ctx.logger.debug(
            `Indexing ${documents.length} documents to Meilisearch`
          )
          await fetch(
            `${ctx.config.host}/indexes/${ctx.config.indexName}/documents`,
            {
              method: 'POST',
              headers: {
                Authorization: ctx.config.apiKey
                  ? `Bearer ${ctx.config.apiKey}`
                  : '',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(documents),
            }
          )
        },

        async search(query, options = {}) {
          ctx.logger.debug(`Searching Meilisearch for: ${query}`)
          const response = await fetch(
            `${ctx.config.host}/indexes/${ctx.config.indexName}/search`,
            {
              method: 'POST',
              headers: {
                Authorization: ctx.config.apiKey
                  ? `Bearer ${ctx.config.apiKey}`
                  : '',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                q: query,
                limit: options.limit || 20,
                offset: options.offset || 0,
                facets: options.facets,
                attributesToHighlight: options.highlightFields,
              }),
            }
          )
          const data = await response.json()
          return {
            hits: (data.hits || []).map((hit: Record<string, unknown>) => ({
              id: hit.id as string,
              score: 1,
              document: hit,
              highlights: hit._formatted as Record<string, string> | undefined,
            })),
            totalHits: data.estimatedTotalHits || data.totalHits || 0,
            page: Math.floor((options.offset || 0) / (options.limit || 20)),
            totalPages: Math.ceil(
              (data.estimatedTotalHits || 0) / (options.limit || 20)
            ),
            facets: data.facetDistribution,
            processingTimeMs: data.processingTimeMs || 0,
          }
        },

        async delete(ids) {
          ctx.logger.debug(`Deleting ${ids.length} documents from Meilisearch`)
          await fetch(
            `${ctx.config.host}/indexes/${ctx.config.indexName}/documents/delete-batch`,
            {
              method: 'POST',
              headers: {
                Authorization: ctx.config.apiKey
                  ? `Bearer ${ctx.config.apiKey}`
                  : '',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(ids),
            }
          )
        },

        async update(documents) {
          await this.index(documents)
        },
      }

      ctx.services.register('search', adapter)
    },

    healthCheck: async (ctx) => {
      try {
        const response = await fetch(`${ctx.config.host}/health`)
        return { healthy: response.ok }
      } catch {
        return { healthy: false, message: 'Meilisearch not reachable' }
      }
    },
  })
}

/**
 * Create Elasticsearch extension (search-focused)
 */
export function createElasticSearchExtension(
  config?: Partial<ElasticSearchConfig>
): Extension<ElasticSearchConfig> {
  return defineExtension<ElasticSearchConfig>({
    id: 'search-elasticsearch',
    name: 'Elasticsearch',
    category: 'search',
    description: 'Distributed search and analytics engine',
    author: 'Clarity Chat',
    tags: ['search', 'full-text', 'analytics', 'enterprise'],
    homepage: 'https://elastic.co/elasticsearch',

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
        cloudId: { type: 'string', label: 'Cloud ID' },
      },
    },

    defaultConfig: {
      node: 'http://localhost:9200',
      ...config,
    } as ElasticSearchConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Elasticsearch extension initialized')

      const getHeaders = () => {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        if (ctx.config.apiKey) {
          headers.Authorization = `ApiKey ${ctx.config.apiKey}`
        } else if (ctx.config.username && ctx.config.password) {
          headers.Authorization = `Basic ${btoa(`${ctx.config.username}:${ctx.config.password}`)}`
        }
        return headers
      }

      const adapter: SearchAdapter = {
        async index(documents) {
          ctx.logger.debug(
            `Indexing ${documents.length} documents to Elasticsearch`
          )
          const body = documents.flatMap((doc) => [
            { index: { _index: ctx.config.indexName, _id: doc.id } },
            doc,
          ])
          await fetch(`${ctx.config.node}/_bulk`, {
            method: 'POST',
            headers: {
              ...getHeaders(),
              'Content-Type': 'application/x-ndjson',
            },
            body: body.map((line) => JSON.stringify(line)).join('\n') + '\n',
          })
        },

        async search(query, options = {}) {
          ctx.logger.debug(`Searching Elasticsearch for: ${query}`)
          const response = await fetch(
            `${ctx.config.node}/${ctx.config.indexName}/_search`,
            {
              method: 'POST',
              headers: getHeaders(),
              body: JSON.stringify({
                query: { multi_match: { query, fields: ['*'] } },
                size: options.limit || 20,
                from: options.offset || 0,
                highlight: options.highlightFields
                  ? {
                      fields: Object.fromEntries(
                        options.highlightFields.map((f) => [f, {}])
                      ),
                    }
                  : undefined,
              }),
            }
          )
          const data = await response.json()
          return {
            hits: (data.hits?.hits || []).map(
              (hit: {
                _id: string
                _score: number
                _source: Record<string, unknown>
                highlight?: Record<string, string[]>
              }) => ({
                id: hit._id,
                score: hit._score,
                document: hit._source,
                highlights: hit.highlight
                  ? Object.fromEntries(
                      Object.entries(hit.highlight).map(([k, v]) => [k, v[0]])
                    )
                  : undefined,
              })
            ),
            totalHits:
              typeof data.hits?.total === 'object'
                ? data.hits.total.value
                : data.hits?.total || 0,
            page: Math.floor((options.offset || 0) / (options.limit || 20)),
            totalPages: Math.ceil(
              (data.hits?.total?.value || 0) / (options.limit || 20)
            ),
            processingTimeMs: data.took || 0,
          }
        },

        async delete(ids) {
          ctx.logger.debug(
            `Deleting ${ids.length} documents from Elasticsearch`
          )
        },

        async update(documents) {
          await this.index(documents)
        },
      }

      ctx.services.register('search', adapter)
    },
  })
}

/**
 * Create Orama extension (client-side search)
 */
export function createOramaExtension(
  config?: Partial<OramaConfig>
): Extension<OramaConfig> {
  return defineExtension<OramaConfig>({
    id: 'search-orama',
    name: 'Orama',
    category: 'search',
    description: 'Fast full-text search engine that runs everywhere',
    author: 'Clarity Chat',
    tags: ['search', 'full-text', 'client-side', 'edge'],
    homepage: 'https://orama.com',

    configSchema: {
      version: '1.0',
      required: ['schema'],
      properties: {
        defaultLanguage: {
          type: 'string',
          label: 'Default Language',
          default: 'english',
        },
      },
    },

    defaultConfig: {
      schema: {},
      defaultLanguage: 'english',
      ...config,
    } as OramaConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Orama extension initialized')

      // In-memory documents for client-side search
      let documents: SearchDocument[] = []

      // Would use @orama/orama
      const adapter: SearchAdapter = {
        async index(docs) {
          ctx.logger.debug(`Indexing ${docs.length} documents to Orama`)
          documents = [...documents, ...docs]
        },

        async search(query, options = {}) {
          ctx.logger.debug(`Searching Orama for: ${query}`)
          const queryLower = query.toLowerCase()
          const hits = documents
            .filter((doc) =>
              Object.values(doc).some(
                (val) =>
                  typeof val === 'string' &&
                  val.toLowerCase().includes(queryLower)
              )
            )
            .slice(
              options.offset || 0,
              (options.offset || 0) + (options.limit || 20)
            )
          return {
            hits: hits.map((doc, i) => ({
              id: doc.id,
              score: 1 - i * 0.01,
              document: doc,
            })),
            totalHits: hits.length,
            page: 0,
            totalPages: 1,
            processingTimeMs: 0,
          }
        },

        async delete(ids) {
          ctx.logger.debug(`Deleting ${ids.length} documents from Orama`)
          documents = documents.filter((d) => !ids.includes(d.id))
        },

        async update(docs) {
          docs.forEach((doc) => {
            const index = documents.findIndex((d) => d.id === doc.id)
            if (index >= 0) {
              documents[index] = doc
            } else {
              documents.push(doc)
            }
          })
        },
      }

      ctx.services.register('search', adapter)
    },
  })
}
