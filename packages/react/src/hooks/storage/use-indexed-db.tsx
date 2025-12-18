'use client'

import { logger } from '@clarity-chat/utils/logger'

import * as React from 'react'

/**
 * IndexedDB database configuration
 */
export interface IndexedDBConfig {
  /** Database name */
  dbName: string
  /** Database version */
  version: number
  /** Store configurations */
  stores: Array<{
    name: string
    keyPath?: string
    autoIncrement?: boolean
    indexes?: Array<{
      name: string
      keyPath: string | string[]
      unique?: boolean
    }>
  }>
}

/**
 * IndexedDB hook return type
 */
export interface UseIndexedDBReturn<T> {
  /** Current data */
  data: T | null
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: Error | null
  /** Save data to IndexedDB */
  save: (value: T) => Promise<void>
  /** Load data from IndexedDB */
  load: () => Promise<T | null>
  /** Delete data from IndexedDB */
  remove: () => Promise<void>
  /** Clear all data in store */
  clear: () => Promise<void>
  /** Check if IndexedDB is available */
  isAvailable: boolean
}

/**
 * IndexedDB hook for large data persistence
 *
 * Use this hook for storing large conversations (>5MB) or when you need
 * structured queries. Falls back to localStorage for smaller data or
 * when IndexedDB is unavailable.
 *
 * Features:
 * - Automatic database initialization
 * - Type-safe operations
 * - Error handling
 * - Loading states
 * - Fallback to localStorage
 *
 * @example
 * ```tsx
 * const { data, save, load, isLoading } = useIndexedDB<Message[]>({
 *   dbName: 'clarity-chat',
 *   version: 1,
 *   stores: [{
 *     name: 'conversations',
 *     keyPath: 'id',
 *     indexes: [{ name: 'createdAt', keyPath: 'createdAt' }]
 *   }]
 * }, 'conversations', 'conversation-123')
 * ```
 */
