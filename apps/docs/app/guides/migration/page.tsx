import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Migration Guide - Clarity Chat',
  description: 'This guide helps you migrate between versions of Clarity Chat and from other chat libraries.',
}

export default function MigrationGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Migration Guide</h1>
        <p className="docs-lead">
          This guide helps you migrate between versions of Clarity Chat and from other chat libraries.
        </p>
      </div>

      <section className="docs-section">
        <h2>Upgrading from v1.x to v2.x</h2>

        <h3>Breaking Changes</h3>

        <h4>Component Props</h4>
        <p>
          Some component props have been renamed for consistency:
        </p>
        <CodeBlock
          language="tsx"
          code={`// v1.x
<ChatWindow 
  onMessage={handleMessage}
  enableMarkdown={true}
/>

// v2.x
<ChatWindow 
  onSendMessage={handleMessage}
  enableMarkdown={true}
/>`}
        />

        <h4>Hook API Changes</h4>
        <p>
          The <code>useChat</code> hook has been enhanced:
        </p>
        <CodeBlock
          language="tsx"
          code={`// v1.x
const { messages, sendMessage } = useChat({
  initialMessages: [],
})

// v2.x
const { messages, sendMessage, isLoading, error } = useChat({
  initialMessages: [],
  onError: (error) => console.error(error),
})`}
        />

        <h4>Type Changes</h4>
        <p>
          Message types have been updated:
        </p>
        <CodeBlock
          language="tsx"
          code={`// v1.x
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

// v2.x
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  metadata?: Record<string, any>
}`}
        />

        <h3>Migration Steps</h3>
        <ol>
          <li><strong>Update Dependencies</strong>
            <CodeBlock language="bash" code="npm install @clarity-chat/react@latest" />
          </li>
          <li><strong>Update Component Props</strong>
            <p>Search and replace:</p>
            <ul>
              <li><code>onMessage</code> → <code>onSendMessage</code></li>
              <li><code>onSubmit</code> → <code>onSendMessage</code></li>
              <li><code>isTyping</code> → <code>isLoading</code></li>
            </ul>
          </li>
          <li><strong>Update Hook Usage</strong>
            <CodeBlock
              language="tsx"
              code={`// Before
const { messages, send } = useChat()

// After
const { messages, sendMessage } = useChat()`}
            />
          </li>
          <li><strong>Update Type Imports</strong>
            <CodeBlock
              language="tsx"
              code={`// Before
import type { Message } from '@clarity-chat/types'

// After (if using new types)
import type { Message } from '@clarity-chat/react'`}
            />
          </li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Migrating from Other Libraries</h2>

        <h3>From react-chat-ui</h3>
        <CodeBlock
          language="tsx"
          code={`// react-chat-ui
import { ChatFeed, MessageGroup } from 'react-chat-ui'

// Clarity Chat
import { ChatWindow } from '@clarity-chat/react'

// Before
<ChatFeed
  messages={messages}
  isTyping={isTyping}
/>

// After
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
/>`}
        />

        <h3>From react-chatbot-kit</h3>
        <CodeBlock
          language="tsx"
          code={`// react-chatbot-kit
import Chatbot from 'react-chatbot-kit'

// Clarity Chat
import { ChatWindow } from '@clarity-chat/react'

// Before
<Chatbot
  config={config}
  messageParser={MessageParser}
  actionProvider={ActionProvider}
/>

// After
<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
/>`}
        />

        <h3>From Vercel AI SDK</h3>
        <CodeBlock
          language="tsx"
          code={`// Vercel AI SDK
import { useChat } from 'ai/react'

// Clarity Chat
import { useChat } from '@clarity-chat/react'

// Before
const { messages, input, handleInputChange, handleSubmit } = useChat()

// After
const { messages, sendMessage, isLoading } = useChat({
  onSendMessage: async (content) => {
    // Your send logic
  },
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Common Migration Patterns</h2>

        <h3>Message Format Conversion</h3>
        <CodeBlock
          language="tsx"
          code={`// Convert from old format
function convertMessages(oldMessages: OldMessage[]): Message[] {
  return oldMessages.map(msg => ({
    id: msg.id || Date.now().toString(),
    role: msg.role,
    content: msg.text || msg.content,
    timestamp: msg.timestamp || Date.now(),
  }))
}`}
        />

        <h3>Event Handler Conversion</h3>
        <CodeBlock
          language="tsx"
          code={`// Before
const handleMessage = (message: string) => {
  // Handle message
}

// After
const handleSendMessage = async (content: string) => {
  // Handle message (now async)
  await sendToAPI(content)
}`}
        />

        <h3>State Management Conversion</h3>
        <CodeBlock
          language="tsx"
          code={`// Before (manual state)
const [messages, setMessages] = useState([])

const handleSend = (text: string) => {
  setMessages([...messages, { text, role: 'user' }])
}

// After (with hook)
const { messages, sendMessage } = useChat({
  onSendMessage: async (content) => {
    // Auto-manages state
  },
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Troubleshooting</h2>

        <h3>Type Errors</h3>
        <p>
          If you see TypeScript errors:
        </p>
        <ol>
          <li>Update your TypeScript version:
            <CodeBlock language="bash" code="npm install -D typescript@latest" />
          </li>
          <li>Clear type cache:
            <CodeBlock language="bash" code="rm -rf node_modules/.cache" />
          </li>
        </ol>

        <h3>Styling Issues</h3>
        <p>
          If styles are missing:
        </p>
        <CodeBlock language="tsx" code={`// Import default styles
import '@clarity-chat/react/styles.css'`} />

        <h3>Performance Issues</h3>
        <p>
          Enable virtualization for large message lists:
        </p>
        <CodeBlock
          language="tsx"
          code={`<ChatWindow
  messages={messages}
  virtualizeMessages
  onSendMessage={handleSend}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Need Help?</h2>
        <ul>
          <li>Check the <a href="/reference/components">API Reference</a> for updated APIs</li>
          <li>Review <a href="/examples">Examples</a> for migration patterns</li>
          <li>Open an issue on <a href="https://github.com/christireid/Clarity-ai-chat-components/issues" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </section>
    </div>
  )
}
