/**
 * Store Factory
 * Creates vector stores from configuration
 */

import type { VectorStoreConfig } from '../types'
import type { VectorStore } from './base'
import { InMemoryStore } from './in-memory'
import { FileStore } from './file'
import { IndexedDBStore } from './indexeddb'

/**
 * Create a vector store from configuration
 */
export function createStoreFromConfig(
  config: VectorStoreConfig | VectorStore
): VectorStore {
  // If already a VectorStore instance, return it
  if (typeof config === 'object' && 'add' in config && 'get' in config) {
    return config as VectorStore
  }

  const storeConfig = config as VectorStoreConfig
  const type = storeConfig.type

  switch (type) {
    case 'in-memory':
      return new InMemoryStore()

    case 'file':
      return new FileStore(storeConfig.path || './memories.json')

    case 'indexeddb':
      return new IndexedDBStore(storeConfig.dbName || 'clarity-memory')

    case 'redis':
      throw new Error(
        'Redis store not yet implemented. Use in-memory or file store for now.'
      )

    case 'postgres':
      throw new Error(
        'PostgreSQL store not yet implemented. Use in-memory or file store for now.'
      )

    case 'sqlite':
      throw new Error(
        'SQLite store not yet implemented. Use in-memory or file store for now.'
      )

    case 'chroma':
      throw new Error(
        'ChromaDB store not yet implemented. Use in-memory or file store for now.'
      )

    case 'qdrant':
      throw new Error(
        'Qdrant store not yet implemented. Use in-memory or file store for now.'
      )

    case 'pinecone':
      throw new Error(
        'Pinecone store not yet implemented. Use in-memory or file store for now.'
      )

    case 'lancedb':
      throw new Error(
        'LanceDB store not yet implemented. Use in-memory or file store for now.'
      )

    default:
      throw new Error(`Unknown store type: ${type}`)
  }
}
