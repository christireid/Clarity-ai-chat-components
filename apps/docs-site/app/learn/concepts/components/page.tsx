import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Components Overview - Learn Clarity Chat',
  description:
    'Understand the major component families in Clarity Chat and how to compose them for your product UI.',
}

export default function ComponentsConceptPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Concept</span>
        <h1>Component System</h1>
        <p className="docs-lead">
          Clarity Chat ships 70+ composable components. This overview helps you
          pick the right building blocks for conversations, streaming, analytics,
          and enterprise workflows.
        </p>
      </div>

      <section className="docs-section">
        <h2>Component Families</h2>
        <ul>
          <li>
            <strong>Conversation Core</strong>: <code>ChatWindow</code>,{' '}
            <code>Message</code>, <code>MessageList</code>, <code>ChatInput</code>
          </li>
          <li>
            <strong>Context &amp; Knowledge</strong>: <code>ContextCard</code>,{' '}
            <code>KnowledgeBaseViewer</code>, <code>MultiModalPreview</code>
          </li>
          <li>
            <strong>Streaming &amp; Status</strong>:{' '}
            <code>StreamingMessage</code>, <code>ThinkingIndicator</code>,{' '}
            <code>StreamCancellation</code>
          </li>
          <li>
            <strong>Branching &amp; History</strong>:{' '}
            <code>ConversationBranchVisualizer</code>, <code>ConversationList</code>
          </li>
          <li>
            <strong>Productivity</strong>: <code>CommandPalette</code>,{' '}
            <code>PromptLibrary</code>, <code>FollowUpSuggestions</code>
          </li>
          <li>
            <strong>Enterprise &amp; Analytics</strong>:{' '}
            <code>UsageDashboard</code>, <code>PerformanceDashboard</code>,{' '}
            <code>SafetyStatusCard</code>, <code>TokenCounter</code>
          </li>
          <li>
            <strong>AI Ops</strong>: <code>AgentRunFeed</code>, <code>ToolInvocationCard</code>,{' '}
            <code>SessionSummaryCard</code>
          </li>
        </ul>
        <Callout type="info">
          Every component is tree-shakeable. Only the pieces you import end up in
          your bundle.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Composing a Page</h2>
        <p>
          Components are designed to be composed like regular React building
          blocks. Here is a typical product page layout:
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
  ChatWindow,
  ConversationList,
  ContextVisualizer,
  UsageDashboard,
  useChat,
} from '@clarity-chat/react'

export function CustomerSuccessWorkspace() {
  const chat = useChat({ id: 'customer-success', api: '/api/chat/cs' })

  return (
    <div className="grid lg:grid-cols-[280px,minmax(0,1fr),320px] h-[calc(100vh-64px)]">
      <ConversationList
        conversations={chat.conversations}
        activeConversationId={chat.id}
        onSelectConversation={chat.setConversationId}
      />

      <ChatWindow
        messages={chat.messages}
        onSendMessage={chat.handleSubmit}
        onRegenerateMessage={chat.regenerateMessage}
        contextPanel={
          <ContextVisualizer
            contextItems={chat.context}
            onRemoveContext={chat.removeContextItem}
          />
        }
      />

      <UsageDashboard
        stats={chat.usage}
        limits={chat.limits}
        className="hidden xl:block border-l border-border"
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Customising Behaviour</h2>
        <p>
          Components expose granular props, slot-like overrides, and render props
          so you can adjust copy, icons, and layouts without forking.
        </p>
        <CodeBlock
          language="tsx"
          code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  components={{
    Message: (props) => (
      <Message
        {...props}
        avatar={props.message.role === 'assistant' ? assistantAvatar : userAvatar}
        className={
          props.message.role === 'assistant'
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200'
            : 'bg-surface border-border'
        }
      />
    ),
    Toolbar: ({ children }) => (
      <div className="flex items-center gap-2 border-t border-border bg-muted/30 px-3 py-2">
        <CommandPalette.Trigger />
        <PromptLibrary.Trigger />
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    ),
  }}
/>`}
        />
        <Callout type="tip">
          Need full control? Each component has a counterpart in the{' '}
          <code>primitives</code> package (Radix-style) so you can construct your
          own UI with the same accessibility guarantees.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>When to Reach for Storybook</h2>
        <p>
          The Storybook workspace (<code>npm run storybook</code>) showcases every
          component with knobs for props and best practice notes. Use it to:
        </p>
        <ul>
          <li>📚 Explore variants before integrating into your app</li>
          <li>🎨 Copy/paste code snippets for faster prototyping</li>
          <li>🧪 Verify accessibility &amp; responsive behaviour in isolation</li>
          <li>📝 Share interactive docs with design and product teams</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Key Takeaways</h2>
        <ul>
          <li>Start with <code>ChatWindow</code>; it covers 80% of use cases.</li>
          <li>Add specialised components (branching, tooling, dashboards) as product needs grow.</li>
          <li>Override slots/render props for brand-specific UI without rewriting logic.</li>
          <li>Use Storybook and the docs site to explore new components as they ship.</li>
        </ul>
      </section>
    </div>
  )
}

