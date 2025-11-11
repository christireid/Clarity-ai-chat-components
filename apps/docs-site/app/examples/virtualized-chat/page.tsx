import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Virtualized Chat Example - Clarity Chat Components',
  description: 'Render 10k+ messages smoothly with VirtualizedMessageList and MessageList smart threshold.',
}

export default function VirtualizedChatExamplePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Example</span>
        <span className="docs-badge">Performance</span>
        <h1>Virtualized Chat Transcript</h1>
        <p className="docs-lead">
          Scale to enterprise-sized transcripts without janky scrolling. Virtualization keeps memory usage low and
          integrates with jump-to-bottom controls.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This example renders 5,000+ messages and demonstrates how <code>VirtualizedMessageList</code> cooperates with
          <code>useMessageListScroll</code> to manage sticky scrolling, unread counts, and jump buttons.
        </p>
        <ul>
          <li>Automatic virtualization when message count crosses <code>virtualizationThreshold</code>.</li>
          <li>“Jump to latest” button appears when the user scrolls up.</li>
          <li>Scroll analytics hook to track engagement and attach observers.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Live Demo</h2>
        <LiveDemo
          title="Virtualized Transcript"
          code={`import { useMemo, useState } from 'react'
import {
  MessageList,
  useMessageListScroll,
  useJumpToBottom,
  Message,
} from '@clarity-chat/react'

function generateMessages(count: number): Message[] {
  return Array.from({ length: count }, (_, index) => ({
    id: \`msg-\${index}\`,
    role: index % 2 === 0 ? 'assistant' : 'user',
    content: index % 2 === 0
      ? \`Insight #\${index}: Virtualization keeps the UI fast.\`
      : \`User question #\${index}: How does virtualization work?\`,
  }))
}

export default function VirtualizedChat() {
  const initialMessages = useMemo(() => generateMessages(5000), [])
  const [messages, setMessages] = useState(initialMessages)
  const { isNearBottom, handleScroll, shouldAutoScroll } = useMessageListScroll(messages)
  const { showButton, newMessageCount, resetNewMessages, incrementNewMessages } = useJumpToBottom(isNearBottom)

  const addMessage = () => {
    const nextIndex = messages.length + 1
    setMessages((prev) => [
      ...prev,
      {
        id: \`msg-\${nextIndex}\`,
        role: nextIndex % 2 === 0 ? 'assistant' : 'user',
        content: \`New message \${nextIndex} added on demand.\`,
      },
    ])
    incrementNewMessages()
  }

  return (
    <div className="h-[520px] flex flex-col border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-secondary border-b border-border">
        <h2 className="font-semibold text-sm uppercase tracking-wide">Virtualized Conversation</h2>
        <button onClick={addMessage} className="px-3 py-1 text-sm bg-brand-500 text-white rounded">
          Add message
        </button>
      </div>
      <div className="flex-1 relative">
        <MessageList
          virtualizationThreshold={120}
          messages={messages}
          renderMessage={(message) => (
            <div className="px-4 py-2 border-b border-border/60 text-sm">
              <span className="font-semibold mr-2">{message.role === 'assistant' ? '🤖' : '🙋‍♀️'}</span>
              {message.content}
            </div>
          )}
          onScroll={handleScroll}
          autoScrollToBottom={shouldAutoScroll}
        />
        {showButton && (
          <button
            onClick={() => {
              resetNewMessages()
            }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-brand-500 text-white rounded-full shadow-lg"
          >
            {newMessageCount} new messages — Jump to latest
          </button>
        )}
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Recommendations</h2>
        <Callout type="tip">
          <p>
            For analytics dashboards, hook into <code>onScroll</code> and <code>useMessageListPerformance</code> to stream
            metrics about scroll depth, time spent, and render duration.
          </p>
        </Callout>
      </section>
    </div>
  )
}
