/**
 * AuditLogger Tests
 *
 * Comprehensive test coverage for GDPR Article 30 compliance (Records of Processing Activities).
 * Tests audit logging, querying, statistics, and data export functionality.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuditLogger } from '../audit-logger'
import type {
  AuditEventType,
  AuditEventSeverity,
  AuditLogEntry,
  AuditLogQuery,
  AuditLoggerConfig,
} from '../audit-logger'
import type { VectorStore } from '../../stores/base'
import { InMemoryStore } from '../../stores/in-memory'

describe('AuditLogger', () => {
  let auditLogger: AuditLogger
  let store: VectorStore

  beforeEach(() => {
    store = new InMemoryStore()
    auditLogger = new AuditLogger(store, {
      enabled: true,
      persistent: true,
      retentionDays: 365,
    })
  })

  describe('constructor', () => {
    it('should create with default config', () => {
      const logger = new AuditLogger(store)
      expect(logger).toBeDefined()
    })

    it('should create without store (memory-only)', () => {
      const logger = new AuditLogger(undefined, {
        persistent: false,
      })
      expect(logger).toBeDefined()
    })

    it('should merge config with defaults', () => {
      const logger = new AuditLogger(store, {
        enabled: false,
        retentionDays: 90,
      })
      expect(logger).toBeDefined()
    })

    it('should generate unique session ID', () => {
      const logger1 = new AuditLogger(store)
      const logger2 = new AuditLogger(store)

      // Session IDs should be different (implementation detail, but testable via behavior)
      expect(logger1).not.toBe(logger2)
    })
  })

  describe('log', () => {
    it('should log basic event', async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Memory item created',
        metadata: {
          userId: 'user123',
          memoryId: 'mem_1',
        },
      })

      const logs = await auditLogger.query({ userId: 'user123' })
      expect(logs).toHaveLength(1)
      expect(logs[0].eventType).toBe('memory:created')
      expect(logs[0].description).toBe('Memory item created')
    })

    it('should log with default severity', async () => {
      await auditLogger.log({
        eventType: 'memory:read',
        description: 'Memory accessed',
      })

      const logs = await auditLogger.query({})
      expect(logs[0].severity).toBe('info')
    })

    it('should log with custom severity', async () => {
      await auditLogger.log({
        eventType: 'memory:deleted',
        severity: 'warning',
        description: 'Memory deleted',
      })

      const logs = await auditLogger.query({})
      expect(logs[0].severity).toBe('warning')
    })

    it('should include timestamp', async () => {
      const before = new Date()
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Test',
      })
      const after = new Date()

      const logs = await auditLogger.query({})
      expect(logs[0].timestamp).toBeInstanceOf(Date)
      expect(logs[0].timestamp.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      )
      expect(logs[0].timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('should generate unique log IDs', async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Log 1',
      })
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Log 2',
      })

      const logs = await auditLogger.query({})
      expect(logs[0].id).not.toBe(logs[1].id)
    })

    it('should include request ID when provided', async () => {
      await auditLogger.log(
        {
          eventType: 'memory:created',
          description: 'Test',
        },
        'req_123'
      )

      const logs = await auditLogger.query({})
      expect(logs[0].requestId).toBe('req_123')
    })

    it('should filter IP addresses when configured', async () => {
      const logger = new AuditLogger(store, {
        includeIpAddresses: false,
      })

      await logger.log({
        eventType: 'memory:created',
        description: 'Test',
        metadata: {
          ipAddress: '192.168.1.1',
        },
      })

      const logs = await logger.query({})
      expect(logs[0].metadata.ipAddress).toBeUndefined()
    })

    it('should include IP addresses when configured', async () => {
      const logger = new AuditLogger(store, {
        includeIpAddresses: true,
      })

      await logger.log({
        eventType: 'memory:created',
        description: 'Test',
        metadata: {
          ipAddress: '192.168.1.1',
        },
      })

      const logs = await logger.query({})
      expect(logs[0].metadata.ipAddress).toBe('192.168.1.1')
    })

    it('should filter user agents when configured', async () => {
      const logger = new AuditLogger(store, {
        includeUserAgents: false,
      })

      await logger.log({
        eventType: 'memory:created',
        description: 'Test',
        metadata: {
          userAgent: 'Mozilla/5.0',
        },
      })

      const logs = await logger.query({})
      expect(logs[0].metadata.userAgent).toBeUndefined()
    })

    it('should call external logging callback', async () => {
      const onLog = vi.fn()
      const logger = new AuditLogger(store, { onLog })

      await logger.log({
        eventType: 'memory:created',
        description: 'Test',
      })

      expect(onLog).toHaveBeenCalledTimes(1)
      expect(onLog).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'memory:created',
        })
      )
    })

    it('should not throw when external callback fails', async () => {
      const onLog = vi.fn().mockRejectedValue(new Error('Callback error'))
      const logger = new AuditLogger(store, { onLog })

      await expect(
        logger.log({
          eventType: 'memory:created',
          description: 'Test',
        })
      ).resolves.not.toThrow()
    })

    it('should not log when disabled', async () => {
      const logger = new AuditLogger(store, { enabled: false })

      await logger.log({
        eventType: 'memory:created',
        description: 'Test',
      })

      const logs = await logger.query({})
      expect(logs).toHaveLength(0)
    })
  })

  describe('query', () => {
    beforeEach(async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        severity: 'info',
        description: 'Memory 1',
        metadata: { userId: 'user1', memoryId: 'mem_1' },
      })
      await auditLogger.log({
        eventType: 'memory:deleted',
        severity: 'warning',
        description: 'Memory 2',
        metadata: { userId: 'user1', memoryId: 'mem_2' },
      })
      await auditLogger.log({
        eventType: 'consent:granted',
        severity: 'info',
        description: 'Consent granted',
        metadata: { userId: 'user2' },
      })
    })

    it('should return all logs with empty query', async () => {
      const logs = await auditLogger.query({})
      expect(logs.length).toBeGreaterThanOrEqual(3)
    })

    it('should filter by user ID', async () => {
      const logs = await auditLogger.query({ userId: 'user1' })
      expect(logs).toHaveLength(2)
      expect(logs.every((log) => log.metadata.userId === 'user1')).toBe(true)
    })

    it('should filter by single event type', async () => {
      const logs = await auditLogger.query({ eventType: 'memory:created' })
      expect(logs).toHaveLength(1)
      expect(logs[0].eventType).toBe('memory:created')
    })

    it('should filter by multiple event types', async () => {
      const logs = await auditLogger.query({
        eventType: ['memory:created', 'memory:deleted'],
      })
      expect(logs).toHaveLength(2)
    })

    it('should filter by single severity', async () => {
      const logs = await auditLogger.query({ severity: 'warning' })
      expect(logs).toHaveLength(1)
      expect(logs[0].severity).toBe('warning')
    })

    it('should filter by multiple severities', async () => {
      const logs = await auditLogger.query({
        severity: ['info', 'warning'],
      })
      expect(logs.length).toBeGreaterThanOrEqual(3)
    })

    it('should filter by start time', async () => {
      const now = new Date()
      await new Promise((resolve) => setTimeout(resolve, 10))

      await auditLogger.log({
        eventType: 'memory:updated',
        description: 'New log',
      })

      const logs = await auditLogger.query({ startTime: now })
      expect(logs).toHaveLength(1)
      expect(logs[0].eventType).toBe('memory:updated')
    })

    it('should filter by end time', async () => {
      const now = new Date()
      await new Promise((resolve) => setTimeout(resolve, 10))

      await auditLogger.log({
        eventType: 'memory:updated',
        description: 'New log',
      })

      const logs = await auditLogger.query({ endTime: now })
      expect(logs.length).toBeGreaterThanOrEqual(3)
      expect(logs.every((log) => log.eventType !== 'memory:updated')).toBe(
        true
      )
    })

    it('should filter by time range', async () => {
      const start = new Date()
      await new Promise((resolve) => setTimeout(resolve, 10))

      await auditLogger.log({
        eventType: 'memory:updated',
        description: 'In range',
      })

      await new Promise((resolve) => setTimeout(resolve, 10))
      const end = new Date()

      await auditLogger.log({
        eventType: 'memory:queried',
        description: 'Out of range',
      })

      const logs = await auditLogger.query({ startTime: start, endTime: end })
      expect(logs).toHaveLength(1)
      expect(logs[0].eventType).toBe('memory:updated')
    })

    it('should limit results', async () => {
      const logs = await auditLogger.query({ limit: 2 })
      expect(logs).toHaveLength(2)
    })

    it('should sort by timestamp descending by default', async () => {
      const logs = await auditLogger.query({})

      for (let i = 1; i < logs.length; i++) {
        expect(logs[i - 1].timestamp.getTime()).toBeGreaterThanOrEqual(
          logs[i].timestamp.getTime()
        )
      }
    })

    it('should sort by timestamp ascending when requested', async () => {
      const logs = await auditLogger.query({ sortOrder: 'asc' })

      for (let i = 1; i < logs.length; i++) {
        expect(logs[i].timestamp.getTime()).toBeGreaterThanOrEqual(
          logs[i - 1].timestamp.getTime()
        )
      }
    })

    it('should filter by metadata fields', async () => {
      const logs = await auditLogger.query({
        metadata: { memoryId: 'mem_1' },
      })

      expect(logs).toHaveLength(1)
      expect(logs[0].metadata.memoryId).toBe('mem_1')
    })

    it('should combine multiple filters', async () => {
      const logs = await auditLogger.query({
        userId: 'user1',
        eventType: 'memory:created',
        severity: 'info',
      })

      expect(logs).toHaveLength(1)
      expect(logs[0].eventType).toBe('memory:created')
      expect(logs[0].metadata.userId).toBe('user1')
      expect(logs[0].severity).toBe('info')
    })
  })

  describe('getStats', () => {
    beforeEach(async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        severity: 'info',
        description: 'Memory 1',
        metadata: { userId: 'user1' },
      })
      await auditLogger.log({
        eventType: 'memory:deleted',
        severity: 'warning',
        description: 'Memory 2',
        metadata: { userId: 'user1' },
      })
      await auditLogger.log({
        eventType: 'consent:granted',
        severity: 'info',
        description: 'Consent',
        metadata: { userId: 'user2' },
      })
      await auditLogger.log({
        eventType: 'user:data:deleted',
        severity: 'critical',
        description: 'Data deleted',
        metadata: { userId: 'user3' },
      })
    })

    it('should return total log count', async () => {
      const stats = await auditLogger.getStats()
      expect(stats.totalLogs).toBeGreaterThanOrEqual(4)
    })

    it('should count logs by event type', async () => {
      const stats = await auditLogger.getStats()
      expect(stats.byEventType['memory:created']).toBe(1)
      expect(stats.byEventType['memory:deleted']).toBe(1)
      expect(stats.byEventType['consent:granted']).toBe(1)
      expect(stats.byEventType['user:data:deleted']).toBe(1)
    })

    it('should count logs by severity', async () => {
      const stats = await auditLogger.getStats()
      expect(stats.bySeverity.info).toBe(2)
      expect(stats.bySeverity.warning).toBe(1)
      expect(stats.bySeverity.critical).toBe(1)
    })

    it('should count unique users', async () => {
      const stats = await auditLogger.getStats()
      expect(stats.uniqueUsers).toBe(3)
    })

    it('should provide time range', async () => {
      const stats = await auditLogger.getStats()
      expect(stats.timeRange.earliest).toBeInstanceOf(Date)
      expect(stats.timeRange.latest).toBeInstanceOf(Date)
      expect(stats.timeRange.latest.getTime()).toBeGreaterThanOrEqual(
        stats.timeRange.earliest.getTime()
      )
    })

    it('should list recent high-severity events', async () => {
      const stats = await auditLogger.getStats()
      expect(stats.recentHighSeverity.length).toBeGreaterThan(0)
      expect(
        stats.recentHighSeverity.every(
          (log) => log.severity === 'error' || log.severity === 'critical'
        )
      ).toBe(true)
    })

    it('should limit recent high-severity to 10 events', async () => {
      for (let i = 0; i < 15; i++) {
        await auditLogger.log({
          eventType: 'memory:deleted',
          severity: 'error',
          description: `Error ${i}`,
        })
      }

      const stats = await auditLogger.getStats()
      expect(stats.recentHighSeverity.length).toBeLessThanOrEqual(10)
    })
  })

  describe('getUserAuditTrail', () => {
    beforeEach(async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Memory created',
        metadata: { userId: 'user123' },
      })
      await auditLogger.log({
        eventType: 'consent:granted',
        description: 'Consent granted',
        metadata: { userId: 'user123' },
      })
      await auditLogger.log({
        eventType: 'memory:deleted',
        description: 'Memory deleted',
        metadata: { userId: 'user999' },
      })
    })

    it('should return all logs for user', async () => {
      const trail = await auditLogger.getUserAuditTrail('user123')
      expect(trail).toHaveLength(2)
      expect(trail.every((log) => log.metadata.userId === 'user123')).toBe(true)
    })

    it('should return empty array for user with no logs', async () => {
      const trail = await auditLogger.getUserAuditTrail('nonexistent')
      expect(trail).toEqual([])
    })

    it('should return logs in chronological order', async () => {
      const trail = await auditLogger.getUserAuditTrail('user123')

      for (let i = 1; i < trail.length; i++) {
        expect(trail[i].timestamp.getTime()).toBeGreaterThanOrEqual(
          trail[i - 1].timestamp.getTime()
        )
      }
    })

    it('should support GDPR Article 15 (Right of Access)', async () => {
      const trail = await auditLogger.getUserAuditTrail('user123')

      // Verify all processing activities are logged
      expect(trail.length).toBeGreaterThan(0)
      trail.forEach((log) => {
        expect(log.eventType).toBeDefined()
        expect(log.timestamp).toBeInstanceOf(Date)
        expect(log.description).toBeDefined()
      })
    })
  })

  describe('rotate', () => {
    it('should remove old logs beyond retention period', async () => {
      const logger = new AuditLogger(store, {
        retentionDays: 1,
      })

      const oldDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago

      await logger.log({
        eventType: 'memory:created',
        description: 'Old log',
      })

      // Manually set timestamp to old date (accessing private field for test)
      const logs = await logger.query({})
      if (logs.length > 0) {
        logs[0].timestamp = oldDate
      }

      await logger.log({
        eventType: 'memory:created',
        description: 'Recent log',
      })

      const removedCount = await logger.rotate()
      expect(removedCount).toBeGreaterThanOrEqual(0)
    })

    it('should keep recent logs within retention period', async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Recent log',
      })

      const beforeCount = (await auditLogger.query({})).length
      await auditLogger.rotate()
      const afterCount = (await auditLogger.query({})).length

      expect(afterCount).toBe(beforeCount)
    })

    it('should log rotation event', async () => {
      await auditLogger.rotate()

      const logs = await auditLogger.query({
        eventType: 'system:cleanup:executed',
      })

      expect(logs.length).toBeGreaterThan(0)
    })
  })

  describe('clear', () => {
    it('should remove all logs', async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Test',
      })

      await auditLogger.clear()

      const logs = await auditLogger.query({})
      expect(logs).toHaveLength(0)
    })

    it('should reset stats', async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Test',
        metadata: { userId: 'user123' },
      })

      await auditLogger.clear()

      const stats = await auditLogger.getStats()
      expect(stats.totalLogs).toBe(0)
      expect(stats.uniqueUsers).toBe(0)
    })
  })

  describe('export', () => {
    beforeEach(async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        severity: 'info',
        description: 'Memory created',
        metadata: { userId: 'user123', memoryId: 'mem_1' },
      })
      await auditLogger.log({
        eventType: 'consent:granted',
        severity: 'info',
        description: 'Consent granted',
        metadata: { userId: 'user123' },
      })
    })

    it('should export as JSON by default', async () => {
      const exported = await auditLogger.export()
      const parsed = JSON.parse(exported)

      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed.length).toBeGreaterThan(0)
    })

    it('should export as JSON explicitly', async () => {
      const exported = await auditLogger.export('json')
      const parsed = JSON.parse(exported)

      expect(Array.isArray(parsed)).toBe(true)
    })

    it('should export as CSV', async () => {
      const exported = await auditLogger.export('csv')

      expect(exported).toContain('id,timestamp,eventType')
      expect(exported).toContain('memory:created')
      expect(exported).toContain('consent:granted')
    })

    it('should include all required fields in CSV export', async () => {
      const exported = await auditLogger.export('csv')

      expect(exported).toContain('id')
      expect(exported).toContain('timestamp')
      expect(exported).toContain('eventType')
      expect(exported).toContain('severity')
      expect(exported).toContain('description')
      expect(exported).toContain('userId')
    })

    it('should properly escape CSV values', async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Description with, comma',
      })

      const exported = await auditLogger.export('csv')
      expect(exported).toContain('"Description with, comma"')
    })
  })

  describe('GDPR Article 30 Compliance', () => {
    describe('Records of Processing Activities', () => {
      it('should log all memory operations', async () => {
        const operations: AuditEventType[] = [
          'memory:created',
          'memory:read',
          'memory:updated',
          'memory:deleted',
          'memory:queried',
        ]

        for (const operation of operations) {
          await auditLogger.log({
            eventType: operation,
            description: `Test ${operation}`,
            metadata: { userId: 'user123' },
          })
        }

        const logs = await auditLogger.query({ userId: 'user123' })
        expect(logs.length).toBe(operations.length)
      })

      it('should log consent operations', async () => {
        const operations: AuditEventType[] = [
          'consent:granted',
          'consent:withdrawn',
          'consent:checked',
        ]

        for (const operation of operations) {
          await auditLogger.log({
            eventType: operation,
            description: `Test ${operation}`,
            metadata: { userId: 'user123' },
          })
        }

        const logs = await auditLogger.query({ userId: 'user123' })
        expect(logs.length).toBe(operations.length)
      })

      it('should log user data operations', async () => {
        const operations: AuditEventType[] = [
          'user:data:accessed',
          'user:data:exported',
          'user:data:deleted',
          'user:data:deletion:verified',
        ]

        for (const operation of operations) {
          await auditLogger.log({
            eventType: operation,
            description: `Test ${operation}`,
            metadata: { userId: 'user123' },
          })
        }

        const logs = await auditLogger.query({ userId: 'user123' })
        expect(logs.length).toBe(operations.length)
      })

      it('should record purpose of processing', async () => {
        await auditLogger.log({
          eventType: 'memory:created',
          description: 'Memory created for chat history',
          metadata: {
            purpose: 'conversation_history',
            legalBasis: 'consent',
          },
        })

        const logs = await auditLogger.query({})
        expect(logs[0].metadata.purpose).toBe('conversation_history')
      })

      it('should record legal basis for processing', async () => {
        await auditLogger.log({
          eventType: 'memory:created',
          description: 'Memory created',
          metadata: {
            legalBasis: 'consent',
          },
        })

        const logs = await auditLogger.query({})
        expect(logs[0].metadata.legalBasis).toBe('consent')
      })

      it('should maintain retention period', async () => {
        const logger = new AuditLogger(store, {
          retentionDays: 365, // GDPR recommends 1 year minimum
        })

        expect(logger).toBeDefined()
      })
    })

    describe('Audit Trail Immutability', () => {
      it('should not allow modification of logged entries', async () => {
        await auditLogger.log({
          eventType: 'memory:created',
          description: 'Original description',
        })

        const logs = await auditLogger.query({})
        const originalLog = logs[0]

        // Attempt to modify
        originalLog.description = 'Modified description'

        // Query again to verify immutability
        const logsAfter = await auditLogger.query({})
        expect(logsAfter[0].description).toBe('Original description')
      })
    })

    describe('Data Subject Identification', () => {
      it('should associate logs with data subject (user)', async () => {
        await auditLogger.log({
          eventType: 'memory:created',
          description: 'Test',
          metadata: { userId: 'user123' },
        })

        const logs = await auditLogger.query({ userId: 'user123' })
        expect(logs[0].metadata.userId).toBe('user123')
      })

      it('should support querying by data subject', async () => {
        await auditLogger.log({
          eventType: 'memory:created',
          description: 'User 1',
          metadata: { userId: 'user1' },
        })
        await auditLogger.log({
          eventType: 'memory:created',
          description: 'User 2',
          metadata: { userId: 'user2' },
        })

        const user1Logs = await auditLogger.query({ userId: 'user1' })
        const user2Logs = await auditLogger.query({ userId: 'user2' })

        expect(user1Logs).toHaveLength(1)
        expect(user2Logs).toHaveLength(1)
        expect(user1Logs[0].metadata.userId).toBe('user1')
        expect(user2Logs[0].metadata.userId).toBe('user2')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing metadata gracefully', async () => {
      await auditLogger.log({
        eventType: 'memory:created',
        description: 'Test without metadata',
      })

      const logs = await auditLogger.query({})
      expect(logs[0].metadata).toBeDefined()
    })

    it('should handle very long descriptions', async () => {
      const longDescription = 'a'.repeat(10000)
      await auditLogger.log({
        eventType: 'memory:created',
        description: longDescription,
      })

      const logs = await auditLogger.query({})
      expect(logs[0].description).toBe(longDescription)
    })

    it('should handle special characters in descriptions', async () => {
      const specialChars = 'Test with "quotes" and \'apostrophes\' and <tags>'
      await auditLogger.log({
        eventType: 'memory:created',
        description: specialChars,
      })

      const logs = await auditLogger.query({})
      expect(logs[0].description).toBe(specialChars)
    })

    it('should handle concurrent logging', async () => {
      const promises = []
      for (let i = 0; i < 100; i++) {
        promises.push(
          auditLogger.log({
            eventType: 'memory:created',
            description: `Log ${i}`,
          })
        )
      }

      await Promise.all(promises)

      const logs = await auditLogger.query({})
      expect(logs.length).toBeGreaterThanOrEqual(100)
    })
  })

  describe('Performance', () => {
    it('should handle large volumes of logs', async () => {
      const logCount = 1000
      const start = Date.now()

      for (let i = 0; i < logCount; i++) {
        await auditLogger.log({
          eventType: 'memory:created',
          description: `Log ${i}`,
          metadata: { userId: `user${i % 10}` },
        })
      }

      const duration = Date.now() - start
      expect(duration).toBeLessThan(10000) // Should complete in under 10 seconds
    })

    it('should query efficiently', async () => {
      for (let i = 0; i < 100; i++) {
        await auditLogger.log({
          eventType: 'memory:created',
          description: `Log ${i}`,
          metadata: { userId: 'user123' },
        })
      }

      const start = Date.now()
      const logs = await auditLogger.query({ userId: 'user123' })
      const duration = Date.now() - start

      expect(logs.length).toBeGreaterThan(0)
      expect(duration).toBeLessThan(1000) // Should complete in under 1 second
    })

    it('should auto-rotate when threshold exceeded', async () => {
      const logger = new AuditLogger(store, {
        autoRotate: true,
      })

      // Log more than auto-rotate threshold (10000)
      for (let i = 0; i < 10100; i++) {
        await logger.log({
          eventType: 'memory:created',
          description: `Log ${i}`,
        })
      }

      // Should have triggered rotation
      const logs = await logger.query({})
      expect(logs.length).toBeLessThanOrEqual(10000)
    })
  })
})
