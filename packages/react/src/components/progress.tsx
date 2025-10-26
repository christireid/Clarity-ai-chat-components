/**
 * Progress Indicators
 * 
 * Linear and circular progress indicators with determinate and indeterminate states.
 * Used for loading states, file uploads, and streaming progress.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { ANIMATION_DURATION, ANIMATION_EASING } from '../animations'

/**
 * Linear Progress Bar
 */
export interface ProgressProps {
  /** Progress value (0-100) - omit for indeterminate */
  value?: number
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'destructive'
  /** Show percentage label */
  showLabel?: boolean
  /** Custom label */
  label?: string
  /** Additional className */
  className?: string
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  className,
}) => {
  const isIndeterminate = value === undefined
  const percentage = Math.min(Math.max(value ?? 0, 0), 100)

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
  }

  return (
    <div className={cn('space-y-1', className)}>
      {/* Label */}
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {label || 'Loading...'}
          </span>
          {!isIndeterminate && showLabel && (
            <span className="text-muted-foreground font-medium">
              {percentage}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-muted',
          sizeClasses[size]
        )}
      >
        {isIndeterminate ? (
          // Indeterminate animation
          <motion.div
            className={cn('absolute inset-y-0 rounded-full', colorClasses[variant])}
            style={{ width: '40%' }}
            animate={{
              x: ['-100%', '250%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ) : (
          // Determinate progress
          <motion.div
            className={cn('h-full rounded-full', colorClasses[variant])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: ANIMATION_DURATION.slow / 1000,
              ease: ANIMATION_EASING.out,
            }}
          />
        )}
      </div>
    </div>
  )
}

/**
 * Circular Progress Indicator
 */
export interface CircularProgressProps {
  /** Progress value (0-100) - omit for indeterminate */
  value?: number
  /** Size in pixels */
  size?: number
  /** Stroke width in pixels */
  strokeWidth?: number
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'destructive'
  /** Show percentage label in center */
  showLabel?: boolean
  /** Additional className */
  className?: string
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 48,
  strokeWidth = 4,
  variant = 'primary',
  showLabel = false,
  className,
}) => {
  const isIndeterminate = value === undefined
  const percentage = Math.min(Math.max(value ?? 0, 0), 100)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    primary: 'stroke-primary',
    success: 'stroke-success',
    warning: 'stroke-warning',
    destructive: 'stroke-destructive',
  }

  return (
    <div className={cn('relative inline-flex', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted opacity-20"
        />

        {isIndeterminate ? (
          // Indeterminate spinner
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
            className={colorClasses[variant]}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ transformOrigin: 'center' }}
          />
        ) : (
          // Determinate progress
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            className={colorClasses[variant]}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: ANIMATION_DURATION.slow / 1000,
              ease: ANIMATION_EASING.out,
            }}
          />
        )}
      </svg>

      {/* Center label */}
      {!isIndeterminate && showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Streaming Progress - Animated dots indicator
 */
export interface StreamingProgressProps {
  /** Custom label */
  label?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Additional className */
  className?: string
}

export const StreamingProgress: React.FC<StreamingProgressProps> = ({
  label = 'Streaming',
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  }

  const dotSizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
      <div className={cn('flex', sizeClasses[size])}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn('rounded-full bg-current', dotSizeClasses[size])}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: ANIMATION_EASING.inOut,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Upload Progress - Shows file upload with size
 */
export interface UploadProgressProps {
  /** File name */
  fileName: string
  /** Progress value (0-100) */
  value: number
  /** File size in bytes */
  fileSize?: number
  /** Uploaded size in bytes */
  uploadedSize?: number
  /** Cancel callback */
  onCancel?: () => void
  /** Additional className */
  className?: string
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  value,
  fileSize,
  uploadedSize,
  onCancel,
  className,
}) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const percentage = Math.min(Math.max(value, 0), 100)
  const isComplete = percentage === 100

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{fileName}</div>
          {fileSize !== undefined && uploadedSize !== undefined && (
            <div className="text-xs text-muted-foreground">
              {formatBytes(uploadedSize)} / {formatBytes(fileSize)}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">
            {percentage}%
          </span>
          {!isComplete && onCancel && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cancel upload"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      <Progress value={percentage} variant={isComplete ? 'success' : 'primary'} />
    </div>
  )
}

/**
 * Skeleton Progress - Shows loading skeleton with animated progress
 */
export const SkeletonProgress: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
      </div>
      <Progress />
    </div>
  )
}
