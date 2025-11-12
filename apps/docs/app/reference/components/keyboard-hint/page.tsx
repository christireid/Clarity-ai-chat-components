import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Keyboard Hint',
  description: 'A keyboard shortcuts panel with visual key representations and a hook for managing keyboard shortcuts.',
}

export default function KeyboardHintPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Keyboard Hint</h1>
        <p className="docs-lead">
          A keyboard shortcuts panel with visual key representations and a hook for managing keyboard shortcuts.
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
