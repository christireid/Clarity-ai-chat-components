/**
 * Chat Synchronization Hook
 *
 * Provides cross-device synchronization for chat conversations with conflict resolution,
 * offline support, and real-time updates.
 */

'use client'

import * as React from 'react'
import { SyncManager, useSyncManager } from '../../utils/sync-manager'
import type {
  SyncableData,
  SyncOptions,
  SyncResult,
} from '../../utils/sync-manager'
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'

// Extended message type for sync operations
interface SyncMessage extends CoreMessage {
  timestamp?: number
  metadata?: Record<string, unknown>
}

// Convert messages to syncable format
function messagesToSyncable(
  messages: SyncMessage[],
  conversationId: string
): SyncableData {
  return {
    id: `conversation_${conversationId}`,
    lastModified: Math.max(...messages.map((m) => m.timestamp || 0), 0),
    version: 1, // Would be incremented on changes
    data: {
      conversationId,
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        metadata: m.metadata,
      })),
    },
  }
}

// Convert syncable data back to messages
function syncableToMessages(syncable: SyncableData): SyncMessage[] {
  const data = syncable.data
  return data.messages.map((m: any) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    timestamp: m.timestamp,
    metadata: m.metadata,
  }))
}

/**
 * Local storage adapter for chat data using IndexedDB
 */
class ChatLocalStorage {
  constructor(private conversationId: string) {}

