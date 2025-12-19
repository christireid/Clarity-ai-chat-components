import React from 'react'
import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { TutorialStep } from '@/components/Enhanced/TutorialStep'
import { TutorialProgressWrapper } from '@/components/Enhanced/TutorialProgressWrapper'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { TryItOut } from '@/components/Enhanced/TryItOut'
import { UseChatFlowAnimation } from '@/components/Diagrams/CodeFlowAnimation'

const tutorialSteps = [
  { id: 'setup', title: 'Project Setup', href: '#setup' },
  { id: 'basic-chat', title: 'Basic Chat', href: '#basic-chat' },
  { id: 'avatars', title: 'Add Avatars', href: '#avatars' },
  { id: 'typing', title: 'Typing Indicator', href: '#typing-indicator' },
  { id: 'reactions', title: 'Reactions', href: '#reactions' },
  { id: 'dark-mode', title: 'Dark Mode', href: '#dark-mode' },
]

export const metadata: Metadata = {
  title: 'Tutorial: Build a Complete Chat App',
  description:
    "In this hands-on tutorial, you'll build a fully-featured chat application from scratch with real-time messaging, user avatars, typing indicators, and more.",
}

export default function TutorialPage() {
  return (
    <div className="docs-content">
      <Breadcrumbs />

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
          Tutorial: Build a Complete Chat App
        </h1>

        <p className="text-xl text-text-secondary leading-relaxed">
          In this hands-on tutorial, you'll build a fully-featured chat
          application from scratch. You'll learn core concepts, best practices,
          and advanced patterns.
        </p>
      </div>

      <Callout type="info" className="mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <strong>Time:</strong> ~30 minutes
          </div>
          <div>
            <strong>Level:</strong> Beginner to Intermediate
          </div>
          <div>
            <strong>Prerequisites:</strong> Basic React knowledge
          </div>
        </div>
      </Callout>

      {/* Dynamic Progress Indicator - updates based on scroll position */}
      <TutorialProgressWrapper steps={tutorialSteps} />

      <YouWillLearn
        items={[
          'How to set up a React project with Clarity Chat',
          'Build a complete chat interface with real-time messaging',
          'Add user avatars, timestamps, and typing indicators',
          'Implement message reactions and file attachments',
          'Create a dark mode toggle and custom theming',
          'Handle errors and loading states',
          'Optimize performance for large message lists',
        ]}
      />

      <div id="what-youll-build" className="mt-12 mb-8">
        <h2 className="text-3xl font-bold mb-4">What You'll Build</h2>

        <p className="text-text-secondary mb-6">
          By the end of this tutorial, you'll have a production-ready chat app
          with:
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-bg-secondary border border-border">
            <div className="text-2xl mb-2">💬</div>
            <h4 className="font-semibold text-text-primary mb-1">
              Real-time Messaging
            </h4>
            <p className="text-sm text-text-secondary">
              Instant message display with smooth animations
            </p>
          </div>
          <div className="p-4 rounded-lg bg-bg-secondary border border-border">
            <div className="text-2xl mb-2">👤</div>
            <h4 className="font-semibold text-text-primary mb-1">
              User Avatars
            </h4>
            <p className="text-sm text-text-secondary">
              Personalized avatars and timestamps
            </p>
          </div>
          <div className="p-4 rounded-lg bg-bg-secondary border border-border">
            <div className="text-2xl mb-2">⌨️</div>
            <h4 className="font-semibold text-text-primary mb-1">
              Typing Indicators
            </h4>
            <p className="text-sm text-secondary">Show when users are typing</p>
          </div>
          <div className="p-4 rounded-lg bg-bg-secondary border border-border">
            <div className="text-2xl mb-2">😊</div>
            <h4 className="font-semibold text-text-primary mb-1">
              Message Reactions
            </h4>
            <p className="text-sm text-text-secondary">
              Emoji reactions for messages
            </p>
          </div>
          <div className="p-4 rounded-lg bg-bg-secondary border border-border">
            <div className="text-2xl mb-2">📎</div>
            <h4 className="font-semibold text-text-primary mb-1">
              File Attachments
            </h4>
            <p className="text-sm text-text-secondary">
              Upload and display files
            </p>
          </div>
          <div className="p-4 rounded-lg bg-bg-secondary border border-border">
            <div className="text-2xl mb-2">🌙</div>
            <h4 className="font-semibold text-text-primary mb-1">Dark Mode</h4>
            <p className="text-sm text-text-secondary">
              Theme switching with smooth transitions
            </p>
          </div>
        </div>
      </div>

      <div id="setup">
        <TutorialStep
          step={1}
          title="Project Setup"
          nextStepHref="#basic-chat"
          nextStepTitle="Basic Chat Interface"
        >
        <p className="text-text-secondary mb-4">
          Create a new React project with Vite and install Clarity Chat:
        </p>

        <EnhancedCodeBlock
          code={`# Create new project
npm create vite@latest my-chat-app -- --template react-ts

# Navigate to project
cd my-chat-app

# Install dependencies
npm install

# Install Clarity Chat
npm install @clarity-chat/react`}
          language="bash"
          filename="Terminal"
          showCopyButton
        />

        <Callout type="tip" className="mt-4">
          <p>
            <strong>Alternative:</strong> You can also use Next.js, Remix, or
            any other React framework. See the{' '}
            <a
              href="/learn/installation"
              className="text-brand-500 hover:underline"
            >
              Installation Guide
            </a>{' '}
            for framework-specific instructions.
          </p>
        </Callout>
        </TutorialStep>
      </div>

      <UseChatFlowAnimation />

      <div id="basic-chat">
        <TutorialStep
          step={2}
          title="Basic Chat Interface"
          nextStepHref="#enhancements"
          nextStepTitle="Adding Enhancements"
        >
        <p className="text-text-secondary mb-4">
          Replace the contents of{' '}
          <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">
            src/App.tsx
          </code>
          :
        </p>

        <EnhancedCodeBlock
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
    <ToastProvider>
    <div className="app">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        placeholder="Type your message..."
        height="100vh"
      />
    </div>
    </ToastProvider>
  )
}

