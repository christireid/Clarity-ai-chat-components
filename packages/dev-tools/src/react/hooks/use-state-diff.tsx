/**
 * React hook for State Diff Visualization
 *
 * Automatically tracks state changes, generates visual diffs, and enables
 * time-travel debugging with rollback support.
 *
 * @module useStateDiff
 *
 * @example
 * ```tsx
 * import { useStateDiff } from '@clarity-chat/dev-tools'
 *
 * function FormComponent() {
 *   const [formState, setFormState] = useState({ name: '', email: '' })
 *   const { currentDiff, snapshots, goBack } = useStateDiff(formState, {
 *     label: 'form-state',
 *     autoTrack: true
 *   })
 *
 *   // Undo last change
 *   const handleUndo = () => {
 *     const prev = goBack()
 *     if (prev) setFormState(prev.state as typeof formState)
 *   }
 *
 *   return <div>{snapshots.length} changes recorded</div>
 * }
 * ```
 */

'use client'

import * as React from 'react'
import {
  getStateDiff,
  createStateDiff,
  type StateDiff,
  type DiffResult,
  type StateSnapshot,
  type DiffOptions,
} from '../../debug/state-diff'

export interface UseStateDiffOptions {
  label?: string
  maxSnapshots?: number
  diffOptions?: Partial<DiffOptions>
  autoTrack?: boolean
}

export interface UseStateDiffReturn<T> {
  currentDiff: DiffResult | null
  snapshots: StateSnapshot[]
  record: (state: T, label?: string) => StateSnapshot
  diff: (oldState: T, newState: T) => DiffResult
  goBack: (steps?: number) => StateSnapshot | null
  goForward: (steps?: number) => StateSnapshot | null
  getCurrent: () => StateSnapshot | null
  clear: () => void
  formatDiff: (diff: DiffResult) => string
  export: () => string
}

/**
 * Hook to track and visualize state changes with time-travel support
 *
 * @typeParam T - The type of state being tracked
 * @param state - The current state value to track
 * @param options - Configuration options for tracking and diffing
 * @returns Object with diff results, snapshots, and navigation functions
 */
export function useStateDiff<T>(
  state: T,
  options: UseStateDiffOptions = {}
): UseStateDiffReturn<T> {
  const { label, maxSnapshots, diffOptions, autoTrack = true } = options

  const differ = React.useMemo(() => {
    return createStateDiff({ maxSnapshots, diffOptions })
  }, [maxSnapshots, diffOptions])

  const [currentDiff, setCurrentDiff] = React.useState<DiffResult | null>(null)
  const [snapshots, setSnapshots] = React.useState<StateSnapshot[]>([])
  const prevStateRef = React.useRef<T>(state)
  const isFirstRender = React.useRef(true)

  // Auto-track state changes
  React.useEffect(() => {
    if (!autoTrack) return

    if (isFirstRender.current) {
      // Record initial state
      differ.snapshot(state, label ?? 'Initial')
      isFirstRender.current = false
      setSnapshots(differ.getSnapshots())
      return
    }

    // Check if state actually changed
    if (prevStateRef.current !== state) {
      const snapshot = differ.snapshot(state, label)
      setCurrentDiff(snapshot.diff ?? null)
      setSnapshots(differ.getSnapshots())
      prevStateRef.current = state
    }
  }, [state, autoTrack, label, differ])

  const record = React.useCallback(
    (newState: T, snapshotLabel?: string) => {
      const snapshot = differ.snapshot(newState, snapshotLabel)
      setCurrentDiff(snapshot.diff ?? null)
      setSnapshots(differ.getSnapshots())
      return snapshot
    },
    [differ]
  )

  const diffFn = React.useCallback(
    (oldState: T, newState: T) => {
      return differ.diff(oldState, newState)
    },
    [differ]
  )

  const goBack = React.useCallback(
    (steps: number = 1) => {
      const snapshot =
        differ.getSnapshots()[differ.getSnapshots().length - 1 - steps]
      setSnapshots(differ.getSnapshots())
      return snapshot ?? null
    },
    [differ]
  )

  const goForward = React.useCallback(
    (steps: number = 1) => {
      const snapshot = differ.getSnapshots()[steps]
      setSnapshots(differ.getSnapshots())
      return snapshot ?? null
    },
    [differ]
  )

  const getCurrent = React.useCallback(() => {
    const snaps = differ.getSnapshots()
    return snaps[snaps.length - 1] ?? null
  }, [differ])

  const clear = React.useCallback(() => {
    differ.clear()
    setCurrentDiff(null)
    setSnapshots([])
    isFirstRender.current = true
  }, [differ])

  const formatDiff = React.useCallback(
    (diff: DiffResult) => {
      return differ.formatDiff(diff)
    },
    [differ]
  )

  const exportData = React.useCallback(() => {
    return differ.export()
  }, [differ])

  return {
    currentDiff,
    snapshots,
    record,
    diff: diffFn,
    goBack,
    goForward,
    getCurrent,
    clear,
    formatDiff,
    export: exportData,
  }
}

/**
 * Hook to compute a diff between two values
 *
 * @typeParam T - The type of values being compared
 * @param value1 - The first value (treated as "old" state)
 * @param value2 - The second value (treated as "new" state)
 * @param options - Optional diff configuration
 * @returns DiffResult with changes, additions, and deletions
 *
 * @example
 * ```tsx
 * const diff = useDiff(previousData, currentData)
 * // diff.changes contains all detected differences
 * ```
 */
export function useDiff<T>(
  value1: T,
  value2: T,
  options?: Partial<DiffOptions>
): DiffResult {
  const differ = React.useMemo(() => {
    return createStateDiff({ diffOptions: options })
  }, [options])

  return React.useMemo(() => {
    return differ.diff(value1, value2)
  }, [differ, value1, value2])
}

export default useStateDiff
