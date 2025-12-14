import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Component Hierarchy Guide - Clarity Chat Components',
  description:
    'Understand the component hierarchy, composition patterns, and how components relate to each other.',
}

export default function ComponentHierarchyPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Component Hierarchy</h1>
        <p className="docs-lead">
          Understand the component hierarchy, composition patterns, and how
          components relate to each other in Clarity Chat Components.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Understand component layers',
          'Learn composition patterns',
          'See component relationships',
          'Build custom chat interfaces',
          'Understand data flow',
        ]}
      />

      <section className="docs-section">
        <h2>Component Layers</h2>
        <p>Clarity Chat Components are organized into three main layers:</p>

        <h3>Top-Level APIs (Drop-in Ready)</h3>
        <p>Complete, ready-to-use components:</p>
        <CodePlayground
          initialCode={`// Top-level: Complete solution
import { ClarityChat } from '@clarity-chat/react'

<ClarityChat api="/api/chat" />

// Includes:
// - ChatWindow
// - ChatInput
// - MessageList
// - Streaming support
// - Memory management
// - All features configured`}
        />

        <h3>Mid-Level APIs (Composable)</h3>
        <p>Building blocks for custom interfaces:</p>
        <CodePlayground
          initialCode={`// Mid-level: Composable components
import { ChatWindow, ChatInput, MessageList } from '@clarity-chat/react'

function CustomChat() {
  return (
    <div>
      <ChatWindow messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  )
}`}
        />

        <h3>Low-Level Primitives (Utilities)</h3>
        <p>Utilities and internal APIs:</p>
        <CodePlayground
          initialCode={`// Low-level: Utilities
import { 
  normalizeMessages,
  convertCoreMessageToMessage,
  estimateTokens 
} from '@clarity-chat/react'

const normalized = normalizeMessages(rawMessages)
const tokens = estimateTokens(normalized)`}
        />
      </section>

      <section className="docs-section">
        <h2>Component Relationships</h2>
        <p>How components relate to each other:</p>
        <CodePlayground
          initialCode={`// ClarityChat (Top-level)
ClarityChat
  ├── ChatWindow (Mid-level)
  │   ├── MessageList (Mid-level)
  │   │   ├── StreamingMessage (Low-level)
  │   │   └── MessageActions (Low-level)
  │   └── ChatInput (Mid-level)
  │       └── AdvancedChatInput (Mid-level)
  ├── TokenCounter (Feature component)
  └── HistoryManager (Feature component)

// Custom composition
function CustomChat() {
  return (
    <ChatWindow>
      <MessageList />
      <ChatInput />
      <TokenCounter />
    </ChatWindow>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Composition Patterns</h2>
        <p>Common composition patterns:</p>
        <CodePlayground
          initialCode={`// Pattern 1: Feature Components
function ChatWithFeatures() {
  return (
    <div>
      <ChatWindow messages={messages} />
      <TokenCounter messages={messages} />
      <BatteryIndicator />
      <PerformanceAnalyticsDashboard />
    </div>
  )
}

// Pattern 2: Provider Pattern
function ChatWithProviders() {
  return (
    <MemoryProvider>
      <ThemeProvider>
        <ChatWindow messages={messages} />
      </ThemeProvider>
    </MemoryProvider>
  )
}

// Pattern 3: Hook Composition
function ChatWithHooks() {
  const chat = useClarityChat({ api: '/api/chat' })
  const tokens = useTokenTracker(chat.messages)
  const battery = useBatteryAware()
  
  return (
    <ChatWindow
      messages={chat.messages}
      onSend={chat.sendMessage}
      config={{
        enableAnimations: !battery.recommendations.disableAnimations,
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Data Flow</h2>
        <p>Understanding data flow through components:</p>
        <CodePlayground
          initialCode={`// Data flow example
User Input
  ↓
ChatInput (captures input)
  ↓
useClarityChat (processes input)
  ↓
API Route (sends to AI)
  ↓
Streaming Response
  ↓
StreamingMessage (displays stream)
  ↓
MessageList (updates UI)
  ↓
ChatWindow (renders complete view)

// With hooks
const chat = useClarityChat({ api: '/api/chat' })
// chat.messages → MessageList
// chat.sendMessage → ChatInput
// chat.isLoading → LoadingIndicator`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Chat Interface</h2>
        <p>Build custom chat using mid-level components:</p>
        <CodePlayground
          initialCode={`import {
  ChatWindow,
  ChatInput,
  MessageList,
  TokenCounter,
  useClarityChat,
} from '@clarity-chat/react'

function CustomChatInterface() {
  const chat = useClarityChat({ api: '/api/chat' })

  return (
    <div className="flex flex-col h-screen">
      <header>
        <h1>Custom Chat</h1>
        <TokenCounter messages={chat.messages} />
      </header>
      
      <div className="flex-1">
        <ChatWindow
          messages={chat.messages}
          isLoading={chat.isLoading}
        />
      </div>
      
      <footer>
        <ChatInput
          onSend={chat.sendMessage}
          disabled={chat.isLoading}
        />
      </footer>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use top-level components for quick setup</li>
          <li>Use mid-level components for custom interfaces</li>
          <li>Compose components with hooks for flexibility</li>
          <li>Understand data flow for debugging</li>
          <li>Use providers for shared state</li>
          <li>Follow composition patterns for consistency</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/clarity-chat">ClarityChat</a> -
            Top-level component
          </li>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> -
            Mid-level component
          </li>
          <li>
            <a href="/guides/composition-patterns">
              Composition Patterns Guide
            </a>{' '}
            - Composition guide
          </li>
        </ul>
      </section>
    </div>
  )
}
