/**
 * Memory Decay Manager
 *
 * Implements intelligent memory forgetting/decay mechanisms inspired by
 * Mem0's dynamic forgetting and Zep's temporal knowledge management.
 *
 * Features:
 * - Time-based expiration (explicit expiresAt)
 * - Importance-based decay (low importance memories decay faster)
 * - Access-based retention (frequently accessed memories persist)
 * - Configurable decay curves (linear, exponential, step)
 *
 * @module utils/decay-manager
 */

import type { Memory, MemoryType, MemoryScope } from '../types'

/**
 * Decay curve types
 */
export type DecayCurve = 'linear' | 'exponential' | 'step'

/**
 * Decay configuration for different memory types/scopes
 *
 * @example
 * ```typescript
 * const policy: DecayPolicy = {
 *   enabled: true,
 *   ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
 *   curve: 'exponential',
 *   minImportance: 0.8, // Keep important memories
 *   minAccessCount: 10, // Keep frequently accessed
 *   halfLife: 3 * 24 * 60 * 60 * 1000, // 3 day half-life
 * }
 * ```
 */
export interface DecayPolicy {
  /** Enable decay for this category */
  enabled: boolean
  /** Time-to-live in milliseconds (0 = never expires) */
  ttl: number
  /** Decay curve type */
  curve: DecayCurve
  /** Minimum importance to prevent decay (0-1) */
  minImportance?: number
  /** Minimum access count to prevent decay */
  minAccessCount?: number
  /** Half-life in milliseconds (for exponential decay) */
  halfLife?: number
}

/**
 * Decay manager configuration
 */
export interface DecayManagerConfig {
  /** Enable the decay manager */
  enabled: boolean
  /** Default decay policy */
  defaultPolicy: DecayPolicy
  /** Policy overrides by memory type */
  byType?: Partial<Record<MemoryType, Partial<DecayPolicy>>>
  /** Policy overrides by memory scope */
  byScope?: Partial<Record<MemoryScope, Partial<DecayPolicy>>>
  /** Maximum memories to process per decay cycle */
  batchSize?: number
  /** Grace period before first decay check (ms) */
  gracePeriod?: number
}

/**
 * Decay evaluation result
 */
export interface DecayResult {
  /** Memory ID */
  id: string
  /** Whether memory should be decayed (deleted or compressed) */
  shouldDecay: boolean
  /** Decay action to take */
  action: 'keep' | 'compress' | 'delete'
  /** Reason for the decision */
  reason: string
  /** Current decay score (0 = fresh, 1 = fully decayed) */
  decayScore: number
  /** Time until expiration (ms), null if no expiration */
  timeToExpiry: number | null
}

/**
 * Default decay configuration
 */
export const DEFAULT_DECAY_CONFIG: DecayManagerConfig = {
  enabled: true,
  defaultPolicy: {
    enabled: true,
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    curve: 'exponential',
    minImportance: 0.7,
    minAccessCount: 5,
    halfLife: 3 * 24 * 60 * 60 * 1000, // 3 days
  },
  byType: {
    semantic: {
      ttl: 30 * 24 * 60 * 60 * 1000, // 30 days for semantic memories
      minImportance: 0.5,
    },
    profile: {
      ttl: 0, // Profile memories never expire automatically
      enabled: false,
    },
    episodic: {
      ttl: 24 * 60 * 60 * 1000, // 24 hours for episodic
      curve: 'linear',
    },
    'short-term': {
      ttl: 60 * 60 * 1000, // 1 hour for short-term
      curve: 'step',
    },
    procedural: {
      ttl: 14 * 24 * 60 * 60 * 1000, // 14 days for procedural
    },
  },
  byScope: {
    session: {
      ttl: 60 * 60 * 1000, // 1 hour for session-scoped
    },
    thread: {
      ttl: 24 * 60 * 60 * 1000, // 24 hours for thread-scoped
    },
    user: {
      ttl: 90 * 24 * 60 * 60 * 1000, // 90 days for user-scoped
      minImportance: 0.3,
    },
    global: {
      ttl: 0, // Global memories never expire automatically
      enabled: false,
    },
  },
  batchSize: 100,
  gracePeriod: 60 * 60 * 1000, // 1 hour grace period
}

