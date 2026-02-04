/**
 * Episodic Memory Module
 *
 * Handles episodic (event-based) memory operations including:
 * - Conversation activity assessment
 * - Recent event tracking
 * - Time-based filtering
 */

import type { MemoryItem } from '../types'

/**
 * Episodic memory handler
 */
export class EpisodicMemoryHandler {
  constructor(private cache: Map<string, MemoryItem>) {}

  /**
   * Assess conversation activity level
   */
  assessConversationActivity(): 'low' | 'medium' | 'high' {
    const recentMemories = Array.from(this.cache.values()).filter((m) => {
      const age = Date.now() - m.createdAt.getTime()
      return age < 5 * 60 * 1000 // Last 5 minutes
    })

    if (recentMemories.length > 10) return 'high'
    if (recentMemories.length > 5) return 'medium'
    return 'low'
  }

  /**
   * Get recent episodic memories
   */
  getRecentMemories(
    timeWindowMs: number = 5 * 60 * 1000
  ): MemoryItem[] {
    const now = Date.now()
    return Array.from(this.cache.values()).filter((m) => {
      if (m.type !== 'episodic') return false
      const age = now - m.createdAt.getTime()
      return age < timeWindowMs
    })
  }

  /**
   * Get episodic memories within time range
   */
  getMemoriesInRange(start: Date, end: Date): MemoryItem[] {
    return Array.from(this.cache.values()).filter((m) => {
      if (m.type !== 'episodic') return false
      return m.createdAt >= start && m.createdAt <= end
    })
  }

  /**
   * Get all episodic memories
   */
  getAllEpisodicMemories(): MemoryItem[] {
    return Array.from(this.cache.values()).filter(
      (m) => m.type === 'episodic'
    )
  }

  /**
   * Get episodic memory count
   */
  getCount(): number {
    return Array.from(this.cache.values()).filter(
      (m) => m.type === 'episodic'
    ).length
  }
}
