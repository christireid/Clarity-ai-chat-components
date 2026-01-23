/**
 * Base Vector Store Interface
 */

import type { MemoryItem, MemoryType, VectorStoreQuery, VectorStoreMatch, VectorStoreVector, VectorStoreUpsertOptions } from '../types'

export interface SearchOptions {
  embedding?: number[]
  limit?: number
  minScore?: number
  types?: MemoryType[]
  filters?: Record<string, any>
  tags?: string[]
  scopes?: string[]  // Add scopes to top-level options
  userId?: string   // Add userId to top-level options
}

export interface VectorStore {
  initialize(): Promise<void> | void
  add(memory: MemoryItem): Promise<void>
  get(id: string): Promise<MemoryItem | null>
  update(id: string, memory: MemoryItem): Promise<void>
  delete(id: string | string[], namespace?: string): Promise<void>
  search(query: string, options: SearchOptions): Promise<Array<{ memory: MemoryItem; score: number }>>
  getAll(options?: { types?: MemoryType[] }): Promise<MemoryItem[]>
  close(): Promise<void>
  
  // Methods from types.ts
  query(options: VectorStoreQuery): Promise<VectorStoreMatch[]>
  upsert(vectors: VectorStoreVector[], options?: VectorStoreUpsertOptions): Promise<void>
}
