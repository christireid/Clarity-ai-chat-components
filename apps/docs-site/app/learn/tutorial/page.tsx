import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Tutorial',
  description: 'Build a complete chat application with Clarity Chat UI',
}

export default function TutorialPage() {
  return (
    <>
      <Breadcrumbs />
      
      <h1>Tutorial: Build a Complete Chat App</h1>
      
      <p className="lead">
        In this hands-on tutorial, you'll build a fully-featured chat application from scratch. You'll learn core concepts, best practices, and advanced patterns.
      </p>

      <Callout type="info">
        <p>
          <strong>Time:</strong> ~30 minutes<br />
          <strong>Level:</strong> Beginner to Intermediate<br />
          <strong>Prerequisites:</strong> Basic React knowledge
        </p>
      </Callout>

      <h2 id="what-youll-build">What You'll Build</h2>
      
      <p>By the end of this tutorial, you'll have a chat app with:</p>

      <ul>
        <li>✅ Real-time message display</li>
        <li>✅ User avatars and timestamps</li>
        <li>✅ Typing indicators</li>
        <li>✅ Message reactions</li>
        <li>✅ File attachments</li>
        <li>✅ Dark mode toggle</li>
        <li>✅ Custom theming</li>
      </ul>

      <h2 id="setup">Step 1: Project Setup</h2>
      
      <p>Create a new React project with Vite:</p>

      <CodeBlock
        code={`# Create new project
npm create vite@latest my-chat-app -- --template react-ts

# Navigate to project
cd my-chat-app

# Install dependencies
npm install

# Install Clarity Chat
npm install @clarity-chat/react`}
        language="bash"
        title="Terminal"
      />

      <h2 id="basic-chat">Step 2: Basic Chat Interface</h2>
      
      <p>Replace the contents of <code>src/App.tsx</code>:</p>

      <CodeBlock
        code={`import { useState } from 'react'
import { ChatWindow, Message } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import './App.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to your new chat app! 👋',
      sender: 'system',
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'm a demo bot.",
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div className="app">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        placeholder="Type your message..."
        height="100vh"
      />
    </div>
  )
}

export default App`}
        language="tsx"
        title="src/App.tsx"
        showLineNumbers
      />

      <p>Run your app:</p>

      <CodeBlock
        code="npm run dev"
        language="bash"
      />

      <Callout type="success">
        <p><strong>You did it!</strong> You now have a working chat interface. Let's add more features.</p>
      </Callout>

      <h2 id="avatars">Step 3: Add Avatars</h2>
      
      <p>Enhance messages with user avatars:</p>

      <CodeBlock
        code={`const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    text: 'Welcome to your new chat app! 👋',
    sender: 'system',
    timestamp: new Date(),
    avatar: {
      src: 'https://api.dicebear.com/7.x/bottts/svg?seed=system',
      alt: 'System Bot',
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
  setMessages((prev) => [...prev, newMessage])

  setTimeout(() => {
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "Thanks for your message!",
      sender: 'bot',
      timestamp: new Date(),
      avatar: {
        src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
        alt: 'Bot',
      },
    }
    setMessages((prev) => [...prev, botMessage])
  }, 1000)
}`}
        language="tsx"
        highlightLines={[7, 8, 9, 10, 18, 19, 20, 21, 30, 31, 32, 33]}
      />

      <h2 id="typing-indicator">Step 4: Typing Indicator</h2>
      
      <p>Show when the bot is "typing":</p>

      <CodeBlock
        code={`import { useState } from 'react'
import { ChatWindow, Message, useTyping } from '@clarity-chat/react'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const { isTyping, startTyping, stopTyping } = useTyping()

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])

    // Show typing indicator
    startTyping('bot')

    setTimeout(() => {
      stopTyping('bot')
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message!",
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 2000)
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSendMessage}
      typingUsers={isTyping ? [{ id: 'bot', name: 'Bot' }] : []}
    />
  )
}`}
        language="tsx"
        highlightLines={[2, 6, 18, 20, 21, 35]}
      />

      <h2 id="reactions">Step 5: Message Reactions</h2>
      
      <p>Allow users to react to messages:</p>

      <CodeBlock
        code={`const handleReaction = (messageId: string, emoji: string) => {
  setMessages((prev) =>
    prev.map((msg) =>
      msg.id === messageId
        ? {
            ...msg,
            reactions: {
              ...msg.reactions,
              [emoji]: (msg.reactions?.[emoji] || 0) + 1,
            },
          }
        : msg
    )
  )
}

return (
  <ChatWindow
    messages={messages}
    onSendMessage={handleSendMessage}
    onReaction={handleReaction}
    enableReactions
  />
)`}
        language="tsx"
      />

      <h2 id="dark-mode">Step 6: Dark Mode</h2>
      
      <p>Add theme switching:</p>

      <CodeBlock
        code={`import { useState } from 'react'
import { ChatWindow, ThemeProvider } from '@clarity-chat/react'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <header>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Toggle Theme
          </button>
        </header>
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </ThemeProvider>
  )
}`}
        language="tsx"
        highlightLines={[2, 5, 8, 11, 12, 13, 20]}
      />

      <h2 id="next-steps">What's Next?</h2>
      
      <p>Congratulations! You've built a feature-rich chat application. Here are some ideas to extend it:</p>

      <ul>
        <li>🔐 Add user authentication</li>
        <li>💾 Persist messages to a database</li>
        <li>🔌 Connect to a WebSocket server for real-time updates</li>
        <li>📎 Implement file upload functionality</li>
        <li>🔍 Add message search</li>
        <li>🎨 Create custom themes</li>
        <li>⌨️ Add keyboard shortcuts with CommandPalette</li>
      </ul>

      <Callout type="tip">
        <p>
          Check out our <a href="/examples">Examples</a> section to see these features in action!
        </p>
      </Callout>

      <h2 id="full-code">Complete Code</h2>
      
      <p>Here's the full implementation:</p>

      <CodeBlock
        code={`import { useState } from 'react'
import {
  ChatWindow,
  Message,
  ThemeProvider,
  useTyping,
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import './App.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome! Try sending a message.',
      sender: 'bot',
      timestamp: new Date(),
      avatar: {
        src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
        alt: 'Bot',
      },
    },
  ])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const { isTyping, startTyping, stopTyping } = useTyping()

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
    setMessages((prev) => [...prev, newMessage])

    startTyping('bot')

    setTimeout(() => {
      stopTyping('bot')
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: \`You said: "\${text}". That's interesting!\`,
        sender: 'bot',
        timestamp: new Date(),
        avatar: {
          src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
          alt: 'Bot',
        },
      }
      setMessages((prev) => [...prev, botMessage])
    }, 2000)
  }

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [emoji]: (msg.reactions?.[emoji] || 0) + 1,
              },
            }
          : msg
      )
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="app" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <h1>My Chat App</h1>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙' : '☀️'} Toggle Theme
          </button>
        </header>
        <div style={{ flex: 1 }}>
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            onReaction={handleReaction}
            typingUsers={isTyping ? [{ id: 'bot', name: 'Bot' }] : []}
            enableReactions
            showTimestamps
            showAvatars
          />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App`}
        language="tsx"
        title="src/App.tsx (Complete)"
        showLineNumbers
      />

      <Pagination
        prev={{
          title: 'Installation',
          href: '/learn/installation',
        }}
        next={{
          title: 'Core Concepts',
          href: '/learn/concepts/components',
        }}
      />
    </>
  )
}
