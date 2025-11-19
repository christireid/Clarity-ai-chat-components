/**
 * Base Vector Store Interface
 */

import type { MemoryItem, MemoryType } from '../types'

export interface SearchOptions {
  embedding?: number[]
  limit?: number
  minScore?: number
  types?: MemoryType[]
  filters?: Record<string, any>
  tags?: string[]
}

export interface VectorStore {
  initialize(): Promise<void> | void
  add(memory: MemoryItem): Promise<void>
  get(id: string): Promise<MemoryItem | null>
  update(id: string, memory: MemoryItem): Promise<void>
  delete(id: string): Promise<void>
  search(query: string, options: SearchOptions): Promise<Array<{ memory: MemoryItem; score: number }>>
  getAll(options?: { types?: MemoryType[] }): Promise<MemoryItem[]>
  close(): Promise<void>
}
