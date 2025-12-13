'use client'

import { useState } from 'react'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonList,
  SkeletonAvatar,
  SkeletonButton,
} from '@clarity-chat/react'
import { Badge } from '@clarity-chat/primitives'
import { PageSkeleton, ComponentPageSkeleton, SearchResultsSkeleton } from '@/components/Loading/PageSkeleton'


export default function SkeletonLoadersPage() {
  const [showPageSkeleton, setShowPageSkeleton] = useState(false)
  const [showComponentSkeleton, setShowComponentSkeleton] = useState(false)
  const [showSearchSkeleton, setShowSearchSkeleton] = useState(false)

  return (
    <div className="docs-content">
      <div className="docs-header">
        <div className="flex gap-2 mb-3">
          <Badge variant="subtle" size="sm">Component</Badge>
          <Badge variant="success" size="sm">Stable</Badge>
          <Badge variant="info" size="sm" dot>In Use</Badge>
        </div>
        <h1>Skeleton Loaders</h1>
        <p className="docs-lead">
          Loading placeholder components with shimmer and pulse animations for displaying content structure while data loads.
        </p>
      </div>

      <ViewInStorybook component="Skeleton" />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Skeleton loaders provide visual feedback while content is loading, improving perceived performance
          by showing the structure of the page before the actual content arrives.
        </p>
      </section>

      <section className="docs-section">
        <h2>Base Skeleton</h2>
        <p className="mb-4">The foundation component with shimmer animation:</p>
        <div className="p-6 border rounded-lg bg-card space-y-4">
          <Skeleton width={200} height={24} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="80%" height={16} />
        </div>
      </section>

      <section className="docs-section">
        <h2>Skeleton Text</h2>
        <p className="mb-4">Multi-line text placeholders with customizable line count:</p>
        <div className="p-6 border rounded-lg bg-card space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">3 Lines (default)</p>
            <SkeletonText lines={3} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">5 Lines with 60% last line</p>
            <SkeletonText lines={5} lastLineWidth={60} />
          </div>
        </div>
      </section>

      <section className="docs-section">
        <h2>Skeleton Avatar</h2>
        <p className="mb-4">Circular placeholders for profile pictures:</p>
        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center gap-4">
            <SkeletonAvatar size={32} />
            <SkeletonAvatar size={48} />
            <SkeletonAvatar size={64} />
            <SkeletonAvatar size={96} />
          </div>
        </div>
      </section>

      <section className="docs-section">
        <h2>Skeleton Card</h2>
        <p className="mb-4">Complete card placeholder with image, header, body, and footer:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard showImage={false} bodyLines={2} />
        </div>
      </section>

      <section className="docs-section">
        <h2>Skeleton List</h2>
        <p className="mb-4">List item placeholders with avatars:</p>
        <div className="p-6 border rounded-lg bg-card">
          <SkeletonList count={4} lines={2} />
        </div>
      </section>

      <section className="docs-section">
        <h2>Animation Variants</h2>
        <p className="mb-4">Choose between shimmer, pulse, or no animation:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border rounded-lg bg-card">
            <p className="text-sm font-medium mb-3">Shimmer (default)</p>
            <SkeletonText lines={3} variant="shimmer" />
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <p className="text-sm font-medium mb-3">Pulse</p>
            <SkeletonText lines={3} variant="pulse" />
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <p className="text-sm font-medium mb-3">None</p>
            <SkeletonText lines={3} variant="none" />
          </div>
        </div>
      </section>

      <section className="docs-section">
        <h2>Real-World Examples</h2>
        <p className="mb-6">
          See how skeleton loaders are used in production throughout this documentation site:
        </p>

        <div className="space-y-8">
          {/* Page Skeleton Example */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Documentation Page Skeleton</h3>
                <p className="text-sm text-muted-foreground">
                  Full page loading state for documentation pages
                </p>
              </div>
              <button
                onClick={() => setShowPageSkeleton(!showPageSkeleton)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                {showPageSkeleton ? 'Hide' : 'Show'} Example
              </button>
            </div>
            {showPageSkeleton && (
              <div className="border rounded-lg p-6 bg-muted/30">
                <PageSkeleton />
              </div>
            )}
          </div>

          {/* Component Page Skeleton Example */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Component Page Skeleton</h3>
                <p className="text-sm text-muted-foreground">
                  Specialized loading state for component reference pages
                </p>
              </div>
              <button
                onClick={() => setShowComponentSkeleton(!showComponentSkeleton)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                {showComponentSkeleton ? 'Hide' : 'Show'} Example
              </button>
            </div>
            {showComponentSkeleton && (
              <div className="border rounded-lg p-6 bg-muted/30">
                <ComponentPageSkeleton />
              </div>
            )}
          </div>

          {/* Search Results Skeleton Example */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Search Results Skeleton</h3>
                <p className="text-sm text-muted-foreground">
                  Loading state for search and command palette results
                </p>
              </div>
              <button
                onClick={() => setShowSearchSkeleton(!showSearchSkeleton)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                {showSearchSkeleton ? 'Hide' : 'Show'} Example
              </button>
            </div>
            {showSearchSkeleton && (
              <div className="border rounded-lg p-6 bg-card max-w-2xl">
                <SearchResultsSkeleton />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul className="space-y-2">
          <li>✅ Use skeleton loaders for content that takes more than 300ms to load</li>
          <li>✅ Match skeleton shapes to actual content layout</li>
          <li>✅ Use shimmer animation for dynamic data, pulse for user-initiated actions</li>
          <li>✅ Keep skeleton count consistent with expected content</li>
          <li>✅ Avoid skeleton loaders for instant operations</li>
          <li>❌ Don't mix spinners and skeletons for the same loading state</li>
          <li>❌ Don't show skeleton loaders indefinitely (add timeout/error state)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Usage in This Docs Site</h2>
        <p>
          Skeleton loaders are actively used throughout this documentation site:
        </p>
        <div className="mt-4 p-4 border-l-4 border-info bg-info/5 rounded">
          <p className="text-sm font-medium mb-2">Live Examples:</p>
          <ul className="text-sm space-y-1">
            <li>• Page loading transitions between documentation pages</li>
            <li>• Component playground initialization states</li>
            <li>• Search results while filtering (Cmd+K)</li>
            <li>• Dynamic content loading in examples</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
