/**
 * Clarity Memory - Helper Utilities
 * 
 * Convenience functions and helpers for common operations
 */

import type { MemoryItem, MemoryType } from '../core/types'
import { sanitizeContent } from './validation'

/**
 * Create a memory item with sensible defaults
 */
export function createMemory(
  content: string,
  type: MemoryType = 'episodic',
  importance: number = 0.5
): Partial<MemoryItem> {
  return {
    content: sanitizeContent(content),
    type,
    importance: Math.max(0, Math.min(1, importance)),
  }
}

/**
 * Create a semantic memory (fact/preference)
 */
export function createSemanticMemory(
  content: string,
  importance: number = 0.8
): Partial<MemoryItem> {
  return createMemory(content, 'semantic', importance)
}

/**
 * Create an episodic memory (conversation event)
 */
export function createEpisodicMemory(
  content: string,
  importance: number = 0.5
): Partial<MemoryItem> {
  return createMemory(content, 'episodic', importance)
}

/**
 * Create a persistent memory (long-term)
 */
export function createPersistentMemory(
  content: string,
  importance: number = 0.9
): Partial<MemoryItem> {
  return createMemory(content, 'persistent', importance)
}

/**
 * Extract tags from content (simple keyword extraction)
 */
export function extractTags(content: string, maxTags: number = 5): string[] {
  // Simple tag extraction - look for capitalized words and common patterns
  const words = content.split(/\s+/)
  const tags: string[] = []
  const seen = new Set<string>()
  
  for (const word of words) {
    // Extract capitalized words (likely proper nouns or important terms)
    if (word[0] === word[0]?.toUpperCase() && word.length > 2) {
      const tag = word.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (tag && !seen.has(tag) && tags.length < maxTags) {
        tags.push(tag)
        seen.add(tag)
      }
    }
  }
  
  return tags
}

/**
 * Estimate importance from content (simple heuristic)
 */
export function estimateImportance(content: string): number {
  let score = 0.5 // Base score
  
  // Boost for questions (indicates engagement)
  if (content.includes('?') || content.includes('how') || content.includes('what')) {
    score += 0.1
  }
  
  // Boost for preferences/opinions
  if (content.match(/\b(prefer|like|love|hate|dislike|favorite)\b/i)) {
    score += 0.2
  }
  
  // Boost for facts/statements
  if (content.match(/\b(is|are|was|were|has|have)\b/i)) {
    score += 0.1
  }
  
  // Boost for longer content (more detailed)
  if (content.length > 100) {
    score += 0.1
  }
  
  // Normalize to [0, 1]
  return Math.min(1, Math.max(0, score))
}

/**
 * Format memory for display
 */
export function formatMemory(memory: MemoryItem, format: 'short' | 'full' = 'short'): string {
  if (format === 'short') {
    return `[${memory.type}] ${memory.content.substring(0, 100)}${memory.content.length > 100 ? '...' : ''}`
  }
  
  return `[${memory.type}] ${memory.content}\nImportance: ${memory.importance.toFixed(2)}\nTags: ${memory.tags?.join(', ') || 'none'}\nCreated: ${memory.timestamp.toISOString()}`
}

/**
 * Group memories by type
 */
export function groupByType(memories: MemoryItem[]): Record<MemoryType, MemoryItem[]> {
  const grouped: Record<MemoryType, MemoryItem[]> = {
    episodic: [],
    semantic: [],
    ephemeral: [],
    persistent: [],
  }
  
  for (const memory of memories) {
    grouped[memory.type].push(memory)
  }
  
  return grouped
}

/**
 * Group memories by tag
 */
export function groupByTag(memories: MemoryItem[]): Record<string, MemoryItem[]> {
  const grouped: Record<string, MemoryItem[]> = {}
  
  for (const memory of memories) {
    if (memory.tags) {
      for (const tag of memory.tags) {
        if (!grouped[tag]) {
          grouped[tag] = []
        }
        grouped[tag].push(memory)
      }
    }
  }
  
  return grouped
}

/**
 * Filter expired memories
 */
export function filterExpired(memories: MemoryItem[]): MemoryItem[] {
  const now = Date.now()
  return memories.filter(memory => {
    if (!memory.ttl) {
      return true // No expiration
    }
    const age = now - memory.timestamp.getTime()
    return age < memory.ttl * 1000
  })
}

/**
 * Sort memories by importance (descending)
 */
export function sortByImportance(memories: MemoryItem[]): MemoryItem[] {
  return [...memories].sort((a, b) => b.importance - a.importance)
}

/**
 * Sort memories by recency (newest first)
 */
export function sortByRecency(memories: MemoryItem[]): MemoryItem[] {
  return [...memories].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

/**
 * Get top N memories by importance
 */
export function getTopMemories(memories: MemoryItem[], n: number): MemoryItem[] {
  return sortByImportance(memories).slice(0, n)
}

/**
 * Check if memory matches query (simple text matching)
 */
export function matchesQuery(memory: MemoryItem, query: string): boolean {
  const queryLower = query.toLowerCase()
  const contentLower = memory.content.toLowerCase()
  
  // Check content
  if (contentLower.includes(queryLower)) {
    return true
  }
  
  // Check tags
  if (memory.tags) {
    for (const tag of memory.tags) {
      if (tag.toLowerCase().includes(queryLower)) {
        return true
      }
    }
  }
  
  // Check topic
  if (memory.topic && memory.topic.toLowerCase().includes(queryLower)) {
    return true
  }
  
  return false
}
