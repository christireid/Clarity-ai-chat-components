/**
 * Storage Adapter Interface
 * 
 * Abstract interface for all storage backends
 */

import type { Memory, MemoryType, MemoryScope, SearchOptions } from '../core/types'

export interface StorageAdapter {
  initialize(): Promise<void>
  save(memory: Memory): Promise<void>
  load(id: string): Promise<Memory | null>
  update(id: string, memory: Memory): Promise<void>
  delete(id: string): Promise<void>
  search(query: string, options?: SearchOptions & { embedding?: number[] }): Promise<Array<{ memory: Memory; score: number }>>
  query(options?: { scope?: MemoryScope; type?: MemoryType; userId?: string; sessionId?: string; threadId?: string }): Promise<Memory[]>
  clear(scope?: MemoryScope, type?: MemoryType): Promise<void>
  getStats(): Promise<{
    totalMemories: number
    byType: Record<MemoryType, number>
    byScope: Record<MemoryScope, number>
    tokenUsage: number
    compressionRatio: number
    averageImportance: number
  }>
  close(): Promise<void>
}
