import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Error Boundary | Clarity Chat',
  description: 'Component documentation for error boundary.'
}

export default function ErrorBoundaryPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Error Boundary</h1>
        <p className="docs-lead">
          Component documentation for error boundary.
        </p>
      </div>
      <section className="docs-section">
        <p className="text-sm text-muted-foreground">
          Note: Full documentation for this component is being migrated. Please refer to the storybook for interactive examples.
        </p>
      </section>
    </div>
  )
}
