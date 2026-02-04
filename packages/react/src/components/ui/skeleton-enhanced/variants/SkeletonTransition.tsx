/**
 * Skeleton-to-Content Transition Component
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { PerformanceMonitor, LoadingPredictor } from '../utils'
import type { SkeletonTransitionProps } from '../types'

export const SkeletonTransition: React.FC<SkeletonTransitionProps> = ({
  isLoading,
  children,
  skeleton,
  direction = 'fade',
  duration = 300,
  monitorPerformance = false,
  enablePrediction = false,
  accessibilityMode = 'polite',
}) => {
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [showContent, setShowContent] = React.useState(!isLoading)
  const [showSkeleton, setShowSkeleton] = React.useState(isLoading)
  const [predictedDuration, setPredictedDuration] = React.useState(duration)

  const loadingStartTime = React.useRef<number>(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Smart loading prediction - TODO: Update for new API
  React.useEffect(() => {
    if (enablePrediction) {
      // const predicted = LoadingPredictor.predictDuration()
      // setPredictedDuration(predicted)
    }
  }, [enablePrediction])

  // Performance monitoring - TODO: Update for new UnifiedPerformanceMonitor API
  React.useEffect(() => {
    if (monitorPerformance && typeof window !== 'undefined') {
      // Track loading duration without performance monitor for now
      if (isLoading) {
        loadingStartTime.current = Date.now()
      } else if (loadingStartTime.current > 0) {
        const loadingDuration = Date.now() - loadingStartTime.current
        if (process.env.NODE_ENV === 'development') {
          console.log('Loading duration:', loadingDuration)
        }
        // TODO: Record with new performance API
      }
    }
  }, [isLoading, monitorPerformance, enablePrediction])

  // Handle loading state changes
  React.useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true)
      setShowContent(false)
      setIsTransitioning(false)
      loadingStartTime.current = Date.now()
    } else {
      setIsTransitioning(true)

      // Start transition
      setTimeout(() => {
        setShowContent(true)
        setTimeout(() => {
          setShowSkeleton(false)
          setIsTransitioning(false)
        }, duration)
      }, 50)
    }
  }, [isLoading, duration])

  // Accessibility announcements
  React.useEffect(() => {
    if (accessibilityMode !== 'off' && containerRef.current) {
      const announcement = isLoading
        ? 'Loading content, please wait...'
        : 'Content loaded successfully'

      const liveRegion = document.createElement('div')
      liveRegion.setAttribute('aria-live', accessibilityMode)
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.textContent = announcement
      liveRegion.style.position = 'absolute'
      liveRegion.style.left = '-10000px'
      liveRegion.style.width = '1px'
      liveRegion.style.height = '1px'
      liveRegion.style.overflow = 'hidden'

      document.body.appendChild(liveRegion)

      setTimeout(() => {
        document.body.removeChild(liveRegion)
      }, 1000)
    }
  }, [isLoading, accessibilityMode])

  const getTransitionStyles = () => {
    const effectiveDuration = enablePrediction ? predictedDuration : duration

    const skeletonExit = {
      fade: 'skeleton-fade-out',
      'slide-up': 'skeleton-slide-up-out',
      'slide-down': 'skeleton-slide-down-out',
      scale: 'skeleton-scale-out',
      morph: 'skeleton-morph-out',
    }[direction]

    const contentEnter = {
      fade: 'content-fade-in',
      'slide-up': 'content-slide-up-in',
      'slide-down': 'content-slide-down-in',
      scale: 'content-scale-in',
      morph: 'content-morph-in',
    }[direction]

    return {
      skeletonExit,
      contentEnter,
      duration: effectiveDuration,
    }
  }

  const {
    skeletonExit,
    contentEnter,
    duration: effectiveDuration,
  } = getTransitionStyles()

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ minHeight: showSkeleton ? '100px' : 'auto' }}
    >
      {/* Skeleton Layer */}
      {showSkeleton && (
        <div
          className={cn(
            'absolute inset-0 z-10 transition-all',
            isTransitioning && skeletonExit
          )}
          style={{
            animationDuration: isTransitioning
              ? `${effectiveDuration}ms`
              : undefined,
          }}
        >
          {skeleton}
        </div>
      )}

      {/* Content Layer */}
      {showContent && (
        <div
          className={cn(
            'relative z-20 transition-all',
            isTransitioning && contentEnter
          )}
          style={{
            animationDuration: isTransitioning
              ? `${effectiveDuration}ms`
              : undefined,
          }}
        >
          {children}
        </div>
      )}

      {/* Loading indicator for screen readers */}
      {isLoading && (
        <div className="sr-only" role="status" aria-live="polite">
          Loading content...
        </div>
      )}
    </div>
  )
}
