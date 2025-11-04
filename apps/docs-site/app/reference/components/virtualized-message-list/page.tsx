import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Virtualized Message List - Clarity Chat',
  description: 'High-performance message list using virtual scrolling for handling thousands of messages efficiently.',
}

export default function VirtualizedMessageListClarityChatPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Virtualized Message List - Clarity Chat</h1>
        <p className="docs-lead">
          High-performance message list using virtual scrolling for handling thousands of messages efficiently.
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
