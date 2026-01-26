/**
 * Consent Management System for GDPR/CCPA Compliance
 *
 * Provides consent tracking, withdrawal, and audit trail for memory operations.
 * Implements Article 7 (Conditions for consent) of GDPR.
 *
 * @module consent/consent-manager
 */

import type { VectorStore as Store, VectorStoreMatch } from '../types'

/**
 * Consent purpose types
 */
export type ConsentPurpose =
  | 'message_storage' // Storing chat messages
  | 'embeddings' // Creating embeddings for semantic search
  | 'analytics' // Analytics and usage data
  | 'personalization' // User personalization
  | 'all' // All purposes

/**
 * Consent event in audit trail
 */
export interface ConsentEvent {
  /** User ID */
  userId: string
  /** Event type */
  type: 'granted' | 'withdrawn' | 'checked'
  /** Consent purposes */
  purposes: ConsentPurpose[]
  /** Timestamp */
  timestamp: Date
  /** Consent version (for policy changes) */
  version: string
  /** Optional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Consent record stored in database
 */
export interface ConsentRecord {
  /** User ID */
  userId: string
  /** Granted purposes */
  purposes: ConsentPurpose[]
  /** When consent was granted */
  grantedAt: Date
  /** When consent was withdrawn (if applicable) */
  withdrawnAt?: Date
  /** Consent policy version */
  version: string
  /** Whether consent is currently active */
  active: boolean
  /** IP address (for audit trail) */
  ipAddress?: string
  /** User agent (for audit trail) */
  userAgent?: string
}

/**
 * Consent verification result
 */
export interface ConsentVerification {
  /** User ID */
  userId: string
  /** Purpose being checked */
  purpose: ConsentPurpose
  /** Whether consent exists */
  hasConsent: boolean
  /** When consent was granted (if exists) */
  grantedAt?: Date
  /** Consent version */
  version?: string
}

/**
 * Consent Manager - Handles user consent for data collection
 *
 * Implements GDPR Article 7 requirements:
 * - Consent must be freely given, specific, informed, and unambiguous
 * - Must be able to withdraw consent as easily as giving it
 * - Consent must be verifiable (audit trail)
 * - Separate consent required for different purposes
 *
 * @example
 * ```typescript
 * const consentManager = new ConsentManager(store, '1.0.0')
 *
 * // Grant consent
 * await consentManager.recordConsent('user123', ['message_storage', 'embeddings'], {
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...'
 * })
 *
 * // Check consent before operation
 * if (await consentManager.hasConsent('user123', 'message_storage')) {
 *   // Store message
 * }
 *
 * // Withdraw consent
 * await consentManager.withdrawConsent('user123', 'message_storage')
 *
 * // Get audit history
 * const history = await consentManager.getConsentHistory('user123')
 * ```
 */
export class ConsentManager {
  private store: Store
  private version: string
  private eventLog: ConsentEvent[] = []
  private consentCache: Map<string, ConsentRecord> = new Map()

  /**
   * Create a new ConsentManager
   *
   * @param store - Storage backend for consent records
   * @param version - Current consent policy version (e.g., '1.0.0')
   */
  constructor(store: Store, version: string = '1.0.0') {
    this.store = store
    this.version = version
  }

  /**
   * Record user consent for specific purposes
   *
   * GDPR Article 7 compliance:
   * - Records timestamp (demonstrable consent)
   * - Records version (policy changes tracking)
   * - Records purposes (granular consent)
   * - Creates audit trail
   *
   * @param userId - User identifier
   * @param purposes - Purposes user is consenting to
   * @param metadata - Optional metadata (IP, user agent, etc.)
   * @throws {Error} If storage fails
   */
  async recordConsent(
    userId: string,
    purposes: ConsentPurpose[],
    metadata?: { ipAddress?: string; userAgent?: string }
  ): Promise<void> {
    const now = new Date()

    // Create consent record
    const record: ConsentRecord = {
      userId,
      purposes,
      grantedAt: now,
      version: this.version,
      active: true,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    }

    // Store in database (using 'consent' scope)
    await this.store.add(
      {
        id: `consent:${userId}:${now.getTime()}`,
        content: JSON.stringify(record),
        embedding: [], // No embedding needed for consent records
        metadata: {
          type: 'consent',
          userId,
          purposes,
          version: this.version,
        },
        scope: 'global', // Consent is global
        // timestamp: now,
        type: 'procedural',
        confidence: 1.0,
        priority: 'critical',
        tokens: 0,
        accessCount: 0,
        lastAccessed: now,
        createdAt: now,
        updatedAt: now,
      }
      // 'consent'
    )

    // Update cache
    this.consentCache.set(userId, record)

    // Log event
    this.eventLog.push({
      userId,
      type: 'granted',
      purposes,
      timestamp: now,
      version: this.version,
      metadata,
    })

    if (process.env.NODE_ENV === 'development') {
      console.info(
        `[ConsentManager] Consent granted for user ${userId}:`,
        purposes
      )
    }
  }

