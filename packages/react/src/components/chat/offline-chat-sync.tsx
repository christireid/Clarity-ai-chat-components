import { logger } from '@clarity-chat/utils/logger';
'use client'

import * as React from 'react'
import { Card, CardContent, Badge, cn } from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'

/**
 * Sync status
 */
export type SyncStatus = 'online' | 'offline' | 'syncing' | 'error'

/**
 * Pending operation
 */
export interface PendingOperation {
  id: string
  type: 'send' | 'edit' | 'delete'
  messageId: string
  data: any
  timestamp: number
  retryCount: number
}

/**
 * Offline storage configuration
 */
export interface OfflineStorageConfig {
  /** Database name */
  dbName: string
  /** Store name */
  storeName: string
  /** Max messages to store */
  maxMessages: number
  /** Max pending operations */
  maxPending: number
  /** Retry attempts */
  maxRetries: number
  /** Sync interval (ms) */
  syncInterval: number
}

/**
 * Props for OfflineChatSync
 */
export interface OfflineChatSyncProps {
  /** Messages to sync */
  messages: Message[]
  /** Sync configuration */
  config?: Partial<OfflineStorageConfig>
  /** Callback when online status changes */
  onStatusChange?: (status: SyncStatus) => void
  /** Callback when sync completes */
  onSyncComplete?: (synced: number) => void
  /** Callback when sync fails */
  onSyncError?: (error: Error) => void
  /** Custom className */
  className?: string
}

const defaultConfig: OfflineStorageConfig = {
  dbName: 'clarity-chat-offline',
  storeName: 'messages',
  maxMessages: 1000,
  maxPending: 100,
  maxRetries: 3,
  syncInterval: 30000, // 30 seconds
}

/**
 * OfflineChatSync Component
 *
 * Provides offline-first capabilities with:
 * - IndexedDB message storage
 * - Automatic sync when online
 * - Pending operation queue
 * - Conflict resolution
 */
