/**
 * Enhanced Performance Optimization Utilities
 * 
 * Consolidates performance utilities from:
 * - /apps/docs/lib/performance/performanceOptimizations.ts
 * - /packages/react/src/hooks/performance/
 * 
 * Provides comprehensive performance optimization hooks for React components
 * with focus on React 19, Next.js 15, and modern browser capabilities.
 * 
 * @module @clarity-chat/react/performance
 * 
 * @example
 * ```tsx
 * import {
 *   useMemoizedCallback,
 *   useBatchedState,
 *   useUpdateEffect,
 *   useThrottledEffect,
 *   useVirtualList,
 *   useSmartCache,
 *   useSmartThrottle
 * } from '@clarity-chat/react/performance'
 * 
 * function OptimizedComponent() {
 *   // Memoized callback that maintains referential equality
 *   const handleClick = useMemoizedCallback((id: string) => {
 *     console.log('Clicked:', id)
 *   }, [])
 *   
 *   // Batched state updates to reduce re-renders
 *   const [state, setState, startBatch, endBatch] = useBatchedState({ count: 0 })
 *   
 *   // Effect that skips initial render
 *   useUpdateEffect(() => {
 *     console.log('Component updated')
 *   }, [dependency])
 *   
 *   return <div>...</div>
 * }
 * ```
 */

import { 
  useCallback, 
  useMemo, 
  useRef, 
  useEffect, 
  useState, 
  useContext,
  DependencyList,
  useLayoutEffect
} from 'react';

// ============================================================================
// Core Performance Hooks
// ============================================================================

/**
 * Enhanced memoized callback that maintains referential equality
 * Prevents unnecessary re-renders by maintaining stable function references
 * 
 * @param callback - The callback function to memoize
 * @param deps - Dependencies array for React's dependency checking
 * @returns Memoized callback with stable reference
 */
export function useMemoizedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: DependencyList
): T {
  const callbackRef = useRef<T>(callback);
  const memoizedCallback = useRef<T>();

  // Update callback reference when it changes
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // Create memoized version that maintains referential equality
  if (!memoizedCallback.current) {
    memoizedCallback.current = function (this: unknown, ...args: unknown[]) {
      return callbackRef.current.apply(this, args);
    } as T;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps controls when to recreate the callback
  return useMemo(() => memoizedCallback.current!, deps);
}

/**
 * Enhanced batched state management
 * Reduces re-renders by batching multiple state updates into a single update
 * 
 * @param initialState - Initial state value or factory function
 * @returns Tuple with state, batched setState, startBatch, and endBatch functions
 */
export function useBatchedState<T>(
  initialState: T | (() => T)
): readonly [
  T,
  (updates: Partial<T> | ((prev: T) => Partial<T>)) => void,
  () => void,
  () => void
] {
  const [state, setState] = useState(initialState);
  const isBatchingRef = useRef(false);
  const pendingUpdatesRef = useRef<Partial<T>>({});

  const batchedSetState = useCallback(
    (updates: Partial<T> | ((prev: T) => Partial<T>)) => {
      if (isBatchingRef.current) {
        // Queue updates during batching
        const currentUpdates = typeof updates === 'function' ? updates(state) : updates;
        pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...currentUpdates };
      } else {
        setState(prev => {
          const newUpdates = typeof updates === 'function' ? updates(prev) : updates;
          return { ...prev, ...newUpdates };
        });
      }
    },
    [state]
  );

  const startBatch = useCallback(() => {
    isBatchingRef.current = true;
    console.log('Batched state updates started');
  }, []);

  const endBatch = useCallback(() => {
    isBatchingRef.current = false;
    if (Object.keys(pendingUpdatesRef.current).length > 0) {
      setState(prev => ({ ...prev, ...pendingUpdatesRef.current }));
      pendingUpdatesRef.current = {};
      console.log('Batched state updates applied');
    }
  }, []);

  return [state, batchedSetState, startBatch, endBatch] as const;
}

// ============================================================================
// Effect Optimization Hooks
// ============================================================================

/**
 * Optimized effect that skips initial render
 * Useful for effects that should only run on updates, not initial render
 * 
 * @param effect - Effect function to run
 * @param deps - Dependencies array
 */
export function useUpdateEffect(
  effect: () => void | (() => void),
  deps: DependencyList
): void {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps is user-provided and controls when effect runs
  }, deps);
}

/**
 * Throttled effect that limits execution frequency
 * Prevents performance issues from effects firing too frequently
 * 
 * @param effect - Effect function to run
 * @param deps - Dependencies array
 * @param delay - Throttle delay in milliseconds
 */
export function useThrottledEffect(
  effect: () => void | (() => void),
  deps: DependencyList,
  delay: number
): void {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const cleanupRef = useRef<(() => void) | void>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      cleanupRef.current = effect();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps is user-provided and controls when effect runs
  }, [...deps, delay]);
}

/**
 * Debounced effect that delays execution until dependencies stabilize
 * Useful for search inputs and other frequently changing values
 * 
 * @param effect - Effect function to run
 * @param deps - Dependencies array
 * @param delay - Debounce delay in milliseconds
 */
