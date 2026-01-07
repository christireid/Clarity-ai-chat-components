'use client'

import * as React from 'react'

// =============================================================================
// Types
// =============================================================================

export interface CacheStore {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string, ttlMs?: number) => Promise<void>
  del?: (key: string) => Promise<void>
  clear?: () => Promise<void>
  keys?: () => Promise<string[]>
}

export interface LLMRequest {
  id: string
  provider: string
  model: string
  messages: Array<{ role: string; content: string; name?: string }>
  temperature?: number
  maxOutputTokens?: number
  metadata?: Record<string, unknown>
}

export interface LLMResponse {
  id: string
  provider: string
  model: string
  text: string
  usage?: { inputTokens: number; outputTokens: number; totalTokens: number }
  cached?: { kind: 'exact' | 'semantic'; key: string; similarity?: number }
  latencyMs?: number
}

export interface UseExactCacheConfig {
  /** Cache store implementation */
  store: CacheStore
  /** Default TTL in milliseconds */
  ttlMs?: number
  /** Include metadata in cache key */
  includeMetadataInKey?: boolean
  /** Fields to exclude from cache key */
  excludeFieldsFromKey?: string[]
  /** Maximum cached entries (for LRU) */
  maxEntries?: number
  /** Enable stale-while-revalidate */
  staleWhileRevalidate?: boolean
  /** Max age for stale content in ms */
  staleMaxAgeMs?: number
}

export interface CacheStats {
  hits: number
  misses: number
  hitRate: number
  size: number
  lastHitAt: Date | null
}

export interface UseExactCacheReturn {
  /** Get cached response */
  get: (key: string) => Promise<LLMResponse | null>
  /** Set cached response */
  set: (key: string, value: LLMResponse, ttlMs?: number) => Promise<void>
  /** Delete cached entry */
  del: (key: string) => Promise<void>
  /** Generate cache key from request */
  makeKey: (req: LLMRequest) => string
  /** Get with automatic key generation */
  getForRequest: (req: LLMRequest) => Promise<LLMResponse | null>
  /** Set with automatic key generation */
  setForRequest: (
    req: LLMRequest,
    res: LLMResponse,
    ttlMs?: number
  ) => Promise<void>
  /** Clear all cache entries */
  clear: () => Promise<void>
  /** Cache statistics */
  stats: CacheStats
  /** Invalidate by pattern */
  invalidateByPattern: (pattern: RegExp) => Promise<number>
  /** Prefetch entries */
  prefetch: (requests: LLMRequest[]) => Promise<void>
}

// =============================================================================
// Error Classes
// =============================================================================

export class CacheCorruptError extends Error {
  key: string

  constructor(key: string, message: string) {
    super(message)
    this.name = 'CacheCorruptError'
    this.key = key
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Generate a stable hash for cache keys using SHA-256
 */
async function sha256(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  // Fallback for environments without crypto.subtle
  return simpleHash(text)
}

/**
 * Simple hash fallback (not cryptographically secure)
 */
function simpleHash(text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

/**
 * Canonical JSON stringify for stable key generation
 */
function canonicalStringify(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj)
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalStringify).join(',') + ']'
  }

  const sortedKeys = Object.keys(obj).sort()
  const pairs = sortedKeys.map(
    (key) =>
      JSON.stringify(key) +
      ':' +
      canonicalStringify((obj as Record<string, unknown>)[key])
  )
  return '{' + pairs.join(',') + '}'
}

// =============================================================================
// In-Memory Store Implementation
// =============================================================================

interface CacheEntry {
  value: string
  expiresAt: number | null
  createdAt: number
}

