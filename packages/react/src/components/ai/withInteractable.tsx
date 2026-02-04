'use client'

/**
 * withInteractable Higher-Order Component
 *
 * Wraps a component to make it "interactable" - meaning it persists
 * on the page and can be updated by AI across conversations.
 *
 * Unlike generative components (rendered once), interactable components:
 * - Have a stable ID for identification
 * - Can be pre-placed in the UI or generated dynamically
 * - Update their props when AI sends new values
 * - Maintain state between AI interactions
 *
 * Perfect for: shopping carts, task boards, spreadsheets, dashboards,
 * note-taking apps, and any component that needs persistent updates.
 *
 * @example
 * ```tsx
 * import { z } from 'zod'
 *
 * const InteractableNote = withInteractable(Note, {
 *   componentName: 'Note',
 *   description: 'A note with title, content, and color',
 *   propsSchema: z.object({
 *     title: z.string(),
 *     content: z.string(),
 *     color: z.enum(['white', 'yellow', 'blue', 'green']).optional(),
 *   }),
 * })
 *
 * // Usage - component can be updated by AI targeting 'note-1'
 * <InteractableNote
 *   id="note-1"
 *   title="My Note"
 *   content="Start writing..."
 * />
 * ```
 */

import * as React from 'react'
import { z } from 'zod'

// ============================================================================
// Types
// ============================================================================

/** Configuration for interactable component */
export interface InteractableConfig<P> {
  /** Component name for AI identification */
  componentName: string
  /** Description for AI understanding */
  description: string
  /** Zod schema for props validation */
  propsSchema: z.ZodType<P>
  /** Optional category */
  category?: string
  /** Optional tags */
  tags?: string[]
  /** Whether to persist state to storage */
  persistState?: boolean
  /** Storage key prefix */
  storageKeyPrefix?: string
  /** Debounce updates (ms) */
  updateDebounce?: number
}

/** Props added by withInteractable */
export interface InteractableProps {
  /** Unique ID for this component instance */
  id: string
  /** Whether component is currently being updated by AI */
  isUpdating?: boolean
  /** Callback when AI updates this component */
  onAiUpdate?: (props: Record<string, unknown>) => void
  /** Callback when user modifies the component */
  onUserChange?: (props: Record<string, unknown>) => void
}

/** Update event from AI or user */
export interface InteractableUpdate<P = Record<string, unknown>> {
  /** Component instance ID */
  id: string
  /** Component name */
  componentName: string
  /** New props */
  props: Partial<P>
  /** Update source */
  source: 'ai' | 'user'
  /** Timestamp */
  timestamp: number
}

/** Interactable component state */
export interface InteractableState<P> {
  /** Current props */
  props: P
  /** Update history */
  history: InteractableUpdate<P>[]
  /** Last update timestamp */
  lastUpdated: number
  /** Whether currently updating */
  isUpdating: boolean
}

/** Context for managing interactable components */
export interface InteractableContextValue {
  /** Register a component instance */
  register: (id: string, componentName: string, initialProps: Record<string, unknown>) => void
  /** Unregister a component instance */
  unregister: (id: string) => void
  /** Get current state for a component */
  getState: (id: string) => InteractableState<Record<string, unknown>> | undefined
  /** Update a component's props (from AI) */
  updateFromAi: (id: string, props: Record<string, unknown>) => void
  /** Update a component's props (from user) */
  updateFromUser: (id: string, props: Record<string, unknown>) => void
  /** Subscribe to updates for a component */
  subscribe: (id: string, callback: (state: InteractableState<Record<string, unknown>>) => void) => () => void
  /** Get all registered components */
  getAll: () => Map<string, InteractableState<Record<string, unknown>>>
}

// ============================================================================
// Context and Provider
// ============================================================================

const InteractableContext = React.createContext<InteractableContextValue | null>(null)

