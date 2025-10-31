import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'Simple Chat Example',
  description: 'Build a basic chat interface in minutes',
}

const simpleChat Code = `import { useState } from 'react'
import { ChatWindow, Message } from '@clarity-chat/react'

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Clarity Chat UI 👋',
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000),
      avatar: {
        src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
        alt: 'Bot',
      },
    },
    {
      id: '2',
      text: 'This is a simple chat interface built with Clarity Chat UI.',
      sender: 'bot',
      timestamp: new Date(Date.now() - 30000),
      avatar: {
        src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
        alt: 'Bot',
      },
    },
  ])

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      avatar: {
        src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        alt: 'You',
      },
    }
    
    setMessages([...messages, newMessage])

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: \`You said: "\${text}". Thanks for trying out Clarity Chat! 🎉\`,
        sender: 'bot',
        timestamp: new Date(),
        avatar: {
          src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
          alt: 'Bot',
        },
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        placeholder="Type your message..."
        showTimestamps
        showAvatars
      />
    </div>
  )
}`

export default function SimpleChatExample() {
  return (
    <>
      <Breadcrumbs />
      
      <h1>Simple Chat Example</h1>
      
      <p className="lead">
        A minimal chat interface that demonstrates the core functionality of Clarity Chat UI.
        This example includes message display, user input, and a simulated bot response.
      </p>

      <Callout type="info">
        <p>
          <strong>What you'll learn:</strong> Basic ChatWindow usage, message state management,
          and handling user input.
        </p>
      </Callout>

      <h2 id="live-demo">Live Demo</h2>

      <p>Try out the chat interface below. Type a message and see it appear instantly!</p>

      <LiveDemo
        title="Simple Chat Interface"
        code={simpleChatCode}
        height="650px"
      />

      <h2 id="how-it-works">How It Works</h2>

      <h3>1. State Management</h3>

      <p>We use React's <code>useState</code> to manage the messages array:</p>

      <CodeBlock
        code={`const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    text: 'Hello! Welcome to Clarity Chat UI 👋',
    sender: 'bot',
    timestamp: new Date(),
  },
])`}
        language="tsx"
        showLineNumbers
      />

      <h3>2. Handle User Input</h3>

      <p>The <code>onSendMessage</code> callback receives the user's text and adds it to the messages:</p>

      <CodeBlock
        code={`const handleSendMessage = (text: string) => {
  const newMessage: Message = {
    id: Date.now().toString(),
    text,
    sender: 'user',
    timestamp: new Date(),
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
    text: \`You said: "\${text}"\`,
    sender: 'bot',
    timestamp: new Date(),
  }
  setMessages((prev) => [...prev, botMessage])
}, 1000)`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="tip">
        <p>
          In a real application, you would replace this with an actual API call or
          WebSocket connection to your backend.
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
        <li>Add <a href="/examples/themed-chat">custom theming</a></li>
        <li>Implement <a href="/reference/components/typing-indicator">typing indicators</a></li>
        <li>Add <a href="/reference/components/message#reactions">message reactions</a></li>
        <li>Enable <a href="/reference/components/message#attachments">file attachments</a></li>
        <li>Connect to a <a href="/examples/realtime">real-time backend</a></li>
      </ul>

      <h2 id="customization">Customization Ideas</h2>

      <h3>Change Avatar Style</h3>

      <p>Use different avatar services or your own images:</p>

      <CodeBlock
        code={`avatar: {
  src: 'https://ui-avatars.com/api/?name=John+Doe',
  alt: 'John Doe',
}`}
        language="tsx"
      />

      <h3>Add Timestamps</h3>

      <CodeBlock
        code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  showTimestamps
/>`}
        language="tsx"
      />

      <h3>Custom Placeholder</h3>

      <CodeBlock
        code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  placeholder="Ask me anything..."
/>`}
        language="tsx"
      />

      <Callout type="success">
        <p>
          <strong>Congratulations!</strong> You've built your first chat interface with Clarity Chat UI.
          Check out more <a href="/examples">examples</a> to learn advanced features.
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