  /**
   * Withdraw user consent for specific purpose(s)
   *
   * GDPR Article 7(3): "It shall be as easy to withdraw as to give consent"
   *
   * @param userId - User identifier
   * @param purpose - Specific purpose to withdraw, or undefined for all
   * @throws {Error} If storage fails
   */
  async withdrawConsent(
    userId: string,
    purpose?: ConsentPurpose
  ): Promise<void> {
    const now = new Date()

    // Get current consent record
    const currentConsent = await this.getConsentRecord(userId)

    if (!currentConsent || !currentConsent.active) {
      // No active consent to withdraw
      return
    }

    // Determine which purposes to withdraw
    const withdrawPurposes = purpose
      ? currentConsent.purposes.filter((p) => p === purpose)
      : currentConsent.purposes

    // Determine remaining purposes
    const remainingPurposes = purpose
      ? currentConsent.purposes.filter((p) => p !== purpose)
      : []

    // Mark old consent as withdrawn
    const withdrawnRecord: ConsentRecord = {
      ...currentConsent,
      withdrawnAt: now,
      active: remainingPurposes.length > 0,
      purposes: remainingPurposes,
    }

    // Store withdrawal record
    await this.store.add(
      {
        id: `consent:${userId}:withdrawal:${now.getTime()}`,
        content: JSON.stringify(withdrawnRecord),
        embedding: [],
        metadata: {
          type: 'consent_withdrawal',
          userId,
          withdrawnPurposes: withdrawPurposes,
          remainingPurposes,
          version: this.version,
        },
        scope: 'global',
        // timestamp: now,
        type: 'procedural',
        confidence: 1.0,
        priority: 'critical',
        tokens: 0,
        accessCount: 0,
        lastAccessed: now,
        createdAt: now,
        updatedAt: now,
      }
      // 'consent'
    )

    // Update cache
    if (remainingPurposes.length > 0) {
      this.consentCache.set(userId, withdrawnRecord)
    } else {
      this.consentCache.delete(userId)
    }

    // Log event
    this.eventLog.push({
      userId,
      type: 'withdrawn',
      purposes: withdrawPurposes,
      timestamp: now,
      version: this.version,
    })

    if (process.env.NODE_ENV === 'development') {
      console.info(
        `[ConsentManager] Consent withdrawn for user ${userId}:`,
        purpose || 'all purposes'
      )
    }
  }

  /**
   * Check if user has consent for specific purpose
   *
   * This should be called BEFORE every memory write operation.
   *
   * @param userId - User identifier
   * @param purpose - Purpose to check
   * @returns true if user has active consent for purpose
   */
  async hasConsent(userId: string, purpose: ConsentPurpose): Promise<boolean> {
    const record = await this.getConsentRecord(userId)

    if (!record || !record.active) {
      return false
    }

    // Check if purpose is included or if 'all' is granted
    const hasConsent =
      record.purposes.includes(purpose) || record.purposes.includes('all')

    // Log check (for audit trail)
    this.eventLog.push({
      userId,
      type: 'checked',
      purposes: [purpose],
      timestamp: new Date(),
      version: this.version,
      metadata: { result: hasConsent },
    })

    return hasConsent
  }

  /**
   * Get verification details for user consent
   *
   * @param userId - User identifier
   * @param purpose - Purpose to verify
   * @returns Detailed verification result
   */
  async verifyConsent(
    userId: string,
    purpose: ConsentPurpose
  ): Promise<ConsentVerification> {
    const record = await this.getConsentRecord(userId)
    const hasConsent = await this.hasConsent(userId, purpose)

    return {
      userId,
      purpose,
      hasConsent,
      grantedAt: record?.grantedAt,
      version: record?.version,
    }
  }