export interface InteractableProviderProps {
  /** Children */
  children: React.ReactNode
  /** Optional initial state */
  initialState?: Map<string, InteractableState<Record<string, unknown>>>
  /** Persist state to localStorage */
  persistToStorage?: boolean
  /** Storage key */
  storageKey?: string
  /** Global update callback */
  onUpdate?: (update: InteractableUpdate) => void
}

/**
 * Provider for managing interactable components
 */
export function InteractableProvider({
  children,
  initialState,
  persistToStorage = false,
  storageKey = 'interactable-state',
  onUpdate,
}: InteractableProviderProps) {
  const [components] = React.useState<Map<string, InteractableState<Record<string, unknown>>>>(
    () => {
      // Load from storage if enabled
      if (persistToStorage && typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(storageKey)
          if (stored) {
            const parsed = JSON.parse(stored)
            return new Map(Object.entries(parsed))
          }
        } catch (e) {
          console.warn('Failed to load interactable state from storage:', e)
        }
      }
      return initialState || new Map()
    }
  )

  const subscribers = React.useRef<Map<string, Set<(state: InteractableState<Record<string, unknown>>) => void>>>(
    new Map()
  )

  // Persist to storage
  const persistState = React.useCallback(() => {
    if (persistToStorage && typeof window !== 'undefined') {
      try {
        const data = Object.fromEntries(components.entries())
        localStorage.setItem(storageKey, JSON.stringify(data))
      } catch (e) {
        console.warn('Failed to persist interactable state:', e)
      }
    }
  }, [persistToStorage, storageKey, components])

  // Notify subscribers
  const notifySubscribers = React.useCallback((id: string, state: InteractableState<Record<string, unknown>>) => {
    const subs = subscribers.current.get(id)
    subs?.forEach((callback) => callback(state))
  }, [])

  const value = React.useMemo<InteractableContextValue>(() => ({
    register: (id, componentName, initialProps) => {
      if (!components.has(id)) {
        const state: InteractableState<Record<string, unknown>> = {
          props: initialProps,
          history: [],
          lastUpdated: Date.now(),
          isUpdating: false,
        }
        components.set(id, state)
        persistState()
      }
    },

    unregister: (id) => {
      components.delete(id)
      subscribers.current.delete(id)
      persistState()
    },

    getState: (id) => components.get(id),

    updateFromAi: (id, props) => {
      const current = components.get(id)
      if (current) {
        const update: InteractableUpdate = {
          id,
          componentName: '', // Would be set from registration
          props,
          source: 'ai',
          timestamp: Date.now(),
        }

        const newState: InteractableState<Record<string, unknown>> = {
          props: { ...current.props, ...props },
          history: [...current.history.slice(-99), update],
          lastUpdated: Date.now(),
          isUpdating: false,
        }

        components.set(id, newState)
        notifySubscribers(id, newState)
        persistState()
        onUpdate?.(update)
      }
    },

    updateFromUser: (id, props) => {
      const current = components.get(id)
      if (current) {
        const update: InteractableUpdate = {
          id,
          componentName: '',
          props,
          source: 'user',
          timestamp: Date.now(),
        }

        const newState: InteractableState<Record<string, unknown>> = {
          props: { ...current.props, ...props },
          history: [...current.history.slice(-99), update],
          lastUpdated: Date.now(),
          isUpdating: false,
        }

        components.set(id, newState)
        notifySubscribers(id, newState)
        persistState()
        onUpdate?.(update)
      }
    },

    subscribe: (id, callback) => {
      if (!subscribers.current.has(id)) {
        subscribers.current.set(id, new Set())
      }
      subscribers.current.get(id)!.add(callback)

      return () => {
        subscribers.current.get(id)?.delete(callback)
      }
    },

    getAll: () => new Map(components),
  }), [components, notifySubscribers, persistState, onUpdate])

  return (
    <InteractableContext.Provider value={value}>
      {children}
    </InteractableContext.Provider>
  )
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access interactable context
 */
export function useInteractable(): InteractableContextValue {
  const context = React.useContext(InteractableContext)
  if (!context) {
    throw new Error('useInteractable must be used within an InteractableProvider')
  }
  return context
}

