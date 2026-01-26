/**
 * Lazy Loading Utilities
 *
 * Consolidated patterns for progressive enhancement and lazy loading
 * of heavy visual components.
 */

export interface LazyLoadOptions {
  minViewportWidth?: number
  checkReducedMotion?: boolean
  checkNetworkSpeed?: boolean
  delayMs?: number
  intersectionThreshold?: number
  intersectionRootMargin?: string
}

export const DEFAULT_LAZY_OPTIONS: LazyLoadOptions = {
  minViewportWidth: 1024, // Desktop only by default
  checkReducedMotion: true,
  checkNetworkSpeed: true,
  delayMs: 1000,
  intersectionThreshold: 0.1,
  intersectionRootMargin: '100px',
}

/**
 * Determine if a heavy component should be lazy loaded
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   if (shouldLazyLoad({ minViewportWidth: 768 })) {
 *     // Load component
 *   }
 * }, [])
 * ```
 */
export function shouldLazyLoad(options: LazyLoadOptions = {}): boolean {
  const opts = { ...DEFAULT_LAZY_OPTIONS, ...options }

  // Check viewport
  if (typeof window === 'undefined') return false

  if (window.innerWidth < (opts.minViewportWidth || 1024)) {
    return false
  }

  // Check reduced motion
  if (opts.checkReducedMotion) {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return false
  }

  // Check network speed
  if (opts.checkNetworkSpeed && 'connection' in navigator) {
    const connection = (navigator as any).connection
    const effectiveType = connection?.effectiveType
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return false
    }
  }

  return true
}

/**
 * Check if device is mobile based on viewport width
 */
export function isMobileViewport(threshold = 768): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < threshold
}

/**
 * Check if device is desktop based on viewport width
 */
export function isDesktopViewport(threshold = 1024): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= threshold
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check network connection speed
 * Returns 'fast', 'medium', 'slow', or 'unknown'
 */
export function getNetworkSpeed(): 'fast' | 'medium' | 'slow' | 'unknown' {
  if (typeof window === 'undefined' || !('connection' in navigator)) {
    return 'unknown'
  }

  const connection = (navigator as any).connection
  const effectiveType = connection?.effectiveType

  if (!effectiveType) return 'unknown'

  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'slow'
  }

  if (effectiveType === '3g') {
    return 'medium'
  }

  return 'fast' // 4g or better
}

/**
 * Type guard for checking if a feature should be enabled
 * based on device capabilities and user preferences
 */
export interface FeatureGateOptions {
  requireDesktop?: boolean
  requireFastNetwork?: boolean
  respectReducedMotion?: boolean
}

export function shouldEnableFeature(options: FeatureGateOptions = {}): boolean {
  const {
    requireDesktop = false,
    requireFastNetwork = false,
    respectReducedMotion = true,
  } = options

  // Check desktop requirement
  if (requireDesktop && !isDesktopViewport()) {
    return false
  }

  // Check network speed requirement
  if (requireFastNetwork) {
    const speed = getNetworkSpeed()
    if (speed === 'slow' || speed === 'unknown') {
      return false
    }
  }

  // Check reduced motion
  if (respectReducedMotion && prefersReducedMotion()) {
    return false
  }

  return true
}