/**
 * Memory Decay Manager
 *
 * Evaluates and manages memory decay based on configurable policies.
 *
 * @example
 * ```typescript
 * const decayManager = new DecayManager({
 *   enabled: true,
 *   defaultPolicy: {
 *     ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
 *     curve: 'exponential',
 *   },
 * })
 *
 * // Evaluate a single memory
 * const result = decayManager.evaluate(memory)
 * if (result.shouldDecay) {
 *   if (result.action === 'delete') {
 *     await memoryService.deleteMemory(memory.id)
 *   } else if (result.action === 'compress') {
 *     await memoryService.compressMemory(memory.id)
 *   }
 * }
 *
 * // Batch evaluation
 * const candidates = decayManager.findDecayCandidates(memories)
 * ```
 */
export class DecayManager {
  private config: DecayManagerConfig

  constructor(config?: Partial<DecayManagerConfig>) {
    this.config = this.mergeConfig(config)
  }

  /**
   * Merge user config with defaults
   */
  private mergeConfig(
    config?: Partial<DecayManagerConfig>
  ): DecayManagerConfig {
    if (!config) return DEFAULT_DECAY_CONFIG

    return {
      enabled: config.enabled ?? DEFAULT_DECAY_CONFIG.enabled,
      defaultPolicy: {
        ...DEFAULT_DECAY_CONFIG.defaultPolicy,
        ...config.defaultPolicy,
      },
      byType: {
        ...DEFAULT_DECAY_CONFIG.byType,
        ...config.byType,
      },
      byScope: {
        ...DEFAULT_DECAY_CONFIG.byScope,
        ...config.byScope,
      },
      batchSize: config.batchSize ?? DEFAULT_DECAY_CONFIG.batchSize,
      gracePeriod: config.gracePeriod ?? DEFAULT_DECAY_CONFIG.gracePeriod,
    }
  }

  /**
   * Get effective policy for a memory
   */
  private getPolicy(memory: Memory): DecayPolicy {
    const typeOverride = this.config.byType?.[memory.type]
    const scopeOverride = this.config.byScope?.[memory.scope]

    // Merge policies: default < type < scope
    return {
      ...this.config.defaultPolicy,
      ...typeOverride,
      ...scopeOverride,
    }
  }

