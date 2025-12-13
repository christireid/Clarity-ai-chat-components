import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'Customization Strategies - Clarity Chat Components',
  description: 'Learn strategies for customizing Clarity Chat Components to match your brand and requirements.',
}

export default function CustomizationStrategiesPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Customization Strategies</h1>
        <p className="docs-lead">
          Learn strategies for customizing Clarity Chat Components to match your brand, design system, and specific requirements.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Customize themes and colors',
          'Override component styles',
          'Create custom components',
          'Extend component functionality',
          'Match your design system',
        ]}
      />

      <section className="docs-section">
        <h2>Theming</h2>
        <p>
          Customize themes and colors:
        </p>
        <CodePlayground
          initialCode={`import { ThemeProvider } from '@clarity-chat/react'

// Custom theme
const customTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    foreground: '#1f2937',
    muted: '#f3f4f6',
    border: '#e5e7eb',
  },
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
}

function CustomThemedChat() {
  return (
    <ThemeProvider theme={customTheme}>
      <ChatWindow messages={messages} />
    </ThemeProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Style Overrides</h2>
        <p>
          Override component styles:
        </p>
        <CodePlayground
          initialCode={`import { ChatWindow } from '@clarity-chat/react'
import './custom-chat.css'

// custom-chat.css
.custom-chat {
  --chat-bg: #f9fafb;
  --chat-border: #e5e7eb;
  --chat-text: #1f2937;
}

function CustomStyledChat() {
  return (
    <ChatWindow
      messages={messages}
      className="custom-chat"
    />
  )
}

// Or with Tailwind
function TailwindChat() {
  return (
    <ChatWindow
      messages={messages}
      className="bg-gray-50 border-gray-200 rounded-lg"
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Components</h2>
        <p>
          Create custom components:
        </p>
        <CodePlayground
          initialCode={`import { Message, MessageProps } from '@clarity-chat/react'

// Custom message component
function CustomMessage({ message, ...props }: MessageProps) {
  return (
    <div className="custom-message">
      <div className="message-header">
        <span className="message-role">{message.role}</span>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
      <div className="message-content">{message.content}</div>
    </div>
  )
}

// Use custom component
function CustomChat() {
  return (
    <ChatWindow
      messages={messages}
      components={{
        Message: CustomMessage,
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Component Composition</h2>
        <p>
          Compose custom chat interfaces:
        </p>
        <CodePlayground
          initialCode={`import {
  ChatInput,
  MessageList,
  StreamingMessage,
} from '@clarity-chat/react'

function CustomChatInterface() {
  const [messages, setMessages] = useState([])
  const chat = useClarityChat({ api: '/api/chat' })

  return (
    <div className="custom-chat-layout">
      <header className="chat-header">
        <h1>Custom Chat</h1>
      </header>
      <MessageList
        messages={messages}
        renderMessage={(msg) => (
          <CustomMessage message={msg} />
        )}
      />
      <footer className="chat-footer">
        <ChatInput
          onSend={(content) => chat.sendMessage(content)}
        />
      </footer>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Design System Integration</h2>
        <p>
          Integrate with your design system:
        </p>
        <CodePlayground
          initialCode={`import { Button, Input } from '@your-design-system/ui'
import { ChatInput } from '@clarity-chat/react'

// Wrap components with design system
function DesignSystemChat() {
  return (
    <ChatInput
      components={{
        Button: Button,
        Input: Input,
      }}
      onSend={(content) => {
        // Handle send
      }}
    />
  )
}

// Or use CSS variables
function CSSVariableChat() {
  return (
    <div style={{
      '--clarity-primary': 'var(--ds-primary)',
      '--clarity-secondary': 'var(--ds-secondary)',
      '--clarity-font': 'var(--ds-font-family)',
    }}>
      <ChatWindow messages={messages} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use CSS variables for theme customization</li>
          <li>Compose components for flexibility</li>
          <li>Create custom components when needed</li>
          <li>Match your design system</li>
          <li>Test accessibility after customization</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/guides/composition-patterns">Composition Patterns</a> - Composition guide</li>
          <li><a href="/guides/component-hierarchy">Component Hierarchy</a> - Component structure</li>
        </ul>
      </section>
    </div>
  )
}
