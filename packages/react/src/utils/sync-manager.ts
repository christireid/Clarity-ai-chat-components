/**
 * Cross-Device Synchronization Manager
 *
 * Handles synchronization of chat data across multiple devices with conflict resolution,
 * offline support, and real-time updates.
 */

import React from 'react'
import { logger } from '@clarity-chat/utils/logger'

export interface SyncableData {
  id: string
  lastModified: number
  version: number
  data: any
}

export interface SyncConflict {
  local: SyncableData
  remote: SyncableData
  conflictFields: string[]
  resolved?: SyncableData
}

export interface SyncOptions {
  /** Conflict resolution strategy */
  conflictStrategy: 'local-wins' | 'remote-wins' | 'manual' | 'merge'
  /** Enable real-time sync */
  enableRealtime: boolean
  /** Sync interval in milliseconds */
  syncInterval: number
  /** Maximum retries for failed syncs */
  maxRetries: number
  /** Conflict resolution callback */
  onConflict?: (conflict: SyncConflict) => Promise<SyncableData | null>
  /** Sync progress callback */
  onProgress?: (progress: SyncProgress) => void
  /** Sync error callback */
  onError?: (error: SyncError) => void
}

export interface SyncProgress {
  phase: 'connecting' | 'syncing' | 'resolving-conflicts' | 'complete'
  completed: number
  total: number
  conflicts: number
}

export interface SyncError {
  type: 'network' | 'auth' | 'conflict' | 'version' | 'unknown'
  message: string
  data?: any
}

export interface SyncResult {
  success: boolean
  syncedItems: number
  conflictsResolved: number
  errors: SyncError[]
  lastSyncTime: number
}

/**
 * Conflict Resolution Strategies
 */
export class ConflictResolver {
  static async resolve(
    conflict: SyncConflict,
    strategy: SyncOptions['conflictStrategy'],
    onManualResolve?: SyncOptions['onConflict']
  ): Promise<SyncableData> {
    switch (strategy) {
      case 'local-wins':
        return conflict.local

      case 'remote-wins':
        return conflict.remote

      case 'manual':
        if (!onManualResolve) {
          throw new Error(
            'Manual conflict resolution requires onConflict callback'
          )
        }
        const resolved = await onManualResolve(conflict)
        if (!resolved) {
          throw new Error('Manual conflict resolution returned null')
        }
        return resolved

      case 'merge':
        return this.mergeData(conflict.local, conflict.remote)

      default:
        throw new Error(`Unknown conflict strategy: ${strategy}`)
    }
  }

  private static mergeData(
    local: SyncableData,
    remote: SyncableData
  ): SyncableData {
    // Simple merge strategy: remote wins for conflicts, combine arrays/objects
    const merged = { ...remote.data }

    // For each field in local data
    for (const [key, localValue] of Object.entries(local.data)) {
      const remoteValue = remote.data[key]

      if (!(key in remote.data)) {
        // Local-only field, keep it
        merged[key] = localValue
      } else if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
        // Merge arrays (union)
        merged[key] = [...new Set([...remoteValue, ...localValue])]
      } else if (
        typeof localValue === 'object' &&
        typeof remoteValue === 'object' &&
        localValue !== null &&
        remoteValue !== null
      ) {
        // Deep merge objects
        merged[key] = this.deepMerge(remoteValue, localValue)
      }
      // Otherwise, remote wins (already set above)
    }

    return {
      ...remote,
      data: merged,
      lastModified: Math.max(local.lastModified, remote.lastModified),
      version: Math.max(local.version, remote.version) + 1,
    }
  }

  private static deepMerge(target: any, source: any): any {
    const result = { ...target }

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.deepMerge(target[key] || {}, source[key])
      } else {
        result[key] = source[key]
      }
    }

    return result
  }
}

/**
 * Sync Queue for offline changes
 */
export class SyncQueue {
  private queue: Array<{
    id: string
    type: 'create' | 'update' | 'delete'
    data: SyncableData
    timestamp: number
    retries: number
  }> = []

  constructor(private maxRetries = 3) {}

  enqueue(type: 'create' | 'update' | 'delete', data: SyncableData): void {
    // Remove any existing operations for this item
    this.queue = this.queue.filter((item) => item.data.id !== data.id)

    this.queue.push({
      id: `${type}_${data.id}_${Date.now()}`,
      type,
      data,
      timestamp: Date.now(),
      retries: 0,
    })
  }

