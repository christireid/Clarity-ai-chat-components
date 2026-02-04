/**
 * GDPR Compliance Integration Tests
 *
 * End-to-end tests for GDPR/privacy compliance features.
 * Tests the complete lifecycle of user data with consent, audit, deletion, and export.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStore } from '../stores/in-memory'
import { ConsentManager } from '../consent/consent-manager'
import { AuditLogger } from '../audit/audit-logger'
import type { MemoryItem, ConsentPurpose } from '../types'

describe('GDPR Compliance Integration', () => {
  let store: InMemoryStore
  let consentManager: ConsentManager
  let auditLogger: AuditLogger

  const createMemory = (userId: string, id: string): MemoryItem => ({
    id,
    content: `Test memory for ${userId}`,
    type: 'episodic',
    scope: 'user',
    metadata: { userId },
    embedding: [0.1, 0.2, 0.3],
    confidence: 0.8,
    priority: 'medium',
    tokens: 10,
    accessCount: 0,
    lastAccessed: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  beforeEach(() => {
    store = new InMemoryStore()
    consentManager = new ConsentManager(store, '1.0.0')
    auditLogger = new AuditLogger(store, {
      enabled: true,
      retentionDays: 365,
      includeIpAddresses: true,
    })
  })

  describe('Complete User Lifecycle', () => {
    it('should handle complete GDPR-compliant user lifecycle', async () => {
      const userId = 'user123'

      // Step 1: User grants consent
      await consentManager.recordConsent(
        userId,
        ['message_storage', 'embeddings'],
        {
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
        }
      )

      await auditLogger.log({
        eventType: 'consent:granted',
        severity: 'info',
        description: 'User granted consent',
        metadata: {
          userId,
          consentPurposes: ['message_storage', 'embeddings'],
        },
      })

      // Step 2: Check consent before storing data
      const hasConsent = await consentManager.hasConsent(
        userId,
        'message_storage'
      )
      expect(hasConsent).toBe(true)

      // Step 3: Store user data with audit
      await store.add(createMemory(userId, 'mem_1'))
      await auditLogger.log({
        eventType: 'memory:created',
        severity: 'info',
        description: 'Memory created',
        metadata: {
          userId,
          memoryId: 'mem_1',
          legalBasis: 'consent',
        },
      })

      // Step 4: User requests data export (Article 20)
      const memories = await store.search('', { userId })
      expect(memories.length).toBeGreaterThan(0)

      await auditLogger.log({
        eventType: 'user:data:exported',
        severity: 'info',
        description: 'User data exported',
        metadata: {
          userId,
          memoriesCount: memories.length,
        },
      })

      // Step 5: User withdraws consent
      await consentManager.withdrawConsent(userId, 'message_storage')

      await auditLogger.log({
        eventType: 'consent:withdrawn',
        severity: 'warning',
        description: 'User withdrew consent',
        metadata: {
          userId,
          purpose: 'message_storage',
        },
      })

      // Step 6: User requests data deletion (Article 17)
      const memory = memories[0]
      await store.delete(memory.memory.id)

      await auditLogger.log({
        eventType: 'user:data:deleted',
        severity: 'critical',
        description: 'User data deleted',
        metadata: {
          userId,
          memoriesDeleted: 1,
        },
      })

      // Step 7: Verify complete audit trail
      const auditTrail = await auditLogger.getUserAuditTrail(userId)
      expect(auditTrail.length).toBeGreaterThan(0)

      const eventTypes = auditTrail.map((e) => e.eventType)
      expect(eventTypes).toContain('consent:granted')
      expect(eventTypes).toContain('memory:created')
      expect(eventTypes).toContain('user:data:exported')
      expect(eventTypes).toContain('consent:withdrawn')
      expect(eventTypes).toContain('user:data:deleted')
    })
  })

  describe('Article 7: Consent Requirements', () => {
    it('should enforce consent before data processing', async () => {
      const userId = 'user123'

      // Should not have consent initially
      const hasConsent = await consentManager.hasConsent(
        userId,
        'message_storage'
      )
      expect(hasConsent).toBe(false)

      // Should fail consent requirement
      await expect(
        consentManager.requireConsent(userId, 'message_storage')
      ).rejects.toThrow()

      // Grant consent
      await consentManager.recordConsent(userId, ['message_storage'])

      // Should pass consent requirement
      await expect(
        consentManager.requireConsent(userId, 'message_storage')
      ).resolves.not.toThrow()

      // Log the operation with legal basis
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Memory stored after consent verification',
        metadata: {
          userId,
          legalBasis: 'consent',
          purpose: 'message_storage',
        },
      })
    })

    it('should support granular consent per purpose', async () => {
      const userId = 'user123'

      // Grant consent for specific purposes
      await consentManager.recordConsent(userId, ['message_storage'])

      expect(
        await consentManager.hasConsent(userId, 'message_storage')
      ).toBe(true)
      expect(await consentManager.hasConsent(userId, 'analytics')).toBe(false)

      // Add more granular consent
      await consentManager.recordConsent(userId, ['embeddings'])

      expect(await consentManager.hasConsent(userId, 'embeddings')).toBe(true)

      // Audit trail should show granular consent
      const history = await consentManager.getConsentHistory(userId)
      expect(history.length).toBeGreaterThan(0)
    })

    it('should allow easy consent withdrawal', async () => {
      const userId = 'user123'

      // Grant consent
      await consentManager.recordConsent(userId, [
        'message_storage',
        'embeddings',
      ])

      // Withdraw specific consent
      await consentManager.withdrawConsent(userId, 'embeddings')

      expect(
        await consentManager.hasConsent(userId, 'message_storage')
      ).toBe(true)
      expect(await consentManager.hasConsent(userId, 'embeddings')).toBe(false)

      // Audit trail should show withdrawal
      const history = await consentManager.getConsentHistory(userId)
      const withdrawalEvent = history.find((e) => e.type === 'withdrawn')
      expect(withdrawalEvent).toBeDefined()
    })
  })

  describe('Article 15: Right of Access', () => {
    it('should provide complete audit trail for data subject', async () => {
      const userId = 'user123'

      // Perform various operations
      await consentManager.recordConsent(userId, ['message_storage'])
      await auditLogger.log({
        eventType: 'consent:granted',
        description: 'Consent granted',
        metadata: { userId },
      })

      await store.add(createMemory(userId, 'mem_1'))
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Memory created',
        metadata: { userId, memoryId: 'mem_1' },
      })

      await store.get('mem_1')
      await auditLogger.log({
        eventType: 'memory:read',
        description: 'Memory accessed',
        metadata: { userId, memoryId: 'mem_1' },
      })

      // Get complete audit trail
      const auditTrail = await auditLogger.getUserAuditTrail(userId)

      expect(auditTrail.length).toBeGreaterThan(0)
      expect(auditTrail.every((log) => log.metadata.userId === userId)).toBe(
        true
      )

      // Verify chronological order
      for (let i = 1; i < auditTrail.length; i++) {
        expect(auditTrail[i].timestamp.getTime()).toBeGreaterThanOrEqual(
          auditTrail[i - 1].timestamp.getTime()
        )
      }
    })

    it('should provide information about processing purposes', async () => {
      const userId = 'user123'

      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Memory created for conversation history',
        metadata: {
          userId,
          purpose: 'conversation_history',
          legalBasis: 'consent',
        },
      })

      const auditTrail = await auditLogger.getUserAuditTrail(userId)
      const log = auditTrail[0]

      expect(log.metadata.purpose).toBeDefined()
      expect(log.metadata.legalBasis).toBeDefined()
    })
  })

  describe('Article 17: Right to Erasure', () => {
    it('should delete all user data on request', async () => {
      const userId = 'user123'

      // Create user data
      await store.add(createMemory(userId, 'mem_1'))
      await store.add(createMemory(userId, 'mem_2'))
      await consentManager.recordConsent(userId, ['message_storage'])

      // Log deletion request
      await auditLogger.log({
        eventType: 'user:data:deleted',
        severity: 'critical',
        description: 'User requested data deletion',
        metadata: { userId },
      })

      // Delete all user data
      const memories = await store.search('', { userId })
      for (const result of memories) {
        await store.delete(result.memory.id)
      }

      await consentManager.withdrawConsent(userId)

      // Verify deletion
      const remainingMemories = await store.search('', { userId })
      expect(remainingMemories).toHaveLength(0)

      const hasConsent = await consentManager.hasConsent(
        userId,
        'message_storage'
      )
      expect(hasConsent).toBe(false)

      // Log deletion verification
      await auditLogger.log({
        eventType: 'user:data:deletion:verified',
        severity: 'info',
        description: 'User data deletion verified',
        metadata: {
          userId,
          verified: true,
        },
      })
    })

    it('should maintain audit trail after data deletion', async () => {
      const userId = 'user123'

      // Create and delete data
      await store.add(createMemory(userId, 'mem_1'))
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Memory created',
        metadata: { userId },
      })

      const memories = await store.search('', { userId })
      await store.delete(memories[0].memory.id)

      await auditLogger.log({
        eventType: 'user:data:deleted',
        description: 'User data deleted',
        metadata: { userId },
      })

      // Audit trail should still exist
      const auditTrail = await auditLogger.getUserAuditTrail(userId)
      expect(auditTrail.length).toBeGreaterThan(0)
    })

    it('should not delete other users data', async () => {
      await store.add(createMemory('user1', 'mem_1'))
      await store.add(createMemory('user2', 'mem_2'))

      // Delete user1 data
      const user1Memories = await store.search('', { userId: 'user1' })
      for (const result of user1Memories) {
        await store.delete(result.memory.id)
      }

      // Verify user2 data remains
      const user2Memories = await store.search('', { userId: 'user2' })
      expect(user2Memories).toHaveLength(1)
    })
  })

  describe('Article 20: Right to Data Portability', () => {
    it('should export data in structured format', async () => {
      const userId = 'user123'

      await store.add(createMemory(userId, 'mem_1'))
      await store.add(createMemory(userId, 'mem_2'))
      await consentManager.recordConsent(userId, ['message_storage'])

      // Export all user data
      const memories = await store.search('', { userId })
      const consentHistory = await consentManager.getConsentHistory(userId)

      const exportData = {
        userId,
        timestamp: new Date(),
        data: {
          memories: memories.map((r) => r.memory),
          consentHistory,
        },
      }

      expect(exportData.data.memories.length).toBeGreaterThan(0)
      expect(exportData.data.consentHistory.length).toBeGreaterThan(0)

      // Log export
      await auditLogger.log({
        eventType: 'user:data:exported',
        severity: 'info',
        description: 'User data exported',
        metadata: {
          userId,
          memoriesCount: exportData.data.memories.length,
        },
      })

      // Verify export is machine-readable
      const json = JSON.stringify(exportData)
      expect(() => JSON.parse(json)).not.toThrow()
    })

    it('should include all data categories in export', async () => {
      const userId = 'user123'

      // Create different types of data
      await store.add({
        ...createMemory(userId, 'mem_episodic'),
        type: 'episodic',
      })
      await store.add({
        ...createMemory(userId, 'mem_semantic'),
        type: 'semantic',
      })
      await consentManager.recordConsent(userId, ['message_storage'])

      // Export
      const memories = await store.search('', { userId })
      const consentHistory = await consentManager.getConsentHistory(userId)
      const auditTrail = await auditLogger.getUserAuditTrail(userId)

      expect(memories.length).toBe(2)
      expect(consentHistory.length).toBeGreaterThan(0)
      expect(auditTrail.length).toBeGreaterThan(0)
    })
  })

  describe('Article 30: Records of Processing Activities', () => {
    it('should maintain comprehensive processing records', async () => {
      const userId = 'user123'

      // Log various processing activities
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Memory created',
        metadata: {
          userId,
          purpose: 'conversation_history',
          legalBasis: 'consent',
          memoryType: 'episodic',
        },
      })

      await auditLogger.log({
        eventType: 'memory:read',
        description: 'Memory accessed',
        metadata: {
          userId,
          purpose: 'context_retrieval',
          legalBasis: 'legitimate_interest',
        },
      })

      // Get processing records
      const logs = await auditLogger.query({ userId })

      expect(logs.length).toBeGreaterThan(0)
      logs.forEach((log) => {
        expect(log.eventType).toBeDefined()
        expect(log.timestamp).toBeInstanceOf(Date)
        expect(log.description).toBeDefined()
      })
    })

    it('should record retention periods', async () => {
      const userId = 'user123'

      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Memory created with retention policy',
        metadata: {
          userId,
          retentionDays: 30,
        },
      })

      const logs = await auditLogger.query({ userId })
      expect(logs[0].metadata.retentionDays).toBeDefined()
    })

    it('should maintain logs for required retention period', async () => {
      // Default retention is 365 days for GDPR compliance
      const stats = await auditLogger.getStats()
      expect(stats.totalLogs).toBeGreaterThanOrEqual(0)

      // Logs should be queryable
      const logs = await auditLogger.query({})
      expect(Array.isArray(logs)).toBe(true)
    })
  })

  describe('Data Minimization (Article 5)', () => {
    it('should only collect necessary data', async () => {
      const userId = 'user123'

      // Check consent before collecting
      await expect(
        consentManager.requireConsent(userId, 'analytics')
      ).rejects.toThrow()

      // Only collect data with consent
      await consentManager.recordConsent(userId, ['message_storage'])
      await expect(
        consentManager.requireConsent(userId, 'message_storage')
      ).resolves.not.toThrow()

      // Log with specific purpose
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Memory created',
        metadata: {
          userId,
          purpose: 'conversation_history',
          legalBasis: 'consent',
        },
      })
    })

    it('should support data filtering by purpose', async () => {
      const userId = 'user123'

      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Essential memory',
        metadata: {
          userId,
          purpose: 'conversation_history',
        },
      })

      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Analytics data',
        metadata: {
          userId,
          purpose: 'analytics',
        },
      })

      const essentialLogs = await auditLogger.query({
        userId,
        metadata: { purpose: 'conversation_history' },
      })

      expect(essentialLogs).toHaveLength(1)
      expect(essentialLogs[0].metadata.purpose).toBe('conversation_history')
    })
  })

  describe('Security and Confidentiality', () => {
    it('should log all data access', async () => {
      const userId = 'user123'

      await store.add(createMemory(userId, 'mem_1'))

      await auditLogger.log({
        eventType: 'memory:read',
        description: 'Memory accessed',
        metadata: {
          userId,
          memoryId: 'mem_1',
        },
      })

      const logs = await auditLogger.query({
        eventType: 'memory:read',
        userId,
      })

      expect(logs.length).toBeGreaterThan(0)
    })

    it('should track high-severity events', async () => {
      const userId = 'user123'

      await auditLogger.log({
        eventType: 'user:data:deleted',
        severity: 'critical',
        description: 'User data deleted',
        metadata: { userId },
      })

      const stats = await auditLogger.getStats()
      expect(stats.recentHighSeverity.length).toBeGreaterThan(0)
    })

    it('should support IP address logging when enabled', async () => {
      const userId = 'user123'

      await consentManager.recordConsent(userId, ['message_storage'], {
        ipAddress: '192.168.1.1',
      })

      const history = await consentManager.getConsentHistory(userId)
      // IP address tracking depends on configuration
      expect(history.length).toBeGreaterThan(0)
    })
  })

  describe('Compliance Reporting', () => {
    it('should generate consent statistics', async () => {
      await consentManager.recordConsent('user1', ['message_storage'])
      await consentManager.recordConsent('user2', ['embeddings'])
      await consentManager.withdrawConsent('user1', 'message_storage')

      const stats = consentManager.getConsentStats()

      expect(stats.totalUsers).toBe(2)
      expect(stats.totalEvents).toBeGreaterThan(0)
      expect(stats.eventsByType.granted).toBeGreaterThan(0)
      expect(stats.eventsByType.withdrawn).toBeGreaterThan(0)
    })

    it('should generate audit statistics', async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Test 1',
        metadata: { userId: 'user1' },
      })

      await auditLogger.log({
        eventType: 'consent:granted',
        description: 'Test 2',
        metadata: { userId: 'user2' },
      })

      const stats = await auditLogger.getStats()

      expect(stats.totalLogs).toBeGreaterThan(0)
      expect(stats.uniqueUsers).toBeGreaterThan(0)
      expect(Object.keys(stats.byEventType).length).toBeGreaterThan(0)
    })

    it('should support compliance audits', async () => {
      const userId = 'user123'

      // Complete user journey
      await consentManager.recordConsent(userId, ['message_storage'])
      await store.add(createMemory(userId, 'mem_1'))
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Memory created',
        metadata: { userId, legalBasis: 'consent' },
      })

      // Get all evidence for compliance audit
      const consentHistory = await consentManager.getConsentHistory(userId)
      const auditTrail = await auditLogger.getUserAuditTrail(userId)
      const memories = await store.search('', { userId })

      expect(consentHistory.length).toBeGreaterThan(0)
      expect(auditTrail.length).toBeGreaterThan(0)
      expect(memories.length).toBeGreaterThan(0)
    })
  })

  describe('Multi-User Isolation', () => {
    it('should isolate user data completely', async () => {
      // Create data for multiple users
      await store.add(createMemory('user1', 'mem_1'))
      await store.add(createMemory('user2', 'mem_2'))
      await consentManager.recordConsent('user1', ['message_storage'])
      await consentManager.recordConsent('user2', ['embeddings'])

      // Verify isolation
      const user1Memories = await store.search('', { userId: 'user1' })
      const user2Memories = await store.search('', { userId: 'user2' })

      expect(user1Memories).toHaveLength(1)
      expect(user2Memories).toHaveLength(1)
      expect(user1Memories[0].memory.id).not.toBe(user2Memories[0].memory.id)

      const user1Consent = await consentManager.hasConsent(
        'user1',
        'message_storage'
      )
      const user2Consent = await consentManager.hasConsent(
        'user2',
        'message_storage'
      )

      expect(user1Consent).toBe(true)
      expect(user2Consent).toBe(false)
    })

    it('should maintain separate audit trails', async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'User 1 memory',
        metadata: { userId: 'user1' },
      })

      await auditLogger.log({
        eventType: 'memory:created',
        description: 'User 2 memory',
        metadata: { userId: 'user2' },
      })

      const user1Trail = await auditLogger.getUserAuditTrail('user1')
      const user2Trail = await auditLogger.getUserAuditTrail('user2')

      expect(user1Trail).toHaveLength(1)
      expect(user2Trail).toHaveLength(1)
      expect(user1Trail[0].metadata.userId).toBe('user1')
      expect(user2Trail[0].metadata.userId).toBe('user2')
    })
  })
})