export function useDebouncedEffect(
  effect: () => void | (() => void),
  deps: DependencyList,
  delay: number
): void {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const cleanupRef = useRef<(() => void) | void>();

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set up new timeout
    timeoutRef.current = setTimeout(() => {
      cleanupRef.current = effect();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps is user-provided and controls when effect runs
  }, [...deps, delay]);
}

// ============================================================================
// Memoization Hooks
// ============================================================================

/**
 * Optimized selector that memoizes result
 * Prevents unnecessary computations by memoizing selector results
 * 
 * @param selector - Selector function
 * @param state - State to pass to selector
 * @param deps - Additional dependencies
 * @returns Memoized selector result
 */
export function useMemoizedSelector<T, R>(
  selector: (state: T) => R,
  state: T,
  deps: DependencyList = []
): R {
  const selectorRef = useRef(selector);
  const resultRef = useRef<R>();
  const stateRef = useRef<T>();

  // Update selector reference
  useLayoutEffect(() => {
    selectorRef.current = selector;
  });

  // Only recompute if state or selector changed
  if (stateRef.current !== state || !resultRef.current) {
    resultRef.current = selectorRef.current(state);
    stateRef.current = state;
    console.log('MemoizedSelector recomputed', { stateChanged: stateRef.current !== state });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps controls when to recompute the selector
  return useMemo(() => resultRef.current!, [...deps, state]);
}

/**
 * Deep memoization hook that performs deep comparison of dependencies
 * Useful when dealing with objects or arrays that may have the same content but different references
 * 
 * @param factory - Factory function that returns the memoized value
 * @param deps - Dependencies array
 * @returns Memoized value with deep comparison
 */
export function useDeepMemo<T>(
  factory: () => T,
  deps: DependencyList
): T {
  const depsRef = useRef(deps);
  const valueRef = useRef<T>();

  // Deep comparison of dependencies
  const depsChanged = !deepEqual(depsRef.current, deps);

  if (depsChanged || valueRef.current === undefined) {
    depsRef.current = deps;
    valueRef.current = factory();
    console.log('useDeepMemo recomputed', { depsChanged });
  }

  return valueRef.current!;
}

// ============================================================================
// Virtual Scrolling
// ============================================================================

export interface VirtualListConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  itemCount?: number;
}

export interface VirtualListResult<T> {
  virtualItems: T[];
  totalHeight: number;
  paddingTop: number;
  paddingBottom: number;
  startIndex: number;
  endIndex: number;
  setScrollTop: (scrollTop: number) => void;
  scrollTop: number;
}

/**
 * Enhanced virtual scrolling for large lists
 * Only renders visible items plus overscan for smooth scrolling
 * 
 * @param items - Array of items to virtualize
 * @param config - Virtual list configuration
 * @returns Virtualized list data
 */
export function useVirtualList<T>(
  items: T[],
  config: VirtualListConfig
): VirtualListResult<T> {
  const { itemHeight, containerHeight, overscan = 3, itemCount = items.length } = config;
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = itemCount * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1);
  }, [items, startIndex, endIndex]);

  const paddingTop = startIndex * itemHeight;
  const paddingBottom = (itemCount - endIndex - 1) * itemHeight;

  console.log('Virtual list computed', {
    totalItems: itemCount,
    visibleItems: virtualItems.length,
    startIndex,
    endIndex,
    overscan
  });

  return {
    virtualItems,
    totalHeight,
    paddingTop,
    paddingBottom,
    startIndex,
    endIndex,
    setScrollTop,
    scrollTop
  };
}

/**
 * Dynamic virtual list that adjusts to variable item heights
 * 
 * @param items - Array of items to virtualize
 * @param getItemHeight - Function to get height for each item
 * @param config - Virtual list configuration
 * @returns Virtualized list data with dynamic heights
 */
export function useDynamicVirtualList<T>(
  items: T[],
  getItemHeight: (item: T, index: number) => number,
  config: Omit<VirtualListConfig, 'itemHeight'>
): VirtualListResult<T> {
  const { containerHeight, overscan = 3, itemCount = items.length } = config;
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate cumulative heights
  const cumulativeHeights = useMemo(() => {
    const heights = [0];
    for (let i = 0; i < itemCount; i++) {
      heights.push(heights[i] + getItemHeight(items[i], i));
    }
    return heights;
  }, [items, getItemHeight, itemCount]);

  const totalHeight = cumulativeHeights[itemCount] || 0;

  // Find start and end indices based on scroll position
  const startIndex = useMemo(() => {
    let low = 0;
    let high = itemCount - 1;
    
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midHeight = cumulativeHeights[mid];
      
      if (midHeight <= scrollTop) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    
    return Math.max(0, high - overscan);
  }, [scrollTop, cumulativeHeights, overscan, itemCount]);

  const endIndex = useMemo(() => {
    const viewportBottom = scrollTop + containerHeight;
    let low = startIndex;
    let high = itemCount - 1;
    
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midHeight = cumulativeHeights[mid + 1] || totalHeight;
      
      if (midHeight < viewportBottom) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    
    return Math.min(itemCount - 1, low + overscan);
  }, [scrollTop, containerHeight, cumulativeHeights, totalHeight, overscan, startIndex, itemCount]);

  const virtualItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1);
  }, [items, startIndex, endIndex]);

  const paddingTop = cumulativeHeights[startIndex] || 0;
  const paddingBottom = totalHeight - (cumulativeHeights[endIndex + 1] || totalHeight);

  return {
    virtualItems,
    totalHeight,
    paddingTop,
    paddingBottom,
    startIndex,
    endIndex,
    setScrollTop,
    scrollTop
  };
}

