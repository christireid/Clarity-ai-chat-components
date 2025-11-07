import * as React from 'react'

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * Freeze the observed state on first intersection
   * @default false
   */
  freezeOnceVisible?: boolean
  /**
   * Callback when intersection state changes
   */
  onChange?: (entry: IntersectionObserverEntry) => void
  /**
   * Enable observation immediately (default: true)
   */
  enabled?: boolean
}

export interface UseIntersectionObserverReturn {
  /**
   * Ref to attach to element (supports both RefObject and callback ref)
   */
  ref: React.RefCallback<HTMLElement>
  /**
   * IntersectionObserver entry
   */
  entry?: IntersectionObserverEntry
  /**
   * Whether element is intersecting
   */
  isIntersecting: boolean
  /**
   * Manually trigger observation
   */
  observe: () => void
  /**
   * Manually stop observation
   */
  unobserve: () => void
  /**
   * Whether observer is currently active
   */
  isObserving: boolean
}

/**
 * Observe element intersection with viewport using IntersectionObserver.
 * Perfect for lazy loading, infinite scroll, and animations on scroll.
 * 
 * **2025 Improvements**:
 * - Callback ref support (works with dynamic elements)
 * - Manual observe/unobserve methods
 * - onChange callback for intersection events
 * - Enabled flag for conditional observation
 * - Disconnect on frozen state (memory optimization)
 * - Type-safe entry state
 * 
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   freezeOnceVisible: true
 * })
 * 
 * return (
 *   <div
 *     ref={ref}
 *     className={isIntersecting ? 'animate-fade-in' : 'opacity-0'}
 *   >
 *     Content that fades in when 50% visible
 *   </div>
 * )
 * ```
 * 
 * @example
 * ```tsx
 * // With callback and manual control
 * const { ref, isIntersecting, observe, unobserve } = useIntersectionObserver({
 *   threshold: [0, 0.25, 0.5, 0.75, 1],
 *   onChange: (entry) => {
 *     console.log('Intersection ratio:', entry.intersectionRatio)
 *   },
 *   enabled: isVisible, // Conditional observation
 * })
 * 
 * return (
 *   <>
 *     <div ref={ref}>Observed element</div>
 *     <button onClick={unobserve}>Stop observing</button>
 *     <button onClick={observe}>Start observing</button>
 *   </>
 * )
 * ```
 * 
 * @example
 * ```tsx
 * // Infinite scroll
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 1.0,
 *   rootMargin: '100px', // Load 100px before element is visible
 * })
 * 
 * useEffect(() => {
 *   if (isIntersecting) {
 *     loadMoreItems()
 *   }
 * }, [isIntersecting])
 * 
 * return <div ref={ref}>Load more trigger</div>
 * ```
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
    onChange,
    enabled = true,
  } = options

  const [entry, setEntry] = React.useState<IntersectionObserverEntry>()
  const [isObserving, setIsObserving] = React.useState(false)
  
  const elementRef = React.useRef<HTMLElement | null>(null)
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  const onChangeRef = React.useRef(onChange)

  // Keep onChange ref up to date
  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const frozen = entry?.isIntersecting && freezeOnceVisible

  /**
   * Create and start observer
   */
  const observe = React.useCallback(() => {
    const node = elementRef.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node || !enabled) return

    // Disconnect existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      setEntry(entry)
      onChangeRef.current?.(entry)

      // Auto-disconnect if frozen on visible
      if (freezeOnceVisible && entry.isIntersecting) {
        observer.disconnect()
        setIsObserving(false)
        observerRef.current = null
      }
    }, observerParams)

    observer.observe(node)
    observerRef.current = observer
    setIsObserving(true)
  }, [threshold, root, rootMargin, frozen, freezeOnceVisible, enabled])

  /**
   * Stop observing
   */
  const unobserve = React.useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
      setIsObserving(false)
    }
  }, [])

  /**
   * Callback ref that supports dynamic elements
   */
  const ref = React.useCallback(
    (node: HTMLElement | null) => {
      // Unobserve previous element
      if (elementRef.current && observerRef.current) {
        observerRef.current.disconnect()
      }

      elementRef.current = node

      // Observe new element
      if (node && enabled) {
        observe()
      }
    },
    [observe, enabled]
  )

  // Auto-observe on mount and when dependencies change
  React.useEffect(() => {
    if (elementRef.current && enabled && !isObserving && !frozen) {
      observe()
    }
  }, [observe, enabled, isObserving, frozen])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      unobserve()
    }
  }, [unobserve])

  return {
    ref,
    entry,
    isIntersecting: !!entry?.isIntersecting,
    observe,
    unobserve,
    isObserving,
  }
}
