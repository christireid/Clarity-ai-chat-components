import * as React from 'react'

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
  dependencies?: React.DependencyList
}

export interface UseAutoScrollReturn {
  /**
   * Ref to attach to scrollable container
   */
  scrollRef: React.RefObject<HTMLElement>
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
export function useAutoScroll(options: UseAutoScrollOptions = {}): UseAutoScrollReturn {
  const {
    enabled: initialEnabled = true,
    behavior = 'smooth',
    threshold = 100,
    dependencies = [],
  } = options

  const scrollRef = React.useRef<HTMLElement>(null)
  const [enabled, setEnabled] = React.useState(initialEnabled)
  const [isNearBottom, setIsNearBottom] = React.useState(true)

  // Check if user is near bottom (store in ref to avoid dependency issues)
  const checkIfNearBottomRef = React.useRef(() => {
    const element = scrollRef.current
    if (!element) return false
    const { scrollTop, scrollHeight, clientHeight } = element
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    return distanceFromBottom <= threshold
  })
  
  React.useLayoutEffect(() => {
    checkIfNearBottomRef.current = () => {
      const element = scrollRef.current
      if (!element) return false
      const { scrollTop, scrollHeight, clientHeight } = element
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      return distanceFromBottom <= threshold
    }
  }, [threshold])

  // Scroll to bottom (store in ref to avoid dependency issues)
  const scrollToBottomRef = React.useRef(() => {
    const element = scrollRef.current
    if (!element) return
    element.scrollTo({
      top: element.scrollHeight,
      behavior,
    })
  })
  
  React.useLayoutEffect(() => {
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
  const checkIfNearBottom = React.useCallback(() => {
    return checkIfNearBottomRef.current()
  }, [])

  const scrollToBottom = React.useCallback(() => {
    scrollToBottomRef.current()
  }, [])

  // Update isNearBottom on scroll
  React.useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleScroll = () => {
      setIsNearBottom(checkIfNearBottomRef.current())
    }

    element.addEventListener('scroll', handleScroll, { passive: true })
    return () => element.removeEventListener('scroll', handleScroll)
  }, []) // Function accessed via ref

  // Auto-scroll when dependencies change
  React.useEffect(() => {
    if (!enabled) return

    const wasNearBottom = checkIfNearBottomRef.current()
    if (wasNearBottom) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        scrollToBottomRef.current()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...dependencies]) // Functions accessed via refs

  return {
    scrollRef,
    isNearBottom,
    scrollToBottom,
    setEnabled,
  }
}
