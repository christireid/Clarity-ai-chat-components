/**
 * React 19 Hook for Time-Travel Debugging
 * Uses useOptimistic for state snapshots
 */
'use client';
import * as React from 'react';
import { useOptimistic, useCallback, useMemo, useTransition } from 'react';
import { TimeTravelDebugger } from '../../debug/time-travel';
function reducer(state, action) {
    switch (action.type) {
        case 'RECORD':
            return {
                snapshots: [...state.snapshots, action.snapshot],
                currentIndex: state.snapshots.length,
            };
        case 'JUMP_TO':
            return {
                ...state,
                currentIndex: Math.max(0, Math.min(action.index, state.snapshots.length - 1)),
            };
        case 'GO_BACK':
            return {
                ...state,
                currentIndex: Math.max(0, state.currentIndex - action.steps),
            };
        case 'GO_FORWARD':
            return {
                ...state,
                currentIndex: Math.min(state.snapshots.length - 1, state.currentIndex + action.steps),
            };
        case 'CLEAR':
            return {
                snapshots: [],
                currentIndex: -1,
            };
        default:
            return state;
    }
}
/**
 * Hook for Time-Travel Debugging with optimistic updates
 */
export function useTimeTravel(timeTravelDebugger) {
    // Use ref to maintain stable instance across renders
    const timeTravelRef = React.useRef(null);
    if (!timeTravelRef.current) {
        timeTravelRef.current = timeTravelDebugger || new TimeTravelDebugger();
    }
    const timeTravel = timeTravelRef.current;
    // Initialize state from time travel debugger
    // Note: currentIndex is private, so we calculate from the snapshot count
    const [initialState] = React.useState(() => {
        const snapshots = timeTravel.getAll();
        return {
            snapshots,
            currentIndex: snapshots.length > 0 ? snapshots.length - 1 : -1,
        };
    });
    const [state, dispatch] = useOptimistic(initialState, reducer);
    // React 19 requires useOptimistic updates to be called within a transition
    const [, startTransition] = useTransition();
    const record = useCallback((messages, config, metadata, label) => {
        const snapshotId = timeTravel.record(messages, config, metadata, label);
        const snapshot = timeTravel.getCurrent();
        if (snapshot) {
            startTransition(() => {
                dispatch({ type: 'RECORD', snapshot });
            });
        }
        return snapshotId;
    }, [timeTravel, dispatch, startTransition]);
    const jumpTo = useCallback((snapshotId) => {
        const snapshot = timeTravel.jumpTo(snapshotId);
        if (snapshot) {
            const index = state.snapshots.findIndex(s => s.id === snapshotId);
            if (index !== -1) {
                startTransition(() => {
                    dispatch({ type: 'JUMP_TO', index });
                });
            }
        }
        return snapshot;
    }, [timeTravel, dispatch, state.snapshots, startTransition]);
    const goBack = useCallback((steps = 1) => {
        const snapshot = timeTravel.goBack(steps);
        if (snapshot) {
            startTransition(() => {
                dispatch({ type: 'GO_BACK', steps });
            });
        }
        return snapshot;
    }, [timeTravel, dispatch, startTransition]);
    const goForward = useCallback((steps = 1) => {
        const snapshot = timeTravel.goForward(steps);
        if (snapshot) {
            startTransition(() => {
                dispatch({ type: 'GO_FORWARD', steps });
            });
        }
        return snapshot;
    }, [timeTravel, dispatch, startTransition]);
    const clear = useCallback(() => {
        timeTravel.clear();
        startTransition(() => {
            dispatch({ type: 'CLEAR' });
        });
    }, [timeTravel, dispatch, startTransition]);
    const current = useMemo(() => {
        return state.currentIndex >= 0 ? state.snapshots[state.currentIndex] : null;
    }, [state.snapshots, state.currentIndex]);
    const timeline = useMemo(() => {
        return timeTravel.getTimeline();
    }, [state.snapshots, timeTravel]);
    const stats = useMemo(() => {
        return timeTravel.getStats();
    }, [state.snapshots, timeTravel]);
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
    };
}
//# sourceMappingURL=use-time-travel.js.map