export function createInMemoryStore(maxEntries = 1000): CacheStore {
  const cache = new Map<string, CacheEntry>()
  const accessOrder: string[] = []

  const updateAccessOrder = (key: string) => {
    const index = accessOrder.indexOf(key)
    if (index > -1) {
      accessOrder.splice(index, 1)
    }
    accessOrder.push(key)
  }

  const evictOldest = () => {
    while (cache.size >= maxEntries && accessOrder.length > 0) {
      const oldestKey = accessOrder.shift()
      if (oldestKey) {
        cache.delete(oldestKey)
      }
    }
  }

  return {
    async get(key: string): Promise<string | null> {
      const entry = cache.get(key)
      if (!entry) return null

      // Check expiration
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        cache.delete(key)
        const index = accessOrder.indexOf(key)
        if (index > -1) accessOrder.splice(index, 1)
        return null
      }

      updateAccessOrder(key)
      return entry.value
    },

    async set(key: string, value: string, ttlMs?: number): Promise<void> {
      evictOldest()
      cache.set(key, {
        value,
        expiresAt: ttlMs ? Date.now() + ttlMs : null,
        createdAt: Date.now(),
      })
      updateAccessOrder(key)
    },

    async del(key: string): Promise<void> {
      cache.delete(key)
      const index = accessOrder.indexOf(key)
      if (index > -1) accessOrder.splice(index, 1)
    },

    async clear(): Promise<void> {
      cache.clear()
      accessOrder.length = 0
    },

    async keys(): Promise<string[]> {
      return Array.from(cache.keys())
    },
  }
}

// =============================================================================
// IndexedDB Store Implementation
// =============================================================================

export function createIndexedDBStore(
  dbName = 'clarity-tokens-cache',
  storeName = 'responses'
): CacheStore {
  let db: IDBDatabase | null = null

  const openDB = async (): Promise<IDBDatabase> => {
    if (db) return db

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1)

      request.onerror = () => reject(request.error)

      request.onsuccess = () => {
        db = request.result
        resolve(db)
      }

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: 'key' })
        }
      }
    })
  }

  return {
    async get(key: string): Promise<string | null> {
      const database = await openDB()
      return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.get(key)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const entry = request.result
          if (!entry) {
            resolve(null)
            return
          }

          // Check expiration
          if (entry.expiresAt && Date.now() > entry.expiresAt) {
            // Delete expired entry
            const deleteTransaction = database.transaction(
              storeName,
              'readwrite'
            )
            deleteTransaction.objectStore(storeName).delete(key)
            resolve(null)
            return
          }

          resolve(entry.value)
        }
      })
    },

    async set(key: string, value: string, ttlMs?: number): Promise<void> {
      const database = await openDB()
      return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.put({
          key,
          value,
          expiresAt: ttlMs ? Date.now() + ttlMs : null,
          createdAt: Date.now(),
        })

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })
    },

    async del(key: string): Promise<void> {
      const database = await openDB()
      return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.delete(key)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })
    },

    async clear(): Promise<void> {
      const database = await openDB()
      return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })
    },

    async keys(): Promise<string[]> {
      const database = await openDB()
      return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.getAllKeys()

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result as string[])
      })
    },
  }
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useExactCache - Exact-match caching for LLM responses
 *
 * Provides deterministic caching keyed by a stable hash of the request payload.
 * Supports multiple storage backends (in-memory, IndexedDB) and TTL-based expiration.
 *
 * @example
 * ```tsx
 * const store = createIndexedDBStore()
 * const cache = useExactCache({ store, ttlMs: 7 * 24 * 3600 * 1000 })
 *
 * // Check cache before making API call
 * const key = cache.makeKey(request)
 * const cached = await cache.get(key)
 *
 * if (cached) {
 *   return cached
 * }
 *
 * const response = await callLLM(request)
 * await cache.set(key, response)
 * return response
 * ```
 */
