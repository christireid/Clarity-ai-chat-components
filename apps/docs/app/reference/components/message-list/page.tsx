import { Metadata } from 'next'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

export const metadata: Metadata = {
  title: 'Message List - Clarity Chat',
  description: 'A container component for displaying chat messages with auto-scroll, loading states, empty states, and smooth animations.',
}

export default function MessageListClarityChatPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Message List - Clarity Chat</h1>
        <p className="docs-lead">
          A container component for displaying chat messages with auto-scroll, loading states, empty states, and smooth animations.
        </p>
      </div>

      <ViewInStorybook component="MessageList" />

      <section className="docs-section">
        <p className="text-sm text-muted-foreground">
          Note: Full documentation for this component is being migrated. Please refer to the storybook for interactive examples.
        </p>
      </section>
    </div>
  )
}
