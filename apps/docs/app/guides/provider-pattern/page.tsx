import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Provider Pattern Guide - Clarity Chat Components',
  description:
    'Learn how to use provider patterns for shared configuration, state, and context in Clarity Chat Components.',
}

export default function ProviderPatternPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Provider Pattern</h1>
        <p className="docs-lead">
          Learn how to use provider patterns for shared configuration, state,
          and context across Clarity Chat Components.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Use MemoryProvider for conversation memory',
          'Use ThemeProvider for theming',
          'Create custom providers',
          'Compose multiple providers',
          'Access provider context',
        ]}
      />

      <section className="docs-section">
        <h2>MemoryProvider</h2>
        <p>Use MemoryProvider for conversation memory:</p>
        <CodePlayground
          code={`import { MemoryProvider, useMemoryContext } from '@clarity-chat/react/internal'

function ChatWithMemory() {
  return (
    <MemoryProvider
      config={{
        enableMemory: true,
        maxMessages: 100,
      }}
    >
      <ChatApp />
    </MemoryProvider>
  )
}

function ChatApp() {
  const memory = useMemoryContext()
  
  return (
    <ChatWindow
      messages={messages}
      memory={memory}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>ThemeProvider</h2>
        <p>Use ThemeProvider for theming:</p>
        <CodePlayground
          code={`import { ThemeProvider } from '@clarity-chat/react/internal'

function ThemedChat() {
  return (
    <ThemeProvider theme="dark">
      <ChatWindow messages={messages} />
    </ThemeProvider>
  )
}

// Or with custom theme
function CustomThemedChat() {
  return (
    <ThemeProvider
      theme={{
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
        },
        fonts: {
          body: 'Inter, sans-serif',
        },
      }}
    >
      <ChatWindow messages={messages} />
    </ThemeProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Provider</h2>
        <p>Create custom providers:</p>
        <CodePlayground
          code={`import { createContext, useContext, useState } from 'react'

interface ChatConfigContextType {
  apiEndpoint: string
  model: string
  temperature: number
  setModel: (model: string) => void
  setTemperature: (temp: number) => void
}

const ChatConfigContext = createContext<ChatConfigContextType | null>(null)

export function ChatConfigProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState('gpt-4')
  const [temperature, setTemperature] = useState(0.7)

  return (
    <ChatConfigContext.Provider
      value={{
        apiEndpoint: '/api/chat',
        model,
        temperature,
        setModel,
        setTemperature,
      }}
    >
      {children}
    </ChatConfigContext.Provider>
  )
}

export function useChatConfig() {
  const context = useContext(ChatConfigContext)
  if (!context) throw new Error('useChatConfig must be used within ChatConfigProvider')
  return context
}

// Usage
function ChatApp() {
  return (
    <ChatConfigProvider>
      <ChatComponent />
    </ChatConfigProvider>
  )
}

function ChatComponent() {
  const { model, setModel } = useChatConfig()
  return (
    <div>
      <select value={model} onChange={(e) => setModel(e.target.value)}>
        <option value="gpt-4">GPT-4</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
      </select>
      <ChatWindow messages={messages} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Provider Composition</h2>
        <p>Compose multiple providers:</p>
        <CodePlayground
          code={`import {
  MemoryProvider,
  ThemeProvider,
  ChatConfigProvider,
} from '@clarity-chat/react/internal'

function AppWithProviders() {
  return (
    <ThemeProvider theme="dark">
      <MemoryProvider>
        <ChatConfigProvider>
          <ChatApp />
        </ChatConfigProvider>
      </MemoryProvider>
    </ThemeProvider>
  )
}

// Order matters - inner providers can access outer providers
// ThemeProvider (outermost)
//   ↓
// MemoryProvider
//   ↓
// ChatConfigProvider (innermost)
//   ↓
// ChatApp (can access all providers)`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use providers for shared configuration</li>
          <li>Compose providers in logical order</li>
          <li>Create custom providers for app-specific needs</li>
          <li>Access context with custom hooks</li>
          <li>Handle missing provider errors</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/guides/composition-patterns">Composition Patterns</a> -
            Composition guide
          </li>
          <li>
            <a href="/guides/state-management-patterns">
              State Management Patterns
            </a>{' '}
            - State management
          </li>
          <li>
            <a href="/reference/components/memory-provider">MemoryProvider</a> -
            Memory provider component
          </li>
        </ul>
      </section>
    </div>
  )
}
