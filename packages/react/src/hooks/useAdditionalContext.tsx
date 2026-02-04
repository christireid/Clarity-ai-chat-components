'use client'

/**
 * useAdditionalContext Hook
 *
 * Provides additional context to AI for better understanding and responses.
 * Inspired by Tambo's additional-context pattern for generative UI.
 *
 * Features:
 * - Dynamic context injection
 * - Context prioritization
 * - Automatic context cleanup
 * - Context grouping/namespacing
 * - Server-side context support
 * - Context size management
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { addContext, removeContext } = useAdditionalContext()
 *
 * // Add user preferences context
 * addContext('user-preferences', {
 *   theme: 'dark',
 *   language: 'en',
 *   timezone: 'America/New_York',
 * })
 *
 * // Add current page context
 * addContext('current-page', {
 *   route: '/dashboard',
 *   title: 'Analytics Dashboard',
 *   permissions: ['read', 'write'],
 * })
 * ```
 *
 * @example
 * ```tsx
 * // With provider for app-wide context
 * function App() {
 *   return (
 *     <AdditionalContextProvider
 *       initialContext={{
 *         'app-info': { name: 'MyApp', version: '1.0.0' }
 *       }}
 *       maxContextSize={10000}
 *     >
 *       <MyComponent />
 *     </AdditionalContextProvider>
 *   )
 * }
 * ```
 */

import * as React from 'react'

// ============================================================================
// Types
// ============================================================================

/** Context entry with metadata */
export interface ContextEntry {
  /** Unique key for this context */
  key: string
  /** Context data (any serializable value) */
  data: unknown
  /** Priority (higher = more important, included first) */
  priority?: number
  /** Namespace/group for organization */
  namespace?: string
  /** Whether this context should persist across sessions */
  persistent?: boolean
  /** Time-to-live in milliseconds (auto-cleanup) */
  ttl?: number
  /** Timestamp when added */
  addedAt: number
  /** Expiration timestamp (if ttl set) */
  expiresAt?: number
  /** Size in characters (for budget management) */
  size: number
}

/** Context update event */
export interface ContextUpdateEvent {
  type: 'add' | 'update' | 'remove' | 'clear'
  key?: string
  entry?: ContextEntry
  timestamp: number
}

/** Options for adding context */
export interface AddContextOptions {
  /** Priority (higher = more important) */
  priority?: number
  /** Namespace for grouping */
  namespace?: string
  /** Whether to persist across sessions */
  persistent?: boolean
  /** Time-to-live in milliseconds */
  ttl?: number
  /** Whether to merge with existing context (if same key) */
  merge?: boolean
}

/** Hook options */
export interface UseAdditionalContextOptions {
  /** Maximum total context size in characters */
  maxSize?: number
  /** Storage key for persistent context */
  storageKey?: string
  /** Enable automatic TTL cleanup */
  autoCleanup?: boolean
  /** Cleanup interval in milliseconds */
  cleanupInterval?: number
  /** Callback when context changes */
  onChange?: (context: Map<string, ContextEntry>, event: ContextUpdateEvent) => void
  /** Callback when context size limit approached */
  onSizeWarning?: (currentSize: number, maxSize: number) => void
}

/** Hook return type */
export interface UseAdditionalContextReturn {
  /** All context entries */
  entries: Map<string, ContextEntry>
  /** Add or update context */
  addContext: (key: string, data: unknown, options?: AddContextOptions) => void
  /** Remove context by key */
  removeContext: (key: string) => void
  /** Remove all context in a namespace */
  removeNamespace: (namespace: string) => void
  /** Clear all context */
  clearContext: () => void
  /** Get context by key */
  getContext: <T = unknown>(key: string) => T | undefined
  /** Get all context in a namespace */
  getNamespace: (namespace: string) => Map<string, ContextEntry>
  /** Check if context exists */
  hasContext: (key: string) => boolean
  /** Get serialized context for AI consumption */
  getSerializedContext: (options?: SerializeOptions) => string
  /** Get context as structured object */
  getContextObject: () => Record<string, unknown>
  /** Current total size */
  totalSize: number
  /** Size budget remaining */
  remainingSize: number
  /** Whether size limit is near */
  isNearLimit: boolean
}