  /**
   * Evaluate a memory for decay
   *
   * Determines whether a memory should be kept, compressed, or deleted
   * based on its age, importance, access frequency, and configured policies.
   *
   * @param memory - The memory to evaluate
   * @param now - Current time (for testing, defaults to now)
   * @returns DecayResult with recommended action and reasoning
   *
   * @example
   * ```typescript
   * const result = decayManager.evaluate(memory)
   *
   * switch (result.action) {
   *   case 'delete':
   *     await store.delete(memory.id)
   *     break
   *   case 'compress':
   *     await store.compress(memory.id)
   *     break
   *   case 'keep':
   *     // No action needed
   *     break
   * }
   *
   * console.log(`Decay score: ${result.decayScore}`)
   * console.log(`Reason: ${result.reason}`)
   * ```
   */
  evaluate(memory: Memory, now: Date = new Date()): DecayResult {
    const policy = this.getPolicy(memory)

    // Decay disabled
    if (!this.config.enabled || !policy.enabled) {
      return {
        id: memory.id,
        shouldDecay: false,
        action: 'keep',
        reason: 'Decay disabled for this memory type/scope',
        decayScore: 0,
        timeToExpiry: null,
      }
    }

    // Check explicit expiration first
    if (memory.expiresAt) {
      const expiresAt = new Date(memory.expiresAt)
      if (expiresAt <= now) {
        return {
          id: memory.id,
          shouldDecay: true,
          action: 'delete',
          reason: `Memory expired at ${expiresAt.toISOString()}`,
          decayScore: 1,
          timeToExpiry: 0,
        }
      }
    }

    // Check grace period
    const createdAt = new Date(memory.createdAt ?? memory.timestamp ?? now)
    const age = now.getTime() - createdAt.getTime()
    if (age < (this.config.gracePeriod ?? 0)) {
      return {
        id: memory.id,
        shouldDecay: false,
        action: 'keep',
        reason: 'Memory is within grace period',
        decayScore: 0,
        timeToExpiry: policy.ttl > 0 ? policy.ttl - age : null,
      }
    }

    // Check importance threshold
    const importance = memory.importance ?? 0.5
    if (policy.minImportance && importance >= policy.minImportance) {
      return {
        id: memory.id,
        shouldDecay: false,
        action: 'keep',
        reason: `Importance (${importance.toFixed(2)}) meets threshold (${policy.minImportance})`,
        decayScore: 0,
        timeToExpiry: null,
      }
    }

    // Check access count threshold
    const accessCount = memory.accessCount ?? 0
    if (policy.minAccessCount && accessCount >= policy.minAccessCount) {
      return {
        id: memory.id,
        shouldDecay: false,
        action: 'keep',
        reason: `Access count (${accessCount}) meets threshold (${policy.minAccessCount})`,
        decayScore: 0,
        timeToExpiry: null,
      }
    }

    // Calculate decay score based on curve
    const decayScore = this.calculateDecayScore(age, policy)

    // TTL-based expiration
    if (policy.ttl > 0 && age >= policy.ttl) {
      return {
        id: memory.id,
        shouldDecay: true,
        action: 'delete',
        reason: `TTL exceeded (${Math.round(age / 1000 / 60 / 60)}h > ${Math.round(policy.ttl / 1000 / 60 / 60)}h)`,
        decayScore: 1,
        timeToExpiry: 0,
      }
    }

    // Decay score threshold for compression
    if (decayScore > 0.7) {
      return {
        id: memory.id,
        shouldDecay: true,
        action: 'compress',
        reason: `High decay score (${decayScore.toFixed(2)})`,
        decayScore,
        timeToExpiry: policy.ttl > 0 ? Math.max(0, policy.ttl - age) : null,
      }
    }

    return {
      id: memory.id,
      shouldDecay: false,
      action: 'keep',
      reason: 'Memory is healthy',
      decayScore,
      timeToExpiry: policy.ttl > 0 ? Math.max(0, policy.ttl - age) : null,
    }
  }

  /**
   * Calculate decay score based on curve type
   */
  private calculateDecayScore(age: number, policy: DecayPolicy): number {
    if (policy.ttl === 0) return 0

    const progress = age / policy.ttl

    switch (policy.curve) {
      case 'linear':
        return Math.min(1, progress)

      case 'exponential': {
        const halfLife = policy.halfLife ?? policy.ttl / 2
        // Exponential decay: 1 - e^(-age * ln(2) / halfLife)
        return Math.min(1, 1 - Math.exp((-age * Math.LN2) / halfLife))
      }

      case 'step':
        // Step function: 0 until 80% of TTL, then 1
        return progress >= 0.8 ? 1 : 0

      default:
        return Math.min(1, progress)
    }
  }

  /**
   * Find memories that are candidates for decay
   *
   * Efficiently scans memories and returns those that need action,
   * sorted by decay score (most decayed first).
   *
   * @param memories - Array of memories to evaluate
   * @param options - Optional limit and timestamp override
   * @returns Array of DecayResults for memories that need action
   *
   * @example
   * ```typescript
   * // Find top 50 decay candidates
   * const candidates = decayManager.findDecayCandidates(memories, {
   *   limit: 50,
   * })
   *
   * // Process in order of urgency (highest decay score first)
   * for (const candidate of candidates) {
   *   console.log(`${candidate.id}: ${candidate.action} (score: ${candidate.decayScore})`)
   * }
   * ```
   */
  findDecayCandidates(
    memories: Memory[],
    options?: { now?: Date; limit?: number }
  ): DecayResult[] {
    const now = options?.now ?? new Date()
    const limit = options?.limit ?? this.config.batchSize ?? 100

    const results: DecayResult[] = []

    for (const memory of memories) {
      if (results.length >= limit) break

      const result = this.evaluate(memory, now)
      if (result.shouldDecay) {
        results.push(result)
      }
    }

    // Sort by decay score (highest first)
    results.sort((a, b) => b.decayScore - a.decayScore)

    return results
  }

