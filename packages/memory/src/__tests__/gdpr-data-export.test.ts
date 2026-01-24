/**
 * GDPR Data Export Tests
 *
 * Comprehensive test coverage for GDPR Article 20 (Right to Data Portability).
 * Tests complete user data export in machine-readable formats.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import type {
  DataExportResult,
  DataExportOptions,
  MemoryItem,
} from '../types/memory'
import { InMemoryStore } from '../stores/in-memory'
import { ConsentManager } from '../consent/consent-manager'
import { AuditLogger } from '../audit/audit-logger'

/**
 * Mock implementation of user data export
 * This would be part of the MemoryService in a real implementation
 */
class UserDataExport {
  constructor(
    private store: InMemoryStore,
    private consentManager: ConsentManager,
    private auditLogger: AuditLogger
  ) {}

  /**
   * Export all user data (GDPR Article 20: Right to Data Portability)
   */
  async exportUserData(
    userId: string,
    options: DataExportOptions = {}
  ): Promise<DataExportResult> {
    const timestamp = new Date()
    const formatVersion = '1.0.0'

    // Defaults
    const exportOptions: Required<DataExportOptions> = {
      includeEmbeddings: options.includeEmbeddings ?? false,
      includeConsentHistory: options.includeConsentHistory ?? true,
      includeAuditTrail: options.includeAuditTrail ?? false,
      includeProfile: options.includeProfile ?? true,
      format: options.format ?? 'json',
      prettyPrint: options.prettyPrint ?? true,
    }

    try {
      // Log the export request
      await this.auditLogger.log({
        eventType: 'user:data:exported',
        severity: 'info',
        description: `User data export requested for user ${userId}`,
        metadata: {
          userId,
          legalBasis: 'consent',
          purpose: 'gdpr_right_to_data_portability',
          exportOptions,
        },
      })

      // Collect all user memories
      const memoryResults = await this.store.search('', {
        userId,
        limit: 10000,
        includeEmbeddings: exportOptions.includeEmbeddings,
      })

      const memories = memoryResults.map((r) => {
        const memory = { ...r.memory }
        // Remove embeddings if not requested
        if (!exportOptions.includeEmbeddings) {
          delete memory.embedding
        }
        return memory
      })

      // Get consent history
      const consentHistory = exportOptions.includeConsentHistory
        ? await this.consentManager.getConsentHistory(userId)
        : undefined

      // Get audit trail
      const auditTrail = exportOptions.includeAuditTrail
        ? await this.auditLogger.getUserAuditTrail(userId)
        : undefined

      // Calculate statistics
      const embeddingsCount = memories.filter((m) => m.embedding).length
      const dataSizeBytes = new Blob([
        JSON.stringify({
          memories,
          consentHistory,
          auditTrail,
        }),
      ]).size

      const result: DataExportResult = {
        userId,
        timestamp,
        formatVersion,
        data: {
          memories,
          consentHistory: consentHistory?.map((e) => ({
            type: e.type,
            purposes: e.purposes,
            timestamp: e.timestamp,
            version: e.version,
          })),
          auditTrail: auditTrail?.map((log) => ({
            eventType: log.eventType,
            timestamp: log.timestamp,
            description: log.description,
            metadata: log.metadata,
          })),
          profile: exportOptions.includeProfile ? {} : undefined,
        },
        summary: {
          memoriesCount: memories.length,
          embeddingsCount,
          dataSizeBytes,
          consentEventsCount: consentHistory?.length ?? 0,
          auditLogsCount: auditTrail?.length ?? 0,
        },
        options: exportOptions,
      }

      await this.auditLogger.log({
        eventType: 'user:data:exported',
        severity: 'info',
        description: `User data export completed for user ${userId}`,
        metadata: {
          userId,
          memoriesCount: memories.length,
          dataSizeBytes,
        },
      })

      return result
    } catch (error) {
      await this.auditLogger.log({
        eventType: 'user:data:exported',
        severity: 'error',
        description: `User data export failed for user ${userId}`,
        metadata: {
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
      throw error
    }
  }

  /**
   * Format export data as JSON or CSV
   */
  formatExport(result: DataExportResult): string {
    if (result.options.format === 'csv') {
      return this.formatAsCSV(result)
    }

    // JSON format
    return result.options.prettyPrint
      ? JSON.stringify(result, null, 2)
      : JSON.stringify(result)
  }

  /**
   * Format export data as CSV
   */
  private formatAsCSV(result: DataExportResult): string {
    const headers = [
      'id',
      'type',
      'scope',
      'content',
      'confidence',
      'priority',
      'createdAt',
      'updatedAt',
    ]

    const rows = result.data.memories.map((memory) => [
      memory.id,
      memory.type,
      memory.scope,
      memory.content.replace(/"/g, '""'), // Escape quotes
      memory.confidence,
      memory.priority,
      memory.createdAt.toISOString(),
      memory.updatedAt.toISOString(),
    ])

    return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')
  }
}

describe('GDPR Data Export', () => {
  let store: InMemoryStore
  let consentManager: ConsentManager
  let auditLogger: AuditLogger
  let dataExport: UserDataExport

  const createMemory = (userId: string, id: string): MemoryItem => ({
    id,
    content: `Test memory for ${userId}`,
    type: 'episodic',
    scope: 'user',
    metadata: { userId, topic: 'test' },
    embedding: [0.1, 0.2, 0.3],
    confidence: 0.8,
    priority: 'medium',
    tokens: 10,
    accessCount: 5,
    lastAccessed: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  beforeEach(() => {
    store = new InMemoryStore()
    consentManager = new ConsentManager(store, '1.0.0')
    auditLogger = new AuditLogger(store, { enabled: true })
    dataExport = new UserDataExport(store, consentManager, auditLogger)
  })

  describe('exportUserData', () => {
    it('should export all user memories', async () => {
      const userId = 'user123'

      await store.add(createMemory(userId, 'mem_1'))
      await store.add(createMemory(userId, 'mem_2'))
      await store.add(createMemory(userId, 'mem_3'))

      const result = await dataExport.exportUserData(userId)

      expect(result.data.memories).toHaveLength(3)
      expect(result.summary.memoriesCount).toBe(3)
    })

    it('should include user ID in export', async () => {
      const userId = 'user123'
      const result = await dataExport.exportUserData(userId)

      expect(result.userId).toBe(userId)
    })

    it('should include timestamp in export', async () => {
      const before = new Date()
      const result = await dataExport.exportUserData('user123')
      const after = new Date()

      expect(result.timestamp).toBeInstanceOf(Date)
      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      )
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('should include format version', async () => {
      const result = await dataExport.exportUserData('user123')

      expect(result.formatVersion).toBeDefined()
      expect(typeof result.formatVersion).toBe('string')
    })

    it('should exclude embeddings by default', async () => {
      const userId = 'user123'
      await store.add(createMemory(userId, 'mem_1'))

      const result = await dataExport.exportUserData(userId)

      expect(result.data.memories[0].embedding).toBeUndefined()
    })

    it('should include embeddings when requested', async () => {
      const userId = 'user123'
      await store.add(createMemory(userId, 'mem_1'))

      const result = await dataExport.exportUserData(userId, {
        includeEmbeddings: true,
      })

      expect(result.data.memories[0].embedding).toBeDefined()
      expect(result.summary.embeddingsCount).toBe(1)
    })

    it('should include consent history by default', async () => {
      const userId = 'user123'
      await consentManager.recordConsent(userId, ['message_storage'])

      const result = await dataExport.exportUserData(userId)

      expect(result.data.consentHistory).toBeDefined()
      expect(result.data.consentHistory?.length).toBeGreaterThan(0)
    })

    it('should exclude consent history when requested', async () => {
      const userId = 'user123'
      await consentManager.recordConsent(userId, ['message_storage'])

      const result = await dataExport.exportUserData(userId, {
        includeConsentHistory: false,
      })

      expect(result.data.consentHistory).toBeUndefined()
    })

    it('should exclude audit trail by default', async () => {
      const userId = 'user123'
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Test',
        metadata: { userId },
      })

      const result = await dataExport.exportUserData(userId)

      expect(result.data.auditTrail).toBeUndefined()
    })

    it('should include audit trail when requested', async () => {
      const userId = 'user123'
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Test',
        metadata: { userId },
      })

      const result = await dataExport.exportUserData(userId, {
        includeAuditTrail: true,
      })

      expect(result.data.auditTrail).toBeDefined()
      expect(result.data.auditTrail?.length).toBeGreaterThan(0)
    })

    it('should calculate data size in bytes', async () => {
      const userId = 'user123'
      await store.add(createMemory(userId, 'mem_1'))

      const result = await dataExport.exportUserData(userId)

      expect(result.summary.dataSizeBytes).toBeGreaterThan(0)
    })

    it('should include export options in result', async () => {
      const options: DataExportOptions = {
        includeEmbeddings: true,
        includeConsentHistory: true,
        format: 'json',
      }

      const result = await dataExport.exportUserData('user123', options)

      expect(result.options.includeEmbeddings).toBe(true)
      expect(result.options.includeConsentHistory).toBe(true)
      expect(result.options.format).toBe('json')
    })

    it('should not export other users data', async () => {
      await store.add(createMemory('user1', 'mem_1'))
      await store.add(createMemory('user2', 'mem_2'))

      const result = await dataExport.exportUserData('user1')

      expect(result.data.memories).toHaveLength(1)
      expect(result.data.memories[0].metadata.userId).toBe('user1')
    })

    it('should create audit trail for export', async () => {
      const userId = 'user123'
      await dataExport.exportUserData(userId)

      const auditTrail = await auditLogger.query({
        userId,
        eventType: 'user:data:exported',
      })

      expect(auditTrail.length).toBeGreaterThan(0)
    })

    it('should handle export of empty user data', async () => {
      const result = await dataExport.exportUserData('user_no_data')

      expect(result.data.memories).toHaveLength(0)
      expect(result.summary.memoriesCount).toBe(0)
    })
  })

  describe('formatExport', () => {
    let exportResult: DataExportResult

    beforeEach(async () => {
      const userId = 'user123'
      await store.add(createMemory(userId, 'mem_1'))
      exportResult = await dataExport.exportUserData(userId)
    })

    it('should format as JSON by default', () => {
      const formatted = dataExport.formatExport(exportResult)
      const parsed = JSON.parse(formatted)

      expect(parsed.userId).toBe('user123')
      expect(parsed.data.memories).toBeDefined()
    })

    it('should pretty print JSON when requested', async () => {
      const result = await dataExport.exportUserData('user123', {
        prettyPrint: true,
      })

      const formatted = dataExport.formatExport(result)

      expect(formatted).toContain('\n')
      expect(formatted).toContain('  ')
    })

    it('should minify JSON when requested', async () => {
      const result = await dataExport.exportUserData('user123', {
        prettyPrint: false,
      })

      const formatted = dataExport.formatExport(result)

      expect(formatted).not.toContain('\n  ')
    })

    it('should format as CSV when requested', async () => {
      const result = await dataExport.exportUserData('user123', {
        format: 'csv',
      })

      const formatted = dataExport.formatExport(result)

      expect(formatted).toContain('id,type,scope,content')
      expect(formatted.split('\n').length).toBeGreaterThan(1)
    })

    it('should escape quotes in CSV', async () => {
      const userId = 'user123'
      await store.add({
        ...createMemory(userId, 'mem_quote'),
        content: 'Content with "quotes"',
      })

      const result = await dataExport.exportUserData(userId, {
        format: 'csv',
      })

      const formatted = dataExport.formatExport(result)

      expect(formatted).toContain('""')
    })

    it('should include CSV headers', async () => {
      const result = await dataExport.exportUserData('user123', {
        format: 'csv',
      })

      const formatted = dataExport.formatExport(result)
      const lines = formatted.split('\n')

      expect(lines[0]).toContain('id')
      expect(lines[0]).toContain('type')
      expect(lines[0]).toContain('scope')
      expect(lines[0]).toContain('content')
    })
  })

  describe('GDPR Article 20 Compliance', () => {
    describe('Right to Data Portability Requirements', () => {
      it('should provide data in structured format', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        const result = await dataExport.exportUserData(userId)

        expect(result.data).toBeDefined()
        expect(result.data.memories).toBeDefined()
        expect(Array.isArray(result.data.memories)).toBe(true)
      })

      it('should provide data in machine-readable format', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        const result = await dataExport.exportUserData(userId)
        const formatted = dataExport.formatExport(result)

        // Should be valid JSON
        expect(() => JSON.parse(formatted)).not.toThrow()
      })

      it('should include all personal data categories', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))
        await consentManager.recordConsent(userId, ['message_storage'])

        const result = await dataExport.exportUserData(userId, {
          includeAuditTrail: true,
        })

        expect(result.data.memories).toBeDefined()
        expect(result.data.consentHistory).toBeDefined()
        expect(result.data.auditTrail).toBeDefined()
      })

      it('should transmit data without hindrance', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        // Export should complete successfully
        const result = await dataExport.exportUserData(userId)

        expect(result).toBeDefined()
        expect(result.data.memories.length).toBeGreaterThan(0)
      })

      it('should provide data in commonly used format', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        // Both JSON and CSV are commonly used
        const jsonResult = await dataExport.exportUserData(userId, {
          format: 'json',
        })
        const csvResult = await dataExport.exportUserData(userId, {
          format: 'csv',
        })

        expect(jsonResult.options.format).toBe('json')
        expect(csvResult.options.format).toBe('csv')
      })
    })

    describe('Data Completeness', () => {
      it('should export memories of all types', async () => {
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

        const result = await dataExport.exportUserData(userId)

        expect(result.data.memories).toHaveLength(3)
        const types = result.data.memories.map((m) => m.type)
        expect(types).toContain('episodic')
        expect(types).toContain('semantic')
        expect(types).toContain('profile')
      })

      it('should export memories from all scopes', async () => {
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

        const result = await dataExport.exportUserData(userId)

        expect(result.data.memories).toHaveLength(3)
        const scopes = result.data.memories.map((m) => m.scope)
        expect(scopes).toContain('session')
        expect(scopes).toContain('thread')
        expect(scopes).toContain('user')
      })

      it('should include all memory metadata', async () => {
        const userId = 'user123'
        await store.add({
          ...createMemory(userId, 'mem_1'),
          metadata: {
            userId,
            topic: 'test',
            keywords: ['key1', 'key2'],
            entities: ['entity1'],
          },
        })

        const result = await dataExport.exportUserData(userId)

        const memory = result.data.memories[0]
        expect(memory.metadata.topic).toBe('test')
        expect(memory.metadata.keywords).toEqual(['key1', 'key2'])
        expect(memory.metadata.entities).toEqual(['entity1'])
      })

      it('should include consent events', async () => {
        const userId = 'user123'
        await consentManager.recordConsent(userId, ['message_storage'])
        await consentManager.withdrawConsent(userId, 'message_storage')

        const result = await dataExport.exportUserData(userId)

        expect(result.data.consentHistory).toBeDefined()
        expect(result.data.consentHistory?.length).toBeGreaterThan(0)

        const eventTypes = result.data.consentHistory?.map((e) => e.type)
        expect(eventTypes).toContain('granted')
        expect(eventTypes).toContain('withdrawn')
      })
    })

    describe('Data Integrity', () => {
      it('should preserve data types in export', async () => {
        const userId = 'user123'
        const originalDate = new Date()
        await store.add({
          ...createMemory(userId, 'mem_1'),
          createdAt: originalDate,
        })

        const result = await dataExport.exportUserData(userId)

        expect(result.data.memories[0].confidence).toBe(0.8)
        expect(result.data.memories[0].tokens).toBe(10)
        expect(result.data.memories[0].accessCount).toBe(5)
      })

      it('should maintain data relationships', async () => {
        const userId = 'user123'
        const memory = createMemory(userId, 'mem_1')
        await store.add(memory)

        const result = await dataExport.exportUserData(userId)

        expect(result.data.memories[0].id).toBe(memory.id)
        expect(result.data.memories[0].metadata.userId).toBe(userId)
      })

      it('should provide accurate statistics', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))
        await store.add(createMemory(userId, 'mem_2'))
        await consentManager.recordConsent(userId, ['message_storage'])

        const result = await dataExport.exportUserData(userId, {
          includeEmbeddings: true,
        })

        expect(result.summary.memoriesCount).toBe(2)
        expect(result.summary.embeddingsCount).toBe(2)
        expect(result.summary.consentEventsCount).toBeGreaterThan(0)
      })
    })

    describe('Audit Requirements', () => {
      it('should log export requests', async () => {
        const userId = 'user123'
        await dataExport.exportUserData(userId)

        const logs = await auditLogger.query({
          userId,
          eventType: 'user:data:exported',
        })

        expect(logs.length).toBeGreaterThan(0)
      })

      it('should log export completion', async () => {
        const userId = 'user123'
        await store.add(createMemory(userId, 'mem_1'))

        await dataExport.exportUserData(userId)

        const logs = await auditLogger.query({
          userId,
          eventType: 'user:data:exported',
        })

        const completionLog = logs.find((log) =>
          log.description.includes('completed')
        )
        expect(completionLog).toBeDefined()
      })

      it('should include export metadata in audit log', async () => {
        const userId = 'user123'
        await dataExport.exportUserData(userId, {
          includeEmbeddings: true,
        })

        const logs = await auditLogger.query({
          userId,
          eventType: 'user:data:exported',
        })

        expect(logs[0].metadata.userId).toBe(userId)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle user with no data', async () => {
      const result = await dataExport.exportUserData('user_no_data')

      expect(result.data.memories).toHaveLength(0)
      expect(result.summary.memoriesCount).toBe(0)
    })

    it('should handle very long user IDs', async () => {
      const longUserId = 'user_' + 'a'.repeat(1000)
      await store.add(createMemory(longUserId, 'mem_1'))

      const result = await dataExport.exportUserData(longUserId)

      expect(result.userId).toBe(longUserId)
      expect(result.data.memories).toHaveLength(1)
    })

    it('should handle special characters in user ID', async () => {
      const specialUserId = 'user@example.com+test'
      await store.add(createMemory(specialUserId, 'mem_1'))

      const result = await dataExport.exportUserData(specialUserId)

      expect(result.userId).toBe(specialUserId)
      expect(result.data.memories).toHaveLength(1)
    })

    it('should handle large data exports', async () => {
      const userId = 'user123'

      for (let i = 0; i < 100; i++) {
        await store.add(createMemory(userId, `mem_${i}`))
      }

      const result = await dataExport.exportUserData(userId)

      expect(result.data.memories).toHaveLength(100)
      expect(result.summary.dataSizeBytes).toBeGreaterThan(0)
    })

    it('should handle memories with missing optional fields', async () => {
      const userId = 'user123'
      await store.add({
        ...createMemory(userId, 'mem_1'),
        embedding: undefined,
        importance: undefined,
        tags: undefined,
      })

      const result = await dataExport.exportUserData(userId)

      expect(result.data.memories).toHaveLength(1)
    })
  })

  describe('Performance', () => {
    it('should export data efficiently', async () => {
      const userId = 'user123'

      for (let i = 0; i < 50; i++) {
        await store.add(createMemory(userId, `mem_${i}`))
      }

      const start = Date.now()
      await dataExport.exportUserData(userId)
      const duration = Date.now() - start

      expect(duration).toBeLessThan(5000) // Should complete in under 5 seconds
    })

    it('should format exports efficiently', async () => {
      const userId = 'user123'

      for (let i = 0; i < 50; i++) {
        await store.add(createMemory(userId, `mem_${i}`))
      }

      const result = await dataExport.exportUserData(userId)

      const start = Date.now()
      dataExport.formatExport(result)
      const duration = Date.now() - start

      expect(duration).toBeLessThan(1000) // Should complete in under 1 second
    })
  })
})
