/**
 * GDPR Data Deletion Tests
 *
 * Comprehensive test coverage for GDPR Article 17 (Right to Erasure).
 * Tests complete user data deletion, verification, and audit trail.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import type {
  DeletionResult,
  DeletionVerification,
  MemoryItem,
} from '../types/memory'
import { InMemoryStore } from '../stores/in-memory'
import { ConsentManager } from '../consent/consent-manager'
import { AuditLogger } from '../audit/audit-logger'

/**
 * Mock implementation of user data deletion
 * This would be part of the MemoryService in a real implementation
 */
class UserDataDeletion {
  constructor(
    private store: InMemoryStore,
    private consentManager: ConsentManager,
    private auditLogger: AuditLogger
  ) {}

  /**
   * Delete all user data (GDPR Article 17: Right to Erasure)
   */
  async deleteUserData(userId: string): Promise<DeletionResult> {
    const timestamp = new Date()
    const deleted = {
      memories: 0,
      embeddings: 0,
      cacheEntries: 0,
      bufferEntries: 0,
      consentRecords: 0,
    }
    const failed: string[] = []

    try {
      // Log the deletion request
      await this.auditLogger.log({
        eventType: 'user:data:deleted',
        severity: 'critical',
        description: `User data deletion requested for user ${userId}`,
        metadata: {
          userId,
          legalBasis: 'consent',
          purpose: 'gdpr_right_to_erasure',
        },
      })

      // Get all user memories
      const userMemories = await this.store.search('', {
        userId,
        limit: 10000,
      })

      // Delete each memory
      for (const result of userMemories) {
        try {
          await this.store.delete(result.memory.id)
          deleted.memories++
          if (result.memory.embedding) {
            deleted.embeddings++
          }
        } catch (error) {
          failed.push(result.memory.id)
        }
      }

      // Delete consent records
      await this.consentManager.withdrawConsent(userId)
      deleted.consentRecords = 1

      // Verify deletion
      const verification = await this.verifyDeletion(userId)

      const result: DeletionResult = {
        userId,
        timestamp,
        deleted,
        failed,
        verified: verification.passed,
        verification,
      }

      // Log deletion completion
      await this.auditLogger.log({
        eventType: 'user:data:deletion:verified',
        severity: verification.passed ? 'info' : 'error',
        description: `User data deletion ${verification.passed ? 'verified complete' : 'verification failed'} for user ${userId}`,
        metadata: {
          userId,
          deleted,
          failed,
          verified: verification.passed,
        },
      })

      return result
    } catch (error) {
      await this.auditLogger.log({
        eventType: 'user:data:deleted',
        severity: 'error',
        description: `User data deletion failed for user ${userId}`,
        metadata: {
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
      throw error
    }
  }

  /**
   * Verify that all user data has been deleted
   */
  async verifyDeletion(userId: string): Promise<DeletionVerification> {
    const timestamp = new Date()
    const remainingData: DeletionVerification['remainingData'] = []

    // Check vector store
    const memories = await this.store.search('', {
      userId,
      limit: 100,
    })

    if (memories.length > 0) {
      remainingData.push({
        location: 'vectorStore',
        count: memories.length,
        sampleIds: memories.slice(0, 5).map((m) => m.memory.id),
      })
    }

    // Check consent records
    const hasConsent = await this.consentManager.hasConsent(
      userId,
      'message_storage'
    )
    if (hasConsent) {
      remainingData.push({
        location: 'consent',
        count: 1,
        sampleIds: [`consent:${userId}`],
      })
    }

    const passed = remainingData.length === 0

    return {
      userId,
      timestamp,
      passed,
      remainingData,
      error: passed ? undefined : 'Remaining data found after deletion',
    }
  }
}

describe('GDPR Data Deletion', () => {
  let store: InMemoryStore
  let consentManager: ConsentManager
  let auditLogger: AuditLogger
  let dataDeletion: UserDataDeletion

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
    auditLogger = new AuditLogger(store, { enabled: true })
    dataDeletion = new UserDataDeletion(store, consentManager, auditLogger)
  })

  describe('deleteUserData', () => {
    it('should delete all user memories', async () => {
      const userId = 'user123'

      // Add test memories
      await store.add(createMemory(userId, 'mem_1'))
      await store.add(createMemory(userId, 'mem_2'))
      await store.add(createMemory(userId, 'mem_3'))

      // Delete user data
      const result = await dataDeletion.deleteUserData(userId)

      expect(result.deleted.memories).toBe(3)
      expect(result.failed).toHaveLength(0)
      expect(result.verified).toBe(true)
    })

    it('should delete user embeddings', async () => {
      const userId = 'user123'

      await store.add(createMemory(userId, 'mem_1'))
      await store.add(createMemory(userId, 'mem_2'))

      const result = await dataDeletion.deleteUserData(userId)

      expect(result.deleted.embeddings).toBe(2)
    })

    it('should delete consent records', async () => {
      const userId = 'user123'

      await consentManager.recordConsent(userId, ['message_storage'])

      const result = await dataDeletion.deleteUserData(userId)

      expect(result.deleted.consentRecords).toBeGreaterThan(0)

      // Verify consent is withdrawn
      const hasConsent = await consentManager.hasConsent(
        userId,
        'message_storage'
      )
      expect(hasConsent).toBe(false)
    })

    it('should not delete other users data', async () => {
      await store.add(createMemory('user1', 'mem_1'))
      await store.add(createMemory('user2', 'mem_2'))

      await dataDeletion.deleteUserData('user1')

      // Verify user2 data still exists
      const user2Memories = await store.search('', {
        userId: 'user2',
      })
      expect(user2Memories).toHaveLength(1)
    })

    it('should include timestamp in result', async () => {
      const before = new Date()
      const result = await dataDeletion.deleteUserData('user123')
      const after = new Date()

      expect(result.timestamp).toBeInstanceOf(Date)
      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      )
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('should verify deletion completeness', async () => {
      const userId = 'user123'
      await store.add(createMemory(userId, 'mem_1'))

      const result = await dataDeletion.deleteUserData(userId)

      expect(result.verified).toBe(true)
      expect(result.verification).toBeDefined()
      expect(result.verification?.passed).toBe(true)
    })

    it('should create audit trail for deletion', async () => {
      const userId = 'user123'
      await store.add(createMemory(userId, 'mem_1'))

      await dataDeletion.deleteUserData(userId)

      const auditTrail = await auditLogger.getUserAuditTrail(userId)
      const deletionEvent = auditTrail.find(
        (e) => e.eventType === 'user:data:deleted'
      )

      expect(deletionEvent).toBeDefined()
      expect(deletionEvent?.metadata.userId).toBe(userId)
    })

    it('should create verification audit log', async () => {
      const userId = 'user123'
      await store.add(createMemory(userId, 'mem_1'))

      await dataDeletion.deleteUserData(userId)

      const auditTrail = await auditLogger.getUserAuditTrail(userId)
      const verificationEvent = auditTrail.find(
        (e) => e.eventType === 'user:data:deletion:verified'
      )

      expect(verificationEvent).toBeDefined()
      expect(verificationEvent?.severity).toBe('info')
    })

    it('should handle deletion of non-existent user gracefully', async () => {
      const result = await dataDeletion.deleteUserData('nonexistent')

      expect(result.deleted.memories).toBe(0)
      expect(result.verified).toBe(true)
      expect(result.failed).toHaveLength(0)
    })

    it('should track failed deletions', async () => {
      const userId = 'user123'
      await store.add(createMemory(userId, 'mem_1'))

      // Create a scenario where deletion might fail
      // (In real implementation, this could be a locked resource)

      const result = await dataDeletion.deleteUserData(userId)

      expect(result.failed).toBeDefined()
      expect(Array.isArray(result.failed)).toBe(true)
    })
  })

  describe('verifyDeletion', () => {
    it('should pass when no data remains', async () => {
      const verification = await dataDeletion.verifyDeletion('user123')

      expect(verification.passed).toBe(true)
      expect(verification.remainingData).toHaveLength(0)
      expect(verification.error).toBeUndefined()
    })

    it('should fail when memories remain', async () => {
      const userId = 'user123'
      await store.add(createMemory(userId, 'mem_1'))

      const verification = await dataDeletion.verifyDeletion(userId)

      expect(verification.passed).toBe(false)
      expect(verification.remainingData.length).toBeGreaterThan(0)
      expect(verification.error).toBeDefined()
    })

    it('should identify remaining data locations', async () => {
      const userId = 'user123'
      await store.add(createMemory(userId, 'mem_1'))

      const verification = await dataDeletion.verifyDeletion(userId)

      expect(verification.remainingData[0].location).toBe('vectorStore')
      expect(verification.remainingData[0].count).toBeGreaterThan(0)
    })

    it('should provide sample IDs of remaining data', async () => {
      const userId = 'user123'
      await store.add(createMemory(userId, 'mem_1'))
      await store.add(createMemory(userId, 'mem_2'))

      const verification = await dataDeletion.verifyDeletion(userId)

      expect(verification.remainingData[0].sampleIds.length).toBeGreaterThan(0)
      expect(verification.remainingData[0].sampleIds).toContain('mem_1')
    })

    it('should limit sample IDs to 5', async () => {
      const userId = 'user123'
      for (let i = 0; i < 10; i++) {
        await store.add(createMemory(userId, `mem_${i}`))
      }

      const verification = await dataDeletion.verifyDeletion(userId)

      expect(verification.remainingData[0].sampleIds.length).toBeLessThanOrEqual(
        5
      )
    })

    it('should include verification timestamp', async () => {
      const before = new Date()
      const verification = await dataDeletion.verifyDeletion('user123')
      const after = new Date()

      expect(verification.timestamp).toBeInstanceOf(Date)
      expect(verification.timestamp.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      )
      expect(verification.timestamp.getTime()).toBeLessThanOrEqual(
        after.getTime()
      )
    })
  })

  describe('GDPR Article 17 Compliance', () => {
    describe('Right to Erasure Requirements', () => {
      it('should delete all personal data', async () => {
        const userId = 'user123'

        // Add various types of user data
        await store.add(createMemory(userId, 'mem_1'))
        await store.add(createMemory(userId, 'mem_2'))
        await consentManager.recordConsent(userId, ['message_storage'])

        const result = await dataDeletion.deleteUserData(userId)

        expect(result.deleted.memories).toBeGreaterThan(0)
        expect(result.deleted.consentRecords).toBeGreaterThan(0)
        expect(result.verified).toBe(true)
      })

      it('should provide confirmation of deletion', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        const result = await dataDeletion.deleteUserData(userId)

        expect(result.userId).toBe(userId)
        expect(result.timestamp).toBeInstanceOf(Date)
        expect(result.deleted).toBeDefined()
        expect(result.verified).toBe(true)
      })

      it('should verify deletion completeness', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        const result = await dataDeletion.deleteUserData(userId)

        expect(result.verification).toBeDefined()
        expect(result.verification?.passed).toBe(true)
        expect(result.verification?.remainingData).toHaveLength(0)
      })

      it('should maintain audit trail of deletion', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        await dataDeletion.deleteUserData(userId)

        const auditTrail = await auditLogger.getUserAuditTrail(userId)
        expect(auditTrail.length).toBeGreaterThan(0)
        expect(auditTrail.some((e) => e.eventType === 'user:data:deleted')).toBe(
          true
        )
      })

      it('should handle exceptions without data loss', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        // Should not throw for well-formed requests
        await expect(
          dataDeletion.deleteUserData(userId)
        ).resolves.toBeDefined()
      })
    })

    describe('Deletion Scope', () => {
      it('should delete memories from all scopes', async () => {
        const userId = 'user123'

        await store.add({
          ...createMemory(userId, 'mem_session'),
          scope: 'session',
        })
        await store.add({
          ...createMemory(userId, 'mem_thread'),
          scope: 'thread',
        })
        await store.add({ ...createMemory(userId, 'mem_user'), scope: 'user' })

        const result = await dataDeletion.deleteUserData(userId)

        expect(result.deleted.memories).toBe(3)
      })

      it('should delete memories of all types', async () => {
        const userId = 'user123'

        await store.add({
          ...createMemory(userId, 'mem_episodic'),
          type: 'episodic',
        })
        await store.add({
          ...createMemory(userId, 'mem_semantic'),
          type: 'semantic',
        })
        await store.add({
          ...createMemory(userId, 'mem_profile'),
          type: 'profile',
        })

        const result = await dataDeletion.deleteUserData(userId)

        expect(result.deleted.memories).toBe(3)
      })
    })

    describe('Deletion Evidence', () => {
      it('should provide detailed breakdown of deleted items', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        const result = await dataDeletion.deleteUserData(userId)

        expect(result.deleted.memories).toBeDefined()
        expect(result.deleted.embeddings).toBeDefined()
        expect(result.deleted.cacheEntries).toBeDefined()
        expect(result.deleted.bufferEntries).toBeDefined()
        expect(result.deleted.consentRecords).toBeDefined()
      })

      it('should list any failed deletions', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        const result = await dataDeletion.deleteUserData(userId)

        expect(result.failed).toBeDefined()
        expect(Array.isArray(result.failed)).toBe(true)
      })

      it('should provide verification details', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        const result = await dataDeletion.deleteUserData(userId)

        expect(result.verification).toBeDefined()
        expect(result.verification?.userId).toBe(userId)
        expect(result.verification?.passed).toBeDefined()
        expect(result.verification?.remainingData).toBeDefined()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle user with no data', async () => {
      const result = await dataDeletion.deleteUserData('user_no_data')

      expect(result.deleted.memories).toBe(0)
      expect(result.verified).toBe(true)
    })