/** Options for serializing context */
export interface SerializeOptions {
  /** Maximum size of output */
  maxSize?: number
  /** Namespaces to include (all if empty) */
  namespaces?: string[]
  /** Minimum priority to include */
  minPriority?: number
  /** Format: 'json' | 'markdown' | 'text' */
  format?: 'json' | 'markdown' | 'text'
  /** Include metadata in output */
  includeMetadata?: boolean
}

/** Provider props */
export interface AdditionalContextProviderProps {
  children: React.ReactNode
  /** Initial context entries */
  initialContext?: Record<string, unknown>
  /** Maximum total context size */
  maxContextSize?: number
  /** Storage key for persistence */
  storageKey?: string
  /** Enable automatic cleanup */
  autoCleanup?: boolean
  /** Callback when context changes */
  onContextChange?: (context: Record<string, unknown>) => void
}

// ============================================================================
// Context
// ============================================================================

interface AdditionalContextValue extends UseAdditionalContextReturn {
  /** Subscribe to context changes */
  subscribe: (callback: (event: ContextUpdateEvent) => void) => () => void
}

const AdditionalContextContext = React.createContext<AdditionalContextValue | null>(null)

// ============================================================================
// Utilities
// ============================================================================

function calculateSize(data: unknown): number {
  try {
    return JSON.stringify(data).length
  } catch {
    return String(data).length
  }
}

function serializeToMarkdown(entries: ContextEntry[], includeMetadata: boolean): string {
  const lines: string[] = ['# Additional Context\n']

  // Group by namespace
  const byNamespace = new Map<string, ContextEntry[]>()
  for (const entry of entries) {
    const ns = entry.namespace || 'general'
    if (!byNamespace.has(ns)) {
      byNamespace.set(ns, [])
    }
    byNamespace.get(ns)!.push(entry)
  }

  for (const [namespace, nsEntries] of byNamespace) {
    lines.push(`## ${namespace}\n`)
    for (const entry of nsEntries) {
      lines.push(`### ${entry.key}`)
      if (includeMetadata) {
        lines.push(`_Priority: ${entry.priority || 0}, Added: ${new Date(entry.addedAt).toISOString()}_\n`)
      }
      lines.push('```json')
      lines.push(JSON.stringify(entry.data, null, 2))
      lines.push('```\n')
    }
  }

  return lines.join('\n')
}

