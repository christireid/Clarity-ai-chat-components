import * as React from 'react'

export interface WindowSize {
  width: number
  height: number
}

/**
 * Track window dimensions with throttled updates
 * 
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

    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }, 150) // Throttle resize events
    }

    window.addEventListener('resize', handleResize)
    
    // Set initial size
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return windowSize
}