  /**
   * Calculate time until memory expires
   */
  getTimeToExpiry(memory: Memory, now: Date = new Date()): number | null {
    // Check explicit expiration
    if (memory.expiresAt) {
      const expiresAt = new Date(memory.expiresAt)
      const remaining = expiresAt.getTime() - now.getTime()
      return remaining > 0 ? remaining : 0
    }

    // Check policy-based TTL
    const policy = this.getPolicy(memory)
    if (!policy.enabled || policy.ttl === 0) return null

    const createdAt = new Date(memory.createdAt ?? memory.timestamp ?? now)
    const age = now.getTime() - createdAt.getTime()
    const remaining = policy.ttl - age

    return remaining > 0 ? remaining : 0
  }

  /**
   * Set explicit expiration date on a memory
   *
   * @param memory - Memory to update
   * @param expiresAt - Expiration date/time
   * @returns Updated memory with expiresAt set
   */
  setExpiration(memory: Memory, expiresAt: Date | string | number): Memory {
    const expiration =
      typeof expiresAt === 'number'
        ? new Date(Date.now() + expiresAt) // Treat number as milliseconds from now
        : new Date(expiresAt)

    return {
      ...memory,
      expiresAt: expiration,
    }
  }

  /**
   * Get decay statistics for a set of memories
   *
   * Provides an overview of memory health across your entire store.
   * Useful for monitoring dashboards and alerting.
   *
   * @param memories - Array of memories to analyze
   * @param now - Current time (for testing)
   * @returns Statistics object with health metrics
   *
   * @example
   * ```typescript
   * const stats = decayManager.getStats(memories)
   *
   * // Display in dashboard
   * console.log(`Total: ${stats.total}`)
   * console.log(`Healthy: ${stats.healthy} (${(stats.healthy/stats.total*100).toFixed(1)}%)`)
   * console.log(`At Risk: ${stats.atRisk}`)
   * console.log(`Expired: ${stats.expired}`)
   * console.log(`Average Decay: ${(stats.averageDecayScore*100).toFixed(1)}%`)
   *
   * // Alert if too many at-risk
   * if (stats.atRisk > stats.total * 0.2) {
   *   console.warn('Warning: More than 20% of memories at risk!')
   * }
   * ```
   */
  getStats(
    memories: Memory[],
    now: Date = new Date()
  ): {
    total: number
    healthy: number
    atRisk: number
    expiring: number
    expired: number
    byAction: { keep: number; compress: number; delete: number }
    averageDecayScore: number
  } {
    const stats = {
      total: memories.length,
      healthy: 0,
      atRisk: 0, // decayScore > 0.5
      expiring: 0, // Will expire within 24 hours
      expired: 0,
      byAction: { keep: 0, compress: 0, delete: 0 },
      averageDecayScore: 0,
    }

    let totalDecayScore = 0

    for (const memory of memories) {
      const result = this.evaluate(memory, now)
      totalDecayScore += result.decayScore
      stats.byAction[result.action]++

      if (result.decayScore === 0) {
        stats.healthy++
      } else if (result.decayScore > 0.5) {
        stats.atRisk++
      }

      if (result.timeToExpiry !== null) {
        if (result.timeToExpiry === 0) {
          stats.expired++
        } else if (result.timeToExpiry < 24 * 60 * 60 * 1000) {
          stats.expiring++
        }
      }
    }

    stats.averageDecayScore =
      memories.length > 0 ? totalDecayScore / memories.length : 0

    return stats
  }
}

/**
 * Create a decay manager with sensible defaults
 */
export function createDecayManager(
  config?: Partial<DecayManagerConfig>
): DecayManager {
  return new DecayManager(config)
}
