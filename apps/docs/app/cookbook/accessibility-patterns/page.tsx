import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Accessibility Patterns Recipe - Clarity Chat Components',
  description: 'Learn accessibility patterns for Clarity Chat Components, including ARIA attributes, keyboard navigation, and screen reader support.',
}

export default function AccessibilityPatternsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Accessibility Patterns</h1>
        <p className="docs-lead">
          Learn accessibility patterns for Clarity Chat Components, including ARIA attributes, keyboard navigation, screen reader support, and WCAG compliance.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Add ARIA attributes',
          'Implement keyboard navigation',
          'Support screen readers',
          'Manage focus',
          'Ensure WCAG compliance',
        ]}
      />

      <section className="docs-section">
        <h2>ARIA Attributes</h2>
        <p>
          Add ARIA attributes for accessibility:
        </p>
        <CodePlayground
          initialCode={`import { ChatWindow } from '@clarity-chat/react'

function AccessibleChat() {
  return (
    <div
      role="region"
      aria-label="Chat conversation"
      aria-live="polite"
      aria-atomic="false"
    >
      <ChatWindow
        messages={messages}
        aria-label="Chat messages"
      />
      <ChatInput
        aria-label="Type your message"
        aria-describedby="chat-input-help"
      />
      <div id="chat-input-help" className="sr-only">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  )
}

// Message component with ARIA
function AccessibleMessage({ message }: { message: Message }) {
  return (
    <div
      role="article"
      aria-label={\`Message from \${message.role}\`}
      aria-labelledby={\`message-\${message.id}-header\`}
    >
      <div id={\`message-\${message.id}-header\`} className="sr-only">
        {message.role} message
      </div>
      <div>{message.content}</div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Keyboard Navigation</h2>
        <p>
          Implement keyboard navigation:
        </p>
        <CodePlayground
          initialCode={`import { ChatInput } from '@clarity-chat/react'
import { useKeyboardNavigation } from '@clarity-chat/react'

function KeyboardAccessibleChat() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(0, prev - 1))
        break
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(messages.length - 1, prev + 1))
        break
      case 'Enter':
        if (selectedIndex >= 0) {
          handleMessageSelect(messages[selectedIndex])
        }
        break
      case 'Escape':
        setSelectedIndex(-1)
        break
    }
  }

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <ChatWindow messages={messages} />
      <ChatInput
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend(e.target.value)
          }
        }}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Screen Reader Support</h2>
        <p>
          Support screen readers:
        </p>
        <CodePlayground
          initialCode={`import { ChatWindow } from '@clarity-chat/react'

function ScreenReaderChat() {
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      setAnnouncements(prev => [
        ...prev,
        \`New message from \${lastMessage.role}\`,
      ])
    }
  }, [messages])

  return (
    <div>
      {/* Live region for announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements[announcements.length - 1]}
      </div>

      <ChatWindow
        messages={messages}
        aria-label="Chat conversation"
      />
    </div>
  )
}

// Accessible message format
function AccessibleMessage({ message }: { message: Message }) {
  return (
    <div
      role="article"
      aria-label={\`\${message.role} message: \${message.content.substring(0, 50)}\`}
    >
      <div className="message-header">
        <span className="sr-only">{message.role}</span>
        <time dateTime={new Date(message.timestamp).toISOString()}>
          {formatTime(message.timestamp)}
        </time>
      </div>
      <div>{message.content}</div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Focus Management</h2>
        <p>
          Manage focus for accessibility:
        </p>
        <CodePlayground
          initialCode={`import { useEffect, useRef } from 'react'
import { ChatWindow } from '@clarity-chat/react'

function FocusManagedChat() {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Focus new messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = chatContainerRef.current?.querySelector(
        \`[data-message-id="\${messages[messages.length - 1].id}"]\`
      ) as HTMLElement
      lastMessage?.focus()
    }
  }, [messages])

  // Trap focus in modal
  function trapFocus(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      const focusableElements = chatContainerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      // Implement focus trap logic
    }
  }

  return (
    <div
      ref={chatContainerRef}
      onKeyDown={trapFocus}
      role="dialog"
      aria-modal="true"
    >
      <ChatWindow messages={messages} />
      <ChatInput ref={inputRef} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>WCAG Compliance</h2>
        <p>
          Ensure WCAG compliance:
        </p>
        <CodePlayground
          initialCode={`// WCAG 2.1 AA compliance checklist

function WCAGCompliantChat() {
  return (
    <div>
      {/* 1. Color contrast (4.5:1 for text) */}
      <ChatWindow
        messages={messages}
        className="text-foreground bg-background"
        style={{
          color: '#1f2937', // High contrast
          backgroundColor: '#ffffff',
        }}
      />

      {/* 2. Keyboard accessible */}
      <ChatInput
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend()
        }}
        tabIndex={0}
      />

      {/* 3. Screen reader support */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements}
      </div>

      {/* 4. Focus indicators */}
      <button
        className="focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Send message"
      >
        Send
      </button>

      {/* 5. Alt text for images */}
      <img
        src={imageUrl}
        alt="Chat message attachment"
        aria-describedby="image-description"
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Add ARIA labels and roles</li>
          <li>Implement keyboard navigation</li>
          <li>Support screen readers with live regions</li>
          <li>Manage focus appropriately</li>
          <li>Ensure color contrast (WCAG AA)</li>
          <li>Test with screen readers</li>
          <li>Test keyboard-only navigation</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/guides/accessibility-basics">Accessibility Basics</a> - Accessibility guide</li>
          <li><a href="/reference/components/chat-window">ChatWindow</a> - Chat window component</li>
        </ul>
      </section>
    </div>
  )
}
