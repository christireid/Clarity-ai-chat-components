/**
 * Clarity Memory - Cleanup Utilities
 * 
 * Utilities for cleaning up and managing memory lifecycle
 */

import type { MemoryItem } from '../core/types'
import { isExpired, getAge } from '../core/memory-item'

/**
 * Cleanup expired memories
 */
export function cleanupExpired(memories: MemoryItem[]): {
  kept: MemoryItem[]
  removed: MemoryItem[]
} {
  const kept: MemoryItem[] = []
  const removed: MemoryItem[] = []

  for (const memory of memories) {
    if (isExpired(memory)) {
      removed.push(memory)
    } else {
      kept.push(memory)
    }
  }

  return { kept, removed }
}

/**
 * Cleanup low-importance memories
 */
export function cleanupLowImportance(
  memories: MemoryItem[],
  threshold: number = 0.3
): {
  kept: MemoryItem[]
  removed: MemoryItem[]
} {
  const kept: MemoryItem[] = []
  const removed: MemoryItem[] = []

  for (const memory of memories) {
    if (memory.importance < threshold) {
      removed.push(memory)
    } else {
      kept.push(memory)
    }
  }

  return { kept, removed }
}

/**
 * Cleanup old memories
 */
export function cleanupOld(
  memories: MemoryItem[],
  maxAgeSeconds: number
): {
  kept: MemoryItem[]
  removed: MemoryItem[]
} {
  const kept: MemoryItem[] = []
  const removed: MemoryItem[] = []

  for (const memory of memories) {
    const age = getAge(memory)
    if (age > maxAgeSeconds) {
      removed.push(memory)
    } else {
      kept.push(memory)
    }
  }

  return { kept, removed }
}

/**
 * Cleanup by type
 */
export function cleanupByType(
  memories: MemoryItem[],
  typesToRemove: string[]
): {
  kept: MemoryItem[]
  removed: MemoryItem[]
} {
  const kept: MemoryItem[] = []
  const removed: MemoryItem[] = []

  for (const memory of memories) {
    if (typesToRemove.includes(memory.type)) {
      removed.push(memory)
    } else {
      kept.push(memory)
    }
  }

  return { kept, removed }
}

/**
 * Comprehensive cleanup strategy
 */
export interface CleanupStrategy {
  removeExpired?: boolean
  removeLowImportance?: boolean
  minImportance?: number
  removeOld?: boolean
  maxAgeSeconds?: number
  removeTypes?: string[]
  maxCount?: number
}

/**
 * Apply cleanup strategy
 */
export function applyCleanupStrategy(
  memories: MemoryItem[],
  strategy: CleanupStrategy
): {
  kept: MemoryItem[]
  removed: MemoryItem[]
  stats: {
    expired: number
    lowImportance: number
    old: number
    byType: number
    total: number
  }
} {
  let current = [...memories]
  const stats = {
    expired: 0,
    lowImportance: 0,
    old: 0,
    byType: 0,
    total: 0,
  }

  // Remove expired
  if (strategy.removeExpired) {
    const { kept, removed } = cleanupExpired(current)
    stats.expired = removed.length
    current = kept
  }

  // Remove low importance
  if (strategy.removeLowImportance && strategy.minImportance !== undefined) {
    const { kept, removed } = cleanupLowImportance(current, strategy.minImportance)
    stats.lowImportance = removed.length
    current = kept
  }

  // Remove old
  if (strategy.removeOld && strategy.maxAgeSeconds !== undefined) {
    const { kept, removed } = cleanupOld(current, strategy.maxAgeSeconds)
    stats.old = removed.length
    current = kept
  }

  // Remove by type
  if (strategy.removeTypes && strategy.removeTypes.length > 0) {
    const { kept, removed } = cleanupByType(current, strategy.removeTypes)
    stats.byType = removed.length
    current = kept
  }

  // Limit count (keep most important)
  if (strategy.maxCount && current.length > strategy.maxCount) {
    current.sort((a, b) => b.importance - a.importance)
    const removed = current.splice(strategy.maxCount)
    stats.total = removed.length
  }

  stats.total = memories.length - current.length

  return {
    kept: current,
    removed: memories.filter(m => !current.includes(m)),
    stats,
  }
}