  /**
   * Get consent history (audit trail) for user
   *
   * Returns chronological list of all consent events.
   * Required for GDPR audit compliance.
   *
   * @param userId - User identifier
   * @returns Array of consent events
   */
  async getConsentHistory(userId: string): Promise<ConsentEvent[]> {
    // Filter event log for this user
    const userEvents = this.eventLog.filter((event) => event.userId === userId)

    // Also fetch from persistent storage
    try {
      const records = await this.store.query({
        vector: [], // Audit logs don't use vectors for query
        filter: {
          userId,
          type: { $in: ['consent', 'consent_withdrawal'] },
        },
        topK: 100,
      })

      // Parse stored events
      const storedEvents: ConsentEvent[] = records.map(
        (record: VectorStoreMatch) => ({
          userId: record.metadata?.userId as string,
          type:
            record.metadata?.type === 'consent_withdrawal'
              ? ('withdrawn' as const)
              : ('granted' as const),
          purposes: (record.metadata?.purposes || []) as ConsentPurpose[],
          timestamp: new Date(record.metadata?.timestamp as string),
          version: (record.metadata?.version as string) || '1.0.0',
        })
      )

      // Merge and deduplicate
      const allEvents = [...storedEvents, ...userEvents]
      const uniqueEvents = allEvents.filter(
        (event, index, self) =>
          index ===
          self.findIndex(
            (e) => e.timestamp.getTime() === event.timestamp.getTime()
          )
      )

      // Sort by timestamp (oldest first)
      return uniqueEvents.sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      )
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ConsentManager] Error fetching consent history:', error)
      }
      return userEvents
    }
  }

  /**
   * Get current active consent record for user
   *
   * @param userId - User identifier
   * @returns Current consent record or null
   */
  private async getConsentRecord(
    userId: string
  ): Promise<ConsentRecord | null> {
    // Check cache first
    if (this.consentCache.has(userId)) {
      return this.consentCache.get(userId)!
    }

    // Fetch from storage
    try {
      const records = await this.store.query({
        vector: [],
        filter: {
          userId,
          type: 'consent',
        },
        topK: 1,
        // sortBy: 'timestamp', // VectorStoreQuery doesn't support sortBy
        // sortOrder: 'desc',
      })

      if (records.length === 0) {
        return null
      }

      const content = records[0].metadata?.content as string
      if (!content) return null

      const record = JSON.parse(content) as ConsentRecord
      record.grantedAt = new Date(record.grantedAt) // Parse date
      if (record.withdrawnAt) {
        record.withdrawnAt = new Date(record.withdrawnAt)
      }

      // Update cache
      if (record.active) {
        this.consentCache.set(userId, record)
      }

      return record
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ConsentManager] Error fetching consent record:', error)
      }
      return null
    }
  }

  /**
   * Check if consent is required before operation
   *
   * Helper method to ensure GDPR compliance.
   *
   * @param userId - User identifier
   * @param purpose - Purpose of operation
   * @throws {Error} If consent is not granted
   */
  async requireConsent(userId: string, purpose: ConsentPurpose): Promise<void> {
    const hasConsent = await this.hasConsent(userId, purpose)

    if (!hasConsent) {
      throw new Error(
        `[ConsentManager] Consent required: User ${userId} has not granted consent for '${purpose}'. ` +
          `Operation blocked for GDPR compliance.`
      )
    }
  }

  /**
   * Clear all consent data (for testing)
   *
   * WARNING: Only use in test environments!
   */
  async clearAllConsent(): Promise<void> {
    this.consentCache.clear()
    this.eventLog = []
    if (process.env.NODE_ENV === 'development') {
      console.warn('[ConsentManager] All consent data cleared')
    }
  }

  /**
   * Get consent statistics
   *
   * Useful for compliance reporting.
   *
   * @returns Statistics about consent
   */
  getConsentStats(): {
    totalUsers: number
    totalEvents: number
    eventsByType: Record<string, number>
  } {
    const uniqueUsers = new Set(this.eventLog.map((e) => e.userId))

    const eventsByType = this.eventLog.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      totalUsers: uniqueUsers.size,
      totalEvents: this.eventLog.length,
      eventsByType,
    }
  }
}
