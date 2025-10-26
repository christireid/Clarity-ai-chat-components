import * as React from 'react'

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * Freeze the observed state on first intersection
   * @default false
   */
  freezeOnceVisible?: boolean
}

export interface UseIntersectionObserverReturn {
  /**
   * Ref to attach to element
   */
  ref: React.RefObject<HTMLElement>
  /**
   * IntersectionObserver entry
   */
  entry?: IntersectionObserverEntry
  /**
   * Whether element is intersecting
   */
  isIntersecting: boolean
}

/**
 * Observe element intersection with viewport using IntersectionObserver
 * Perfect for lazy loading, infinite scroll, and animations on scroll
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
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options

  const ref = React.useRef<HTMLElement>(null)
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>()

  const frozen = entry?.isIntersecting && freezeOnceVisible

  React.useEffect(() => {
    const node = ref.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(([entry]) => setEntry(entry), observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [threshold, root, rootMargin, frozen])

  return {
    ref,
    entry,
    isIntersecting: !!entry?.isIntersecting,
  }
}
