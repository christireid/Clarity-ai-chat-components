/**
 * Enhanced Skeleton Loaders with Transition System
 *
 * Advanced loading placeholder components with smooth transitions,
 * accessibility features, performance monitoring, and intelligent loading states.
 * Zero-dependency version - no Framer Motion required
 */

// Export types
export type {
  EnhancedSkeletonProps,
  SkeletonTransitionProps,
  SkeletonTheme,
  SkeletonComposition,
  EnhancedSkeletonTextProps,
  EnhancedSkeletonAvatarProps,
  SkeletonComposerProps,
  SkeletonThemeProviderProps,
  AccessibleSkeletonProps,
  PerformanceSkeletonProps,
  SmartSkeletonProps,
  MicroInteractionSkeletonProps,
} from './types'

// Export animations
export { EnhancedSkeletonStyles } from './animations'

// Export utilities
export { PerformanceMonitor, LoadingPredictor, durations } from './utils'

// Export all variant components
export {
  EnhancedSkeleton,
  SkeletonTransition,
  EnhancedSkeletonText,
  EnhancedSkeletonAvatar,
  SkeletonComposer,
  SkeletonThemeProvider,
  SkeletonThemeContext,
  useSkeletonTheme,
  AccessibleSkeleton,
  PerformanceSkeleton,
  SmartSkeleton,
  MicroInteractionSkeleton,
} from './variants'

// Re-export original skeleton components for backward compatibility
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonMessage,
  SkeletonCard,
  SkeletonList,
  SkeletonButton,
  SkeletonInput,
  SkeletonChatWindow,
} from '../skeleton'
