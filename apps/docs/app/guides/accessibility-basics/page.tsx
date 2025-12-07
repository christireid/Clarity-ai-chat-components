import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Accessibility Basics - Clarity Chat Components',
  description: 'Learn accessibility best practices for chat applications including ARIA patterns, keyboard navigation, and screen reader support.',
}

export default function AccessibilityBasicsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Accessibility Basics</h1>
        <p className="docs-lead">
          Learn accessibility best practices for chat applications including ARIA patterns, keyboard navigation, screen reader support, and WCAG compliance.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Implement ARIA patterns',
          'Enable keyboard navigation',
          'Support screen readers',
          'Manage focus',
          'Ensure WCAG compliance',
        ]}
      />

      <section className="docs-section">
        <h2>ARIA Patterns</h2>
        <p>
          Use proper ARIA attributes:
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
        aria-describedby="input-help"
      />
      <div id="input-help" className="sr-only">
        Press Enter to send, Escape to cancel
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Keyboard Navigation</h2>
        <p>
          Ensure keyboard accessibility:
        </p>
        <CodePlayground
          initialCode={`import { ChatWindow, ChatInput } from '@clarity-chat/react'
import { useKeyboardShortcuts } from '@clarity-chat/react'

function KeyboardAccessibleChat() {
  const { registerShortcut } = useKeyboardShortcuts()

  // Register keyboard shortcuts
  React.useEffect(() => {
    registerShortcut('Escape', () => {
      // Close chat or clear input
    })
    registerShortcut('Ctrl+K', () => {
      // Open command palette
    })
  }, [])

  return (
    <div>
      <ChatWindow
        messages={messages}
        // Tab navigation enabled by default
      />
      <ChatInput
        onSend={handleSend}
        // Enter to send, Escape to cancel
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Screen Reader Support</h2>
        <p>
          Optimize for screen readers:
        </p>
        <CodePlayground
          initialCode={`import { ChatWindow } from '@clarity-chat/react'

function ScreenReaderOptimized() {
  return (
    <div>
      <ChatWindow
        messages={messages}
        aria-label="Chat conversation"
        aria-live="polite"
        // Announce new messages
        onNewMessage={(message) => {
          // Announce to screen reader
          announceToScreenReader(\`New message: \${message.content}\`)
        }}
      />
    </div>
  )
}

function announceToScreenReader(text: string) {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = text
  document.body.appendChild(announcement)
  setTimeout(() => document.body.removeChild(announcement), 1000)
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Focus Management</h2>
        <p>
          Manage focus properly:
        </p>
        <CodePlayground
          initialCode={`import { ChatWindow, ChatInput } from '@clarity-chat/react'
import { useEffect, useRef } from 'react'

function FocusManagedChat() {
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div>
      <ChatWindow
        messages={messages}
        ref={messagesEndRef}
      />
      <ChatInput
        ref={inputRef}
        onSend={handleSend}
        // Focus returns to input after send
        onSendComplete={() => {
          inputRef.current?.focus()
        }}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>WCAG Compliance</h2>
        <p>
          Ensure WCAG 2.1 AA compliance:
        </p>
        <CodePlayground
          initialCode={`import { ChatWindow } from '@clarity-chat/react'

function WCAGCompliantChat() {
  return (
    <div>
      {/* Color contrast: 4.5:1 for text */}
      <ChatWindow
        messages={messages}
        className="text-foreground bg-background"
        // Ensure sufficient contrast
      />
      
      {/* Keyboard accessible */}
      <ChatInput
        onSend={handleSend}
        // All functions accessible via keyboard
      />
      
      {/* Focus indicators */}
      <style>{`
        *:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use semantic HTML and ARIA attributes</li>
          <li>Ensure all functionality is keyboard accessible</li>
          <li>Provide focus indicators</li>
          <li>Use aria-live regions for dynamic content</li>
          <li>Maintain color contrast ratios (4.5:1 minimum)</li>
          <li>Test with screen readers</li>
          <li>Provide alternative text for images</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/chat-window">ChatWindow</a> - Main chat component</li>
          <li><a href="/reference/components/chat-input">ChatInput</a> - Chat input component</li>
          <li><a href="/reference/hooks/use-keyboard-shortcuts">useKeyboardShortcuts</a> - Keyboard shortcuts hook</li>
        </ul>
      </section>
    </div>
  )
}
