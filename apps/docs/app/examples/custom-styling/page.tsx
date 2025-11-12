import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Custom Styling Example - Clarity Chat Components',
  description: 'Learn how to style Clarity Chat components with custom CSS, Tailwind classes, and CSS-in-JS.',
}

export default function CustomStylingExamplePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Example</span>
        <span className="docs-badge">Intermediate</span>
        <h1>Custom Styling</h1>
        <p className="docs-lead">
          Complete guide to styling Clarity Chat components with custom themes, CSS variables, 
          Tailwind classes, and CSS-in-JS solutions.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Clarity Chat components are designed to be highly customizable. This example demonstrates
          various styling approaches including:
        </p>
        <ul>
          <li>CSS Variables for theme customization</li>
          <li>Tailwind utility classes</li>
          <li>Custom CSS classes</li>
          <li>Inline styles</li>
          <li>CSS-in-JS with styled-components or emotion</li>
          <li>Dark mode support</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Method 1: CSS Variables</h2>
        <p>
          The simplest way to customize the look and feel is using CSS variables. All components
          respect a comprehensive set of CSS custom properties.
        </p>
        
        <LiveDemo
          title="CSS Variables Theming"
          code={`import { ChatWindow, Message } from '@clarity-chat/react'

function CSSVariablesExample() {
  const messages = [
    {
      id: '1',
      text: 'This chat uses CSS variables for theming!',
      sender: { id: 'user1', name: 'Alice' },
      timestamp: new Date(),
      isOwn: false
    },
    {
      id: '2',
      text: 'The colors adapt to the custom theme.',
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date(),
      isOwn: true
    }
  ]

  return (
    <div 
      style={{
        '--chat-bg': '#f0f9ff',
        '--chat-border': '#bae6fd',
        '--message-bg': '#ffffff',
        '--message-own-bg': '#0ea5e9',
        '--message-text': '#0c4a6e',
        '--message-own-text': '#ffffff',
        '--input-bg': '#ffffff',
        '--input-border': '#7dd3fc',
        '--input-focus-border': '#0284c7',
        '--button-primary-bg': '#0ea5e9',
        '--button-primary-hover': '#0284c7',
        '--radius': '12px',
        '--shadow': '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
      className="h-[500px]"
    >
      <ChatWindow
        messages={messages}
        onSendMessage={(text) => console.log(text)}
        placeholder="Message with custom theme..."
      />
    </div>
  )
}

export default CSSVariablesExample`}
          height="600px"
        />

        <Callout type="tip" title="Available CSS Variables">
          Here are the key CSS variables you can customize:
          <ul>
            <li><code>--chat-bg</code> - Chat window background</li>
            <li><code>--message-bg</code> - Message bubble background</li>
            <li><code>--message-own-bg</code> - Your message background</li>
            <li><code>--message-text</code> - Message text color</li>
            <li><code>--input-bg</code> - Input field background</li>
            <li><code>--button-primary-bg</code> - Primary button color</li>
            <li><code>--radius</code> - Border radius for elements</li>
            <li><code>--shadow</code> - Box shadow values</li>
          </ul>
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Method 2: Tailwind Classes</h2>
        <p>
          Components accept <code>className</code> props for easy Tailwind customization.
        </p>

        <LiveDemo
          title="Tailwind Utility Classes"
          code={`import { ChatWindow, Message } from '@clarity-chat/react'

function TailwindExample() {
  const messages = [
    {
      id: '1',
      text: 'Styled with Tailwind utilities! 🎨',
      sender: { id: 'user1', name: 'Designer' },
      timestamp: new Date(),
      isOwn: false
    },
    {
      id: '2',
      text: 'Love the gradient background!',
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date(),
      isOwn: true
    }
  ]

  return (
    <div className="h-[500px]">
      <ChatWindow
        messages={messages}
        onSendMessage={(text) => console.log(text)}
        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-2xl"
        messageClassName="backdrop-blur-sm"
        ownMessageClassName="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
        otherMessageClassName="bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white shadow-md"
        inputClassName="bg-white/90 dark:bg-gray-800/90 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 rounded-xl"
        placeholder="Type with style..."
      />
    </div>
  )
}

export default TailwindExample`}
          height="600px"
        />
      </section>

      <section className="docs-section">
        <h2>Method 3: Custom CSS Classes</h2>
        <p>
          For more complex styling, use custom CSS classes with full control.
        </p>

        <LiveDemo
          title="Custom CSS Classes"
          code={`import { ChatWindow, Message } from '@clarity-chat/react'
import './custom-chat.css' // Your custom styles

function CustomCSSExample() {
  const messages = [
    {
      id: '1',
      text: 'This chat has completely custom styling!',
      sender: { id: 'user1', name: 'Creative' },
      timestamp: new Date(),
      isOwn: false
    },
    {
      id: '2',
      text: 'The animations are smooth 🎭',
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date(),
      isOwn: true
    }
  ]

  return (
    <div className="h-[500px]">
      <style jsx>{\`
        .custom-chat {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .custom-message {
          animation: slideIn 0.3s ease-out;
          transition: transform 0.2s;
        }
        
        .custom-message:hover {
          transform: translateY(-2px);
        }
        
        .custom-own-message {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border-radius: 18px 18px 4px 18px;
          padding: 12px 16px;
          box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
        }
        
        .custom-other-message {
          background: rgba(255, 255, 255, 0.95);
          color: #1a202c;
          border-radius: 18px 18px 18px 4px;
          padding: 12px 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .custom-input {
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.3s;
        }
        
        .custom-input:focus {
          border-color: #f5576c;
          box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
          background: white;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      \`}</style>
      
      <ChatWindow
        messages={messages}
        onSendMessage={(text) => console.log(text)}
        className="custom-chat"
        messageClassName="custom-message"
        ownMessageClassName="custom-own-message"
        otherMessageClassName="custom-other-message"
        inputClassName="custom-input"
        placeholder="Message with custom CSS..."
      />
    </div>
  )
}

export default CustomCSSExample`}
          height="600px"
        />
      </section>

      <section className="docs-section">
        <h2>Method 4: Brand Themes</h2>
        <p>
          Create pre-defined brand themes for consistent styling across your app.
        </p>

        <LiveDemo
          title="Brand Theme System"
          code={`import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

const themes = {
  twitter: {
    name: 'Twitter',
    colors: {
      '--chat-bg': '#ffffff',
      '--message-bg': '#f7f9f9',
      '--message-own-bg': '#1da1f2',
      '--message-text': '#14171a',
      '--message-own-text': '#ffffff',
      '--input-bg': '#ffffff',
      '--input-border': '#cfd9de',
      '--input-focus-border': '#1da1f2',
      '--button-primary-bg': '#1da1f2',
      '--radius': '20px'
    }
  },
  slack: {
    name: 'Slack',
    colors: {
      '--chat-bg': '#ffffff',
      '--message-bg': '#f8f8f8',
      '--message-own-bg': '#1264a3',
      '--message-text': '#1d1c1d',
      '--message-own-text': '#ffffff',
      '--input-bg': '#ffffff',
      '--input-border': '#e0e0e0',
      '--input-focus-border': '#1264a3',
      '--button-primary-bg': '#1264a3',
      '--radius': '8px'
    }
  },
  discord: {
    name: 'Discord',
    colors: {
      '--chat-bg': '#36393f',
      '--message-bg': '#40444b',
      '--message-own-bg': '#5865f2',
      '--message-text': '#dcddde',
      '--message-own-text': '#ffffff',
      '--input-bg': '#40444b',
      '--input-border': '#202225',
      '--input-focus-border': '#5865f2',
      '--button-primary-bg': '#5865f2',
      '--radius': '8px'
    }
  },
  whatsapp: {
    name: 'WhatsApp',
    colors: {
      '--chat-bg': '#ece5dd',
      '--message-bg': '#ffffff',
      '--message-own-bg': '#dcf8c6',
      '--message-text': '#303030',
      '--message-own-text': '#303030',
      '--input-bg': '#ffffff',
      '--input-border': '#d1d7db',
      '--input-focus-border': '#25d366',
      '--button-primary-bg': '#25d366',
      '--radius': '8px'
    }
  },
  github: {
    name: 'GitHub',
    colors: {
      '--chat-bg': '#ffffff',
      '--message-bg': '#f6f8fa',
      '--message-own-bg': '#0969da',
      '--message-text': '#24292f',
      '--message-own-text': '#ffffff',
      '--input-bg': '#ffffff',
      '--input-border': '#d0d7de',
      '--input-focus-border': '#0969da',
      '--button-primary-bg': '#0969da',
      '--radius': '6px'
    }
  }
}

function BrandThemesExample() {
  const [selectedTheme, setSelectedTheme] = useState('twitter')

  const messages = [
    {
      id: '1',
      text: \`This is the \${themes[selectedTheme].name} theme!\`,
      sender: { id: 'user1', name: 'Theme Master' },
      timestamp: new Date(),
      isOwn: false
    },
    {
      id: '2',
      text: 'Switch themes to see different styles!',
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date(),
      isOwn: true
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => setSelectedTheme(key)}
            className={\`px-4 py-2 rounded-lg font-medium transition-all \${
              selectedTheme === key
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }\`}
          >
            {theme.name}
          </button>
        ))}
      </div>

      <div style={themes[selectedTheme].colors} className="h-[500px]">
        <ChatWindow
          messages={messages}
          onSendMessage={(text) => console.log(text)}
          placeholder={\`Message in \${themes[selectedTheme].name} style...\`}
        />
      </div>
    </div>
  )
}

export default BrandThemesExample`}
          height="700px"
        />
      </section>

      <section className="docs-section">
        <h2>Method 5: Dark Mode</h2>
        <p>
          Implement dark mode with automatic system preference detection.
        </p>

        <LiveDemo
          title="Dark Mode Support"
          code={`import { ChatWindow } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function DarkModeExample() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(prefersDark)

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const lightTheme = {
    '--chat-bg': '#ffffff',
    '--message-bg': '#f3f4f6',
    '--message-own-bg': '#3b82f6',
    '--message-text': '#1f2937',
    '--message-own-text': '#ffffff',
    '--input-bg': '#ffffff',
    '--input-border': '#d1d5db',
    '--input-focus-border': '#3b82f6'
  }

  const darkTheme = {
    '--chat-bg': '#1f2937',
    '--message-bg': '#374151',
    '--message-own-bg': '#3b82f6',
    '--message-text': '#f9fafb',
    '--message-own-text': '#ffffff',
    '--input-bg': '#374151',
    '--input-border': '#4b5563',
    '--input-focus-border': '#3b82f6'
  }

  const messages = [
    {
      id: '1',
      text: 'This chat supports dark mode!',
      sender: { id: 'user1', name: 'Night Owl' },
      timestamp: new Date(),
      isOwn: false
    },
    {
      id: '2',
      text: 'Toggle to see the difference 🌓',
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date(),
      isOwn: true
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
        >
          {isDark ? '🌙 Dark' : '☀️ Light'} Mode
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Click to toggle theme
        </span>
      </div>

      <div 
        style={isDark ? darkTheme : lightTheme}
        className="h-[500px] transition-colors duration-300"
      >
        <ChatWindow
          messages={messages}
          onSendMessage={(text) => console.log(text)}
          placeholder="Message in any theme..."
        />
      </div>
    </div>
  )
}

export default DarkModeExample`}
          height="700px"
        />
      </section>

      <section className="docs-section">
        <h2>Method 6: Gradient Themes</h2>
        <p>
          Create stunning gradient-based themes for modern, vibrant UIs.
        </p>

        <LiveDemo
          title="Gradient Themes"
          code={`import { ChatWindow } from '@clarity-chat/react'

function GradientThemeExample() {
  const messages = [
    {
      id: '1',
      text: 'Gradients make everything more exciting! 🌈',
      sender: { id: 'user1', name: 'Colorful' },
      timestamp: new Date(),
      isOwn: false
    },
    {
      id: '2',
      text: 'This looks amazing!',
      sender: { id: 'user2', name: 'You' },
      timestamp: new Date(),
      isOwn: true
    },
    {
      id: '3',
      text: 'The gradient background is so smooth',
      sender: { id: 'user1', name: 'Colorful' },
      timestamp: new Date(),
      isOwn: false
    }
  ]

  return (
    <div className="h-[600px] relative rounded-2xl overflow-hidden">
      <style jsx>{\`
        .gradient-chat {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 25%,
            #f093fb 50%,
            #4facfe 75%,
            #00f2fe 100%
          );
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .glass-message {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .own-glass-message {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        
        .glass-input {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }
        
        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .glass-input:focus {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }
      \`}</style>
      
      <div className="gradient-chat h-full p-6">
        <ChatWindow
          messages={messages}
          onSendMessage={(text) => console.log(text)}
          className="h-full"
          messageClassName="text-white"
          ownMessageClassName="own-glass-message"
          otherMessageClassName="glass-message"
          inputClassName="glass-input"
          placeholder="Type a colorful message..."
        />
      </div>
    </div>
  )
}

export default GradientThemeExample`}
          height="700px"
        />
      </section>

      <section className="docs-section">
        <h2>Method 7: Component-Specific Styling</h2>
        <p>
          Style individual message components with custom renderers.
        </p>

        <LiveDemo
          title="Custom Message Styling"
          code={`import { ChatWindow, Message } from '@clarity-chat/react'

function CustomMessageStyling() {
  const messages = [
    {
      id: '1',
      text: 'Check out this custom styling! 🎨',
      sender: { id: 'user1', name: 'Alice', avatar: '👩' },
      timestamp: new Date(Date.now() - 300000),
      isOwn: false,
      type: 'text'
    },
    {
      id: '2',
      text: 'Important announcement!',
      sender: { id: 'system', name: 'System', avatar: '🔔' },
      timestamp: new Date(Date.now() - 200000),
      isOwn: false,
      type: 'system'
    },
    {
      id: '3',
      text: 'I love these custom styles!',
      sender: { id: 'user2', name: 'You', avatar: '😊' },
      timestamp: new Date(Date.now() - 100000),
      isOwn: true,
      type: 'text'
    },
    {
      id: '4',
      text: '⚠️ Warning: Maintenance scheduled for tonight',
      sender: { id: 'system', name: 'System', avatar: '⚙️' },
      timestamp: new Date(),
      isOwn: false,
      type: 'warning'
    }
  ]

  const renderMessage = (message) => {
    const baseClasses = "p-3 rounded-lg mb-2 max-w-[80%]"
    
    const typeStyles = {
      text: message.isOwn 
        ? "bg-blue-500 text-white ml-auto" 
        : "bg-gray-200 dark:bg-gray-700",
      system: "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 w-full max-w-full",
      warning: "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 w-full max-w-full"
    }

    return (
      <div key={message.id} className={\`\${baseClasses} \${typeStyles[message.type]}\`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{message.sender.avatar}</span>
          <span className="font-semibold text-sm">{message.sender.name}</span>
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        <p className="text-sm">{message.text}</p>
      </div>
    )
  }

  return (
    <div className="h-[600px] border rounded-lg overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map(renderMessage)}
        </div>
        <div className="border-t p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

export default CustomMessageStyling`}
          height="700px"
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Theme Context Provider</h3>
        <p>
          Create a theme context to manage themes across your entire application:
        </p>
        <pre><code>{`// theme-context.tsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('default')
  
  const themes = {
    default: { /* default theme values */ },
    dark: { /* dark theme values */ },
    colorful: { /* colorful theme values */ }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      <div style={themes[theme]}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

// Usage
function App() {
  return (
    <ThemeProvider>
      <ChatWindow />
    </ThemeProvider>
  )
}

function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="default">Default</option>
      <option value="dark">Dark</option>
      <option value="colorful">Colorful</option>
    </select>
  )
}`}</code></pre>

        <h3>Dynamic Theme Generation</h3>
        <p>
          Generate themes dynamically based on brand colors:
        </p>
        <pre><code>{`function generateTheme(primaryColor) {
  // Parse the primary color
  const rgb = hexToRgb(primaryColor)
  
  return {
    '--button-primary-bg': primaryColor,
    '--button-primary-hover': darken(primaryColor, 10),
    '--message-own-bg': primaryColor,
    '--input-focus-border': primaryColor,
    '--link-color': primaryColor,
    '--accent-color': primaryColor,
    // Generate complementary colors
    '--accent-light': lighten(primaryColor, 40),
    '--accent-dark': darken(primaryColor, 20),
  }
}

// Usage
const theme = generateTheme('#3b82f6')
<div style={theme}>
  <ChatWindow />
</div>`}</code></pre>

        <h3>CSS-in-JS with Styled Components</h3>
        <p>
          Use styled-components for type-safe, scoped styling:
        </p>
        <pre><code>{`import styled from 'styled-components'
import { ChatWindow } from '@clarity-chat/react'

const StyledChatWindow = styled(ChatWindow)\`
  background: \${props => props.theme.background};
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  
  .message {
    animation: fadeIn 0.3s ease-out;
  }
  
  .message-own {
    background: linear-gradient(
      135deg,
      \${props => props.theme.primary},
      \${props => props.theme.primaryDark}
    );
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
\`

function App() {
  return (
    <ThemeProvider theme={{ primary: '#3b82f6', primaryDark: '#2563eb' }}>
      <StyledChatWindow />
    </ThemeProvider>
  )
}`}</code></pre>

        <h3>Responsive Styling</h3>
        <p>
          Adapt styling based on screen size:
        </p>
        <pre><code>{`const responsiveStyles = {
  // Mobile
  '@media (max-width: 640px)': {
    '--message-max-width': '90%',
    '--font-size': '14px',
    '--padding': '12px',
    '--radius': '12px'
  },
  // Tablet
  '@media (min-width: 641px) and (max-width: 1024px)': {
    '--message-max-width': '70%',
    '--font-size': '15px',
    '--padding': '14px',
    '--radius': '14px'
  },
  // Desktop
  '@media (min-width: 1025px)': {
    '--message-max-width': '60%',
    '--font-size': '16px',
    '--padding': '16px',
    '--radius': '16px'
  }
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <Callout type="tip" title="Use CSS Variables for Themes">
          CSS variables provide the best performance and flexibility. They can be changed
          dynamically without re-rendering components.
        </Callout>

        <Callout type="warning" title="Avoid Inline Styles for Everything">
          While inline styles work, they can't be overridden easily and don't support
          pseudo-classes or media queries. Use them sparingly.
        </Callout>

        <h3>Performance Tips</h3>
        <ul>
          <li>Use CSS variables instead of re-rendering with new props</li>
          <li>Leverage CSS transitions for smooth theme changes</li>
          <li>Minimize inline styles - prefer classes</li>
          <li>Use <code>will-change</code> for animated properties</li>
          <li>Debounce theme changes to avoid flickering</li>
        </ul>

        <h3>Accessibility Considerations</h3>
        <ul>
          <li>Maintain sufficient color contrast (WCAG AA minimum 4.5:1)</li>
          <li>Test dark mode for readability</li>
          <li>Don't rely on color alone to convey information</li>
          <li>Ensure focus states are visible in all themes</li>
          <li>Test with high contrast mode enabled</li>
        </ul>

        <h3>Design Consistency</h3>
        <ul>
          <li>Define a limited color palette (5-7 colors)</li>
          <li>Use consistent spacing scale (8px grid system)</li>
          <li>Maintain border radius consistency</li>
          <li>Use consistent shadow depths</li>
          <li>Create a design system document</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Complete Theme Example</h2>
        <p>
          Here's a production-ready theme configuration:
        </p>
        <pre><code>{`// themes.ts
export const themes = {
  light: {
    // Layout
    '--chat-bg': '#ffffff',
    '--chat-border': '#e5e7eb',
    '--chat-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
    
    // Messages
    '--message-bg': '#f3f4f6',
    '--message-own-bg': '#3b82f6',
    '--message-text': '#1f2937',
    '--message-own-text': '#ffffff',
    '--message-hover-bg': '#e5e7eb',
    '--message-border': 'transparent',
    
    // Input
    '--input-bg': '#ffffff',
    '--input-border': '#d1d5db',
    '--input-focus-border': '#3b82f6',
    '--input-text': '#1f2937',
    '--input-placeholder': '#9ca3af',
    
    // Buttons
    '--button-primary-bg': '#3b82f6',
    '--button-primary-hover': '#2563eb',
    '--button-primary-active': '#1d4ed8',
    '--button-primary-text': '#ffffff',
    
    // Typography
    '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    '--font-size-base': '16px',
    '--font-size-small': '14px',
    '--line-height': '1.5',
    
    // Spacing
    '--spacing-xs': '4px',
    '--spacing-sm': '8px',
    '--spacing-md': '16px',
    '--spacing-lg': '24px',
    '--spacing-xl': '32px',
    
    // Borders
    '--radius-sm': '6px',
    '--radius-md': '12px',
    '--radius-lg': '16px',
    '--radius-full': '9999px',
    
    // Shadows
    '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
    '--shadow-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
    '--shadow-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
    
    // Transitions
    '--transition-fast': '150ms',
    '--transition-base': '300ms',
    '--transition-slow': '500ms',
  },
  
  dark: {
    '--chat-bg': '#1f2937',
    '--chat-border': '#374151',
    '--chat-shadow': '0 4px 6px rgba(0, 0, 0, 0.3)',
    '--message-bg': '#374151',
    '--message-own-bg': '#3b82f6',
    '--message-text': '#f9fafb',
    '--message-own-text': '#ffffff',
    '--message-hover-bg': '#4b5563',
    '--input-bg': '#374151',
    '--input-border': '#4b5563',
    '--input-focus-border': '#3b82f6',
    '--input-text': '#f9fafb',
    '--input-placeholder': '#9ca3af',
    '--button-primary-bg': '#3b82f6',
    '--button-primary-hover': '#2563eb',
    '--button-primary-active': '#1d4ed8',
    // ... rest of dark theme
  }
}

// Apply theme
function applyTheme(themeName) {
  const theme = themes[themeName]
  const root = document.documentElement
  
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/examples/themed-chat" className="docs-card">
            <h3>Themed Chat Example</h3>
            <p>Complete themed chat implementation</p>
          </a>
          <a href="/reference/components/chat-window" className="docs-card">
            <h3>ChatWindow API</h3>
            <p>All styling props and options</p>
          </a>
          <a href="/learn/theming" className="docs-card">
            <h3>Theming Guide</h3>
            <p>Deep dive into theming system</p>
          </a>
          <a href="/examples" className="docs-card">
            <h3>More Examples</h3>
            <p>Explore other implementation patterns</p>
          </a>
        </div>
      </section>

      <section className="docs-section">
        <h2>Summary</h2>
        <p>
          You've learned seven different methods for styling Clarity Chat components:
        </p>
        <ol>
          <li><strong>CSS Variables</strong> - Simple, performant theme customization</li>
          <li><strong>Tailwind Classes</strong> - Rapid development with utility classes</li>
          <li><strong>Custom CSS</strong> - Full control with custom stylesheets</li>
          <li><strong>Brand Themes</strong> - Pre-defined theme presets</li>
          <li><strong>Dark Mode</strong> - System-aware theme switching</li>
          <li><strong>Gradient Themes</strong> - Modern, vibrant designs</li>
          <li><strong>Component Styling</strong> - Custom message rendering</li>
        </ol>
        <p>
          Choose the approach that best fits your project's needs, or combine multiple methods
          for maximum flexibility!
        </p>
      </section>
    </div>
  )
}
