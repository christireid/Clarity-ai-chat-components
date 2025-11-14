import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Components API Reference - Clarity Chat',
  description: 'Complete reference for all Clarity Chat components.',
}

export default function ComponentsAPIPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">API Reference</span>
        <h1>Components API</h1>
        <p className="docs-lead">
          Complete reference for all Clarity Chat components.
        </p>
      </div>

      <section className="docs-section">
        <h2>ChatWindow</h2>
        <p>
          The main container component that orchestrates the entire chat interface.
        </p>

        <h3>Props</h3>
        <CodeBlock
          language="typescript"
          code={`interface ChatWindowProps {
  messages: Message[]
  isLoading?: boolean
  onSendMessage: (content: string) => void | Promise<void>
  onCancel?: () => void
  onEditMessage?: (messageId: string, newContent: string) => void
  onRegenerateMessage?: (messageId: string) => void
  onDeleteMessage?: (messageId: string) => void
  onBranchMessage?: (messageId: string) => void
  onFileUpload?: (files: File[]) => void
  placeholder?: string
  maxHeight?: string | number
  enableFileUpload?: boolean
  enableMessageOperations?: boolean
  enableMarkdown?: boolean
  enableCodeHighlight?: boolean
  theme?: ThemeConfig
  className?: string
}`}
        />

        <h3>Usage</h3>
        <CodeBlock
          language="tsx"
          code={`<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSendMessage}
  onCancel={handleCancel}
  placeholder="Type your message..."
  maxHeight="600px"
  enableFileUpload
  enableMessageOperations
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>MessageList</h2>
        <p>
          Displays a scrollable list of messages with auto-scroll and virtualization.
        </p>

        <h3>Props</h3>
        <CodeBlock
          language="typescript"
          code={`interface MessageListProps {
  messages: Message[]
  onEditMessage?: (messageId: string, newContent: string) => void
  onRegenerateMessage?: (messageId: string) => void
  onDeleteMessage?: (messageId: string) => void
  onCopyMessage?: (messageId: string) => void
  enableMessageOperations?: boolean
  enableMarkdown?: boolean
  enableCodeHighlight?: boolean
  virtualizeMessages?: boolean
  className?: string
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Message</h2>
        <p>
          Individual message component with role-based styling.
        </p>

        <h3>Props</h3>
        <CodeBlock
          language="typescript"
          code={`interface MessageProps {
  message: Message
  onEdit?: (messageId: string, newContent: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onCopy?: (messageId: string) => void
  enableOperations?: boolean
  enableMarkdown?: boolean
  enableCodeHighlight?: boolean
  className?: string
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Common Types</h2>

        <h3>Message</h3>
        <CodeBlock
          language="typescript"
          code={`interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  isStreaming?: boolean
  error?: boolean
  metadata?: Record<string, any>
}`}
        />

        <h3>ThemeConfig</h3>
        <CodeBlock
          language="typescript"
          code={`interface ThemeConfig {
  primaryColor?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderRadius?: string
  fontFamily?: string
  fontSize?: string
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/reference/hooks">Hooks API</a> - Learn about available hooks</li>
          <li><a href="/reference/api/types">Types</a> - Complete type definitions</li>
          <li><a href="/guides/theming">Theming</a> - Customize appearance</li>
          <li><a href="/examples">Examples</a> - See components in action</li>
        </ul>
      </section>
    </div>
  )
}
