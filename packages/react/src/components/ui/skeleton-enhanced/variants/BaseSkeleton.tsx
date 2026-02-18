/**
 * Base Enhanced Skeleton Component
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { EnhancedSkeletonStyles } from '../animations'
import { PerformanceMonitor } from '../utils'
import type { EnhancedSkeletonProps } from '../types'

export const EnhancedSkeleton: React.FC<EnhancedSkeletonProps> = ({
  variant = 'shimmer',
  width,
  height,
  rounded = 'md',
  enableTransition = true,
  transitionDuration = 300,
  transitionEasing = 'ease-out',
  performanceId,
  ariaLabel = 'Loading...',
  className,
  style,
  ...props
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  const animationClasses = {
    pulse: 'skeleton-pulse',
    shimmer: 'skeleton-shimmer',
    wave: 'skeleton-wave',
    gradient: 'skeleton-gradient',
    dots: 'skeleton-dots',
    none: '',
  }

  const performanceClasses = performanceId ? 'skeleton-performance' : ''
  const accessibilityClasses = 'skeleton-accessible'

  const baseStyle = {
    width: width ?? '100%',
    height: height ?? '1rem',
    ...style,
  }

  // Performance monitoring placeholder
  React.useEffect(() => {
    if (performanceId && typeof window !== 'undefined') {
      // Performance monitoring can be added via onLoad callbacks
    }
    return undefined
  }, [performanceId])

  return (
    <>
      <EnhancedSkeletonStyles />
      <div
        className={cn(
          'bg-muted/60 backdrop-blur-sm',
          roundedClasses[rounded],
          animationClasses[variant],
          performanceClasses,
          accessibilityClasses,
          className
        )}
        style={baseStyle}
        data-performance-id={performanceId}
        aria-label={ariaLabel}
        aria-busy="true"
        aria-live="polite"
        {...props}
      />
    </>
  )
}