  dequeue(): Array<{
    id: string
    type: 'create' | 'update' | 'delete'
    data: SyncableData
  }> {
    return this.queue.splice(0).map((item) => ({
      id: item.id,
      type: item.type,
      data: item.data,
    }))
  }

  retry(id: string): boolean {
    const item = this.queue.find((item) => item.id === id)
    if (!item || item.retries >= this.maxRetries) {
      return false
    }

    item.retries++
    item.timestamp = Date.now()
    return true
  }

  get size(): number {
    return this.queue.length
  }

  clear(): void {
    this.queue = []
  }
}

/**
 * Real-time sync manager using Server-Sent Events
 */
export class RealtimeSync {
  private eventSource: EventSource | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor(
    private endpoint: string,
    private onMessage: (data: any) => void,
    private onError: (error: Event) => void
  ) {}

  connect(): void {
    if (this.eventSource) {
      this.disconnect()
    }

    try {
      this.eventSource = new EventSource(this.endpoint)

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.onMessage(data)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Failed to parse real-time sync message:', error)
          }
        }
      }

      this.eventSource.onerror = (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Real-time sync connection error:', error)
        }
        this.onError(error)
        this.scheduleReconnect()
      }

      this.eventSource.onopen = () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Real-time sync connected')
        }
        this.reconnectAttempts = 0
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to create EventSource:', error)
      }
      this.scheduleReconnect()
    }
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Max real-time sync reconnection attempts reached')
      }
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Reconnecting real-time sync in ${delay}ms (attempt ${this.reconnectAttempts})`
      )
    }

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }
}

/**
 * Main Synchronization Manager
 */
export class SyncManager {
  private syncQueue = new SyncQueue()
  private realtimeSync: RealtimeSync | null = null
  private syncTimer: NodeJS.Timeout | null = null
  private lastSyncTime = 0
  private isOnline = navigator.onLine

  constructor(
    private localStorage: {
      getAll(): Promise<SyncableData[]>
      get(id: string): Promise<SyncableData | null>
      set(data: SyncableData): Promise<void>
      delete(id: string): Promise<void>
    },
    private remoteStorage: {
      getAll(since?: number): Promise<SyncableData[]>
      get(id: string): Promise<SyncableData | null>
      set(data: SyncableData): Promise<void>
      delete(id: string): Promise<void>
      getConflicts(localData: SyncableData[]): Promise<SyncConflict[]>
    },
    private options: SyncOptions
  ) {
    // Monitor online status
    window.addEventListener('online', () => {
      this.isOnline = true
      this.scheduleSync()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Start periodic sync
    this.scheduleSync()
  }

  /**
   * Manually trigger a sync
   */
  async sync(): Promise<SyncResult> {
    if (!this.isOnline) {
      return {
        success: false,
        syncedItems: 0,
        conflictsResolved: 0,
        errors: [{ type: 'network', message: 'Device is offline' }],
        lastSyncTime: this.lastSyncTime,
      }
    }

    const errors: SyncError[] = []
    let syncedItems = 0
    let conflictsResolved = 0

    try {
      this.options.onProgress?.({
        phase: 'connecting',
        completed: 0,
        total: 1,
        conflicts: 0,
      })

      // Get local changes
      const localChanges = this.syncQueue.dequeue()
      for (const change of localChanges) {
        try {
          switch (change.type) {
            case 'create':
            case 'update':
              await this.remoteStorage.set(change.data)
              break
            case 'delete':
              await this.remoteStorage.delete(change.data.id)
              break
          }
          syncedItems++
        } catch (error) {
          errors.push({
            type: 'network',
            message: `Failed to sync ${change.type} operation`,
            data: { change, error },
          })

          // Re-queue failed operations
          this.syncQueue.retry(change.id)
        }
      }

      // Get remote changes
      this.options.onProgress?.({
        phase: 'syncing',
        completed: syncedItems,
        total: syncedItems + 1,
        conflicts: 0,
      })

      const remoteChanges = await this.remoteStorage.getAll(this.lastSyncTime)

      // Apply remote changes locally
      for (const remoteData of remoteChanges) {
        const localData = await this.localStorage.get(remoteData.id)

        if (!localData) {
          // New remote item
          await this.localStorage.set(remoteData)
          syncedItems++
        } else if (remoteData.lastModified > localData.lastModified) {
          // Remote is newer
          if (remoteData.version !== localData.version) {
            // Potential conflict
            const conflict: SyncConflict = {
              local: localData,
              remote: remoteData,
              conflictFields: this.getConflictFields(
                localData.data,
                remoteData.data
              ),
            }

            try {
              this.options.onProgress?.({
                phase: 'resolving-conflicts',
                completed: syncedItems,
                total: syncedItems + remoteChanges.length,
                conflicts: conflictsResolved + 1,
              })

              const resolved = await ConflictResolver.resolve(
                conflict,
                this.options.conflictStrategy,
                this.options.onConflict
              )

              await this.localStorage.set(resolved)
              syncedItems++
              conflictsResolved++
            } catch (error) {
              errors.push({
                type: 'conflict',
                message: `Failed to resolve conflict for item ${remoteData.id}`,
                data: { conflict, error },
              })
            }
          } else {
            // No conflict, apply remote changes
            await this.localStorage.set(remoteData)
            syncedItems++
          }
        }
      }

      this.lastSyncTime = Date.now()

      this.options.onProgress?.({
        phase: 'complete',
        completed: syncedItems,
        total: syncedItems,
        conflicts: conflictsResolved,
      })
    } catch (error) {
      errors.push({
        type: 'network',
        message: 'Sync operation failed',
        data: error,
      })
    }

    return {
      success: errors.length === 0,
      syncedItems,
      conflictsResolved,
      errors,
      lastSyncTime: this.lastSyncTime,
    }
  }

  /**
   * Queue a local change for sync
   */
  queueChange(type: 'create' | 'update' | 'delete', data: SyncableData): void {
    this.syncQueue.enqueue(type, data)
    this.scheduleSync()
  }

  /**
   * Start real-time synchronization
   */
  startRealtime(endpoint: string): void {
    if (this.options.enableRealtime) {
      this.realtimeSync = new RealtimeSync(
        endpoint,
        (data) => {
          // Handle real-time updates
          if (process.env.NODE_ENV === 'development') {
            console.log('Real-time sync update:', data)
          }
          this.scheduleSync()
        },
        (error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Real-time sync error:', error)
          }
        }
      )

      this.realtimeSync.connect()
    }
  }

  /**
   * Stop real-time synchronization
   */
  stopRealtime(): void {
    if (this.realtimeSync) {
      this.realtimeSync.disconnect()
      this.realtimeSync = null
    }
  }

  /**
   * Get sync status
   */
  getStatus() {
    return {
      isOnline: this.isOnline,
      lastSyncTime: this.lastSyncTime,
      pendingChanges: this.syncQueue.size,
      realtimeEnabled: !!this.realtimeSync,
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopRealtime()

    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = null
    }
  }

  private scheduleSync(): void {
    if (this.syncTimer) {
      clearTimeout(this.syncTimer)
    }

    this.syncTimer = setTimeout(() => {
      this.sync()
    }, this.options.syncInterval)
  }

  private getConflictFields(localData: any, remoteData: any): string[] {
    const conflicts: string[] = []

    const allKeys = new Set([
      ...Object.keys(localData),
      ...Object.keys(remoteData),
    ])

    for (const key of allKeys) {
      if (JSON.stringify(localData[key]) !== JSON.stringify(remoteData[key])) {
        conflicts.push(key)
      }
    }

    return conflicts
  }
}

/**
 * React hook for sync management
 */
export function useSyncManager(
  localStorage: SyncManager['localStorage'],
  remoteStorage: SyncManager['remoteStorage'],
  options: SyncOptions
) {
  const [syncManager] = React.useState(
    () => new SyncManager(localStorage, remoteStorage, options)
  )

  const [status, setStatus] = React.useState(syncManager.getStatus())

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStatus(syncManager.getStatus())
    }, 1000)

    return () => {
      clearInterval(interval)
      syncManager.destroy()
    }
  }, [syncManager])

  return {
    syncManager,
    status,
    sync: () => syncManager.sync(),
    queueChange: (type: 'create' | 'update' | 'delete', data: SyncableData) =>
      syncManager.queueChange(type, data),
    startRealtime: (endpoint: string) => syncManager.startRealtime(endpoint),
    stopRealtime: () => syncManager.stopRealtime(),
  }
}