export function useExactCache(
  config: UseExactCacheConfig
): UseExactCacheReturn {
  const {
    store,
    ttlMs = 7 * 24 * 3600 * 1000, // 7 days default
    includeMetadataInKey = false,
    excludeFieldsFromKey = ['id', 'createdAt'],
  } = config

  // Statistics state
  const [stats, setStats] = React.useState<CacheStats>({
    hits: 0,
    misses: 0,
    hitRate: 0,
    size: 0,
    lastHitAt: null,
  })

  /**
   * Generate cache key from request
   */
  const makeKey = React.useCallback(
    (req: LLMRequest): string => {
      // Build key object with relevant fields
      const keyObj: Record<string, unknown> = {
        provider: req.provider,
        model: req.model,
        messages: req.messages.map((m) => ({
          role: m.role,
          content: m.content,
          name: m.name,
        })),
        temperature: req.temperature,
        maxOutputTokens: req.maxOutputTokens,
      }

      if (includeMetadataInKey && req.metadata) {
        keyObj.metadata = req.metadata
      }

      // Remove excluded fields
      excludeFieldsFromKey.forEach((field) => {
        delete keyObj[field]
      })

      // Generate canonical JSON and hash
      const canonical = canonicalStringify(keyObj)
      // Use sync hash for immediate key generation
      return `exact:${simpleHash(canonical)}`
    },
    [includeMetadataInKey, excludeFieldsFromKey]
  )

  /**
   * Get cached response
   */
  const get = React.useCallback(
    async (key: string): Promise<LLMResponse | null> => {
      try {
        const stored = await store.get(key)
        if (!stored) {
          setStats((prev) => ({
            ...prev,
            misses: prev.misses + 1,
            hitRate: prev.hits / (prev.hits + prev.misses + 1),
          }))
          return null
        }

        const parsed = JSON.parse(stored) as LLMResponse

        setStats((prev) => ({
          ...prev,
          hits: prev.hits + 1,
          hitRate: (prev.hits + 1) / (prev.hits + 1 + prev.misses),
          lastHitAt: new Date(),
        }))

        return {
          ...parsed,
          cached: { kind: 'exact', key },
        }
      } catch (error) {
        throw new CacheCorruptError(
          key,
          `Failed to parse cached response: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    },
    [store]
  )

  /**
   * Set cached response
   */
  const set = React.useCallback(
    async (
      key: string,
      value: LLMResponse,
      customTtlMs?: number
    ): Promise<void> => {
      const serialized = JSON.stringify(value)
      await store.set(key, serialized, customTtlMs ?? ttlMs)

      // Update size estimate
      if (store.keys) {
        const keys = await store.keys()
        setStats((prev) => ({ ...prev, size: keys.length }))
      }
    },
    [store, ttlMs]
  )

  /**
   * Delete cached entry
   */
  const del = React.useCallback(
    async (key: string): Promise<void> => {
      await store.del?.(key)

      // Update size estimate
      if (store.keys) {
        const keys = await store.keys()
        setStats((prev) => ({ ...prev, size: keys.length }))
      }
    },
    [store]
  )

  /**
   * Get with automatic key generation
   */
  const getForRequest = React.useCallback(
    async (req: LLMRequest): Promise<LLMResponse | null> => {
      const key = makeKey(req)
      return get(key)
    },
    [makeKey, get]
  )

  /**
   * Set with automatic key generation
   */
  const setForRequest = React.useCallback(
    async (
      req: LLMRequest,
      res: LLMResponse,
      customTtlMs?: number
    ): Promise<void> => {
      const key = makeKey(req)
      await set(key, res, customTtlMs)
    },
    [makeKey, set]
  )

  /**
   * Clear all cache entries
   */
  const clear = React.useCallback(async (): Promise<void> => {
    await store.clear?.()
    setStats({
      hits: 0,
      misses: 0,
      hitRate: 0,
      size: 0,
      lastHitAt: null,
    })
  }, [store])

  /**
   * Invalidate by pattern
   */
  const invalidateByPattern = React.useCallback(
    async (pattern: RegExp): Promise<number> => {
      if (!store.keys || !store.del) return 0

      const keys = await store.keys()
      const matchingKeys = keys.filter((key) => pattern.test(key))

      await Promise.all(matchingKeys.map((key) => store.del!(key)))

      // Update size
      const remainingKeys = await store.keys()
      setStats((prev) => ({ ...prev, size: remainingKeys.length }))

      return matchingKeys.length
    },
    [store]
  )

  /**
   * Prefetch entries (warm cache)
   */
  const prefetch = React.useCallback(
    async (requests: LLMRequest[]): Promise<void> => {
      // This would typically involve making actual API calls
      // For now, just generate keys to verify they're cacheable
      requests.forEach((req) => makeKey(req))
    },
    [makeKey]
  )

  // Initialize size on mount
  React.useEffect(() => {
    if (store.keys) {
      store.keys().then((keys) => {
        setStats((prev) => ({ ...prev, size: keys.length }))
      })
    }
  }, [store])

  return {
    get,
    set,
    del,
    makeKey,
    getForRequest,
    setForRequest,
    clear,
    stats,
    invalidateByPattern,
    prefetch,
  }
}
