import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conversation List - Clarity Chat',
  description: 'Organize and navigate multiple AI conversations with search, filters, sorting, pinning, and multi-select capabilities.',
}

export default function ConversationListClarityChatPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Conversation List - Clarity Chat</h1>
        <p className="docs-lead">
          Organize and navigate multiple AI conversations with search, filters, sorting, pinning, and multi-select capabilities.
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
