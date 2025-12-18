/**
 * Session Store
 *
 * Manages conversation sessions with persistent storage using Redis/Upstash.
 * Supports session creation, retrieval, updates, and expiration.
 */

import { Redis } from '@upstash/redis'
import { v4 as uuidv4 } from 'uuid'

export interface SessionMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface Session {
  id: string
  userId?: string
  sessionId: string // Browser/device fingerprint
  messages: SessionMessage[]
  metadata: {
    createdAt: string
    lastActivity: string
    totalMessages: number
    userAgent?: string
  }
  preferences: {
    theme?: 'light' | 'dark'
    language?: string
  }
}

interface SessionStore {
  /** Get a session by ID */
  get(sessionId: string): Promise<Session | null>

  /** Create or update a session */
  set(session: Session): Promise<void>

  /** Add a message to a session */
  addMessage(sessionId: string, message: SessionMessage): Promise<void>

  /** Delete a session */
  delete(sessionId: string): Promise<void>

  /** Get all sessions for a user */
  getUserSessions(userId: string): Promise<Session[]>

  /** Clean up expired sessions */
  cleanup(): Promise<number>
}

/**
 * Upstash Redis Session Store (Production)
 */
export class RedisSessionStore implements SessionStore {
  private redis: Redis
  private ttlSeconds: number

  constructor(ttlSeconds = 30 * 24 * 60 * 60) {
    // Default: 30 days
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set. ' +
        'Get them from https://console.upstash.com/'
      )
    }

    this.redis = new Redis({ url, token })
    this.ttlSeconds = ttlSeconds
  }

  private getKey(sessionId: string): string {
    const prefix = process.env.SESSION_PREFIX || 'clarity-docs-assistant'
    return `${prefix}:session:${sessionId}`
  }

  private getUserKey(userId: string): string {
    const prefix = process.env.SESSION_PREFIX || 'clarity-docs-assistant'
    return `${prefix}:user:${userId}:sessions`
  }

  async get(sessionId: string): Promise<Session | null> {
    const key = this.getKey(sessionId)
    const data = await this.redis.get(key)

    if (!data) return null

    return data as Session
  }

  async set(session: Session): Promise<void> {
    const key = this.getKey(session.id)

    // Update last activity
    session.metadata.lastActivity = new Date().toISOString()
    session.metadata.totalMessages = session.messages.length

    // Store session with TTL
    await this.redis.set(key, session, { ex: this.ttlSeconds })

    // If user is authenticated, add to user's session list
    if (session.userId) {
      const userKey = this.getUserKey(session.userId)
      await this.redis.sadd(userKey, session.id)
      await this.redis.expire(userKey, this.ttlSeconds)
    }
  }

  async addMessage(sessionId: string, message: SessionMessage): Promise<void> {
    const session = await this.get(sessionId)

    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }

    // Add timestamp if not present
    if (!message.timestamp) {
      message.timestamp = new Date().toISOString()
    }

    session.messages.push(message)
    await this.set(session)
  }

  async delete(sessionId: string): Promise<void> {
    const session = await this.get(sessionId)
    const key = this.getKey(sessionId)

    await this.redis.del(key)

    // Remove from user's session list if applicable
    if (session?.userId) {
      const userKey = this.getUserKey(session.userId)
      await this.redis.srem(userKey, sessionId)
    }
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    const userKey = this.getUserKey(userId)
    const sessionIds = (await this.redis.smembers(userKey)) as string[]

    const sessions: Session[] = []

    for (const sessionId of sessionIds) {
      const session = await this.get(sessionId)
      if (session) {
        sessions.push(session)
      }
    }

    // Sort by last activity (most recent first)
    return sessions.sort(
      (a, b) =>
        new Date(b.metadata.lastActivity).getTime() -
        new Date(a.metadata.lastActivity).getTime()
    )
  }

  async cleanup(): Promise<number> {
    // Redis automatically handles TTL expiration
    // This is a no-op for Redis, but kept for interface compatibility
    return 0
  }
}

/**
 * Local Session Store (Development)
 * Stores sessions in memory with optional disk persistence
 */
export class LocalSessionStore implements SessionStore {
  private sessions: Map<string, Session> = new Map()
  private userSessions: Map<string, Set<string>> = new Map()

  async get(sessionId: string): Promise<Session | null> {
    return this.sessions.get(sessionId) || null
  }

