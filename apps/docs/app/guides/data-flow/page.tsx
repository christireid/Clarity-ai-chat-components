import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Data Flow Documentation - Clarity Chat Components',
  description:
    'Understand how data flows through Clarity Chat Components from user input to AI response and back.',
}

export default function DataFlowPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Data Flow</h1>
        <p className="docs-lead">
          Understand how data flows through Clarity Chat Components from user
          input to AI response, including state management and streaming.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Understand message flow',
          'Track state changes',
          'Handle streaming responses',
          'Manage conversation state',
          'Debug data flow issues',
        ]}
      />

      <section className="docs-section">
        <h2>Message Flow</h2>
        <p>Complete message flow from input to display:</p>
        <CodePlayground
          initialCode={`// 1. User types message
ChatInput
  ↓ onChange
  value state updated
  ↓ onSubmit
  handleSend()

// 2. Message sent
useClarityChat.sendMessage()
  ↓
  API request to /api/chat
  ↓
  Server processes request

// 3. Streaming response
Streaming response received
  ↓
  useStreaming hook processes chunks
  ↓
  StreamingMessage displays chunks
  ↓
  MessageList updates

// 4. Complete message
Stream completes
  ↓
  Final message added to messages array
  ↓
  ChatWindow re-renders`}
        />
      </section>

      <section className="docs-section">
        <h2>State Management Flow</h2>
        <p>How state flows through components:</p>
        <CodePlayground
          initialCode={`// State flow example
useClarityChat hook
  ↓ manages
messages: Message[]
  ↓ passed to
ChatWindow component
  ↓ renders
MessageList component
  ↓ displays
StreamingMessage components

// State updates
User sends message
  ↓
useClarityChat.sendMessage()
  ↓
Optimistic update (adds user message)
  ↓
API call
  ↓
Streaming response
  ↓
Updates assistant message in real-time
  ↓
Final message state`}
        />
      </section>

      <section className="docs-section">
        <h2>Streaming Flow</h2>
        <p>How streaming responses flow:</p>
        <CodePlayground
          initialCode={`// Streaming data flow
API Response (Stream)
  ↓
useStreaming hook
  ↓ processes chunks
StreamChunk[]
  ↓
StreamingMessage component
  ↓ renders incrementally
Text appears character by character
  ↓
MessageList updates
  ↓
ChatWindow scrolls to bottom

// Hook flow
useClarityChat
  ↓ uses
useStreaming
  ↓ processes
StreamChunk
  ↓ updates
messages state
  ↓ triggers
component re-render`}
        />
      </section>

      <section className="docs-section">
        <h2>Memory Flow</h2>
        <p>How memory flows through the system:</p>
        <CodePlayground
          initialCode={`// Memory flow
MemoryProvider (context)
  ↓ provides
memory state
  ↓ used by
useClarityChat
  ↓ includes in
API requests
  ↓
Server processes with memory
  ↓
Response includes memory updates
  ↓
MemoryProvider updates state
  ↓
Next request includes updated memory`}
        />
      </section>

      <section className="docs-section">
        <h2>Token Optimization Flow</h2>
        <p>How token optimization flows:</p>
        <CodePlayground
          initialCode={`// Token optimization flow
messages: Message[]
  ↓ passed to
useTokenOptimizationEnhanced
  ↓ optimizes
TOON conversion
Prompt caching
Semantic caching
History limiting
  ↓ returns
optimizedMessages: Message[]
  ↓ used in
API request
  ↓
Reduced token usage
  ↓
Lower costs`}
        />
      </section>

      <section className="docs-section">
        <h2>Error Flow</h2>
        <p>How errors flow through the system:</p>
        <CodePlayground
          initialCode={`// Error flow
API call fails
  ↓
useClarityChat catches error
  ↓
Sets error state
  ↓
ErrorBoundary catches
  ↓
ErrorMessage component displays
  ↓
User sees error message
  ↓
RetryButton available
  ↓
User retries
  ↓
Flow restarts`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Understand message flow for debugging</li>
          <li>Track state changes with React DevTools</li>
          <li>Monitor streaming performance</li>
          <li>Handle errors at appropriate levels</li>
          <li>Optimize token flow for cost savings</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/guides/state-management-patterns">
              State Management Patterns
            </a>{' '}
            - State management guide
          </li>
          <li>
            <a href="/guides/component-hierarchy">Component Hierarchy</a> -
            Component relationships
          </li>
          <li>
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> -
            Main chat hook
          </li>
        </ul>
      </section>
    </div>
  )
}
