'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

export interface ProgressiveImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  lowQualitySrc?: string
  placeholderClassName?: string
  onLoad?: () => void
  onError?: () => void
}

/**
 * ProgressiveImage component with lazy loading and blur-up effect
 *
 * Features:
 * - Native lazy loading with loading="lazy"
 * - Optional low-quality placeholder for blur-up effect
 * - Skeleton placeholder while loading
 * - Error state handling
 * - Smooth fade-in transition
 *
 * Performance benefits:
 * - Defers offscreen image loading
 * - Reduces initial page load
 * - Improves LCP (Largest Contentful Paint)
 * - Better perceived performance
 */
export const ProgressiveImage = React.memo(function ProgressiveImage({
  src,
  alt,
  lowQualitySrc,
  className,
  placeholderClassName,
  onLoad,
  onError,
  ...props
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [currentSrc, setCurrentSrc] = React.useState(lowQualitySrc || src)

  React.useEffect(() => {
    // If we have a low quality placeholder, load the high quality image after
    if (lowQualitySrc && currentSrc === lowQualitySrc) {
      const img = new Image()
      img.src = src
      img.onload = () => {
        setCurrentSrc(src)
      }
      img.onerror = () => {
        setHasError(true)
        onError?.()
      }
    }
  }, [lowQualitySrc, src, currentSrc, onError])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          placeholderClassName,
          className
        )}
        role="img"
        aria-label={alt}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-50"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
          <line x1="3" y1="3" x2="21" y2="21" />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-muted',
            placeholderClassName
          )}
        />
      )}

      {/* Actual image */}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          lowQualitySrc && currentSrc === lowQualitySrc && 'blur-sm scale-105',
          className
        )}
        {...props}
      />
    </div>
  )
})

ProgressiveImage.displayName = 'ProgressiveImage'
