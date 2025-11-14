import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interactive Card',
  description: 'Enhanced card components with hover states, focus rings, ripple effects, and interactive behaviors.',
}

export default function InteractiveCardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Interactive Card</h1>
        <p className="docs-lead">
          Enhanced card components with hover states, focus rings, ripple effects, and interactive behaviors.
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
