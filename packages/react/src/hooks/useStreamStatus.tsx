'use client'

/**
 * useStreamStatus Hook
 *
 * Monitors real-time streaming progress for AI responses.
 * Enables progressive loading experiences and status feedback
 * during AI response generation.
 *
 * Features:
 * - Overall stream status tracking
 * - Per-prop status for progressive rendering
 * - Token count tracking
 * - Error state management
 * - Retry support
 * - Event callbacks
 *
 * @example
 * ```tsx
 * const { streamStatus, propStatus, tokens } = useStreamStatus()
 *
 * // Check overall status
 * if (!streamStatus.isSuccess) return <Spinner />
 *
 * // Progressive prop rendering
 * {propStatus["title"]?.isSuccess && <h3>{title}</h3>}
 * {propStatus["content"]?.isSuccess && <p>{content}</p>}
 *
 * // Show token count
 * <span>{tokens.total} tokens</span>
 * ```
 */

import * as React from 'react'

// ============================================================================
// Types
// ============================================================================

/** Status phases */
export type StreamPhase =
  | 'idle'
  | 'connecting'
  | 'streaming'
  | 'processing'
  | 'complete'
  | 'error'
  | 'cancelled'

/** Individual status state */
export interface StreamStatusState {
  /** Current phase */
  phase: StreamPhase
  /** Whether operation is pending */
  isPending: boolean
  /** Whether operation is streaming */
  isStreaming: boolean
  /** Whether operation completed successfully */
  isSuccess: boolean
  /** Whether operation failed */
  isError: boolean
  /** Whether operation was cancelled */
  isCancelled: boolean
  /** Error if failed */
  error?: Error
  /** Progress percentage (0-100) */
  progress?: number
  /** Start timestamp */
  startedAt?: number
  /** End timestamp */
  completedAt?: number
  /** Duration in ms */
  duration?: number
}

/** Per-prop status for progressive rendering */
export interface PropStatus {
  /** Whether this prop has been received */
  isReceived: boolean
  /** Whether this prop is complete */
  isSuccess: boolean
  /** Whether this prop is still streaming */
  isStreaming: boolean
  /** Partial value if streaming */
  partialValue?: unknown
  /** Received timestamp */
  receivedAt?: number
  /** Completed timestamp */
  completedAt?: number
}

/** Token usage tracking */
export interface TokenUsage {
  /** Input tokens */
  input: number
  /** Output tokens */
  output: number
  /** Total tokens */
  total: number
  /** Estimated cost (if available) */
  estimatedCost?: number
}

/** Options for useStreamStatus hook */
export interface UseStreamStatusOptions {
  /** Initial phase */
  initialPhase?: StreamPhase
  /** Props to track */
  trackedProps?: string[]
  /** Callback on status change */
  onStatusChange?: (status: StreamStatusState) => void
  /** Callback on prop received */
  onPropReceived?: (propName: string, value: unknown) => void
  /** Callback on complete */
  onComplete?: (status: StreamStatusState) => void
  /** Callback on error */
  onError?: (error: Error) => void
  /** Track token usage */
  trackTokens?: boolean
}

/** Return type for useStreamStatus hook */
export interface UseStreamStatusReturn {
  /** Overall stream status */
  streamStatus: StreamStatusState
  /** Per-prop status map */
  propStatus: Record<string, PropStatus>
  /** Token usage */
  tokens: TokenUsage
  /** Start streaming */
  startStream: () => void
  /** Update progress */
  updateProgress: (progress: number) => void
  /** Mark prop as received */
  receiveProp: (propName: string, value: unknown, isComplete?: boolean) => void
  /** Complete prop */
  completeProp: (propName: string) => void
  /** Complete stream successfully */
  completeStream: () => void
  /** Fail stream */
  failStream: (error: Error) => void
  /** Cancel stream */
  cancelStream: () => void
  /** Reset to initial state */
  reset: () => void
  /** Update tokens */
  updateTokens: (usage: Partial<TokenUsage>) => void
}

// ============================================================================
// Helper Functions
// ============================================================================

function createInitialStatus(phase: StreamPhase = 'idle'): StreamStatusState {
  return {
    phase,
    isPending: false,
    isStreaming: false,
    isSuccess: false,
    isError: false,
    isCancelled: false,
  }
}

function createInitialPropStatus(): PropStatus {
  return {
    isReceived: false,
    isSuccess: false,
    isStreaming: false,
  }
}

// ============================================================================
// Context
// ============================================================================

export interface StreamStatusContextValue {
  /** Register a stream */
  register: (id: string) => void
  /** Unregister a stream */
  unregister: (id: string) => void
  /** Get stream status */
  getStatus: (id: string) => StreamStatusState | undefined
  /** Update stream status */
  updateStatus: (id: string, status: Partial<StreamStatusState>) => void
  /** Get all streams */
  getAll: () => Map<string, StreamStatusState>
}

