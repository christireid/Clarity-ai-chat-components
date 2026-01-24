/**
 * GDPR Test Helpers
 *
 * Factory functions and utilities for creating test data in GDPR/privacy tests.
 * Provides consistent test data generation across all test suites.
 */

import type {
  MemoryItem,
  MemoryType,
  MemoryScope,
  MemoryPriority,
} from '../../types/memory'
import type { ConsentPurpose } from '../../consent/consent-manager'
import type {
  AuditEventType,
  AuditEventSeverity,
} from '../../audit/audit-logger'

/**
 * Test user factory
 */
export const createTestUser = (id?: string) => {
  const userId = id || `user_${Date.now()}_${Math.random().toString(36).slice(2)}`
  return {
    id: userId,
    email: `${userId}@example.com`,
    name: `Test User ${userId}`,
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Test)',
  }
}

/**
 * Test memory factory
 */
export const createTestMemory = (
  userId: string,
  overrides: Partial<MemoryItem> = {}
): MemoryItem => {
  const id = overrides.id || `mem_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const now = new Date()

  return {
    id,
    content: `Test memory content for ${userId}`,
    type: 'episodic',
    scope: 'user',
    metadata: {
      userId,
      topic: 'test',
      keywords: ['test', 'memory'],
    },
    embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
    confidence: 0.8,
    priority: 'medium',
    tokens: 10,
    accessCount: 0,
    lastAccessed: now,
    createdAt: now,
    updatedAt: now,
    timestamp: now,
    ...overrides,
  }
}

/**
 * Create multiple test memories for a user
 */
export const createTestMemories = (
  userId: string,
  count: number,
  overrides: Partial<MemoryItem> = {}
): MemoryItem[] => {
  return Array.from({ length: count }, (_, i) =>
    createTestMemory(userId, {
      id: `mem_${i}`,
      content: `Test memory ${i} for ${userId}`,
      ...overrides,
    })
  )
}

/**
 * Create test memories with different types
 */
export const createTestMemoriesByType = (
  userId: string
): Record<MemoryType, MemoryItem> => {
  const types: MemoryType[] = [
    'episodic',
    'semantic',
    'procedural',
    'short-term',
    'profile',
  ]

  return types.reduce(
    (acc, type) => {
      acc[type] = createTestMemory(userId, {
        id: `mem_${type}`,
        type,
        content: `Test ${type} memory for ${userId}`,
      })
      return acc
    },
    {} as Record<MemoryType, MemoryItem>
  )
}

/**
 * Create test memories with different scopes
 */
export const createTestMemoriesByScope = (
  userId: string
): Record<MemoryScope, MemoryItem> => {
  const scopes: MemoryScope[] = ['session', 'thread', 'global', 'user']

  return scopes.reduce(
    (acc, scope) => {
      acc[scope] = createTestMemory(userId, {
        id: `mem_${scope}`,
        scope,
        content: `Test ${scope} memory for ${userId}`,
      })
      return acc
    },
    {} as Record<MemoryScope, MemoryItem>
  )
}

/**
 * Create test memories with different priorities
 */
export const createTestMemoriesByPriority = (
  userId: string
): Record<MemoryPriority, MemoryItem> => {
  const priorities: MemoryPriority[] = ['critical', 'high', 'medium', 'low']

  return priorities.reduce(
    (acc, priority) => {
      acc[priority] = createTestMemory(userId, {
        id: `mem_${priority}`,
        priority,
        content: `Test ${priority} priority memory for ${userId}`,
      })
      return acc
    },
    {} as Record<MemoryPriority, MemoryItem>
  )
}

/**
 * Consent test data factory
 */
export const createTestConsentData = (userId: string) => {
  const allPurposes: ConsentPurpose[] = [
    'message_storage',
    'embeddings',
    'analytics',
    'personalization',
  ]

  return {
    userId,
    purposes: allPurposes,
    metadata: {
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Test)',
    },
    version: '1.0.0',
  }
}

/**
 * Create test consent for specific purposes
 */
export const createTestConsentForPurposes = (
  userId: string,
  purposes: ConsentPurpose[]
) => {
  return {
    userId,
    purposes,
    metadata: {
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Test)',
    },
    version: '1.0.0',
  }
}

/**
 * Audit log test data factory
 */
export const createTestAuditLog = (
  userId: string,
  eventType: AuditEventType,
  overrides: {
    severity?: AuditEventSeverity
    description?: string
    metadata?: Record<string, unknown>
  } = {}
) => {
  return {
    eventType,
    severity: overrides.severity || 'info',
    description:
      overrides.description || `Test ${eventType} event for ${userId}`,
    metadata: {
      userId,
      ...overrides.metadata,
    },
  }
}

/**
 * Create test audit logs for all event types
 */
export const createTestAuditLogs = (userId: string) => {
  const eventTypes: AuditEventType[] = [
    'memory:created',
    'memory:read',
    'memory:updated',
    'memory:deleted',
    'memory:queried',
    'consent:granted',
    'consent:withdrawn',
    'consent:checked',
    'user:data:accessed',
    'user:data:exported',
    'user:data:deleted',
    'user:data:deletion:verified',
  ]

  return eventTypes.map((eventType) =>
    createTestAuditLog(userId, eventType)
  )
}

/**
 * Wait for specified milliseconds (for timing tests)
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Create a batch of test data for performance testing
 */
export const createLargeDataset = (
  userCount: number,
  memoriesPerUser: number
) => {
  const users: string[] = []
  const memories: MemoryItem[] = []

  for (let i = 0; i < userCount; i++) {
    const userId = `user_${i}`
    users.push(userId)

    for (let j = 0; j < memoriesPerUser; j++) {
      memories.push(
        createTestMemory(userId, {
          id: `mem_${i}_${j}`,
          content: `Memory ${j} for user ${i}`,
        })
      )
    }
  }

  return { users, memories }
}

/**
 * Generate random user ID
 */
export const randomUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Generate random memory ID
 */
export const randomMemoryId = (): string => {
  return `mem_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Create expired memory (for deletion testing)
 */
export const createExpiredMemory = (
  userId: string,
  daysAgo: number
): MemoryItem => {
  const expiredDate = new Date()
  expiredDate.setDate(expiredDate.getDate() - daysAgo)

  return createTestMemory(userId, {
    createdAt: expiredDate,
    updatedAt: expiredDate,
    timestamp: expiredDate,
    expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
  })
}

/**
 * Assert memory belongs to user
 */
export const assertMemoryBelongsToUser = (
  memory: MemoryItem,
  userId: string
): boolean => {
  return memory.metadata?.userId === userId
}

/**
 * Assert memories are isolated per user
 */
export const assertUserDataIsolation = (
  memories: MemoryItem[],
  userId: string
): boolean => {
  return memories.every((m) => assertMemoryBelongsToUser(m, userId))
}

/**
 * Create test data for GDPR compliance scenarios
 */
export const createGDPRTestScenario = (userId: string) => {
  return {
    user: createTestUser(userId),
    memories: createTestMemories(userId, 5),
    consent: createTestConsentData(userId),
    auditLogs: createTestAuditLogs(userId),
  }
}

/**
 * Create test data for multi-user scenarios
 */
export const createMultiUserTestScenario = (userCount: number) => {
  const scenarios: ReturnType<typeof createGDPRTestScenario>[] = []

  for (let i = 0; i < userCount; i++) {
    const userId = `user_${i}`
    scenarios.push(createGDPRTestScenario(userId))
  }

  return scenarios
}

/**
 * Verify deletion result
 */
export const verifyDeletionComplete = (result: {
  deleted: {
    memories: number
    embeddings: number
    consentRecords: number
    cacheEntries: number
    bufferEntries: number
  }
  failed: string[]
  verified: boolean
}): boolean => {
  return (
    result.failed.length === 0 &&
    result.verified === true &&
    result.deleted.memories >= 0
  )
}

/**
 * Verify export result
 */
export const verifyExportComplete = (result: {
  userId: string
  data: {
    memories: MemoryItem[]
    consentHistory?: unknown[]
    auditTrail?: unknown[]
  }
  summary: {
    memoriesCount: number
    embeddingsCount: number
    dataSizeBytes: number
  }
}): boolean => {
  return (
    result.userId !== '' &&
    result.data.memories.length === result.summary.memoriesCount &&
    result.summary.dataSizeBytes > 0
  )
}

/**
 * Create memory with large content (for testing token limits)
 */
export const createLargeMemory = (
  userId: string,
  sizeInChars: number
): MemoryItem => {
  const content = 'a'.repeat(sizeInChars)
  const tokens = Math.ceil(sizeInChars / 4) // Approximate GPT-4 tokenization

  return createTestMemory(userId, {
    content,
    tokens,
  })
}

/**
 * Create memory with specific metadata
 */
export const createMemoryWithMetadata = (
  userId: string,
  metadata: Record<string, unknown>
): MemoryItem => {
  return createTestMemory(userId, {
    metadata: {
      userId,
      ...metadata,
    },
  })
}

/**
 * Time a function execution (for performance testing)
 */
export const timeExecution = async <T>(
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> => {
  const start = Date.now()
  const result = await fn()
  const duration = Date.now() - start

  return { result, duration }
}

/**
 * Assert execution time is within limit
 */
export const assertExecutionTime = (
  duration: number,
  maxMs: number
): boolean => {
  return duration <= maxMs
}

/**
 * Create test memories with embeddings
 */
export const createMemoriesWithEmbeddings = (
  userId: string,
  count: number,
  dimensions: number = 5
): MemoryItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const embedding = Array.from({ length: dimensions }, (_, j) =>
      Math.random()
    )
    return createTestMemory(userId, {
      id: `mem_${i}`,
      embedding,
    })
  })
}

/**
 * Create test memories without embeddings (for export testing)
 */
export const createMemoriesWithoutEmbeddings = (
  userId: string,
  count: number
): MemoryItem[] => {
  return Array.from({ length: count }, (_, i) =>
    createTestMemory(userId, {
      id: `mem_${i}`,
      embedding: undefined,
    })
  )
}
