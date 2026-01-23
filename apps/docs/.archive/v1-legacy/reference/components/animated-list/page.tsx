import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Animated List',
  description: 'Pre-configured AnimatePresence wrappers for list animations with stagger effects, fade, slide, and scale transitions.',
}

export default function AnimatedListPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Animated List</h1>
        <p className="docs-lead">
          Pre-configured AnimatePresence wrappers for list animations with stagger effects, fade, slide, and scale transitions.
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
