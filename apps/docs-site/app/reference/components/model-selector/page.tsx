import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Model Selector',
  description: 'A dropdown component for switching between AI models with metrics like speed, cost, and quality indicators.',
}

export default function ModelSelectorPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Model Selector</h1>
        <p className="docs-lead">
          A dropdown component for switching between AI models with metrics like speed, cost, and quality indicators.
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
