/**
 * Redis-backed Security Store for Horizontal Scaling
 *
 * Provides distributed security state management using Redis
 * for production deployments with multiple instances
 */

// Optional Redis import - falls back to in-memory if not available

let createClient: any = null

// Dynamic import for optional Redis dependency
const initRedis = async () => {
  try {
    const redis = await import('redis')
    createClient = redis.createClient
  } catch {
    console.warn(
      '[REDIS SECURITY STORE] Redis not available, using in-memory fallback'
    )
  }
}
initRedis()

import type { ThreatIntelligence } from './enhanced-security'

export interface SecurityStoreConfig {
  enabled: boolean
  redisUrl: string
  keyPrefix: string
  ttlSeconds: number
  cleanupInterval: number
}

export interface SecurityStoreData {
  rateLimitRequests: number[]
  threatIntelligence: ThreatIntelligence[]
  quarantineEvents: string[]
  auditLog: string[]
  lastUpdated: Date
}

/**
 * Redis-backed security store for distributed deployments
 * Falls back to in-memory storage if Redis is not available
 */
export class RedisSecurityStore {
  private client: any = null
  private isConnected = false
  private cleanupTimer: NodeJS.Timeout | null = null
  private fallbackStore: Map<string, SecurityStoreData> = new Map()

  constructor(private config: SecurityStoreConfig) {
    if (config.enabled && createClient) {
      this.initializeRedis()
    } else {
      console.log('[REDIS SECURITY STORE] Using in-memory fallback')
      this.isConnected = false
    }
  }

  private async initializeRedis(): Promise<void> {
    if (!createClient) {
      console.log(
        '[REDIS SECURITY STORE] Redis client not available, using in-memory fallback'
      )
      this.isConnected = false
      return
    }

    try {
      this.client = createClient({
        url: this.config.redisUrl,
        socket: {
          reconnectStrategy: (retries: number) => Math.min(retries * 50, 1000),
        },
      })

      this.client.on('error', (err: any) => {
        console.error('[REDIS SECURITY STORE] Error:', err)
        this.isConnected = false
      })

      this.client.on('connect', () => {
        console.log('[REDIS SECURITY STORE] Connected to Redis')
        this.isConnected = true
      })

      await this.client.connect()
      this.setupCleanup()
    } catch (error) {
      console.error('[REDIS SECURITY STORE] Failed to initialize:', error)
      this.isConnected = false
    }
  }

  /**
   * Store rate limit requests for a user/session
   */
  async storeRateLimitRequests(key: string, requests: number[]): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        const data = await this.getSecurityData(key)
        data.rateLimitRequests = requests
        data.lastUpdated = new Date()

