'use client'

import * as React from 'react'

/**
 * A ref that can be either a callback ref or a mutable ref object
 */
type PossibleRef<T> = React.Ref<T> | undefined

/**
 * Set a value on a ref, handling both callback and object refs
 *
 * @param ref - The ref to set
 * @param value - The value to set on the ref
 */
function setRef<T>(ref: PossibleRef<T>, value: T): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null && ref !== undefined) {
    ;(ref as React.MutableRefObject<T>).current = value
  }
}

/**
 * Compose multiple refs into a single callback ref
 *
 * @description
 * This utility allows you to combine multiple refs (callback refs, ref objects,
 * or undefined refs) into a single ref that can be passed to a component.
 * This is useful when you need to:
 * - Forward a ref from forwardRef while also using a local ref
 * - Combine refs from multiple sources (e.g., parent + internal)
 *
 * @example
 * ```tsx
 * const MyComponent = React.forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
 *   const internalRef = React.useRef<HTMLDivElement>(null)
 *
 *   // Combine the forwarded ref with the internal ref
 *   const composedRef = composeRefs(forwardedRef, internalRef)
 *
 *   return <div ref={composedRef} {...props} />
 * })
 * ```
 *
 * @param refs - The refs to compose
 * @returns A callback ref that sets all provided refs
 */
export function composeRefs<T>(
  ...refs: PossibleRef<T>[]
): React.RefCallback<T> {
  return (node: T) => {
    refs.forEach((ref) => setRef(ref, node))
  }
}

/**
 * Hook to compose multiple refs into a single ref callback
 *
 * @description
 * This hook provides a memoized version of composeRefs that maintains
 * referential equality when the refs haven't changed. This is important
 * for avoiding unnecessary re-renders when passing the composed ref
 * to a child component.
 *
 * @example
 * ```tsx
 * const MyComponent = React.forwardRef<HTMLButtonElement, ButtonProps>(
 *   (props, forwardedRef) => {
 *     const internalRef = React.useRef<HTMLButtonElement>(null)
 *     const composedRef = useComposedRefs(forwardedRef, internalRef)
 *
 *     React.useEffect(() => {
 *       // Can access via internalRef.current
 *       console.log(internalRef.current?.offsetWidth)
 *     }, [])
 *
 *     return <button ref={composedRef} {...props} />
 *   }
 * )
 * ```
 *
 * @see {@link https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/composeRefs.tsx} Radix implementation
 *
 * @param refs - The refs to compose
 * @returns A stable callback ref that sets all provided refs
 */
export function useComposedRefs<T>(
  ...refs: PossibleRef<T>[]
): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs)
}

/**
 * Create a ref callback that can be used with forwardRef
 *
 * @description
 * Utility for creating a stable ref callback that handles both the
 * forwarded ref and a local ref. This is a convenience wrapper around
 * useComposedRefs for the common two-ref case.
 *
 * @example
 * ```tsx
 * const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
 *   const [localRef, composedRef] = useForwardedRef(ref)
 *
 *   const focus = () => localRef.current?.focus()
 *
 *   return <input ref={composedRef} {...props} />
 * })
 * ```
 *
 * @param forwardedRef - The ref from forwardRef
 * @returns [localRef, composedRef] - A local ref and the composed ref callback
 */
export function useForwardedRef<T>(
  forwardedRef: React.ForwardedRef<T>
): [React.RefObject<T | null>, React.RefCallback<T>] {
  const localRef = React.useRef<T | null>(null)
  const composedRef = useComposedRefs(forwardedRef, localRef)
  return [localRef, composedRef]
}
