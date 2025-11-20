import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ApiTable } from '@/components/Demo/ApiTable'

export const metadata: Metadata = {
  title: 'VirtualizedMessageList',
  description: 'High-performance message rendering for conversations with thousands of entries.',
}

const props = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Messages to render in the timeline.',
  },
  {
    name: 'renderMessage',
    type: '(message: Message, index: number) => React.ReactNode',
    required: true,
    description: 'Render prop for individual messages.',
  },
  {
    name: 'estimatedItemSize',
    type: 'number',
    default: '150',
    description: 'Initial height estimate (px) used before measurement.',
  },
  {
    name: 'overscanCount',
    type: 'number',
    default: '3',
    description: 'Extra messages to render above/below the viewport to avoid blank gaps.',
  },
  {
    name: 'autoScrollToBottom',
    type: 'boolean',
    default: 'true',
    description: 'Automatically scroll to bottom when new messages arrive (if user is near bottom).',
  },
  {
    name: 'onScroll',
    type: '(scrollOffset: number) => void',
    description: 'Callback fired on scroll; useful for analytics or multi-pane layouts.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
  {
    name: 'itemKey',
    type: '(index: number, data: Message[]) => string',
    description: 'Custom key resolver to support optimistic updates or synthetic ids.',
  },
]

const hookProps = [
  {
    name: 'virtualizationThreshold',
    type: 'number',
    default: '100',
    description: 'Message count at which the smart `MessageList` switches into virtualization mode.',
  },
]

export default function VirtualizedMessageListPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>VirtualizedMessageList</h1>
      <p className="lead">
        Render thousands of messages without sacrificing scroll performance. Powered by react-window with
        intelligent height measurement, auto-scroll, and jump-to-bottom helpers.
      </p>

      <Callout type="info">
        <p>
          Use <code>MessageList</code> for an auto-switching version that renders normally below a threshold and
          virtualizes above it.
        </p>
      </Callout>

      <h2 id="import">Import</h2>
      <CodeBlock
        language="tsx"
        code={`import {
  VirtualizedMessageList,
  MessageList,
  useMessageListScroll,
  useJumpToBottom,
} from '@clarity-chat/react'`}
      />

      <h2 id="basic-usage">Basic Usage</h2>
      <CodeBlock
        language="tsx"
        title="Rendering 10k messages"
        code={`import { VirtualizedMessageList, Message } from '@clarity-chat/react'

export function Transcript({ messages }: { messages: Message[] }) {
  return (
    <div className="h-[600px] border rounded-lg">
      <VirtualizedMessageList
        messages={messages}
        renderMessage={(message) => (
          <div className="px-4 py-3 border-b border-border/50">
            <strong>{message.role}</strong>: {message.content}
          </div>
        )}
      />
    </div>
  )
}`}
      />

      <h2 id="smart-mode">Smart MessageList</h2>
      <p>
        Prefer <code>MessageList</code> when you want the library to decide when virtualization is needed. Set the{' '}
        <code>virtualizationThreshold</code> to control the switch.
      </p>
      <CodeBlock
        language="tsx"
        code={`<MessageList
  messages={messages}
  renderMessage={renderMessage}
  virtualizationThreshold={150}
/>`}
      />

      <h2 id="scroll-management">Scroll Management</h2>
      <p>
        Combine <code>useMessageListScroll</code> and <code>useJumpToBottom</code> hooks to manage sticky scrolling,
        unread badges, and “jump to latest” buttons.
      </p>
      <CodeBlock
        language="tsx"
        code={`const { isNearBottom, handleScroll, shouldAutoScroll } = useMessageListScroll(messages)
const { showButton, newMessageCount, resetNewMessages } = useJumpToBottom(isNearBottom)

return (
  <>
    <VirtualizedMessageList
      messages={messages}
      renderMessage={renderMessage}
      onScroll={handleScroll}
      autoScrollToBottom={shouldAutoScroll}
    />
    {showButton && (
      <button onClick={resetNewMessages} className="jump-to-bottom">
        {newMessageCount} new messages • Jump to latest
      </button>
    )}
  </>
)`}
      />

      <h2 id="performance">Performance Tips</h2>
      <ul>
        <li>Provide stable message IDs to keep height cache accurate.</li>
        <li>
          Pipe analytics through <code>onScroll</code> only when needed—debounce for high-volume streams.
        </li>
        <li>
          Wrap <code>renderMessage</code> in <code>useCallback</code> or define it outside render to avoid re-renders.
        </li>
        <li>
          Use <code>estimatedItemSize</code> close to your average message height for smoother initial rendering.
        </li>
      </ul>

      <h2 id="props">Props</h2>
      <ApiTable data={props} />

      <h2 id="message-list-props">MessageList Props</h2>
      <ApiTable data={hookProps} />

      <Pagination
        prev={{ href: '/reference/components/message-list', title: 'MessageList' }}
        next={{ href: '/reference/components/conversation-branch-visualizer', title: 'ConversationBranchVisualizer' }}
      />
    </>
  )
}
