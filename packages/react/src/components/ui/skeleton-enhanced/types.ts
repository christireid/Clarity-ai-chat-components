/**
 * Type definitions for Enhanced Skeleton Components
 */

import * as React from 'react'

export interface EnhancedSkeletonProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Animation type */
  variant?: 'pulse' | 'shimmer' | 'none' | 'wave' | 'gradient' | 'dots'
  /** Width of skeleton (CSS value) */
  width?: string | number
  /** Height of skeleton (CSS value) */
  height?: string | number
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  /** Enable transition to content */
  enableTransition?: boolean
  /** Transition duration in ms */
  transitionDuration?: number
  /** Transition easing */
  transitionEasing?: string
  /** Performance monitoring */
  performanceId?: string
  /** Accessibility label */
  ariaLabel?: string
}

export interface SkeletonTransitionProps {
  /** Whether content is loading */
  isLoading: boolean
  /** The actual content to display */
  children: React.ReactNode
  /** Loading skeleton */
  skeleton: React.ReactNode
  /** Transition direction */
  direction?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'morph'
  /** Transition duration in ms */
  duration?: number
  /** Enable performance monitoring */
  monitorPerformance?: boolean
  /** Smart loading prediction */
  enablePrediction?: boolean
  /** Accessibility mode */
  accessibilityMode?: 'assertive' | 'polite' | 'off'
}

export interface SkeletonTheme {
  /** Primary color */
  primaryColor?: string
  /** Secondary color */
  secondaryColor?: string
  /** Animation speed */
  animationSpeed?: number
  /** Border radius */
  borderRadius?: number
  /** Enable reduced motion */
  reducedMotion?: boolean
}

export interface SkeletonComposition {
  /** Layout type */
  layout: 'card' | 'list' | 'grid' | 'message' | 'form' | 'custom'
  /** Components to compose */
  components: Array<{
    type: 'skeleton' | 'text' | 'avatar' | 'button' | 'input'
    props?: Record<string, any>
    gridArea?: string
  }>
  /** Responsive breakpoints */
  responsive?: {
    [breakpoint: string]: {
      columns?: number
      gap?: number
    }
  }
}

export interface EnhancedSkeletonTextProps {
  lines?: number
  lineHeight?: number
  gap?: number
  lastLineWidth?: number
  variant?: 'pulse' | 'shimmer' | 'none' | 'wave' | 'gradient' | 'dots'
  className?: string
  enableTransition?: boolean
  responsive?: boolean
}

export interface EnhancedSkeletonAvatarProps {
  size?: number
  variant?: 'pulse' | 'shimmer' | 'none' | 'wave' | 'gradient' | 'dots'
  className?: string
  enableTransition?: boolean
  responsive?: boolean
}

export interface SkeletonComposerProps {
  composition: SkeletonComposition
  variant?: 'pulse' | 'shimmer' | 'none' | 'wave' | 'gradient' | 'dots'
  className?: string
  enableTransition?: boolean
}

export interface SkeletonThemeProviderProps {
  theme?: SkeletonTheme
  children: React.ReactNode
}

export interface AccessibleSkeletonProps {
  children: React.ReactNode
  isLoading: boolean
  loadingMessage?: string
  loadedMessage?: string
  progressIndicator?: 'linear' | 'circular' | 'dots' | 'none'
  estimatedTime?: number
  showProgress?: boolean
}

export interface PerformanceSkeletonProps {
  children: React.ReactNode
  performanceId: string
  onPerformanceReport?: (metrics: PerformanceEntry[]) => void
  enableDetailedMetrics?: boolean
}

export interface SmartSkeletonProps {
  children: React.ReactNode
  isLoading: boolean
  predictionMode?: 'conservative' | 'aggressive' | 'adaptive'
  onPredictionUpdate?: (predictedDuration: number) => void
  enableLearning?: boolean
}

export interface MicroInteractionSkeletonProps {
  children: React.ReactNode
  interactions?: Array<{
    type: 'hover' | 'focus' | 'click'
    effect: 'pulse' | 'glow' | 'scale' | 'shake'
    duration?: number
  }>
  enableSound?: boolean
  enableHaptics?: boolean
}
