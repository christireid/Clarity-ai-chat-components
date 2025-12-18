/**
 * Chat Showcase
 * 
 * Demonstrates chat-specific components
 */

import { Message, ChatInput, ThinkingIndicator, EmptyState } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message as MessageType } from '@clarity-chat/types'

export function ChatShowcase() {
  const [inputValue, setInputValue] = useState('')
  
  const messages: MessageType[] = [
    {
      id: '1',
      chatId: 'showcase',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      createdAt: new Date(Date.now() - 60000),
      updatedAt: new Date(Date.now() - 60000),
      status: 'sent',
    },
    {
      id: '2',
      chatId: 'showcase',
      role: 'user',
      content: 'I need help understanding the design system patterns.',
      createdAt: new Date(Date.now() - 30000),
      updatedAt: new Date(Date.now() - 30000),
      status: 'sent',
    },
    {
      id: '3',
      chatId: 'showcase',
      role: 'assistant',
      content: "I'd be happy to help! The design system uses 6 core patterns: ring-based borders, refined shadows, consistent radius, enhanced focus states, precise hover effects, and consistent opacity. Which would you like to learn about?",
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Chat Components</h2>
        <p className="text-muted-foreground">
          Specialized components for building chat interfaces
        </p>
      </div>

      {/* Message Components */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Message Bubbles</h3>
        <div className="space-y-4 max-w-2xl">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
            />
          ))}
        </div>
        <div className="mt-4 p-4 rounded-lg ring-1 ring-border/30 bg-muted/30">
          <h4 className="text-sm font-medium mb-2">Message Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Assistant messages: rounded-lg with subtle background</li>
            <li>• User messages: rounded-md with primary color ring</li>
            <li>• Hover effects: bg-muted/30 shadow-xs</li>
            <li>• Timestamp support</li>
            <li>• Avatar integration</li>
          </ul>
        </div>
      </section>

      {/* Thinking Indicator */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Thinking Indicator</h3>
        <div className="max-w-2xl">
          <ThinkingIndicator />
        </div>
        <div className="mt-4 p-4 rounded-lg ring-1 ring-border/30 bg-muted/30">
          <h4 className="text-sm font-medium mb-2">Thinking Indicator Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Animated dots to show AI is processing</li>
            <li>• rounded-md ring-1 ring-border/30</li>
            <li>• bg-muted/30 for subtle background</li>
            <li>• shadow-xs for depth</li>
          </ul>
        </div>
      </section>

      {/* Chat Input */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Chat Input</h3>
        <div className="max-w-2xl">
          <ChatInput
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            onSubmit={() => {
              SecureLogger.debug('Submitted:', inputValue)
              setInputValue('')
            }}
            placeholder="Type your message..."
          />
        </div>
        <div className="mt-4 p-4 rounded-lg ring-1 ring-border/30 bg-muted/30">
          <h4 className="text-sm font-medium mb-2">Chat Input Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Auto-expanding textarea</li>
            <li>• Send button with hover effects</li>
            <li>• Enter to send, Shift+Enter for new line</li>
            <li>• Character counter support</li>
            <li>• File attachment support</li>
          </ul>
        </div>
      </section>

      {/* Empty State */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Empty State</h3>
        <div className="max-w-2xl">
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            title="No messages yet"
            description="Start a conversation to see messages appear here"
            action={{
              label: 'Start Chatting',
              onClick: () => SecureLogger.debug('Start chatting clicked')
            }}
          />
        </div>
        <div className="mt-4 p-4 rounded-lg ring-1 ring-border/30 bg-muted/30">
          <h4 className="text-sm font-medium mb-2">Empty State Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Icon with gradient background</li>
            <li>• Clear title and description</li>
            <li>• Optional action button</li>
            <li>• Centered layout</li>
          </ul>
        </div>
      </section>

      {/* Complete Chat Interface */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Complete Chat Interface</h3>
        <div className="max-w-3xl h-[600px] rounded-lg ring-1 ring-border/30 shadow-sm bg-background overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
              />
            ))}
            <ThinkingIndicator />
          </div>

          {/* Input */}
          <div className="border-t ring-1 ring-border/50 shadow-xs">
            <ChatInput
              value={inputValue}
              onChange={(value) => setInputValue(value)}
              onSubmit={() => {
                SecureLogger.debug('Submitted:', inputValue)
                setInputValue('')
              }}
              placeholder="Type your message..."
            />
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="bg-muted/30 rounded-lg p-6 ring-1 ring-border/30">
        <h3 className="text-lg font-semibold mb-4">Code Example</h3>
        <pre className="bg-background rounded-md p-4 overflow-x-auto text-sm ring-1 ring-border/30">
          <code>{`import { Message, ChatInput, ThinkingIndicator, EmptyState } from '@clarity-chat/react'

// Message
<Message
  message={{
    id: '1',
    role: 'assistant',
    content: 'Hello!',
    createdAt: new Date()
  }}
/>

// Thinking Indicator
<ThinkingIndicator />

// Chat Input
<ChatInput
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onSubmit={handleSubmit}
  placeholder="Type your message..."
/>

// Empty State
<EmptyState
  icon={<Icon />}
  title="No messages"
  description="Start chatting"
  action={<Button>Start</Button>}
/>`}</code>
        </pre>
      </section>
    </div>
  )
}
