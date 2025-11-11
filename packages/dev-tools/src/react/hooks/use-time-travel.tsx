/**
 * React 19 Hook for Time-Travel Debugging
 * Uses useOptimistic for state snapshots
 */

'use client'

import { useOptimistic, useCallback, useMemo } from 'react'
import { TimeTravelDebugger, type StateSnapshot } from '../debug/time-travel'

interface TimeTravelState {
  snapshots: StateSnapshot[]
  currentIndex: number
}

function reducer(
  state: TimeTravelState,
  action:
    | { type: 'RECORD'; snapshot: StateSnapshot }
    | { type: 'JUMP_TO'; index: number }
    | { type: 'GO_BACK'; steps: number }
    | { type: 'GO_FORWARD'; steps: number }
    | { type: 'CLEAR' }
): TimeTravelState {
  switch (action.type) {
    case 'RECORD':
      return {
        snapshots: [...state.snapshots, action.snapshot],
        currentIndex: state.snapshots.length,
      }
    case 'JUMP_TO':
      return {
        ...state,
        currentIndex: Math.max(0, Math.min(action.index, state.snapshots.length - 1)),
      }
    case 'GO_BACK':
      return {
        ...state,
        currentIndex: Math.max(0, state.currentIndex - action.steps),
      }
    case 'GO_FORWARD':
      return {
        ...state,
        currentIndex: Math.min(state.snapshots.length - 1, state.currentIndex + action.steps),
      }
    case 'CLEAR':
      return {
        snapshots: [],
        currentIndex: -1,
      }
    default:
      return state
  }
}

/**
 * Hook for Time-Travel Debugging with optimistic updates
 */
export function useTimeTravel(debugger?: TimeTravelDebugger) {
  const timeTravel = debugger || new TimeTravelDebugger()
  
  const [state, dispatch] = useOptimistic<TimeTravelState, any>(
    {
      snapshots: timeTravel.getAll(),
      currentIndex: timeTravel['currentIndex'] || -1,
    },
    reducer
  )

  const record = useCallback((
    messages: any[],
    config: any,
    metadata?: Record<string, any>,
    label?: string
  ) => {
    const snapshotId = timeTravel.record(messages, config, metadata, label)
    const snapshot = timeTravel.getCurrent()
    if (snapshot) {
      dispatch({ type: 'RECORD', snapshot })
    }
    return snapshotId
  }, [timeTravel, dispatch])

  const jumpTo = useCallback((snapshotId: string) => {
    const snapshot = timeTravel.jumpTo(snapshotId)
    if (snapshot) {
      const index = state.snapshots.findIndex(s => s.id === snapshotId)
      if (index !== -1) {
        dispatch({ type: 'JUMP_TO', index })
      }
    }
    return snapshot
  }, [timeTravel, dispatch, state.snapshots])

  const goBack = useCallback((steps: number = 1) => {
    const snapshot = timeTravel.goBack(steps)
    if (snapshot) {
      dispatch({ type: 'GO_BACK', steps })
    }
    return snapshot
  }, [timeTravel, dispatch])

  const goForward = useCallback((steps: number = 1) => {
    const snapshot = timeTravel.goForward(steps)
    if (snapshot) {
      dispatch({ type: 'GO_FORWARD', steps })
    }
    return snapshot
  }, [timeTravel, dispatch])

  const clear = useCallback(() => {
    timeTravel.clear()
    dispatch({ type: 'CLEAR' })
  }, [timeTravel, dispatch])

  const current = useMemo(() => {
    return state.currentIndex >= 0 ? state.snapshots[state.currentIndex] : null
  }, [state.snapshots, state.currentIndex])

  const timeline = useMemo(() => {
    return timeTravel.getTimeline()
  }, [state.snapshots, timeTravel])

  const stats = useMemo(() => {
    return timeTravel.getStats()
  }, [state.snapshots, timeTravel])

  return {
    snapshots: state.snapshots,
    currentIndex: state.currentIndex,
    current,
    timeline,
    stats,
    record,
    jumpTo,
    goBack,
    goForward,
    clear,
  }
}