// ============================================================================
// Event Handling Hooks
// ============================================================================

/**
 * Optimized event handling with event delegation
 * Reduces memory usage by delegating events to parent container
 * 
 * @param eventType - Type of event to delegate
 * @param handler - Event handler function
 * @param containerRef - Reference to container element
 * @param options - Event listener options
 */
export function useEventDelegation(
  eventType: string,
  handler: (event: Event) => void,
  containerRef: React.RefObject<HTMLElement>,
  options?: AddEventListenerOptions
): void {
  // Store handler in ref to avoid recreating listener on every handler change
  const handlerRef = useRef(handler);
  useLayoutEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // Memoize options to prevent unnecessary listener recreation
  const memoizedOptions = useDeepMemo(
    () => ({
      passive: true,
      ...options,
    }),
    [options]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const delegatedHandler = (event: Event) => {
      // Check if event target matches our criteria
      handlerRef.current(event);
    };

    container.addEventListener(eventType, delegatedHandler, memoizedOptions);

    console.log('Event delegation set up', {
      eventType,
      container: container.tagName,
      options: memoizedOptions
    });

    return () => {
      container.removeEventListener(eventType, delegatedHandler);
    };
  }, [eventType, containerRef, memoizedOptions]);
}

/**
 * Intersection Observer hook for lazy loading and viewport detection
 * 
 * @param callback - Intersection callback
 * @param options - Intersection observer options
 * @returns Ref to attach to observed element
 */
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void,
  options?: IntersectionObserverInit
): React.RefObject<HTMLElement> {
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Store callback in ref to avoid recreating observer on every callback change
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Memoize options to prevent unnecessary observer recreation
  const memoizedOptions = useDeepMemo(
    () => ({
      rootMargin: '50px', // Start loading 50px before visible
      threshold: 0.01, // Trigger when 1% visible
      ...options,
    }),
    [options]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const stableCallback: IntersectionObserverCallback = (entries, observer) => {
      callbackRef.current(entries, observer);
    };

    observerRef.current = new IntersectionObserver(stableCallback, memoizedOptions);

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [memoizedOptions]);

  return elementRef;
}

// ============================================================================
// Context Optimization
// ============================================================================

/**
 * Memoized context selector to prevent context re-renders
 * Only re-renders when selected value changes
 * 
 * @param context - React context
 * @param selector - Selector function to extract relevant data
 * @returns Selected value
 */
export function useContextSelector<T, R>(
  context: React.Context<T>,
  selector: (value: T) => R
): R {
  const contextValue = useContext(context);

  // Store selector in ref to avoid unnecessary recalculations
  const selectorRef = useRef(selector);
  useLayoutEffect(() => {
    selectorRef.current = selector;
  }, [selector]);

  const selectedValue = useMemo(() => selectorRef.current(contextValue), [contextValue]);

  console.log('Context selector computed', {
    contextChanged: contextValue !== selectedValue,
    selectorName: selector.name || 'anonymous'
  });

  return selectedValue;
}

/**
 * Split context into multiple contexts to optimize re-renders
 * 
 * @param contexts - Array of context tuples [Context, selector]
 * @returns Array of selected values
 */
export function useMultipleContexts<T extends readonly [React.Context<unknown>, (value: unknown) => unknown][]>(
  contexts: T
): { [K in keyof T]: T[K] extends [React.Context<unknown>, (value: unknown) => infer R] ? R : never } {
  return contexts.map(([context, selector]) => {
    const contextValue = useContext(context);
    return selector(contextValue);
  }) as { [K in keyof T]: T[K] extends [React.Context<unknown>, (value: unknown) => infer R] ? R : never };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Deep equality comparison for objects and arrays
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === 'object' && typeof b === 'object') {
    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);
    if (aIsArray !== bIsArray) return false;

    if (aIsArray && bIsArray) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => deepEqual(item, b[index]));
    }

    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const keysA = Object.keys(aObj);
    const keysB = Object.keys(bObj);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => {
      if (!keysB.includes(key)) return false;
      return deepEqual(aObj[key], bObj[key]);
    });
  }

  return false;
}

/**
 * Performance measurement utility
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log('Performance measurement', {
    name,
    duration: end - start,
    timestamp: new Date().toISOString()
  });
  
  return result;
}

// Re-export commonly used React hooks for convenience
export { useCallback, useMemo, useRef, useEffect, useLayoutEffect } from 'react';