function serializeToText(entries: ContextEntry[]): string {
  const lines: string[] = []
  for (const entry of entries) {
    const prefix = entry.namespace ? `[${entry.namespace}] ` : ''
    lines.push(`${prefix}${entry.key}: ${JSON.stringify(entry.data)}`)
  }
  return lines.join('\n')
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for managing additional context for AI
 */
export function useAdditionalContext(
  options: UseAdditionalContextOptions = {}
): UseAdditionalContextReturn {
  const {
    maxSize = 50000,
    storageKey = 'additional-context',
    autoCleanup = true,
    cleanupInterval = 60000,
    onChange,
    onSizeWarning,
  } = options

  const [entries, setEntries] = React.useState<Map<string, ContextEntry>>(() => new Map())
  const [totalSize, setTotalSize] = React.useState(0)

  // Load persistent context from storage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && storageKey) {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored) as Record<string, ContextEntry>
          const loaded = new Map<string, ContextEntry>()
          let size = 0

          for (const [key, entry] of Object.entries(parsed)) {
            // Skip expired entries
            if (entry.expiresAt && entry.expiresAt < Date.now()) continue
            // Only load persistent entries
            if (entry.persistent) {
              loaded.set(key, entry)
              size += entry.size
            }
          }

          setEntries(loaded)
          setTotalSize(size)
        }
      } catch (e) {
        console.warn('Failed to load additional context:', e)
      }
    }
  }, [storageKey])

  // Save persistent context to storage
  const saveToStorage = React.useCallback(() => {
    if (typeof window !== 'undefined' && storageKey) {
      try {
        const toSave: Record<string, ContextEntry> = {}
        for (const [key, entry] of entries) {
          if (entry.persistent) {
            toSave[key] = entry
          }
        }
        localStorage.setItem(storageKey, JSON.stringify(toSave))
      } catch (e) {
        console.warn('Failed to save additional context:', e)
      }
    }
  }, [storageKey, entries])

  React.useEffect(() => {
    saveToStorage()
  }, [saveToStorage])

  // Auto-cleanup expired entries
  React.useEffect(() => {
    if (!autoCleanup) return

    const cleanup = () => {
      const now = Date.now()
      let changed = false
      const newEntries = new Map(entries)
      let newSize = totalSize

      for (const [key, entry] of newEntries) {
        if (entry.expiresAt && entry.expiresAt < now) {
          newEntries.delete(key)
          newSize -= entry.size
          changed = true
        }
      }

      if (changed) {
        setEntries(newEntries)
        setTotalSize(newSize)
        onChange?.(newEntries, { type: 'remove', timestamp: now })
      }
    }

    const interval = setInterval(cleanup, cleanupInterval)
    return () => clearInterval(interval)
  }, [autoCleanup, cleanupInterval, entries, totalSize, onChange])

  // Check size warning
  React.useEffect(() => {
    if (totalSize > maxSize * 0.8) {
      onSizeWarning?.(totalSize, maxSize)
    }
  }, [totalSize, maxSize, onSizeWarning])

  const addContext = React.useCallback(
    (key: string, data: unknown, addOptions: AddContextOptions = {}) => {
      const { priority = 0, namespace, persistent = false, ttl, merge = false } = addOptions

      setEntries((prev) => {
        const newEntries = new Map(prev)
        const existing = newEntries.get(key)
        const now = Date.now()

        let finalData = data
        if (merge && existing && typeof existing.data === 'object' && typeof data === 'object') {
          finalData = { ...(existing.data as object), ...(data as object) }
        }

        const size = calculateSize(finalData)
        const oldSize = existing?.size || 0

        // Check size limit
        if (totalSize - oldSize + size > maxSize) {
          console.warn(`Context size limit exceeded. Entry "${key}" not added.`)
          return prev
        }

        const entry: ContextEntry = {
          key,
          data: finalData,
          priority,
          namespace,
          persistent,
          ttl,
          addedAt: existing?.addedAt || now,
          expiresAt: ttl ? now + ttl : undefined,
          size,
        }

        newEntries.set(key, entry)
        setTotalSize((prev) => prev - oldSize + size)

        onChange?.(newEntries, {
          type: existing ? 'update' : 'add',
          key,
          entry,
          timestamp: now,
        })

        return newEntries
      })
    },
    [maxSize, totalSize, onChange]
  )

  const removeContext = React.useCallback(
    (key: string) => {
      setEntries((prev) => {
        const entry = prev.get(key)
        if (!entry) return prev

        const newEntries = new Map(prev)
        newEntries.delete(key)
        setTotalSize((prev) => prev - entry.size)

        onChange?.(newEntries, {
          type: 'remove',
          key,
          timestamp: Date.now(),
        })

        return newEntries
      })
    },
    [onChange]
  )

  const removeNamespace = React.useCallback(
    (namespace: string) => {
      setEntries((prev) => {
        const newEntries = new Map(prev)
        let removedSize = 0

        for (const [key, entry] of newEntries) {
          if (entry.namespace === namespace) {
            newEntries.delete(key)
            removedSize += entry.size
          }
        }

        setTotalSize((prev) => prev - removedSize)

        onChange?.(newEntries, {
          type: 'remove',
          timestamp: Date.now(),
        })

        return newEntries
      })
    },
    [onChange]
  )

  const clearContext = React.useCallback(() => {
    setEntries(new Map())
    setTotalSize(0)
    onChange?.(new Map(), { type: 'clear', timestamp: Date.now() })
  }, [onChange])

  const getContext = React.useCallback(
    <T = unknown>(key: string): T | undefined => {
      const entry = entries.get(key)
      return entry?.data as T | undefined
    },
    [entries]
  )

  const getNamespace = React.useCallback(
    (namespace: string): Map<string, ContextEntry> => {
      const result = new Map<string, ContextEntry>()
      for (const [key, entry] of entries) {
        if (entry.namespace === namespace) {
          result.set(key, entry)
        }
      }
      return result
    },
    [entries]
  )

  const hasContext = React.useCallback(
    (key: string): boolean => entries.has(key),
    [entries]
  )

  const getSerializedContext = React.useCallback(
    (serializeOptions: SerializeOptions = {}): string => {
      const {
        maxSize: outputMaxSize,
        namespaces,
        minPriority = 0,
        format = 'json',
        includeMetadata = false,
      } = serializeOptions

      // Filter and sort entries
      let filtered = Array.from(entries.values())
        .filter((entry) => {
          if (entry.priority !== undefined && entry.priority < minPriority) return false
          if (namespaces && namespaces.length > 0) {
            if (!entry.namespace || !namespaces.includes(entry.namespace)) return false
          }
          return true
        })
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))

      // Serialize based on format
      let result: string
      switch (format) {
        case 'markdown':
          result = serializeToMarkdown(filtered, includeMetadata)
          break
        case 'text':
          result = serializeToText(filtered)
          break
        case 'json':
        default: {
          const obj: Record<string, unknown> = {}
          for (const entry of filtered) {
            if (includeMetadata) {
              obj[entry.key] = {
                data: entry.data,
                priority: entry.priority,
                namespace: entry.namespace,
                addedAt: entry.addedAt,
              }
            } else {
              obj[entry.key] = entry.data
            }
          }
          result = JSON.stringify(obj, null, 2)
        }
      }

      // Truncate if needed
      if (outputMaxSize && result.length > outputMaxSize) {
        result = result.slice(0, outputMaxSize - 3) + '...'
      }

      return result
    },
    [entries]
  )

  const getContextObject = React.useCallback((): Record<string, unknown> => {
    const obj: Record<string, unknown> = {}
    for (const [key, entry] of entries) {
      obj[key] = entry.data
    }
    return obj
  }, [entries])

  const remainingSize = maxSize - totalSize
  const isNearLimit = totalSize > maxSize * 0.8

  return {
    entries,
    addContext,
    removeContext,
    removeNamespace,
    clearContext,
    getContext,
    getNamespace,
    hasContext,
    getSerializedContext,
    getContextObject,
    totalSize,
    remainingSize,
    isNearLimit,
  }
}

