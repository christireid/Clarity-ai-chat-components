import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'Themed Chat Example',
  description: 'Customize chat appearance with themes and dark mode',
}

const themedChatCode = `import { useState } from 'react'
import { ChatWindow, Message, ThemeProvider } from '@clarity-chat/react'

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to the themed chat! 🎨',
      sender: 'bot',
      timestamp: new Date(Date.now() - 120000),
      avatar: {
        src: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot',
        alt: 'Bot',
      },
    },
    {
      id: '2',
      text: 'Try toggling the theme with the button above!',
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000),
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

    // Bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: theme === 'dark' 
          ? '🌙 Dark mode looks great, doesn\\'t it?' 
          : '☀️ Light mode is so bright and cheerful!',
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
    <ThemeProvider theme={theme}>
      <div style={{ height: '650px', display: 'flex', flexDirection: 'column' }}>
        {/* Theme Toggle */}
        <div style={{ 
          padding: '1rem', 
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f9fafb' : '#111827',
        }}>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
              color: theme === 'dark' ? '#f9fafb' : '#111827',
            }}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>

        {/* Chat Window */}
        <div style={{ flex: 1 }}>
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            placeholder="Type your message..."
            showTimestamps
            showAvatars
          />
        </div>
      </div>
    </ThemeProvider>
  )
}`

export default function ThemedChatExample() {
  return (
    <>
      <Breadcrumbs />
      
      <h1>Themed Chat Example</h1>
      
      <p className="lead">
        Learn how to customize your chat interface with themes and implement dark mode support.
        This example shows theme switching, custom colors, and responsive design.
      </p>

      <Callout type="info">
        <p>
          <strong>What you'll learn:</strong> Theme configuration, dark mode implementation,
          custom styling, and ThemeProvider usage.
        </p>
      </Callout>

      <h2 id="live-demo">Live Demo</h2>

      <p>Click the theme toggle button to switch between light and dark modes!</p>

      <LiveDemo
        title="Themed Chat Interface"
        code={themedChatCode}
        height="700px"
      />

      <h2 id="how-it-works">How It Works</h2>

      <h3>1. Theme State</h3>

      <p>Manage theme with React state:</p>

      <CodeBlock
        code={`const [theme, setTheme] = useState<'light' | 'dark'>('light')`}
        language="tsx"
      />

      <h3>2. ThemeProvider</h3>

      <p>Wrap your app with ThemeProvider:</p>

      <CodeBlock
        code={`import { ThemeProvider } from '@clarity-chat/react'

<ThemeProvider theme={theme}>
  <YourApp />
</ThemeProvider>`}
        language="tsx"
        showLineNumbers
      />

      <h3>3. Theme Toggle</h3>

      <CodeBlock
        code={`<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
</button>`}
        language="tsx"
      />

      <h2 id="custom-theme">Custom Theme Configuration</h2>

      <p>Create a custom theme with your brand colors:</p>

      <CodeBlock
        code={`import { createTheme, ThemeProvider } from '@clarity-chat/react'

const customTheme = createTheme({
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#111827',
    border: '#e5e7eb',
  },
  fonts: {
    sans: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
})

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="css-variables">Using CSS Variables</h2>

      <p>Customize themes with CSS variables:</p>

      <CodeBlock
        code={`:root {
  --chat-bg-primary: #ffffff;
  --chat-bg-secondary: #f9fafb;
  --chat-text-primary: #111827;
  --chat-text-secondary: #6b7280;
  --chat-border: #e5e7eb;
  --chat-brand: #3b82f6;
}

.dark {
  --chat-bg-primary: #111827;
  --chat-bg-secondary: #1f2937;
  --chat-text-primary: #f9fafb;
  --chat-text-secondary: #d1d5db;
  --chat-border: #374151;
  --chat-brand: #60a5fa;
}`}
        language="css"
      />

      <h2 id="system-theme">System Theme Detection</h2>

      <p>Automatically detect user's system theme preference:</p>

      <CodeBlock
        code={`import { useEffect, useState } from 'react'

function useSystemTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)')
    
    setTheme(darkMode.matches ? 'dark' : 'light')

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }

    darkMode.addEventListener('change', handleChange)
    return () => darkMode.removeEventListener('change', handleChange)
  }, [])

  return theme
}

function App() {
  const systemTheme = useSystemTheme()
  
  return (
    <ThemeProvider theme={systemTheme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="persist-theme">Persist Theme Preference</h2>

      <CodeBlock
        code={`import { useEffect, useState } from 'react'

function usePersistedTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as 'light' | 'dark') || 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  return [theme, setTheme] as const
}

function App() {
  const [theme, setTheme] = usePersistedTheme()
  
  return (
    <ThemeProvider theme={theme}>
      <div>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle Theme
        </button>
        <ChatWindow {...props} />
      </div>
    </ThemeProvider>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="multiple-themes">Multiple Theme Options</h2>

      <p>Offer multiple theme choices beyond light/dark:</p>

      <CodeBlock
        code={`type Theme = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset'

const themes = {
  light: {
    primary: '#3b82f6',
    background: '#ffffff',
    text: '#111827',
  },
  dark: {
    primary: '#60a5fa',
    background: '#111827',
    text: '#f9fafb',
  },
  ocean: {
    primary: '#0ea5e9',
    background: '#f0f9ff',
    text: '#0c4a6e',
  },
  forest: {
    primary: '#10b981',
    background: '#f0fdf4',
    text: '#064e3b',
  },
  sunset: {
    primary: '#f59e0b',
    background: '#fffbeb',
    text: '#78350f',
  },
}

function App() {
  const [theme, setTheme] = useState<Theme>('light')
  
  return (
    <ThemeProvider theme={themes[theme]}>
      <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="ocean">Ocean</option>
        <option value="forest">Forest</option>
        <option value="sunset">Sunset</option>
      </select>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="animated-transition">Smooth Theme Transitions</h2>

      <CodeBlock
        code={`/* Add to your CSS */
* {
  transition: 
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}`}
        language="css"
      />

      <Callout type="tip">
        <p>
          Use <code>transition</code> for smooth theme changes, but be careful not to transition
          all properties as it can impact performance. Only transition color-related properties.
        </p>
      </Callout>

      <h2 id="full-code">Complete Source Code</h2>

      <CodeBlock
        code={themedChatCode}
        language="tsx"
        title="App.tsx"
        showLineNumbers
      />

      <Callout type="success">
        <p>
          <strong>Congratulations!</strong> You now know how to theme your chat interface.
          Try combining this with <a href="/examples/custom-styling">custom styling</a> for
          even more customization options.
        </p>
      </Callout>

      <Pagination
        prev={{
          title: 'Simple Chat',
          href: '/examples/simple-chat',
        }}
        next={{
          title: 'Custom Styling',
          href: '/examples/custom-styling',
        }}
      />
    </>
  )
}
