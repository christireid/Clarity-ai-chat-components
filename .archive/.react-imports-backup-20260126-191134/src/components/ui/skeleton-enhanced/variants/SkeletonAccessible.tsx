/**
 * Accessibility-First Loading States
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type { AccessibleSkeletonProps } from '../types'

export const AccessibleSkeleton: React.FC<AccessibleSkeletonProps> = ({
  children,
  isLoading,
  loadingMessage = 'Loading content, please wait...',
  loadedMessage = 'Content loaded successfully',
  progressIndicator = 'linear',
  estimatedTime,
  showProgress = true,
}) => {
  const [progress, setProgress] = React.useState(0)
  const [announcement, setAnnouncement] = React.useState('')
  const startTime = React.useRef<number>(0)

  React.useEffect(() => {
    if (isLoading) {
      startTime.current = Date.now()
      setAnnouncement(loadingMessage)

      if (showProgress && estimatedTime) {
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime.current
          const newProgress = Math.min((elapsed / estimatedTime) * 100, 95)
          setProgress(newProgress)
        }, 100)

        return () => clearInterval(interval)
      }
      return undefined
    } else {
      setProgress(100)
      setAnnouncement(loadedMessage)

      setTimeout(() => setAnnouncement(''), 3000)
      return undefined
    }
  }, [isLoading, estimatedTime, loadingMessage, loadedMessage, showProgress])

  const renderProgressIndicator = () => {
    if (!showProgress || progressIndicator === 'none') return null

    switch (progressIndicator) {
      case 'linear':
        return (
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading progress"
            className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )
      case 'circular':
        return (
          <div className="relative w-8 h-8">
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={62.8}
                strokeDashoffset={62.8 - (62.8 * progress) / 100}
                className="transition-all duration-300"
              />
            </svg>
          </div>
        )
      case 'dots':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative">
      {/* Screen reader announcements */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      {/* Progress indicator */}
      {isLoading && <div className="mb-4">{renderProgressIndicator()}</div>}

      {/* Content with skeleton overlay */}
      <div
        className={cn(
          'transition-opacity',
          isLoading ? 'opacity-30' : 'opacity-100'
        )}
      >
        {children}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            {renderProgressIndicator()}
            <p className="mt-2 text-sm text-gray-600">{loadingMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}
