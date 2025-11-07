import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Component Architecture',
  description: 'Understand the building blocks that power Clarity Chat interfaces.',
}

export default function ComponentConceptsPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Component Architecture</h1>

      <p className="lead">
        Clarity Chat ships a comprehensive suite of composable React components for building
        production-grade chat interfaces. Components are accessible by default, theme-aware, and
        deeply integrated with our hooks and utilities.
      </p>

      <Callout type="info">
        <p>
          Looking for prop tables or interactive playgrounds? Head to the{' '}
          <a href="/reference/components">component reference</a> for detailed API docs and live
          examples.
        </p>
      </Callout>

      <h2 id="core-layout">Core Layout</h2>
      <p>
        The <code>ChatWindow</code> orchestrates the full messaging surface—header, conversation
        timeline, and composer. Pair it with <code>ConversationBranchVisualizer</code> when you want
        Claude-style branching, or drop in <code>VirtualizedMessageList</code> to handle 10,000+
        messages without jank.
      </p>

      <CodeBlock
        title="Basic chat shell"
        language="tsx"
        code={`import { ChatWindow, VirtualizedMessageList, Message } from '@clarity-chat/react'
import { useState } from 'react'

export function SupportInbox() {
  const [messages, setMessages] = useState<Message[]>([])

  return (
    <ChatWindow
      messages={messages}
      messageListRenderer={(props) => (
        <VirtualizedMessageList
          messages={props.messages}
          renderMessage={props.renderMessage}
        />
      )}
      onSendMessage={(content) =>
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: 'user', content, timestamp: new Date() },
        ])
      }
    />
  )
}`}
      />

      <h2 id="message-presentation">Message Presentation</h2>
      <p>
        Render rich assistant responses with <code>StreamingMessage</code> for token-by-token output,
        <code>EnhancedMarkdownRenderer</code> for LaTeX + syntax highlighting, and{' '}
        <code>CitationCard</code> for grounded citations. The message system supports reactions,
        regeneration, edit history, and inline tool traces.
      </p>

      <ul>
        <li>
          <strong>Enhanced Markdown:</strong> drop-in LaTeX and code blocks with{' '}
          <code>MarkdownRendererEnhanced</code>.
        </li>
        <li>
          <strong>Inline tools:</strong> show tool invocation state with <code>ToolInvocationCard</code>.
        </li>
        <li>
          <strong>Safety overlays:</strong> stack moderation feedback using <code>SafetyStatusCard</code>.
        </li>
      </ul>

      <h2 id="system-controls">System Controls</h2>
      <p>
        The control surface helps operators manage AI behaviour. Combine{' '}
        <code>ModelSelector</code>, <code>PromptLibrary</code>, and <code>WorkflowSuggestionList</code>
        to give teams safe, auditable guardrails.
      </p>

      <ul>
        <li>
          <code>ModelSelector</code> switches adapters instantly with cost awareness.
        </li>
        <li>
          <code>PromptLibrary</code> exposes reusable prompt templates with role-based access.
        </li>
        <li>
          <code>UsageDashboard</code> surfaces live token consumption, quotas, and billing estimates.
        </li>
      </ul>

      <h2 id="journey-widgets">Journey Widgets</h2>
      <p>
        Build enterprise workflows with widgets that visualise conversation health and context:
      </p>
      <ul>
        <li>
          <code>ConversationTimeline</code> and <code>MemoryInspector</code> track message state and
          memory slots.
        </li>
        <li>
          <code>AgentRunFeed</code> highlights multi-agent orchestration with tool execution traces.
        </li>
        <li>
          <code>PerformanceDashboard</code> aggregates latency, cost, and satisfaction metrics.
        </li>
      </ul>

      <h2 id="blueprint-enhancements">Blueprint Enhancements</h2>
      <p>
        Phase 4 and v2.1 features are fully integrated into the component system:
      </p>
      <ul>
        <li>
          <strong>Conversation branching:</strong> <code>ConversationBranchVisualizer</code> +
          <code>useBranchManagement</code> bring Claude-style speculative replies.
        </li>
        <li>
          <strong>Virtual scrolling:</strong> <code>VirtualizedMessageList</code> +
          <code>MessageList</code> auto-switch between simple and virtualised rendering.
        </li>
        <li>
          <strong>Advanced exports:</strong> <code>ExportDialog</code> and{' '}
          <code>BatchExportDialog</code> connect directly to <code>export-utils</code>.
        </li>
      </ul>

      <h2 id="next-steps">Next Steps</h2>
      <ul>
        <li>
          Explore the <a href="/reference/components">component reference</a> for props and playgrounds.
        </li>
        <li>
          Read the <a href="/cookbook/agent-with-tools">cookbook</a> for end-to-end recipes.
        </li>
        <li>
          Try the <a href="/examples">examples</a> to see components assembled in real products.
        </li>
      </ul>
    </>
  )
}
