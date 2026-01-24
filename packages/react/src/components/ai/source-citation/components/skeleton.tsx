/**
 * Skeleton loader component for SourceCitation
 */

import * as React from 'react'
import type { SourceCitationVariant } from '../types'

export interface SourceCitationSkeletonProps {
  variant: SourceCitationVariant
  count?: number
}

export const SourceCitationSkeleton: React.FC<SourceCitationSkeletonProps> = ({
  variant,
  count = 3,
}) => {
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2" role="status" aria-label="Loading sources">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-muted/40 animate-pulse"
          >
            <div className="w-5 h-5 rounded-full bg-muted/60" />
            <div className="w-16 h-3 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="grid gap-3" role="status" aria-label="Loading sources">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg border border-border/40 bg-muted/20 animate-pulse">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-muted/60" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted/60 rounded w-2/3" />
                <div className="h-3 bg-muted/40 rounded w-1/3" />
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="h-3 bg-muted/40 rounded" />
              <div className="h-3 bg-muted/40 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // List variant
  return (
    <div className="space-y-2" role="status" aria-label="Loading sources">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-2 py-2 animate-pulse">
          <div className="w-5 h-5 rounded-full bg-muted/60" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-muted/60 rounded w-1/2" />
            <div className="h-3 bg-muted/40 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