/**
 * Hook for a specific interactable component instance
 */
export function useInteractableInstance<P extends Record<string, unknown>>(
  id: string,
  componentName: string,
  initialProps: P
): {
  props: P
  isUpdating: boolean
  updateProps: (props: Partial<P>) => void
  history: InteractableUpdate<P>[]
} {
  const context = useInteractable()
  const [state, setState] = React.useState<InteractableState<P>>(() => ({
    props: initialProps,
    history: [],
    lastUpdated: Date.now(),
    isUpdating: false,
  }))

  // Register on mount
  React.useEffect(() => {
    context.register(id, componentName, initialProps)

    const unsubscribe = context.subscribe(id, (newState) => {
      setState(newState as InteractableState<P>)
    })

    // Get initial state if exists
    const existing = context.getState(id)
    if (existing) {
      setState(existing as InteractableState<P>)
    }

    return () => {
      unsubscribe()
    }
  }, [id, componentName]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateProps = React.useCallback((props: Partial<P>) => {
    context.updateFromUser(id, props)
  }, [context, id])

  return {
    props: state.props,
    isUpdating: state.isUpdating,
    updateProps,
    history: state.history,
  }
}

// ============================================================================
// Higher-Order Component
// ============================================================================

/**
 * Higher-order component to make a component interactable
 */
export function withInteractable<P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>,
  config: InteractableConfig<P>
): React.FC<P & InteractableProps> {
  const { componentName, description, propsSchema } = config

  const InteractableComponent: React.FC<P & InteractableProps> = ({
    id,
    isUpdating: externalIsUpdating,
    onAiUpdate,
    onUserChange,
    ...props
  }) => {
    const context = React.useContext(InteractableContext)

    // Use hook if context available, otherwise use props directly
    const {
      props: managedProps,
      isUpdating: internalIsUpdating,
      updateProps,
    } = context
      ? useInteractableInstance(id, componentName, props as P)
      : { props: props as P, isUpdating: false, updateProps: () => {} }

    const isUpdating = externalIsUpdating ?? internalIsUpdating

    // Validate props
    React.useEffect(() => {
      const result = propsSchema.safeParse(managedProps)
      if (!result.success) {
        console.warn(
          `Interactable "${componentName}" (${id}): Invalid props`,
          result.error.issues
        )
      }
    }, [managedProps, id])

    // Handle user changes
    const handleChange = React.useCallback(
      (newProps: Partial<P>) => {
        updateProps(newProps)
        onUserChange?.(newProps)
      },
      [updateProps, onUserChange]
    )

    // Merge props - managed props take precedence if context exists
    const finalProps = context ? managedProps : (props as P)

    return (
      <div
        className={`interactable-wrapper ${isUpdating ? 'interactable-updating' : ''}`}
        data-interactable-id={id}
        data-interactable-name={componentName}
      >
        <WrappedComponent
          {...finalProps}
          // Pass change handler if component supports it
          // @ts-expect-error - Component may have onChange
          onChange={handleChange}
        />
        {isUpdating && (
          <div className="interactable-updating-indicator" aria-live="polite">
            <span className="interactable-spinner" />
          </div>
        )}
      </div>
    )
  }

  // Set display name for debugging
  InteractableComponent.displayName = `Interactable(${componentName})`

  // Attach metadata for registry
  ;(InteractableComponent as unknown as { __interactableConfig: InteractableConfig<P> }).__interactableConfig = {
    ...config,
    componentName,
    description,
    propsSchema,
  }

  return InteractableComponent
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get interactable config from a wrapped component
 */
export function getInteractableConfig<P>(
  component: React.ComponentType<P & InteractableProps>
): InteractableConfig<P> | undefined {
  return (component as unknown as { __interactableConfig?: InteractableConfig<P> }).__interactableConfig
}

/**
 * Check if a component is interactable
 */
export function isInteractableComponent(
  component: React.ComponentType<unknown>
): boolean {
  return '__interactableConfig' in component
}

export default withInteractable
