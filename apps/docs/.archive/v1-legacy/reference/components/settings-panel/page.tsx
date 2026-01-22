import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings Panel',
  description: 'A comprehensive settings panel for AI personality, UI preferences, privacy, and notifications.',
}

export default function SettingsPanelPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Settings Panel</h1>
        <p className="docs-lead">
          A comprehensive settings panel for AI personality, UI preferences, privacy, and notifications.
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
