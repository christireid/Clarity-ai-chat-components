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
 * - Automatic throttling (150ms default)
 * - SSR-safe (returns 0x0 on server)
 * - Automatic cleanup on unmount
 * - Memory efficient
 * 
 * **Use Cases:**
 * - Responsive component rendering
 * - Conditional layout switching
 * - Dynamic sizing calculations
 * 
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
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = React.useState<WindowSize>(() => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 }
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    let timeoutId: NodeJS.Timeout | undefined
    let lastRan = Date.now()
    const THROTTLE_DELAY = 150

    const handleResize = () => {
      const now = Date.now()
      const timeSinceLastRun = now - lastRan

      if (timeSinceLastRun >= THROTTLE_DELAY) {
        // Execute immediately if enough time has passed
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
        lastRan = now
      } else {
        // Schedule execution for remaining time
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          })
          lastRan = Date.now()
        }, THROTTLE_DELAY - timeSinceLastRun)
      }
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return windowSize
}