  async set(session: Session): Promise<void> {
    // Update metadata
    session.metadata.lastActivity = new Date().toISOString()
    session.metadata.totalMessages = session.messages.length

    this.sessions.set(session.id, session)

    // Track user sessions
    if (session.userId) {
      if (!this.userSessions.has(session.userId)) {
        this.userSessions.set(session.userId, new Set())
      }
      this.userSessions.get(session.userId)!.add(session.id)
    }
  }

  async addMessage(sessionId: string, message: SessionMessage): Promise<void> {
    const session = this.sessions.get(sessionId)

    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }

    if (!message.timestamp) {
      message.timestamp = new Date().toISOString()
    }

    session.messages.push(message)
    await this.set(session)
  }

  async delete(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)

    this.sessions.delete(sessionId)

    // Remove from user sessions
    if (session?.userId) {
      this.userSessions.get(session.userId)?.delete(sessionId)
    }
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    const sessionIds = this.userSessions.get(userId)

    if (!sessionIds) return []

    const sessions = Array.from(sessionIds)
      .map((id) => this.sessions.get(id))
      .filter((s): s is Session => s !== undefined)

    // Sort by last activity
    return sessions.sort(
      (a, b) =>
        new Date(b.metadata.lastActivity).getTime() -
        new Date(a.metadata.lastActivity).getTime()
    )
  }

  async cleanup(): Promise<number> {
    const now = Date.now()
    const ttlMs = 30 * 24 * 60 * 60 * 1000 // 30 days
    let cleaned = 0

    for (const [sessionId, session] of this.sessions.entries()) {
      const lastActivity = new Date(session.metadata.lastActivity).getTime()

      if (now - lastActivity > ttlMs) {
        await this.delete(sessionId)
        cleaned++
      }
    }

    return cleaned
  }
}

/**
 * Get the appropriate session store based on environment
 */
export function getSessionStore(): SessionStore {
  const useRedis =
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.NODE_ENV === 'production'

  if (useRedis) {
    logger.debug('Using Redis session store (Upstash)')
    return new RedisSessionStore()
  } else {
    logger.debug('Using local session store (development mode)')
    return new LocalSessionStore()
  }
}

/**
 * Generate a new session
 */
export function createSession(
  sessionId: string,
  options: {
    userId?: string
    userAgent?: string
    initialMessage?: SessionMessage
  } = {}
): Session {
  const now = new Date().toISOString()

  const session: Session = {
    id: uuidv4(),
    userId: options.userId,
    sessionId, // Browser fingerprint
    messages: options.initialMessage ? [options.initialMessage] : [],
    metadata: {
      createdAt: now,
      lastActivity: now,
      totalMessages: options.initialMessage ? 1 : 0,
      userAgent: options.userAgent,
    },
    preferences: {},
  }

  return session
}

/**
 * Generate a browser fingerprint for session identification
 * This is a simple implementation - can be enhanced with libraries like fingerprintjs
 */
export function generateSessionFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'server-side'
  }

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ]

  const fingerprint = components.join('|')

  // Simple hash function
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36)
}

/**
 * Get or create a session ID from localStorage
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return generateSessionFingerprint()
  }

  const key = 'clarity-docs-assistant-session-id'
  let sessionId = localStorage.getItem(key)

  if (!sessionId) {
    sessionId = generateSessionFingerprint()
    localStorage.setItem(key, sessionId)
  }

  return sessionId
}

/**
 * Session middleware helpers for API routes
 *
 * Note: sessionId is used as both the lookup key and stored in session.id
 * to ensure consistency between creation and retrieval.
 */
export async function getOrCreateSessionForRequest(
  sessionId: string,
  userId?: string,
  userAgent?: string
): Promise<Session> {
  const store = getSessionStore()
  let session = await store.get(sessionId)

  if (!session) {
    // Create session using sessionId as the primary key (session.id)
    // This ensures the same key is used for both storage and retrieval
    session = createSession(sessionId, { userId, userAgent })
    // Override the UUID with the sessionId for consistent lookups
    session.id = sessionId
    await store.set(session)
  }

  return session
}

/**
 * Update session with new messages
 */
export async function updateSessionWithMessages(
  sessionId: string,
  messages: SessionMessage[]
): Promise<void> {
  const store = getSessionStore()
  const session = await store.get(sessionId)

  if (!session) {
    throw new Error(`Session ${sessionId} not found`)
  }

  // Add new messages
  for (const message of messages) {
    if (!message.timestamp) {
      message.timestamp = new Date().toISOString()
    }
    session.messages.push(message)
  }

  await store.set(session)
}
