import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { UseChatFlowAnimation } from '@/components/Diagrams/CodeFlowAnimation';
export const metadata = {
    title: 'Tutorial',
    description: 'Build a complete chat application with Clarity Chat UI',
};
export default function TutorialPage() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("h1", { children: "Tutorial: Build a Complete Chat App" }), _jsx("p", { className: "lead", children: "In this hands-on tutorial, you'll build a fully-featured chat application from scratch. You'll learn core concepts, best practices, and advanced patterns." }), _jsx(Callout, { type: "info", children: _jsxs("p", { children: [_jsx("strong", { children: "Time:" }), " ~30 minutes", _jsx("br", {}), _jsx("strong", { children: "Level:" }), " Beginner to Intermediate", _jsx("br", {}), _jsx("strong", { children: "Prerequisites:" }), " Basic React knowledge"] }) }), _jsx("h2", { id: "what-youll-build", children: "What You'll Build" }), _jsx("p", { children: "By the end of this tutorial, you'll have a chat app with:" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Real-time message display" }), _jsx("li", { children: "\u2705 User avatars and timestamps" }), _jsx("li", { children: "\u2705 Typing indicators" }), _jsx("li", { children: "\u2705 Message reactions" }), _jsx("li", { children: "\u2705 File attachments" }), _jsx("li", { children: "\u2705 Dark mode toggle" }), _jsx("li", { children: "\u2705 Custom theming" })] }), _jsx("h2", { id: "setup", children: "Step 1: Project Setup" }), _jsx("p", { children: "Create a new React project with Vite:" }), _jsx(CodeBlock, { code: `# Create new project
npm create vite@latest my-chat-app -- --template react-ts

# Navigate to project
cd my-chat-app

# Install dependencies
npm install

# Install Clarity Chat
npm install @clarity-chat/react`, language: "bash", title: "Terminal" }), _jsx(UseChatFlowAnimation, {}), _jsx("h2", { id: "basic-chat", children: "Step 2: Basic Chat Interface" }), _jsxs("p", { children: ["Replace the contents of ", _jsx("code", { children: "src/App.tsx" }), ":"] }), _jsx(CodeBlock, { code: `import { useState } from 'react'
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

export default App`, language: "tsx", title: "src/App.tsx", showLineNumbers: true }), _jsx("p", { children: "Run your app:" }), _jsx(CodeBlock, { code: "npm run dev", language: "bash" }), _jsx(Callout, { type: "success", children: _jsxs("p", { children: [_jsx("strong", { children: "You did it!" }), " You now have a working chat interface. Let's add more features."] }) }), _jsx("h2", { id: "avatars", children: "Step 3: Add Avatars" }), _jsx("p", { children: "Enhance messages with user avatars:" }), _jsx(CodeBlock, { code: `const [messages, setMessages] = useState<Message[]>([
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
}`, language: "tsx", highlightLines: [7, 8, 9, 10, 18, 19, 20, 21, 30, 31, 32, 33] }), _jsx("h2", { id: "typing-indicator", children: "Step 4: Typing Indicator" }), _jsx("p", { children: "Show when the bot is \"typing\":" }), _jsx(CodeBlock, { code: `import { useState } from 'react'
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
}`, language: "tsx", highlightLines: [2, 6, 18, 20, 21, 35] }), _jsx("h2", { id: "reactions", children: "Step 5: Message Reactions" }), _jsx("p", { children: "Allow users to react to messages:" }), _jsx(CodeBlock, { code: `const handleReaction = (messageId: string, emoji: string) => {
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
)`, language: "tsx" }), _jsx("h2", { id: "dark-mode", children: "Step 6: Dark Mode" }), _jsx("p", { children: "Add theme switching:" }), _jsx(CodeBlock, { code: `import { useState } from 'react'
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
}`, language: "tsx", highlightLines: [2, 5, 8, 11, 12, 13, 20] }), _jsx("h2", { id: "next-steps", children: "What's Next?" }), _jsx("p", { children: "Congratulations! You've built a feature-rich chat application. Here are some ideas to extend it:" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83D\uDD10 Add user authentication" }), _jsx("li", { children: "\uD83D\uDCBE Persist messages to a database" }), _jsx("li", { children: "\uD83D\uDD0C Connect to a WebSocket server for real-time updates" }), _jsx("li", { children: "\uD83D\uDCCE Implement file upload functionality" }), _jsx("li", { children: "\uD83D\uDD0D Add message search" }), _jsx("li", { children: "\uD83C\uDFA8 Create custom themes" }), _jsx("li", { children: "\u2328\uFE0F Add keyboard shortcuts with CommandPalette" })] }), _jsx(Callout, { type: "tip", children: _jsxs("p", { children: ["Check out our ", _jsx("a", { href: "/examples", children: "Examples" }), " section to see these features in action!"] }) }), _jsx("h2", { id: "full-code", children: "Complete Code" }), _jsx("p", { children: "Here's the full implementation:" }), _jsx(CodeBlock, { code: `import { useState } from 'react'
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

export default App`, language: "tsx", title: "src/App.tsx (Complete)", showLineNumbers: true }), _jsx(Pagination, { prev: {
                    title: 'Installation',
                    href: '/learn/installation',
                }, next: {
                    title: 'Core Concepts',
                    href: '/learn/concepts/components',
                } })] }));
}
//# sourceMappingURL=page.js.map