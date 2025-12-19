'use client'

import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
} from '@clarity-chat/react/internal'

/**
 * Page-level skeleton loader for documentation pages
 * Shows loading state while content is being fetched
 */
export function PageSkeleton() {
  return (
    <div className="docs-content">
      {/* Header Skeleton */}
      <div className="docs-header">
        <div className="flex gap-2 mb-3">
          <Skeleton width={80} height={24} rounded="md" />
          <Skeleton width={60} height={24} rounded="md" />
        </div>
        <Skeleton width="60%" height={48} rounded="lg" className="mb-4" />
        <SkeletonText lines={2} className="max-w-3xl" />
      </div>

      {/* Section Skeleton */}
      <section className="docs-section">
        <Skeleton width={200} height={32} rounded="md" className="mb-4" />
        <SkeletonText lines={4} className="mb-6" />

        {/* Code Block Skeleton */}
        <div className="rounded-xl border overflow-hidden">
          <Skeleton width="100%" height={300} rounded="none" />
        </div>
      </section>

      {/* Another Section */}
      <section className="docs-section">
        <Skeleton width={180} height={32} rounded="md" className="mb-4" />
        <SkeletonText lines={3} className="mb-6" />

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard showImage={false} bodyLines={2} showFooter={false} />
          <SkeletonCard showImage={false} bodyLines={2} showFooter={false} />
        </div>
      </section>
    </div>
  )
}

/**
 * Component documentation skeleton
 * Specialized for component reference pages
 */
export function ComponentPageSkeleton() {
  return (
    <div className="docs-content">
      {/* Header with badges */}
      <div className="docs-header">
        <div className="flex gap-2 mb-3">
          <Skeleton width={90} height={22} rounded="full" />
          <Skeleton width={70} height={22} rounded="full" />
        </div>
        <Skeleton width="50%" height={48} rounded="lg" className="mb-4" />
        <SkeletonText lines={2} className="max-w-3xl" />
      </div>

      {/* Interactive Playground Skeleton */}
      <section className="docs-section">
        <Skeleton width={240} height={32} rounded="md" className="mb-4" />
        <SkeletonText lines={2} className="mb-6" />
        <div className="rounded-xl border overflow-hidden">
          <Skeleton width="100%" height={500} rounded="none" />
        </div>
      </section>

      {/* Props Table Skeleton */}
      <section className="docs-section">
        <Skeleton width={120} height={32} rounded="md" className="mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <Skeleton width={120} height={20} />
              <Skeleton width={200} height={20} className="flex-1" />
              <Skeleton width={80} height={20} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/**
 * Search results skeleton
 * Shows loading state for search/command palette
 */
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <Skeleton width={20} height={20} rounded="sm" />
          <div className="flex-1">
            <Skeleton width="70%" height={16} className="mb-2" />
            <Skeleton width="90%" height={14} />
          </div>
          <Skeleton width={40} height={20} rounded="md" />
        </div>
      ))}
    </div>
  )
}