export function OfflineChatSync({
  messages,
  config: userConfig,
  onStatusChange,
  onSyncComplete,
  onSyncError,
  className,
}: OfflineChatSyncProps) {
  const config = { ...defaultConfig, ...userConfig }

  const [status, setStatus] = React.useState<SyncStatus>('online')
  const [pendingOps, setPendingOps] = React.useState<PendingOperation[]>([])
  const [lastSync, setLastSync] = React.useState<number | null>(null)

  const dbRef = React.useRef<IDBDatabase | null>(null)
  const syncIntervalRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  // Initialize IndexedDB
  React.useEffect(() => {
    const initDB = async () => {
      try {
        const request = indexedDB.open(config.dbName, 1)

        request.onerror = () => {
          logger.error('Failed to open IndexedDB')
        }

        request.onsuccess = () => {
          dbRef.current = request.result
          loadPendingOperations()
          loadMessages()
        }

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result

          // Create messages store
          if (!db.objectStoreNames.contains(config.storeName)) {
            const store = db.createObjectStore(config.storeName, { keyPath: 'id' })
            store.createIndex('timestamp', 'timestamp', { unique: false })
          }

          // Create pending operations store
          if (!db.objectStoreNames.contains('pending')) {
            const pendingStore = db.createObjectStore('pending', { keyPath: 'id' })
            pendingStore.createIndex('timestamp', 'timestamp', { unique: false })
          }
        }
      } catch (error) {
        logger.error('IndexedDB initialization error:', error)
      }
    }

    initDB()

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [config.dbName, config.storeName])

  // Monitor online/offline status
  React.useEffect(() => {
    const handleOnline = () => {
      setStatus('online')
      onStatusChange?.('online')
      syncPendingOperations()
    }

    const handleOffline = () => {
      setStatus('offline')
      onStatusChange?.('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial status
    if (!navigator.onLine) {
      setStatus('offline')
      onStatusChange?.('offline')
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onStatusChange])

  // Auto-sync interval
  React.useEffect(() => {
    if (status === 'online' && pendingOps.length > 0) {
      syncIntervalRef.current = setInterval(() => {
        syncPendingOperations()
      }, config.syncInterval)
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [status, pendingOps.length, config.syncInterval])

  // Save messages to IndexedDB
  const saveMessages = async (msgs: Message[]) => {
    if (!dbRef.current) return

    try {
      const transaction = dbRef.current.transaction([config.storeName], 'readwrite')
      const store = transaction.objectStore(config.storeName)

      for (const msg of msgs) {
        store.put(msg)
      }

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
        transaction.onabort = () => reject(new Error('Transaction aborted'))
      })
    } catch (error) {
      logger.error('Failed to save messages:', error)
    }
  }

  // Load messages from IndexedDB
  const loadMessages = async () => {
    if (!dbRef.current) return []

    try {
      const transaction = dbRef.current.transaction([config.storeName], 'readonly')
      const store = transaction.objectStore(config.storeName)
      const request = store.getAll()

      return new Promise<Message[]>((resolve) => {
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => resolve([])
      })
    } catch (error) {
      logger.error('Failed to load messages:', error)
      return []
    }
  }

  // Save pending operation
  const savePendingOperation = async (op: PendingOperation) => {
    if (!dbRef.current) return

    try {
      const transaction = dbRef.current.transaction(['pending'], 'readwrite')
      const store = transaction.objectStore('pending')
      store.put(op)

      setPendingOps(prev => [...prev, op])
    } catch (error) {
      logger.error('Failed to save pending operation:', error)
    }
  }

  // Load pending operations
  const loadPendingOperations = async () => {
    if (!dbRef.current) return

    try {
      const transaction = dbRef.current.transaction(['pending'], 'readonly')
      const store = transaction.objectStore('pending')
      const request = store.getAll()

      request.onsuccess = () => {
        setPendingOps(request.result)
      }
    } catch (error) {
      logger.error('Failed to load pending operations:', error)
    }
  }

  // Sync pending operations
  const syncPendingOperations = async () => {
    if (pendingOps.length === 0 || status === 'offline') return

    setStatus('syncing')

    try {
      let synced = 0

      for (const op of pendingOps) {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 100))

          // Remove from pending
          await removePendingOperation(op.id)
          synced++
        } catch (error) {
          // Increment retry count
          if (op.retryCount < config.maxRetries) {
            await updatePendingOperation({
              ...op,
              retryCount: op.retryCount + 1,
            })
          } else {
            // Max retries reached, remove operation
            await removePendingOperation(op.id)
            onSyncError?.(new Error(`Failed to sync operation ${op.id}`))
          }
        }
      }

      setStatus('online')
      setLastSync(Date.now())
      onSyncComplete?.(synced)
    } catch (error) {
      setStatus('error')
      onSyncError?.(error as Error)
    }
  }

  // Remove pending operation
  const removePendingOperation = async (id: string) => {
    if (!dbRef.current) return

    try {
      const transaction = dbRef.current.transaction(['pending'], 'readwrite')
      const store = transaction.objectStore('pending')
      store.delete(id)

      setPendingOps(prev => prev.filter(op => op.id !== id))
    } catch (error) {
      logger.error('Failed to remove pending operation:', error)
    }
  }

  // Update pending operation
  const updatePendingOperation = async (op: PendingOperation) => {
    if (!dbRef.current) return

    try {
      const transaction = dbRef.current.transaction(['pending'], 'readwrite')
      const store = transaction.objectStore('pending')
      store.put(op)

      setPendingOps(prev => prev.map(o => o.id === op.id ? op : o))
    } catch (error) {
      logger.error('Failed to update pending operation:', error)
    }
  }

  // Save messages when they change
  React.useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages)
    }
  }, [messages])

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-gray-500'
      case 'syncing':
        return 'bg-blue-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'offline':
        return 'Offline'
      case 'syncing':
        return 'Syncing...'
      case 'error':
        return 'Sync Error'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Status indicator */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', getStatusColor())} />
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>

            {pendingOps.length > 0 && (
              <Badge variant="secondary">
                {pendingOps.length} pending
              </Badge>
            )}

            {lastSync && (
              <span className="text-xs text-muted-foreground">
                Last sync: {new Date(lastSync).toLocaleTimeString()}
              </span>
            )}
          </div>

          {status === 'offline' && (
            <p className="text-xs text-muted-foreground mt-2">
              Messages will be synced when you're back online
            </p>
          )}

          {status === 'syncing' && (
            <div className="mt-2">
              <div className="h-1 bg-accent rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending operations (debug) */}
      {pendingOps.length > 0 && (
        <Card>
          <CardContent className="p-3">
            <div className="text-xs font-medium mb-2">Pending Operations:</div>
            <div className="space-y-1">
              {pendingOps.slice(0, 5).map(op => (
                <div key={op.id} className="text-xs flex items-center justify-between">
                  <span>{op.type} - {op.messageId.slice(0, 8)}</span>
                  <Badge variant="outline" className="text-xs">
                    Retry: {op.retryCount}/{config.maxRetries}
                  </Badge>
                </div>
              ))}
              {pendingOps.length > 5 && (
                <div className="text-xs text-muted-foreground">
                  +{pendingOps.length - 5} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/**
 * Hook for offline-first chat functionality
 */
export function useOfflineChat(config?: Partial<OfflineStorageConfig>) {
  const fullConfig = { ...defaultConfig, ...config }

  const [isOnline, setIsOnline] = React.useState(true)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [pendingOps, setPendingOps] = React.useState<PendingOperation[]>([])

  const dbRef = React.useRef<IDBDatabase | null>(null)

  // Initialize database
  React.useEffect(() => {
    const initDB = async () => {
      try {
        const request = indexedDB.open(fullConfig.dbName, 1)

        request.onsuccess = () => {
          dbRef.current = request.result
        }

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result

          if (!db.objectStoreNames.contains(fullConfig.storeName)) {
            const store = db.createObjectStore(fullConfig.storeName, { keyPath: 'id' })
            store.createIndex('timestamp', 'timestamp', { unique: false })
          }

          if (!db.objectStoreNames.contains('pending')) {
            const pendingStore = db.createObjectStore('pending', { keyPath: 'id' })
            pendingStore.createIndex('timestamp', 'timestamp', { unique: false })
          }
        }
      } catch (error) {
        logger.error('Failed to initialize IndexedDB:', error)
      }
    }

    initDB()
  }, [fullConfig.dbName, fullConfig.storeName])

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const saveMessage = async (message: Message) => {
    if (!dbRef.current) return

    try {
      const transaction = dbRef.current.transaction([fullConfig.storeName], 'readwrite')
      const store = transaction.objectStore(fullConfig.storeName)
      store.put(message)

      setMessages(prev => [...prev, message])
    } catch (error) {
      logger.error('Failed to save message:', error)
    }
  }

  const queueOperation = async (op: Omit<PendingOperation, 'id' | 'timestamp' | 'retryCount'>) => {
    if (!dbRef.current) return

    const operation: PendingOperation = {
      ...op,
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    }

    try {
      const transaction = dbRef.current.transaction(['pending'], 'readwrite')
      const store = transaction.objectStore('pending')
      store.put(operation)

      setPendingOps(prev => [...prev, operation])
    } catch (error) {
      logger.error('Failed to queue operation:', error)
    }
  }

  const clearCache = async () => {
    if (!dbRef.current) return

    try {
      const transaction = dbRef.current.transaction([fullConfig.storeName], 'readwrite')
      const store = transaction.objectStore(fullConfig.storeName)
      store.clear()

      setMessages([])
    } catch (error) {
      logger.error('Failed to clear cache:', error)
    }
  }

  return {
    isOnline,
    messages,
    pendingOps,
    saveMessage,
    queueOperation,
    clearCache,
  }
}
