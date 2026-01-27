'use client'

import * as React from 'react'
import { Card, cn } from '@clarity-chat/primitives'
import type { LinkPreviewSkeletonProps } from './types'

export function LinkPreviewSkeleton({
  variant = 'card',
  className,
}: LinkPreviewSkeletonProps) {
  if (variant === 'compact') {
    return (
      <Card className={cn('p-3 animate-pulse shadow-sm', className)}>
        <span className="sr-only">Loading link preview</span>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted/60 rounded flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-muted/60 rounded w-3/4" />
            <div className="h-3 bg-muted/60 rounded w-1/2" />
          </div>
        </div>
      </Card>
    )
  }

  if (variant === 'inline') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 animate-pulse',
          className
        )}
      >
        <span className="sr-only">Loading link preview</span>
        <span className="w-4 h-4 bg-muted/60 rounded" />
        <span className="h-3.5 bg-muted/60 rounded w-24" />
      </span>
    )
  }

  // Default card variant with shimmer effect
  return (
    <Card className={cn('overflow-hidden shadow-sm', className)}>
      <div className="relative">
        <span className="sr-only">Loading link preview</span>
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex gap-3.5 p-4">
          <div className="w-24 h-24 bg-muted/60 rounded flex-shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted/60 rounded" />
              <div className="h-3 bg-muted/60 rounded w-20" />
            </div>
            <div className="h-4 bg-muted/60 rounded w-3/4" />
            <div className="h-3 bg-muted/60 rounded w-full" />
            <div className="h-3 bg-muted/60 rounded w-2/3" />
          </div>
        </div>
      </div>
    </Card>
  )
}

LinkPreviewSkeleton.displayName = 'LinkPreviewSkeleton'