        await this.setSecurityData(key, data)
      } catch (error) {
        console.error(
          '[REDIS SECURITY STORE] Failed to store rate limit requests:',
          error
        )
      }
    } else {
      // Fallback to in-memory storage
      const data = this.getFallbackSecurityData(key)
      data.rateLimitRequests = requests
      data.lastUpdated = new Date()
      this.fallbackStore.set(key, data)
    }
  }

  /**
   * Get rate limit requests for a user/session
   */
  async getRateLimitRequests(key: string): Promise<number[]> {
    try {
      const data = await this.getSecurityData(key)
      return data.rateLimitRequests
    } catch (error) {
      console.error(
        '[REDIS SECURITY STORE] Failed to get rate limit requests:',
        error
      )
      return []
    }
  }

  /**
   * Store threat intelligence data
   */
  async storeThreatIntelligence(
    key: string,
    threats: ThreatIntelligence[]
  ): Promise<void> {
    if (!this.isConnected) return

    try {
      const data = await this.getSecurityData(key)
      data.threatIntelligence = threats
      data.lastUpdated = new Date()

      await this.setSecurityData(key, data)
    } catch (error) {
      console.error(
        '[REDIS SECURITY STORE] Failed to store threat intelligence:',
        error
      )
    }
  }

  /**
   * Get threat intelligence data
   */
  async getThreatIntelligence(key: string): Promise<ThreatIntelligence[]> {
    if (!this.isConnected) return []

    try {
      const data = await this.getSecurityData(key)
      return data.threatIntelligence
    } catch (error) {
      console.error(
        '[REDIS SECURITY STORE] Failed to get threat intelligence:',
        error
      )
      return []
    }
  }

  /**
   * Add event to quarantine queue
   */
  async addToQuarantine(key: string, eventId: string): Promise<void> {
    if (!this.isConnected) return

    try {
      const data = await this.getSecurityData(key)
      data.quarantineEvents.push(eventId)
      data.lastUpdated = new Date()

      await this.setSecurityData(key, data)
    } catch (error) {
      console.error(
        '[REDIS SECURITY STORE] Failed to add to quarantine:',
        error
      )
    }
  }

  /**
   * Get quarantine events
   */
  async getQuarantineEvents(key: string): Promise<string[]> {
    if (!this.isConnected) return []

    try {
      const data = await this.getSecurityData(key)
      return data.quarantineEvents
    } catch (error) {
      console.error(
        '[REDIS SECURITY STORE] Failed to get quarantine events:',
        error
      )
      return []
    }
  }

  /**
   * Add event to audit log
   */
  async addToAuditLog(key: string, eventId: string): Promise<void> {
    if (!this.isConnected) return

    try {
      const data = await this.getSecurityData(key)
      data.auditLog.push(eventId)
      data.lastUpdated = new Date()

      await this.setSecurityData(key, data)
    } catch (error) {
      console.error('[REDIS SECURITY STORE] Failed to add to audit log:', error)
    }
  }

  /**
   * Get audit log events
   */
  async getAuditLogEvents(key: string): Promise<string[]> {
    if (!this.isConnected) return []

    try {
      const data = await this.getSecurityData(key)
      return data.auditLog
    } catch (error) {
      console.error(
        '[REDIS SECURITY STORE] Failed to get audit log events:',
        error
      )
      return []
    }
  }

  /**
   * Get fallback security data from in-memory store
   */
  private getFallbackSecurityData(key: string): SecurityStoreData {
    return this.fallbackStore.get(key) || this.getDefaultSecurityData()
  }

  /**
   * Set fallback security data in in-memory store
   */
  private setFallbackSecurityData(key: string, data: SecurityStoreData): void {
    this.fallbackStore.set(key, data)
  }

  /**
   * Get security data (Redis or fallback)
   */
  private async getSecurityData(key: string): Promise<SecurityStoreData> {
    if (this.isConnected && this.client) {
      // Try to get from Redis
      try {
        const redisKey = `${this.config.keyPrefix}:${key}`
        const data = await this.client.get(redisKey)

        if (data) {
          const parsed = JSON.parse(data) as SecurityStoreData
          // Convert date strings back to Date objects
          parsed.lastUpdated = new Date(parsed.lastUpdated)
          return parsed
        }
      } catch (error) {
        console.error(
          '[REDIS SECURITY STORE] Failed to get security data:',
          error
        )
      }
    }

    // Fallback to in-memory storage
    return this.getFallbackSecurityData(key)
  }

  /**
   * Set security data (Redis or fallback)
   */
  private async setSecurityData(
    key: string,
    data: SecurityStoreData
  ): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        const redisKey = `${this.config.keyPrefix}:${key}`
        const serialized = JSON.stringify(data)

        await this.client.setEx(redisKey, this.config.ttlSeconds, serialized)
        return
      } catch (error) {
        console.error(
          '[REDIS SECURITY STORE] Failed to set security data:',
          error
        )
      }
    }

    // Fallback to in-memory storage
    this.setFallbackSecurityData(key, data)
  }

  /**
   * Get default security data
   */
  private getDefaultSecurityData(): SecurityStoreData {
    return {
      rateLimitRequests: [],
      threatIntelligence: [],
      quarantineEvents: [],
      auditLog: [],
      lastUpdated: new Date(),
    }
  }

  /**
   * Setup periodic cleanup
   */
  private setupCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.performCleanup()
    }, this.config.cleanupInterval)
  }

  /**
   * Perform cleanup of expired data
   */
  private async performCleanup(): Promise<void> {
    if (!this.client || !this.isConnected) return

    try {
      // Clean up old data based on TTL
      const keys = await this.client.keys(`${this.config.keyPrefix}:*`)

      for (const key of keys) {
        const data = await this.client.get(key)
        if (data) {
          const parsed = JSON.parse(data) as SecurityStoreData
          const age = Date.now() - parsed.lastUpdated.getTime()

          if (age > this.config.ttlSeconds * 1000) {
            await this.client.del(key)
          }
        }
      }
    } catch (error) {
      console.error('[REDIS SECURITY STORE] Cleanup error:', error)
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }

    if (this.client && this.isConnected) {
      try {
        await this.client.disconnect()
        this.isConnected = false
        console.log('[REDIS SECURITY STORE] Disconnected from Redis')
      } catch (error) {
        console.error('[REDIS SECURITY STORE] Error disconnecting:', error)
      }
    }
  }

  /**
   * Check if Redis is connected
   */
  isRedisConnected(): boolean {
    return this.isConnected
  }
}

/**
 * Factory function to create security store
 */
export function createSecurityStore(
  config: Partial<SecurityStoreConfig> = {}
): RedisSecurityStore {
  const fullConfig: SecurityStoreConfig = {
    enabled: config.enabled ?? false,
    redisUrl: config.redisUrl ?? 'redis://localhost:6379',
    keyPrefix: config.keyPrefix ?? 'security',
    ttlSeconds: config.ttlSeconds ?? 3600, // 1 hour
    cleanupInterval: config.cleanupInterval ?? 300000, // 5 minutes
  }

  return new RedisSecurityStore(fullConfig)
}
