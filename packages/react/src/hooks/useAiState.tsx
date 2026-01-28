'use client'

/**
 * useAiState Hook
 *
 * An AI-integrated state hook that keeps track of user inputs
 * and passes them to the AI context. Changes are automatically
 * detected and propagated to both the UI and AI context.
 *
 * Features:
 * - Automatic change detection and AI context updates
 * - Debounced updates to prevent excessive AI calls
 * - History tracking for undo/redo
 * - Optimistic updates with rollback
 * - Type-safe state management
 * - Integration with AI conversation context
 *
 * @example
 * ```tsx
 * const [formData, setFormData, { isUpdating, undo, redo }] = useAiState({
 *   name: '',
 *   email: '',
 * }, {
 *   contextKey: 'userForm',
 *   debounce: 500,
 * })
 *
 * // AI can now see and modify formData
 * // User changes are tracked and sent to AI context
 * ```
 */

import * as React from 'react'

// ============================================================================
// Types
// ============================================================================

/** Source of state update */
export type AiStateUpdateSource = 'user' | 'ai' | 'system'

/** State update record */
export interface AiStateUpdate<T> {
  /** Previous value */
  previousValue: T
  /** New value */
  newValue: T
  /** Update source */
  source: AiStateUpdateSource
  /** Timestamp */
  timestamp: number
  /** Optional metadata */
  metadata?: Record<string, unknown>
}

/** Options for useAiState hook */
export interface UseAiStateOptions<T> {
  /** Key for AI context identification */
  contextKey?: string
  /** Description for AI understanding */
  description?: string
  /** Debounce time in ms before notifying AI */
  debounce?: number
  /** Maximum history size */
  maxHistory?: number
  /** Callback when state changes */
  onChange?: (value: T, source: AiStateUpdateSource) => void
  /** Callback when AI updates state */
  onAiUpdate?: (value: T) => void
  /** Validation function */
  validate?: (value: T) => boolean | string
  /** Transform function before sending to AI */
  transformForAi?: (value: T) => unknown
  /** Whether to persist to storage */
  persist?: boolean
  /** Storage key (defaults to contextKey) */
  storageKey?: string
}

/** Return type for useAiState hook */
export interface UseAiStateReturn<T> {
  /** Whether AI is currently updating this state */
  isUpdating: boolean
  /** Whether state is valid */
  isValid: boolean
  /** Validation error message */
  validationError?: string
  /** Whether there are changes to undo */
  canUndo: boolean
  /** Whether there are changes to redo */
  canRedo: boolean
  /** Undo last change */
  undo: () => void
  /** Redo last undone change */
  redo: () => void
  /** Reset to initial value */
  reset: () => void
  /** Update history */
  history: AiStateUpdate<T>[]
  /** Update state from AI (use this when receiving AI updates) */
  setFromAi: (value: T | ((prev: T) => T)) => void
  /** Get current AI context representation */
  getAiContext: () => { key: string; value: unknown; description?: string }
}

// ============================================================================
// AI State Context
// ============================================================================

/** Context value for AI state management */
export interface AiStateContextValue {
  /** Register a state with AI context */
  register: (key: string, value: unknown, description?: string) => void
  /** Unregister a state from AI context */
  unregister: (key: string) => void
  /** Update a state value */
  update: (key: string, value: unknown) => void
  /** Get all registered states */
  getAll: () => Map<string, { value: unknown; description?: string }>
  /** Subscribe to state updates from AI */
  subscribeToAi: (key: string, callback: (value: unknown) => void) => () => void
  /** Notify AI of state change */
  notifyAi: (key: string, value: unknown, metadata?: Record<string, unknown>) => void
}

const AiStateContext = React.createContext<AiStateContextValue | null>(null)

export interface AiStateProviderProps {
  /** Children */
  children: React.ReactNode
  /** Callback when any state changes */
  onStateChange?: (key: string, value: unknown, metadata?: Record<string, unknown>) => void
  /** Callback to send context to AI */
  onContextUpdate?: (context: Map<string, { value: unknown; description?: string }>) => void
}

