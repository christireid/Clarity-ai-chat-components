import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Interactive Examples - Clarity Chat',
  description: 'Try out Clarity Chat components directly in your browser! Edit the code and see changes in real-time.',
}

export default function InteractiveGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Interactive Examples</h1>
        <p className="docs-lead">
          Try out Clarity Chat components directly in your browser! Edit the code and see changes in real-time.
        </p>
      </div>

      <Callout type="info" title="Interactive Playground">
        For live, interactive examples, visit our <a href="/examples">Examples</a> page or check out the Storybook catalog by running <code>npm run storybook</code> locally.
      </Callout>

      <section className="docs-section">
        <h2>Basic Chat Window</h2>
        <p>
          A minimal chat window with message sending capability:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export function BasicChat() {
  const [messages, setMessages] = useState([])
  
  return (
    <ChatWindow
      messages={messages}
      onSendMessage={(content) => {
        setMessages([...messages, {
          id: Date.now().toString(),
          role: 'user',
          content,
          timestamp: Date.now(),
        }])
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Message with Markdown</h2>
        <p>
          Messages support Markdown formatting including code blocks, lists, and emphasis:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow } from '@clarity-chat/react'

const messages = [{
  id: '1',
  role: 'assistant',
  content: \`# Welcome!

This is **bold** and this is *italic*.

\`\`\`javascript
console.log('Code blocks work!')
\`\`\`

- Lists
- Work too\`,
  timestamp: Date.now(),
}]

<ChatWindow messages={messages} onSendMessage={() => {}} />`}
        />
      </section>

      <section className="docs-section">
        <h2>Streaming Messages</h2>
        <p>
          Real-time streaming responses with typing animation:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow, useStreamingChat } from '@clarity-chat/react'

export function StreamingChat() {
  const { messages, sendMessage, isLoading } = useStreamingChat({
    url: '/api/chat/stream',
  })
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Styling</h2>
        <p>
          Customize the appearance with your own styles:
        </p>
        <CodeBlock
          language="tsx"
          code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  theme={{
    primaryColor: '#6366f1',
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif',
  }}
  className="custom-chat-window"
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Message Actions</h2>
        <p>
          Messages with feedback, copy, and retry functionality:
        </p>
        <CodeBlock
          language="tsx"
          code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  onFeedback={(messageId, feedback) => {
    console.log('Feedback:', feedback)
  }}
  onCopyMessage={(content) => {
    navigator.clipboard.writeText(content)
  }}
  onRetryMessage={(messageId) => {
    // Retry logic
  }}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced AI Operations Toolkit</h2>
        <p>
          Beyond core chat primitives, Clarity ships a library of AI-operations components that elevate review, safety, and hand-off flows:
        </p>
        <ul>
          <li><strong>FollowUpSuggestions</strong> surfaces contextual quick prompts so users can keep the conversation flowing.</li>
          <li><strong>PersonaPanel</strong> lets operators swap between curated assistant personas with distinct tone and temperatures.</li>
          <li><strong>ConversationTimeline</strong> visualises user turns, assistant responses, and tool calls in sequence.</li>
          <li><strong>MemoryInspector</strong> exposes what context is pinned across session, thread, or global scopes.</li>
          <li><strong>SafetyStatusCard</strong> aggregates moderation outcomes so risk teams can approve or redact a reply.</li>
          <li><strong>ResponseQualityMeter</strong> charts evaluation metrics like groundedness versus target thresholds.</li>
          <li><strong>MultiModalPreview</strong> previews images, audio, video, and docs referenced by the assistant.</li>
          <li><strong>AgentRunFeed</strong> tracks autonomous agent/tool runs with retry and log access.</li>
          <li><strong>SessionSummaryCard</strong> produces a shareable recap with metrics and recommended next actions.</li>
          <li><strong>WorkflowSuggestionList</strong> recommends templated flows (e.g., support hand-off, marketing brief) users can trigger.</li>
        </ul>
        <p>
          Combine these modules inside custom dashboards to ship production-ready agent experiences that are auditable, safe, and actionable.
        </p>
      </section>

      <section className="docs-section">
        <h2>Tips for Customization</h2>

        <h3>Styling</h3>
        <ul>
          <li>Use the <code>className</code> prop to add custom CSS classes</li>
          <li>Override CSS variables for theme customization</li>
          <li>Use Tailwind utility classes for quick styling</li>
        </ul>

        <h3>Behavior</h3>
        <ul>
          <li>Control loading states with <code>isLoading</code> prop</li>
          <li>Handle errors with <code>onError</code> callbacks</li>
          <li>Customize placeholders and labels</li>
        </ul>

        <h3>Advanced</h3>
        <ul>
          <li>Integrate with your backend API</li>
          <li>Add custom middleware for message processing</li>
          <li>Implement file upload and preview</li>
          <li>Add emoji picker and mentions</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li>Explore the <a href="/reference/components">API Reference</a> for complete prop documentation</li>
          <li>Check out the <a href="/cookbook">Cookbook</a> for more advanced recipes</li>
          <li>View the <a href="/examples">Examples</a> for full application demos</li>
        </ul>
      </section>
    </div>
  )
}
