import * as React from 'react'

export interface WindowSize {
  width: number
  height: number
}

/**
 * Track window dimensions with throttled updates to prevent performance issues
 * during window resize events.
 * 
 * **Features:**
 * - Automatic throttling (150ms default) using debounce for smoother UX
 * - SSR-safe (returns 0x0 on server)
 * - Automatic cleanup on unmount
 * - Memory efficient with proper ref usage
 * - Configurable throttle delay
 * 
 * **Use Cases:**
 * - Responsive component rendering
 * - Conditional layout switching
 * - Dynamic sizing calculations
 * - Canvas/SVG responsive sizing
 * 
 * **Implementation Notes:**
 * Uses refs to avoid stale closures and race conditions. The timeout is
 * properly cleaned up on unmount to prevent memory leaks.
 * 
 * @param {number} [throttleMs=150] - Debounce delay in milliseconds
 * @returns {WindowSize} Object containing current window width and height
 * @example
 * ```tsx
 * const { width, height } = useWindowSize()
 * 
 * return (
 *   <div>
 *     Window size: {width} x {height}
 *     {width < 768 ? <MobileView /> : <DesktopView />}
 *   </div>
 * )
 * ```
 * 
 * @example
 * ```tsx
 * // With custom throttle delay
 * const { width, height } = useWindowSize(300)
 * 
 * // More aggressive throttling for performance-critical apps
 * return <Chart width={width} height={height} />
 * ```
 */
export function useWindowSize(throttleMs: number = 150): WindowSize {
  const [windowSize, setWindowSize] = React.useState<WindowSize>(() => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 }
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  })

  // Use ref to avoid stale closure issues
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
        timeoutRef.current = null
      }, throttleMs)
    }

    window.addEventListener('resize', handleResize)
    
    // Set initial size immediately
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      // Clean up timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [throttleMs])

  return windowSize
}
