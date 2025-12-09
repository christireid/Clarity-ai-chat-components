'use client'

import { ReactNode } from 'react'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  animate?: boolean
}

export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
  animate = true,
}: SkeletonProps) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  return (
    <div
      className={`bg-muted ${roundedClasses[rounded]} ${animate ? 'animate-pulse' : ''} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}

interface SkeletonTextProps {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 ? '60%' : '100%'}
          rounded="sm"
        />
      ))}
    </div>
  )
}

interface SkeletonCardProps {
  className?: string
  showImage?: boolean
}

export function SkeletonCard({ className = '', showImage = false }: SkeletonCardProps) {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      {showImage && (
        <Skeleton height={120} className="mb-4" rounded="md" />
      )}
      <Skeleton height={20} width="70%" className="mb-2" rounded="sm" />
      <SkeletonText lines={2} />
    </div>
  )
}

interface SkeletonTableProps {
  rows?: number
  cols?: number
  className?: string
}

export function SkeletonTable({ rows = 5, cols = 4, className = '' }: SkeletonTableProps) {
  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-muted p-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height={16} className="flex-1" rounded="sm" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-3 border-t flex gap-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} height={14} className="flex-1" rounded="sm" />
          ))}
        </div>
      ))}
    </div>
  )
}

interface SkeletonButtonProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SkeletonButton({ size = 'md', className = '' }: SkeletonButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  }

  return <Skeleton className={`${sizeClasses[size]} ${className}`} rounded="lg" />
}

interface ConditionalSkeletonProps {
  isLoading: boolean
  skeleton: ReactNode
  children: ReactNode
}

export function ConditionalSkeleton({ isLoading, skeleton, children }: ConditionalSkeletonProps) {
  return isLoading ? <>{skeleton}</> : <>{children}</>
}
