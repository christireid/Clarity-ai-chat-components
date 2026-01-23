/**
 * useMergedRef - Utility hook for merging multiple refs
 *
 * React 19 introduced ref as a prop pattern, which sometimes requires merging
 * internal refs with external refs passed as props. This hook provides a
 * type-safe, clean way to do that.
 *
 * @example
 * ```tsx
 * interface Props {
 *   ref?: React.Ref<HTMLDivElement>
 * }
 *
 * function MyComponent({ ref }: Props) {
 *   const internalRef = useRef<HTMLDivElement>(null)
 *   const mergedRef = useMergedRef(internalRef, ref)
 *
 *   return <div ref={mergedRef}>...</div>
 * }
 * ```
 */

'use client'

import * as React from 'react'

/**
 * Type for any valid React ref
 */
export type ReactRef<T> =
  | React.RefCallback<T>
  | React.MutableRefObject<T | null>
  | React.RefObject<T | null>
  | null
  | undefined

/**
 * Validates a ref in development mode
 * @internal
 */
function validateRef<T>(ref: unknown, index: number): ref is ReactRef<T> {
  if (ref === null || ref === undefined) {
    return true
  }

  if (typeof ref === 'function') {
    return true
  }

  if (typeof ref === 'object' && 'current' in ref) {
    return true
  }

  // Invalid ref type - warn in development
  if (process.env['NODE_ENV'] !== 'production') {
    console.warn(
      `[useMergedRef] Invalid ref at index ${index}. Expected a callback function, ` +
        `an object with a 'current' property, null, or undefined. ` +
        `Received: ${typeof ref}`,
      ref
    )
  }

  return false
}

/**
 * Sets a ref value, handling both callback refs and ref objects
 */
function setRef<T>(ref: ReactRef<T>, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref != null) {
    // Use type assertion only once, in a centralized location
    ;(ref as React.MutableRefObject<T | null>).current = value
  }
}

/**
 * Merges multiple refs into a single callback ref
 *
 * This is useful when you need to:
 * - Combine an internal ref with an external ref prop (React 19 pattern)
 * - Pass multiple refs to a single element
 * - Forward refs while maintaining internal access
 *
 * @param refs - Array of refs to merge
 * @returns A callback ref that sets all provided refs
 *
 * @example
 * ```tsx
 * // Basic usage - merge internal and external refs
 * function Input({ ref }: { ref?: React.Ref<HTMLInputElement> }) {
 *   const internalRef = useRef<HTMLInputElement>(null)
 *   const mergedRef = useMergedRef(internalRef, ref)
 *
 *   useEffect(() => {
 *     // Can use internalRef.current here
 *     internalRef.current?.focus()
 *   }, [])
 *
 *   return <input ref={mergedRef} />
 * }
 *
 * // Usage with multiple refs
 * const ref1 = useRef<HTMLDivElement>(null)
 * const ref2 = useRef<HTMLDivElement>(null)
 * const ref3 = useCallback((el) => console.log(el), [])
 * const merged = useMergedRef(ref1, ref2, ref3)
 * ```
 */
export function useMergedRef<T>(...refs: ReactRef<T>[]): React.RefCallback<T> {
  // Validate refs in development mode
  if (process.env['NODE_ENV'] !== 'production') {
    refs.forEach((ref, index) => validateRef(ref, index))
  }

  return React.useCallback(
    (element: T | null) => {
      refs.forEach((ref) => setRef(ref, element))
    },

    refs
  )
}

/**
 * Creates a merged ref without memoization
 *
 * Use this when you need to merge refs outside of a React component
 * or when you're already handling memoization yourself.
 *
 * @param refs - Array of refs to merge
 * @returns A callback ref that sets all provided refs
 *
 * @example
 * ```tsx
 * const mergedRef = mergeRefs(ref1, ref2, ref3)
 * ```
 */
export function mergeRefs<T>(...refs: ReactRef<T>[]): React.RefCallback<T> {
  // Validate refs in development mode
  if (process.env['NODE_ENV'] !== 'production') {
    refs.forEach((ref, index) => validateRef(ref, index))
  }

  return (element: T | null) => {
    refs.forEach((ref) => setRef(ref, element))
  }
}

/**
 * Creates a ref callback that also calls an optional cleanup function
 *
 * React 19 supports cleanup functions returned from ref callbacks.
 * This utility makes it easy to combine ref merging with cleanup.
 *
 * @param refs - Array of refs to merge
 * @param cleanup - Optional cleanup function called when element unmounts
 * @returns A callback ref with cleanup support
 *
 * @example
 * ```tsx
 * function ResizeObserverComponent({ ref }: { ref?: React.Ref<HTMLDivElement> }) {
 *   const internalRef = useRef<HTMLDivElement>(null)
 *   const observerRef = useRef<ResizeObserver | null>(null)
 *
 *   const mergedRef = useMergedRefWithCleanup(
 *     [internalRef, ref],
 *     () => {
 *       // Cleanup: disconnect observer
 *       observerRef.current?.disconnect()
 *       observerRef.current = null
 *     }
 *   )
 *
 *   useEffect(() => {
 *     if (internalRef.current) {
 *       observerRef.current = new ResizeObserver((entries) => {
 *         // Handle resize
 *       })
 *       observerRef.current.observe(internalRef.current)
 *     }
 *   }, [])
 *
 *   return <div ref={mergedRef}>...</div>
 * }
 * ```
 */
export function useMergedRefWithCleanup<T>(
  refs: ReactRef<T>[],
  cleanup?: () => void
): React.RefCallback<T> {
  return React.useCallback(
    (element: T | null) => {
      refs.forEach((ref) => setRef(ref, element))

      // React 19: Return cleanup function
      if (element === null && cleanup) {
        cleanup()
      }
    },

    [...refs, cleanup]
  )
}

/**
 * Assigns a value to a ref, handling both callback and object refs
 *
 * Exported for cases where you need to manually set a ref value
 * without using the merged ref pattern.
 *
 * @param ref - The ref to assign to
 * @param value - The value to assign
 *
 * @example
 * ```tsx
 * const myRef = useRef<HTMLDivElement>(null)
 * assignRef(myRef, document.createElement('div'))
 * ```
 */
export function assignRef<T>(ref: ReactRef<T>, value: T | null): void {
  setRef(ref, value)
}

export default useMergedRef
