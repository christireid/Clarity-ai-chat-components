/**
 * ConsentManager Tests
 *
 * Comprehensive test coverage for GDPR/CCPA consent management.
 * Tests Article 7 compliance: consent must be freely given, specific, informed, and unambiguous.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ConsentManager } from '../consent-manager'
import type { ConsentPurpose, ConsentRecord } from '../consent-manager'
import type { VectorStore } from '../../stores/base'
import { InMemoryStore } from '../../stores/in-memory'

describe('ConsentManager', () => {
  let consentManager: ConsentManager
  let store: VectorStore

  beforeEach(() => {
    store = new InMemoryStore()
    consentManager = new ConsentManager(store, '1.0.0')
  })

  describe('constructor', () => {
    it('should create with default version', () => {
      const manager = new ConsentManager(store)
      expect(manager).toBeDefined()
    })

    it('should create with custom version', () => {
      const manager = new ConsentManager(store, '2.0.0')
      expect(manager).toBeDefined()
    })
  })

  describe('recordConsent', () => {
    it('should record consent for single purpose', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])

      const hasConsent = await consentManager.hasConsent(
        'user123',
        'message_storage'
      )
      expect(hasConsent).toBe(true)
    })

    it('should record consent for multiple purposes', async () => {
      await consentManager.recordConsent('user123', [
        'message_storage',
        'embeddings',
        'analytics',
      ])

      expect(
        await consentManager.hasConsent('user123', 'message_storage')
      ).toBe(true)
      expect(await consentManager.hasConsent('user123', 'embeddings')).toBe(
        true
      )
      expect(await consentManager.hasConsent('user123', 'analytics')).toBe(
        true
      )
    })

    it('should record consent with IP address metadata', async () => {
      await consentManager.recordConsent('user123', ['message_storage'], {
        ipAddress: '192.168.1.1',
      })

      const hasConsent = await consentManager.hasConsent(
        'user123',
        'message_storage'
      )
      expect(hasConsent).toBe(true)
    })

    it('should record consent with user agent metadata', async () => {
      await consentManager.recordConsent('user123', ['message_storage'], {
        userAgent: 'Mozilla/5.0',
      })

      const hasConsent = await consentManager.hasConsent(
        'user123',
        'message_storage'
      )
      expect(hasConsent).toBe(true)
    })

    it('should record consent with full audit metadata', async () => {
      await consentManager.recordConsent('user123', ['message_storage'], {
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      })

      const history = await consentManager.getConsentHistory('user123')
      expect(history.length).toBeGreaterThan(0)
      expect(history[0].type).toBe('granted')
    })

    it('should handle "all" purpose consent', async () => {
      await consentManager.recordConsent('user123', ['all'])

      expect(
        await consentManager.hasConsent('user123', 'message_storage')
      ).toBe(true)
      expect(await consentManager.hasConsent('user123', 'embeddings')).toBe(
        true
      )
      expect(await consentManager.hasConsent('user123', 'analytics')).toBe(
        true
      )
    })

    it('should create audit trail entry', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])

      const history = await consentManager.getConsentHistory('user123')
      expect(history).toHaveLength(1)
      expect(history[0].type).toBe('granted')
      expect(history[0].userId).toBe('user123')
      expect(history[0].purposes).toContain('message_storage')
      expect(history[0].version).toBe('1.0.0')
    })

    it('should update consent record for same user', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])
      await consentManager.recordConsent('user123', [
        'message_storage',
        'embeddings',
      ])

      expect(
        await consentManager.hasConsent('user123', 'message_storage')
      ).toBe(true)
      expect(await consentManager.hasConsent('user123', 'embeddings')).toBe(
        true
      )
    })

    it('should handle multiple users independently', async () => {
      await consentManager.recordConsent('user1', ['message_storage'])
      await consentManager.recordConsent('user2', ['embeddings'])

      expect(await consentManager.hasConsent('user1', 'message_storage')).toBe(
        true
      )
      expect(await consentManager.hasConsent('user1', 'embeddings')).toBe(
        false
      )
      expect(await consentManager.hasConsent('user2', 'message_storage')).toBe(
        false
      )
      expect(await consentManager.hasConsent('user2', 'embeddings')).toBe(true)
    })
  })

  describe('withdrawConsent', () => {
    beforeEach(async () => {
      await consentManager.recordConsent('user123', [
        'message_storage',
        'embeddings',
        'analytics',
      ])
    })

    it('should withdraw consent for specific purpose', async () => {
      await consentManager.withdrawConsent('user123', 'analytics')

      expect(
        await consentManager.hasConsent('user123', 'message_storage')
      ).toBe(true)
      expect(await consentManager.hasConsent('user123', 'embeddings')).toBe(
        true
      )
      expect(await consentManager.hasConsent('user123', 'analytics')).toBe(
        false
      )
    })

    it('should withdraw all consent when no purpose specified', async () => {
      await consentManager.withdrawConsent('user123')

      expect(
        await consentManager.hasConsent('user123', 'message_storage')
      ).toBe(false)
      expect(await consentManager.hasConsent('user123', 'embeddings')).toBe(
        false
      )
      expect(await consentManager.hasConsent('user123', 'analytics')).toBe(
        false
      )
    })

    it('should create withdrawal audit trail entry', async () => {
      await consentManager.withdrawConsent('user123', 'analytics')

      const history = await consentManager.getConsentHistory('user123')
      const withdrawalEvent = history.find((e) => e.type === 'withdrawn')

      expect(withdrawalEvent).toBeDefined()
      expect(withdrawalEvent?.purposes).toContain('analytics')
    })

    it('should handle withdrawal of non-existent consent gracefully', async () => {
      await consentManager.withdrawConsent('nonexistent')

      // Should not throw
      expect(
        await consentManager.hasConsent('nonexistent', 'message_storage')
      ).toBe(false)
    })

    it('should handle double withdrawal gracefully', async () => {
      await consentManager.withdrawConsent('user123', 'analytics')
      await consentManager.withdrawConsent('user123', 'analytics')

      expect(await consentManager.hasConsent('user123', 'analytics')).toBe(
        false
      )
    })

    it('should maintain remaining purposes after partial withdrawal', async () => {
      await consentManager.withdrawConsent('user123', 'analytics')

      const history = await consentManager.getConsentHistory('user123')
      expect(history.length).toBeGreaterThan(0)

      expect(
        await consentManager.hasConsent('user123', 'message_storage')
      ).toBe(true)
      expect(await consentManager.hasConsent('user123', 'embeddings')).toBe(
        true
      )
    })
  })

  describe('hasConsent', () => {
    it('should return false for user without consent', async () => {
      const hasConsent = await consentManager.hasConsent(
        'user123',
        'message_storage'
      )
      expect(hasConsent).toBe(false)
    })

    it('should return true for granted purpose', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])

      const hasConsent = await consentManager.hasConsent(
        'user123',
        'message_storage'
      )
      expect(hasConsent).toBe(true)
    })

    it('should return false for non-granted purpose', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])

      const hasConsent = await consentManager.hasConsent('user123', 'analytics')
      expect(hasConsent).toBe(false)
    })

    it('should create audit trail check event', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])
      await consentManager.hasConsent('user123', 'message_storage')

      const stats = consentManager.getConsentStats()
      expect(stats.eventsByType.checked).toBeGreaterThan(0)
    })

    it('should return false after consent withdrawal', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])
      await consentManager.withdrawConsent('user123', 'message_storage')

      const hasConsent = await consentManager.hasConsent(
        'user123',
        'message_storage'
      )
      expect(hasConsent).toBe(false)
    })
  })

  describe('verifyConsent', () => {
    it('should return verification with no consent', async () => {
      const verification = await consentManager.verifyConsent(
        'user123',
        'message_storage'
      )

      expect(verification.userId).toBe('user123')
      expect(verification.purpose).toBe('message_storage')
      expect(verification.hasConsent).toBe(false)
      expect(verification.grantedAt).toBeUndefined()
      expect(verification.version).toBeUndefined()
    })

    it('should return verification with consent details', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])

      const verification = await consentManager.verifyConsent(
        'user123',
        'message_storage'
      )

      expect(verification.userId).toBe('user123')
      expect(verification.purpose).toBe('message_storage')
      expect(verification.hasConsent).toBe(true)
      expect(verification.grantedAt).toBeInstanceOf(Date)
      expect(verification.version).toBe('1.0.0')
    })

    it('should verify "all" purpose consent', async () => {
      await consentManager.recordConsent('user123', ['all'])

      const verification = await consentManager.verifyConsent(
        'user123',
        'analytics'
      )

      expect(verification.hasConsent).toBe(true)
    })
  })

  describe('getConsentHistory', () => {
    it('should return empty array for user with no history', async () => {
      const history = await consentManager.getConsentHistory('user123')
      expect(history).toEqual([])
    })

    it('should return chronological history', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])
      await new Promise((resolve) => setTimeout(resolve, 10))
      await consentManager.recordConsent('user123', ['embeddings'])
      await new Promise((resolve) => setTimeout(resolve, 10))
      await consentManager.withdrawConsent('user123', 'message_storage')

      const history = await consentManager.getConsentHistory('user123')

      expect(history.length).toBeGreaterThanOrEqual(3)

      // Verify chronological order
      for (let i = 1; i < history.length; i++) {
        expect(history[i].timestamp.getTime()).toBeGreaterThanOrEqual(
          history[i - 1].timestamp.getTime()
        )
      }
    })

    it('should include all event types in history', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])
      await consentManager.hasConsent('user123', 'message_storage')
      await consentManager.withdrawConsent('user123', 'message_storage')

      const history = await consentManager.getConsentHistory('user123')

      const eventTypes = new Set(history.map((e) => e.type))
      expect(eventTypes.has('granted')).toBe(true)
      expect(eventTypes.has('checked')).toBe(true)
      expect(eventTypes.has('withdrawn')).toBe(true)
    })

    it('should include consent version in history', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])

      const history = await consentManager.getConsentHistory('user123')

      expect(history[0].version).toBe('1.0.0')
    })
  })

  describe('requireConsent', () => {
    it('should not throw when consent is granted', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])

      await expect(
        consentManager.requireConsent('user123', 'message_storage')
      ).resolves.not.toThrow()
    })

    it('should throw when consent is not granted', async () => {
      await expect(
        consentManager.requireConsent('user123', 'message_storage')
      ).rejects.toThrow(/Consent required/)
    })

    it('should throw with descriptive error message', async () => {
      await expect(
        consentManager.requireConsent('user123', 'analytics')
      ).rejects.toThrow(/user123.*analytics/)
    })

    it('should pass when "all" consent is granted', async () => {
      await consentManager.recordConsent('user123', ['all'])

      await expect(
        consentManager.requireConsent('user123', 'analytics')
      ).resolves.not.toThrow()
    })
  })

  describe('clearAllConsent', () => {
    it('should clear all consent data', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])
      await consentManager.clearAllConsent()

      const hasConsent = await consentManager.hasConsent(
        'user123',
        'message_storage'
      )
      expect(hasConsent).toBe(false)
    })

    it('should clear consent statistics', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])
      await consentManager.clearAllConsent()

      const stats = consentManager.getConsentStats()
      expect(stats.totalUsers).toBe(0)
      expect(stats.totalEvents).toBe(0)
    })
  })

  describe('getConsentStats', () => {
    it('should return zero stats for empty manager', () => {
      const stats = consentManager.getConsentStats()

      expect(stats.totalUsers).toBe(0)
      expect(stats.totalEvents).toBe(0)
      expect(stats.eventsByType).toEqual({})
    })

    it('should count unique users', async () => {
      await consentManager.recordConsent('user1', ['message_storage'])
      await consentManager.recordConsent('user2', ['embeddings'])

      const stats = consentManager.getConsentStats()

      expect(stats.totalUsers).toBe(2)
    })

    it('should count total events', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])
      await consentManager.hasConsent('user123', 'message_storage')
      await consentManager.withdrawConsent('user123', 'message_storage')

      const stats = consentManager.getConsentStats()

      expect(stats.totalEvents).toBeGreaterThanOrEqual(3)
    })

    it('should categorize events by type', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])
      await consentManager.withdrawConsent('user123', 'message_storage')

      const stats = consentManager.getConsentStats()

      expect(stats.eventsByType.granted).toBeGreaterThan(0)
      expect(stats.eventsByType.withdrawn).toBeGreaterThan(0)
    })
  })

  describe('GDPR Article 7 Compliance', () => {
    describe('Freely given consent', () => {
      it('should not require consent for all purposes at once', async () => {
        await consentManager.recordConsent('user123', ['message_storage'])

        expect(
          await consentManager.hasConsent('user123', 'message_storage')
        ).toBe(true)
        expect(await consentManager.hasConsent('user123', 'analytics')).toBe(
          false
        )
      })

      it('should allow granular consent for each purpose', async () => {
        await consentManager.recordConsent('user123', ['message_storage'])
        await consentManager.recordConsent('user123', ['embeddings'])

        expect(
          await consentManager.hasConsent('user123', 'message_storage')
        ).toBe(true)
        expect(await consentManager.hasConsent('user123', 'embeddings')).toBe(
          true
        )
      })
    })

    describe('Specific and informed consent', () => {
      it('should track separate purposes', async () => {
        const purposes: ConsentPurpose[] = [
          'message_storage',
          'embeddings',
          'analytics',
          'personalization',
        ]

        for (const purpose of purposes) {
          await consentManager.recordConsent('user123', [purpose])
          expect(await consentManager.hasConsent('user123', purpose)).toBe(true)
        }
      })

      it('should maintain purpose-specific consent', async () => {
        await consentManager.recordConsent('user123', [
          'message_storage',
          'embeddings',
        ])

        expect(
          await consentManager.hasConsent('user123', 'message_storage')
        ).toBe(true)
        expect(await consentManager.hasConsent('user123', 'analytics')).toBe(
          false
        )
      })
    })

    describe('Verifiable consent', () => {
      it('should create audit trail for all consent actions', async () => {
        await consentManager.recordConsent('user123', ['message_storage'])
        await consentManager.withdrawConsent('user123', 'message_storage')

        const history = await consentManager.getConsentHistory('user123')

        expect(history.length).toBeGreaterThan(0)
        expect(history.some((e) => e.type === 'granted')).toBe(true)
        expect(history.some((e) => e.type === 'withdrawn')).toBe(true)
      })

      it('should record timestamp for demonstrable consent', async () => {
        const before = new Date()
        await consentManager.recordConsent('user123', ['message_storage'])
        const after = new Date()

        const history = await consentManager.getConsentHistory('user123')
        const grantEvent = history.find((e) => e.type === 'granted')

        expect(grantEvent?.timestamp).toBeInstanceOf(Date)
        expect(grantEvent?.timestamp.getTime()).toBeGreaterThanOrEqual(
          before.getTime()
        )
        expect(grantEvent?.timestamp.getTime()).toBeLessThanOrEqual(
          after.getTime()
        )
      })

      it('should record consent version for policy tracking', async () => {
        await consentManager.recordConsent('user123', ['message_storage'])

        const history = await consentManager.getConsentHistory('user123')

        expect(history[0].version).toBe('1.0.0')
      })
    })

    describe('Easy withdrawal (Article 7(3))', () => {
      it('should allow withdrawal as easily as granting', async () => {
        await consentManager.recordConsent('user123', ['message_storage'])
        await consentManager.withdrawConsent('user123', 'message_storage')

        expect(
          await consentManager.hasConsent('user123', 'message_storage')
        ).toBe(false)
      })

      it('should allow partial withdrawal', async () => {
        await consentManager.recordConsent('user123', [
          'message_storage',
          'embeddings',
          'analytics',
        ])
        await consentManager.withdrawConsent('user123', 'analytics')

        expect(
          await consentManager.hasConsent('user123', 'message_storage')
        ).toBe(true)
        expect(await consentManager.hasConsent('user123', 'embeddings')).toBe(
          true
        )
        expect(await consentManager.hasConsent('user123', 'analytics')).toBe(
          false
        )
      })

      it('should allow complete withdrawal', async () => {
        await consentManager.recordConsent('user123', [
          'message_storage',
          'embeddings',
          'analytics',
        ])
        await consentManager.withdrawConsent('user123')

        expect(
          await consentManager.hasConsent('user123', 'message_storage')
        ).toBe(false)
        expect(await consentManager.hasConsent('user123', 'embeddings')).toBe(
          false
        )
        expect(await consentManager.hasConsent('user123', 'analytics')).toBe(
          false
        )
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty purpose array', async () => {
      await consentManager.recordConsent('user123', [])

      expect(
        await consentManager.hasConsent('user123', 'message_storage')
      ).toBe(false)
    })

    it('should handle very long user IDs', async () => {
      const longUserId = 'user_' + 'a'.repeat(1000)
      await consentManager.recordConsent(longUserId, ['message_storage'])

      expect(
        await consentManager.hasConsent(longUserId, 'message_storage')
      ).toBe(true)
    })

    it('should handle special characters in user IDs', async () => {
      const specialUserId = 'user@example.com+test'
      await consentManager.recordConsent(specialUserId, ['message_storage'])

      expect(
        await consentManager.hasConsent(specialUserId, 'message_storage')
      ).toBe(true)
    })

    it('should handle concurrent consent operations', async () => {
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(
          consentManager.recordConsent(`user${i}`, ['message_storage'])
        )
      }

      await Promise.all(promises)

      const stats = consentManager.getConsentStats()
      expect(stats.totalUsers).toBe(10)
    })
  })

  describe('Performance', () => {
    it('should handle many consent records efficiently', async () => {
      const userCount = 100
      const start = Date.now()

      for (let i = 0; i < userCount; i++) {
        await consentManager.recordConsent(`user${i}`, ['message_storage'])
      }

      const duration = Date.now() - start
      expect(duration).toBeLessThan(5000) // Should complete in under 5 seconds
    })

    it('should query consent history efficiently', async () => {
      await consentManager.recordConsent('user123', ['message_storage'])
      for (let i = 0; i < 50; i++) {
        await consentManager.hasConsent('user123', 'message_storage')
      }

      const start = Date.now()
      const history = await consentManager.getConsentHistory('user123')
      const duration = Date.now() - start

      expect(history.length).toBeGreaterThan(0)
      expect(duration).toBeLessThan(1000) // Should complete in under 1 second
    })
  })
})
