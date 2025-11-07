import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collapsible Section',
  description: 'Animated expand/collapse components including collapsible sections, accordions, and expandable list items.',
}

export default function CollapsibleSectionPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Collapsible Section</h1>
        <p className="docs-lead">
          Animated expand/collapse components including collapsible sections, accordions, and expandable list items with smooth height transitions.
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
