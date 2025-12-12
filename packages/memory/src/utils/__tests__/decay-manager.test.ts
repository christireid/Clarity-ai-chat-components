/**
 * DecayManager Tests
 *
 * Comprehensive tests for memory decay/forgetting functionality
 */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  DecayManager,
  createDecayManager,
  DEFAULT_DECAY_CONFIG,
  type DecayManagerConfig,
} from '../decay-manager'
import type { Memory } from '../../types'

// Helper to create test memories
function createMemory(overrides: Partial<Memory> = {}): Memory {
  return {
    id: `mem-${Math.random().toString(36).slice(2)}`,
    content: 'Test memory content',
    type: 'episodic',
    scope: 'session',
    importance: 0.5,
    accessCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    timestamp: new Date(),
    tokens: 10,
    confidence: 0.8,
    priority: 'medium',
    metadata: {},
    ...overrides,
  }
}

describe('DecayManager', () => {
  let decayManager: DecayManager

  beforeEach(() => {
    decayManager = new DecayManager()
  })

  describe('constructor', () => {
    it('should create with default config', () => {
      const dm = new DecayManager()
      expect(dm).toBeDefined()
    })

    it('should accept partial config', () => {
      const dm = new DecayManager({
        enabled: false,
      })
      expect(dm).toBeDefined()
    })

    it('should merge config with defaults', () => {
      const dm = new DecayManager({
        defaultPolicy: {
          ttl: 1000,
          enabled: true,
          curve: 'linear',
        },
      })
      expect(dm).toBeDefined()
    })
  })

  describe('createDecayManager factory', () => {
    it('should create a decay manager', () => {
      const dm = createDecayManager()
      expect(dm).toBeInstanceOf(DecayManager)
    })

    it('should accept config', () => {
      const dm = createDecayManager({ enabled: false })
      expect(dm).toBeInstanceOf(DecayManager)
    })
  })

  describe('evaluate', () => {
    it('should return keep for fresh memory', () => {
      const memory = createMemory({
        createdAt: new Date(),
      })

      const result = decayManager.evaluate(memory)

      expect(result.shouldDecay).toBe(false)
      expect(result.action).toBe('keep')
      expect(result.reason).toContain('grace period')
    })

    it('should return delete for expired memory with expiresAt', () => {
      const memory = createMemory({
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        expiresAt: new Date(Date.now() - 1000), // expired 1 second ago
      })

      const result = decayManager.evaluate(memory)

      expect(result.shouldDecay).toBe(true)
      expect(result.action).toBe('delete')
      expect(result.reason).toContain('expired')
    })

    it('should keep memory with high importance', () => {
      const memory = createMemory({
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        importance: 0.9,
      })

      const result = decayManager.evaluate(memory)

      expect(result.shouldDecay).toBe(false)
      expect(result.action).toBe('keep')
      expect(result.reason).toContain('Importance')
    })

    it('should keep memory with high access count', () => {
      const memory = createMemory({
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        accessCount: 10,
      })

      const result = decayManager.evaluate(memory)

      expect(result.shouldDecay).toBe(false)
      expect(result.action).toBe('keep')
      expect(result.reason).toContain('Access count')
    })

    it('should delete memory that exceeds TTL', () => {
      const memory = createMemory({
        type: 'short-term',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago (short-term TTL is 1 hour)
        importance: 0.3,
      })

      const result = decayManager.evaluate(memory)

      expect(result.shouldDecay).toBe(true)
      expect(result.action).toBe('delete')
      expect(result.reason).toContain('TTL exceeded')
    })

    it('should return disabled when decay is disabled', () => {
      const dm = new DecayManager({ enabled: false })
      const memory = createMemory()

      const result = dm.evaluate(memory)

      expect(result.shouldDecay).toBe(false)
      expect(result.reason).toContain('disabled')
    })

    it('should handle global scope (never expires)', () => {
      const memory = createMemory({
        scope: 'global',
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      })

      const result = decayManager.evaluate(memory)

      expect(result.shouldDecay).toBe(false)
      expect(result.reason).toContain('disabled')
    })

    it('should handle profile type (never expires)', () => {
      const memory = createMemory({
        type: 'profile',
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      })

      const result = decayManager.evaluate(memory)

      expect(result.shouldDecay).toBe(false)
    })
  })

  describe('decay behavior', () => {
    it('should increase decay score for older memories', () => {
      // Using the default episodic/session config (24h TTL)
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
      const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000)

      const newMemory = createMemory({
        type: 'short-term', // 1 hour TTL
        scope: 'session',
        createdAt: twoHoursAgo,
        timestamp: twoHoursAgo,
        importance: 0.3, // Below threshold
        accessCount: 0,
      })

      const oldMemory = createMemory({
        type: 'short-term', // 1 hour TTL
        scope: 'session',
        createdAt: twentyHoursAgo,
        timestamp: twentyHoursAgo,
        importance: 0.3, // Below threshold
        accessCount: 0,
      })

      const dm = new DecayManager({ gracePeriod: 0 })

      const newResult = dm.evaluate(newMemory)
      const oldResult = dm.evaluate(oldMemory)

      // Both should have decayed (TTL is 1 hour, both are older)
      // But older one should have higher decay score
      expect(oldResult.decayScore).toBeGreaterThanOrEqual(newResult.decayScore)
    })

    it('should respect different decay curves based on type', () => {
      // episodic type has linear curve
      const episodicMemory = createMemory({
        type: 'episodic',
        scope: 'thread', // 24h TTL
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours = 50% of TTL
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        importance: 0.3,
        accessCount: 0,
      })

      // short-term type has step curve
      const shortTermMemory = createMemory({
        type: 'short-term',
        scope: 'session',
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min = 50% of TTL
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        importance: 0.3,
        accessCount: 0,
      })

      const dm = new DecayManager({ gracePeriod: 0 })

      const episodicResult = dm.evaluate(episodicMemory)
      const shortTermResult = dm.evaluate(shortTermMemory)

      // Episodic at 50% TTL with linear curve should have ~0.5 decay
      // Short-term at 50% TTL with step curve should have 0 decay (threshold is 80%)
      expect(episodicResult.decayScore).toBeGreaterThan(0)
      expect(shortTermResult.decayScore).toBe(0)
    })

    it('should trigger deletion when TTL exceeded', () => {
      const dm = new DecayManager({ gracePeriod: 0 })

      // Memory way past its TTL (short-term type has 1 hour TTL)
      const expiredMemory = createMemory({
        type: 'short-term',
        scope: 'session',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        importance: 0.3,
        accessCount: 0,
      })

      const result = dm.evaluate(expiredMemory)

      expect(result.shouldDecay).toBe(true)
      expect(result.action).toBe('delete')
      expect(result.decayScore).toBe(1)
    })
  })

  describe('findDecayCandidates', () => {
    it('should return empty array for fresh memories', () => {
      const memories = [
        createMemory({ createdAt: new Date() }),
        createMemory({ createdAt: new Date() }),
      ]

      const candidates = decayManager.findDecayCandidates(memories)

      expect(candidates).toHaveLength(0)
    })

    it('should find expired memories', () => {
      const memories = [
        createMemory({ createdAt: new Date() }), // Fresh
        createMemory({
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() - 1000),
        }), // Expired
      ]

      const candidates = decayManager.findDecayCandidates(memories)

      expect(candidates).toHaveLength(1)
      expect(candidates[0].action).toBe('delete')
    })

    it('should respect limit parameter', () => {
      const memories = Array.from({ length: 10 }, () =>
        createMemory({
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() - 1000),
        })
      )

      const candidates = decayManager.findDecayCandidates(memories, {
        limit: 3,
      })

      expect(candidates).toHaveLength(3)
    })

    it('should sort by decay score descending', () => {
      const dm = new DecayManager({
        gracePeriod: 0,
        defaultPolicy: {
          enabled: true,
          ttl: 100000,
          curve: 'linear',
          minImportance: 1,
          minAccessCount: 1000,
        },
      })

      const memories = [
        createMemory({
          id: 'old',
          createdAt: new Date(Date.now() - 90000), // 90% decay
          expiresAt: new Date(Date.now() - 1000),
        }),
        createMemory({
          id: 'medium',
          createdAt: new Date(Date.now() - 80000), // 80% decay
          expiresAt: new Date(Date.now() - 1000),
        }),
      ]

      const candidates = dm.findDecayCandidates(memories)

      expect(candidates.length).toBeGreaterThan(0)
      // Should be sorted by decay score descending
      for (let i = 1; i < candidates.length; i++) {
        expect(candidates[i - 1].decayScore).toBeGreaterThanOrEqual(
          candidates[i].decayScore
        )
      }
    })
  })

  describe('getTimeToExpiry', () => {
    it('should return remaining time for explicit expiration', () => {
      const expiresAt = new Date(Date.now() + 10000) // 10 seconds from now
      const memory = createMemory({ expiresAt })

      const ttl = decayManager.getTimeToExpiry(memory)

      expect(ttl).not.toBeNull()
      expect(ttl).toBeGreaterThan(9000)
      expect(ttl).toBeLessThanOrEqual(10000)
    })

    it('should return 0 for already expired memory', () => {
      const memory = createMemory({
        expiresAt: new Date(Date.now() - 1000),
      })

      const ttl = decayManager.getTimeToExpiry(memory)

      expect(ttl).toBe(0)
    })

    it('should return null for global scope', () => {
      const memory = createMemory({ scope: 'global' })

      const ttl = decayManager.getTimeToExpiry(memory)

      expect(ttl).toBeNull()
    })

    it('should calculate TTL from policy when no explicit expiration', () => {
      const memory = createMemory({
        type: 'episodic',
        scope: 'session',
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      })

      const ttl = decayManager.getTimeToExpiry(memory)

      // Session scope has 1 hour TTL, so should have ~30 min left
      expect(ttl).not.toBeNull()
      expect(ttl).toBeGreaterThan(0)
    })
  })

  describe('setExpiration', () => {
    it('should set expiration from Date', () => {
      const memory = createMemory()
      const expiresAt = new Date(Date.now() + 60000)

      const updated = decayManager.setExpiration(memory, expiresAt)

      expect(updated.expiresAt).toEqual(expiresAt)
    })

    it('should set expiration from string', () => {
      const memory = createMemory()
      const expiresAt = new Date(Date.now() + 60000).toISOString()

      const updated = decayManager.setExpiration(memory, expiresAt)

      expect(updated.expiresAt).toBeInstanceOf(Date)
    })

    it('should set expiration from milliseconds offset', () => {
      const memory = createMemory()
      const before = Date.now()

      const updated = decayManager.setExpiration(memory, 60000) // 1 minute from now

      const after = Date.now()
      expect(updated.expiresAt).toBeInstanceOf(Date)
      expect(updated.expiresAt!.getTime()).toBeGreaterThanOrEqual(
        before + 60000
      )
      expect(updated.expiresAt!.getTime()).toBeLessThanOrEqual(after + 60000)
    })

    it('should not mutate original memory', () => {
      const memory = createMemory()
      const original = { ...memory }

      decayManager.setExpiration(memory, 60000)

      expect(memory.expiresAt).toEqual(original.expiresAt)
    })
  })

  describe('getStats', () => {
    it('should return correct stats for empty array', () => {
      const stats = decayManager.getStats([])

      expect(stats.total).toBe(0)
      expect(stats.healthy).toBe(0)
      expect(stats.atRisk).toBe(0)
      expect(stats.expiring).toBe(0)
      expect(stats.expired).toBe(0)
      expect(stats.averageDecayScore).toBe(0)
    })

    it('should count healthy memories', () => {
      const memories = [
        createMemory({ createdAt: new Date() }),
        createMemory({ createdAt: new Date() }),
      ]

      const stats = decayManager.getStats(memories)

      expect(stats.total).toBe(2)
      expect(stats.healthy).toBe(2)
    })

    it('should count expired memories', () => {
      const memories = [
        createMemory({
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() - 1000),
        }),
      ]

      const stats = decayManager.getStats(memories)

      expect(stats.expired).toBe(1)
      expect(stats.byAction.delete).toBe(1)
    })

    it('should count memories expiring soon', () => {
      // Need to use a DecayManager with no grace period to test this properly
      const dm = new DecayManager({
        gracePeriod: 0,
        byScope: {},
        byType: {},
      })

      const memories = [
        createMemory({
          createdAt: new Date(Date.now() - 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          scope: 'thread',
          type: 'episodic',
        }),
      ]

      const stats = dm.getStats(memories)

      expect(stats.expiring).toBe(1)
    })

    it('should calculate average decay score', () => {
      const dm = new DecayManager({
        gracePeriod: 0,
        defaultPolicy: {
          enabled: true,
          ttl: 10000,
          curve: 'linear',
          minImportance: 1,
          minAccessCount: 1000,
        },
      })

      const memories = [
        createMemory({
          createdAt: new Date(Date.now() - 5000), // 50% decay
          importance: 0.1,
        }),
        createMemory({
          createdAt: new Date(Date.now() - 5000), // 50% decay
          importance: 0.1,
        }),
      ]

      const stats = dm.getStats(memories)

      expect(stats.averageDecayScore).toBeGreaterThan(0)
    })
  })

  describe('DEFAULT_DECAY_CONFIG', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_DECAY_CONFIG.enabled).toBe(true)
      expect(DEFAULT_DECAY_CONFIG.defaultPolicy.ttl).toBe(
        7 * 24 * 60 * 60 * 1000
      ) // 7 days
      expect(DEFAULT_DECAY_CONFIG.defaultPolicy.curve).toBe('exponential')
      expect(DEFAULT_DECAY_CONFIG.batchSize).toBe(100)
      expect(DEFAULT_DECAY_CONFIG.gracePeriod).toBe(60 * 60 * 1000) // 1 hour
    })

    it('should have type-specific policies', () => {
      expect(DEFAULT_DECAY_CONFIG.byType?.semantic?.ttl).toBe(
        30 * 24 * 60 * 60 * 1000
      ) // 30 days
      expect(DEFAULT_DECAY_CONFIG.byType?.profile?.enabled).toBe(false)
      expect(DEFAULT_DECAY_CONFIG.byType?.['short-term']?.ttl).toBe(
        60 * 60 * 1000
      ) // 1 hour
    })

    it('should have scope-specific policies', () => {
      expect(DEFAULT_DECAY_CONFIG.byScope?.session?.ttl).toBe(60 * 60 * 1000) // 1 hour
      expect(DEFAULT_DECAY_CONFIG.byScope?.global?.enabled).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle memory without createdAt', () => {
      const memory = createMemory()
      // @ts-expect-error - Testing edge case
      delete memory.createdAt
      // @ts-expect-error - Testing edge case
      delete memory.timestamp

      const result = decayManager.evaluate(memory)

      // Should not throw
      expect(result).toBeDefined()
    })

    it('should handle memory with invalid date', () => {
      const memory = createMemory({
        createdAt: new Date('invalid'),
      })

      const result = decayManager.evaluate(memory)

      // Should not throw, should handle gracefully
      expect(result).toBeDefined()
    })

    it('should handle zero TTL', () => {
      const dm = new DecayManager({
        defaultPolicy: {
          enabled: true,
          ttl: 0,
          curve: 'linear',
        },
      })

      const memory = createMemory()

      const result = dm.evaluate(memory)

      // Zero TTL means no automatic expiration
      expect(result.decayScore).toBe(0)
    })

    it('should handle very old memories', () => {
      const memory = createMemory({
        createdAt: new Date(0), // Unix epoch
        importance: 0.1,
        accessCount: 0,
      })

      const result = decayManager.evaluate(memory)

      // Should handle gracefully
      expect(result).toBeDefined()
      expect(result.shouldDecay).toBe(true)
    })
  })
})