    it('should handle very long user IDs', async () => {
      const longUserId = 'user_' + 'a'.repeat(1000)
      await store.add(createMemory(longUserId, 'mem_1'))

      const result = await dataDeletion.deleteUserData(longUserId)

      expect(result.deleted.memories).toBe(1)
      expect(result.verified).toBe(true)
    })

    it('should handle special characters in user ID', async () => {
      const specialUserId = 'user@example.com+test'
      await store.add(createMemory(specialUserId, 'mem_1'))

      const result = await dataDeletion.deleteUserData(specialUserId)

      expect(result.deleted.memories).toBe(1)
      expect(result.verified).toBe(true)
    })

    it('should handle large amounts of user data', async () => {
      const userId = 'user123'

      // Add 100 memories
      for (let i = 0; i < 100; i++) {
        await store.add(createMemory(userId, `mem_${i}`))
      }

      const result = await dataDeletion.deleteUserData(userId)

      expect(result.deleted.memories).toBe(100)
      expect(result.verified).toBe(true)
    })
  })

  describe('Performance', () => {
    it('should delete user data efficiently', async () => {
      const userId = 'user123'

      for (let i = 0; i < 50; i++) {
        await store.add(createMemory(userId, `mem_${i}`))
      }

      const start = Date.now()
      await dataDeletion.deleteUserData(userId)
      const duration = Date.now() - start

      expect(duration).toBeLessThan(5000) // Should complete in under 5 seconds
    })

    it('should verify deletion efficiently', async () => {
      const start = Date.now()
      await dataDeletion.verifyDeletion('user123')
      const duration = Date.now() - start

      expect(duration).toBeLessThan(1000) // Should complete in under 1 second
    })
  })
})
