'use client'

/**
 * Simple skeleton components for docs site
 * These are local implementations used for the skeleton reference page
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'pulse' | 'shimmer' | 'none'
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'shimmer',
  width,
  height,
  rounded = 'md',
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

  return (
    <div
      className={cn(
        'bg-muted/60',
        roundedClasses[rounded],
        variant === 'pulse' && 'animate-pulse',
        variant === 'shimmer' && 'animate-pulse',
        className
      )}
      style={{
        width: width ?? '100%',
        height: height ?? '1rem',
        ...style,
      }}
      {...props}
    />
  )
}

export interface SkeletonTextProps {
  lines?: number
  lineHeight?: number
  gap?: number
  lastLineWidth?: number
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lineHeight = 16,
  gap = 8,
  lastLineWidth = 70,
  variant = 'shimmer',
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)} style={{ gap: `${gap}px` }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          height={lineHeight}
          width={index === lines - 1 ? `${lastLineWidth}%` : '100%'}
          rounded="sm"
        />
      ))}
    </div>
  )
}

export interface SkeletonAvatarProps {
  size?: number
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 40,
  variant = 'shimmer',
  className,
}) => {
  return (
    <Skeleton
      variant={variant}
      width={size}
      height={size}
      rounded="full"
      className={className}
    />
  )
}

export interface SkeletonCardProps {
  showImage?: boolean
  imageHeight?: number
  showHeader?: boolean
  bodyLines?: number
  showFooter?: boolean
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showImage = true,
  imageHeight = 200,
  showHeader = true,
  bodyLines = 3,
  showFooter = true,
  variant = 'shimmer',
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-border/40 bg-card overflow-hidden shadow-sm',
        className
      )}
    >
      {showImage && (
        <Skeleton variant={variant} height={imageHeight} rounded="none" />
      )}
      <div className="p-6 space-y-4">
        {showHeader && (
          <div className="space-y-2">
            <Skeleton variant={variant} width="60%" height={24} rounded="sm" />
            <Skeleton variant={variant} width="40%" height={16} rounded="sm" />
          </div>
        )}
        <SkeletonText lines={bodyLines} variant={variant} />
        {showFooter && (
          <div className="flex gap-2 pt-2">
            <Skeleton variant={variant} width={80} height={36} rounded="md" />
            <Skeleton variant={variant} width={80} height={36} rounded="md" />
          </div>
        )}
      </div>
    </div>
  )
}

export interface SkeletonListProps {
  count?: number
  showAvatar?: boolean
  lines?: number
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  showAvatar = true,
  lines = 2,
  variant = 'shimmer',
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-3 items-start">
          {showAvatar && <SkeletonAvatar size={40} variant={variant} />}
          <div className="flex-1">
            <SkeletonText lines={lines} variant={variant} lastLineWidth={80} />
          </div>
        </div>
      ))}
    </div>
  )
}

export interface SkeletonButtonProps {
  width?: number | string
  height?: number
  variant?: 'pulse' | 'shimmer' | 'none'
  className?: string
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  width = 100,
  height = 40,
  variant = 'shimmer',
  className,
}) => {
  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      rounded="md"
      className={className}
    />
  )
}

Skeleton.displayName = 'Skeleton'
SkeletonText.displayName = 'SkeletonText'
SkeletonAvatar.displayName = 'SkeletonAvatar'
SkeletonCard.displayName = 'SkeletonCard'
SkeletonList.displayName = 'SkeletonList'
SkeletonButton.displayName = 'SkeletonButton'
