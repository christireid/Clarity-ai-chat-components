import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Simple Chat Example',
  description: 'Build a basic chat interface in minutes',
}

const simpleChatCode = `function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      chatId: 'demo',
      role: 'assistant',
      content: 'Hello! Welcome to Clarity Chat UI 👋',
      status: 'sent',
      createdAt: new Date(Date.now() - 60000),
      updatedAt: new Date(Date.now() - 60000),
    },
    {
      id: '2',
      chatId: 'demo',
      role: 'assistant',
      content: 'This is a simple chat interface built with Clarity Chat UI.',
      status: 'sent',
      createdAt: new Date(Date.now() - 30000),
      updatedAt: new Date(Date.now() - 30000),
    },
  ])

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setMessages([...messages, newMessage])

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId: 'demo',
        role: 'assistant',
        content: \`You said: "\${content}". Thanks for trying out Clarity Chat! 🎉\`,
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

render(<App />)`

export default function SimpleChatExample() {
  return (
    <>
      <Breadcrumbs />

      <h1>Simple Chat Example</h1>

      <p className="lead">
        A minimal chat interface that demonstrates the core functionality of
        Clarity Chat UI. This example includes message display, user input, and
        a simulated bot response.
      </p>

      <Callout type="info">
        <p>
          <strong>What you'll learn:</strong> Basic ChatWindow usage, message
          state management, and handling user input.
        </p>
      </Callout>

      <h2 id="live-demo">Live Demo</h2>

      <p>
        Try out the chat interface below. Type a message and see it appear
        instantly!
      </p>

      <CodePlayground initialCode={simpleChatCode} />

      <h2 id="how-it-works">How It Works</h2>

      <h3>1. State Management</h3>

      <p>
        We use React's <code>useState</code> to manage the messages array:
      </p>

      <CodeBlock
        code={`const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: 'Hello! Welcome to Clarity Chat UI 👋',
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
])`}
        language="tsx"
        showLineNumbers
      />

      <h3>2. Handle User Input</h3>

      <p>
        The <code>onSendMessage</code> callback receives the user's text and
        adds it to the messages:
      </p>

      <CodeBlock
        code={`const handleSendMessage = (content: string) => {
  const newMessage: Message = {
    id: Date.now().toString(),
    chatId: 'demo',
    role: 'user',
    content,
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  setMessages([...messages, newMessage])
}`}
        language="tsx"
        showLineNumbers
      />

      <h3>3. Simulated Bot Response</h3>

      <p>For this demo, we simulate a bot response after 1 second:</p>

      <CodeBlock
        code={`setTimeout(() => {
  const botMessage: Message = {
    id: (Date.now() + 1).toString(),
    chatId: 'demo',
    role: 'assistant',
    content: \`You said: "\${content}"\`,
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  setMessages((prev) => [...prev, botMessage])
}, 1000)`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="tip">
        <p>
          In a real application, you would replace this with an actual API call
          or WebSocket connection to your backend.
        </p>
      </Callout>

      <h2 id="full-code">Complete Source Code</h2>

      <CodeBlock
        code={simpleChatCode}
        language="tsx"
        title="App.tsx"
        showLineNumbers
      />

      <h2 id="next-steps">Next Steps</h2>

      <p>Now that you have a basic chat working, try these enhancements:</p>

      <ul>
        <li>
          Add <a href="/examples/themed-chat">custom theming</a>
        </li>
        <li>
          Implement{' '}
          <a href="/reference/components/typing-indicator">typing indicators</a>
        </li>
        <li>
          Add{' '}
          <a href="/reference/components/message#reactions">
            message reactions
          </a>
        </li>
        <li>
          Enable{' '}
          <a href="/reference/components/message#attachments">
            file attachments
          </a>
        </li>
        <li>
          Connect to a <a href="/examples/realtime">real-time backend</a>
        </li>
      </ul>

      <h2 id="customization">Customization Ideas</h2>

      <h3>Add a Header</h3>

      <p>Display a session header with title and actions:</p>

      <CodeBlock
        code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  showHeader
  sessionTitle="Support Chat"
  sessionSubtitle="We're here to help"
/>`}
        language="tsx"
      />

      <h3>Starter Prompts</h3>

      <p>Help users get started with suggested prompts:</p>

      <CodeBlock
        code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  starterPrompts={[
    { id: '1', text: 'What can you help me with?', type: 'starter', icon: '💬' },
    { id: '2', text: 'Tell me about your features', type: 'starter', icon: '✨' },
  ]}
/>`}
        language="tsx"
      />

      <h3>Loading State</h3>

      <p>Show loading state while waiting for responses:</p>

      <CodeBlock
        code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  isLoading={isWaitingForResponse}
/>`}
        language="tsx"
      />

      <Callout type="success">
        <p>
          <strong>Congratulations!</strong> You've built your first chat
          interface with Clarity Chat UI. Check out more{' '}
          <a href="/examples">examples</a> to learn advanced features.
        </p>
      </Callout>

      <Pagination
        next={{
          title: 'Themed Chat',
          href: '/examples/themed-chat',
        }}
      />
    </>
  )
}