export default App`}
          language="tsx"
          title="src/App.tsx"
          showLineNumbers
        />

        <p>Run your app:</p>

        <EnhancedCodeBlock code="npm run dev" language="bash" />

        <Callout type="success">
          <p>
            <strong>You did it!</strong> You now have a working chat interface.
            Let's add more features.
          </p>
        </Callout>
      </TutorialStep>
      </div>

      <div id="avatars">
      <h2>Step 3: Add Avatars</h2>

      <p>Enhance messages with user avatars:</p>

      <EnhancedCodeBlock
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
      </div>

      <div id="typing-indicator">
      <h2>Step 4: Typing Indicator</h2>

      <p>Show when the bot is "typing":</p>

      <EnhancedCodeBlock
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
    <ToastProvider>
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
      </div>

      <div id="reactions">
      <h2>Step 5: Message Reactions</h2>

      <p>Allow users to react to messages:</p>

      <EnhancedCodeBlock
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
    <ToastProvider>
  <ChatWindow
    messages={messages}
    onSendMessage={handleSendMessage}
    onReaction={handleReaction}
    enableReactions
  />
)`}
        language="tsx"
      />
      </div>

      <div id="dark-mode">
      <h2>Step 6: Dark Mode</h2>

      <p>Add theme switching:</p>

      <EnhancedCodeBlock
        code={`import { useState } from 'react'
import { ChatWindow, ThemeProvider } from '@clarity-chat/react'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <ToastProvider>
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
      </div>

      <h2 id="next-steps">What's Next?</h2>

      <p>
        Congratulations! You've built a feature-rich chat application. Here are
        some ideas to extend it:
      </p>

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
          Check out our <a href="/examples">Examples</a> section to see these
          features in action!
        </p>
      </Callout>

      <h2 id="full-code">Complete Code</h2>

      <p>Here's the full implementation:</p>

      <EnhancedCodeBlock
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
    <ToastProvider>
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
    </div>
  )
}