const StreamStatusContext = React.createContext<StreamStatusContextValue | null>(null)

export interface StreamStatusProviderProps {
  /** Children */
  children: React.ReactNode
  /** Global status change callback */
  onStatusChange?: (id: string, status: StreamStatusState) => void
}

/**
 * Provider for managing multiple stream statuses
 */
export function StreamStatusProvider({
  children,
  onStatusChange,
}: StreamStatusProviderProps) {
  const [streams, setStreams] = React.useState<Map<string, StreamStatusState>>(new Map())

  const value = React.useMemo<StreamStatusContextValue>(() => ({
    register: (id) => {
      setStreams((prev) => {
        const newMap = new Map(prev)
        if (!newMap.has(id)) {
          newMap.set(id, createInitialStatus())
        }
        return newMap
      })
    },

    unregister: (id) => {
      setStreams((prev) => {
        const newMap = new Map(prev)
        newMap.delete(id)
        return newMap
      })
    },

    getStatus: (id) => streams.get(id),

    updateStatus: (id, status) => {
      setStreams((prev) => {
        const newMap = new Map(prev)
        const existing = newMap.get(id)
        if (existing) {
          const updated = { ...existing, ...status }
          newMap.set(id, updated)
          onStatusChange?.(id, updated)
        }
        return newMap
      })
    },

    getAll: () => new Map(streams),
  }), [streams, onStatusChange])

  return (
    <StreamStatusContext.Provider value={value}>
      {children}
    </StreamStatusContext.Provider>
  )
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for tracking streaming status
 */
export function useStreamStatus(
  options: UseStreamStatusOptions = {}
): UseStreamStatusReturn {
  const {
    initialPhase = 'idle',
    trackedProps = [],
    onStatusChange,
    onPropReceived,
    onComplete,
    onError,
    trackTokens = true,
  } = options

  const [streamStatus, setStreamStatus] = React.useState<StreamStatusState>(() =>
    createInitialStatus(initialPhase)
  )

  const [propStatus, setPropStatus] = React.useState<Record<string, PropStatus>>(() =>
    Object.fromEntries(trackedProps.map((prop) => [prop, createInitialPropStatus()]))
  )

  const [tokens, setTokens] = React.useState<TokenUsage>({
    input: 0,
    output: 0,
    total: 0,
  })

  // Update status with callbacks
  const updateStatus = React.useCallback(
    (updates: Partial<StreamStatusState>) => {
      setStreamStatus((prev) => {
        const newStatus = { ...prev, ...updates }
        onStatusChange?.(newStatus)
        return newStatus
      })
    },
    [onStatusChange]
  )

  // Start streaming
  const startStream = React.useCallback(() => {
    updateStatus({
      phase: 'connecting',
      isPending: true,
      isStreaming: false,
      isSuccess: false,
      isError: false,
      isCancelled: false,
      error: undefined,
      progress: 0,
      startedAt: Date.now(),
      completedAt: undefined,
      duration: undefined,
    })

    // Move to streaming phase after short delay
    setTimeout(() => {
      updateStatus({
        phase: 'streaming',
        isStreaming: true,
      })
    }, 100)
  }, [updateStatus])

  // Update progress
  const updateProgress = React.useCallback(
    (progress: number) => {
      updateStatus({
        progress: Math.min(100, Math.max(0, progress)),
      })
    },
    [updateStatus]
  )

  // Receive prop
  const receiveProp = React.useCallback(
    (propName: string, value: unknown, isComplete = false) => {
      setPropStatus((prev) => ({
        ...prev,
        [propName]: {
          ...prev[propName],
          isReceived: true,
          isStreaming: !isComplete,
          isSuccess: isComplete,
          partialValue: value,
          receivedAt: prev[propName]?.receivedAt || Date.now(),
          completedAt: isComplete ? Date.now() : undefined,
        },
      }))

      onPropReceived?.(propName, value)
    },
    [onPropReceived]
  )

  // Complete prop
  const completeProp = React.useCallback((propName: string) => {
    setPropStatus((prev) => ({
      ...prev,
      [propName]: {
        ...prev[propName],
        isStreaming: false,
        isSuccess: true,
        completedAt: Date.now(),
      },
    }))
  }, [])

  // Complete stream
  const completeStream = React.useCallback(() => {
    const now = Date.now()
    const newStatus: StreamStatusState = {
      phase: 'complete',
      isPending: false,
      isStreaming: false,
      isSuccess: true,
      isError: false,
      isCancelled: false,
      progress: 100,
      completedAt: now,
      duration: streamStatus.startedAt ? now - streamStatus.startedAt : undefined,
    }

    setStreamStatus(newStatus)
    onStatusChange?.(newStatus)
    onComplete?.(newStatus)

    // Complete all props
    setPropStatus((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        if (updated[key].isReceived && !updated[key].isSuccess) {
          updated[key] = {
            ...updated[key],
            isStreaming: false,
            isSuccess: true,
            completedAt: now,
          }
        }
      })
      return updated
    })
  }, [streamStatus.startedAt, onStatusChange, onComplete])

  // Fail stream
  const failStream = React.useCallback(
    (error: Error) => {
      const now = Date.now()
      const newStatus: StreamStatusState = {
        phase: 'error',
        isPending: false,
        isStreaming: false,
        isSuccess: false,
        isError: true,
        isCancelled: false,
        error,
        completedAt: now,
        duration: streamStatus.startedAt ? now - streamStatus.startedAt : undefined,
      }

      setStreamStatus(newStatus)
      onStatusChange?.(newStatus)
      onError?.(error)
    },
    [streamStatus.startedAt, onStatusChange, onError]
  )

  // Cancel stream
  const cancelStream = React.useCallback(() => {
    const now = Date.now()
    updateStatus({
      phase: 'cancelled',
      isPending: false,
      isStreaming: false,
      isCancelled: true,
      completedAt: now,
      duration: streamStatus.startedAt ? now - streamStatus.startedAt : undefined,
    })
  }, [updateStatus, streamStatus.startedAt])

  // Reset
  const reset = React.useCallback(() => {
    setStreamStatus(createInitialStatus(initialPhase))
    setPropStatus(
      Object.fromEntries(trackedProps.map((prop) => [prop, createInitialPropStatus()]))
    )
    setTokens({ input: 0, output: 0, total: 0 })
  }, [initialPhase, trackedProps])

  // Update tokens
  const updateTokens = React.useCallback((usage: Partial<TokenUsage>) => {
    if (!trackTokens) return

    setTokens((prev) => {
      const updated = { ...prev, ...usage }
      updated.total = updated.input + updated.output
      return updated
    })
  }, [trackTokens])

  return {
    streamStatus,
    propStatus,
    tokens,
    startStream,
    updateProgress,
    receiveProp,
    completeProp,
    completeStream,
    failStream,
    cancelStream,
    reset,
    updateTokens,
  }
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook to access stream status context
 */