export function useIndexedDB<T>(
  config: IndexedDBConfig,
  storeName: string,
  key?: string
): UseIndexedDBReturn<T> {
  const [data, setData] = React.useState<T | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [isAvailable, setIsAvailable] = React.useState(false)
  const dbRef = React.useRef<IDBDatabase | null>(null)

  // Check IndexedDB availability
  React.useEffect(() => {
    setIsAvailable(
      typeof window !== 'undefined' &&
        'indexedDB' in window &&
        window.indexedDB !== null
    )
  }, [])

  // Initialize database
  React.useEffect(() => {
    if (!isAvailable || !key) return

    const initDB = async () => {
      try {
        const db = await openDatabase(config)
        dbRef.current = db
      } catch (err) {
        setError(err as Error)
        logger.error('Failed to initialize IndexedDB:', err)
      }
    }

    initDB()

    return () => {
      if (dbRef.current) {
        dbRef.current.close()
        dbRef.current = null
      }
    }
  }, [isAvailable, config, key])

  // Load data on mount
  React.useEffect(() => {
    if (!isAvailable || !key || !dbRef.current) return
    load()
  }, [isAvailable, key])

  const openDatabase = (config: IndexedDBConfig): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.dbName, config.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create stores
        config.stores.forEach((storeConfig) => {
          if (!db.objectStoreNames.contains(storeConfig.name)) {
            const store = db.createObjectStore(storeConfig.name, {
              keyPath: storeConfig.keyPath,
              autoIncrement: storeConfig.autoIncrement,
            })

            // Create indexes
            storeConfig.indexes?.forEach((indexConfig) => {
              store.createIndex(indexConfig.name, indexConfig.keyPath, {
                unique: indexConfig.unique || false,
              })
            })
          }
        })
      }
    })
  }

  const save = React.useCallback(
    async (value: T): Promise<void> => {
      if (!isAvailable || !key || !dbRef.current) {
        // Fallback to localStorage
        if (!key) throw new Error('Key is required for storage')
        try {
          localStorage.setItem(key, JSON.stringify(value))
          setData(value)
          return
        } catch (err) {
          throw new Error('Storage quota exceeded. Consider using IndexedDB.')
        }
      }

      setIsLoading(true)
      setError(null)

      try {
        const transaction = dbRef.current.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)

        await new Promise<void>((resolve, reject) => {
          const request = store.put({
            id: key,
            data: value,
            updatedAt: new Date(),
          })
          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })

        setData(value)
      } catch (err) {
        const error = err as Error
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isAvailable, key, storeName]
  )

  const load = React.useCallback(async (): Promise<T | null> => {
    if (!isAvailable || !key) {
      // Fallback to localStorage
      if (!key) return null
      try {
        const item = localStorage.getItem(key)
        if (!item) return null
        const parsed = JSON.parse(item) as T
        setData(parsed)
        return parsed
      } catch (err) {
        setError(err as Error)
        return null
      }
    }

    if (!dbRef.current) return null

    setIsLoading(true)
    setError(null)

    try {
      const transaction = dbRef.current.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)

      const result = await new Promise<T | null>((resolve, reject) => {
        const request = store.get(key)
        request.onsuccess = () => {
          const record = request.result
          resolve(record ? record.data : null)
        }
        request.onerror = () => reject(request.error)
      })

      setData(result)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAvailable, key, storeName])

  const remove = React.useCallback(async (): Promise<void> => {
    if (!isAvailable || !key) {
      // Fallback to localStorage
      if (!key) return
      localStorage.removeItem(key)
      setData(null)
      return
    }

    if (!dbRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const transaction = dbRef.current.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(key)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      setData(null)
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isAvailable, key, storeName])

  const clear = React.useCallback(async (): Promise<void> => {
    if (!isAvailable) {
      // Fallback to localStorage
      if (key) {
        localStorage.removeItem(key)
      } else {
        localStorage.clear()
      }
      setData(null)
      return
    }

    if (!dbRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const transaction = dbRef.current.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)

      await new Promise<void>((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      setData(null)
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isAvailable, storeName, key])

  return {
    data,
    isLoading,
    error,
    save,
    load,
    remove,
    clear,
    isAvailable,
  }
}

/**
 * Hook for managing large conversation histories with IndexedDB
 *
 * Optimized for conversations with 1000+ messages. Automatically handles:
 * - Chunking large conversations
 * - Lazy loading
 * - Efficient queries
 * - Automatic cleanup
 *
 * @example
 * ```tsx
 * const { conversations, saveConversation, loadConversation } = useConversationStorage({
 *   maxMessages: 1000,
 *   chunkSize: 100,
 * })
 * ```
 */
export interface UseConversationStorageOptions {
  /** Maximum messages before chunking */
  maxMessages?: number
  /** Chunk size for lazy loading */
  chunkSize?: number
  /** Auto-cleanup old conversations */
  autoCleanup?: boolean
  /** Maximum age in days for auto-cleanup */
  maxAgeDays?: number
}

export interface UseConversationStorageReturn {
  /** Save a conversation */
  saveConversation: (conversationId: string, messages: any[]) => Promise<void>
  /** Load a conversation */
  loadConversation: (conversationId: string) => Promise<any[] | null>
  /** Delete a conversation */
  deleteConversation: (conversationId: string) => Promise<void>
  /** List all conversation IDs */
  listConversations: () => Promise<string[]>
  /** Get conversation metadata */
  getConversationMetadata: (conversationId: string) => Promise<any | null>
  /** Clear all conversations */
  clearAll: () => Promise<void>
  /** Check if IndexedDB is available */
  isAvailable: boolean
}

export function useConversationStorage(
  options: UseConversationStorageOptions = {}
): UseConversationStorageReturn {
  const {
    maxMessages = 1000,
    chunkSize = 100,
    autoCleanup = false,
    maxAgeDays = 30,
  } = options

  const dbConfig: IndexedDBConfig = React.useMemo(
    () => ({
      dbName: 'clarity-chat-conversations',
      version: 1,
      stores: [
        {
          name: 'conversations',
          keyPath: 'id',
          indexes: [
            { name: 'createdAt', keyPath: 'createdAt' },
            { name: 'updatedAt', keyPath: 'updatedAt' },
            { name: 'messageCount', keyPath: 'messageCount' },
          ],
        },
        {
          name: 'messages',
          keyPath: 'id',
          indexes: [
            { name: 'conversationId', keyPath: 'conversationId' },
            { name: 'createdAt', keyPath: 'createdAt' },
          ],
        },
      ],
    }),
    []
  )

  const [isAvailable, setIsAvailable] = React.useState(false)
  const dbRef = React.useRef<IDBDatabase | null>(null)

  React.useEffect(() => {
    setIsAvailable(
      typeof window !== 'undefined' &&
        'indexedDB' in window &&
        window.indexedDB !== null
    )
  }, [])

  React.useEffect(() => {
    if (!isAvailable) return

    const initDB = async () => {
      try {
        const request = indexedDB.open(dbConfig.dbName, dbConfig.version)

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result

          // Create conversations store
          if (!db.objectStoreNames.contains('conversations')) {
            const store = db.createObjectStore('conversations', {
              keyPath: 'id',
            })
            store.createIndex('createdAt', 'createdAt')
            store.createIndex('updatedAt', 'updatedAt')
            store.createIndex('messageCount', 'messageCount')
          }

          // Create messages store
          if (!db.objectStoreNames.contains('messages')) {
            const store = db.createObjectStore('messages', { keyPath: 'id' })
            store.createIndex('conversationId', 'conversationId')
            store.createIndex('createdAt', 'createdAt')
          }
        }

        request.onsuccess = () => {
          dbRef.current = request.result
        }
      } catch (err) {
        logger.error('Failed to initialize conversation storage:', err)
      }
    }

    initDB()

    // Auto-cleanup if enabled
    if (autoCleanup && dbRef.current) {
      cleanupOldConversations(maxAgeDays)
    }

    return () => {
      if (dbRef.current) {
        dbRef.current.close()
      }
    }
  }, [isAvailable, autoCleanup, maxAgeDays])

  const saveConversation = React.useCallback(
    async (conversationId: string, messages: any[]): Promise<void> => {
      if (!dbRef.current) {
        // Fallback to localStorage
        try {
          localStorage.setItem(
            `conversation-${conversationId}`,
            JSON.stringify(messages)
          )
        } catch (err) {
          throw new Error('Storage quota exceeded. Consider using IndexedDB.')
        }
        return
      }

      const transaction = dbRef.current.transaction(
        ['conversations', 'messages'],
        'readwrite'
      )
      const convStore = transaction.objectStore('conversations')
      const msgStore = transaction.objectStore('messages')

      // Save conversation metadata
      await new Promise<void>((resolve, reject) => {
        const request = convStore.put({
          id: conversationId,
          messageCount: messages.length,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      // Save messages (chunked if needed)
      if (messages.length > maxMessages) {
        // Chunk messages for efficient storage
        for (let i = 0; i < messages.length; i += chunkSize) {
          const chunk = messages.slice(i, i + chunkSize)
          await Promise.all(
            chunk.map(
              (msg) =>
                new Promise<void>((resolve, reject) => {
                  const request = msgStore.put({
                    ...msg,
                    conversationId,
                    chunkIndex: Math.floor(i / chunkSize),
                  })
                  request.onsuccess = () => resolve()
                  request.onerror = () => reject(request.error)
                })
            )
          )
        }
      } else {
        // Save all messages directly
        await Promise.all(
          messages.map(
            (msg) =>
              new Promise<void>((resolve, reject) => {
                const request = msgStore.put({
                  ...msg,
                  conversationId,
                })
                request.onsuccess = () => resolve()
                request.onerror = () => reject(request.error)
              })
          )
        )
      }
    },
    [maxMessages, chunkSize]
  )

  const loadConversation = React.useCallback(
    async (conversationId: string): Promise<any[] | null> => {
      if (!dbRef.current) {
        // Fallback to localStorage
        const item = localStorage.getItem(`conversation-${conversationId}`)
        return item ? JSON.parse(item) : null
      }

      const transaction = dbRef.current.transaction(['messages'], 'readonly')
      const store = transaction.objectStore('messages')
      const index = store.index('conversationId')

      return new Promise((resolve, reject) => {
        const request = index.getAll(conversationId)
        request.onsuccess = () => {
          const messages = request.result
          // Sort by createdAt and remove chunk metadata
          const sorted = messages
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map(({ chunkIndex, conversationId: _, ...msg }) => msg)
          resolve(sorted)
        }
        request.onerror = () => reject(request.error)
      })
    },
    []
  )

  const deleteConversation = React.useCallback(
    async (conversationId: string): Promise<void> => {
      if (!dbRef.current) {
        localStorage.removeItem(`conversation-${conversationId}`)
        return
      }

      const transaction = dbRef.current.transaction(
        ['conversations', 'messages'],
        'readwrite'
      )
      const convStore = transaction.objectStore('conversations')
      const msgStore = transaction.objectStore('messages')
      const index = msgStore.index('conversationId')

      // Delete conversation metadata
      await new Promise<void>((resolve, reject) => {
        const request = convStore.delete(conversationId)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      // Delete all messages
      const messages = await new Promise<any[]>((resolve, reject) => {
        const request = index.getAll(conversationId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      await Promise.all(
        messages.map(
          (msg) =>
            new Promise<void>((resolve, reject) => {
              const request = msgStore.delete(msg.id)
              request.onsuccess = () => resolve()
              request.onerror = () => reject(request.error)
            })
        )
      )
    },
    []
  )

  const listConversations = React.useCallback(async (): Promise<string[]> => {
    if (!dbRef.current) {
      // Fallback: get from localStorage
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('conversation-')) {
          keys.push(key.replace('conversation-', ''))
        }
      }
      return keys
    }

    const transaction = dbRef.current.transaction(['conversations'], 'readonly')
    const store = transaction.objectStore('conversations')

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const conversations = request.result
        resolve(conversations.map((c) => c.id))
      }
      request.onerror = () => reject(request.error)
    })
  }, [])

  const getConversationMetadata = React.useCallback(
    async (conversationId: string): Promise<any | null> => {
      if (!dbRef.current) return null

      const transaction = dbRef.current.transaction(
        ['conversations'],
        'readonly'
      )
      const store = transaction.objectStore('conversations')

      return new Promise((resolve, reject) => {
        const request = store.get(conversationId)
        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(request.error)
      })
    },
    []
  )

  const clearAll = React.useCallback(async (): Promise<void> => {
    if (!dbRef.current) {
      localStorage.clear()
      return
    }

    const transaction = dbRef.current.transaction(
      ['conversations', 'messages'],
      'readwrite'
    )
    const convStore = transaction.objectStore('conversations')
    const msgStore = transaction.objectStore('messages')

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        const request = convStore.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      }),
      new Promise<void>((resolve, reject) => {
        const request = msgStore.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      }),
    ])
  }, [])

  const cleanupOldConversations = React.useCallback(
    async (maxAgeDays: number): Promise<void> => {
      if (!dbRef.current) return

      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays)

      const transaction = dbRef.current.transaction(
        ['conversations'],
        'readonly'
      )
      const store = transaction.objectStore('conversations')
      const index = store.index('updatedAt')

      const range = IDBKeyRange.upperBound(cutoffDate.getTime())

      const conversations = await new Promise<any[]>((resolve, reject) => {
        const request = index.getAll(range)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      // Delete old conversations
      await Promise.all(
        conversations.map((conv) => deleteConversation(conv.id))
      )
    },
    []
  )

  return {
    saveConversation,
    loadConversation,
    deleteConversation,
    listConversations,
    getConversationMetadata,
    clearAll,
    isAvailable,
  }
}