/**
 * Provider for AI state management
 */
export function AiStateProvider({
  children,
  onStateChange,
  onContextUpdate,
}: AiStateProviderProps) {
  const statesRef = React.useRef<Map<string, { value: unknown; description?: string }>>(new Map())
  const subscribersRef = React.useRef<Map<string, Set<(value: unknown) => void>>>(new Map())

  const value = React.useMemo<AiStateContextValue>(() => ({
    register: (key, stateValue, description) => {
      statesRef.current.set(key, { value: stateValue, description })
      onContextUpdate?.(new Map(statesRef.current))
    },

    unregister: (key) => {
      statesRef.current.delete(key)
      subscribersRef.current.delete(key)
      onContextUpdate?.(new Map(statesRef.current))
    },

    update: (key, stateValue) => {
      const existing = statesRef.current.get(key)
      if (existing) {
        statesRef.current.set(key, { ...existing, value: stateValue })
        onContextUpdate?.(new Map(statesRef.current))
      }
    },

    getAll: () => new Map(statesRef.current),

    subscribeToAi: (key, callback) => {
      if (!subscribersRef.current.has(key)) {
        subscribersRef.current.set(key, new Set())
      }
      subscribersRef.current.get(key)!.add(callback)

      return () => {
        subscribersRef.current.get(key)?.delete(callback)
      }
    },

    notifyAi: (key, stateValue, metadata) => {
      onStateChange?.(key, stateValue, metadata)
    },
  }), [onStateChange, onContextUpdate])

  return (
    <AiStateContext.Provider value={value}>
      {children}
    </AiStateContext.Provider>
  )
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * AI-integrated state hook
 */
export function useAiState<T>(
  initialValue: T,
  options: UseAiStateOptions<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>, UseAiStateReturn<T>] {
  const {
    contextKey = `ai-state-${React.useId()}`,
    description,
    debounce = 300,
    maxHistory = 50,
    onChange,
    onAiUpdate,
    validate,
    transformForAi,
    persist = false,
    storageKey,
  } = options

  const context = React.useContext(AiStateContext)

  // Initialize state with persisted value if available
  const [state, setStateInternal] = React.useState<T>(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        const key = storageKey || contextKey
        const stored = localStorage.getItem(key)
        if (stored) {
          return JSON.parse(stored)
        }
      } catch (e) {
        console.warn('Failed to load persisted AI state:', e)
      }
    }
    return initialValue
  })

  const [isUpdating, setIsUpdating] = React.useState(false)
  const [history, setHistory] = React.useState<AiStateUpdate<T>[]>([])
  const [historyIndex, setHistoryIndex] = React.useState(-1)
  const [validationError, setValidationError] = React.useState<string | undefined>()

  const debounceTimerRef = React.useRef<NodeJS.Timeout>()

  // Validation
  const isValid = React.useMemo(() => {
    if (!validate) return true
    const result = validate(state)
    if (typeof result === 'string') {
      setValidationError(result)
      return false
    }
    setValidationError(undefined)
    return result
  }, [state, validate])

  // Register with AI context
  React.useEffect(() => {
    if (context) {
      context.register(contextKey, transformForAi ? transformForAi(state) : state, description)

      // Subscribe to AI updates
      const unsubscribe = context.subscribeToAi(contextKey, (value) => {
        setIsUpdating(true)
        setStateInternal(value as T)
        onAiUpdate?.(value as T)
        setTimeout(() => setIsUpdating(false), 100)
      })

      return () => {
        context.unregister(contextKey)
        unsubscribe()
      }
    }
  }, [contextKey, description]) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist state
  React.useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        const key = storageKey || contextKey
        localStorage.setItem(key, JSON.stringify(state))
      } catch (e) {
        console.warn('Failed to persist AI state:', e)
      }
    }
  }, [state, persist, storageKey, contextKey])

  // Update context when state changes
  React.useEffect(() => {
    if (context) {
      context.update(contextKey, transformForAi ? transformForAi(state) : state)
    }
  }, [state, contextKey, transformForAi, context])

  // Set state with tracking
  const setState = React.useCallback(
    (valueOrUpdater: React.SetStateAction<T>) => {
      setStateInternal((prev) => {
        const newValue = typeof valueOrUpdater === 'function'
          ? (valueOrUpdater as (prev: T) => T)(prev)
          : valueOrUpdater

        // Add to history
        const update: AiStateUpdate<T> = {
          previousValue: prev,
          newValue,
          source: 'user',
          timestamp: Date.now(),
        }

        setHistory((h) => {
          const newHistory = h.slice(0, historyIndex + 1)
          newHistory.push(update)
          return newHistory.slice(-maxHistory)
        })
        setHistoryIndex((i) => Math.min(i + 1, maxHistory - 1))

        // Notify onChange
        onChange?.(newValue, 'user')

        // Debounced AI notification
        if (context && debounce > 0) {
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
          }
          debounceTimerRef.current = setTimeout(() => {
            context.notifyAi(
              contextKey,
              transformForAi ? transformForAi(newValue) : newValue
            )
          }, debounce)
        } else if (context) {
          context.notifyAi(
            contextKey,
            transformForAi ? transformForAi(newValue) : newValue
          )
        }

        return newValue
      })
    },
    [context, contextKey, debounce, historyIndex, maxHistory, onChange, transformForAi]
  )

  // Set from AI (bypasses debounce and tracking as user change)
  const setFromAi = React.useCallback(
    (valueOrUpdater: React.SetStateAction<T>) => {
      setIsUpdating(true)
      setStateInternal((prev) => {
        const newValue = typeof valueOrUpdater === 'function'
          ? (valueOrUpdater as (prev: T) => T)(prev)
          : valueOrUpdater

        // Add to history as AI update
        const update: AiStateUpdate<T> = {
          previousValue: prev,
          newValue,
          source: 'ai',
          timestamp: Date.now(),
        }

        setHistory((h) => {
          const newHistory = h.slice(0, historyIndex + 1)
          newHistory.push(update)
          return newHistory.slice(-maxHistory)
        })
        setHistoryIndex((i) => Math.min(i + 1, maxHistory - 1))

        onChange?.(newValue, 'ai')
        onAiUpdate?.(newValue)

        return newValue
      })
      setTimeout(() => setIsUpdating(false), 100)
    },
    [historyIndex, maxHistory, onChange, onAiUpdate]
  )

  // Undo
  const undo = React.useCallback(() => {
    if (historyIndex >= 0 && history[historyIndex]) {
      setStateInternal(history[historyIndex].previousValue)
      setHistoryIndex((i) => i - 1)
    }
  }, [history, historyIndex])

  // Redo
  const redo = React.useCallback(() => {
    if (historyIndex < history.length - 1 && history[historyIndex + 1]) {
      setStateInternal(history[historyIndex + 1].newValue)
      setHistoryIndex((i) => i + 1)
    }
  }, [history, historyIndex])

  // Reset
  const reset = React.useCallback(() => {
    setStateInternal(initialValue)
    setHistory([])
    setHistoryIndex(-1)
  }, [initialValue])

  // Get AI context representation
  const getAiContext = React.useCallback(() => ({
    key: contextKey,
    value: transformForAi ? transformForAi(state) : state,
    description,
  }), [contextKey, state, transformForAi, description])

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return [
    state,
    setState,
    {
      isUpdating,
      isValid,
      validationError,
      canUndo: historyIndex >= 0,
      canRedo: historyIndex < history.length - 1,
      undo,
      redo,
      reset,
      history,
      setFromAi,
      getAiContext,
    },
  ]
}

// ============================================================================
// Utility Hook
// ============================================================================

/**
 * Hook to access all AI state context
 */
export function useAiStateContext(): AiStateContextValue | null {
  return React.useContext(AiStateContext)
}

/**
 * Hook to get all registered AI states
 */
export function useAllAiStates(): Map<string, { value: unknown; description?: string }> {
  const context = useAiStateContext()
  return context?.getAll() || new Map()
}

export default useAiState
