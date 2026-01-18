import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Virtualized Chat Example - Clarity Chat Components',
  description:
    'Render 10k+ messages smoothly with VirtualizedMessageList and MessageList smart threshold.',
}

export default function VirtualizedChatExamplePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Example</span>
        <span className="docs-badge">Performance</span>
        <h1>Virtualized Chat Transcript</h1>
        <p className="docs-lead">
          Scale to enterprise-sized transcripts without janky scrolling.
          Virtualization keeps memory usage low and integrates with
          jump-to-bottom controls.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This example renders 5,000+ messages and demonstrates how{' '}
          <code>VirtualizedMessageList</code> cooperates with
          <code>useMessageListScroll</code> to manage sticky scrolling, unread
          counts, and jump buttons.
        </p>
        <ul>
          <li>
            Automatic virtualization when message count crosses{' '}
            <code>virtualizationThreshold</code>.
          </li>
          <li>“Jump to latest” button appears when the user scrolls up.</li>
          <li>
            Scroll analytics hook to track engagement and attach observers.
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Live Demo</h2>
        <CodePlayground
          initialCode={`function generateMessages(count) {
  const now = Date.now()
  return Array.from({ length: count }, (_, index) => ({
    id: \`msg-\${index}\`,
    chatId: 'demo',
    role: index % 2 === 0 ? 'assistant' : 'user',
    content: index % 2 === 0
      ? \`Insight #\${index}: Virtualization keeps the UI fast.\`
      : \`User question #\${index}: How does virtualization work?\`,
    status: 'sent',
    createdAt: new Date(now - (count - index) * 1000),
    updatedAt: new Date(now - (count - index) * 1000),
  }))
}

function VirtualizedChat() {
  const initialMessages = useMemo(() => generateMessages(500), [])
  const [messages, setMessages] = useState(initialMessages)
  const { showButton, scrollToBottom } = useJumpToBottom()

  const addMessage = () => {
    const nextIndex = messages.length + 1
    setMessages((prev) => [
      ...prev,
      {
        id: \`msg-\${nextIndex}\`,
        chatId: 'demo',
        role: nextIndex % 2 === 0 ? 'assistant' : 'user',
        content: \`New message \${nextIndex} added on demand.\`,
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  }

  return (
    <div className="h-[520px] flex flex-col border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b">
        <h2 className="font-semibold text-sm">Virtualized Conversation ({messages.length} messages)</h2>
        <button onClick={addMessage} className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
          Add message
        </button>
      </div>
      <div className="flex-1 relative overflow-auto">
        <TanStackMessageList
          messages={messages}
          estimateSize={() => 60}
        />
        {showButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg"
          >
            Jump to latest
          </button>
        )}
      </div>
    </div>
  )
}

render(<VirtualizedChat />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Recommendations</h2>
        <Callout type="tip">
          <p>
            For analytics dashboards, hook into <code>onScroll</code> and{' '}
            <code>useMessageListPerformance</code> to stream metrics about
            scroll depth, time spent, and render duration.
          </p>
        </Callout>
      </section>
    </div>
  )
}