// ============================================================================
// Provider Component
// ============================================================================

/**
 * Provider for app-wide additional context management
 */
export function AdditionalContextProvider({
  children,
  initialContext = {},
  maxContextSize = 50000,
  storageKey = 'additional-context',
  autoCleanup = true,
  onContextChange,
}: AdditionalContextProviderProps) {
  const subscribersRef = React.useRef<Set<(event: ContextUpdateEvent) => void>>(new Set())

  const contextValue = useAdditionalContext({
    maxSize: maxContextSize,
    storageKey,
    autoCleanup,
    onChange: (context, event) => {
      onContextChange?.(Object.fromEntries(
        Array.from(context.entries()).map(([k, v]) => [k, v.data])
      ))
      for (const callback of subscribersRef.current) {
        callback(event)
      }
    },
  })

  // Initialize with initial context
  React.useEffect(() => {
    for (const [key, data] of Object.entries(initialContext)) {
      contextValue.addContext(key, data, { persistent: true })
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const subscribe = React.useCallback((callback: (event: ContextUpdateEvent) => void) => {
    subscribersRef.current.add(callback)
    return () => {
      subscribersRef.current.delete(callback)
    }
  }, [])

  const value: AdditionalContextValue = {
    ...contextValue,
    subscribe,
  }

  return (
    <AdditionalContextContext.Provider value={value}>
      {children}
    </AdditionalContextContext.Provider>
  )
}

/**
 * Hook to access the additional context from provider
 */
export function useAdditionalContextProvider(): AdditionalContextValue {
  const context = React.useContext(AdditionalContextContext)
  if (!context) {
    throw new Error('useAdditionalContextProvider must be used within AdditionalContextProvider')
  }
  return context
}

export default useAdditionalContext
