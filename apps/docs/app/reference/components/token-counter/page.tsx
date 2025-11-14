import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Token Counter',
  description: 'A real-time token usage counter with cost estimation, visual progress bar, and smart pruning suggestions.',
}

export default function TokenCounterPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Token Counter</h1>
        <p className="docs-lead">
          A real-time token usage counter with cost estimation, visual progress bar, and smart pruning suggestions.
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
