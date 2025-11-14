/**
 * Clarity Memory - Search Optimizer
 * 
 * Optimized search algorithms and utilities
 */

import type { MemoryItem } from '../core/types'

/**
 * Fast text matching with early exit
 */
export function fastTextMatch(text: string, query: string): boolean {
  if (!query) return true
  
  const textLower = text.toLowerCase()
  const queryLower = query.toLowerCase()
  
  // Exact match (fastest)
  if (textLower === queryLower) {
    return true
  }
  
  // Contains match
  if (textLower.includes(queryLower)) {
    return true
  }
  
  // Word boundary match (more expensive, but better)
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0)
  if (queryWords.length === 0) return true
  
  // All query words must be present
  for (const word of queryWords) {
    if (!textLower.includes(word)) {
      return false
    }
  }
  
  return true
}

/**
 * Calculate text similarity (simple Jaccard similarity)
 */
export function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 0))
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 0))
  
  if (words1.size === 0 && words2.size === 0) return 1
  if (words1.size === 0 || words2.size === 0) return 0
  
  const intersection = new Set([...words1].filter(x => words2.has(x)))
  const union = new Set([...words1, ...words2])
  
  return intersection.size / union.size
}

/**
 * Fast relevance scoring
 */
export function calculateRelevanceScore(
  memory: MemoryItem,
  query: string,
  weights: { importance: number; recency: number; relevance: number } = {
    importance: 0.4,
    recency: 0.2,
    relevance: 0.4,
  }
): number {
  // Importance score (0-1)
  const importanceScore = memory.importance
  
  // Recency score (0-1) - exponential decay
  const age = (Date.now() - memory.timestamp.getTime()) / 1000
  const halfLife = 86400 // 24 hours
  const recencyScore = Math.exp(-age / halfLife)
  
  // Text relevance score (0-1)
  const relevanceScore = calculateSimilarity(memory.content, query)
  
  // Weighted combination
  return (
    importanceScore * weights.importance +
    recencyScore * weights.recency +
    relevanceScore * weights.relevance
  )
}

/**
 * Optimized search with early termination
 */
export function optimizedSearch(
  memories: MemoryItem[],
  query: string,
  options: {
    limit?: number
    minScore?: number
    weights?: { importance: number; recency: number; relevance: number }
  } = {}
): MemoryItem[] {
  const { limit, minScore = 0, weights } = options
  
  // Fast path: empty query returns all (sorted by importance)
  if (!query || !query.trim()) {
    const sorted = [...memories].sort((a, b) => b.importance - a.importance)
    return limit ? sorted.slice(0, limit) : sorted
  }
  
  // Score all memories
  const scored = memories.map(memory => ({
    memory,
    score: calculateRelevanceScore(memory, query, weights),
  }))
  
  // Filter by minimum score
  const filtered = scored.filter(item => item.score >= minScore)
  
  // Sort by score (descending)
  filtered.sort((a, b) => b.score - a.score)
  
  // Apply limit
  const results = limit ? filtered.slice(0, limit) : filtered
  
  return results.map(item => item.memory)
}

/**
 * Create search index for faster lookups
 */
export class SearchIndex {
  private index: Map<string, Set<string>> = new Map()
  private memories: Map<string, MemoryItem> = new Map()

  add(memory: MemoryItem): void {
    this.memories.set(memory.id, memory)
    
    // Index words
    const words = memory.content.toLowerCase().split(/\s+/).filter(w => w.length > 0)
    for (const word of words) {
      if (!this.index.has(word)) {
        this.index.set(word, new Set())
      }
      this.index.get(word)!.add(memory.id)
    }
    
    // Index tags
    if (memory.tags) {
      for (const tag of memory.tags) {
        const tagLower = tag.toLowerCase()
        if (!this.index.has(tagLower)) {
          this.index.set(tagLower, new Set())
        }
        this.index.get(tagLower)!.add(memory.id)
      }
    }
  }

  remove(id: string): void {
    const memory = this.memories.get(id)
    if (!memory) return
    
    this.memories.delete(id)
    
    // Remove from index
    const words = memory.content.toLowerCase().split(/\s+/).filter(w => w.length > 0)
    for (const word of words) {
      const ids = this.index.get(word)
      if (ids) {
        ids.delete(id)
        if (ids.size === 0) {
          this.index.delete(word)
        }
      }
    }
    
    if (memory.tags) {
      for (const tag of memory.tags) {
        const tagLower = tag.toLowerCase()
        const ids = this.index.get(tagLower)
        if (ids) {
          ids.delete(id)
          if (ids.size === 0) {
            this.index.delete(tagLower)
          }
        }
      }
    }
  }

  search(query: string): MemoryItem[] {
    if (!query || !query.trim()) {
      return Array.from(this.memories.values())
    }
    
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0)
    if (queryWords.length === 0) {
      return Array.from(this.memories.values())
    }
    
    // Find IDs that match all words (AND search)
    let matchingIds: Set<string> | null = null
    
    for (const word of queryWords) {
      const ids = this.index.get(word)
      if (!ids || ids.size === 0) {
        // No matches for this word
        return []
      }
      
      if (matchingIds === null) {
        matchingIds = new Set<string>(ids)
      } else {
        // Intersection
        const intersection = new Set<string>()
        for (const id of matchingIds) {
          if (ids.has(id)) {
            intersection.add(id)
          }
        }
        matchingIds = intersection
        if (matchingIds.size === 0) {
          return []
        }
      }
    }
    
    if (!matchingIds) {
      return []
    }
    
    // Get matching memories
    const results: MemoryItem[] = []
    for (const id of matchingIds) {
      const memory = this.memories.get(id)
      if (memory) {
        results.push(memory)
      }
    }
    
    return results
  }

  clear(): void {
    this.index.clear()
    this.memories.clear()
  }

  get size(): number {
    return this.memories.size
  }
}
