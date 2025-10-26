/**
 * Mobile Optimization Utilities
 * 
 * Utilities for mobile-specific optimizations:
 * - Touch target sizing
 * - Gesture detection
 * - Mobile-specific styles
 * - Viewport handling
 */

import * as React from 'react'

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

/**
 * Check if device is touch-enabled
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Get viewport dimensions
 */
export function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * Hook for mobile detection
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = React.useState(() => isMobile())

  React.useEffect(() => {
    const checkMobile = () => {
      setMobile(isMobile())
    }

    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return mobile
}

/**
 * Hook for touch device detection
 */
export function useIsTouchDevice(): boolean {
  const [touch, setTouch] = React.useState(() => isTouchDevice())

  React.useEffect(() => {
    setTouch(isTouchDevice())
  }, [])

  return touch
}

/**
 * Hook for viewport size
 */
export function useViewportSize() {
  const [size, setSize] = React.useState(getViewportSize)

  React.useEffect(() => {
    const handleResize = () => {
      setSize(getViewportSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

/**
 * Touch target sizes for accessibility
 */
export const TOUCH_TARGET = {
  /** Minimum size for primary actions */
  minimum: 44,
  /** Recommended size for comfortable tapping */
  comfortable: 48,
  /** Large size for important actions */
  large: 56,
} as const

/**
 * Get appropriate touch target class
 */
export function getTouchTargetClass(size: keyof typeof TOUCH_TARGET = 'comfortable'): string {
  const sizeMap = {
    minimum: 'min-h-[44px] min-w-[44px]',
    comfortable: 'min-h-[48px] min-w-[48px]',
    large: 'min-h-[56px] min-w-[56px]',
  }

  return sizeMap[size]
}

/**
 * Gesture detection types
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down'

export interface SwipeEvent {
  direction: SwipeDirection
  distance: number
  velocity: number
  duration: number
}

/**
 * Hook for swipe gesture detection
 */
export function useSwipe(
  onSwipe?: (event: SwipeEvent) => void,
  threshold: number = 50,
  velocityThreshold: number = 0.3
) {
  const touchStart = React.useRef<{ x: number; y: number; time: number } | null>(null)

  const handlers = React.useMemo(
    () => ({
      onTouchStart: (e: React.TouchEvent) => {
        const touch = e.touches[0]
        touchStart.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        }
      },

      onTouchEnd: (e: React.TouchEvent) => {
        if (!touchStart.current) return

        const touch = e.changedTouches[0]
        const deltaX = touch.clientX - touchStart.current.x
        const deltaY = touch.clientY - touchStart.current.y
        const duration = Date.now() - touchStart.current.time

        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
        const velocity = distance / duration

        // Determine direction
        let direction: SwipeDirection
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left'
        } else {
          direction = deltaY > 0 ? 'down' : 'up'
        }

        // Check if swipe meets thresholds
        const primaryDelta = direction === 'left' || direction === 'right' ? Math.abs(deltaX) : Math.abs(deltaY)
        
        if (primaryDelta >= threshold && velocity >= velocityThreshold) {
          onSwipe?.({
            direction,
            distance,
            velocity,
            duration,
          })
        }

        touchStart.current = null
      },
    }),
    [onSwipe, threshold, velocityThreshold]
  )

  return handlers
}

/**
 * Hook for long press detection
 */
export function useLongPress(
  onLongPress: () => void,
  duration: number = 500
) {
  const timerRef = React.useRef<NodeJS.Timeout>()
  const isLongPress = React.useRef(false)

  const start = React.useCallback(() => {
    isLongPress.current = false
    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      onLongPress()
    }, duration)
  }, [onLongPress, duration])

  const cancel = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }, [])

  const handlers = React.useMemo(
    () => ({
      onTouchStart: start,
      onTouchEnd: cancel,
      onTouchMove: cancel,
      onMouseDown: start,
      onMouseUp: cancel,
      onMouseLeave: cancel,
    }),
    [start, cancel]
  )

  return {
    handlers,
    isLongPress: () => isLongPress.current,
  }
}

/**
 * Hook for pull-to-refresh
 */
export function usePullToRefresh(
  onRefresh: () => void | Promise<void>,
  threshold: number = 80
) {
  const [isPulling, setIsPulling] = React.useState(false)
  const [pullDistance, setPullDistance] = React.useState(0)
  const startY = React.useRef(0)
  const isRefreshing = React.useRef(false)

  const handlers = React.useMemo(
    () => ({
      onTouchStart: (e: React.TouchEvent) => {
        if (window.scrollY === 0) {
          startY.current = e.touches[0].clientY
          setIsPulling(true)
        }
      },

      onTouchMove: (e: React.TouchEvent) => {
        if (!isPulling || isRefreshing.current) return

        const currentY = e.touches[0].clientY
        const distance = Math.max(0, currentY - startY.current)
        setPullDistance(distance)
      },

      onTouchEnd: async () => {
        if (!isPulling || isRefreshing.current) return

        if (pullDistance >= threshold) {
          isRefreshing.current = true
          try {
            await onRefresh()
          } finally {
            isRefreshing.current = false
          }
        }

        setIsPulling(false)
        setPullDistance(0)
      },
    }),
    [isPulling, pullDistance, threshold, onRefresh]
  )

  return {
    handlers,
    isPulling,
    pullDistance,
    progress: Math.min(pullDistance / threshold, 1),
  }
}

/**
 * Prevent zoom on double-tap
 */
export function preventDoubleTapZoom(element: HTMLElement) {
  let lastTap = 0

  element.addEventListener('touchend', (e) => {
    const currentTime = Date.now()
    const tapLength = currentTime - lastTap

    if (tapLength < 500 && tapLength > 0) {
      e.preventDefault()
    }

    lastTap = currentTime
  })
}

/**
 * Safe area insets (for notch and home indicator)
 */
export function useSafeAreaInsets() {
  const [insets, setInsets] = React.useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const computedStyle = getComputedStyle(document.documentElement)
    
    setInsets({
      top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
      right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
      bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
      left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
    })
  }, [])

  return insets
}

/**
 * Haptic feedback (if supported)
 */
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'medium') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return

  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30],
  }

  navigator.vibrate(patterns[type])
}

/**
 * Hook for haptic feedback
 */
export function useHapticFeedback() {
  return React.useCallback((type: 'light' | 'medium' | 'heavy' = 'medium') => {
    hapticFeedback(type)
  }, [])
}
