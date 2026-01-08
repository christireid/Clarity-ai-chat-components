import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Composition Patterns Guide - Clarity Chat Components',
  description:
    'Learn composition patterns for building custom chat interfaces with Clarity Chat Components.',
}

export default function CompositionPatternsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Composition Patterns</h1>
        <p className="docs-lead">
          Learn composition patterns for building custom chat interfaces,
          combining components and hooks effectively.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Compose components for custom interfaces',
          'Combine hooks for advanced functionality',
          'Use provider patterns',
          'Create reusable chat patterns',
          'Build feature-rich chat applications',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Composition</h2>
        <p>Compose basic chat interface:</p>
        <CodePlayground
          initialCode={`import { ChatWindow, ChatInput, useClarityChat } from '@clarity-chat/react/internal'

function BasicChat() {
  const chat = useClarityChat({ api: '/api/chat' })

  return (
    <div className="flex flex-col h-screen">
      <ChatWindow messages={chat.messages} />
      <ChatInput onSend={chat.sendMessage} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Feature Composition</h2>
        <p>Add features to chat:</p>
        <CodePlayground
          initialCode={`import {
  ChatWindow,
  ChatInput,
  TokenCounter,
  BatteryIndicator,
  useClarityChat,
  useTokenTracker,
  useBatteryAware,
} from '@clarity-chat/react/internal'

function FeatureRichChat() {
  const chat = useClarityChat({ api: '/api/chat' })
  const tokens = useTokenTracker(chat.messages)
  const battery = useBatteryAware()

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4">
        <h1>Chat</h1>
        <div className="flex gap-4">
          <TokenCounter
            inputTokens={tokens.inputTokens}
            outputTokens={tokens.outputTokens}
          />
          <BatteryIndicator />
        </div>
      </header>
      
      <div className="flex-1">
        <ChatWindow
          messages={chat.messages}
          enableAnimations={!battery.recommendations.disableAnimations}
        />
      </div>
      
      <ChatInput onSend={chat.sendMessage} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Provider Composition</h2>
        <p>Use providers for shared state:</p>
        <CodePlayground
          initialCode={`import {
  MemoryProvider,
  ThemeProvider,
  ChatWindow,
  useClarityChat,
} from '@clarity-chat/react/internal'

function ChatWithProviders() {
  return (
    <ThemeProvider theme="dark">
      <MemoryProvider>
        <ChatApp />
      </MemoryProvider>
    </ThemeProvider>
  )
}

function ChatApp() {
  const chat = useClarityChat({ api: '/api/chat' })
  const memory = useMemoryContext()

  return (
    <ChatWindow
      messages={chat.messages}
      memory={memory}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Hook Composition</h2>
        <p>Compose multiple hooks:</p>
        <CodePlayground
          initialCode={`import {
  useClarityChat,
  useTokenOptimizationEnhanced,
  useBatteryAware,
  useOfflineChat,
} from '@clarity-chat/react/internal'

function OptimizedChat() {
  const chat = useClarityChat({ api: '/api/chat' })
  const { optimizedMessages } = useTokenOptimizationEnhanced({
    enableToon: true,
    enablePromptCaching: true,
  })
  const battery = useBatteryAware()
  const offline = useOfflineChat()

  // Apply optimizations
  React.useEffect(() => {
    optimizedMessages(chat.messages)
  }, [chat.messages])

  return (
    <ChatWindow
      messages={chat.messages}
      config={{
        enableAnimations: !battery.recommendations.disableAnimations,
        offline: !offline.isOnline,
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Conditional Composition</h2>
        <p>Conditionally render components:</p>
        <CodePlayground
          initialCode={`import {
  ChatWindow,
  MobileChatWindow,
  useMediaQuery,
} from '@clarity-chat/react/internal'

function ResponsiveChat() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return <MobileChatWindow messages={messages} />
  }

  return <ChatWindow messages={messages} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Composition</h2>
        <p>Advanced composition with multiple features:</p>
        <CodePlayground
          initialCode={`import {
  ChatWindow,
  ChatInput,
  TokenCounter,
  HistoryManager,
  ConversationSummarizer,
  useClarityChat,
  useTokenBudgetMonitor,
  useContextMonitor,
} from '@clarity-chat/react/internal'

function AdvancedChat() {
  const chat = useClarityChat({ api: '/api/chat' })
  const budget = useTokenBudgetMonitor(chat.messages, {
    maxInputTokens: 128000,
  })
  const context = useContextMonitor(chat.messages, {
    maxTokens: 128000,
  })

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <ChatWindow messages={chat.messages} />
        <ChatInput onSend={chat.sendMessage} />
      </div>
      
      <div className="col-span-1 space-y-4">
        <TokenCounter
          inputTokens={budget.usage.current}
          maxTokens={budget.usage.max}
        />
        <HistoryManager messages={chat.messages} />
        <ConversationSummarizer messages={chat.messages} />
        {context.warnings.length > 0 && (
          <div>Context warnings: {context.warnings.length}</div>
        )}
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Start with basic composition and add features incrementally</li>
          <li>Use hooks for state management and side effects</li>
          <li>Compose providers for shared configuration</li>
          <li>Conditionally render based on device/context</li>
          <li>Keep components focused and composable</li>
          <li>Use TypeScript for type safety</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/guides/component-hierarchy">Component Hierarchy Guide</a>{' '}
            - Component relationships
          </li>
          <li>
            <a href="/guides/state-management-patterns">
              State Management Patterns
            </a>{' '}
            - State management
          </li>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> - Main
            chat component
          </li>
        </ul>
      </section>
    </div>
  )
}