  async getAll(): Promise<SyncableData[]> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return []
    }

    try {
      const messages = await this.getStoredMessages()
      return messages.length > 0
        ? [messagesToSyncable(messages, this.conversationId)]
        : []
    } catch (error) {
      console.warn('Failed to get local chat data:', error)
      return []
    }
  }

  async get(id: string): Promise<SyncableData | null> {
    if (id !== `conversation_${this.conversationId}`) return null

    try {
      const messages = await this.getStoredMessages()
      return messages.length > 0
        ? messagesToSyncable(messages, this.conversationId)
        : null
    } catch (error) {
      console.warn('Failed to get local chat data:', error)
      return null
    }
  }

  async set(data: SyncableData): Promise<void> {
    try {
      const messages = syncableToMessages(data)
      await this.storeMessages(messages)
    } catch (error) {
      console.warn('Failed to store local chat data:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    if (id === `conversation_${this.conversationId}`) {
      try {
        await this.clearStoredMessages()
      } catch (error) {
        console.warn('Failed to delete local chat data:', error)
        throw error
      }
    }
  }

  private async getStoredMessages(): Promise<SyncMessage[]> {
    const key = `chat_sync_${this.conversationId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }

  private async storeMessages(messages: SyncMessage[]): Promise<void> {
    const key = `chat_sync_${this.conversationId}`
    localStorage.setItem(key, JSON.stringify(messages))
  }

  private async clearStoredMessages(): Promise<void> {
    const key = `chat_sync_${this.conversationId}`
    localStorage.removeItem(key)
  }
}

/**
 * Remote storage adapter for chat data
 */
class ChatRemoteStorage {
  constructor(
    private apiEndpoint: string,
    private authToken?: string
  ) {}

  async getAll(since?: number): Promise<SyncableData[]> {
    try {
      const url = new URL(this.apiEndpoint)
      if (since) {
        url.searchParams.set('since', since.toString())
      }

      const response = await fetch(url.toString(), {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.warn('Failed to fetch remote chat data:', error)
      return []
    }
  }

  async get(id: string): Promise<SyncableData | null> {
    try {
      const response = await fetch(`${this.apiEndpoint}/${id}`, {
        headers: this.getHeaders(),
      })

      if (response.status === 404) return null
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.warn('Failed to fetch remote chat data:', error)
      return null
    }
  }

  async set(data: SyncableData): Promise<void> {
    try {
      const response = await fetch(`${this.apiEndpoint}/${data.id}`, {
        method: 'PUT',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.warn('Failed to store remote chat data:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiEndpoint}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.warn('Failed to delete remote chat data:', error)
      throw error
    }
  }

  async getConflicts(localData: SyncableData[]): Promise<any[]> {
    // For chat sync, we handle conflicts in the sync manager
    // This could be enhanced to call a server endpoint for conflict detection
    return []
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers
  }
}

export interface ChatSyncOptions extends Partial<SyncOptions> {
  /** Conversation ID to sync */
  conversationId: string
  /** API endpoint for remote sync */
  apiEndpoint: string
  /** Auth token for API requests */
  authToken?: string
  /** Enable real-time sync */
  enableRealtime?: boolean
  /** Real-time sync endpoint */
  realtimeEndpoint?: string
  /** Conflict resolution strategy */
  conflictStrategy?: SyncOptions['conflictStrategy']
  /** Custom conflict resolver */
  onConflict?: SyncOptions['onConflict']
}

export interface ChatSyncReturn {
  /** Sync status */
  status: {
    isOnline: boolean
    lastSyncTime: number
    pendingChanges: number
    realtimeEnabled: boolean
    isSyncing: boolean
  }
  /** Sync actions */
  actions: {
    syncNow: () => Promise<SyncResult>
    enableRealtime: () => void
    disableRealtime: () => void
  }
  /** Last sync result */
  lastSyncResult: SyncResult | null
  /** Sync errors */
  errors: Array<{ timestamp: number; error: string }>
}

/**
 * Hook for chat synchronization across devices
 */
export function useChatSync(
  messages: SyncMessage[],
  onMessagesChange: (messages: SyncMessage[]) => void,
  options: ChatSyncOptions
): ChatSyncReturn {
  const {
    conversationId,
    apiEndpoint,
    authToken,
    enableRealtime: initialRealtimeEnabled = false,
    realtimeEndpoint,
    conflictStrategy = 'merge',
    onConflict,
    ...syncOptions
  } = options

  const [isSyncing, setIsSyncing] = React.useState(false)
  const [lastSyncResult, setLastSyncResult] = React.useState<SyncResult | null>(
    null
  )
  const [syncErrors, setSyncErrors] = React.useState<
    Array<{ timestamp: number; error: string }>
  >([])

  // Create storage adapters
  const localStorage = React.useMemo(
    () => new ChatLocalStorage(conversationId),
    [conversationId]
  )

  const remoteStorage = React.useMemo(
    () => new ChatRemoteStorage(apiEndpoint, authToken),
    [apiEndpoint, authToken]
  )

  // Use sync manager
  const { syncManager, status } = useSyncManager(localStorage, remoteStorage, {
    conflictStrategy,
    enableRealtime: initialRealtimeEnabled,
    syncInterval: 30000, // 30 seconds
    maxRetries: 3,
    onConflict:
      onConflict ||
      (async (conflict) => {
        // Default conflict resolution: merge messages
        console.warn('Chat sync conflict detected:', conflict)
        // For now, prefer the newer version
        return conflict.local.lastModified > conflict.remote.lastModified
          ? conflict.local
          : conflict.remote
      }),
    onProgress: (progress) => {
      setIsSyncing(progress.phase !== 'complete')
    },
    onError: (error) => {
      setSyncErrors((prev) => [
        ...prev.slice(-9),
        {
          timestamp: Date.now(),
          error: error.message,
        },
      ])
    },
    ...syncOptions,
  })

  // Sync messages when they change
  React.useEffect(() => {
    if (messages.length > 0) {
      const syncableData = messagesToSyncable(messages, conversationId)
      syncManager.queueChange('update', syncableData)
    }
  }, [messages, conversationId, syncManager])

  // Handle incoming sync updates
  React.useEffect(() => {
    const handleSyncUpdate = (event: CustomEvent) => {
      const updatedData = event.detail as SyncableData
      if (updatedData.id === `conversation_${conversationId}`) {
        const updatedMessages = syncableToMessages(updatedData)
        onMessagesChange(updatedMessages)
      }
    }

    window.addEventListener(
      'chat-sync-update',
      handleSyncUpdate as EventListener
    )
    return () => {
      window.removeEventListener(
        'chat-sync-update',
        handleSyncUpdate as EventListener
      )
    }
  }, [conversationId, onMessagesChange])

  // Start real-time sync if enabled
  React.useEffect(() => {
    if (initialRealtimeEnabled && realtimeEndpoint) {
      syncManager.startRealtime(realtimeEndpoint)
    }

    return () => {
      syncManager.stopRealtime()
    }
  }, [initialRealtimeEnabled, realtimeEndpoint, syncManager])

  const syncNow = async (): Promise<SyncResult> => {
    setIsSyncing(true)
    try {
      const result = await syncManager.sync()
      setLastSyncResult(result)
      return result
    } finally {
      setIsSyncing(false)
    }
  }

  const enableRealtime = () => {
    if (realtimeEndpoint) {
      syncManager.startRealtime(realtimeEndpoint)
    }
  }

  const disableRealtime = () => {
    syncManager.stopRealtime()
  }

  return {
    status: {
      ...status,
      isSyncing,
    },
    actions: {
      syncNow,
      enableRealtime,
      disableRealtime,
    },
    lastSyncResult,
    errors: syncErrors,
  }
}
