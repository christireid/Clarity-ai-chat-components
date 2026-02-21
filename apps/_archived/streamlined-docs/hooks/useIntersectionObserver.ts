'use client'

import { useEffect, useState, RefObject } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

/**
 * Hook to detect when an element enters the viewport using Intersection Observer API
 *
 * @example
 * ```tsx
 * const ref = useRef(null)
 * const isVisible = useIntersectionObserver(ref, {
 *   threshold: 0.1,
 *   rootMargin: '100px',
 *   triggerOnce: true
 * })
 * ```
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
  options: UseIntersectionObserverOptions = {}
): boolean {
  const { threshold = 0, rootMargin = '0px', triggerOnce = true } = options
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.disconnect()
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [elementRef, threshold, rootMargin, triggerOnce])

  return isVisible
}
