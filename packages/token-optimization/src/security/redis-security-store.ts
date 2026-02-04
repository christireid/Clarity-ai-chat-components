/**
 * Redis-backed Security Store for Horizontal Scaling
 *
 * Provides distributed security state management using Redis
 * for production deployments with multiple instances
 */

// Optional Redis import - falls back to in-memory if not available
// Redis is an optional peer dependency - consumers install it only if needed

/**
 * Redis client interface for type safety
 */
interface RedisClientLike {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  quit: () => Promise<void>
  get: (key: string) => Promise<string | null>
  set: (
    key: string,
    value: string,
    options?: { EX?: number }
  ) => Promise<string | null>
  setEx: (key: string, seconds: number, value: string) => Promise<string | null>
  del: (key: string) => Promise<number>
  keys: (pattern: string) => Promise<string[]>
  on: (event: string, callback: (arg: unknown) => void) => void
}

/**
 * Redis createClient function type
 */
type CreateClientFn = (options: {
  url: string
  socket?: { reconnectStrategy?: (retries: number) => number }
}) => RedisClientLike

let createClient: CreateClientFn | null = null

// Dynamic import for optional Redis dependency
const initRedis = async () => {
  try {
    // @ts-expect-error - redis is an optional peer dependency
    const redis = await import('redis')
    createClient = redis.createClient as CreateClientFn
  } catch {
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[REDIS SECURITY STORE] Redis not available, using in-memory fallback'
          )
        }
      }
    }
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
  private client: RedisClientLike | null = null
  private isConnected = false
  private cleanupTimer: NodeJS.Timeout | null = null
  private fallbackStore: Map<string, SecurityStoreData> = new Map()

  constructor(private config: SecurityStoreConfig) {
    if (config.enabled && createClient) {
      this.initializeRedis()
    } else {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.log('[REDIS SECURITY STORE] Using in-memory fallback')
        }
      }
      this.isConnected = false
    }
  }

  private async initializeRedis(): Promise<void> {
    if (!createClient) {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.log(
              '[REDIS SECURITY STORE] Redis client not available, using in-memory fallback'
            )
          }
        }
      }
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

      this.client.on('error', (err: unknown) => {
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.error('[REDIS SECURITY STORE] Error:', err)
          }
        }
        this.isConnected = false
      })

      this.client.on('connect', () => {
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.log('[REDIS SECURITY STORE] Connected to Redis')
          }
        }
        this.isConnected = true
      })

      await this.client.connect()
      this.setupCleanup()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.error('[REDIS SECURITY STORE] Failed to initialize:', error)
        }
      }
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
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            if (process.env.NODE_ENV === 'development') {
              console.error(
                '[REDIS SECURITY STORE] Failed to store rate limit requests:',
                error
              )
            }
          }
        }
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
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              '[REDIS SECURITY STORE] Failed to get rate limit requests:',
              error
            )
          }
        }
      }
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
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              '[REDIS SECURITY STORE] Failed to store threat intelligence:',
              error
            )
          }
        }
      }
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
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              '[REDIS SECURITY STORE] Failed to get threat intelligence:',
              error
            )
          }
        }
      }
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
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              '[REDIS SECURITY STORE] Failed to add to quarantine:',
              error
            )
          }
        }
      }
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
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              '[REDIS SECURITY STORE] Failed to get quarantine events:',
              error
            )
          }
        }
      }
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
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            '[REDIS SECURITY STORE] Failed to add to audit log:',
            error
          )
        }
      }
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
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              '[REDIS SECURITY STORE] Failed to get audit log events:',
              error
            )
          }
        }
      }
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
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            if (process.env.NODE_ENV === 'development') {
              console.error(
                '[REDIS SECURITY STORE] Failed to get security data:',
                error
              )
            }
          }
        }
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
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            if (process.env.NODE_ENV === 'development') {
              console.error(
                '[REDIS SECURITY STORE] Failed to set security data:',
                error
              )
            }
          }
        }
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
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.error('[REDIS SECURITY STORE] Cleanup error:', error)
        }
      }
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
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.log('[REDIS SECURITY STORE] Disconnected from Redis')
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development') {
            console.error('[REDIS SECURITY STORE] Error disconnecting:', error)
          }
        }
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
