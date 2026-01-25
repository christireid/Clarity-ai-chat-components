'use client'

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  type RefObject,
  type DependencyList,
} from 'react'
import { useSafeAnimationFrame } from './use-safe-timeout'
import { useThrottledCallback } from './use-throttle'

export interface UseAutoScrollOptions {
  /**
   * Whether auto-scroll is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Scroll behavior
   * @default 'smooth'
   */
  behavior?: ScrollBehavior
  /**
   * Distance from bottom (px) to trigger auto-scroll
   * @default 100
   */
  threshold?: number
  /**
   * Dependencies that trigger scroll check
   */
  dependencies?: DependencyList
}

export interface UseAutoScrollReturn {
  /**
   * Ref to attach to scrollable container
   */
  scrollRef: RefObject<HTMLElement | null>
  /**
   * Whether user is near bottom
   */
  isNearBottom: boolean
  /**
   * Manually scroll to bottom
   */
  scrollToBottom: () => void
  /**
   * Manually enable/disable auto-scroll
   */
  setEnabled: (enabled: boolean) => void
}

/**
 * Auto-scroll to bottom of container when new content is added
 * Only scrolls if user is near bottom to avoid disrupting manual scrolling
 *
 * @example
 * ```tsx
 * const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
 *   dependencies: [messages],
 *   threshold: 50
 * })
 *
 * return (
 *   <div ref={scrollRef} className="overflow-y-auto">
 *     {messages.map(msg => <Message key={msg.id} {...msg} />)}
 *     {!isNearBottom && (
 *       <button onClick={scrollToBottom}>Scroll to bottom</button>
 *     )}
 *   </div>
 * )
 * ```
 */
export function useAutoScroll(
  options: UseAutoScrollOptions = {}
): UseAutoScrollReturn {
  const {
    enabled: initialEnabled = true,
    behavior = 'smooth',
    threshold = 100,
    dependencies = [],
  } = options

  const scrollRef = useRef<HTMLElement>(null)
  const [enabled, setEnabled] = useState(initialEnabled)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const { requestSafeAnimationFrame } = useSafeAnimationFrame()

  // Check if user is near bottom (store in ref to avoid dependency issues)
  const checkIfNearBottomRef = useRef(() => {
    const element = scrollRef.current
    if (!element) return false
    const { scrollTop, scrollHeight, clientHeight } = element
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    return distanceFromBottom <= threshold
  })

  useLayoutEffect(() => {
    checkIfNearBottomRef.current = () => {
      const element = scrollRef.current
      if (!element) return false
      const { scrollTop, scrollHeight, clientHeight } = element
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      return distanceFromBottom <= threshold
    }
  }, [threshold])

  // Scroll to bottom (store in ref to avoid dependency issues)
  const scrollToBottomRef = useRef(() => {
    const element = scrollRef.current
    if (!element) return
    element.scrollTo({
      top: element.scrollHeight,
      behavior,
    })
  })

  useLayoutEffect(() => {
    scrollToBottomRef.current = () => {
      const element = scrollRef.current
      if (!element) return
      element.scrollTo({
        top: element.scrollHeight,
        behavior,
      })
    }
  }, [behavior])

  // Public API functions
  const checkIfNearBottom = useCallback(() => {
    return checkIfNearBottomRef.current()
  }, [])

  const scrollToBottom = useCallback(() => {
    scrollToBottomRef.current()
  }, [])

  // Throttled scroll handler for better performance (60fps = ~16ms)
  // Prevents 100+ scroll events/sec from causing performance issues
  const handleScroll = useThrottledCallback(() => {
    setIsNearBottom(checkIfNearBottomRef.current())
  }, 16) // 60fps throttle

  // Update isNearBottom on scroll
  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    element.addEventListener('scroll', handleScroll, { passive: true })
    return () => element.removeEventListener('scroll', handleScroll)
  }, [handleScroll]) // handleScroll is stable from useThrottledCallback

  // Auto-scroll when dependencies change
  useEffect(() => {
    if (!enabled) return

    const wasNearBottom = checkIfNearBottomRef.current()
    if (wasNearBottom) {
      // Use safe requestAnimationFrame to ensure DOM has updated and cleanup on unmount
      requestSafeAnimationFrame(() => {
        scrollToBottomRef.current()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, requestSafeAnimationFrame, ...dependencies]) // Functions accessed via refs, spread dependencies intentional

  return {
    scrollRef,
    isNearBottom,
    scrollToBottom,
    setEnabled,
  }
}
