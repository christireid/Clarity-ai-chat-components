import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { TutorialStep } from '@/components/Enhanced/TutorialStep';
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn';
import { UseChatFlowAnimation } from '@/components/Diagrams/CodeFlowAnimation';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Tutorial: Build a Complete Chat App',
    description: 'In this hands-on tutorial, you\'ll build a fully-featured chat application from scratch with real-time messaging, user avatars, typing indicators, and more.',
};
export default function TutorialPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsx(Breadcrumbs, {}), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent", children: "Tutorial: Build a Complete Chat App" }), _jsx("p", { className: "text-xl text-text-secondary leading-relaxed", children: "In this hands-on tutorial, you'll build a fully-featured chat application from scratch. You'll learn core concepts, best practices, and advanced patterns." })] }), _jsx(Callout, { type: "info", className: "mb-8", children: _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("strong", { children: "Time:" }), " ~30 minutes"] }), _jsxs("div", { children: [_jsx("strong", { children: "Level:" }), " Beginner to Intermediate"] }), _jsxs("div", { children: [_jsx("strong", { children: "Prerequisites:" }), " Basic React knowledge"] })] }) }), _jsx(YouWillLearn, { items: [
                    'How to set up a React project with Clarity Chat',
                    'Build a complete chat interface with real-time messaging',
                    'Add user avatars, timestamps, and typing indicators',
                    'Implement message reactions and file attachments',
                    'Create a dark mode toggle and custom theming',
                    'Handle errors and loading states',
                    'Optimize performance for large message lists',
                ] }), _jsxs("div", { id: "what-youll-build", className: "mt-12 mb-8", children: [_jsx("h2", { className: "text-3xl font-bold mb-4", children: "What You'll Build" }), _jsx("p", { className: "text-text-secondary mb-6", children: "By the end of this tutorial, you'll have a production-ready chat app with:" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDCAC" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "Real-time Messaging" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Instant message display with smooth animations" })] }), _jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDC64" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "User Avatars" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Personalized avatars and timestamps" })] }), _jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\u2328\uFE0F" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "Typing Indicators" }), _jsx("p", { className: "text-sm text-secondary", children: "Show when users are typing" })] }), _jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDE0A" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "Message Reactions" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Emoji reactions for messages" })] }), _jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDCCE" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "File Attachments" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Upload and display files" })] }), _jsxs("div", { className: "p-4 rounded-lg bg-bg-secondary border border-border", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83C\uDF19" }), _jsx("h4", { className: "font-semibold text-text-primary mb-1", children: "Dark Mode" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Theme switching with smooth transitions" })] })] })] }), _jsxs(TutorialStep, { step: 1, title: "Project Setup", nextStepHref: "#basic-chat", nextStepTitle: "Basic Chat Interface", children: [_jsx("p", { className: "text-text-secondary mb-4", children: "Create a new React project with Vite and install Clarity Chat:" }), _jsx(EnhancedCodeBlock, { code: `# Create new project
npm create vite@latest my-chat-app -- --template react-ts

# Navigate to project
cd my-chat-app

# Install dependencies
npm install

# Install Clarity Chat
npm install @clarity-chat/react`, language: "bash", filename: "Terminal", showCopyButton: true }), _jsx(Callout, { type: "tip", className: "mt-4", children: _jsxs("p", { children: [_jsx("strong", { children: "Alternative:" }), " You can also use Next.js, Remix, or any other React framework. See the ", _jsx("a", { href: "/learn/installation", className: "text-brand-500 hover:underline", children: "Installation Guide" }), " for framework-specific instructions."] }) })] }), _jsx(UseChatFlowAnimation, {}), _jsxs(TutorialStep, { step: 2, title: "Basic Chat Interface", nextStepHref: "#enhancements", nextStepTitle: "Adding Enhancements", children: [_jsxs("p", { className: "text-text-secondary mb-4", children: ["Replace the contents of ", _jsx("code", { className: "px-1.5 py-0.5 bg-bg-secondary rounded text-sm", children: "src/App.tsx" }), ":"] }), _jsx(EnhancedCodeBlock, { code: `import { useState } from 'react'
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

export default App`, language: "tsx", title: "src/App.tsx", showLineNumbers: true }), _jsx("p", { children: "Run your app:" }), _jsx(EnhancedCodeBlock, { code: "npm run dev", language: "bash" }), _jsx(Callout, { type: "success", children: _jsxs("p", { children: [_jsx("strong", { children: "You did it!" }), " You now have a working chat interface. Let's add more features."] }) })] }), _jsx("h2", { id: "avatars", children: "Step 3: Add Avatars" }), _jsx("p", { children: "Enhance messages with user avatars:" }), _jsx(EnhancedCodeBlock, { code: `const [messages, setMessages] = useState<Message[]>([
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
}`, language: "tsx", highlightLines: [7, 8, 9, 10, 18, 19, 20, 21, 30, 31, 32, 33] }), _jsx("h2", { id: "typing-indicator", children: "Step 4: Typing Indicator" }), _jsx("p", { children: "Show when the bot is \"typing\":" }), _jsx(EnhancedCodeBlock, { code: `import { useState } from 'react'
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
}`, language: "tsx", highlightLines: [2, 6, 18, 20, 21, 35] }), _jsx("h2", { id: "reactions", children: "Step 5: Message Reactions" }), _jsx("p", { children: "Allow users to react to messages:" }), _jsx(EnhancedCodeBlock, { code: `const handleReaction = (messageId: string, emoji: string) => {
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
)`, language: "tsx" }), _jsx("h2", { id: "dark-mode", children: "Step 6: Dark Mode" }), _jsx("p", { children: "Add theme switching:" }), _jsx(EnhancedCodeBlock, { code: `import { useState } from 'react'
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
}`, language: "tsx", highlightLines: [2, 5, 8, 11, 12, 13, 20] }), _jsx("h2", { id: "next-steps", children: "What's Next?" }), _jsx("p", { children: "Congratulations! You've built a feature-rich chat application. Here are some ideas to extend it:" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83D\uDD10 Add user authentication" }), _jsx("li", { children: "\uD83D\uDCBE Persist messages to a database" }), _jsx("li", { children: "\uD83D\uDD0C Connect to a WebSocket server for real-time updates" }), _jsx("li", { children: "\uD83D\uDCCE Implement file upload functionality" }), _jsx("li", { children: "\uD83D\uDD0D Add message search" }), _jsx("li", { children: "\uD83C\uDFA8 Create custom themes" }), _jsx("li", { children: "\u2328\uFE0F Add keyboard shortcuts with CommandPalette" })] }), _jsx(Callout, { type: "tip", children: _jsxs("p", { children: ["Check out our ", _jsx("a", { href: "/examples", children: "Examples" }), " section to see these features in action!"] }) }), _jsx("h2", { id: "full-code", children: "Complete Code" }), _jsx("p", { children: "Here's the full implementation:" }), _jsx(EnhancedCodeBlock, { code: `import { useState } from 'react'
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

export default App`, language: "tsx", title: "src/App.tsx (Complete)", showLineNumbers: true }), _jsx(Pagination, { prev: {
                    title: 'Installation',
                    href: '/learn/installation',
                }, next: {
                    title: 'Core Concepts',
                    href: '/learn/concepts/components',
                } })] }));
}
//# sourceMappingURL=page.js.map