export function useStreamStatusContext(): StreamStatusContextValue {
  const context = React.useContext(StreamStatusContext)
  if (!context) {
    throw new Error('useStreamStatusContext must be used within a StreamStatusProvider')
  }
  return context
}

/**
 * Hook for simple streaming state
 */
export function useIsStreaming(): boolean {
  const [isStreaming, setIsStreaming] = React.useState(false)

  return isStreaming
}

/**
 * Hook for tracking multiple concurrent streams
 */
export function useMultiStreamStatus(
  streamIds: string[]
): {
  statuses: Record<string, StreamStatusState>
  allComplete: boolean
  anyError: boolean
  anyStreaming: boolean
} {
  const [statuses, setStatuses] = React.useState<Record<string, StreamStatusState>>(() =>
    Object.fromEntries(streamIds.map((id) => [id, createInitialStatus()]))
  )

  const allComplete = React.useMemo(
    () => Object.values(statuses).every((s) => s.isSuccess || s.isError || s.isCancelled),
    [statuses]
  )

  const anyError = React.useMemo(
    () => Object.values(statuses).some((s) => s.isError),
    [statuses]
  )

  const anyStreaming = React.useMemo(
    () => Object.values(statuses).some((s) => s.isStreaming),
    [statuses]
  )

  return { statuses, allComplete, anyError, anyStreaming }
}

/**
 * Hook for progressive content rendering
 */
export function useProgressiveContent<T extends Record<string, unknown>>(
  content: T,
  streamStatus: StreamStatusState
): {
  visibleContent: Partial<T>
  hiddenKeys: string[]
  progress: number
} {
  const [visibleContent, setVisibleContent] = React.useState<Partial<T>>({})
  const [revealedKeys, setRevealedKeys] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (streamStatus.isSuccess) {
      // Reveal all when complete
      setVisibleContent(content)
      setRevealedKeys(new Set(Object.keys(content)))
    } else if (streamStatus.isStreaming) {
      // Progressively reveal during streaming
      const keys = Object.keys(content)
      const revealCount = Math.floor((streamStatus.progress || 0) / 100 * keys.length)
      const keysToReveal = keys.slice(0, revealCount)

      setRevealedKeys(new Set(keysToReveal))
      setVisibleContent(
        Object.fromEntries(keysToReveal.map((k) => [k, content[k]])) as Partial<T>
      )
    }
  }, [content, streamStatus])

  const hiddenKeys = React.useMemo(
    () => Object.keys(content).filter((k) => !revealedKeys.has(k)),
    [content, revealedKeys]
  )

  return {
    visibleContent,
    hiddenKeys,
    progress: (revealedKeys.size / Object.keys(content).length) * 100,
  }
}

export default useStreamStatus
