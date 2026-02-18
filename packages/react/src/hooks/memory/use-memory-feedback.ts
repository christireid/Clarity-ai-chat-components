/**
 * Memory Operation Feedback Hook
 *
 * Provides UI feedback for memory operations (save, search, retrieval).
 * Subscribes to memory events and manages activity state for visual indicators.
 *
 * **Agent-Native Architecture Principle**:
 * "What the user can see, the agent can see" - Memory operations should be
 * visible to provide transparency and context awareness.
 */

import * as React from 'react'

/**
 * Memory activity types
 */
export type MemoryActivityType =
  | 'memory_saved'
  | 'memory_retrieved'
  | 'memory_searched'
  | 'memory_deleted'
  | 'memory_updated'

/**
 * Memory activity event
 */
export interface MemoryActivity {
  /** Activity type */
  type: MemoryActivityType
  /** Timestamp when activity occurred */
  timestamp: number
  /** Optional: Number of results (for search/retrieval) */
  count?: number
  /** Optional: Query that triggered the activity */
  query?: string
  /** Optional: Success/failure status */
  success?: boolean
  /** Optional: Error message if failed */
  error?: string
}

/**
 * Memory event from service
 */
export interface MemoryEvent {
  type: MemoryActivityType
  timestamp?: number
  results?: unknown[]
  query?: string
  success?: boolean
  error?: string
}

/**
 * Options for useMemoryFeedback hook
 */
export interface UseMemoryFeedbackOptions {
  /** Whether to enable memory feedback */
  enabled?: boolean
  /** Callback when activity occurs */
  onActivity?: (activity: MemoryActivity) => void
  /** Duration to show activity (ms) */
  activityDuration?: number
}

/**
 * Return type for useMemoryFeedback hook
 */
export interface UseMemoryFeedbackReturn {
  /** Current memory activity (null if none) */
  activity: MemoryActivity | null
  /** Recent activities (last N) */
  recentActivities: MemoryActivity[]
  /** Clear current activity */
  clearActivity: () => void
  /** Manually trigger activity (for testing/demo) */
  triggerActivity: (activity: MemoryActivity) => void
}

/**
 * Hook for managing memory operation feedback
 *
 * @example
 * ```tsx
 * function ChatWithMemory() {
 *   const { activity, recentActivities } = useMemoryFeedback({
 *     enabled: true,
 *     onActivity: (activity) => {
 *       if (activity.type === 'memory_saved') {
 *         toast.success('Memory saved')
 *       }
 *     }
 *   })
 *
 *   return (
 *     <div>
 *       <Chat />
 *       <MemoryActivityIndicator activity={activity} />
 *     </div>
 *   )
 * }
 * ```
 *
 * @param options - Configuration options
 * @returns Memory feedback state and controls
 */
export function useMemoryFeedback({
  enabled = true,
  onActivity,
  activityDuration = 3000,
}: UseMemoryFeedbackOptions = {}): UseMemoryFeedbackReturn {
  const [activity, setActivity] = React.useState<MemoryActivity | null>(null)
  const [recentActivities, setRecentActivities] = React.useState<
    MemoryActivity[]
  >([])
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Clear activity after duration
  React.useEffect(() => {
    if (activity && activityDuration > 0) {
      timeoutRef.current = setTimeout(() => {
        setActivity(null)
      }, activityDuration)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
    return undefined
  }, [activity, activityDuration])

  // Subscribe to memory events (reference implementation)
  React.useEffect(() => {
    if (!enabled) return

    // Memory service event subscription is available when
    // the memory package provides its event subscription API.
    // Integration: memoryService.subscribe((event) => triggerActivity(event))
  }, [enabled])

  // Trigger activity (internal helper)
  const triggerActivity = React.useCallback(
    (newActivity: MemoryActivity) => {
      setActivity(newActivity)
      setRecentActivities((prev) => [newActivity, ...prev].slice(0, 10)) // Keep last 10

      if (onActivity) {
        onActivity(newActivity)
      }
    },
    [onActivity]
  )

  // Clear activity
  const clearActivity = React.useCallback(() => {
    setActivity(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    activity,
    recentActivities,
    clearActivity,
    triggerActivity,
  }
}

/**
 * Convert memory event from service to activity
 *
 * Helper function to standardize event format.
 *
 * @param event - Raw memory event from service
 * @returns Standardized memory activity
 */
export function convertEventToActivity(event: MemoryEvent): MemoryActivity {
  return {
    type: event.type,
    timestamp: event.timestamp || Date.now(),
    count: event.results?.length,
    query: event.query,
    success: event.success !== false, // Default to true
    error: event.error,
  }
}

/**
 * Get icon for memory activity type
 *
 * Helper to map activity types to appropriate icons.
 *
 * @param type - Memory activity type
 * @returns Icon component identifier
 */
export function getActivityIcon(type: MemoryActivityType): string {
  switch (type) {
    case 'memory_saved':
      return 'save'
    case 'memory_retrieved':
      return 'download'
    case 'memory_searched':
      return 'search'
    case 'memory_deleted':
      return 'trash'
    case 'memory_updated':
      return 'refresh'
    default:
      return 'brain'
  }
}

/**
 * Get human-readable label for memory activity
 *
 * @param activity - Memory activity
 * @returns User-friendly label
 */
export function getActivityLabel(activity: MemoryActivity): string {
  const { type, count, success } = activity

  if (!success) {
    return `Memory operation failed`
  }

  switch (type) {
    case 'memory_saved':
      return 'Memory saved'
    case 'memory_retrieved':
      return count ? `${count} memories retrieved` : 'Memories retrieved'
    case 'memory_searched':
      return count ? `Found ${count} results` : 'Memory searched'
    case 'memory_deleted':
      return 'Memory deleted'
    case 'memory_updated':
      return 'Memory updated'
    default:
      return 'Memory operation'
  }
}
