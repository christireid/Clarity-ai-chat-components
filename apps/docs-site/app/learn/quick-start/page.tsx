import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Quick Start',
  description: 'Get started with Clarity Chat UI in 5 minutes',
}

export default function QuickStartPage() {
  return (
    <>
      <Breadcrumbs />
      
      <h1>Quick Start</h1>
      
      <p className="lead">
        Get up and running with Clarity Chat UI in less than 5 minutes. This guide will walk you through installation, basic setup, and creating your first chat interface.
      </p>

      <Callout type="tip">
        Already have a React project? Jump straight to the installation step below.
      </Callout>

      <h2 id="prerequisites">Prerequisites</h2>
      
      <p>Before you begin, make sure you have:</p>
      
      <ul>
        <li><strong>Node.js 18+</strong> installed on your machine</li>
        <li><strong>npm, yarn, or pnpm</strong> package manager</li>
        <li><strong>React 18+</strong> project (or create a new one)</li>
      </ul>

      <h2 id="installation">Installation</h2>
      
      <p>Install Clarity Chat UI using your preferred package manager:</p>

      <CodeBlock
        code={`# Using npm
npm install @clarity-chat/react

# Using yarn
yarn add @clarity-chat/react

# Using pnpm
pnpm add @clarity-chat/react`}
        language="bash"
        title="Terminal"
      />

      <h2 id="basic-usage">Basic Usage</h2>
      
      <p>Import and use the ChatWindow component in your React application:</p>

      <CodeBlock
        code={`import { useState } from 'react'
import { ChatWindow, Message } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
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
    setMessages([...messages, newMessage])
  }

  return (
    <div style={{ height: '100vh' }}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        placeholder="Type your message..."
      />
    </div>
  )
}

export default App`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="success">
        <p><strong>That's it!</strong> You now have a fully functional chat interface.</p>
      </Callout>

      <h2 id="whats-included">What's Included?</h2>
      
      <p>The basic ChatWindow component includes:</p>

      <ul>
        <li>📝 <strong>Message Display</strong> - Beautifully formatted messages with timestamps</li>
        <li>⌨️ <strong>Input Field</strong> - Textarea with auto-resize and keyboard shortcuts</li>
        <li>✨ <strong>Animations</strong> - Smooth enter/exit transitions</li>
        <li>♿ <strong>Accessibility</strong> - Full keyboard navigation and screen reader support</li>
        <li>🎨 <strong>Theming</strong> - Dark mode ready with customizable colors</li>
      </ul>

      <h2 id="customization">Quick Customization</h2>
      
      <p>Customize the appearance with props:</p>

      <CodeBlock
        code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  placeholder="Ask me anything..."
  theme="dark"
  height="600px"
  showTimestamps
  showAvatars
  enableMarkdown
  animationPreset="smooth"
/>`}
        language="tsx"
      />

      <h2 id="next-steps">Next Steps</h2>
      
      <p>Now that you have a basic chat interface, explore more features:</p>

      <ul>
        <li>📚 <a href="/learn/tutorial">Complete Tutorial</a> - Build a full-featured chat app</li>
        <li>🎨 <a href="/learn/concepts/theming">Theming Guide</a> - Customize colors and styles</li>
        <li>🔧 <a href="/reference/components">Components</a> - Explore all 70+ components</li>
        <li>🪝 <a href="/reference/hooks">Hooks</a> - Use powerful React hooks</li>
        <li>💡 <a href="/examples">Examples</a> - See real-world implementations</li>
      </ul>

      <Callout type="info">
        <p>
          <strong>Need help?</strong> Check out our{' '}
          <a href="https://github.com/clarity-chat/ui/discussions">GitHub Discussions</a>{' '}
          or join our <a href="https://discord.gg/clarity-chat">Discord community</a>.
        </p>
      </Callout>

      <Pagination
        next={{
          title: 'Installation',
          href: '/learn/installation',
        }}
      />
    </>
  )
}
