import React from 'react'
import { Metadata } from 'next'
import DocsLayout from '@/components/Layout/DocsLayout'
import LiveDemo from '@/components/Demo/LiveDemo'
import Callout from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Custom Styling Example - Clarity Chat Components',
  description: 'Learn how to customize the appearance of Clarity Chat components with CSS, Tailwind, CSS-in-JS, and custom themes.',
}

export default function CustomStylingExamplePage() {
  return (
    <DocsLayout
      title="Custom Styling Example"
      description="Advanced techniques for customizing component appearance"
    >
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Overview</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            This example demonstrates multiple approaches to customizing the appearance of Clarity Chat components. 
            Learn how to use CSS classes, Tailwind CSS, CSS-in-JS, CSS custom properties, and create fully custom themes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">💅 CSS Classes</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Target built-in classes for precise control
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">🎨 CSS Variables</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Theme with custom properties
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">⚡ Tailwind CSS</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Utility-first rapid styling
              </p>
            </div>
          </div>

          <Callout type="tip" className="mb-6">
            All styling approaches can be combined. Start with CSS variables for broad theming, then use classes 
            for specific customizations.
          </Callout>
        </section>

        {/* Method 1: Tailwind CSS */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Method 1: Tailwind CSS Classes</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The easiest way to customize components is by passing Tailwind classes via the <code>className</code> prop:
          </p>

          <LiveDemo
            title="Tailwind CSS Styling"
            code={`import React, { useState } from 'react'
import { ChatWindow, Message } from '@clarity-chat/react'

export default function TailwindStylingExample() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Check out this custom styling! 🎨',
      sender: { id: 'user1', name: 'Designer' },
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '2',
      text: 'Looks great! The gradient backgrounds are nice.',
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date(Date.now() - 60000)
    }
  ])

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date()
    }
    setMessages([...messages, newMessage])
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSendMessage}
      currentUser={{ id: 'user2', name: 'You' }}
      // Custom Tailwind classes
      className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-300 dark:border-purple-700 shadow-2xl"
      messageClassName="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg"
      inputClassName="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-2 border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-500 rounded-2xl"
      headerClassName="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
    />
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="600px"
          />
        </section>

        {/* Method 2: CSS Custom Properties */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Method 2: CSS Custom Properties (Variables)</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Define a complete theme using CSS custom properties for consistent styling across all components:
          </p>

          <LiveDemo
            title="CSS Variables Theme"
            code={`import React, { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'

// Custom theme using CSS variables
const customTheme = {
  // Colors
  '--chat-primary': '#8b5cf6',
  '--chat-primary-hover': '#7c3aed',
  '--chat-secondary': '#ec4899',
  '--chat-background': '#faf5ff',
  '--chat-surface': '#ffffff',
  '--chat-border': '#e9d5ff',
  '--chat-text': '#1f2937',
  '--chat-text-muted': '#6b7280',
  
  // Messages
  '--chat-message-sent-bg': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  '--chat-message-sent-text': '#ffffff',
  '--chat-message-received-bg': '#ffffff',
  '--chat-message-received-text': '#1f2937',
  '--chat-message-border-radius': '18px',
  
  // Input
  '--chat-input-bg': '#ffffff',
  '--chat-input-border': '#e9d5ff',
  '--chat-input-focus-border': '#8b5cf6',
  
  // Spacing
  '--chat-spacing-xs': '4px',
  '--chat-spacing-sm': '8px',
  '--chat-spacing-md': '16px',
  '--chat-spacing-lg': '24px',
  
  // Shadows
  '--chat-shadow-sm': '0 1px 2px rgba(139, 92, 246, 0.05)',
  '--chat-shadow-md': '0 4px 6px rgba(139, 92, 246, 0.1)',
  '--chat-shadow-lg': '0 10px 15px rgba(139, 92, 246, 0.15)',
}

export default function CSSVariablesExample() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'This theme uses CSS custom properties! 🎨',
      sender: { id: 'user1', name: 'Theme Master' },
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '2',
      text: 'The purple and pink gradient looks amazing!',
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date(Date.now() - 60000)
    }
  ])

  const handleSendMessage = (text) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text,
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date()
    }])
  }

  return (
    <div style={customTheme}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        currentUser={{ id: 'user2', name: 'You' }}
      />
      
      <div className="mt-4 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold mb-2">Theme Variables:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div>--chat-primary: <span className="text-purple-600">#8b5cf6</span></div>
          <div>--chat-secondary: <span className="text-pink-600">#ec4899</span></div>
          <div>--chat-background: <span className="text-purple-100">#faf5ff</span></div>
          <div>--chat-border-radius: <span className="text-slate-600">18px</span></div>
        </div>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="700px"
          />
        </section>

        {/* Method 3: Themed Components */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Method 3: Pre-built Themes</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Create reusable theme objects that can be applied to multiple components:
          </p>

          <LiveDemo
            title="Pre-built Themes"
            code={`import React, { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'

// Define theme objects
const themes = {
  ocean: {
    name: 'Ocean',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    background: 'from-cyan-50 to-blue-50',
    backgroundDark: 'dark:from-cyan-900/20 dark:to-blue-900/20',
    border: 'border-cyan-300 dark:border-cyan-700',
    message: 'bg-cyan-100 dark:bg-cyan-900/30',
    input: 'border-cyan-300 dark:border-cyan-700 focus:border-cyan-500'
  },
  sunset: {
    name: 'Sunset',
    primary: '#f97316',
    secondary: '#ef4444',
    background: 'from-orange-50 to-red-50',
    backgroundDark: 'dark:from-orange-900/20 dark:to-red-900/20',
    border: 'border-orange-300 dark:border-orange-700',
    message: 'bg-orange-100 dark:bg-orange-900/30',
    input: 'border-orange-300 dark:border-orange-700 focus:border-orange-500'
  },
  forest: {
    name: 'Forest',
    primary: '#10b981',
    secondary: '#14b8a6',
    background: 'from-emerald-50 to-teal-50',
    backgroundDark: 'dark:from-emerald-900/20 dark:to-teal-900/20',
    border: 'border-emerald-300 dark:border-emerald-700',
    message: 'bg-emerald-100 dark:bg-emerald-900/30',
    input: 'border-emerald-300 dark:border-emerald-700 focus:border-emerald-500'
  },
  lavender: {
    name: 'Lavender',
    primary: '#a855f7',
    secondary: '#d946ef',
    background: 'from-purple-50 to-fuchsia-50',
    backgroundDark: 'dark:from-purple-900/20 dark:to-fuchsia-900/20',
    border: 'border-purple-300 dark:border-purple-700',
    message: 'bg-purple-100 dark:bg-purple-900/30',
    input: 'border-purple-300 dark:border-purple-700 focus:border-purple-500'
  }
}

export default function PrebuiltThemesExample() {
  const [selectedTheme, setSelectedTheme] = useState('ocean')
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Try switching between themes! 🎨',
      sender: { id: 'user1', name: 'Theme Bot' },
      timestamp: new Date(Date.now() - 120000)
    }
  ])

  const theme = themes[selectedTheme]

  const handleSendMessage = (text) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text,
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date()
    }])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {Object.entries(themes).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setSelectedTheme(key)}
            className={\`px-4 py-2 rounded-lg font-semibold transition-all \${
              selectedTheme === key
                ? 'bg-gradient-to-r text-white shadow-lg scale-105'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
            }\`}
            style={
              selectedTheme === key
                ? {
                    backgroundImage: \`linear-gradient(135deg, \${t.primary}, \${t.secondary})\`
                  }
                : {}
            }
          >
            {t.name}
          </button>
        ))}
      </div>

      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        currentUser={{ id: 'user2', name: 'You' }}
        className={\`bg-gradient-to-br \${theme.background} \${theme.backgroundDark} border-2 \${theme.border}\`}
        messageClassName={theme.message}
        inputClassName={\`\${theme.input}\`}
      />
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="700px"
          />
        </section>

        {/* Method 4: Custom Message Bubbles */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Method 4: Custom Message Bubbles</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Create unique message bubble designs with custom shapes, shadows, and animations:
          </p>

          <LiveDemo
            title="Custom Message Bubble Styles"
            code={`import React, { useState } from 'react'
import { ChatWindow, Message } from '@clarity-chat/react'

export default function CustomBubblesExample() {
  const [bubbleStyle, setBubbleStyle] = useState('modern')
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Check out these custom bubble styles!',
      sender: { id: 'user1', name: 'Designer' },
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: '2',
      text: 'They look so much better than default bubbles! 🎨',
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '3',
      text: 'You can even add shadows and animations!',
      sender: { id: 'user1', name: 'Designer' },
      timestamp: new Date(Date.now() - 60000)
    }
  ])

  const bubbleStyles = {
    modern: {
      name: 'Modern',
      sent: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl shadow-lg',
      received: 'bg-white dark:bg-slate-800 rounded-3xl shadow-md border border-slate-200 dark:border-slate-700'
    },
    minimal: {
      name: 'Minimal',
      sent: 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg',
      received: 'bg-slate-100 dark:bg-slate-800 rounded-lg'
    },
    bubble: {
      name: 'Bubble',
      sent: 'bg-blue-500 text-white rounded-full px-6 py-3 shadow-xl transform hover:scale-105 transition-transform',
      received: 'bg-slate-200 dark:bg-slate-700 rounded-full px-6 py-3 shadow-lg transform hover:scale-105 transition-transform'
    },
    paper: {
      name: 'Paper',
      sent: 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-2xl shadow-md',
      received: 'bg-slate-50 dark:bg-slate-800 border-l-4 border-slate-300 dark:border-slate-600 rounded-r-2xl shadow-sm'
    },
    neon: {
      name: 'Neon',
      sent: 'bg-slate-900 text-cyan-400 rounded-2xl border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]',
      received: 'bg-slate-900 text-pink-400 rounded-2xl border-2 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]'
    }
  }

  const currentStyle = bubbleStyles[bubbleStyle]

  const handleSendMessage = (text) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text,
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date()
    }])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        {Object.entries(bubbleStyles).map(([key, style]) => (
          <button
            key={key}
            onClick={() => setBubbleStyle(key)}
            className={\`px-4 py-2 rounded-lg font-medium transition-all \${
              bubbleStyle === key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'
            }\`}
          >
            {style.name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {messages.map(message => (
          <div
            key={message.id}
            className={\`flex \${message.sender.id === 'user2' ? 'justify-end' : 'justify-start'}\`}
          >
            <div
              className={\`max-w-[80%] p-4 \${
                message.sender.id === 'user2'
                  ? currentStyle.sent
                  : currentStyle.received
              }\`}
            >
              <div className="text-sm font-semibold mb-1">
                {message.sender.name}
              </div>
              <div>{message.text}</div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              handleSendMessage(e.currentTarget.value)
              e.currentTarget.value = ''
            }
          }}
        />
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          onClick={() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement
            if (input?.value.trim()) {
              handleSendMessage(input.value)
              input.value = ''
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="750px"
          />
        </section>

        {/* Method 5: Glassmorphism */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Method 5: Glassmorphism Effect</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Create stunning glass-like effects with backdrop blur and transparency:
          </p>

          <LiveDemo
            title="Glassmorphism Chat"
            code={`import React, { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'

export default function GlassmorphismExample() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'This uses glassmorphism design! ✨',
      sender: { id: 'user1', name: 'UI Expert' },
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '2',
      text: 'The frosted glass effect looks so modern!',
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date(Date.now() - 60000)
    }
  ])

  const handleSendMessage = (text) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text,
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date()
    }])
  }

  return (
    <div
      className="relative p-8 rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        currentUser={{ id: 'user2', name: 'You' }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
        messageClassName="backdrop-blur-md bg-white/20 border border-white/30 text-white shadow-lg"
        inputClassName="backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:border-white/50"
        headerClassName="backdrop-blur-md bg-white/10 border-b border-white/20 text-white"
      />

      <div className="mt-4 p-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white">
        <h3 className="font-semibold mb-2">Glassmorphism Tips:</h3>
        <ul className="space-y-1 text-sm">
          <li>• Use <code className="bg-white/20 px-1 rounded">backdrop-blur</code> for frosted glass effect</li>
          <li>• Combine with semi-transparent backgrounds</li>
          <li>• Add subtle borders for depth</li>
          <li>• Works best over colorful backgrounds</li>
        </ul>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="750px"
          />
        </section>

        {/* Method 6: Animated Gradients */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Method 6: Animated Gradients</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Add life to your chat with animated gradient backgrounds:
          </p>

          <LiveDemo
            title="Animated Gradient Chat"
            code={`import React, { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'

export default function AnimatedGradientExample() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Watch the background animate! 🌈',
      sender: { id: 'user1', name: 'Animation Fan' },
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '2',
      text: 'This gradient animation is mesmerizing!',
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date(Date.now() - 60000)
    }
  ])

  const handleSendMessage = (text) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text,
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date()
    }])
  }

  return (
    <div className="relative">
      <style>{\`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient {
          background: linear-gradient(
            -45deg,
            #ee7752,
            #e73c7e,
            #23a6d5,
            #23d5ab
          );
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
      \`}</style>

      <div className="animated-gradient p-8 rounded-2xl">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUser={{ id: 'user2', name: 'You' }}
          className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 shadow-2xl"
        />
      </div>

      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <h3 className="font-semibold mb-2">Animation Details:</h3>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li>• 15-second animation loop</li>
          <li>• 4-color gradient (coral, pink, blue, teal)</li>
          <li>• Smooth ease timing function</li>
          <li>• 400% background size for smooth transitions</li>
        </ul>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="750px"
          />
        </section>

        {/* Method 7: Dark Mode Variants */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Method 7: Dark Mode Variants</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Create different styles for light and dark modes:
          </p>

          <LiveDemo
            title="Dark Mode Aware Styling"
            code={`import React, { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'

export default function DarkModeVariantsExample() {
  const [isDark, setIsDark] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Toggle dark mode to see different styles!',
      sender: { id: 'user1', name: 'Theme Master' },
      timestamp: new Date(Date.now() - 120000)
    }
  ])

  const handleSendMessage = (text) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text,
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date()
    }])
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <span className="font-semibold">Dark Mode</span>
          <button
            onClick={() => setIsDark(!isDark)}
            className={\`relative w-14 h-8 rounded-full transition-colors \${
              isDark ? 'bg-blue-600' : 'bg-slate-300'
            }\`}
          >
            <div
              className={\`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform \${
                isDark ? 'translate-x-7' : 'translate-x-1'
              }\`}
            />
          </button>
        </div>

        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUser={{ id: 'user2', name: 'You' }}
          // Light mode: soft pastels
          // Dark mode: vibrant neon-like colors
          className="
            bg-gradient-to-br from-pink-50 to-purple-50 
            dark:from-slate-900 dark:to-purple-900
            border-2 border-pink-200 dark:border-purple-500
            shadow-xl dark:shadow-purple-900/50
          "
          messageClassName="
            bg-white dark:bg-slate-800
            border border-pink-200 dark:border-purple-500
            shadow-sm dark:shadow-purple-900/30
            text-slate-900 dark:text-white
          "
          inputClassName="
            bg-white dark:bg-slate-800
            border-2 border-pink-200 dark:border-purple-500
            focus:border-pink-400 dark:focus:border-purple-400
            text-slate-900 dark:text-white
          "
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-pink-50 dark:bg-slate-800 rounded-lg">
            <h3 className="font-semibold mb-2">Light Mode</h3>
            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>• Soft pastel colors</li>
              <li>• Light backgrounds</li>
              <li>• Subtle shadows</li>
              <li>• High readability</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-slate-800 rounded-lg">
            <h3 className="font-semibold mb-2">Dark Mode</h3>
            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>• Vibrant accent colors</li>
              <li>• Dark backgrounds</li>
              <li>• Glowing effects</li>
              <li>• Reduced eye strain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="800px"
          />
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Styling Best Practices</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                <span>✓</span> Do
              </h3>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <li>• Use CSS variables for theme-wide consistency</li>
                <li>• Test your styles in both light and dark modes</li>
                <li>• Maintain sufficient color contrast for accessibility (WCAG AA: 4.5:1)</li>
                <li>• Use responsive units (rem, em) instead of fixed pixels</li>
                <li>• Test on multiple screen sizes and devices</li>
                <li>• Keep animations subtle and respect user preferences (prefers-reduced-motion)</li>
                <li>• Use semantic color names (primary, success, danger) instead of specific colors</li>
                <li>• Document your custom theme variables</li>
                <li>• Provide fallback styles for older browsers</li>
              </ul>
            </div>

            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                <span>✗</span> Don't
              </h3>
              <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                <li>• Don't use too many colors (stick to 2-3 primary colors)</li>
                <li>• Don't sacrifice readability for aesthetics</li>
                <li>• Don't use animations that are too fast or distracting</li>
                <li>• Don't forget about keyboard focus styles</li>
                <li>• Don't hardcode colors - use variables or theme objects</li>
                <li>• Don't ignore mobile/touch-friendly sizing (min 44x44px touch targets)</li>
                <li>• Don't use pure white (#FFFFFF) or pure black (#000000) for backgrounds</li>
                <li>• Don't override styles without understanding the original purpose</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CSS Class Reference */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">CSS Class Reference</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Target these built-in classes for precise styling control:
          </p>

          <div className="space-y-4">
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-semibold mb-2">ChatWindow Classes</h3>
              <ul className="space-y-1 text-sm font-mono text-slate-600 dark:text-slate-400">
                <li><code>.chat-window</code> - Main container</li>
                <li><code>.chat-window-header</code> - Header section</li>
                <li><code>.chat-window-body</code> - Message list container</li>
                <li><code>.chat-window-footer</code> - Input section</li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-semibold mb-2">Message Classes</h3>
              <ul className="space-y-1 text-sm font-mono text-slate-600 dark:text-slate-400">
                <li><code>.message</code> - Message container</li>
                <li><code>.message-sent</code> - Sent message variant</li>
                <li><code>.message-received</code> - Received message variant</li>
                <li><code>.message-content</code> - Message text</li>
                <li><code>.message-timestamp</code> - Timestamp</li>
                <li><code>.message-avatar</code> - User avatar</li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-semibold mb-2">Input Classes</h3>
              <ul className="space-y-1 text-sm font-mono text-slate-600 dark:text-slate-400">
                <li><code>.message-input</code> - Input container</li>
                <li><code>.message-input-field</code> - Text input</li>
                <li><code>.message-input-button</code> - Send button</li>
                <li><code>.message-input-attachments</code> - Attachment area</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Complete Custom Theme Example</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Here's a complete example combining multiple styling techniques:
          </p>

          <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto mb-6">
            <code>{`// theme.css
:root {
  /* Brand Colors */
  --chat-brand-primary: #6366f1;
  --chat-brand-secondary: #8b5cf6;
  --chat-brand-accent: #ec4899;
  
  /* Semantic Colors */
  --chat-success: #10b981;
  --chat-warning: #f59e0b;
  --chat-error: #ef4444;
  --chat-info: #3b82f6;
  
  /* Backgrounds */
  --chat-bg-primary: #ffffff;
  --chat-bg-secondary: #f8fafc;
  --chat-bg-tertiary: #f1f5f9;
  
  /* Text */
  --chat-text-primary: #0f172a;
  --chat-text-secondary: #475569;
  --chat-text-tertiary: #94a3b8;
  
  /* Borders */
  --chat-border-color: #e2e8f0;
  --chat-border-radius: 12px;
  
  /* Shadows */
  --chat-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --chat-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --chat-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Spacing */
  --chat-space-xs: 4px;
  --chat-space-sm: 8px;
  --chat-space-md: 16px;
  --chat-space-lg: 24px;
  --chat-space-xl: 32px;
}

/* Dark mode */
.dark {
  --chat-bg-primary: #0f172a;
  --chat-bg-secondary: #1e293b;
  --chat-bg-tertiary: #334155;
  --chat-text-primary: #f1f5f9;
  --chat-text-secondary: #cbd5e1;
  --chat-text-tertiary: #64748b;
  --chat-border-color: #334155;
}

/* Custom chat styles */
.custom-chat {
  background: var(--chat-bg-primary);
  border: 1px solid var(--chat-border-color);
  border-radius: var(--chat-border-radius);
  box-shadow: var(--chat-shadow-lg);
}

.custom-message {
  padding: var(--chat-space-md);
  margin: var(--chat-space-sm) 0;
  border-radius: var(--chat-border-radius);
  box-shadow: var(--chat-shadow-sm);
}

.custom-message-sent {
  background: linear-gradient(
    135deg,
    var(--chat-brand-primary),
    var(--chat-brand-secondary)
  );
  color: white;
  margin-left: auto;
}

.custom-message-received {
  background: var(--chat-bg-secondary);
  color: var(--chat-text-primary);
  margin-right: auto;
}

/* Usage in React */
import './theme.css'

export function CustomChat() {
  return (
    <ChatWindow
      className="custom-chat"
      messageClassName="custom-message"
      // ... other props
    />
  )
}`}</code>
          </pre>
        </section>

        {/* Resources */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/learn/guides/styling"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">📘 Styling Guide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Comprehensive guide to styling components
              </p>
            </a>

            <a
              href="/learn/concepts/theming"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">🎨 Theming Concepts</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Learn about theming architecture
              </p>
            </a>

            <a
              href="/examples/themed-chat"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">✨ Themed Chat Example</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Complete themed chat implementation
              </p>
            </a>

            <a
              href="/reference/api/types"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">📦 TypeScript Types</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Type definitions for theme objects
              </p>
            </a>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Next Steps</h2>
          
          <Callout type="info">
            Now that you know how to customize the appearance, explore these related topics:
          </Callout>

          <div className="mt-6 space-y-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-2">🌙 Dark Mode</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Learn how to implement and customize dark mode support
              </p>
              <a href="/learn/guides/dark-mode" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Read the Dark Mode Guide →
              </a>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-2">♿ Accessibility</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Ensure your custom styles maintain accessibility standards
              </p>
              <a href="/learn/guides/accessibility" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Read the Accessibility Guide →
              </a>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-2">🎭 Animations</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Add smooth animations and transitions to your chat
              </p>
              <a href="/learn/concepts/animations" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Learn About Animations →
              </a>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  )
}
