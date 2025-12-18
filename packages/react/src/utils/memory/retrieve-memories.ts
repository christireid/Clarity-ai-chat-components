import { logger } from '@clarity-chat/utils/logger'
/**
 * retrieveMemories - Low-level utility for retrieving memories
 *
 * Primitive function for retrieving relevant memories from memory store.
 * Used internally by memory system and available for custom implementations.
 */

import type { MemoryItem, MemoryQuery, MemoryType } from '@clarity-chat/memory'

/**
 * Options for retrieving memories
 */
export interface RetrieveMemoriesOptions {
  /** Maximum number of memories to retrieve */
  limit?: number
  /** Relevance threshold */
  threshold?: number
  /** Memory types to include */
  types?: MemoryType[]
}

/**
 * retrieveMemories - Retrieve relevant memories
 *
 * Low-level utility for querying memory store. Used by memory system
 * and available for custom memory retrieval strategies.
 */
export async function retrieveMemories(
  query: string,
  memoryService: any,
  options: RetrieveMemoriesOptions = {}
): Promise<MemoryItem[]> {
  const { limit = 10, threshold = 0.7, types } = options

  if (!memoryService) {
    return []
  }

  try {
    const memoryQuery: MemoryQuery = {
      query,
      limit,
      minConfidence: threshold,
      types,
    }

    const results = await memoryService.query(memoryQuery)
    return results.map((r: any) => r.memory)
  } catch (error) {
    logger.error('Failed to retrieve memories:', error)
    return []
  }
}
