import { Metadata } from 'next'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

export const metadata: Metadata = {
  title: 'Skeleton Loaders',
  description: 'Loading placeholder components with shimmer and pulse animations for displaying content structure while data loads.',
}

export default function SkeletonLoadersPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Skeleton Loaders</h1>
        <p className="docs-lead">
          Loading placeholder components with shimmer and pulse animations for displaying content structure while data loads.
        </p>
      </div>

      <ViewInStorybook component="Skeleton" />

      <section className="docs-section">
        <p className="text-sm text-muted-foreground">
          Note: Full documentation for this component is being migrated. Please refer to the storybook for interactive examples.
        </p>
      </section>
    </div>
  )
}
